import crypto from "crypto";

import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";

const sendPaymentOrder = (res, payment, status) => res.status(status).json({
  success: true,
  data: {
    payment: {
      id: payment._id,
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
    },
    razorpayOrder: {
      id: payment.providerPaymentId,
      amount: Math.round(payment.amount * 100),
      currency: payment.currency,
    },
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  },
});

export const createPayment = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required",
    });
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  });
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  if (order.orderStatus === "cancelled") {
    return res.status(400).json({
      success: false,
      message: "Cannot pay for a cancelled order",
    });
  }

  if (order.paymentStatus === "paid") {
    return res.status(400).json({
      success: false,
      message: "Order has already been paid",
    });
  }

  // Orders created before inventoryReserved/paymentExpiresAt were added
  // may not have these fields. Treat a fresh pending order as reserved.
  if (order.inventoryReserved === undefined) {
    order.inventoryReserved = true;
  }

  if (!order.inventoryReserved) {
    return res.status(400).json({
      success: false,
      message: "Order inventory is no longer reserved",
    });
  }

  if (!order.paymentExpiresAt) {
    order.paymentExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await order.save();
  }

  if (order.paymentExpiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message:
        "Payment session has expired. Please place the order again.",
    });
  }

  let payment = await Payment.findOne({
    order: order._id,
  });

  if (payment?.status === "paid") {
    return res.status(400).json({
      success: false,
      message: "Payment has already been completed",
    });
  }

  if (payment?.providerPaymentId) {
    return sendPaymentOrder(res, payment, 200);
  }

  let razorpayOrder;

  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: "INR",
      receipt: `order_${order._id}`,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return res.status(502).json({
      success: false,
      message:
        "Unable to connect to Razorpay. Check your Razorpay test credentials and try again.",
    });
  }

  if (payment) {
    await Payment.updateOne(
      { _id: payment._id, providerPaymentId: null },
      { $set: { providerPaymentId: razorpayOrder.id, status: "pending" } },
    );
  } else {
    try {
      await Payment.updateOne(
        { order: order._id },
        { $setOnInsert: {
          user: req.user._id,
          amount: order.total,
          currency: razorpayOrder.currency,
          provider: "razorpay",
          providerPaymentId: razorpayOrder.id,
          status: "pending",
        } },
        { upsert: true },
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }

  payment = await Payment.findOne({ order: order._id });
  return sendPaymentOrder(res, payment, payment.providerPaymentId === razorpayOrder.id ? 201 : 200);
};

const confirmPayment = async (paymentId) => Payment.db.transaction(async (session) => {
  const payment = await Payment.findById(paymentId).session(session);
  const order = await Order.findById(payment.order).session(session);
  if (!order || order.orderStatus === "cancelled") return null;
  if (order.paymentStatus === "paid") return { payment, order };

  payment.status = "paid";
  payment.paidAt = new Date();
  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.paymentExpiresAt = null;
  order.inventoryReserved = true;

  await order.save({ session });
  await payment.save({ session });

  const cart = await Cart.findOne({ user: order.user }).session(session);
  if (cart) {
    const purchased = new Map(order.items.map((item) => [String(item.product), item.quantity]));
    cart.items = cart.items
      .map(({ product, quantity }) => ({
        product,
        quantity: quantity - (purchased.get(String(product)) || 0),
      }))
      .filter((item) => item.quantity > 0);
    await cart.save({ session });
  }

  return { payment, order };
});

export const verifyPayment = async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment verification details are required",
    });
  }

  const payment = await Payment.findOne({
    providerPaymentId: razorpayOrderId,
    user: req.user._id,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment record not found",
    });
  }

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpayOrderId}|${razorpayPaymentId}`
    )
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  const result = await confirmPayment(payment._id);
  if (!result) {
    return res.status(409).json({
      success: false,
      message: "The order is no longer available. Contact client care if you were charged.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: result,
  });
};

export const handleWebhook = async (req, res) => {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    return res.status(503).json({
      success: false,
      message: "Razorpay webhook is not configured",
    });
  }

  const signature = req.headers["x-razorpay-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Webhook signature missing",
    });
  }

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRET
    )
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid webhook signature",
    });
  }

  let event;

  try {
    event = JSON.parse(req.body.toString());
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid webhook payload",
    });
  }

  try {
    if (event.event === "payment.captured") {
      const paymentEntity =
        event.payload.payment.entity;

      const payment = await Payment.findOne({
        providerPaymentId: paymentEntity.order_id,
      });

      if (!payment) {
        return res.status(200).json({
          success: true,
          message: "Payment record not found",
        });
      }

      await confirmPayment(payment._id);
    }

    if (event.event === "payment.failed") {
      const paymentEntity =
        event.payload.payment.entity;

      await Payment.updateOne(
        { providerPaymentId: paymentEntity.order_id, status: { $ne: "paid" } },
        { $set: { status: "failed" } },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error(
      "Webhook processing error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};
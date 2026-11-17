import { createHmac } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
import razorpay from "../config/razorpay.js";
import { createPayment, verifyPayment } from "../controllers/paymentController.js";
import { getProducts } from "../controllers/productController.js";
import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Payment from "../models/payment.js";
import Product from "../models/product.js";

const response = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });

afterEach(() => vi.restoreAllMocks());

it("treats punctuation in a catalog search as literal text", async () => {
  const query = {
    populate: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
  };
  const find = vi.spyOn(Product, "find").mockReturnValue(query);
  vi.spyOn(Product, "countDocuments").mockResolvedValue(0);

  const res = response();
  await getProducts({ query: { search: "  tote [black]+ " } }, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(find.mock.calls[0][0].$or[0].name.$regex).toBe("tote \\[black\\]\\+");
});

it("reuses the gateway order after a payment attempt fails", async () => {
  vi.spyOn(Order, "findOne").mockResolvedValue({
    _id: "order",
    orderStatus: "pending",
    paymentStatus: "failed",
    inventoryReserved: true,
    paymentExpiresAt: new Date(Date.now() + 60_000),
  });
  vi.spyOn(Payment, "findOne").mockResolvedValue({
    _id: "payment",
    status: "failed",
    amount: 2400,
    currency: "INR",
    provider: "razorpay",
    providerPaymentId: "order_existing",
  });
  const gateway = vi.spyOn(razorpay.orders, "create").mockResolvedValue({});
  const res = response();

  await createPayment({ body: { orderId: "order" }, user: { _id: "customer" } }, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json.mock.calls[0][0].data.razorpayOrder).toEqual({
    id: "order_existing",
    currency: "INR",
    amount: 240000,
  });
  expect(gateway).not.toHaveBeenCalled();
});

it("leaves the reservation untouched if the checkout signature is invalid", async () => {
  const save = vi.fn();
  vi.spyOn(Payment, "findOne").mockResolvedValue({ _id: "payment", status: "pending", save });
  const res = response();

  await verifyPayment({
    body: {
      razorpayOrderId: "order_existing",
      razorpayPaymentId: "gateway_payment",
      razorpaySignature: "incorrect",
    },
    user: { _id: "customer" },
  }, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(save).not.toHaveBeenCalled();
});

it("confirms payment once and keeps additions in the bag", async () => {
  const session = {};
  const payment = { _id: "payment", order: "order", status: "pending", save: vi.fn() };
  const order = {
    user: "customer",
    orderStatus: "pending",
    paymentStatus: "pending",
    items: [{ product: "purchased", quantity: 1 }],
    save: vi.fn(),
  };
  const cart = {
    items: [{ product: "purchased", quantity: 2 }, { product: "added", quantity: 1 }],
    save: vi.fn(),
  };
  const inTransaction = (result) => ({ session: vi.fn().mockResolvedValue(result) });
  vi.spyOn(Payment.db, "transaction").mockImplementation((callback) => callback(session));
  vi.spyOn(Payment, "findOne").mockResolvedValue(payment);
  vi.spyOn(Payment, "findById").mockReturnValue(inTransaction(payment));
  vi.spyOn(Order, "findById").mockReturnValue(inTransaction(order));
  vi.spyOn(Cart, "findOne").mockReturnValue(inTransaction(cart));

  const razorpayOrderId = "order_existing";
  const razorpayPaymentId = "gateway_payment";
  const razorpaySignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  const request = {
    body: { razorpayOrderId, razorpayPaymentId, razorpaySignature },
    user: { _id: "customer" },
  };
  const res = response();

  await verifyPayment(request, res);
  await verifyPayment(request, res);

  expect(res.status.mock.calls).toEqual([[200], [200]]);
  expect(order.orderStatus).toBe("confirmed");
  expect(cart.items).toEqual([{ product: "purchased", quantity: 1 }, { product: "added", quantity: 1 }]);
  expect(cart.save).toHaveBeenCalledExactlyOnceWith({ session });
});

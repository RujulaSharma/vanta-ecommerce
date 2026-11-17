import Order from "../models/order.js";
import Product from "../models/product.js";

export const cleanupExpiredOrders = async () => {
  try {
    const expired = {
      paymentStatus: { $in: ["pending", "failed"] },
      orderStatus: "pending",
      inventoryReserved: true,
      paymentExpiresAt: { $lte: new Date() },
    };
    const orders = await Order.find(expired).select("_id").lean();

    for (const { _id } of orders) {
      await Order.db.transaction(async (session) => {
        const order = await Order.findOneAndUpdate(
          { _id, ...expired },
          { inventoryReserved: false, paymentExpiresAt: null, orderStatus: "cancelled" },
          { session },
        );
        if (!order) return;

        for (const item of order.items) {
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
            { session },
          );
        }
      });
    }
  } catch (error) {
    console.error("Order cleanup error:", error);
  }
};

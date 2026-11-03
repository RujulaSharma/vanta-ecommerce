import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import orderService from "../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        if (!cancelled) {
          setOrder(data.data?.order || data.order);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load this order."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8 bg-[var(--vanta-bg)] text-[var(--vanta-text)]">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-56 rounded-xl bg-[var(--vanta-soft)]" />
          <div className="h-32 rounded-2xl bg-[var(--vanta-soft)]" />
          <div className="h-64 rounded-2xl bg-[var(--vanta-soft)]" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-20 text-center lg:px-8 bg-[var(--vanta-bg)] text-[var(--vanta-text)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vanta-accent)]">
          VANTA ORDERS
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold">
          Order Unavailable
        </h1>

        <p className="mt-3 text-sm text-[var(--vanta-muted)]">
          {error || "We couldn't locate this order in your account."}
        </p>

        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--vanta-text)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--vanta-bg)] shadow-md transition hover:opacity-90"
        >
          <ArrowLeft size={15} />
          <span>Continue Shopping</span>
        </Link>
      </main>
    );
  }

  const status = order.orderStatus || "placed";

  const getStatusBadge = () => {
    switch (status) {
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "shipped":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "confirmed":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
  };

  const canCancel =
    order.orderStatus === "placed" || order.orderStatus === "pending";

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(order._id);

      setOrder((currentOrder) => ({
        ...currentOrder,
        orderStatus: "cancelled",
        inventoryReserved: false,
        paymentExpiresAt: null,
      }));

      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-10 lg:px-8 lg:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        {/* Back navigation */}
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--vanta-muted)] transition hover:text-[var(--vanta-text)]"
        >
          <ArrowLeft size={14} />
          <span>Back to All Orders</span>
        </Link>

        {/* Order Header Card */}
        <div className="mt-8 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--vanta-border)] pb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vanta-accent)]">
                ORDER DETAILS
              </p>

              <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold">
                Order #{order.orderNumber || order._id.slice(-8)}
              </h1>

              <p className="mt-1 text-xs text-[var(--vanta-muted)]">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider ${getStatusBadge()}`}
              >
                {status}
              </span>

              <span className="rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--vanta-text)]">
                Payment: {order.paymentStatus || "pending"}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase text-[var(--vanta-muted)]">
                Items Count
              </p>
              <p className="mt-1 font-semibold text-sm">
                {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase text-[var(--vanta-muted)]">
                Shipping Method
              </p>
              <p className="mt-1 font-semibold text-sm">
                Express White-Glove
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase text-[var(--vanta-muted)]">
                Total Amount
              </p>
              <p className="mt-1 font-bold text-sm text-[var(--vanta-text)]">
                ₹{Number(order.total || 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase text-[var(--vanta-muted)]">
                Tracking Updates
              </p>
              <p className="mt-1 font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                Email & SMS Active
              </p>
            </div>
          </div>
        </div>

        {/* Content Columns: Items & Sidebar */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Order Items */}
          <section className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-[var(--vanta-border)] pb-4">
              <Package size={18} className="text-[var(--vanta-accent)]" />

              <h2 className="font-serif text-xl sm:text-2xl font-semibold">
                Ordered Items
              </h2>
            </div>

            <div className="divide-y divide-[var(--vanta-border)]/60">
              {order.items?.map((item, index) => (
                <div
                  key={item._id || `${order._id}-${index}`}
                  className="flex items-center gap-4 py-5"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-bold tracking-widest text-[var(--vanta-muted)]">
                        VANTA
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs sm:text-sm font-semibold text-[var(--vanta-text)]">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-[var(--vanta-muted)]">
                      Quantity: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1.5 text-xs sm:text-sm font-bold text-[var(--vanta-text)]">
                      ₹{Number(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar Summary & Address */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <aside className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-[var(--vanta-text)]">
                Payment Summary
              </h2>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex justify-between text-[var(--vanta-muted)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--vanta-text)]">
                    ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-[var(--vanta-muted)]">
                  <span>Express Shipping</span>
                  <span className="font-semibold text-[var(--vanta-text)]">
                    {Number(order.shippingFee || 0) === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        Free
                      </span>
                    ) : (
                      `₹${Number(order.shippingFee || 0).toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-[var(--vanta-border)] pt-3 text-sm sm:text-base font-bold text-[var(--vanta-text)]">
                  <span>Total Paid</span>
                  <span>₹{Number(order.total || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </aside>

            {/* Delivery Address */}
            {order.shippingAddress && (
              <aside className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vanta-accent)]">
                  DELIVERY DESTINATION
                </p>

                <p className="mt-3 text-sm font-semibold text-[var(--vanta-text)]">
                  {order.shippingAddress.name}
                </p>

                <p className="mt-1.5 text-xs leading-relaxed text-[var(--vanta-muted)]">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>

                <p className="mt-2 text-xs font-medium text-[var(--vanta-text)]">
                  Phone: {order.shippingAddress.phone}
                </p>
              </aside>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 flex flex-wrap items-center gap-3.5 border-t border-[var(--vanta-border)] pt-6">
          {canCancel && (
            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-6 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AlertTriangle size={15} />
              <span>{cancelling ? "Cancelling Order..." : "Cancel Order"}</span>
            </button>
          )}

          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--vanta-text)] px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--vanta-bg)] shadow-md transition hover:opacity-90"
          >
            Explore Catalog
          </Link>

          <Link
            to="/account/orders"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
          >
            All Orders
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ArrowRight,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import orderService from "../services/orderService";
import useAuthStore from "../store/authStore";

const formatPrice = (price) => {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusStyles = {
  placed: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

const paymentStyles = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  failed: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  refunded: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/30",
};

const canCancelOrder = (status) => {
  return status === "placed" || status === "confirmed";
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        if (!cancelled) {
          setOrders(data.data?.orders || []);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error.response?.data?.message || "Unable to load your orders"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    try {
      setCancellingId(orderId);
      const data = await orderService.cancelOrder(orderId);

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: data.data?.order?.orderStatus || "cancelled",
              }
            : order
        )
      );

      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to cancel order"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-16 flex items-center justify-center">
        <div className="mx-auto max-w-md text-center rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-8 shadow-xs">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--vanta-soft)] text-[var(--vanta-accent)]">
            <Package size={24} />
          </div>

          <h1 className="font-serif text-3xl font-semibold">Your Orders</h1>

          <p className="mt-2 text-xs sm:text-sm text-[var(--vanta-muted)]">
            Please sign in to view your order history and live dispatch updates.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-[var(--vanta-text)] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--vanta-bg)] shadow-md transition hover:opacity-90"
          >
            Sign In Now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-12 transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="border-b border-[var(--vanta-border)] pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vanta-accent)]">
            VANTA ACCOUNT
          </p>

          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold">
            Your Orders
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-[var(--vanta-muted)]">
            View and track your handcrafted luxury pieces.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl bg-[var(--vanta-soft)]"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */
          <div className="mt-10 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-6 py-16 text-center shadow-xs">
            <Package
              size={42}
              strokeWidth={1.5}
              className="mx-auto text-[var(--vanta-muted)]"
            />

            <h2 className="mt-5 font-serif text-2xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-[var(--vanta-muted)]">
              Your purchases will appear here once you place an order.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--vanta-text)] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--vanta-bg)] shadow-md transition hover:opacity-90"
            >
              <span>Explore Collection</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] shadow-xs transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-[var(--vanta-border)] bg-[var(--vanta-soft)]/40 px-6 py-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--vanta-accent)]">
                        ORDER
                      </span>
                      <span className="font-mono text-xs font-semibold text-[var(--vanta-text)]">
                        #{order._id.slice(-8)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] text-[var(--vanta-muted)]">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        statusStyles[order.orderStatus] || ""
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    <span
                      className={`rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        paymentStyles[order.paymentStatus] || ""
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-[var(--vanta-border)]/50">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[9px] font-bold tracking-widest text-[var(--vanta-muted)]">
                            VANTA
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs sm:text-sm font-semibold text-[var(--vanta-text)]">
                          {item.name}
                        </p>

                        <p className="mt-0.5 text-[11px] text-[var(--vanta-muted)]">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-xs font-bold text-[var(--vanta-text)]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col justify-between gap-4 border-t border-[var(--vanta-border)] bg-[var(--vanta-soft)]/20 px-6 py-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[11px] text-[var(--vanta-muted)]">
                      {order.items?.length || 0}{" "}
                      {order.items?.length === 1 ? "item" : "items"}
                    </p>

                    <p className="mt-0.5 text-base sm:text-lg font-bold text-[var(--vanta-text)]">
                      Total: {formatPrice(order.total)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {canCancelOrder(order.orderStatus) && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        <span>
                          {cancellingId === order._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </span>
                      </button>
                    )}

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--vanta-text)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-bg)] shadow-xs transition hover:opacity-90"
                    >
                      <span>View Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;

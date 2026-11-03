import { useEffect, useState } from "react";
import { ArrowRight, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";

import AdminHeader from "../../components/admin/AdminHeader";
import { formatCurrency, formatDate } from "../../utils/admin";
import { ORDER_STATUS_STYLES, PAYMENT_STATUS_STYLES } from "../../utils/orderStatus";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await orderService.getAllOrders();

      setOrders(data.data?.orders || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="min-h-[70vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-10 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">

        <AdminHeader
          title="Orders"
          description="Manage customer orders and fulfillment."
        >
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--vanta-text)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-bg)] shadow-xs transition hover:opacity-90 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </AdminHeader>

        {/* Content */}

        {loading ? (
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-[var(--vanta-soft)]"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-6 py-16 text-center shadow-xs">
            <ShoppingBag
              size={42}
              className="mx-auto text-[var(--vanta-muted)]"
            />

            <h2 className="mt-5 font-serif text-2xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 text-xs text-[var(--vanta-muted)]">
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] shadow-xs">

            {/* Desktop heading */}

            <div className="hidden grid-cols-[1.2fr_1.3fr_1fr_1fr_0.8fr] border-b border-[var(--vanta-border)] bg-[var(--vanta-soft)] px-6 py-3.5 text-[10px] font-bold tracking-[0.15em] text-[var(--vanta-muted)] lg:grid">
              <span>ORDER</span>
              <span>CUSTOMER</span>
              <span>STATUS</span>
              <span>PAYMENT</span>
              <span>TOTAL</span>
            </div>

            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="block border-b border-[var(--vanta-border)] px-6 py-5 last:border-b-0 transition-colors hover:bg-[var(--vanta-soft)]/50"
              >
                <div className="grid gap-5 lg:grid-cols-[1.2fr_1.3fr_1fr_1fr_0.8fr] lg:items-center">

                  {/* Order */}

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-[var(--vanta-muted)]">
                      ORDER
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[var(--vanta-text)]">
                      #{order._id.slice(-8)}
                    </p>

                    <p className="mt-1 text-xs text-[var(--vanta-muted)]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Customer */}

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-[var(--vanta-muted)] lg:hidden">
                      CUSTOMER
                    </p>

                    <p className="mt-1 text-sm font-medium text-[var(--vanta-text)]">
                      {order.user?.name ||
                        "Unknown customer"}
                    </p>

                    <p className="mt-1 break-all text-xs text-[var(--vanta-muted)]">
                      {order.user?.email || "No email"}
                    </p>
                  </div>

                  {/* Order Status */}

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-[var(--vanta-muted)] lg:hidden">
                      ORDER STATUS
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        ORDER_STATUS_STYLES[
                          order.orderStatus
                        ] || ""
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Payment */}

                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-[var(--vanta-muted)] lg:hidden">
                      PAYMENT
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        PAYMENT_STATUS_STYLES[
                          order.paymentStatus
                        ] || ""
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* Total */}

                  <div className="flex items-center justify-between lg:block">
                    <div>
                      <p className="text-xs font-bold tracking-[0.15em] text-[var(--vanta-muted)] lg:hidden">
                        TOTAL
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[var(--vanta-text)]">
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-[var(--vanta-muted)] lg:hidden"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrders;
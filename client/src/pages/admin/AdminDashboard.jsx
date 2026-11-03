import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  IndianRupee,
  Package,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";
import productService from "../../services/productService";
import useAuthStore from "../../store/authStore";
import AdminHeader from "../../components/admin/AdminHeader";
import { formatCurrency, formatDate } from "../../utils/admin";

const AdminDashboard = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const user = useAuthStore((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [ordersData, productsData] =
          await Promise.all([
            orderService.getAllOrders(),
            productService.getProducts({
              page: 1,
              limit: 100,
            }),
          ]);

        setOrders(
          ordersData.data?.orders || []
        );

        setProducts(
          productsData.data?.products || []
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const paidOrders = orders.filter(
      (order) =>
        order.paymentStatus === "paid"
    );

    const pendingOrders = orders.filter(
      (order) =>
        order.orderStatus === "pending"
    );

    const revenue = paidOrders.reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    );

    const lowStockProducts =
      products.filter(
        (product) =>
          product.stock <= 5
      );

    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      revenue,
      totalProducts: products.length,
      lowStockProducts:
        lowStockProducts.length,
    };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 5);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-16 flex items-center justify-center">
        <div className="mx-auto max-w-md text-center rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-8 shadow-xs">
          <h1 className="font-serif text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-xs text-[var(--vanta-muted)]">Please sign in to access the administrator controls.</p>
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-[var(--vanta-text)] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--vanta-bg)] shadow-md transition hover:opacity-90"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-10 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          title="Dashboard"
          description={`Welcome back, ${user?.name || "Administrator"}.`}
        >
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
          >
            <span>Orders</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--vanta-text)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-bg)] shadow-xs transition hover:opacity-90"
          >
            <span>Manage Products</span>
            <ArrowRight size={14} />
          </Link>
        </AdminHeader>

        {/* Loading */}
        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-[var(--vanta-soft)]"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Primary KPI Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--vanta-muted)]">
                    TOTAL REVENUE
                  </p>
                  <IndianRupee size={18} className="text-[var(--vanta-accent)]" />
                </div>
                <p className="mt-4 text-3xl font-serif font-bold text-[var(--vanta-text)]">
                  {formatCurrency(stats.revenue)}
                </p>
                <p className="mt-1 text-[11px] text-[var(--vanta-muted)]">Verified paid transactions</p>
              </div>

              <div className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--vanta-muted)]">
                    LIFETIME ORDERS
                  </p>
                  <ShoppingBag size={18} className="text-[var(--vanta-accent)]" />
                </div>
                <p className="mt-4 text-3xl font-serif font-bold text-[var(--vanta-text)]">
                  {stats.totalOrders}
                </p>
                <p className="mt-1 text-[11px] text-[var(--vanta-muted)]">{stats.paidOrders} paid shipments</p>
              </div>

              <div className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--vanta-muted)]">
                    CATALOG ITEMS
                  </p>
                  <Box size={18} className="text-[var(--vanta-accent)]" />
                </div>
                <p className="mt-4 text-3xl font-serif font-bold text-[var(--vanta-text)]">
                  {stats.totalProducts}
                </p>
                <p className="mt-1 text-[11px] text-[var(--vanta-muted)]">Active store products</p>
              </div>

              <div className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--vanta-muted)]">
                    ACTION REQUIRED
                  </p>
                  <AlertTriangle size={18} className="text-amber-500" />
                </div>
                <p className="mt-4 text-3xl font-serif font-bold text-[var(--vanta-text)]">
                  {stats.pendingOrders + stats.lowStockProducts}
                </p>
                <p className="mt-1 text-[11px] text-[var(--vanta-muted)]">
                  {stats.pendingOrders} pending · {stats.lowStockProducts} low stock
                </p>
              </div>
            </div>

            {/* Secondary stats */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-5 shadow-xs flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--vanta-soft)] text-[var(--vanta-accent)]">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--vanta-muted)]">
                    UNFULFILLED ORDERS
                  </p>
                  <p className="mt-0.5 text-2xl font-bold font-serif text-[var(--vanta-text)]">
                    {stats.pendingOrders}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-5 shadow-xs flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--vanta-muted)]">
                    LOW STOCK ALERTS
                  </p>
                  <p className="mt-0.5 text-2xl font-bold font-serif text-[var(--vanta-text)]">
                    {stats.lowStockProducts}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <section className="mt-10">
              <div className="flex items-center justify-between border-b border-[var(--vanta-border)] pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vanta-accent)]">
                    ACTIVITY
                  </p>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[var(--vanta-text)]">
                    Recent Orders
                  </h2>
                </div>

                <Link
                  to="/admin/orders"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-text)] hover:text-[var(--vanta-accent)] transition"
                >
                  <span>View All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-6 py-12 text-center shadow-xs">
                  <ShoppingBag size={35} className="mx-auto text-[var(--vanta-muted)]" />
                  <p className="mt-3 text-xs text-[var(--vanta-muted)]">No orders recorded yet.</p>
                </div>
              ) : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] shadow-xs">
                  <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr] border-b border-[var(--vanta-border)] bg-[var(--vanta-soft)]/50 px-6 py-3.5 text-[10px] font-bold tracking-[0.15em] text-[var(--vanta-muted)] md:grid">
                    <span>ORDER</span>
                    <span>CUSTOMER</span>
                    <span>STATUS</span>
                    <span>TOTAL</span>
                  </div>

                  {recentOrders.map((order) => (
                    <Link
                      key={order._id}
                      to={`/admin/orders/${order._id}`}
                      className="grid gap-3 border-b border-[var(--vanta-border)]/50 px-6 py-4.5 transition last:border-b-0 hover:bg-[var(--vanta-soft)]/30 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:items-center text-xs"
                    >
                      <div>
                        <p className="font-semibold text-xs text-[var(--vanta-text)]">
                          #{order._id.slice(-8)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--vanta-muted)]">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-[var(--vanta-text)]">
                          {order.user?.name || "Customer"}
                        </p>
                        <p className="text-[11px] text-[var(--vanta-muted)] truncate max-w-[180px]">
                          {order.user?.email || ""}
                        </p>
                      </div>

                      <div>
                        <span className="inline-flex rounded-lg border border-[var(--vanta-border)] bg-[var(--vanta-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--vanta-text)]">
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between md:justify-start md:gap-3">
                        <p className="font-bold text-xs text-[var(--vanta-text)]">
                          {formatCurrency(order.total)}
                        </p>
                        <ArrowRight size={13} className="text-[var(--vanta-muted)]" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Quick Actions */}
            <section className="mt-8 grid gap-4 md:grid-cols-2">
              <Link
                to="/admin/orders"
                className="group rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs transition hover:border-[var(--vanta-text)]/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vanta-soft)] text-[var(--vanta-text)]">
                    <ShoppingBag size={20} />
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-[var(--vanta-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--vanta-text)]"
                  />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-[var(--vanta-text)]">
                  Manage Orders
                </h3>
                <p className="mt-1.5 text-xs text-[var(--vanta-muted)]">
                  Review customer orders, update tracking and fulfillment status.
                </p>
              </Link>

              <Link
                to="/admin/products"
                className="group rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs transition hover:border-[var(--vanta-text)]/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vanta-soft)] text-[var(--vanta-text)]">
                    <Box size={20} />
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-[var(--vanta-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--vanta-text)]"
                  />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-[var(--vanta-text)]">
                  Manage Products
                </h3>
                <p className="mt-1.5 text-xs text-[var(--vanta-muted)]">
                  Add products, update inventory levels, and manage catalog visibility.
                </p>
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
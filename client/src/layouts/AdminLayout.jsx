import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const navItems = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: Package,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to logout");
    }
  };

  return (
    <div className="vanta-admin-shell min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)] transition-colors duration-200">
      {/* Admin Header */}
      <header className="border-b border-[var(--vanta-border)] bg-[var(--vanta-surface)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3.5">
          {/* Logo */}
          <Link
            to="/admin"
            className="shrink-0 flex items-center font-serif text-2xl font-bold tracking-[0.16em] text-[var(--vanta-text)]"
          >
            <span>VANTA</span>
            <span className="ml-2 rounded-md bg-[var(--vanta-accent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-black">
              ADMIN
            </span>
          </Link>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs sm:text-sm font-semibold text-[var(--vanta-text)]">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[11px] text-[var(--vanta-muted)] truncate max-w-[200px]">
                {user?.email || ""}
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)] px-3.5 py-2 text-xs font-semibold text-[var(--vanta-text)] transition hover:border-[var(--vanta-text)]"
            >
              <Store size={15} />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 transition hover:bg-rose-100 dark:hover:bg-rose-900/50"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Admin Navigation Tab Row */}
      <nav className="border-b border-[var(--vanta-border)] bg-[var(--vanta-surface)]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition ${
                    isActive
                      ? "bg-[var(--vanta-text)] text-[var(--vanta-bg)] shadow-xs"
                      : "text-[var(--vanta-muted)] hover:bg-[var(--vanta-soft)] hover:text-[var(--vanta-text)]"
                  }`
                }
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Admin Content Area */}
      <div className="mx-auto max-w-7xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

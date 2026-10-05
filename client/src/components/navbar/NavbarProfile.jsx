import { Link } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Sun,
  Moon,
  UserRound,
} from "lucide-react";

const NavbarProfile = ({
  user,
  isAuthenticated,
  profileOpen,
  setProfileOpen,
  theme,
  setTheme,
  wishlistCount,
  cartCount,
  handleLogout,
  openAuth,
}) => (
  <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
    {/* Theme Toggle */}
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
      onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
    </button>

    {/* Wishlist Icon with Counter */}
    <Link
      to="/wishlist"
      aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ""}`}
      title="Wishlist"
      className="relative flex items-center gap-2 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-3 py-2 text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
    >
      <Heart size={18} strokeWidth={1.8} />
      <span className="hidden xl:inline text-xs font-semibold">Wishlist</span>
      {wishlistCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--vanta-text)] px-1.5 text-[10px] font-bold leading-none text-[var(--vanta-bg)]">
          {wishlistCount > 99 ? "99+" : wishlistCount}
        </span>
      )}
    </Link>

    {/* Shopping Bag / Cart */}
    <Link
      to="/cart"
      aria-label="Shopping Cart"
      title="Shopping Cart"
      className="relative flex items-center gap-2 rounded-xl bg-[var(--vanta-dark)] text-white dark:bg-white dark:text-stone-900 px-3.5 py-2 transition hover:opacity-90"
    >
      <ShoppingBag size={18} strokeWidth={1.8} />
      <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.06em]">Cart</span>
      {cartCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--vanta-accent)] px-1.5 text-[10px] font-bold text-black">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>

    {/* User Profile / Auth */}
    {isAuthenticated ? (
      <div className="relative">
        <button
          type="button"
          onClick={() => setProfileOpen((current) => !current)}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          className="flex h-10 items-center gap-2 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-3 text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--vanta-soft)] text-xs font-bold uppercase text-[var(--vanta-text)]">
            {user?.name?.[0] || "U"}
          </span>
          <span className="hidden md:inline text-xs font-semibold max-w-[90px] truncate text-left">
            {user?.name?.split(" ")[0] || "Account"}
          </span>
          <ChevronDown
            size={13}
            strokeWidth={1.8}
            className={`text-[var(--vanta-muted)] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
          />
        </button>

        {profileOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="border-b border-[var(--vanta-border)] px-4 py-3 bg-[var(--vanta-soft)]/50 rounded-xl mb-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--vanta-muted)]">Signed in as</p>
              <p className="mt-1 truncate text-sm font-semibold text-[var(--vanta-text)]">{user?.name || "Customer"}</p>
              {user?.email && <p className="truncate text-xs text-[var(--vanta-muted)]">{user.email}</p>}
            </div>

            <div className="space-y-0.5 pt-1">
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
                >
                  <LayoutDashboard size={15} strokeWidth={1.8} className="text-[var(--vanta-accent)]" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <Link
                to="/account"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
              >
                <UserRound size={15} strokeWidth={1.8} />
                <span>My Profile</span>
              </Link>

              <Link
                to="/account/orders"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
              >
                <Package size={15} strokeWidth={1.8} />
                <span>My Orders</span>
              </Link>

              <Link
                to="/account/addresses"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
              >
                <MapPin size={15} strokeWidth={1.8} />
                <span>Saved Addresses</span>
              </Link>

              <div className="my-1 border-t border-[var(--vanta-border)]" />

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <LogOut size={15} strokeWidth={1.8} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => openAuth("login")}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-3.5 text-xs font-semibold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
        >
          <UserRound size={16} strokeWidth={1.8} />
          <span>Sign In</span>
        </button>
      </div>
    )}
  </div>
);

export default NavbarProfile;

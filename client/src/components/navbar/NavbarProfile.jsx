import { Link } from "react-router-dom";
import {
  ChevronDown,
  Gift,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Moon,
  Package,
  ShoppingBag,
  Sun,
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
  <div className="flex items-center gap-1 sm:gap-2 xl:gap-3 shrink-0">
    {/* 1. BOUTIQUES / STORES */}
    <Link
      to="/about"
      className="group flex flex-col items-center justify-center px-2 py-1 text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
      title="Our Boutiques"
      aria-label="Our Boutiques"
    >
      <MapPin size={18} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-medium tracking-wide mt-1 group-hover:text-[var(--vanta-text)] transition hidden sm:inline">
        Boutiques
      </span>
    </Link>

    {/* 2. OFFERS */}
    <Link
      to="/products"
      className="group flex flex-col items-center justify-center px-2 py-1 text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
      title="Curated Offers"
      aria-label="Curated Offers"
    >
      <Gift size={18} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-medium tracking-wide mt-1 group-hover:text-[var(--vanta-text)] transition hidden sm:inline">
        Offers
      </span>
    </Link>

    {/* 3. WISHLIST */}
    <Link
      to="/wishlist"
      aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} saved` : ""}`}
      title="Wishlist"
      className="group relative flex flex-col items-center justify-center px-2 py-1 text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
    >
      <div className="relative">
        <Heart size={18} strokeWidth={1.8} className="group-hover:scale-110 transition-transform text-[var(--vanta-text)]" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--vanta-text)] px-1 text-[9px] font-bold text-[var(--vanta-bg)] shadow-xs">
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium tracking-wide mt-1 text-[var(--vanta-muted)] group-hover:text-[var(--vanta-text)] transition hidden sm:inline">
        Wishlist
      </span>
    </Link>

    {/* 4. SHOPPING BAG / CART */}
    <Link
      to="/cart"
      aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
      title="Shopping Cart"
      className="group relative flex flex-col items-center justify-center px-2 py-1 text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
    >
      <div className="relative">
        <ShoppingBag size={18} strokeWidth={1.8} className="group-hover:scale-110 transition-transform text-[var(--vanta-text)]" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--vanta-accent)] px-1 text-[9px] font-bold text-black shadow-xs">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium tracking-wide mt-1 text-[var(--vanta-muted)] group-hover:text-[var(--vanta-text)] transition hidden sm:inline">
        Cart
      </span>
    </Link>

    {/* 5. THEME TOGGLE */}
    <button
      type="button"
      className="group flex flex-col items-center justify-center px-2 py-1 text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
      onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <Sun size={18} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
      ) : (
        <Moon size={18} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
      )}
      <span className="text-[10px] font-medium tracking-wide mt-1 text-[var(--vanta-muted)] group-hover:text-[var(--vanta-text)] transition hidden sm:inline">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>

    {/* 6. PROFILE / AUTHENTICATION */}
    {isAuthenticated ? (
      <div className="relative pl-1">
        <button
          type="button"
          onClick={() => setProfileOpen((current) => !current)}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          className="group flex flex-col items-center justify-center px-2 py-1 text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
        >
          <div className="flex items-center gap-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--vanta-soft)] text-[10px] font-bold uppercase text-[var(--vanta-text)] border border-[var(--vanta-border)]">
              {user?.name?.[0] || "U"}
            </span>
            <ChevronDown
              size={12}
              strokeWidth={1.8}
              className={`text-[var(--vanta-muted)] transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <span className="text-[10px] font-medium tracking-wide mt-1 text-[var(--vanta-muted)] group-hover:text-[var(--vanta-text)] transition hidden sm:inline max-w-[64px] truncate">
            {user?.name?.split(" ")[0] || "Profile"}
          </span>
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
      <button
        type="button"
        onClick={() => openAuth("login")}
        className="group flex flex-col items-center justify-center px-2 py-1 text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
        title="Sign In / Register"
      >
        <UserRound size={18} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-medium tracking-wide mt-1 text-[var(--vanta-muted)] group-hover:text-[var(--vanta-text)] transition hidden sm:inline">
          Profile
        </span>
      </button>
    )}
  </div>
);

export default NavbarProfile;

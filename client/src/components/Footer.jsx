import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] transition-colors duration-200">
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-6">
            <Link
              to="/"
              className="font-serif text-3xl font-semibold tracking-[0.22em] text-[var(--vanta-text)]"
            >
              VANTA
            </Link>

            <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-[var(--vanta-muted)]">
              An independent edit of handbags, clothing, footwear and jewelry.
            </p>


          </div>

          {/* Quick Shop Links */}
          <div className="lg:col-span-3 sm:col-span-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--vanta-muted)]">
              COLLECTIONS
            </h3>
            <nav className="mt-4 flex flex-col gap-2.5 text-xs font-medium text-[var(--vanta-text)]">
              <Link to="/category/bags" className="hover:text-[var(--vanta-accent)] transition">
                Handbags & Totes
              </Link>
              <Link to="/category/dresses" className="hover:text-[var(--vanta-accent)] transition">
                Dresses & Gowns
              </Link>
              <Link to="/category/footwear" className="hover:text-[var(--vanta-accent)] transition">
                Footwear & Heels
              </Link>
              <Link to="/category/jewelry" className="hover:text-[var(--vanta-accent)] transition">
                Fine Jewelry
              </Link>
              <Link to="/category/tops" className="hover:text-[var(--vanta-accent)] transition">
                Tops & Silks
              </Link>
              <Link to="/products?sort=newest" className="hover:text-[var(--vanta-accent)] transition">
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Customer Care & Help */}
          <div className="lg:col-span-3 sm:col-span-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--vanta-muted)]">
              CUSTOMER CARE
            </h3>
            <nav className="mt-4 flex flex-col gap-2.5 text-xs font-medium text-[var(--vanta-text)]">
              <Link to="/account/orders" className="hover:text-[var(--vanta-accent)] transition">
                Track My Order
              </Link>
              <Link to="/account/addresses" className="hover:text-[var(--vanta-accent)] transition">
                Shipping & Addresses
              </Link>
              <Link to="/about" className="hover:text-[var(--vanta-accent)] transition">
                About Vanta
              </Link>
              <a href="mailto:support@vanta.com" className="flex items-center gap-1 hover:text-[var(--vanta-accent)] transition">
                <span>Direct Support</span>
                <ArrowUpRight size={12} />
              </a>
              <Link to="/wishlist" className="hover:text-[var(--vanta-accent)] transition">
                My Wishlist
              </Link>
            </nav>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--vanta-border)] pt-8 text-[11px] text-[var(--vanta-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VANTA</p>


        </div>
      </div>
    </footer>
  );
};

export default Footer;

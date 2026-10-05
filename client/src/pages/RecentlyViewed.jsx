import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import useRecentStore from "../store/recentStore";
import { formatPrice, normalizeImageUrl } from "../utils/productHelpers";

export default function RecentlyViewed() {
  const items = useRecentStore((state) => state.items);

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 text-[var(--vanta-text)] lg:px-8 lg:py-16">
      <div className="border-b border-[var(--vanta-border)] pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--vanta-muted)]">
          BROWSING HISTORY
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Recently Viewed</h1>
        <p className="mt-3 text-sm text-[var(--vanta-muted)]">
          Pieces you explored in your recent visits.
        </p>
      </div>

      {!items.length ? (
        <div className="mt-12 border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-12 text-center">
          <Clock size={40} strokeWidth={1.5} className="mx-auto text-[var(--vanta-muted)]" />
          <h2 className="mt-5 font-serif text-2xl">No history yet</h2>
          <p className="mt-2 text-sm text-[var(--vanta-muted)]">
            Products you explore will automatically appear here.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 bg-[var(--vanta-text)] px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-[var(--vanta-bg)] transition hover:opacity-90"
          >
            Explore Collection
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => {
            const image = normalizeImageUrl(product.images?.[0] || product.image);

            return (
              <article
                key={product._id}
                className="group border border-[var(--vanta-border)] bg-[var(--vanta-surface)] transition hover:shadow-md"
              >
                <Link
                  to={`/products/${product.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-[var(--vanta-soft)]"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-serif text-xl text-[var(--vanta-muted)]">
                      VANTA
                    </div>
                  )}
                </Link>

                <div className="p-5">
                  <Link
                    to={`/products/${product.slug}`}
                    className="block truncate text-sm font-semibold hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-2 text-sm font-medium text-[var(--vanta-text)]">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

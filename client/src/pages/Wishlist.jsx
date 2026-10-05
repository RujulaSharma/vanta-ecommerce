import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartStore";
import { formatPrice, normalizeImageUrl } from "../utils/productHelpers";

export default function Wishlist() {
  const items = useWishlistStore((state) => state.items);
  const remove = useWishlistStore((state) => state.remove);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async (product) => {
    if (product.stock === 0) {
      toast.error("This item is currently out of stock");
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login to add items to your cart");
      } else {
        toast.error(err.response?.data?.message || "Unable to add to cart");
      }
    }
  };

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 text-[var(--vanta-text)] lg:px-8 lg:py-16">
      <div className="border-b border-[var(--vanta-border)] pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--vanta-muted)]">
          SAVED PIECES
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Wishlist</h1>
        <p className="mt-3 text-sm text-[var(--vanta-muted)]">
          {items.length} {items.length === 1 ? "item" : "items"} saved for later.
        </p>
      </div>

      {!items.length ? (
        <div className="mt-12 border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-12 text-center">
          <Heart size={40} strokeWidth={1.5} className="mx-auto text-[var(--vanta-muted)]" />
          <h2 className="mt-5 font-serif text-2xl">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-[var(--vanta-muted)]">
            Explore our collections and save pieces you love.
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
            const isSoldOut = product.stock === 0;

            return (
              <article
                key={product._id}
                className="group flex flex-col justify-between border border-[var(--vanta-border)] bg-[var(--vanta-surface)] transition hover:shadow-md"
              >
                <div>
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
                    {isSoldOut && (
                      <span className="absolute left-3 top-3 bg-black/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                        Sold out
                      </span>
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
                </div>

                <div className="flex items-center justify-between border-t border-[var(--vanta-border)] p-4">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    disabled={isSoldOut}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--vanta-text)] transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ShoppingBag size={14} />
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      remove(product._id);
                      toast.success("Removed from wishlist");
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[var(--vanta-muted)] transition hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

import { Box, AlertTriangle, Edit3, Trash2 } from "lucide-react";

export default function ProductGrid({
  products,
  openEditForm,
  handleStockUpdate,
  handleDeactivate,
}) {
  if (!products.length) {
    return null;
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const lowStock = product.stock <= 5;

        return (
          <article
            key={product._id}
            className="group overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] shadow-xs transition hover:shadow-md"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-[var(--vanta-soft)] overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-bold tracking-[0.2em] text-[var(--vanta-muted)]">
                  VANTA
                </div>
              )}

              {product.isFeatured && (
                <span className="absolute left-3 top-3 rounded-lg bg-[var(--vanta-text)] px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] text-[var(--vanta-bg)] shadow-xs">
                  FEATURED
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-[var(--vanta-text)]">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--vanta-muted)]">
                    SKU: {product.sku}
                  </p>
                </div>

                <p className="text-sm font-semibold text-[var(--vanta-text)]">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-y border-[var(--vanta-border)] py-3">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.15em] text-[var(--vanta-muted)]">
                    STOCK
                  </p>
                  <p
                    className={`mt-0.5 text-sm font-semibold ${
                      lowStock ? "text-red-600" : "text-[var(--vanta-text)]"
                    }`}
                  >
                    {product.stock} units
                  </p>
                </div>

                {lowStock && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                    <AlertTriangle size={13} />
                    LOW STOCK
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(product)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-3 py-2 text-xs font-semibold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
                >
                  <Edit3 size={13} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleStockUpdate(product)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-3 py-2 text-xs font-semibold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
                >
                  <Box size={13} />
                  Stock
                </button>

                <button
                  type="button"
                  onClick={() => handleDeactivate(product)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/10"
                >
                  <Trash2 size={13} />
                  Hide
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

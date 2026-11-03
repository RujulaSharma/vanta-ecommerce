import { ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";

const OrderSummary = ({
  cart,
  subtotal,
  shipping,
  total,
  onPlaceOrder,
  placingOrder,
  disabled,
}) => {
  const items = cart?.items || [];

  return (
    <aside className="lg:sticky lg:top-28 lg:h-fit">
      <div className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-[var(--vanta-border)] pb-4">
          <ShoppingBag size={18} className="text-[var(--vanta-accent)]" />

          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[var(--vanta-text)]">
            Order Summary
          </h2>
        </div>

        <div className="mt-5 max-h-[300px] overflow-y-auto space-y-4 pr-1">
          {items.map((item) => (
            <div
              key={item.product?._id}
              className="flex items-center gap-3.5 border-b border-[var(--vanta-border)]/50 pb-3.5 last:border-b-0 last:pb-0"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]">
                {item.product?.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[8px] font-bold tracking-widest text-[var(--vanta-muted)]">
                    VANTA
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs sm:text-sm font-semibold text-[var(--vanta-text)]">
                  {item.product?.name}
                </p>

                <p className="mt-0.5 text-[11px] text-[var(--vanta-muted)]">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="text-xs sm:text-sm font-bold text-[var(--vanta-text)] shrink-0">
                ₹
                {(
                  Number(item.product?.price || 0) * item.quantity
                ).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        {/* Price Calculations */}
        <div className="mt-6 space-y-2.5 border-t border-[var(--vanta-border)] pt-4 text-xs">
          <div className="flex justify-between text-[var(--vanta-muted)]">
            <span>Subtotal</span>
            <span className="font-semibold text-[var(--vanta-text)]">
              ₹{Number(subtotal || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between text-[var(--vanta-muted)]">
            <span>Express Delivery</span>
            <span className="font-semibold text-[var(--vanta-text)]">
              {shipping === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  Free
                </span>
              ) : (
                `₹${shipping}`
              )}
            </span>
          </div>

          <div className="flex justify-between border-t border-[var(--vanta-border)] pt-3 text-sm sm:text-base font-bold text-[var(--vanta-text)]">
            <span>Total Payable</span>
            <span>₹{Number(total || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Place Order CTA Button */}
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={disabled || placingOrder}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--vanta-dark)] text-white dark:bg-white dark:text-stone-900 py-3.5 text-xs font-bold uppercase tracking-[0.14em] shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span>{placingOrder ? "Processing Order..." : "Confirm & Pay Now"}</span>
          <ArrowRight size={14} />
        </button>

        {disabled && (
          <p className="mt-3 text-center text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Please select or add a shipping address to proceed.
          </p>
        )}

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[var(--vanta-muted)] border-t border-[var(--vanta-border)]/60 pt-4">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;

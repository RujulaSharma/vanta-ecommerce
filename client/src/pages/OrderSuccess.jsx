import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti";
import { m as motion } from "framer-motion";

const OrderSuccess = () => {
  const { orderId } = useParams();

  useEffect(() => {
    // Elegant luxury gold & emerald confetti celebration
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#b69a6d", "#111111", "#10b981", "#d4af37"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#b69a6d", "#111111", "#10b981", "#d4af37"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <main className="min-h-[75vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="mx-auto max-w-xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30 shadow-lg"
        >
          <CheckCircle2 size={42} strokeWidth={2} />
        </motion.div>

        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--vanta-accent)]">
          ORDER CONFIRMED
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
          Thank you for your order.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--vanta-muted)]">
          Your payment was processed successfully. A confirmation receipt and tracking updates have been sent to your email.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 text-left shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--vanta-soft)] text-[var(--vanta-accent)]">
              <Package size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vanta-muted)]">
                CONFIRMATION ORDER ID
              </p>

              <p className="mt-1 break-all text-xs sm:text-sm font-semibold font-mono text-[var(--vanta-text)]">
                {orderId}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col justify-center gap-3.5 sm:flex-row">
          <Link
            to={`/orders/${orderId}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--vanta-text)] px-8 text-xs font-bold uppercase tracking-[0.14em] text-[var(--vanta-bg)] shadow-md transition hover:opacity-90"
          >
            <span>View Order Details</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/products"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-8 text-xs font-bold uppercase tracking-[0.14em] text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)] hover:border-[var(--vanta-text)]"
          >
            <ShoppingBag size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default OrderSuccess;

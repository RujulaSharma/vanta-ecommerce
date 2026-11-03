import { Mail, User } from "lucide-react";

const ContactSection = ({ user }) => {
  return (
    <section className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 sm:p-7 shadow-xs">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vanta-accent)]">
          STEP 1 / CONTACT
        </p>

        <h2 className="mt-1 font-serif text-2xl font-semibold text-[var(--vanta-text)]">
          Account Details
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3.5 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]/60 px-4 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--vanta-surface)] text-[var(--vanta-muted)]">
            <User size={18} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--vanta-muted)]">
              Customer Name
            </p>

            <p className="truncate text-xs sm:text-sm font-semibold text-[var(--vanta-text)] mt-0.5">
              {user?.name || "Customer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]/60 px-4 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--vanta-surface)] text-[var(--vanta-muted)]">
            <Mail size={18} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--vanta-muted)]">
              Email Address
            </p>

            <p className="truncate text-xs sm:text-sm font-semibold text-[var(--vanta-text)] mt-0.5">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

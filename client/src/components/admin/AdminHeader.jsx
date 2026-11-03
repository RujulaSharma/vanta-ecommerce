const AdminHeader = ({ title, description, children }) => (
  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
    <div>
      <p className="text-[10px] font-bold tracking-[0.25em] text-[var(--vanta-muted)] uppercase">
        VANTA ADMIN
      </p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-[var(--vanta-text)]">{title}</h1>
      <p className="mt-1 text-xs text-[var(--vanta-muted)]">{description}</p>
    </div>

    {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
  </div>
);

export default AdminHeader;

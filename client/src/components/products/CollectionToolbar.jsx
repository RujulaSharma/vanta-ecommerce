import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const CollectionToolbar = ({
  count,
  sort,
  setSort,
  setPage,
  hasFilters,
  setShowFilters,
}) => (
  <div className={tw("vanta-collection-toolbar !min-h-[76px] !grid-cols-[minmax(0,1fr)_auto]")}>
    <div className={tw("flex items-center gap-3")}>
      <button
        type="button"
        onClick={() => setShowFilters(true)}
        className={tw("vanta-filter-toggle")}
      >
        <SlidersHorizontal size={15} />
        Filters
        {hasFilters && (
          <span className={tw("ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--vanta-text)] px-1 text-[8px] text-[var(--vanta-bg)]")}>
            •
          </span>
        )}
      </button>
      {count !== null && <p role="status" className="text-xs text-[var(--vanta-muted)]">{count} {count === 1 ? "piece" : "pieces"}</p>}
    </div>

    <div className={tw("vanta-sort-wrap")}>
      <span className="hidden sm:inline">Sort by</span>
      <select
        aria-label="Sort products"
        className="min-h-10 appearance-none border border-[var(--vanta-border)] bg-[var(--vanta-surface)] pl-3 pr-8 text-xs text-[var(--vanta-text)]"
        value={sort}
        onChange={(event) => {
          setSort(event.target.value);
          setPage(1);
        }}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A-Z</option>
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2" />
    </div>
  </div>
);

export default CollectionToolbar;

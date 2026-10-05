import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Search, X, Sparkles, SlidersHorizontal, Tag } from "lucide-react";

const NavbarDesktop = ({
  categories,
  collectionsOpen,
  setCollectionsOpen,
  navSearch,
  setNavSearch,
  navigate,
  closeMobileMenu,
  selectedCategory,
  setSelectedCategory,
}) => {
  const rootCategories = categories.filter((category) => !category.parentCategory);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const value = navSearch.trim();
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    if (selectedCategory) params.set("category", selectedCategory);
    navigate(params.toString() ? `/products?${params.toString()}` : "/products");
  };

  return (
    <div className="hidden lg:flex flex-col w-full">
      {/* MAIN ROW: LOGO | SEARCH | PROFILE */}
      <div className="flex items-center justify-between gap-6 py-4">
        {/* LOGO */}
        <Link
          to="/"
          className="flex flex-col shrink-0 text-[var(--vanta-text)] group"
          onClick={closeMobileMenu}
        >
          <span className="font-serif text-3xl xl:text-4xl font-semibold tracking-[0.22em] leading-none transition group-hover:opacity-90">
            VANTA
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.38em] text-[var(--vanta-muted)] mt-1">
            Luxury & Contemporary
          </span>
        </Link>

        {/* PROMINENT SEARCH BAR */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-[680px] mx-4 relative flex items-center h-12 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] shadow-xs transition focus-within:border-[var(--vanta-text)] focus-within:ring-1 focus-within:ring-[var(--vanta-text)]/20"
        >
          {/* Category Dropdown Prefix */}
          <div className="relative shrink-0 border-r border-[var(--vanta-border)] hidden sm:flex items-center px-3 text-xs text-[var(--vanta-muted)]">
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-transparent pr-5 py-1 text-xs font-medium text-[var(--vanta-text)] outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {rootCategories.map((cat) => (
                <option key={cat.slug || cat.name} value={cat.slug || cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 text-[var(--vanta-muted)]" />
          </div>

          {/* Search Input */}
          <input
            type="search"
            value={navSearch}
            onChange={(event) => setNavSearch(event.target.value)}
            placeholder="Search luxury handbags, dresses, footwear, jewelry..."
            aria-label="Search products"
            className="w-full min-w-0 bg-transparent px-4 text-xs xl:text-sm text-[var(--vanta-text)] outline-none placeholder:text-[var(--vanta-muted)]/70"
          />

          {/* Clear button */}
          {navSearch && (
            <button
              type="button"
              onClick={() => setNavSearch("")}
              className="p-1.5 text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

          {/* Search Submit Button */}
          <button
            type="submit"
            aria-label="Search"
            className="my-1 mr-1.5 flex items-center gap-1.5 rounded-lg bg-[var(--vanta-text)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--vanta-bg)] transition hover:opacity-90 shrink-0"
          >
            <Search size={14} strokeWidth={2} />
            <span className="hidden xl:inline">Search</span>
          </button>
        </form>

        {/* Right side is populated by NavbarProfile */}
      </div>

      {/* CATEGORY & COLLECTION SUB-NAV BAR */}
      <div className="flex items-center justify-between border-t border-[var(--vanta-border)] pt-2.5 pb-2 text-xs font-medium">
        <div className="flex items-center gap-1 xl:gap-2">
          {/* All Categories Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-semibold uppercase tracking-[0.08em] transition ${
                collectionsOpen
                  ? "bg-[var(--vanta-text)] text-[var(--vanta-bg)]"
                  : "bg-[var(--vanta-soft)] text-[var(--vanta-text)] hover:bg-[var(--vanta-border)]"
              }`}
              onClick={() => setCollectionsOpen((current) => !current)}
              aria-expanded={collectionsOpen}
            >
              <SlidersHorizontal size={13} />
              <span>All Collections</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${collectionsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Mega Dropdown Menu */}
            {collectionsOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 flex w-[780px] overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="w-1/3 border-r border-[var(--vanta-border)] pr-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vanta-muted)] mb-3">
                    Categories
                  </p>
                  <div className="space-y-1">
                    {rootCategories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        onClick={() => setCollectionsOpen(false)}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
                      >
                        <span>{category.name}</span>
                        <span className="text-[var(--vanta-muted)]">›</span>
                      </Link>
                    ))}
                    <Link
                      to="/category"
                      onClick={() => setCollectionsOpen(false)}
                      className="mt-2 flex items-center justify-between rounded-lg bg-[var(--vanta-soft)] px-3 py-2 text-xs font-bold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-border)]"
                    >
                      <span>Explore All Categories</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                <div className="w-2/3 pl-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vanta-muted)] mb-3">
                    Popular Collections & Subcategories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories
                      .filter((category) => category.parentCategory)
                      .slice(0, 8)
                      .map((category) => (
                        <Link
                          key={category._id || category.slug}
                          to={`/category/${category.slug}`}
                          onClick={() => setCollectionsOpen(false)}
                          className="flex flex-col rounded-lg p-2.5 transition hover:bg-[var(--vanta-soft)]"
                        >
                          <span className="text-xs font-semibold text-[var(--vanta-text)]">
                            {category.name}
                          </span>
                          <span className="text-[10px] text-[var(--vanta-muted)] mt-0.5 truncate">
                            {category.description ||
                              (typeof category.parentCategory === "object"
                                ? category.parentCategory.name
                                : "Luxury Collection")}
                          </span>
                        </Link>
                      ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]/50 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--vanta-accent)]">
                        Seasonal Highlight
                      </p>
                      <p className="text-sm font-serif font-semibold text-[var(--vanta-text)]">
                        Handcrafted Leather & Silks
                      </p>
                    </div>
                    <Link
                      to="/products?category=bags"
                      onClick={() => setCollectionsOpen(false)}
                      className="rounded-lg bg-[var(--vanta-text)] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--vanta-bg)] transition hover:opacity-90"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Root Links */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-1.5 uppercase tracking-[0.06em] transition ${
                isActive ? "font-bold text-[var(--vanta-text)]" : "text-[var(--vanta-muted)] hover:text-[var(--vanta-text)]"
              }`
            }
          >
            Home
          </NavLink>

          {rootCategories.map((category) => (
            <NavLink
              key={category.slug}
              to={`/category/${category.slug}`}
              className={({ isActive }) =>
                `rounded-lg px-2.5 xl:px-3 py-1.5 uppercase tracking-[0.06em] transition ${
                  isActive ? "font-bold text-[var(--vanta-text)]" : "text-[var(--vanta-muted)] hover:text-[var(--vanta-text)]"
                }`
              }
            >
              {category.name}
            </NavLink>
          ))}

          <NavLink
            to="/products?sort=newest"
            className="flex items-center gap-1 rounded-lg px-2.5 xl:px-3 py-1.5 uppercase tracking-[0.06em] text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
          >
            <Sparkles size={13} className="text-[var(--vanta-accent)]" />
            <span>New Arrivals</span>
          </NavLink>

          <NavLink
            to="/products"
            className="flex items-center gap-1 rounded-lg px-2.5 xl:px-3 py-1.5 uppercase tracking-[0.06em] text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
          >
            <Tag size={13} className="text-emerald-600" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Offers</span>
          </NavLink>
        </div>

        {/* Right side helper info */}
        <div className="hidden xl:flex items-center gap-4 text-[11px] text-[var(--vanta-muted)]">
          <Link to="/about" className="hover:text-[var(--vanta-text)] transition">
            About Us
          </Link>
          <span>•</span>
          <span className="font-medium text-[var(--vanta-text)]">
            Helpline: +91 800 123-VANTA
          </span>
        </div>
      </div>
    </div>
  );
};

export default NavbarDesktop;

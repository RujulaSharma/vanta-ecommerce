import { tw } from "../utils/twStyles.js";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import productService from "../services/productService";
import categoryService from "../services/categoryService";
import useWishlistStore from "../store/wishlistStore";
import heroImage from "../assets/category/hero.jpg";
import {
  getCategoryId,
  getCategoryKey,
  getParentId,
  getParentKey,
  normalizeCategoryKey,
  unwrapList,
} from "../utils/productHelpers.js";

import CollectionHero from "../components/products/CollectionHero.jsx";
import CategoryPills from "../components/products/CategoryPills.jsx";
import CollectionToolbar from "../components/products/CollectionToolbar.jsx";
import FilterSidebar from "../components/products/FilterSidebar.jsx";
import ProductGrid from "../components/products/ProductGrid.jsx";
import Pagination from "../components/products/Pagination.jsx";
import CollectionBenefits from "../components/products/CollectionBenefits.jsx";

const PRICE_MIN = 500;
const PRICE_MAX = 10000;
const PRICE_STEP = 500;

const Products = ({ categorySlug = "" }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get("category") || categorySlug || "";
  const urlSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [colorFilter, setColorFilter] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  // Synchronize state when URL category or search parameters change externally
  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSearch(urlSearch);
    setPage(1);
  }, [urlCategory, urlSearch]);

  // Load categories on mount
  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        const list = unwrapList(data, [
          "categories",
          "data",
          "results",
          "items",
        ]);
        if (!cancelled) {
          setCategories(list);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  // Determine active category object
  const activeCategory = useMemo(() => {
    if (!selectedCategory) return null;
    const selectedKey = normalizeCategoryKey(selectedCategory);

    return (
      categories.find((category) => {
        const slug = normalizeCategoryKey(
          category.slug || category.category?.slug || ""
        );
        const name = normalizeCategoryKey(
          category.name || category.category?.name || ""
        );
        const id = getCategoryId(category);
        return (
          id === String(selectedCategory) ||
          slug === selectedKey ||
          name === selectedKey ||
          getCategoryKey(category) === selectedKey
        );
      }) || null
    );
  }, [categories, selectedCategory]);

  const activeCategoryId = getCategoryId(activeCategory);

  // Determine parent category (if active category is a subcategory)
  const parentCategory = useMemo(() => {
    if (!activeCategory?.parentCategory) return null;

    const parentId = getParentId(activeCategory);
    const parentKey = getParentKey(activeCategory);

    return (
      categories.find((category) => {
        const id = getCategoryId(category);
        const key = getCategoryKey(category);
        return (
          (parentId && id === parentId) ||
          (parentKey && key === parentKey)
        );
      }) ||
      (typeof activeCategory.parentCategory === "object"
        ? activeCategory.parentCategory
        : null)
    );
  }, [activeCategory, categories]);

  // Determine sibling categories for pill navigation
  const siblingCategories = useMemo(() => {
    if (!activeCategory) {
      return categories.filter((category) => !category.parentCategory);
    }

    if (!activeCategory.parentCategory) {
      const activeId = getCategoryId(activeCategory);
      const activeKey = getCategoryKey(activeCategory);

      const children = categories.filter((category) => {
        const relationId = getParentId(category);
        const relationKey = getParentKey(category);
        return (
          relationId === activeId ||
          relationKey === activeKey
        );
      });

      return children.length
        ? children
        : categories.filter((category) => !category.parentCategory);
    }

    const parentId = getParentId(activeCategory);
    const parentKey = getParentKey(activeCategory);

    const siblings = categories.filter((category) => {
      const relationId = getParentId(category);
      const relationKey = getParentKey(category);
      return (
        relationId === parentId ||
        relationKey === parentKey
      );
    });

    return siblings.length
      ? siblings
      : categories.filter((category) => !category.parentCategory);
  }, [activeCategory, categories]);

  // Load products based on current query filters
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const min = minPrice === "" ? undefined : Number(minPrice);
        const max = maxPrice === "" ? undefined : Number(maxPrice);

        if (
          min !== undefined &&
          max !== undefined &&
          (Number.isNaN(min) || Number.isNaN(max) || min > max)
        ) {
          if (!cancelled) {
            setProducts([]);
            setPagination({
              currentPage: 1,
              totalPages: 1,
              totalProducts: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            });
            setError(
              "Please enter a valid price range: Minimum price must be less than maximum price."
            );
            setLoading(false);
          }
          return;
        }

        const query = {
          page,
          limit: 12,
          sort,
          ...(search.trim() && { search: search.trim() }),
          ...(selectedCategory && {
            category: activeCategory?.slug || activeCategoryId || selectedCategory,
          }),
          ...(min !== undefined && { minPrice: min }),
          ...(max !== undefined && { maxPrice: max }),
          ...(featured && { featured: true }),
          ...(colorFilter && { color: colorFilter }),
          ...(materialFilter && { material: materialFilter }),
        };

        const res = await productService.getProducts(query);
        const responseData = res.data || res;
        const fetchedProducts = responseData.products || [];
        const fetchedPagination = responseData.pagination || {
          currentPage: page,
          totalPages: Math.max(1, Math.ceil(fetchedProducts.length / 12)),
          totalProducts: fetchedProducts.length,
          hasNextPage: false,
          hasPreviousPage: page > 1,
        };

        if (!cancelled) {
          setProducts(fetchedProducts);
          setPagination(fetchedPagination);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load products:", err);
          setProducts([]);
          setError(
            err.response?.data?.message ||
              "Unable to load products. Check that the backend server is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [
    search,
    selectedCategory,
    activeCategoryId,
    activeCategory?.slug,
    sort,
    minPrice,
    maxPrice,
    featured,
    colorFilter,
    materialFilter,
    page,
    retryKey,
  ]);

  // Hero information
  const hero = useMemo(() => {
    if (activeCategory) {
      return {
        title: activeCategory.name,
        subtitle:
          activeCategory.description ||
          `Explore the ${activeCategory.name.toLowerCase()} collection.`,
        image: activeCategory.image || heroImage,
      };
    }

    return {
      title: "All Collections",
      subtitle: "Five categories. One VANTA point of view.",
      image: heroImage,
    };
  }, [activeCategory]);

  const hasFilters = Boolean(
    search ||
      selectedCategory ||
      minPrice ||
      maxPrice ||
      featured ||
      colorFilter ||
      materialFilter
  );

  const chooseCategory = useCallback(
    (categoryOrSlug) => {
      if (!categoryOrSlug) {
        setSelectedCategory("");
        setPage(1);
        setSearchParams({});
        return;
      }

      const categoryObj =
        typeof categoryOrSlug === "object"
          ? categoryOrSlug
          : categories.find((item) => {
              const wanted = normalizeCategoryKey(categoryOrSlug);
              const slug = normalizeCategoryKey(
                item.slug || item.category?.slug || ""
              );
              const name = normalizeCategoryKey(
                item.name || item.category?.name || ""
              );
              const id = getCategoryId(item);
              return (
                slug === wanted ||
                name === wanted ||
                id === String(categoryOrSlug)
              );
            });

      const key = categoryObj
        ? normalizeCategoryKey(categoryObj.slug || categoryObj.name)
        : normalizeCategoryKey(categoryOrSlug);

      setSelectedCategory(key);
      setPage(1);
      setSearchParams(key ? { category: key } : {});
    },
    [categories, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setFeatured(false);
    setColorFilter("");
    setMaterialFilter("");
    setPage(1);
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <main className={tw("vanta-collection-page")}>
      <div className={tw("vanta-collection-shell !w-full !max-w-none")}>
        <CollectionHero hero={hero} parentCategory={parentCategory} />

        <CategoryPills
          activeCategory={activeCategory}
          siblingCategories={siblingCategories}
          parentCategory={parentCategory}
          selectedCategory={selectedCategory}
          chooseCategory={chooseCategory}
        />

        <div
          className={tw(
            "vanta-collection-shell !max-w-[1240px] !w-[calc(100%-40px)] max-[640px]:!w-[calc(100%-24px)]"
          )}
        >
          <CollectionToolbar
            sort={sort}
            setSort={setSort}
            setPage={setPage}
            hasFilters={hasFilters}
            setShowFilters={setShowFilters}
          />

          <div
            className={tw(
              `vanta-collection-layout ${
                showFilters ? "filters-open" : ""
              }`
            )}
          >
            {showFilters && (
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setShowFilters(false)}
                className={tw("vanta-filter-backdrop !z-[100]")}
              />
            )}

            <FilterSidebar
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectedCategory={selectedCategory}
              parentCategory={parentCategory}
              siblingCategories={siblingCategories}
              chooseCategory={chooseCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              materialFilter={materialFilter}
              setMaterialFilter={setMaterialFilter}
              featured={featured}
              setFeatured={setFeatured}
              hasFilters={hasFilters}
              resetFilters={resetFilters}
              PRICE_MIN={PRICE_MIN}
              PRICE_MAX={PRICE_MAX}
              PRICE_STEP={PRICE_STEP}
            />

            <section className={tw("vanta-collection-results")}>
              {loading && (
                <div className={tw("vanta-collection-grid")}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <article
                      key={index}
                      className={tw("vanta-collection-product skeleton")}
                    >
                      <div
                        className={tw("vanta-collection-product-image")}
                      />
                      <div className="skeleton-line wide" />
                      <div className="skeleton-line short" />
                    </article>
                  ))}
                </div>
              )}

              {!loading && error && (
                <div className={tw("vanta-collection-empty")}>
                  <h2>Unable to load products</h2>
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setRetryKey((current) => current + 1)
                    }
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && products.length === 0 && (
                <div className={tw("vanta-collection-empty")}>
                  <h2>No products found</h2>
                  <p>
                    {hasFilters
                      ? "No products matched your active filters. Try adjusting your search criteria."
                      : "No products are currently available in this collection."}
                  </p>

                  {hasFilters && (
                    <button type="button" onClick={resetFilters}>
                      Reset Filters
                    </button>
                  )}
                </div>
              )}

              {!loading && !error && products.length > 0 && (
                <>
                  <ProductGrid
                    products={products}
                    wishlistItems={wishlistItems}
                    toggleWishlist={toggleWishlist}
                  />

                  {pagination && pagination.totalPages > 1 && (
                    <Pagination
                      pagination={pagination}
                      page={page}
                      totalPages={pagination.totalPages}
                      setPage={setPage}
                    />
                  )}
                </>
              )}
            </section>
          </div>
        </div>

        <CollectionBenefits />
      </div>
    </main>
  );
};

export default Products;
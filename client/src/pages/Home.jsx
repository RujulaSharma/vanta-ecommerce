import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Flame,
  Gem,
  Headphones,
} from "lucide-react";
import toast from "react-hot-toast";

import productService from "../services/productService";
import categoryService from "../services/categoryService";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { useAuthModal } from "../context/AuthModalContext";

import heroImage from "../assets/category/hero.jpg";
import bagsHeroImage from "../assets/category/bagshero.jpg";
import {
  fallbackRootCategories,
  getRootCategories,
  normalizeCategory,
} from "../data/storeCategories";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const HERO_SLIDES = [
  {
    kicker: "SHOP WITH CONFIDENCE",
    title: "Timeless Luxury, Crafted For You.",
    description:
      "Handcrafted leather handbags, structured satchels & contemporary silhouettes designed for effortless refinement.",
    primaryCta: "Shop Collection →",
    primaryLink: "/products?category=bags",
    secondaryCta: "Explore Handbags",
    secondaryLink: "/category/bags",
    image: bagsHeroImage,
    accent: "100% Genuine Leathercraft",
  },
  {
    kicker: "NEW SEASON RUNWAY '26",
    title: "Sculpted Modern Silhouettes.",
    description:
      "Discover sculpted evening wear, flowy midi dresses, and tailored separates created with certified natural fibers.",
    primaryCta: "Shop Dresses →",
    primaryLink: "/products?category=dresses",
    secondaryCta: "View All Tops",
    secondaryLink: "/products?category=tops",
    image: heroImage,
    accent: "Silk & Tailored Weaves",
  },
];

const BENEFITS = [
  {
    icon: Truck,
    title: "Free Express Shipping",
    description: "Complimentary delivery on orders over ₹2,000",
  },
  {
    icon: RotateCcw,
    title: "7-Day Easy Returns",
    description: "Hassle-free doorstep pickup & instant refunds",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure Payments",
    description: "Razorpay & 256-bit encrypted card protection",
  },
  {
    icon: Headphones,
    title: "24/7 Client Concierge",
    description: "Dedicated personal styling & order support",
  },
];

const REVIEWS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    title: "Exceptional Leather Quality",
    text: "The structured tote surpassed my expectations. The grain of the leather, gold hardware, and stitch precision feel like European designer labels.",
  },
  {
    name: "Ananya Verma",
    location: "Bangalore",
    title: "Stunning Dress Fit & Fabric",
    text: "Ordered the midi silhouette for an evening reception. Breathable silk-cotton blend that drapes elegantly without creasing. Got countless compliments!",
  },
  {
    name: "Ritika Singh",
    location: "New Delhi",
    title: "Fast Delivery & Impeccable Box",
    text: "Arrived in 48 hours in luxury dustbags with care instructions. Customer service is prompt and respectful. Vanta is now my go-to fashion store.",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTrendingCategory, setActiveTrendingCategory] = useState("all");
  const [addingId, setAddingId] = useState(null);

  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { openAuth } = useAuthModal();

  const trendingScrollRef = useRef(null);
  const newArrivalsScrollRef = useRef(null);
  const bagsScrollRef = useRef(null);
  const accentsScrollRef = useRef(null);

  // Fetch initial product catalog & categories
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      productService.getProducts({ limit: 24, page: 1, sort: "newest" }),
      categoryService.getCategories(),
    ]).then(([productResult, categoryResult]) => {
      if (cancelled) return;

      if (productResult.status === "fulfilled") {
        const productList =
          productResult.value.data?.products ||
          productResult.value.products ||
          [];
        setProducts(Array.isArray(productList) ? productList : []);
      }

      if (categoryResult.status === "fulfilled") {
        const categoryList =
          categoryResult.value.data?.categories ||
          categoryResult.value.categories ||
          [];
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Root categories with fallback images
  const rootCategories = useMemo(() => {
    const roots = getRootCategories(categories);
    return roots.length ? roots.slice(0, 5) : fallbackRootCategories;
  }, [categories]);

  // Filter products by category or featured status
  const trendingProducts = useMemo(() => {
    if (activeTrendingCategory === "all") return products.slice(0, 10);
    return products.filter((p) => {
      const catSlug =
        typeof p.category === "object"
          ? p.category?.slug
          : normalizeCategory(p.category || "");
      return catSlug === activeTrendingCategory;
    });
  }, [products, activeTrendingCategory]);

  const bagProducts = useMemo(() => {
    return products.filter((p) => {
      const catSlug =
        typeof p.category === "object"
          ? p.category?.slug
          : normalizeCategory(p.category || "");
      return catSlug === "bags" || p.name?.toLowerCase().includes("bag") || p.name?.toLowerCase().includes("tote");
    });
  }, [products]);

  const newArrivals = useMemo(() => {
    return products.slice(0, 10);
  }, [products]);

  const footwearAndJewelry = useMemo(() => {
    return products.filter((p) => {
      const catSlug =
        typeof p.category === "object"
          ? p.category?.slug
          : normalizeCategory(p.category || "");
      return (
        catSlug === "footwear" ||
        catSlug === "jewelry" ||
        catSlug === "jewellery" ||
        p.name?.toLowerCase().includes("heel") ||
        p.name?.toLowerCase().includes("necklace") ||
        p.name?.toLowerCase().includes("shoe") ||
        p.name?.toLowerCase().includes("ring") ||
        p.name?.toLowerCase().includes("earring")
      );
    });
  }, [products]);

  // Carousel helpers
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const scrollContainer = (ref, direction) => {
    if (!ref.current) return;
    const scrollAmount = ref.current.clientWidth * 0.75;
    ref.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleQuickAdd = async (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to add items to your cart");
      openAuth("login");
      return;
    }

    try {
      setAddingId(product._id);
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to your bag`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  // Reusable Product Card Component
  const renderProductCard = (product) => {
    const isWishlisted = wishlistItems.some((item) => item._id === product._id);
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

    const ratingVal =
      typeof product.rating === "object"
        ? product.rating?.average || 4.8
        : Number(product.rating || product.averageRating || 4.8);

    const reviewCount =
      product.reviews?.length ||
      product.reviewCount ||
      ((product.name?.length || 8) % 15) + 6;

    const imageSrc =
      product.images?.[0] ||
      product.image ||
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80";

    const secondaryImage = product.images?.[1];

    return (
      <article
        key={product._id}
        className="group relative flex flex-col rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-3 transition duration-300 hover:shadow-xl hover:border-[var(--vanta-text)]/30 shrink-0 w-[240px] sm:w-[260px] md:w-[270px] xl:w-full min-w-0"
      >
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[var(--vanta-soft)]">
          <Link to={`/products/${product.slug}`} className="block h-full w-full">
            <img
              src={imageSrc}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                secondaryImage ? "group-hover:opacity-0 transition-opacity" : ""
              }`}
              loading="lazy"
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105"
                loading="lazy"
              />
            )}
          </Link>

          {/* BADGES */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.isFeatured && (
              <span className="rounded-md bg-[var(--vanta-dark)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white dark:bg-white dark:text-stone-900 shadow-sm">
                Featured
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="rounded-md bg-stone-900/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-xs">
                Sold Out
              </span>
            )}
          </div>

          {/* WISHLIST BUTTON */}
          <button
            type="button"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const added = toggleWishlist(product);
              toast.success(added ? "Saved to wishlist" : "Removed from wishlist");
            }}
            className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition duration-200 z-10 ${
              isWishlisted
                ? "bg-[var(--vanta-dark)] text-white dark:bg-white dark:text-black"
                : "bg-white/90 text-stone-900 hover:bg-white hover:scale-110 dark:bg-stone-900/90 dark:text-white"
            }`}
          >
            <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2} />
          </button>

          {/* QUICK ADD OVERLAY BUTTON */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-10 translate-y-3 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              disabled={product.stock === 0 || addingId === product._id}
              onClick={(e) => handleQuickAdd(e, product)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--vanta-dark)] text-white dark:bg-white dark:text-stone-900 py-2.5 text-xs font-bold uppercase tracking-[0.1em] shadow-lg transition hover:opacity-90 disabled:opacity-50"
            >
              <ShoppingBag size={14} />
              <span>{addingId === product._id ? "Adding..." : "Add to Bag"}</span>
            </button>
          </div>
        </div>

        {/* METADATA */}
        <div className="flex flex-1 flex-col pt-3">
          <div className="flex items-center justify-between gap-1 text-[10px] uppercase tracking-[0.14em] text-[var(--vanta-muted)]">
            <span className="truncate">
              {typeof product.category === "object"
                ? product.category?.name
                : product.category || "Vanta Collection"}
            </span>
            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star size={11} fill="currentColor" />
              <span className="font-bold text-[11px] text-[var(--vanta-text)]">{ratingVal.toFixed(1)}</span>
              <span className="text-[10px] text-[var(--vanta-muted)]">({reviewCount})</span>
            </div>
          </div>

          <Link to={`/products/${product.slug}`} className="mt-1.5 block">
            <h3 className="line-clamp-1 text-xs sm:text-sm font-semibold text-[var(--vanta-text)] group-hover:text-[var(--vanta-accent)] transition">
              {product.name}
            </h3>
          </Link>

          {/* PRICING */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-[var(--vanta-text)]">
              {money(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[var(--vanta-muted)] line-through">
                {money(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)] space-y-12 sm:space-y-16 lg:space-y-20 pb-20">
      {/* ========================================================
          1. WIDE CINEMATIC HERO SECTION
          ======================================================== */}
      <section className="pt-3 sm:pt-5">
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--vanta-border)] bg-gradient-to-br from-[#f8f6f0] via-[#f1eee4] to-[#e8e4d8] dark:from-[#171817] dark:via-[#131413] dark:to-[#0f100f] shadow-md group">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] md:min-h-[500px] lg:min-h-[540px] xl:min-h-[580px] items-center">
              {/* TEXT COLUMN (LEFT SAFE ZONE) */}
              <div className="lg:col-span-6 xl:col-span-7 p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--vanta-accent)]/40 bg-[var(--vanta-accent)]/10 px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-[var(--vanta-accent)] w-fit mb-4">
                  <Sparkles size={12} />
                  <span>{activeSlideData.kicker}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--vanta-text)]">
                  {activeSlideData.title}
                </h1>

                <p className="mt-4 max-w-[540px] text-xs sm:text-sm lg:text-base leading-relaxed text-[var(--vanta-muted)]">
                  {activeSlideData.description}
                </p>

                {/* CTA ACTIONS */}
                <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    to={activeSlideData.primaryLink}
                    className="inline-flex items-center gap-2.5 rounded-full bg-[var(--vanta-dark)] text-white dark:bg-white dark:text-stone-900 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] shadow-md transition hover:scale-[1.02] hover:opacity-95"
                  >
                    <span>{activeSlideData.primaryCta}</span>
                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    to={activeSlideData.secondaryLink}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--vanta-border)] bg-[var(--vanta-surface)]/80 backdrop-blur-xs px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--vanta-text)] transition hover:bg-[var(--vanta-surface)] hover:border-[var(--vanta-text)]"
                  >
                    <span>{activeSlideData.secondaryCta}</span>
                  </Link>
                </div>

                {/* HIGHLIGHT PERKS */}
                <div className="mt-7 sm:mt-8 pt-5 border-t border-[var(--vanta-border)]/70 flex flex-wrap items-center gap-6 text-[11px] text-[var(--vanta-muted)]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Express Dispatch (24-48h)
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--vanta-accent)]" />
                    {activeSlideData.accent}
                  </span>
                </div>
              </div>

              {/* IMAGE COLUMN (RIGHT FASHION SHOWCASE) */}
              <div className="lg:col-span-6 xl:col-span-5 h-full min-h-[300px] sm:min-h-[380px] lg:min-h-full relative overflow-hidden flex items-center justify-center">
                <img
                  src={activeSlideData.image}
                  alt={activeSlideData.title}
                  className="h-full w-full object-cover object-[center_25%] transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
              </div>
            </div>

            {/* FLOATING SIDE NAVIGATION ARROWS (MATCHING PICKSY) */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--vanta-border)] bg-[var(--vanta-surface)]/95 backdrop-blur-sm text-[var(--vanta-text)] shadow-lg transition hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--vanta-border)] bg-[var(--vanta-surface)]/95 backdrop-blur-sm text-[var(--vanta-text)] shadow-lg transition hover:scale-110 active:scale-95"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>

            {/* CENTERED BOTTOM PAGINATION DOTS (MATCHING PICKSY) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-xs">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? "w-6 bg-[var(--vanta-text)]"
                      : "w-2 bg-[var(--vanta-muted)]/60 hover:bg-[var(--vanta-muted)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. COMPACT BENEFITS STRIP
          ======================================================== */}
      <section>
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3.5 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-4 sm:p-5 shadow-xs"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--vanta-soft)] text-[var(--vanta-accent)]">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-[var(--vanta-text)]">
                      {benefit.title}
                    </h2>
                    <p className="text-[11px] text-[var(--vanta-muted)] mt-0.5 leading-snug">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SHOP BY CATEGORY DISCOVERY
          ======================================================== */}
      <section>
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4 border-b border-[var(--vanta-border)] pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--vanta-accent)]">
                CURATED DIRECTORY
              </p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-[var(--vanta-text)]">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/category"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-text)] hover:text-[var(--vanta-accent)] transition shrink-0"
            >
              <span>Explore All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 5-COLUMN CATEGORY GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 xl:gap-5">
            {rootCategories.map((cat) => {
              const slug = cat.slug || normalizeCategory(cat.name);
              const image = cat.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80";

              return (
                <Link
                  key={cat._id || slug}
                  to={`/category/${slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] shadow-xs transition duration-300 hover:shadow-xl hover:border-[var(--vanta-text)]/40"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--vanta-soft)]">
                    <img
                      src={image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="absolute inset-x-3.5 bottom-3.5 text-white z-10 flex items-end justify-between">
                      <div>
                        <span className="inline-block rounded-md bg-white/20 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
                          {cat.itemCount || "Collection"}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-semibold mt-1">
                          {cat.name}
                        </h3>
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. TRENDING NOW (HIGH DENSITY CAROUSEL & TABS)
          ======================================================== */}
      <section>
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[var(--vanta-border)] pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-rose-600 dark:text-rose-400">
                <Flame size={13} fill="currentColor" />
                <span>POPULAR CHOICES</span>
              </div>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-[var(--vanta-text)]">
                Trending Now
              </h2>
            </div>

            {/* CATEGORY FILTER PILLS & CAROUSEL ARROWS */}
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {["all", "bags", "dresses", "footwear", "jewelry", "tops"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTrendingCategory(tab)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition shrink-0 ${
                      activeTrendingCategory === tab
                        ? "bg-[var(--vanta-dark)] text-white dark:bg-white dark:text-black shadow-xs"
                        : "bg-[var(--vanta-soft)] text-[var(--vanta-muted)] hover:text-[var(--vanta-text)]"
                    }`}
                  >
                    {tab === "all" ? "All Items" : tab}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => scrollContainer(trendingScrollRef, "left")}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] hover:bg-[var(--vanta-soft)] transition"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollContainer(trendingScrollRef, "right")}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] hover:bg-[var(--vanta-soft)] transition"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT CAROUSEL ROW */}
          <div
            ref={trendingScrollRef}
            className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x"
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-[360px] rounded-2xl bg-[var(--vanta-soft)] animate-pulse" />
              ))
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((p) => renderProductCard(p))
            ) : (
              <div className="col-span-full py-12 text-center text-sm text-[var(--vanta-muted)]">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. HANDBAGS & LEATHER SPOTLIGHT (SPLIT HERO + CAROUSEL)
          ======================================================== */}
      <section className="bg-[var(--vanta-surface)] py-12 sm:py-16 border-y border-[var(--vanta-border)]">
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* FEATURE BANNER */}
            <div className="lg:col-span-4 xl:col-span-3 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1d1b] to-[#111211] p-8 text-white flex flex-col justify-between min-h-[380px]">
              <div className="relative z-10">
                <span className="rounded-md bg-[var(--vanta-accent)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-black">
                  ICONIC LEATHER
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-semibold mt-4 leading-tight">
                  The Signature Handbag Collection.
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-stone-300">
                  Engineered with top-grain Italian leather, protective metal studs & modular shoulder straps.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <Link
                  to="/category/bags"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-900 transition hover:bg-stone-200"
                >
                  <span>Explore Handbags</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="lg:col-span-8 xl:col-span-9 flex items-center">
              <div
                ref={bagsScrollRef}
                className="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto no-scrollbar w-full pb-2"
              >
                {(bagProducts.length > 0 ? bagProducts : products)
                  .slice(0, 4)
                  .map((p) => renderProductCard(p))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. NEW ARRIVALS (FRESH STYLES)
          ======================================================== */}
      <section>
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-[var(--vanta-border)] pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--vanta-accent)]">
                FRESH DROP
              </p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-[var(--vanta-text)]">
                New Arrivals
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/products?sort=newest"
                className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-text)] hover:text-[var(--vanta-accent)] transition"
              >
                View Catalog →
              </Link>
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollContainer(newArrivalsScrollRef, "left")}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] hover:bg-[var(--vanta-soft)] transition"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollContainer(newArrivalsScrollRef, "right")}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] hover:bg-[var(--vanta-soft)] transition"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={newArrivalsScrollRef}
            className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto no-scrollbar pb-4 pt-1"
          >
            {newArrivals.slice(0, 5).map((p) => renderProductCard(p))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FOOTWEAR & ACCENTS SPOTLIGHT
          ======================================================== */}
      {footwearAndJewelry.length > 0 && (
        <section>
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-[var(--vanta-border)] pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--vanta-accent)]">
                  <Gem size={13} />
                  <span>FOOTWEAR & JEWELRY</span>
                </div>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-[var(--vanta-text)]">
                  Refined Accents
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/category/jewelry"
                  className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-text)] hover:text-[var(--vanta-accent)] transition"
                >
                  Shop Jewelry →
                </Link>
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollContainer(accentsScrollRef, "left")}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] hover:bg-[var(--vanta-soft)] transition"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollContainer(accentsScrollRef, "right")}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] hover:bg-[var(--vanta-soft)] transition"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={accentsScrollRef}
              className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto no-scrollbar pb-4 pt-1"
            >
              {footwearAndJewelry.slice(0, 5).map((p) => renderProductCard(p))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          8. EDITORIAL LOOKBOOK PROMO BANNER
          ======================================================== */}
      <section>
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#121312] text-white p-8 sm:p-12 lg:p-16 border border-stone-800 shadow-xl">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[var(--vanta-accent)]/20 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-[640px]">
              <span className="rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d8b56b] backdrop-blur-xs">
                SEASONAL HIGHLIGHT
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold mt-4 leading-tight">
                Up to <span className="text-[#d8b56b]">30% Off</span> Curated Autumn Styles.
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
                Elevate your daily wardrobe with limited-edition apparel, statement heels & fine jewelry pieces crafted for effortless sophistication.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#d8b56b] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-stone-950 transition hover:bg-[#c9a352] shadow-md"
                >
                  <span>Explore Offers</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
                >
                  <span>Our Craft Philosophy</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. CUSTOMER LOVE & TESTIMONIALS
          ======================================================== */}
      <section className="pt-4">
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--vanta-accent)]">
              VERIFIED REVIEWS
            </p>
            <h2 className="mt-1 font-serif text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-[var(--vanta-text)]">
              What Our Patrons Say
            </h2>
            <p className="mt-2 text-xs text-[var(--vanta-muted)]">
              Over 10,000+ satisfied fashion enthusiasts across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {REVIEWS.map((rev, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 sm:p-7 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <h3 className="font-serif text-base font-bold text-[var(--vanta-text)] mt-3">
                    “{rev.title}”
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--vanta-muted)]">
                    {rev.text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--vanta-border)] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[var(--vanta-text)]">{rev.name}</p>
                    <p className="text-[11px] text-[var(--vanta-muted)]">{rev.location}</p>
                  </div>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
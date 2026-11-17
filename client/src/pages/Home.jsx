import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { m as motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
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

import handbagEditorial from "../assets/category/handbag-editorial.webp";
import {
  fallbackRootCategories,
  getRootCategories,
  normalizeCategory,
} from "../data/storeCategories";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const HERO_SLIDES = [
  {
    kicker: "THE HANDBAG EDIT",
    title: "A study in structure.",
    description:
      "Structured satchels, everyday totes and compact shoulder bags.",
    primaryCta: "Shop handbags",
    primaryLink: "/products?category=bags",
    secondaryCta: "All collections",
    secondaryLink: "/category",
    image: handbagEditorial,
  },
  {
    kicker: "THE DRESS EDIT",
    title: "An evening in silhouette.",
    description:
      "Slip dresses, fluid midis and sculptural necklines.",
    primaryCta: "Shop dresses",
    primaryLink: "/products?category=dresses",
    secondaryCta: "Shop tops",
    secondaryLink: "/products?category=tops",
    image: "/img/slipdress.jpg",
  },
];

const BENEFITS = [
  {
    icon: Truck,
    title: "Complimentary delivery",
    description: "On orders of ₹2,000 or more",
  },
  {
    icon: RotateCcw,
    title: "Order tracking",
    description: "Follow your order from your account",
  },
  {
    icon: ShieldCheck,
    title: "Online payment",
    description: "Checkout powered by Razorpay",
  },
  {
    icon: Headphones,
    title: "Client care",
    description: "Contact us for order assistance",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTrendingCategory, setActiveTrendingCategory] = useState("all");
  const [addingId, setAddingId] = useState(null);
  const reduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageOffset = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);


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

  const productsByCollection = useMemo(() => {
    const byId = new Map(categories.map((category) => [String(category._id), category]));
    const collections = new Map();

    for (const product of products) {
      let category = typeof product.category === "object"
        ? product.category
        : byId.get(String(product.category));
      const visited = new Set();

      while (category?.parentCategory && !visited.has(category._id)) {
        visited.add(category._id);
        const parent = category.parentCategory;
        category = typeof parent === "object" ? parent : byId.get(String(parent));
      }

      const slug = category?.slug || normalizeCategory(category?.name || "");
      if (!slug) continue;
      if (!collections.has(slug)) collections.set(slug, []);
      collections.get(slug).push(product);
    }

    return collections;
  }, [categories, products]);

  const bagProducts = productsByCollection.get("bags") || [];
  const newArrivals = products.slice(0, 10);
  const trendingProducts = activeTrendingCategory === "all"
    ? newArrivals
    : (productsByCollection.get(activeTrendingCategory) || []).slice(0, 10);
  const footwearAndJewelry = [
    ...(productsByCollection.get("footwear") || []),
    ...(productsByCollection.get("jewelry") || []),
  ];

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

    const imageSrc =
      product.images?.[0] ||
      product.image || null;

    const secondaryImage = product.images?.[1];

    return (
      <motion.article
        key={product._id}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative flex flex-col  shrink-0 w-[240px] sm:w-[260px] md:w-[270px] xl:w-full min-w-0"
      >
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--vanta-soft)]">
          <Link to={`/products/${product.slug}`} className="block h-full w-full">
            {imageSrc && <img
              src={imageSrc}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                secondaryImage ? "group-hover:opacity-0 transition-opacity" : ""
              }`}
              loading="lazy"
            />}
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
          <div className="absolute inset-x-2.5 bottom-2.5 z-10 transition duration-200 pointer-fine:translate-y-3 pointer-fine:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
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

          </div>

          <Link to={`/products/${product.slug}`} className="mt-1.5 block">
            <h3 className="font-serif text-lg leading-snug text-[var(--vanta-text)] group-hover:text-[var(--vanta-accent)] transition">
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
      </motion.article>
    );
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)] space-y-12 sm:space-y-16 lg:space-y-20 pb-20">
      {/* ========================================================
          1. WIDE CINEMATIC HERO SECTION
          ======================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        ref={heroRef}
        className="pt-3 sm:pt-5"
      >
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div
            className="relative overflow-hidden border border-[var(--vanta-border)] bg-[var(--vanta-soft)] group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] md:min-h-[500px] lg:min-h-[540px] xl:min-h-[580px] items-center"
              >
                {/* TEXT COLUMN (LEFT SAFE ZONE) */}
                <div className="lg:col-span-6 p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="inline-flex items-center gap-2  text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-[var(--vanta-muted)] w-fit mb-4"
                  >
                    <span>{activeSlideData.kicker}</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.45 }}
                    className="font-serif text-5xl sm:text-6xl xl:text-7xl font-normal leading-[1.08] tracking-[-0.03em] text-[var(--vanta-text)]"
                  >
                    {activeSlideData.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                    className="mt-4 max-w-[540px] text-xs sm:text-sm lg:text-base leading-relaxed text-[var(--vanta-muted)]"
                  >
                    {activeSlideData.description}
                  </motion.p>

                  {/* CTA ACTIONS */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.45 }}
                    className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5"
                  >
                    <Link
                      to={activeSlideData.primaryLink}
                      className="inline-flex items-center gap-2.5 bg-[var(--vanta-dark)] text-white dark:bg-white dark:text-stone-900 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] shadow-md transition hover:scale-[1.02] hover:opacity-95"
                    >
                      <span>{activeSlideData.primaryCta}</span>
                      <ArrowRight size={15} />
                    </Link>

                    <Link
                      to={activeSlideData.secondaryLink}
                      className="inline-flex items-center gap-2 border border-[var(--vanta-border)] bg-[var(--vanta-surface)]/80 backdrop-blur-xs px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--vanta-text)] transition hover:bg-[var(--vanta-surface)] hover:border-[var(--vanta-text)]"
                    >
                      <span>{activeSlideData.secondaryCta}</span>
                    </Link>
                  </motion.div>


                </div>

                {/* IMAGE COLUMN (RIGHT FASHION SHOWCASE) */}
                <div className="lg:col-span-6 h-full min-h-[300px] sm:min-h-[380px] lg:min-h-full relative overflow-hidden flex items-center justify-center">
                  <motion.img
                    key={`img-${currentSlide}`}
                    initial={{ scale: 1.05, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    src={activeSlideData.image}
                    alt={activeSlideData.title}
                    fetchPriority={currentSlide === 0 ? "high" : "auto"}
                    style={{ y: reduceMotion ? 0 : imageOffset }}
                    className="absolute inset-x-0 -top-[7%] h-[107%] w-full object-cover object-[center_35%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* FLOATING SIDE NAVIGATION ARROWS (MATCHING PICKSY) */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-4 bottom-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--vanta-border)] bg-[var(--vanta-surface)]/95 backdrop-blur-sm text-[var(--vanta-text)] shadow-lg transition hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 sm:right-4 bottom-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--vanta-border)] bg-[var(--vanta-surface)]/95 backdrop-blur-sm text-[var(--vanta-text)] shadow-lg transition hover:scale-110 active:scale-95"
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
                  aria-pressed={currentSlide === idx}
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
      </motion.section>

      {/* ========================================================
          2. COMPACT BENEFITS STRIP
          ======================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3.5 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-4 sm:p-5 shadow-xs transition-shadow duration-200 hover:shadow-md hover:border-[var(--vanta-text)]/30"
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ========================================================
          3. SHOP BY CATEGORY DISCOVERY
          ======================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55 }}
      >
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
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] shadow-xs transition duration-300 hover:shadow-xl hover:border-[var(--vanta-text)]/40 hover:-translate-y-1"
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
      </motion.section>

      {/* ========================================================
          4. TRENDING NOW (HIGH DENSITY CAROUSEL & TABS)
          ======================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
      >
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-[var(--vanta-border)] pb-4">
            <div>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-[var(--vanta-text)]">
                Shop by collection
              </h2>
            </div>

            {/* CATEGORY FILTER PILLS & CAROUSEL ARROWS */}
            <div className="flex min-w-0 items-center justify-between gap-3 lg:justify-end">
              <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {["all", "bags", "dresses", "footwear", "jewelry", "tops"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    aria-pressed={activeTrendingCategory === tab}
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
      </motion.section>

      {/* ========================================================
          5. HANDBAGS & LEATHER SPOTLIGHT (SPLIT HERO + CAROUSEL)
          ======================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
        className="bg-[var(--vanta-surface)] py-12 sm:py-16 border-y border-[var(--vanta-border)]"
      >
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* FEATURE BANNER */}
            <div className="lg:col-span-4 xl:col-span-3 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1d1b] to-[#111211] p-8 text-white flex flex-col justify-between min-h-[380px]">
              <div className="relative z-10">
                <span className="rounded-md bg-[var(--vanta-accent)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-black">
                  HANDBAGS
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-semibold mt-4 leading-tight">
                  Shapes to carry.
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-stone-300">
                  Compact shoulder bags, structured totes and larger styles for travel.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <Link
                  to="/category/bags"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-900 transition hover:bg-stone-200"
                >
                  <span>Shop handbags</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="lg:col-span-8 xl:col-span-9 flex min-w-0 items-center">
              <div
                ref={bagsScrollRef}
                className="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto no-scrollbar w-full pb-2"
              >
                {bagProducts
                  .slice(0, 4)
                  .map((p) => renderProductCard(p))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ========================================================
          6. NEW ARRIVALS (FRESH STYLES)
          ======================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
      >
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
      </motion.section>

      {/* ========================================================
          7. FOOTWEAR & ACCENTS SPOTLIGHT
          ======================================================== */}
      {footwearAndJewelry.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55 }}
        >
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
        </motion.section>
      )}

      {/* ========================================================
          8. EDITORIAL LOOKBOOK PROMO BANNER
          ======================================================== */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.55 }}
      >
        <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#121312] text-white p-8 sm:p-12 lg:p-16 border border-stone-800 shadow-xl">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[var(--vanta-accent)]/20 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-[640px]">
              <span className="rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d8b56b] backdrop-blur-xs">
                THE VANTA EDIT
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold mt-4 leading-tight">
                The finishing pieces.
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
                Sculptural jewelry, clean-lined footwear and bags with a sense of shape.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#d8b56b] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-stone-950 transition hover:bg-[#c9a352] shadow-md"
                >
                  <span>Explore the collection</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
                >
                  <span>About VANTA</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

    </main>
  );
}

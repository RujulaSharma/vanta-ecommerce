import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { useAuthModal } from "../context/AuthModalContext";
import categoryService from "../services/categoryService";
import NavbarDesktop from "../components/navbar/NavbarDesktop";
import NavbarMobile from "../components/navbar/NavbarMobile";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("vanta-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const cartCount = useCartStore((state) => state.cartCount);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { openAuth } = useAuthModal();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vanta-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) fetchCart().catch(() => {});
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        const list = response?.data?.categories || response?.categories || response?.data || [];
        if (!cancelled) setCategories(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Failed to load navbar categories:", error);
      }
    };

    loadCategories();
    return () => { cancelled = true; };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setCollectionsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleMobileMenuOutsideClick = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleMobileMenuOutsideClick);
    return () => document.removeEventListener("mousedown", handleMobileMenuOutsideClick);
  }, [mobileMenuOpen]);

  const isHome = location.pathname === "/";
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <header
      ref={mobileMenuRef}
      className={`sticky top-0 z-50 w-full border-b border-[var(--vanta-border)] bg-[var(--vanta-surface)]/95 backdrop-blur-md transition-colors duration-200 ${
        isHome ? "shadow-xs" : ""
      }`}
    >
      {/* 1. TOP UTILITY ANNOUNCEMENT BAR */}
      <div className="border-b border-[var(--vanta-border)]/60 bg-[var(--vanta-soft)]/60 text-[11px] text-[var(--vanta-muted)]">
        <div className="mx-auto flex h-9 max-w-[1520px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--vanta-accent)]">FREE SHIPPING</span>
            <span>•</span>
            <span className="truncate">Express Delivery on orders over ₹2,000 | 7-Day Effortless Returns</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px]">
            <span className="text-[var(--vanta-text)] font-medium">✨ Premium Handcrafted Fashion</span>
            <span>•</span>
            <span className="hover:text-[var(--vanta-text)] transition cursor-pointer">Support: help@vanta.com</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR CONTAINER */}
      <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
        {/* Mobile Navbar Row */}
        <NavbarMobile
          mobileMenuOpen={mobileMenuOpen}
          mobileSearchOpen={mobileSearchOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setMobileSearchOpen={setMobileSearchOpen}
          navSearch={navSearch}
          setNavSearch={setNavSearch}
          collectionsOpen={collectionsOpen}
          setCollectionsOpen={setCollectionsOpen}
          theme={theme}
          setTheme={setTheme}
          categories={categories}
          isAuthenticated={isAuthenticated}
          user={user}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          navigate={navigate}
          openAuth={openAuth}
          closeMobileMenu={closeMobileMenu}
          handleLogout={handleLogout}
        />

        {/* Desktop Navbar (2-Tier Header) */}
        <NavbarDesktop
          categories={categories}
          collectionsOpen={collectionsOpen}
          setCollectionsOpen={setCollectionsOpen}
          navSearch={navSearch}
          setNavSearch={setNavSearch}
          navigate={navigate}
          closeMobileMenu={closeMobileMenu}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          user={user}
          isAuthenticated={isAuthenticated}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          theme={theme}
          setTheme={setTheme}
          wishlistCount={wishlistCount}
          cartCount={cartCount}
          handleLogout={handleLogout}
          openAuth={openAuth}
        />
      </div>
    </header>
  );
};

export default Navbar;

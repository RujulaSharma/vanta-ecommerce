import { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
const Products = lazy(() => import("./pages/Products"));
const Category = lazy(() => import("./pages/Category"));
const About = lazy(() => import("./pages/About"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const AuthEntry = lazy(() => import("./pages/AuthEntry"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Orders = lazy(() => import("./pages/Orders"));
const Account = lazy(() => import("./pages/Account"));
const Addresses = lazy(() => import("./pages/Addresses"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const RecentlyViewed = lazy(() => import("./pages/RecentlyViewed"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminOrderDetails = lazy(() => import("./pages/admin/AdminOrderDetails"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));

function App() {
  return (
    <Suspense fallback={<p role="status" className="p-8 text-center">Loading…</p>}>
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/recently-viewed" element={<RecentlyViewed />} />
        <Route path="/login" element={<AuthEntry mode="login" />} />
        <Route path="/register" element={<AuthEntry mode="register" />} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<Orders />} />
          <Route path="/account/addresses" element={<Addresses />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <main className="mx-auto max-w-3xl px-5 py-24 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--vanta-muted)]">404</p>
              <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Page not found.</h1>
              <p className="mt-4 text-sm text-[var(--vanta-muted)]">The page you are looking for does not exist or has moved.</p>
              <Link
                to="/"
                className="mt-8 inline-flex bg-stone-950 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
              >
                Return home
              </Link>
            </main>
          }
        />
      </Route>
    </Routes>
    </Suspense>
  );
}

export default App;
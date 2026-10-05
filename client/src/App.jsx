import { Routes, Route, Link } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Category from "./pages/Category";
import About from "./pages/About";
import ProductDetails from "./pages/ProductDetails";
import AuthEntry from "./pages/AuthEntry";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import Addresses from "./pages/Addresses";
import OrderSuccess from "./pages/OrderSuccess";
import Wishlist from "./pages/Wishlist";
import RecentlyViewed from "./pages/RecentlyViewed";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminProducts from "./pages/admin/AdminProducts";

function App() {
  return (
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
  );
}

export default App;
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import useCheckout from "../hooks/useCheckout";

import ContactSection from "../components/checkout/ContactSection";
import AddressSection from "../components/checkout/AddressSection";
import AddressForm from "../components/checkout/AddressForm";
import PaymentSection from "../components/checkout/PaymentSection";
import OrderSummary from "../components/checkout/OrderSummary";

import useAuthStore from "../store/authStore";

const Checkout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    user,
    cart,
    addresses,
    selectedAddressId,
    loading,
    savingAddress,
    placingOrder,
    showAddressForm,
    subtotal,
    shipping,
    total,
    selectAddress,
    openAddressForm,
    closeAddressForm,
    createAddress,
    deleteAddress,
    placeOrder,
  } = useCheckout();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)]">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="h-6 w-32 animate-pulse rounded-lg bg-[var(--vanta-soft)]" />

          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              <div className="h-40 animate-pulse rounded-2xl bg-[var(--vanta-soft)]" />
              <div className="h-64 animate-pulse rounded-2xl bg-[var(--vanta-soft)]" />
              <div className="h-32 animate-pulse rounded-2xl bg-[var(--vanta-soft)]" />
            </div>

            <div className="h-96 animate-pulse rounded-2xl bg-[var(--vanta-soft)]" />
          </div>
        </div>
      </main>
    );
  }

  if (!cart?.items?.length) {
    return (
      <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)]">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--vanta-soft)] text-[var(--vanta-muted)]">
            <ShoppingBag size={28} />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--vanta-accent)]">
            CHECKOUT
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-semibold">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--vanta-muted)]">
            Add something from the Vanta collection before continuing to checkout.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--vanta-text)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--vanta-bg)] transition hover:opacity-90 shadow-md"
          >
            <ArrowLeft size={15} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--vanta-bg)] text-[var(--vanta-text)] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--vanta-muted)] transition hover:text-[var(--vanta-text)]"
          >
            <ArrowLeft size={15} />
            <span>Back to Cart</span>
          </Link>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vanta-accent)]">
            SECURE CHECKOUT
          </p>

          <h1 className="mt-2 font-serif text-4xl sm:text-5xl md:text-6xl font-semibold">
            Checkout
          </h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-16">
          {/* Left Column: Details & Address */}
          <div className="space-y-8">
            <ContactSection user={user} />

            <AddressSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={selectAddress}
              onDelete={deleteAddress}
              onAdd={openAddressForm}
            />

            {showAddressForm && (
              <AddressForm
                onSubmit={createAddress}
                onCancel={closeAddressForm}
                saving={savingAddress}
              />
            )}

            <PaymentSection />
          </div>

          {/* Right Column: Order Summary */}
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onPlaceOrder={placeOrder}
            placingOrder={placingOrder}
            disabled={!selectedAddressId}
          />
        </div>
      </div>
    </main>
  );
};

export default Checkout;

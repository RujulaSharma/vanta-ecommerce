import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Package,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";

import {
  ORDER_STATUS_TRANSITIONS,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
} from "../../utils/orderStatus";
import { formatCurrency, formatDate } from "../../utils/admin";

const AdminOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState("");

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);

      const data = await orderService.getAdminOrderById(id);

      const loadedOrder = data.data?.order;

      setOrder(loadedOrder);
      setSelectedStatus(loadedOrder?.orderStatus || "");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const updateStatus = async () => {
    if (!order || !selectedStatus) return;

    if (selectedStatus === order.orderStatus) {
      toast.error("Choose a different status");
      return;
    }

    try {
      setUpdating(true);

      const data =
        await orderService.updateOrderStatus(
          order._id,
          selectedStatus
        );

      const updatedOrder =
        data.data?.order;

      if (updatedOrder) {
        setOrder(updatedOrder);
        setSelectedStatus(
          updatedOrder.orderStatus
        );
      }

      toast.success(
        "Order status updated"
      );
    } catch (error) {
      setSelectedStatus(
        order.orderStatus
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-10 transition-colors">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-xl bg-[var(--vanta-soft)]" />
          <div className="h-20 animate-pulse rounded-2xl bg-[var(--vanta-soft)]" />
          <div className="h-64 animate-pulse rounded-2xl bg-[var(--vanta-soft)]" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-16 flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-8 text-center shadow-xs">
          <h1 className="font-serif text-3xl font-semibold">
            Order not found
          </h1>

          <Link
            to="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--vanta-text)] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--vanta-bg)] shadow-md transition hover:opacity-90"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const canChangeStatus =
    order.orderStatus !== "delivered" &&
    order.orderStatus !== "cancelled";

    const availableStatuses =
  ORDER_STATUS_TRANSITIONS[order.orderStatus] || [];
  return (
    <main className="min-h-[70vh] bg-[var(--vanta-bg)] text-[var(--vanta-text)] px-5 py-10 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">

        {/* Back */}

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--vanta-muted)] hover:text-[var(--vanta-text)] transition"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Header */}

        <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[var(--vanta-muted)] uppercase">
              VANTA ADMIN
            </p>

            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-semibold">
              Order #{order._id.slice(-8)}
            </h1>

            <p className="mt-2 text-xs text-[var(--vanta-muted)]">
              Placed on {formatDate(order.createdAt, "long")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                ORDER_STATUS_STYLES[order.orderStatus] || ""
              }`}
            >
              {order.orderStatus}
            </span>

            <span
              className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                PAYMENT_STATUS_STYLES[
                  order.paymentStatus
                ] || ""
              }`}
            >
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Status update */}

        <section className="mt-8 rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <Package
              size={20}
              className="text-[var(--vanta-gold)]"
            />

            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--vanta-muted)] uppercase">
                FULFILLMENT
              </p>

              <h2 className="mt-0.5 font-serif text-xl font-semibold">
                Update Order Status
              </h2>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
              disabled={!canChangeStatus || updating}
              className="h-11 flex-1 rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-4 text-xs font-medium text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)] disabled:opacity-50"
            >
              <option value={order.orderStatus}>
                Current:{" "}
                {order.orderStatus.charAt(0).toUpperCase() +
                  order.orderStatus.slice(1)}
              </option>

              {availableStatuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  Change to:{" "}
                  {status.charAt(0).toUpperCase() +
                    status.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={updateStatus}
              disabled={
                updating ||
                !canChangeStatus ||
                selectedStatus ===
                  order.orderStatus
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--vanta-text)] px-6 text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-bg)] shadow-xs transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={16} />

              {updating
                ? "Updating..."
                : "Update Status"}
            </button>
          </div>

          {!canChangeStatus && (
            <p className="mt-3 text-xs text-[var(--vanta-muted)]">
              This order is {order.orderStatus} and
              cannot be moved to another status.
            </p>
          )}
        </section>

        {/* Main grid */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Items */}

          <section className="overflow-hidden rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] shadow-xs">
            <div className="border-b border-[var(--vanta-border)] bg-[var(--vanta-soft)]/50 px-6 py-4">
              <h2 className="font-serif text-lg font-semibold">
                Order Items
              </h2>
            </div>

            <div className="divide-y divide-[var(--vanta-border)]">
              {order.items?.map(
                (item, index) => (
                  <div
                    key={`${item.product?._id || item.product}-${index}`}
                    className="flex gap-4 px-6 py-5"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] font-bold tracking-[0.15em] text-[var(--vanta-muted)]">
                          VANTA
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--vanta-text)]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[var(--vanta-muted)]">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 text-xs font-medium text-[var(--vanta-muted)]">
                        {formatCurrency(item.price)}
                        {" × "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[var(--vanta-text)]">
                      {formatCurrency(
                        item.price *
                          item.quantity
                      )}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Totals */}

            <div className="border-t border-[var(--vanta-border)] bg-[var(--vanta-soft)]/30 px-6 py-5">
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--vanta-muted)]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[var(--vanta-text)]">
                    {formatCurrency(
                      order.subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[var(--vanta-muted)]">
                    Shipping
                  </span>

                  <span className="font-medium text-[var(--vanta-text)]">
                    {order.shippingFee === 0
                      ? "FREE"
                      : formatCurrency(
                          order.shippingFee
                        )}
                  </span>
                </div>

                <div className="flex justify-between border-t border-[var(--vanta-border)] pt-3 text-sm font-semibold">
                  <span className="text-[var(--vanta-text)]">Total</span>

                  <span className="text-[var(--vanta-text)]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Customer / Shipping */}

          <div className="space-y-6">

            {/* Customer */}

            <section className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <User
                  size={19}
                  className="text-[var(--vanta-gold)]"
                />

                <h2 className="font-serif text-lg font-semibold">
                  Customer
                </h2>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-[var(--vanta-muted)] uppercase">
                    NAME
                  </p>

                  <p className="mt-1 font-semibold text-[var(--vanta-text)]">
                    {order.user?.name ||
                      order.shippingAddress?.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold tracking-wider text-[var(--vanta-muted)] uppercase">
                    EMAIL
                  </p>

                  <p className="mt-1 break-all text-[var(--vanta-text)]">
                    {order.user?.email ||
                      "Not available"}
                  </p>
                </div>
              </div>
            </section>

            {/* Shipping */}

            <section className="rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] p-6 shadow-xs">
              <h2 className="font-serif text-lg font-semibold">
                Shipping Address
              </h2>

              <div className="mt-4 space-y-1 text-xs leading-5 text-[var(--vanta-muted)]">
                <p className="font-semibold text-[var(--vanta-text)]">
                  {order.shippingAddress?.name}
                </p>

                <p>
                  {order.shippingAddress?.phone}
                </p>

                <p className="pt-1 text-[var(--vanta-text)]">
                  {order.shippingAddress?.addressLine1}
                </p>

                {order.shippingAddress
                  ?.addressLine2 && (
                  <p className="text-[var(--vanta-text)]">
                    {
                      order.shippingAddress
                        .addressLine2
                    }
                  </p>
                )}

                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}
                </p>

                <p>
                  {order.shippingAddress?.postalCode}
                </p>

                <p>
                  {order.shippingAddress?.country}
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminOrderDetails;
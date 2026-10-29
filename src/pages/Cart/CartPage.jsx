import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, ArrowRight, BadgeCheck, LockKeyhole, Minus, Plus, RefreshCw,
  ShieldCheck, ShoppingBag, ShoppingCart, Trash2, Truck,
} from "lucide-react";

import { cartService } from "@/api";
import { COLORS } from "@/config/theme";
import { useAuth } from "@/contexts/AuthContext";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

const MAX_QUANTITY = 5;
const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function normalizeCart(response) {
  const data = response?.data?.data;
  const products = Array.isArray(data?.products) ? data.products : [];
  return {
    products,
    totalItems:
      Number(data?.totalItems) ||
      products.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    subtotal:
      Number(data?.subtotal) ||
      products.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
  };
}

const getProductId = (product) => product?._id || product?.productId || product?.id || "";
const getProductImage = (product) => product?.thumbnail || product?.images?.[0] || product?.image || "";

export default function CartPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState("");

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated && !authLoading,
    retry: false,
  });

  const cart = useMemo(() => normalizeCart(cartQuery.data), [cartQuery.data]);
  const productSavings = useMemo(() => cart.products.reduce((sum, product) => {
    const price = Number(product.sellingPrice ?? product.salePrice ?? product.price) || 0;
    const mrp = Number(product.mrp) || price;
    return sum + Math.max(0, mrp - price) * (Number(product.quantity) || 0);
  }, 0), [cart.products]);

  const refreshCart = async () => queryClient.invalidateQueries({ queryKey: ["cart"] });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateCartItem(productId, quantity),
    onMutate: () => setActionError(""),
    onSuccess: refreshCart,
    onError: (error) => setActionError(
      error?.response?.data?.message || "We couldn't update that quantity. Please try again."
    ),
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => cartService.removeCartItem(productId),
    onMutate: () => setActionError(""),
    onSuccess: refreshCart,
    onError: (error) => setActionError(
      error?.response?.data?.message || "We couldn't remove that item. Please try again."
    ),
  });

  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onMutate: () => setActionError(""),
    onSuccess: refreshCart,
    onError: (error) => setActionError(
      error?.response?.data?.message || "We couldn't clear your cart. Please try again."
    ),
  });

  const isMutating = updateMutation.isPending || removeMutation.isPending || clearMutation.isPending;

  function changeQuantity(product, quantity) {
    const productId = getProductId(product);
    if (!productId || isMutating || quantity < 1) return;
    if (quantity > MAX_QUANTITY) {
      setActionError(`You can add up to ${MAX_QUANTITY} units of one product.`);
      return;
    }
    updateMutation.mutate({ productId, quantity });
  }

  if (authLoading) return <CartPageLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: "/cart" }} />;

  return (
    <main className="min-h-screen bg-[#F6F8FC] pb-12">
      <InnerPageHeader
        eyebrow="Kreedum Sports"
        title="Your Shopping Cart"
        description="Review your gear, adjust quantities and get ready to move."
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Categories", to: "/categories" },
          { label: "Cart" },
        ]}
        rightContent={
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
            <ShoppingCart size={16} />
            {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
          </span>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: COLORS.blue }}>Shopping bag</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight md:text-2xl" style={{ color: COLORS.navy }}>
              {cartQuery.isLoading ? "Loading your cart…" : cart.totalItems > 0 ? "Ready for your next session?" : "Your cart"}
            </h2>
          </div>
          <Link to="/categories" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#DDE4F2] bg-white px-4 py-2 text-sm font-bold transition hover:border-[#2C62E0] hover:text-[#2C62E0]" style={{ color: COLORS.navy }}>
            <ArrowLeft size={16} /> Continue shopping
          </Link>
        </div>

        {actionError && (
          <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{actionError}</p>
            <button type="button" onClick={() => setActionError("")} className="font-bold" aria-label="Dismiss error">×</button>
          </div>
        )}

        {cartQuery.isLoading ? <CartSkeleton /> : cartQuery.isError ? (
          <div className="rounded-3xl border border-[#E5EAF4] bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF0FF]"><RefreshCw className="h-7 w-7" style={{ color: COLORS.blue }} /></div>
            <h2 className="mt-5 text-xl font-extrabold" style={{ color: COLORS.navy }}>We couldn't load your cart</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Check your internet connection and try again. Your cart hasn't been changed.</p>
            <button type="button" onClick={() => cartQuery.refetch()} className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: COLORS.blue }}><RefreshCw size={16} /> Try again</button>
          </div>
        ) : cart.products.length === 0 ? <EmptyCart /> : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DDE7FF] bg-[#EAF0FF]/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white"><Truck size={18} style={{ color: COLORS.blue }} /></div>
                  <div><p className="text-sm font-bold" style={{ color: COLORS.navy }}>Gear up with confidence</p><p className="text-xs text-slate-600">Shipping and final delivery details are confirmed at checkout.</p></div>
                </div>
                <BadgeCheck size={20} style={{ color: COLORS.blue }} />
              </div>

              <div className="overflow-hidden rounded-3xl border border-[#E5EAF4] bg-white shadow-[0_6px_28px_rgba(14,26,61,0.04)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1F7] px-5 py-4 md:px-6">
                  <div><h3 className="font-extrabold" style={{ color: COLORS.navy }}>Cart items</h3><p className="mt-0.5 text-xs text-slate-500">{cart.products.length} unique {cart.products.length === 1 ? "product" : "products"}</p></div>
                  <button type="button" onClick={() => { if (window.confirm("Remove all products from your cart?")) clearMutation.mutate(); }} disabled={isMutating} className="text-xs font-bold text-slate-500 transition hover:text-red-600 disabled:opacity-50">Clear cart</button>
                </div>

                <div className="divide-y divide-[#EEF1F7]">
                  {cart.products.map((product) => {
                    const productId = getProductId(product);
                    const image = getProductImage(product);
                    const price = Number(product.sellingPrice ?? product.salePrice ?? product.price) || 0;
                    const mrp = Number(product.mrp) || price;
                    const quantity = Number(product.quantity) || 1;
                    const slug = product.slug;
                    const unavailable = product.stockStatus === "out_of_stock" || product.stock === 0;

                    return (
                      <article key={productId || slug || product.name} className="p-4 sm:p-5 md:p-6">
                        <div className="flex gap-4 sm:gap-5">
                          <Link to={slug ? `/products/${slug}` : "/categories"} className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#EEF1F7] bg-[#F7F9FD] sm:h-32 sm:w-32" aria-label={`View ${product.name || "product"}`}>
                            {image ? <img src={image} alt={product.name || "Kreedum product"} className="h-full w-full object-contain p-2" loading="lazy" /> : <ShoppingBag className="h-9 w-9 text-slate-300" />}
                          </Link>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                {product.brand && <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.15em]" style={{ color: COLORS.blue }}>{typeof product.brand === "string" ? product.brand : product.brand?.name}</p>}
                                <Link to={slug ? `/products/${slug}` : "/categories"} className="line-clamp-2 text-sm font-extrabold leading-5 transition hover:text-[#2C62E0] sm:text-base" style={{ color: COLORS.navy }}>{product.name || "Sports product"}</Link>
                                {product.sku && <p className="mt-1 text-xs text-slate-400">SKU: {product.sku}</p>}
                              </div>
                              <p className="hidden shrink-0 text-base font-extrabold sm:block" style={{ color: COLORS.navy }}>{formatINR(Number(product.total) || price * quantity)}</p>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold" style={{ color: COLORS.navy }}>{formatINR(price)}</span>
                              {mrp > price && <><span className="text-xs text-slate-400 line-through">{formatINR(mrp)}</span><span className="rounded-full bg-[#EAF0FF] px-2 py-0.5 text-[10px] font-extrabold text-[#2C62E0]">{Math.round(((mrp - price) / mrp) * 100)}% OFF</span></>}
                            </div>
                            {unavailable && <p className="mt-2 text-xs font-semibold text-red-600">Currently unavailable — remove this item to continue.</p>}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                              <div className="inline-flex h-9 items-center rounded-xl border border-[#DDE4F0] bg-white">
                                <button type="button" aria-label={`Decrease quantity of ${product.name || "product"}`} disabled={isMutating || quantity <= 1} onClick={() => changeQuantity(product, quantity - 1)} className="flex h-9 w-9 items-center justify-center rounded-l-xl transition hover:bg-[#F2F5FB] disabled:cursor-not-allowed disabled:opacity-35"><Minus size={14} /></button>
                                <span className="min-w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">{quantity}</span>
                                <button type="button" aria-label={`Increase quantity of ${product.name || "product"}`} disabled={isMutating || quantity >= MAX_QUANTITY} onClick={() => changeQuantity(product, quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-r-xl transition hover:bg-[#F2F5FB] disabled:cursor-not-allowed disabled:opacity-35"><Plus size={14} /></button>
                              </div>
                              <button type="button" onClick={() => { if (productId) removeMutation.mutate(productId); }} disabled={isMutating} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-red-600 disabled:opacity-50"><Trash2 size={14} /> Remove</button>
                            </div>
                            <p className="mt-3 text-sm font-extrabold sm:hidden" style={{ color: COLORS.navy }}>Item total: {formatINR(Number(product.total) || price * quantity)}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <TrustItem icon={<ShieldCheck size={18} />} title="Secure checkout" text="Protected account session" />
                <TrustItem icon={<BadgeCheck size={18} />} title="Sports essentials" text="Curated product catalogue" />
                <TrustItem icon={<Truck size={18} />} title="Delivery details" text="Shown before you pay" />
              </div>
            </div>

            <aside className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-3xl border border-[#E5EAF4] bg-white shadow-[0_10px_35px_rgba(14,26,61,0.06)]">
                <div className="border-b border-[#EEF1F7] px-5 py-5"><p className="text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: COLORS.blue }}>Order summary</p><h3 className="mt-1 text-xl font-extrabold" style={{ color: COLORS.navy }}>Price details</h3></div>
                <div className="space-y-4 px-5 py-5">
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Subtotal ({cart.totalItems} items)</span><span className="font-bold tabular-nums" style={{ color: COLORS.navy }}>{formatINR(cart.subtotal)}</span></div>
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Product savings</span><span className="font-bold tabular-nums text-emerald-600">−{formatINR(productSavings)}</span></div>
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="text-slate-500">Shipping</span><span className="text-right text-xs font-semibold text-slate-500">Calculated at checkout</span></div>
                  <div className="border-t border-dashed border-[#DCE3F0] pt-4"><div className="flex items-end justify-between gap-3"><div><p className="text-sm font-bold" style={{ color: COLORS.navy }}>Estimated total</p><p className="mt-1 text-[11px] text-slate-400">Shipping and applicable charges may vary.</p></div><span className="text-2xl font-extrabold tabular-nums" style={{ color: COLORS.navy }}>{formatINR(cart.subtotal)}</span></div></div>
                  <Link to="/checkout" className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(44,98,224,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(44,98,224,0.28)]" style={{ backgroundColor: COLORS.blue }}>Proceed to checkout <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" /></Link>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400"><LockKeyhole size={14} /> Secure checkout</div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-[#E5EAF4] bg-white/70 p-4"><p className="text-sm font-bold" style={{ color: COLORS.navy }}>Need help choosing?</p><p className="mt-1 text-xs leading-5 text-slate-500">Our team can help you find the right gear for your training setup.</p><Link to="/categories" className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold" style={{ color: COLORS.blue }}>Explore more gear <ArrowRight size={13} /></Link></div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="rounded-3xl border border-[#E5EAF4] bg-white px-6 py-14 text-center shadow-sm md:py-20">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EAF0FF]"><ShoppingCart className="h-9 w-9" style={{ color: COLORS.blue }} /></div>
      <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: COLORS.blue }}>Room for more</p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight" style={{ color: COLORS.navy }}>Your cart is waiting for some gear</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Browse sports and fitness essentials, then add your favourites here to review everything in one place.</p>
      <Link to="/categories" className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-white transition hover:opacity-90" style={{ backgroundColor: COLORS.blue }}><ShoppingBag size={17} /> Explore products <ArrowRight size={16} /></Link>
    </div>
  );
}

function TrustItem({ icon, title, text }) {
  return <div className="flex items-start gap-3 rounded-2xl border border-[#E5EAF4] bg-white p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF0FF]" style={{ color: COLORS.blue }}>{icon}</div><div><p className="text-xs font-extrabold" style={{ color: COLORS.navy }}>{title}</p><p className="mt-1 text-[11px] leading-4 text-slate-500">{text}</p></div></div>;
}

function CartPageLoading() {
  return <main className="min-h-screen bg-[#F6F8FC] pb-12"><div className="h-56 animate-pulse bg-gradient-to-br from-[#0E1A3D] to-[#2C62E0]" /><section className="mx-auto max-w-6xl px-4 py-8 md:px-6"><CartSkeleton /></section></main>;
}

function CartSkeleton() {
  return <div className="grid animate-pulse gap-6 lg:grid-cols-[minmax(0,1fr)_350px]"><div className="space-y-4"><div className="h-16 rounded-2xl bg-white" /><div className="rounded-3xl border border-[#E5EAF4] bg-white p-5">{Array.from({ length: 2 }, (_, index) => <div key={index} className="flex gap-4 border-b border-[#EEF1F7] py-5 last:border-0"><div className="h-28 w-28 rounded-2xl bg-slate-100" /><div className="flex-1 space-y-3"><div className="h-3 w-1/3 rounded bg-slate-100" /><div className="h-5 w-4/5 rounded bg-slate-100" /><div className="h-4 w-1/4 rounded bg-slate-100" /><div className="h-8 w-28 rounded-xl bg-slate-100" /></div></div>)}</div></div><div className="h-80 rounded-3xl bg-white" /></div>;
}

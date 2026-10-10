import { useQuery } from "@tanstack/react-query";

import { cartService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { productService } from "@/api";
import { COLORS } from "@/config/theme";
import ProductCard from "@/components/product/ProductCard";
import InnerPageHeader from "@/components/layout/InnerPageHeader";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
const [cartSuccess, setCartSuccess] = useState(false);
const [cartError, setCartError] = useState("");


async function handleAddToCart() {
  setCartError("");
  setCartSuccess(false);

  if (!isAuthenticated) {
    navigate("/login", {
      state: {
        from: window.location.pathname,
      },
    });

    return;
  }

  if (!product?._id) {
    setCartError("Unable to add this product to cart.");
    return;
  }

  try {
    setAddingToCart(true);

    await cartService.addToCart(
      product._id,
      quantity
    );

    setCartSuccess(true);

    setTimeout(() => {
      setCartSuccess(false);
    }, 3000);
  } catch (error) {
    console.error("Add to cart failed:", error);

    setCartError(
      error?.response?.data?.message ||
        "Unable to add product to cart."
    );
  } finally {
    setAddingToCart(false);
  }
}


  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: Boolean(slug),
  });

  const data = response?.data;
  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  const images = useMemo(() => {
    if (!product) return [];

    const productImages = Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];

    if (product.thumbnail && !productImages.includes(product.thumbnail)) {
      productImages.unshift(product.thumbnail);
    }

    return productImages;
  }, [product]);

  const hasSpecifications =
    product &&
    [
      product.sku,
      product.brand,
      product.countryOfOrigin,
      product.weight,
      product.dimensions,
      product.warranty,
      product.maxUserWeight,
    ].some(Boolean);

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function getStockLabel() {
    switch (product?.stockStatus) {
      case "in_stock":
        return "In Stock";
      case "out_of_stock":
        return "Out of Stock";
      case "preorder":
        return "Preorder";
      case "enquiry_only":
        return "Enquiry Only";
      default:
        return "Check Availability";
    }
  }

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-[#F6F8FC] pt-24">
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center">
            <h1
              className="text-2xl font-bold"
              style={{ color: COLORS.navy }}
            >
              Product Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              We couldn't load this product.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 font-semibold"
              style={{ color: COLORS.blue }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const sellingPrice = Number(product.sellingPrice) || 0;
  const mrp = Number(product.mrp) || 0;
  const discount = Number(product.discountPercent) || 0;

  const isInStock = product.stockStatus === "in_stock";
  const isEnquiryOnly = product.stockStatus === "enquiry_only";

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
    <InnerPageHeader
     eyebrow="Kreedum Sports"
  // eyebrow={
  //   product.brand && product.brand !== "Unknown"
  //     ? product.brand
  //     : "Kreedum Sports"
  // }
   title={product.name}
  // breadcrumbs={[
  //   { label: "Home", to: "/" },
  //   { label: "Shop", to: "/products" },
  //   { label: product.name },
  />
 
    {/* =====================================================
          PRODUCT HEADER / BREADCRUMB
      ====================================================== */}


      {/* =====================================================
          PRODUCT MAIN
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* IMAGE GALLERY */}
          <div>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="aspect-square flex items-center justify-center p-8 md:p-12 relative">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div
                    className="text-7xl font-bold"
                    style={{ color: COLORS.blue }}
                  >
                    K
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImage((current) =>
                          current === 0
                            ? images.length - 1
                            : current - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-[#EAF0FF] transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveImage((current) =>
                          current === images.length - 1
                            ? 0
                            : current + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-[#EAF0FF] transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`
                      w-20
                      h-20
                      flex-shrink-0
                      rounded-xl
                      overflow-hidden
                      bg-white
                      border
                      transition-all
                      ${
                        activeImage === index
                          ? "border-[#2C62E0] ring-2 ring-[#2C62E0]/20"
                          : "border-gray-200"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col">
            {product.brand && product.brand !== "Unknown" && (
              <p
                className="text-xs font-bold tracking-[0.18em] uppercase"
                style={{ color: COLORS.blue }}
              >
                {product.brand}
              </p>
            )}

            <h1
              className="mt-2 text-3xl md:text-4xl font-bold leading-tight"
              style={{ color: COLORS.navy }}
            >
              {product.name}
            </h1>

            {product.sku && (
              <p className="mt-3 text-sm text-gray-500">
                SKU: {product.sku}
              </p>
            )}

            {/* Price */}
            <div className="mt-7 flex items-end gap-3 flex-wrap">
              <span
                className="text-3xl md:text-4xl font-bold"
                style={{ color: COLORS.navy }}
              >
                ₹{sellingPrice.toLocaleString("en-IN")}
              </span>

              {mrp > sellingPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
              )}

              {discount > 0 && (
                <span className="px-3 py-1 rounded-full bg-[#EAF0FF] text-[#2C62E0] text-sm font-bold">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="mt-6 flex items-center gap-2">
              {isInStock && (
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              )}

              <span
                className={`text-sm font-semibold ${
                  isInStock
                    ? "text-green-600"
                    : isEnquiryOnly
                    ? "text-[#2C62E0]"
                    : "text-gray-500"
                }`}
              >
                {getStockLabel()}
              </span>
            </div>

            {product.availabilityMessage && (
              <p className="mt-2 text-sm text-gray-500">
                {product.availabilityMessage}
              </p>
            )}

            {/* Quantity */}
            {isInStock && (
              <div className="mt-7">
                <p className="text-sm font-semibold mb-2">
                  Quantity
                </p>

                <div className="inline-flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}


            

            {/* Actions */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              {isEnquiryOnly ? (
                <button
                  type="button"
                  className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-white"
                  style={{
                    backgroundColor: COLORS.blue,
                  }}
                >
                  Enquire Now
                </button>
              ) : (
                <>
                <button
  type="button"
  onClick={handleAddToCart}
  disabled={!isInStock || addingToCart}
  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EAF0FF]"
  style={{
    color: COLORS.navy,
    borderColor: "rgba(14,26,61,0.15)",
  }}
>
  <ShoppingCart className="w-5 h-5" />

  {addingToCart ? "Adding..." : "Add to Cart"}
</button>

                  <button
                    type="button"
                    disabled={!isInStock}
                    onClick={() => navigate("/checkout")}
                    className="flex-1 px-6 py-3.5 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: COLORS.blue,
                    }}
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>

{cartSuccess && (
  <div
    className="mt-4 rounded-xl px-4 py-3 text-sm font-medium"
    style={{
      backgroundColor: COLORS.tint,
      color: COLORS.blueDark,
    }}
  >
    Product added to your cart successfully.
  </div>
)}

{cartError && (
  <div className="mt-4 rounded-xl px-4 py-3 text-sm font-medium bg-red-50 text-red-600">
    {cartError}
  </div>
)}


            {/* Quick trust information */}
            <div className="mt-8 border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EAF0FF] flex items-center justify-center">
                  <Check
                    className="w-4 h-4"
                    style={{ color: COLORS.blue }}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Genuine Products
                  </p>
                  <p className="text-xs text-gray-500">
                    Trusted Kreedum catalogue
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EAF0FF] flex items-center justify-center">
                  <Check
                    className="w-4 h-4"
                    style={{ color: COLORS.blue }}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Customer Support
                  </p>
                  <p className="text-xs text-gray-500">
                    Assistance when you need it
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT DETAILS
      ====================================================== */}

      {(product.descriptionText ||
        product.descriptionHtml ||
        hasSpecifications ||
        product.features?.length ||
        product.highlights?.length) && (
        <section className="max-w-7xl mx-auto px-6 pb-8">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
            <h2
              className="text-2xl font-bold"
              style={{ color: COLORS.navy }}
            >
              Product Details
            </h2>

            {/* Description */}
            {(product.descriptionText ||
              product.descriptionHtml) && (
              <div className="mt-6">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: COLORS.navy }}
                >
                  Description
                </h3>

                {product.descriptionText ? (
                  <p className="mt-3 text-gray-600 leading-7 whitespace-pre-line">
                    {product.descriptionText}
                  </p>
                ) : (
                  <div
                    className="mt-3 text-gray-600 leading-7"
                    dangerouslySetInnerHTML={{
                      __html: product.descriptionHtml,
                    }}
                  />
                )}
              </div>
            )}

            {/* Highlights */}
            {product.highlights?.length > 0 && (
              <div className="mt-7">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: COLORS.navy }}
                >
                  Highlights
                </h3>

                <ul className="mt-3 grid sm:grid-cols-2 gap-3">
                  {product.highlights.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-gray-600"
                      >
                        <Check
                          className="w-4 h-4 mt-1 flex-shrink-0"
                          style={{
                            color: COLORS.blue,
                          }}
                        />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="mt-7">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: COLORS.navy }}
                >
                  Features
                </h3>

                <ul className="mt-3 grid sm:grid-cols-2 gap-3">
                  {product.features.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-gray-600"
                      >
                        <Check
                          className="w-4 h-4 mt-1 flex-shrink-0"
                          style={{
                            color: COLORS.blue,
                          }}
                        />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {hasSpecifications && (
              <div className="mt-8">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: COLORS.navy }}
                >
                  Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 border border-gray-100 rounded-2xl overflow-hidden">
                  <Specification
                    label="SKU"
                    value={product.sku}
                  />

                  <Specification
                    label="Brand"
                    value={product.brand}
                  />

                  <Specification
                    label="Country of Origin"
                    value={product.countryOfOrigin}
                  />

                  <Specification
                    label="Weight"
                    value={product.weight}
                  />

                  <Specification
                    label="Dimensions"
                    value={product.dimensions}
                  />

                  <Specification
                    label="Maximum User Weight"
                    value={product.maxUserWeight}
                  />

                  <Specification
                    label="Warranty"
                    value={product.warranty}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          RELATED PRODUCTS
      ====================================================== */}

      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: COLORS.blue }}
              >
                Explore More
              </p>

              <h2
                className="mt-1 text-2xl md:text-3xl font-bold"
                style={{ color: COLORS.navy }}
              >
                Related Products
              </h2>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold"
              style={{ color: COLORS.blue }}
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={
                  relatedProduct._id ||
                  relatedProduct.slug
                }
                product={{
                  id: relatedProduct._id,
                  name: relatedProduct.name,
                  slug: relatedProduct.slug,
                  brand: relatedProduct.brand,
                  image: relatedProduct.thumbnail,
                  price:
                    Number(
                      relatedProduct.sellingPrice
                    ) || 0,
                  originalPrice:
                    Number(relatedProduct.mrp) || 0,
                  discount:
                    Number(
                      relatedProduct.discountPercent
                    ) || 0,
                  badge: relatedProduct.badge,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Specification({ label, value }) {
  if (!value) return null;

  return (
    <div className="flex justify-between gap-4 px-4 py-3 border-b border-r border-gray-100 text-sm">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium text-gray-800 text-right">
        {value}
      </span>
    </div>
  );
}

function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-[#F6F8FC] pt-24">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse" />

          <div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />

            <div className="h-10 w-4/5 bg-gray-200 rounded mt-4 animate-pulse" />

            <div className="h-4 w-32 bg-gray-200 rounded mt-4 animate-pulse" />

            <div className="h-10 w-40 bg-gray-200 rounded mt-8 animate-pulse" />

            <div className="h-5 w-24 bg-gray-200 rounded mt-6 animate-pulse" />

            <div className="h-12 w-full bg-gray-200 rounded-xl mt-8 animate-pulse" />

            <div className="h-12 w-full bg-gray-200 rounded-xl mt-3 animate-pulse" />
          </div>
        </div>
      </section>
    </main>
  );
}
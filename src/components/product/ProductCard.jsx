import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { COLORS } from "@/config/theme";
import { Badge, Button } from "@/components/common";

export default function ProductCard({ product }) {
  if (!product) return null;

  const image = product.image || product.images?.[0] || "";

  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || 0;
  const discount = Number(product.discount) || 0;

  const brand =
    typeof product.brand === "string"
      ? product.brand
      : product.brand?.name || "Unknown";

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-square bg-[#F6F8FC] overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain p-5 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}
        </Link>

        {/* Discount */}
        {discount > 0 && (
          <div className="absolute top-4 left-4">
            <Badge type="sale">
              {discount}% OFF
            </Badge>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform hover:scale-105"
          style={{ color: COLORS.navy }}
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4">
        <p
          className="text-xs font-medium uppercase tracking-wide mb-1"
          style={{ color: COLORS.slateLight }}
        >
          {brand}
        </p>

        <Link to={`/products/${product.slug}`}>
          <h3
            className="text-sm font-semibold leading-5 line-clamp-2 min-h-[40px] transition-colors hover:text-[#2C62E0]"
            style={{ color: COLORS.navy }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className="text-lg font-bold"
            style={{ color: COLORS.navy }}
          >
            ₹{price.toLocaleString("en-IN")}
          </span>

          {originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Product action */}
        <Link to={`/products/${product.slug}`} className="block mt-4">
          <Button fullWidth size="sm">
            <ShoppingCart className="w-4 h-4" />
            View Product
          </Button>
        </Link>
      </div>
    </article>
  );
}
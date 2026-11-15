import { useState } from "react";

import { brandLogoUrl } from "@/data/brandLogos";

/**
 * A brand's logo, centred in its box. Without a logo (or if it fails to
 * load), the brand name in bold so the tile still reads like a logo.
 */
export default function BrandLogo({ brand, className = "", textClassName = "text-xl md:text-2xl" }) {
  const [failed, setFailed] = useState(false);
  const src = brandLogoUrl(brand);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`${brand.name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex h-full w-full items-center justify-center px-2 text-center font-extrabold uppercase leading-tight tracking-tight text-[#0E1A3D] ${textClassName}`}
      style={{ fontFamily: '"Manrope", sans-serif' }}
    >
      {brand?.name}
    </span>
  );
}

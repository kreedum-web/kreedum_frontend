import { next } from "@vercel/functions";

const API_BASE_URL = "https://api.kreedum.com/api/v1";
const FALLBACK_IMAGE =
  "https://www.kreedum.com/kreedum-international-logo.png";

const SOCIAL_CRAWLERS =
  /WhatsApp|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|TelegramBot|Slackbot|Discordbot|Pinterest/i;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

export const config = {
  runtime: "nodejs",
  matcher: ["/products/:path*"],
};

export default async function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";

  // Normal visitors should reach the React application.
  if (!SOCIAL_CRAWLERS.test(userAgent)) {
    return next();
  }

  const url = new URL(request.url);
  const slug = url.pathname.split("/").filter(Boolean).pop();

  if (!slug) {
    return next();
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/products/${encodeURIComponent(slug)}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      return next();
    }

    const data = await response.json();
    const product = data?.product;

    if (!data?.success || !product) {
      return next();
    }

    const title =
      product.seo?.title ||
      `${product.name || "Product"} | Kreedum Sports`;

    const description =
      product.seo?.description ||
      product.descriptionText ||
      "Explore this product at Kreedum Sports.";

    const image =
      product.thumbnail ||
      product.images?.[0] ||
      FALLBACK_IMAGE;

    const canonicalUrl = url.origin + url.pathname;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

  <meta property="og:site_name" content="Kreedum Sports" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
  <meta property="og:image:alt" content="${escapeHtml(product.name || title)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body>
  <p>${escapeHtml(product.name || title)}</p>
  <a href="${escapeHtml(canonicalUrl)}">View product on Kreedum Sports</a>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Product social preview error:", error);
    return next();
  }
}
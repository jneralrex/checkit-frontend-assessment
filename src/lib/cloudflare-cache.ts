/**
 * Cloudflare Workers adapter for OpenNext
 * Enables edge caching and serverless execution
 * 
 * When deploying with OpenNext, this configuration:
 * - Maps Next.js fetch cache semantics to Workers Cache API
 * - Implements edge-level caching via Cloudflare
 * - Provides cache status headers for verification
 */

// OpenNext Configuration
// This file documents the caching strategy for Cloudflare Workers

export interface CacheConfig {
  // Images cached for 1 year (immutable)
  images: {
    cacheTtl: 31536000; // 1 year
    cacheEverything: true;
  };
  // API responses cached with revalidation
  api: {
    cacheTtl: 3600; // 1 hour
    sMaxAge: 3600;
    staleWhileRevalidate: 86400; // 1 day
  };
}

/**
 * Next.js Fetch Cache to Cloudflare Workers Mapping
 * 
 * next.js revalidate: N  → Cloudflare Cache-Control: s-maxage=N, stale-while-revalidate=X
 * next.js force-cache   → Cloudflare Cache-Control: public, immutable
 * next.js no-store      → Cloudflare Cache-Control: no-cache, no-store, must-revalidate
 * 
 * Implementation in lib/pokemon.ts:
 * - Listing page: revalidate: 3600 (ISR at 1 hour)
 * - Detail pages: revalidate: 3600 (ISR at 1 hour)  
 * - Both include Cache-Control headers for Cloudflare edge
 */

/**
 * Cloudflare Cache Status Header
 * 
 * When deployed, responses will include:
 * x-cache-status: HIT    (served from Cloudflare edge)
 * x-cache-status: MISS   (fetched from origin)
 * 
 * Verify with:
 * curl -I https://your-deployment.workers.dev/pokemon/25
 */

export const cacheStrategy = {
  // Listing pages benefit from aggressive caching
  listingPage: {
    cacheTtl: 3600, // 1 hour
    cacheEverything: true,
    bypassCache: false,
  },
  
  // Detail pages can use slightly longer caching
  detailPage: {
    cacheTtl: 3600, // 1 hour
    cacheEverything: true,
    bypassCache: false,
  },
  
  // Dynamic API data with shorter TTL
  apiData: {
    cacheTtl: 300, // 5 minutes for search results
    cacheEverything: false,
    bypassCache: false,
  },
  
  // Images use Cloudflare's image optimization
  images: {
    cacheTtl: 31536000, // 1 year
    cacheEverything: true,
    bypassCache: false,
  },
};

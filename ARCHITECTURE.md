# Architecture & Decision Documentation

## Project Structure

```
src/
├── app/                     # Next.js 14 App Router
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Listing page with Suspense
│   ├── loading.tsx         # Global loading skeleton
│   ├── error.tsx           # Global error boundary
│   └── pokemon/
│       └── [id]/
│           └── page.tsx    # Dynamic detail page
├── components/              # Reusable React components
│   ├── PokemonCard.tsx     # Card component for listing
│   ├── SearchFilters.tsx   # Search input with debounce
│   ├── Pagination.tsx      # Pagination controls
│   ├── Breadcrumb.tsx      # Navigation breadcrumb
│   ├── SkeletonLoader.tsx  # Loading placeholders
│   ├── EmptyState.tsx      # Empty state UI
│   ├── ErrorDisplay.tsx    # Error messages
│   ├── index.ts            # Component exports
│   ├── *.test.tsx          # Component tests
├── lib/                     # Business logic & utilities
│   ├── pokemon.ts          # PokéAPI abstraction
│   └── cloudflare-cache.ts # Cache configuration docs
├── types/                   # TypeScript definitions
│   └── pokemon.ts          # Pokemon interfaces
├── hooks/                   # Custom React hooks
│   └── useSearch.ts        # Search state management
└── styles/                  # Global styles
    └── globals.css          # Tailwind + CSS components
```

## Core Architectural Decisions

### 1. **Server Components Everywhere** 

**Decision**: Use async server components for all page-level components

**Why**:
- Eliminates client-side data fetching waterfall
- Smaller JavaScript bundle (no fetch code sent to browser)
- Direct database/API access from server
- SEO-friendly with full HTML content
- Better performance with streaming support

**Example**:
```typescript
// src/app/page.tsx
export default async function Home({ searchParams }) {
  const params = await searchParams;
  // This runs server-side, never sent to browser
  const data = await getPokemonList();
  return <PokemonListContent data={data} />;
}
```

### 2. **API Abstraction Layer** 

**Location**: `src/lib/pokemon.ts`

**Decision**: All external API calls go through dedicated functions

**Why**:
- Single source of truth for API logic
- Caching policy centralized
- Easy to switch APIs later
- Type-safe with TypeScript
- Easier testing and mocking

**Example**:
```typescript
// Components never call fetch directly
// Instead: import { getPokemonList } from '@lib/pokemon';

export async function getPokemonList(limit: number, offset: number) {
  const response = await fetch(url, {
    next: { revalidate: 3600 }  // Cache strategy here
  });
  return response.json();
}
```

### 3. **Client-Only Search** 

**Location**: `src/components/SearchFilters.tsx`

**Decision**: Keep search component as client component for interactivity

**Why**:
- Instant debounced input feedback
- URL params for shareability
- useSearchParams hook works client-side
- Router.push triggers server-side re-render
- Clean separation of concerns

**Example**:
```typescript
'use client';  // Only this component is interactive
const [query, setQuery] = useState(searchParams.get('q') || '');
// Debounce and update URL on parent server component
```

### 4. **Suspense Boundaries for Loading States** 

**Location**: `src/app/page.tsx`, `src/app/pokemon/[id]/page.tsx`

**Decision**: Wrap async data-fetching components in `<Suspense>`

**Why**:
- Proper loading UI from the start
- Progressive rendering (header loads fast)
- Skeleton loaders instead of spinners
- Better perceived performance
- Part of Next.js streaming

**Example**:
```typescript
<Suspense fallback={<PokemonListSkeleton />}>
  <PokemonListContent /> {/* This async component loads */}
</Suspense>
```

### 5. **Metadata Exports for SEO** 

**Location**: `src/app/layout.tsx`, `src/app/pokemon/[id]/page.tsx`

**Decision**: Use Next.js `Metadata` API for all meta tags

**Why**:
- Type-safe metadata management
- og:image and dynamic title support
- Works with Server Components
- Single source for all head tags
- Better for SEO

**Example**:
```typescript
export async function generateMetadata({ params }) {
  const pokemon = await getPokemonById(params.id);
  return {
    title: `${pokemon.name} - Pokémon Explorer`,
    openGraph: {
      images: [{ url: pokemon.imageUrl }]
    }
  };
}
```

### 6. **Tailwind-Only Styling** 

**Decision**: No component library (shadcn, MUI, Chakra)

**Why**:
- Demonstrates CSS skills
- Smaller bundle (~15KB final CSS)
- Full control over styling
- No pre-built component overhead
- Custom design system possible

**Example**:
```typescript
// src/styles/globals.css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow;
  }
}

// Then in components:
<div className="card p-4">...</div>
```

### 7. **URL-Driven State** 

**Decision**: Use `searchParams` and `useSearchParams` for state

**Why**:
- URLs are shareable
- Browser back/forward works correctly
- SEO-friendly
- Bookmarkable
- No global state needed

**Flow**:
```
User types search
  ↓
Client component updates URL via router.push()
  ↓
Server component re-renders with new searchParams
  ↓
New data fetched and rendered
```

### 8. **ISR (Incremental Static Regeneration)** 

**Location**: `src/lib/pokemon.ts`

**Decision**: Use `revalidate: 3600` for both listing and detail pages

**Why**:
- Pages cached as static HTML
- Regenerated every hour (or on-demand)
- Instant page loads
- Fresh data periodically
- Scales well on edge

**Example**:
```typescript
fetch(url, {
  next: {
    revalidate: 3600  // Regenerate hourly
  }
})
```

### 9. **Error Boundaries & Loading States** 

**Location**: `src/app/error.tsx`, `src/app/loading.tsx`

**Decision**: Dedicated error and loading files per route

**Why**:
- Automatic error handling per segment
- Consistent loading UX
- Graceful degradation
- No try-catch spam in components
- Built-in to Next.js

## Type Safety

**File**: `src/types/pokemon.ts`

All shared types defined once:
- `Pokemon`: Full Pokémon response
- `PokemonListItem`: Card display format
- `SearchFilters`: Search/filter params
- `PaginationInfo`: Pagination state

Benefits:
- No inline `any` types
- Type definitions evolve with API
- Reusable across components

## Testing Strategy

**Location**: `src/components/*.test.tsx`

Tested components:
1. **PokemonCard.tsx**: 5 tests, 100% coverage
2. **EmptyState.tsx**: 4 tests, 100% coverage

**Tools**: Vitest + React Testing Library

**Philosophy**:
- Test user-visible behavior
- Not implementation details
- Mock Next.js modules (next/link, next/image)
- Fast and isolated tests

## Performance Layers

```
┌─────────────────────────────────────┐
│  Browser Cache (1 year)             │ ← Static assets
├─────────────────────────────────────┤
│  Cloudflare Edge Cache (1 hour)     │ ← Pages via Workers
├─────────────────────────────────────┤
│  Next.js ISR Cache (1 hour)         │ ← Regeneration
├─────────────────────────────────────┤
│  PokéAPI (Real-time)                │ ← Source
└─────────────────────────────────────┘
```

## Alternatives Considered

| Solution | Considered | Reason Not Chosen |
|----------|-----------|-------------------|
| Pages Router | ❌ | App Router is modern standard |
| Client-side SSR | ❌ | Slower, larger JS, poor SEO |
| SWR for data | ❌ | Server components better for SSR |
| Redux | ❌ | useSearchParams + URL state sufficient |
| CSS-in-JS | ❌ | Tailwind scales better, no runtime |
| UI Component Lib | ❌ | Demonstrate CSS skills |
| Vercel Hosting | ❌ | Cloudflare Workers preferred |

## Scaling Considerations

If this app grew 10x:

1. **Database Layer**
   - Replace PokéAPI with cached database
   - Add Redis for frequently accessed Pokemon

2. **Search**
   - Elasticsearch for fuzzy search
   - Typeahead suggestions

3. **Analytics**
   - Cloudflare Analytics for Core Web Vitals
   - Custom events for user behavior

4. **Images**
   - Cloudflare Image Optimization
   - R2 for backup storage

5. **API**
   - GraphQL layer over database
   - Rate limiting and authentication

6. **Frontend**
   - More granular code splitting
   - Service Worker for offline mode
   - Progressive Web App features

## Trade-offs Made

###  Chose Pagination over Infinite Scroll
- **Why**: Simpler implementation, clearer UX
- **Cost**: Less novelty
- **Justification**: Pagination performs better, more accessible

###  Search returns single result
- **Why**: Simple PokéAPI doesn't support full-text search
- **Cost**: Can't search across multiple results
- **Alternative**: Would need to cache all Pokemon locally

###  No client-side caching
- **Why**: PokéAPI already fast, ISR sufficient
- **Cost**: Slightly larger data transfers
- **Justification**: Added complexity not justified

###  No animations/transitions in UI
- **Why**: Focus on core functionality
- **Cost**: Less visual appeal
- **Justification**: Can be added without breaking architecture

---

See [OPTIMIZATION.md](./OPTIMIZATION.md) for performance architecture details.

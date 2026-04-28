# Deployment Guide

## Cloudflare Workers Deployment

This project is optimized for deployment to Cloudflare Workers using the OpenNext adapter.

### Prerequisites

- Cloudflare account with Workers enabled
- `wrangler` CLI installed globally: `npm install -g @cloudflare/wrangler`
- Account ID and API token from Cloudflare dashboard

### Step 1: Configure Wrangler

Edit `wrangler.toml` with your Cloudflare details:

```toml
name = "your-project-name"
account_id = "your-account-id"
compatibility_date = "2024-12-19"
```

### Step 2: Set Secrets

```bash
# Add your API token as an environment variable
wrangler secret put CLOUDFLARE_API_TOKEN
# Paste your API token when prompted
```

### Step 3: Build and Deploy

```bash
npm run build
npm run deploy
```

Your app will be available at `https://your-project-name.workers.dev`

## Edge Caching Strategy

The application uses the following cache settings:

| Resource | TTL | Strategy |
|----------|-----|----------|
| Listing pages | 1 hour | ISR with stale-while-revalidate |
| Detail pages | 1 hour | ISR with stale-while-revalidate |
| Images | 1 year | Immutable caching |
| API responses | 1 hour | SWR for stale data |

### Verifying Cache Status

Check if caching is working:

```bash
curl -I https://your-deployment.workers.dev/
# Look for cache headers
```

## Alternative: Vercel Deployment

If you prefer Vercel over Cloudflare Workers:

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will automatically optimize the build for its platform.

**Note**: Cloudflare Workers deployment is preferred as it matches the production hosting stack.

## Environment Variables

For production deployment, ensure:

```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Monitoring

After deployment:

1. Visit your live URL and verify functionality
2. Check Lighthouse scores on PageSpeed Insights
3. Monitor Core Web Vitals in Cloudflare Analytics
4. Review logs for any errors

## Rollback

To rollback to a previous version:

```bash
wrangler rollback  # If using Cloudflare
# or
vercel rollback    # If using Vercel
```

## CI/CD Integration

The project includes GitHub Actions workflow (`.github/workflows/deploy.yml`) for automatic deployment on push to main branch.

To enable:

1. Add secrets to GitHub repository:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. Push to main branch to trigger automatic deployment

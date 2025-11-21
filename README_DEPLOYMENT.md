# AlphaNest GitHub Pages Deployment Guide

## Overview

This document describes how AlphaNest is configured for GitHub Pages deployment and how to work with it locally.

## Configuration Changes

### 1. Vite Configuration (`frontend/vite.config.ts`)

The Vite config now supports a `BASE_URL` environment variable for GitHub Pages:

```typescript
export default defineConfig({
  base: process.env.BASE_URL || '/',
  // ... rest of config
});
```

This ensures all asset paths are prefixed with `/AlphaNest` when deployed to GitHub Pages.

### 2. Demo Mode Support

Demo mode is automatically enabled in two ways:

1. **URL Parameter**: Add `?demo=true` to any URL
2. **Environment Variable**: Set `VITE_DEMO_MODE=true` during build

When in demo mode:
- A yellow banner appears at the top indicating "DEMO MODE"
- All API calls use mock/simulated data instead of hitting the backend
- The app functions fully without requiring a backend connection

### 3. GitHub Actions Workflow (`.github/workflows/deploy-pages.yml`)

The workflow:
- Runs on push to `main` branch
- Builds the frontend with `BASE_URL=/AlphaNest`
- Enables demo mode with `VITE_DEMO_MODE=true`
- Deploys to GitHub Pages

### 4. SPA Routing Support

Two files ensure proper routing on GitHub Pages:

- **`frontend/public/404.html`**: Redirects 404s to index.html with path preserved
- **`frontend/public/.nojekyll`**: Prevents Jekyll processing of `_`-prefixed files

## Local Development

### Standard Development (No Base Path)

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5000/` with no base path.

### Testing GitHub Pages Configuration Locally

```bash
cd frontend
BASE_URL=/AlphaNest VITE_DEMO_MODE=true npm run build
npm run preview
```

The preview server will serve the built files. Access at `http://localhost:4173/AlphaNest/`

### Testing Demo Mode

Add `?demo=true` to any URL to enable demo mode:
- Development: `http://localhost:5000/?demo=true`
- Preview: `http://localhost:4173/AlphaNest/?demo=true`
- Production: `https://cywf.github.io/AlphaNest/?demo=true`

## Deployment

### Automatic Deployment

Push to the `main` branch automatically triggers deployment via GitHub Actions.

### Manual Deployment

If needed, you can trigger a manual deployment:
1. Go to the repository's Actions tab
2. Select "Deploy Frontend to GitHub Pages" workflow
3. Click "Run workflow"

## Verification Checklist

After deployment, verify:

- [ ] Main site loads: `https://cywf.github.io/AlphaNest/`
- [ ] Demo mode works: `https://cywf.github.io/AlphaNest/?demo=true`
- [ ] Assets load correctly (check browser DevTools Network tab)
- [ ] Navigation between pages works without 404 errors
- [ ] Direct links to sub-pages work (e.g., refresh on `/AlphaNest/arbitrage`)
- [ ] CSS and fonts load properly
- [ ] Demo mode banner appears when `?demo=true` is in URL
- [ ] Mock data displays in arbitrage tables and other features

## Project Structure

```
AlphaNest/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml        # GitHub Pages deployment workflow
├── frontend/
│   ├── public/
│   │   ├── .nojekyll               # Prevents Jekyll processing
│   │   └── 404.html                # SPA routing fallback
│   ├── src/
│   │   ├── config/
│   │   │   └── api.ts              # API config with demo mode detection
│   │   ├── lib/
│   │   │   └── apiClient.ts        # API client with demo mode support
│   │   └── layouts/
│   │       └── HudLayout.tsx       # Layout with demo mode banner
│   ├── vite.config.ts              # Vite config with BASE_URL support
│   └── package.json                # Updated package name to "alphanest"
└── README_DEPLOYMENT.md            # This file
```

## Troubleshooting

### Assets Not Loading

If CSS/JS files show 404 errors:
1. Check that `BASE_URL=/AlphaNest` was set during build
2. Verify the workflow sets the environment variable correctly
3. Check browser DevTools to see actual URLs being requested

### 404 on Page Refresh

If refreshing a sub-page returns 404:
1. Verify `404.html` exists in the deployed site
2. Check that `.nojekyll` file is present
3. Ensure GitHub Pages is configured to serve from the correct branch

### Demo Mode Not Working

If demo mode doesn't activate:
1. Check URL includes `?demo=true`
2. Verify `IS_DEMO_MODE` is exported from `config/api.ts`
3. Check browser console for any errors
4. Ensure mock data functions exist in `lib/arbitrage.ts`

## Package Name Update

The package name has been updated from `spark-template` to `alphanest` to reflect the project's identity. This is a cosmetic change and doesn't affect functionality.

## Additional Notes

- The app uses Vite for bundling and development
- Built assets are optimized and minified for production
- The base URL is only applied in production builds, not during development
- Demo mode works in both development and production environments

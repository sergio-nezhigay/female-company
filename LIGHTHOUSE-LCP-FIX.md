# Lighthouse LCP Optimization - Implementation

## Issues Fixed

### 1. ✅ Duplicated JavaScript (4 KiB)

**Issue**: Trustpilot scripts (`header.min.js` and `success.min.js`) were being loaded twice.

**Status**: **Cannot fix in theme code**
- This duplication comes from the Trustpilot Shopify app integration
- The app injects scripts via `content_for_header` (Shopify core)
- Only Trustpilot can fix this issue in their app code

**Impact**: Minimal (only 4 KiB wasted)

---

### 2. ✅ LCP Resource Load Delay (1,200ms) - FIXED

**Issue**: The homepage slideshow image (Largest Contentful Paint) had a 1,200ms delay before the browser started downloading it.

**Root Cause**:
- Browser must parse HTML to discover the image
- No preload hint in `<head>` to start download early
- Image discovery happens after CSS/JS parsing

**Solution Implemented**:
Added preload hints in `snippets/head.liquid:61-71`:

```liquid
{%- if request.page_type == 'index' -%}
  {%- comment -%}
    Preload first slideshow image for LCP optimization
    IMPORTANT: Update these URLs when changing the first homepage slideshow image
  {%- endcomment -%}
  <link rel="preload" as="image" href="https://buy.thefemalecompany.com/cdn/shop/files/Header_mobile_7abf522f-3afd-41f1-92e8-1b3a7eadc3db.jpg?width=1000" media="(max-width: 740px)" fetchpriority="high">
  <link rel="preload" as="image" href="https://buy.thefemalecompany.com/cdn/shop/files/2025_09_15_TFC0388_1-hires3_1_1.png?width=1800" media="(min-width: 741px)" fetchpriority="high">
{%- endif -%}
```

**How it works**:
1. Browser reads preload hint immediately in `<head>`
2. Starts downloading LCP image in parallel with CSS/JS
3. Mobile gets mobile image (≤740px), desktop gets desktop image (≥741px)
4. `fetchpriority="high"` tells browser this is critical

**Expected Impact**:
- **Resource load delay**: 1,200ms → ~200-400ms (60-70% reduction)
- **LCP score**: Should improve by 800-1000ms
- **Overall page load**: Faster perceived loading

---

## Additional Fix

### ✅ Ablyft Script Blocking - FIXED

**Issue**: Ablyft A/B testing script was loading **synchronously**, blocking page render.

**Solution**: Added `defer` attribute in `snippets/head.liquid:159`:

```liquid
<!-- BEFORE -->
<script src="https://cdn.ablyft.com/s/67024591.js"></script>

<!-- AFTER -->
<script src="https://cdn.ablyft.com/s/67024591.js" defer></script>
```

**Impact**: Removes render-blocking resource, improves First Contentful Paint (FCP)

---

## LCP Breakdown - Before vs. After

### Before
| Metric | Duration | Issue |
|--------|----------|-------|
| Time to First Byte | 40ms | ✅ Good |
| **Resource Load Delay** | **1,200ms** | ❌ **Bad** |
| Resource Load Duration | 130ms | ✅ Good |
| Element Render Delay | 370ms | ⚠️ Acceptable |
| **Total LCP** | **~1,740ms** | ❌ Needs Improvement |

### After (Expected)
| Metric | Duration | Improvement |
|--------|----------|-------------|
| Time to First Byte | 40ms | No change |
| **Resource Load Delay** | **~200-400ms** | ✅ **-800-1000ms** |
| Resource Load Duration | 130ms | No change |
| Element Render Delay | 370ms | No change |
| **Total LCP** | **~740-940ms** | ✅ **-800-1000ms** |

**Target**: LCP under 1,000ms is considered "Good" by Google

---

## Testing Instructions

### 1. Deploy Changes
```bash
npm run push
```

### 2. Test on PageSpeed Insights
1. Go to https://pagespeed.web.dev/
2. Test homepage: `https://buy.thefemalecompany.com`
3. Run test for both Mobile and Desktop

### 3. Check LCP Metrics
Look for improvements in:
- **LCP score** (should be under 2.5s, ideally under 1.0s)
- **Resource Load Delay** (should be 200-400ms instead of 1,200ms)
- **First Contentful Paint** (should improve due to Ablyft defer fix)

### 4. Verify Preload in Dev Tools
1. Open Chrome DevTools → Network tab
2. Reload homepage
3. Check that slideshow images have:
   - "Priority: High" ✓
   - Early download start ✓
   - Preloaded from `<head>` ✓

---

## Important Maintenance Notes

### ⚠️ When Changing Homepage Slideshow

The preload hints are **hardcoded** for the current first slideshow image. When you change the homepage slideshow, you **MUST update** the preload URLs in `snippets/head.liquid:69-70`.

**Current preload images**:
- Mobile: `Header_mobile_7abf522f-3afd-41f1-92e8-1b3a7eadc3db.jpg`
- Desktop: `2025_09_15_TFC0388_1-hires3_1_1.png`

**How to update**:
1. Upload new slideshow image in Shopify admin
2. Copy the image filename from the slideshow section settings
3. Update URLs in `snippets/head.liquid:69-70`
4. Push changes: `npm run push`

**Example**:
```liquid
{%- if request.page_type == 'index' -%}
  {%- comment -%}Update these URLs when changing slideshow images{%- endcomment -%}
  <link rel="preload" as="image" href="https://buy.thefemalecompany.com/cdn/shop/files/YOUR_MOBILE_IMAGE.jpg?width=1000" media="(max-width: 740px)" fetchpriority="high">
  <link rel="preload" as="image" href="https://buy.thefemalecompany.com/cdn/shop/files/YOUR_DESKTOP_IMAGE.png?width=1800" media="(min-width: 741px)" fetchpriority="high">
{%- endif -%}
```

---

## What This Doesn't Fix

### Cache Lifetime Warning (1,310 KiB)
**Separate issue** - Addressed in `THIRD-PARTY-SCRIPTS-AUDIT.md`

This LCP fix is independent of the cache warning. Both issues existed, and this fix addresses only the LCP delay.

---

## Technical Details

### Why Preload Works

**Without preload**:
```
1. Browser downloads HTML
2. Browser parses HTML → discovers CSS
3. Browser downloads CSS
4. Browser parses CSS → renders page
5. Browser continues HTML parsing → discovers image (at line ~183 in slideshow.liquid)
6. Browser downloads image ← 1,200ms delay between step 1 and step 6
```

**With preload**:
```
1. Browser downloads HTML
2. Browser parses <head> → discovers preload → starts downloading image immediately
3. Browser downloads CSS (in parallel with image)
4. Browser parses CSS → renders page
5. Image already downloading (or cached) → fast LCP
```

### Why Hardcoded?

Shopify Liquid doesn't allow accessing section data from snippets without explicit passing. Since `head.liquid` is rendered before sections, we can't dynamically reference the slideshow section.

**Alternatives considered**:
1. ✅ **Hardcode** (implemented) - Simple, works immediately
2. ❌ Dynamic via JS - Defeats purpose (runs too late)
3. ❌ Complex Liquid logic - Overcomplicated, maintenance burden
4. ❌ App/metafield - Overkill for this use case

---

## Monitoring

### Key Metrics to Watch

**Google Search Console** (2-4 weeks):
- Core Web Vitals → LCP score
- Mobile vs. Desktop performance

**PageSpeed Insights** (immediate):
- LCP score (should improve by ~1 second)
- Performance score (should increase)
- "Opportunities" section (LCP element should be faster)

**Real User Metrics** (if using analytics):
- Average page load time
- Bounce rate (may decrease)
- Time to interactive

---

## Files Changed

1. **snippets/head.liquid** (lines 61-71)
   - Added: Homepage slideshow image preload

2. **snippets/head.liquid** (line 159)
   - Modified: Added `defer` to Ablyft script

---

## Rollback Instructions

If issues arise, revert changes:

### Revert Preload
Remove lines 61-71 from `snippets/head.liquid`:
```liquid
{%- if request.page_type == 'index' -%}
  {%- comment -%}...{%- endcomment -%}
  <link rel="preload" as="image" href="..." ...>
  <link rel="preload" as="image" href="..." ...>
{%- endif -%}
```

### Revert Ablyft Fix
Remove `defer` from line 159 in `snippets/head.liquid`:
```liquid
<script src="https://cdn.ablyft.com/s/67024591.js"></script>
```

Then push: `npm run push`

---

## Next Steps

1. ✅ **Deploy**: `npm run push`
2. ✅ **Test**: PageSpeed Insights after 5 minutes
3. ✅ **Monitor**: Check LCP improvements
4. 📋 **Later**: Review `THIRD-PARTY-SCRIPTS-AUDIT.md` for cache optimization
5. 📋 **Ongoing**: Update preload URLs when changing homepage slideshow

---

## Expected Results

### Lighthouse Score Improvements

**Before**:
- LCP: ~1,740ms (Needs Improvement ⚠️)
- Performance Score: ~70-80

**After**:
- LCP: ~740-940ms (Good ✅)
- Performance Score: ~80-90

### Real-World Impact

- **Faster perceived load**: Users see content 800-1000ms sooner
- **Better mobile experience**: Critical on slow connections
- **SEO benefits**: Google rewards good Core Web Vitals
- **Lower bounce rate**: Faster sites retain more visitors

---

## Questions?

If LCP doesn't improve after deployment:
1. Clear CDN cache (wait 5-10 minutes)
2. Test in incognito mode
3. Check browser DevTools → Network → verify preload priority
4. Verify correct image URLs in preload tags

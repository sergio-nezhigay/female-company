# Third-Party Scripts Audit - Cache Lifetime Warning

## Executive Summary

**Total Third-Party Scripts**: 21 services
**Estimated Removable Size**: 400-600 KiB
**Cache Control**: Only 30% of resources have >1h cache

## Problem

Lighthouse reports "Use efficient cache lifetimes" warning with 1,310 KiB of short-cached resources:
- **731 KiB**: Shopify CDN (UNFIXABLE - Shopify controls cache headers)
- **580 KiB**: Third-party services (FIXABLE - Remove unnecessary services)

## Immediate Fix Applied ✅

**File**: `snippets/head.liquid:159`
**Issue**: Ablyft script loading synchronously (blocking page render)
**Fix**: Added `defer` attribute

```liquid
<!-- BEFORE -->
<script src="https://cdn.ablyft.com/s/67024591.js"></script>

<!-- AFTER -->
<script src="https://cdn.ablyft.com/s/67024591.js" defer></script>
```

---

## Services Audit

### 🔴 HIGH PRIORITY - Duplicate Services

#### 1. Review Platforms (Choose ONE)
Currently running **THREE** review platforms simultaneously:

| Service | Size | Cache TTL | Location |
|---------|------|-----------|----------|
| **Reviews.io** | 117 KiB | 2-20h | Content for header |
| **Trustpilot** | 17 KiB | 1d | `snippets/footer.liquid:17` |
| **Yotpo** | 104 KiB | None ⚠️ | Content for header |

**Total Waste**: ~220 KiB

**Recommendation**: Keep ONE platform (Reviews.io has best integration). Remove:
- Trustpilot script from `snippets/footer.liquid`
- Yotpo from Shopify apps (will auto-remove scripts)

**Estimated Savings**: 120-220 KiB

---

#### 2. A/B Testing Tools (Choose ONE)
Currently running **TWO** A/B testing platforms:

| Service | Size | Cache TTL | Location | Issue |
|---------|------|-----------|----------|-------|
| **Intelligems** | 97 KiB | 5m | `snippets/head.liquid:171` | Low cache |
| **Ablyft** | 14 KiB | 1m | `snippets/head.liquid:159` | Fixed ✅ |

**Recommendation**: Choose one platform. If keeping Intelligems, remove:
```liquid
<!-- Remove from snippets/head.liquid -->
<link rel="preload" as="script" href="https://cdn.ablyft.com/s/67024591.js">
<script src="https://cdn.ablyft.com/s/67024591.js" defer></script>
```

**Estimated Savings**: 14-97 KiB

---

### 🟡 MEDIUM PRIORITY - Analytics Overload

You have **FIVE** analytics/tracking services running simultaneously:

| Service | Size | Cache TTL | Purpose | Location |
|---------|------|-----------|---------|----------|
| **Facebook Pixel** | 111 KiB | 20m | Social ads | Content for header |
| **Tracify.ai** | 75 KiB | 1.5h | Attribution | `snippets/load-tracify.liquid` |
| **Clarity** | 25 KiB | 1d | Session replay | Content for header |
| **LinkedIn Insight** | 19 KiB | 1d | B2B ads | `snippets/footer.liquid:58-70` |
| **TVSquared** | 9 KiB | 10m | TV attribution | Content for header |

**Questions to Ask**:
1. Do you actively use TV advertising? (If not, remove TVSquared)
2. Do you actively use LinkedIn ads? (If not, remove LinkedIn Insight Tag)
3. Do you review Clarity session recordings? (If not, remove Clarity)
4. Do you need both Tracify AND Facebook for attribution?

**Potential Savings**: 30-100 KiB (depending on which services you remove)

---

### 🟢 LOW PRIORITY - Keep But Optimize

#### Required Services (GDPR/Core functionality)
- **Usercentrics** (39 KiB, 30m-1h) - Cookie consent (REQUIRED for EU)
- **Sentry** (1 KiB, 1h) - Error tracking (RECOMMENDED)
- **Klaviyo** (46 KiB, 1d) - Email marketing (if actively used)

#### Shopify Apps (Verify Usage)
- **506.io** (75 KiB, 7d ✅) - Product labels - Check if used
- **Kimonix** (14 KiB, 10m) - Product recommendations - Check if used
- **GoAffPro** (5 KiB, 10m) - Affiliate program - Check if used
- **Linkster** (3 KiB, none) - Affiliate tracking - Check if used

**Action**: Review Shopify admin → Apps and uninstall unused apps

#### Other Services
- **PageFly** - Page builder (if actively used, keep)

---

## Recommended Action Plan

### Phase 1: Quick Wins (5-10 minutes)

1. ✅ **COMPLETED**: Added defer to Ablyft script
2. **Choose ONE review platform** (recommend Reviews.io):
   - Uninstall Yotpo app from Shopify admin
   - Remove Trustpilot script from `snippets/footer.liquid:17`
3. **Remove unused analytics**:
   - Remove TVSquared if not using TV ads
   - Remove LinkedIn Insight Tag if not using LinkedIn ads

**Expected Impact**: 150-250 KiB reduction

### Phase 2: Platform Consolidation (30 minutes)

4. **Choose ONE A/B testing tool**:
   - If keeping Intelligems, uninstall Ablyft
   - If keeping Ablyft, remove Intelligems
5. **Audit Shopify apps**:
   - Check if 506.io, Kimonix, GoAffPro are actively used
   - Uninstall unused apps

**Expected Impact**: 100-150 KiB reduction

### Phase 3: Advanced Optimization (1-2 hours)

6. **Lazy load non-critical scripts**:
   - Load Klaviyo only when user interacts with email signup
   - Load review widgets only when in viewport
   - Delay Clarity until after page load
7. **Consider consolidating attribution**:
   - Evaluate if you need both Tracify and Facebook Pixel

**Expected Impact**: Improved initial page load, better Core Web Vitals

---

## Implementation: Removing Services

### Remove Trustpilot
**File**: `snippets/footer.liquid:17`
```liquid
<!-- REMOVE THIS LINE -->
<script defer data-usercentrics="Trustpilot" type="text/plain" src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"></script>
```

### Remove LinkedIn Insight Tag
**File**: `snippets/footer.liquid:58-70`
```liquid
<!-- REMOVE THIS ENTIRE BLOCK -->
<script type="text/plain" data-usercentrics="LinkedIn Insight Tag">
  _linkedin_partner_id = "7526625";
  ...
</script>
```

### Remove Yotpo
1. Go to Shopify Admin → Apps
2. Uninstall "Yotpo" app
3. Scripts will auto-remove

### Remove Ablyft (if choosing Intelligems)
**File**: `snippets/head.liquid:59` and `:159`
```liquid
<!-- REMOVE preload -->
<link rel="preload" as="script" href="https://cdn.ablyft.com/s/67024591.js">

<!-- REMOVE script -->
<script src="https://cdn.ablyft.com/s/67024591.js" defer></script>
```

---

## The Cache Issue: Why This Warning Exists

### Shopify CDN (Unfixable)
Shopify sets 1-minute cache on theme assets:
- `vendor.js`, `vendor.css` (184 KiB + 97 KiB)
- `app.css`, `app.js` (4 KiB each)
- Preview bar scripts (72 KiB)

**Why?**: Shopify wants changes to appear immediately when you update your theme. This is a platform limitation.

**Can't be fixed**: No amount of theme development will change Shopify's CDN headers.

### Third-Party Services (Fixable)
Each service controls its own cache policy:
- **Good cache** (>1 day): 506.io (7d), Klaviyo (1d), Trustpilot (1d)
- **Poor cache** (<1h): Shopify CDN (1m), Ablyft (1m), Intelligems (5m)

**Can be fixed**: Remove services or accept the limitation.

---

## Expected Results

### Current State
- **Lighthouse Score**: Cache warning for 1,310 KiB
- **Third-party impact**: ~580 KiB with short cache

### After Quick Wins (Phase 1)
- **Removed**: 150-250 KiB
- **Remaining warning**: ~1,100 KiB (mostly Shopify CDN)

### After Full Optimization (Phase 1-3)
- **Removed**: 300-500 KiB
- **Remaining warning**: ~800-1,000 KiB
- **Note**: 700+ KiB will always remain due to Shopify CDN

### Realistic Expectation
You can reduce the warning by **30-40%**, but cannot eliminate it completely due to Shopify platform limitations.

---

## Questions to Answer

Before removing services, verify:

1. **Reviews**: Which review platform drives the most conversions?
2. **A/B Testing**: Which platform is actively running tests?
3. **Analytics**: Which dashboards do you check weekly?
4. **TV Ads**: Are you currently running TV advertising? (TVSquared)
5. **LinkedIn Ads**: Are you running LinkedIn ad campaigns?
6. **Shopify Apps**: When was the last time you used 506.io, Kimonix, GoAffPro?

---

## Next Steps

1. **Test the Ablyft fix**: Push changes and test A/B testing still works
2. **Decision meeting**: Review this audit with marketing/analytics team
3. **Phase 1 implementation**: Remove duplicate services (30 min)
4. **Monitoring**: Check Google Analytics/Search Console for 1-2 weeks
5. **Phase 2-3**: Advanced optimizations if needed

---

## Technical Notes

### Why Cache Matters
- **Short cache (<1h)**: Browser re-downloads every visit
- **Long cache (>1d)**: Browser uses local copy, faster page load
- **Trade-off**: Longer cache = harder to update scripts

### Why Third-Parties Have Short Cache
- **Rapid updates**: Services push fixes without merchant intervention
- **A/B testing**: Need to change experiments quickly
- **Analytics**: Add new features frequently

### The Shopify Platform Limitation
Shopify prioritizes **merchant convenience** over **extreme performance**:
- 1-minute cache = changes appear instantly
- Longer cache = merchants wait hours for theme updates

This is a **conscious platform choice**, not a bug.

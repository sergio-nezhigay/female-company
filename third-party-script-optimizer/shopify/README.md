# 🛍️ Shopify Integration Guide

Complete guide for integrating the Third-Party Script Optimizer into your Shopify theme.

---

## 📦 What's Included

```
shopify/
├── snippets/
│   ├── optimized-analytics.liquid      # Analytics optimizer (GTM, FB, Bing, LinkedIn)
│   ├── third-party-optimizer.liquid    # Widget optimizer (Reviews.io, Yotpo, etc.)
│   └── head-integration.liquid         # Complete integration example
└── README.md                            # This file
```

---

## ⚡ Quick Start (10 Minutes)

### Step 1: Upload Core Library

1. Go to **Admin → Online Store → Themes → Actions → Edit code**
2. Navigate to `Assets` folder
3. Click **Add a new asset → Create a blank file**
4. Name it: `defer-third-party.js`
5. Copy content from `../core/defer-third-party.js`
6. Save

### Step 2: Add Snippets

1. Navigate to `Snippets` folder
2. Click **Add a new snippet**
3. Create `optimized-analytics.liquid` and paste content
4. Repeat for `third-party-optimizer.liquid`
5. Save both files

### Step 3: Configure Theme Settings

Add this to your `config/settings_schema.json` (before the closing `]`):

```json
{
  "name": "Third-Party Scripts",
  "settings": [
    {
      "type": "header",
      "content": "📊 Analytics Configuration"
    },
    {
      "type": "checkbox",
      "id": "gtm_enabled",
      "label": "Enable Google Tag Manager",
      "default": false
    },
    {
      "type": "text",
      "id": "gtm_id",
      "label": "GTM Container ID",
      "info": "Format: GTM-XXXXXX"
    },
    {
      "type": "checkbox",
      "id": "facebook_enabled",
      "label": "Enable Facebook Pixel",
      "default": false
    },
    {
      "type": "text",
      "id": "facebook_pixel_id",
      "label": "Facebook Pixel ID"
    },
    {
      "type": "checkbox",
      "id": "bing_enabled",
      "label": "Enable Bing UET",
      "default": false
    },
    {
      "type": "text",
      "id": "bing_uet_tag_id",
      "label": "Bing UET Tag ID"
    },
    {
      "type": "checkbox",
      "id": "linkedin_enabled",
      "label": "Enable LinkedIn Insight",
      "default": false
    },
    {
      "type": "text",
      "id": "linkedin_partner_id",
      "label": "LinkedIn Partner ID"
    },
    {
      "type": "header",
      "content": "🎨 Widget Configuration"
    },
    {
      "type": "checkbox",
      "id": "reviews_io_enabled",
      "label": "Optimize Reviews.io",
      "default": false,
      "info": "Loads Reviews.io widgets only when visible"
    },
    {
      "type": "checkbox",
      "id": "yotpo_enabled",
      "label": "Optimize Yotpo",
      "default": false
    },
    {
      "type": "text",
      "id": "yotpo_app_key",
      "label": "Yotpo App Key"
    },
    {
      "type": "checkbox",
      "id": "recharge_enabled",
      "label": "Optimize Recharge",
      "default": false,
      "info": "Loads Recharge subscription widget on click"
    },
    {
      "type": "checkbox",
      "id": "klaviyo_enabled",
      "label": "Optimize Klaviyo",
      "default": false
    },
    {
      "type": "text",
      "id": "klaviyo_company_id",
      "label": "Klaviyo Company ID"
    }
  ]
}
```

### Step 4: Integrate into Head

Add this to your `snippets/head.liquid` (before `</head>`):

```liquid
<!-- Third-Party Script Optimizer -->
<script src="{{ 'defer-third-party.js' | asset_url }}" async></script>
{% render 'optimized-analytics' %}
{% render 'third-party-optimizer' %}
```

### Step 5: Configure in Theme Customizer

1. Go to **Admin → Online Store → Themes → Customize**
2. Click **Theme settings** in the left sidebar
3. Scroll to **Third-Party Scripts**
4. Enable and configure your services
5. Save

---

## 🎯 Advanced Integration

For more control, see `head-integration.liquid` for a complete example with:

- Page-specific loading
- Conditional script loading
- Group-based strategies (visibility, interaction, idle)

---

## 📊 Expected Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Lighthouse Mobile | 45-55 | 70-80 | +15-25 pts |
| Total Blocking Time | 1700ms | 300ms | -82% |
| LCP | 2.5-3.0s | 1.8-2.2s | -25-30% |

---

## 🧪 Testing

### 1. Verify Scripts Load

Open Chrome DevTools Console and check:

```javascript
console.log(window.DeferLib);
console.log(window.OptimizedAnalytics);
console.log(window.WidgetOptimizer);
```

All should return objects (not `undefined`).

### 2. Test Analytics

```javascript
// Manually trigger analytics (for testing)
window.OptimizedAnalytics.load();

// Check if GTM loaded
console.log(window.dataLayer);

// Check if Facebook Pixel loaded
console.log(window.fbq);
```

### 3. Check Network Tab

1. Open DevTools → Network tab
2. Reload page
3. Filter by "JS"
4. Verify:
   - `defer-third-party.js` loads immediately
   - Analytics scripts load after interaction
   - Widget scripts load when visible/on interaction

---

## 🔧 Troubleshooting

### Scripts Not Loading

**Problem**: Scripts never load
**Solution**: Check browser console for errors. Ensure `defer-third-party.js` loads successfully.

### Analytics Not Tracking

**Problem**: GTM/Facebook events not firing
**Solution**:
1. Check settings are enabled in theme customizer
2. Verify IDs are correct (GTM-XXXXXX format)
3. Manually trigger: `window.OptimizedAnalytics.load()`

### Widgets Not Appearing

**Problem**: Review/loyalty widgets don't show
**Solution**:
1. Check widget is enabled in settings
2. Verify correct data attributes on elements
3. Check if original widget scripts are conflicting

### Performance Not Improved

**Problem**: Lighthouse scores unchanged
**Solution**:
1. Run test in incognito mode
2. Clear cache between tests
3. Ensure old scripts are removed (not running both old and new)
4. Test on mobile with throttling

---

## 🎨 Customization

### Add Custom Widget

Edit `third-party-optimizer.liquid` and add:

```liquid
{%- comment -%}Custom Widget Example{%- endcomment -%}
function optimizeCustomWidget() {
  var elements = document.querySelectorAll('[data-custom-widget]');
  if (!elements.length) return;

  if ('IntersectionObserver' in window && window.DeferLib) {
    window.DeferLib.loadWhenVisible('[data-custom-widget]', [
      { src: 'https://example.com/widget.js', attrs: { defer: 'true' } }
    ]);
  }
}

// Add to initialization
setTimeout(function() {
  // ... existing code
  optimizeCustomWidget();
}, 100);
```

### Adjust Timing

Edit `optimized-analytics.liquid` timing values:

```liquid
var interactionTimeout = setTimeout(loadCriticalAnalytics, 4000); // Change 4000 to your value
```

---

## 📚 Additional Resources

- **[Main Documentation](../README.md)** - Overview and quick start
- **[Performance Guide](../PERFORMANCE.md)** - Benchmarks and results
- **[API Reference](../docs/API.md)** - Complete API documentation

---

## 💡 Pro Tips

1. **Test on Staging First**: Use a duplicate theme for testing
2. **Monitor Conversion Rates**: Track impact on business metrics
3. **Use Shopify Analytics**: Compare before/after periods
4. **Mobile First**: Mobile users benefit most from optimization
5. **Incremental Rollout**: Enable one service at a time to isolate issues

---

## 🤝 Need Help?

- 📖 Check [Troubleshooting Guide](../docs/TROUBLESHOOTING.md)
- 💬 Open an issue on GitHub
- 📧 Email support

---

**Happy optimizing! 🚀**

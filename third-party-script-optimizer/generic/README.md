# 🌐 Generic JavaScript Integration

Use these files for **any website or platform** - static HTML, PHP, custom CMS, or any framework.

---

## 📦 Files Included

```
generic/
├── optimized-analytics.js          # Analytics optimizer (vanilla JS)
├── third-party-optimizer.js        # Widget optimizer (vanilla JS)
├── index.html                      # Working demo page
└── README.md                        # This file
```

---

## ⚡ Quick Start (2 Minutes)

### 1. Include Core Library

```html
<script src="path/to/defer-third-party.js" async></script>
```

### 2. Configure Analytics

```html
<script>
  window.ANALYTICS_CONFIG = {
    gtm: {
      enabled: true,
      id: 'GTM-XXXXXX'
    },
    facebook: {
      enabled: true,
      pixelId: 'YOUR_PIXEL_ID'
    }
  };
</script>
<script src="path/to/optimized-analytics.js" defer></script>
```

### 3. Configure Widgets

```html
<script>
  window.WIDGET_CONFIG = {
    reviewsIO: {
      enabled: true
    },
    yotpo: {
      enabled: true,
      appKey: 'YOUR_APP_KEY'
    }
  };
</script>
<script src="path/to/third-party-optimizer.js" defer></script>
```

### 4. Add Widget Elements

```html
<!-- Reviews widget - loads when visible -->
<div data-reviews-io data-product-id="123">
  Reviews will load here
</div>

<!-- Yotpo widget - loads on interaction -->
<div data-yotpo-instance-id="demo" class="yotpo-widget-instance">
  Loyalty widget will load here
</div>
```

---

## 🎯 Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Optimized Site</title>

  <!-- Core Library -->
  <script src="/js/defer-third-party.js" async></script>

  <!-- Analytics Configuration -->
  <script>
    window.ANALYTICS_CONFIG = {
      gtm: { enabled: true, id: 'GTM-XXXXXX' },
      facebook: { enabled: true, pixelId: '1234567890' },
      linkedin: { enabled: false, partnerId: '' }
    };
  </script>
  <script src="/js/optimized-analytics.js" defer></script>

  <!-- Widget Configuration -->
  <script>
    window.WIDGET_CONFIG = {
      reviewsIO: { enabled: true },
      custom: [
        {
          enabled: true,
          name: 'Chat Widget',
          selectors: ['.chat-widget'],
          scriptUrl: 'https://chat.example.com/widget.js',
          loadStrategy: 'interaction'
        }
      ]
    };
  </script>
  <script src="/js/third-party-optimizer.js" defer></script>
</head>
<body>
  <h1>My Product</h1>

  <!-- Reviews load when visible -->
  <div data-reviews-io>Loading reviews...</div>

  <!-- Chat loads on interaction -->
  <div class="chat-widget"></div>
</body>
</html>
```

---

## 🔧 Configuration Options

See [config.template.json](../config/config.template.json) for all available options.

### Analytics Platforms Supported

- ✅ Google Tag Manager
- ✅ Facebook Pixel
- ✅ Bing UET
- ✅ LinkedIn Insight Tag
- ➕ Easy to add custom platforms

### Widget Platforms Supported

- ✅ Reviews.io
- ✅ Yotpo
- ✅ Recharge
- ✅ GoTolstoy
- ✅ Klaviyo
- ➕ Custom widgets via config

---

## 📊 Loading Strategies

### 1. Visibility-Based (IntersectionObserver)

```javascript
window.WIDGET_CONFIG = {
  custom: [{
    enabled: true,
    selectors: ['.my-widget'],
    scriptUrl: 'https://example.com/widget.js',
    loadStrategy: 'visibility'  // Loads when element visible
  }]
};
```

### 2. Interaction-Based (First User Action)

```javascript
window.WIDGET_CONFIG = {
  custom: [{
    enabled: true,
    selectors: ['.my-chat'],
    scriptUrl: 'https://example.com/chat.js',
    loadStrategy: 'interaction'  // Loads on scroll/click/touch
  }]
};
```

### 3. Idle-Based (requestIdleCallback)

```javascript
window.WIDGET_CONFIG = {
  custom: [{
    enabled: true,
    selectors: ['.analytics'],
    scriptUrl: 'https://example.com/analytics.js',
    loadStrategy: 'idle'  // Loads during browser idle time
  }]
};
```

---

## 🎨 Custom Widgets

Add any third-party script:

```javascript
window.WIDGET_CONFIG = {
  custom: [
    {
      enabled: true,
      name: 'My Custom Widget',
      selectors: ['.custom-widget', '[data-custom]'],
      scriptUrl: 'https://cdn.example.com/widget.js',
      loadStrategy: 'visibility',
      attrs: {
        'defer': 'true',
        'data-api-key': 'abc123'
      }
    }
  ]
};
```

---

## 🧪 Testing

### 1. Check Console

```javascript
// Verify libraries loaded
console.log(window.DeferLib);
console.log(window.OptimizedAnalytics);
console.log(window.WidgetOptimizer);

// Manually trigger analytics
window.OptimizedAnalytics.load();

// Check config
console.log(window.OptimizedAnalytics.config);
```

### 2. Network Tab

1. Open DevTools → Network
2. Reload page
3. Verify timing:
   - Core library loads immediately
   - Analytics loads after interaction
   - Widgets load when visible

### 3. Performance Tab

1. Open DevTools → Performance
2. Record page load
3. Check "Main" thread
4. Verify reduced blocking time

---

## 🚀 Production Checklist

- [ ] Minify JavaScript files
- [ ] Set correct cache headers
- [ ] Test on real devices (mobile + desktop)
- [ ] Verify analytics data collection
- [ ] Test all widgets function correctly
- [ ] Monitor error rates
- [ ] Compare conversion rates before/after
- [ ] Run Lighthouse audit

---

## 🔥 Performance Tips

1. **Combine & Minify**: Merge all three JS files for production
2. **CDN**: Host scripts on CDN for faster delivery
3. **Compression**: Enable gzip/brotli compression
4. **Cache**: Set long cache times (1 year+)
5. **Preconnect**: Add DNS hints for third-party domains

```html
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://connect.facebook.net">
```

---

## 📚 Learn More

- **[API Documentation](../docs/API.md)** - Complete API reference
- **[Performance Guide](../PERFORMANCE.md)** - Benchmarks and case studies
- **[Working Demo](./index.html)** - See it in action

---

## 💡 Use Cases

### E-commerce Site

```javascript
window.WIDGET_CONFIG = {
  reviewsIO: { enabled: true },        // Product reviews
  yotpo: { enabled: true, appKey: '...' },  // Loyalty program
  recharge: { enabled: true }          // Subscriptions
};
```

### Blog/Content Site

```javascript
window.ANALYTICS_CONFIG = {
  gtm: { enabled: true, id: 'GTM-XXXXXX' },
  facebook: { enabled: true, pixelId: '...' }
};

window.WIDGET_CONFIG = {
  custom: [
    {
      name: 'Newsletter Popup',
      selectors: ['.newsletter-popup'],
      scriptUrl: 'https://email.example.com/popup.js',
      loadStrategy: 'interaction'
    }
  ]
};
```

### SaaS Landing Page

```javascript
window.ANALYTICS_CONFIG = {
  gtm: { enabled: true, id: 'GTM-XXXXXX' },
  linkedin: { enabled: true, partnerId: '...' }
};

window.WIDGET_CONFIG = {
  custom: [
    {
      name: 'Live Chat',
      selectors: ['.chat-trigger'],
      scriptUrl: 'https://chat.example.com/widget.js',
      loadStrategy: 'interaction'
    }
  ]
};
```

---

## 🤝 Support

- 📖 [Documentation](../README.md)
- 💬 GitHub Issues
- 📧 Email Support

---

**Ready to optimize? Check out [index.html](./index.html) for a working demo!** 🚀

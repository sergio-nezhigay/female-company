# 🚀 Getting Started

**Quick setup guide for the Third-Party Script Optimizer**

Choose your platform below for a 5-minute setup!

---

## 🎯 Choose Your Platform

### 🛍️ Shopify

**Time: 10 minutes**

1. **Upload Core Library**
   - Go to: `Admin → Themes → Edit code → Assets`
   - Upload: `core/defer-third-party.js`

2. **Add Snippets**
   - Go to: `Snippets` folder
   - Create: `optimized-analytics.liquid` (copy from `shopify/snippets/`)
   - Create: `third-party-optimizer.liquid` (copy from `shopify/snippets/`)

3. **Integrate**
   - Edit: `snippets/head.liquid`
   - Add before `</head>`:
   ```liquid
   <script src="{{ 'defer-third-party.js' | asset_url }}" async></script>
   {% render 'optimized-analytics' %}
   {% render 'third-party-optimizer' %}
   ```

4. **Configure**
   - Add settings to `config/settings_schema.json` (see `shopify/README.md`)
   - Configure in Theme Customizer

📖 **Full Guide**: [shopify/README.md](./shopify/README.md)

---

### 🌐 Static HTML / Any CMS

**Time: 2 minutes**

1. **Copy Files**
   ```bash
   cp core/defer-third-party.js /your-site/js/
   cp generic/optimized-analytics.js /your-site/js/
   cp generic/third-party-optimizer.js /your-site/js/
   ```

2. **Add to HTML**
   ```html
   <head>
     <script src="/js/defer-third-party.js" async></script>

     <script>
       window.ANALYTICS_CONFIG = {
         gtm: { enabled: true, id: 'GTM-XXXXXX' },
         facebook: { enabled: true, pixelId: 'YOUR_PIXEL_ID' }
       };
     </script>
     <script src="/js/optimized-analytics.js" defer></script>

     <script>
       window.WIDGET_CONFIG = {
         reviewsIO: { enabled: true }
       };
     </script>
     <script src="/js/third-party-optimizer.js" defer></script>
   </head>
   ```

📖 **Full Guide**: [generic/README.md](./generic/README.md)

---

### 🔌 WordPress

**Time: 5 minutes**

1. **Copy Files**
   - Add JS files to your theme's `js/` directory
   - Copy code from `examples/wordpress/functions.php`

2. **Add to functions.php**
   ```php
   // Copy the enqueue functions from examples/wordpress/functions.php
   ```

3. **Configure**
   - Go to: `Settings → Script Optimizer`
   - Enable and configure services

📖 **Full Guide**: [examples/wordpress/](./examples/wordpress/)

---

### ⚛️ React

**Time: 3 minutes**

1. **Copy Component**
   ```bash
   cp examples/react/ThirdPartyOptimizer.jsx src/components/
   ```

2. **Add JS Files to public/**
   ```bash
   cp core/defer-third-party.js public/scripts/
   cp generic/optimized-analytics.js public/scripts/
   cp generic/third-party-optimizer.js public/scripts/
   ```

3. **Use in App**
   ```jsx
   import { ThirdPartyOptimizer } from './components/ThirdPartyOptimizer';

   function App() {
     const config = {
       gtm: { enabled: true, id: 'GTM-XXXXXX' }
     };

     return (
       <>
         <ThirdPartyOptimizer config={config} />
         <YourApp />
       </>
     );
   }
   ```

📖 **Full Guide**: [examples/react/](./examples/react/)

---

### 🔺 Next.js

**Time: 4 minutes**

1. **Add Files to public/**
   ```bash
   mkdir -p public/scripts
   cp core/defer-third-party.js public/scripts/
   cp generic/optimized-analytics.js public/scripts/
   cp generic/third-party-optimizer.js public/scripts/
   ```

2. **Configure Environment**
   - Create `.env.local`
   ```env
   NEXT_PUBLIC_GTM_ENABLED=true
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
   NEXT_PUBLIC_FB_ENABLED=true
   NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
   ```

3. **Add to _app.js** (Pages Router) or **layout.js** (App Router)
   - Copy code from `examples/nextjs/_app.js`

📖 **Full Guide**: [examples/nextjs/](./examples/nextjs/)

---

## ✅ Verification Checklist

After installation, verify everything works:

### 1. Check Console
```javascript
console.log(window.DeferLib);         // Should return object
console.log(window.OptimizedAnalytics); // Should return object
console.log(window.WidgetOptimizer);   // Should return object
```

### 2. Check Network Tab
- [ ] `defer-third-party.js` loads immediately
- [ ] Analytics scripts load after interaction
- [ ] Widgets load when visible or on interaction

### 3. Run Lighthouse
```bash
lighthouse https://your-site.com --view
```
- [ ] Performance score improved (+15-25 points)
- [ ] Total Blocking Time reduced (-75-82%)
- [ ] LCP improved (-20-30%)

### 4. Test Analytics
```javascript
// Manually trigger (for testing)
window.OptimizedAnalytics.load();

// Verify GTM
console.log(window.dataLayer);

// Verify Facebook
console.log(window.fbq);
```

### 5. Test Widgets
- [ ] Reviews load when scrolled into view
- [ ] Loyalty widgets load on hover/click
- [ ] All widgets function correctly

---

## 🎓 Next Steps

### 1. Optimize Configuration
- Adjust timing values for your use case
- Enable/disable specific services
- Add custom widgets

📖 See: [config/config.template.json](./config/config.template.json)

### 2. Monitor Performance
- Set up Lighthouse CI
- Track Core Web Vitals
- Monitor conversion rates

📖 See: [PERFORMANCE.md](./PERFORMANCE.md)

### 3. Learn the API
- Understand loading strategies
- Customize for your needs
- Extend with new widgets

📖 See: [docs/API.md](./docs/API.md)

---

## 🆘 Troubleshooting

### Scripts Not Loading?

**Solution 1**: Check browser console for errors

**Solution 2**: Verify core library loads first
```javascript
// Add to your HTML temporarily
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!window.DeferLib) {
        console.error('DeferLib not loaded!');
      }
    }, 1000);
  });
</script>
```

**Solution 3**: Check file paths are correct

### Analytics Not Tracking?

**Solution 1**: Manually trigger
```javascript
window.OptimizedAnalytics.load();
```

**Solution 2**: Check configuration
```javascript
console.log(window.OptimizedAnalytics.config);
```

**Solution 3**: Verify IDs are correct format
- GTM: `GTM-XXXXXX`
- Facebook: 15-16 digit number

### No Performance Improvement?

**Solution 1**: Clear cache and test in incognito mode

**Solution 2**: Ensure old scripts are removed (not running both)

**Solution 3**: Run proper Lighthouse audit with throttling

**Solution 4**: Test on mobile (biggest gains are mobile)

---

## 📚 Documentation

- **[README.md](./README.md)** - Main documentation
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Benchmarks and case studies
- **[API.md](./docs/API.md)** - Complete API reference
- **[Shopify Guide](./shopify/README.md)** - Shopify-specific
- **[Generic Guide](./generic/README.md)** - HTML/JavaScript

---

## 💬 Get Help

- 📖 Read the documentation
- 🐛 Check GitHub Issues
- 💬 Ask in GitHub Discussions
- 📧 Email support

---

## 🎉 You're All Set!

Start optimizing and enjoy:
- ⚡ Faster page loads
- 📈 Better Lighthouse scores
- 💰 Higher conversion rates
- 😊 Happier users

**Happy optimizing!** 🚀

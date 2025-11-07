# 📖 API Reference

Complete API documentation for the Third-Party Script Optimizer.

---

## Table of Contents

- [DeferLib API](#deferlib-api)
- [OptimizedAnalytics API](#optimizedanalytics-api)
- [WidgetOptimizer API](#widgetoptimizer-api)
- [Configuration Objects](#configuration-objects)
- [Events & Callbacks](#events--callbacks)
- [Browser Compatibility](#browser-compatibility)

---

## DeferLib API

Core library providing three loading strategies for third-party scripts.

### `window.DeferLib.loadGroupWhenIdle(urls)`

Loads scripts during browser idle time using `requestIdleCallback`.

**Parameters:**
- `urls` *(Array)* - Array of script objects to load

**Script Object Structure:**
```javascript
{
  src: string,        // Required: Script URL
  attrs: {            // Optional: Additional attributes
    async: 'true',
    defer: 'true',
    'data-custom': 'value'
  }
}
```

**Example:**
```javascript
window.DeferLib.loadGroupWhenIdle([
  { src: 'https://example.com/analytics.js' },
  { src: 'https://example.com/tracking.js', attrs: { async: 'true' } }
]);
```

**Behavior:**
- Uses `requestIdleCallback` with 2000ms timeout
- Falls back to `setTimeout(fn, 2000)` in older browsers
- Scripts load in parallel
- Non-blocking

**Use Cases:**
- Non-critical analytics
- Background tracking
- Low-priority widgets

---

### `window.DeferLib.loadGroupOnInteraction(urls)`

Loads scripts on first user interaction (scroll, mousemove, touchstart, keydown).

**Parameters:**
- `urls` *(Array)* - Array of script objects to load

**Example:**
```javascript
window.DeferLib.loadGroupOnInteraction([
  { src: 'https://widget.example.com/chat.js' },
  { src: 'https://analytics.example.com/events.js' }
]);
```

**Behavior:**
- Listens to: `scroll`, `mousemove`, `touchstart`, `keydown`
- Triggers once (uses `{ once: true }`)
- Passive event listeners (non-blocking)
- Falls back to 5000ms timeout if no interaction
- Scripts load in parallel

**Use Cases:**
- Chat widgets
- Marketing popups
- Event tracking
- A/B testing tools

---

### `window.DeferLib.loadWhenVisible(selector, urls)`

Loads scripts when matching elements become visible using `IntersectionObserver`.

**Parameters:**
- `selector` *(String)* - CSS selector for target elements
- `urls` *(Array)* - Array of script objects to load

**Example:**
```javascript
window.DeferLib.loadWhenVisible('[data-reviews-io]', [
  { src: 'https://widget.reviews.io/rating-bar.js' },
  { src: 'https://widget.reviews.io/polaris/build.js' }
]);
```

**Behavior:**
- Uses `IntersectionObserver` with 200px margin
- Falls back to `loadGroupOnInteraction` if IntersectionObserver unavailable
- Disconnects observer after first trigger
- Safety timeout: 10 seconds fallback to idle loading
- Scripts load in parallel when element visible

**IntersectionObserver Options:**
```javascript
{
  rootMargin: '200px 0px'  // Trigger 200px before element enters viewport
}
```

**Use Cases:**
- Review widgets below the fold
- Video players
- Social media embeds
- Product recommendations

---

## OptimizedAnalytics API

Manages loading of analytics and tracking scripts.

### `window.OptimizedAnalytics.init(config)`

Initializes the analytics optimizer with configuration.

**Parameters:**
- `config` *(Object)* - Analytics configuration object

**Example:**
```javascript
window.OptimizedAnalytics.init({
  gtm: {
    enabled: true,
    id: 'GTM-XXXXXX'
  },
  facebook: {
    enabled: true,
    pixelId: '1234567890'
  },
  timing: {
    interactionDelay: 500,
    noInteractionFallback: 4000,
    loadFallback: 8000
  }
});
```

**Configuration Object:**
```typescript
{
  gtm?: {
    enabled: boolean;
    id: string;              // GTM-XXXXXX format
  };
  facebook?: {
    enabled: boolean;
    pixelId: string;
  };
  bing?: {
    enabled: boolean;
    tagId: string;
  };
  linkedin?: {
    enabled: boolean;
    partnerId: string;
  };
  timing?: {
    interactionDelay?: number;         // Default: 500ms
    noInteractionFallback?: number;    // Default: 4000ms
    loadFallback?: number;             // Default: 8000ms
    gtmTimeout?: number;               // Default: 1000ms
    fbTimeout?: number;                // Default: 1500ms
    bingTimeout?: number;              // Default: 3000ms
    linkedInTimeout?: number;          // Default: 5000ms
  };
}
```

---

### `window.OptimizedAnalytics.load()`

Manually triggers analytics loading (bypasses interaction wait).

**Returns:** `void`

**Example:**
```javascript
// Force load analytics immediately
window.OptimizedAnalytics.load();
```

**Use Cases:**
- User accepts cookies
- Debug/testing
- Special page types (checkout, thank you)

---

### `window.OptimizedAnalytics.config`

Read-only access to current configuration.

**Example:**
```javascript
console.log(window.OptimizedAnalytics.config.gtm.id);
// Output: "GTM-XXXXXX"
```

---

## WidgetOptimizer API

Manages loading of widget scripts with facade patterns.

### `window.WidgetOptimizer.init(config)`

Initializes the widget optimizer.

**Parameters:**
- `config` *(Object)* - Widget configuration object

**Example:**
```javascript
window.WidgetOptimizer.init({
  reviewsIO: {
    enabled: true
  },
  yotpo: {
    enabled: true,
    appKey: 'ABC123XYZ'
  },
  custom: [
    {
      enabled: true,
      name: 'Custom Chat Widget',
      selectors: ['.chat-widget', '[data-chat]'],
      scriptUrl: 'https://chat.example.com/widget.js',
      loadStrategy: 'interaction',
      attrs: { defer: 'true' }
    }
  ]
});
```

**Configuration Object:**
```typescript
{
  recharge?: {
    enabled: boolean;
    selectors?: string[];            // Default: ['[data-recharge]', '.rc-widget']
    scriptUrl?: string;              // Default: Recharge CDN
  };
  reviewsIO?: {
    enabled: boolean;
    selectors?: string[];            // Default: ['[data-reviews-io]', '.reviews-io']
    scripts?: string[];              // Default: Reviews.io CDN scripts
  };
  yotpo?: {
    enabled: boolean;
    appKey: string;                  // Required if enabled
    selectors?: string[];            // Default: ['[data-yotpo-instance-id]']
    scriptUrl?: string;              // Default: Yotpo CDN
  };
  tolstoy?: {
    enabled: boolean;
    selectors?: string[];            // Default: ['[data-tolstoy]']
    scriptUrl?: string;              // Default: Tolstoy CDN
  };
  klaviyo?: {
    enabled: boolean;
    companyId: string;               // Required if enabled
    selectors?: string[];            // Default: ['[data-klaviyo-form-id]']
    scriptUrl?: string;              // Default: Klaviyo CDN
  };
  custom?: CustomWidget[];           // Array of custom widgets
}

interface CustomWidget {
  enabled: boolean;
  name: string;
  selectors: string[];
  scriptUrl: string;
  loadStrategy: 'visibility' | 'interaction' | 'idle';
  attrs?: Record<string, string>;
}
```

---

### `window.WidgetOptimizer.config`

Read-only access to current widget configuration.

**Example:**
```javascript
console.log(window.WidgetOptimizer.config.yotpo.appKey);
```

---

## Configuration Objects

### Global Configuration (Auto-init)

Set configurations before scripts load for automatic initialization.

**Example:**
```html
<script>
  // Set configs before loading optimizer scripts
  window.ANALYTICS_CONFIG = {
    gtm: { enabled: true, id: 'GTM-XXXXXX' },
    facebook: { enabled: true, pixelId: '1234567890' }
  };

  window.WIDGET_CONFIG = {
    reviewsIO: { enabled: true },
    yotpo: { enabled: true, appKey: 'ABC123' }
  };
</script>

<!-- Load optimizer scripts -->
<script src="optimized-analytics.js" defer></script>
<script src="third-party-optimizer.js" defer></script>
```

---

## Events & Callbacks

### Browser Events Used

**Interaction Detection:**
- `scroll` - Page scroll
- `mousemove` - Mouse movement
- `touchstart` - Touch on mobile
- `keydown` - Keyboard input
- `click` - Mouse clicks

All listeners use:
```javascript
{
  once: true,      // Auto-remove after first trigger
  passive: true    // Non-blocking, improves scroll performance
}
```

---

### Custom Events (Future)

Planned for future versions:

```javascript
// Listen for script load
document.addEventListener('optimizer:script-loaded', (e) => {
  console.log('Script loaded:', e.detail.src);
});

// Listen for analytics init
document.addEventListener('optimizer:analytics-ready', () => {
  console.log('Analytics ready');
});
```

---

## Browser Compatibility

### Core Features

| Feature | Requirement | Fallback |
|---------|-------------|----------|
| `requestIdleCallback` | Chrome 47+, Firefox 55+ | `setTimeout(fn, 2000)` |
| `IntersectionObserver` | Chrome 51+, Firefox 55+ | `loadGroupOnInteraction` |
| `Array.forEach` | ES5 (IE9+) | Required |
| `document.createElement` | All browsers | Required |
| `addEventListener` | IE9+ | Required |

### Tested Browsers

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ iOS Safari 14+
✅ Chrome Android 90+

⚠️ IE11: Core functionality works with fallbacks, but not officially supported

---

## Advanced Usage

### Chaining Multiple Strategies

```javascript
// Load analytics on interaction
window.DeferLib.loadGroupOnInteraction([
  { src: 'https://analytics.example.com/track.js' }
]);

// Load widgets on visibility
window.DeferLib.loadWhenVisible('[data-widget]', [
  { src: 'https://widget.example.com/loader.js' }
]);

// Load non-critical on idle
window.DeferLib.loadGroupWhenIdle([
  { src: 'https://support.example.com/chat.js' }
]);
```

---

### Conditional Loading

```javascript
// Load only on specific pages
if (window.location.pathname.includes('/product/')) {
  window.DeferLib.loadWhenVisible('[data-reviews-io]', [
    { src: 'https://widget.reviews.io/rating-bar.js' }
  ]);
}

// Load only for certain user types
if (userIsLoggedIn) {
  window.DeferLib.loadGroupOnInteraction([
    { src: 'https://loyalty.example.com/widget.js' }
  ]);
}
```

---

### Error Handling

```javascript
// Scripts fail gracefully - no error callbacks yet
// Future version will support:
window.DeferLib.loadGroupWhenIdle([
  {
    src: 'https://example.com/script.js',
    onError: (error) => console.error('Failed to load:', error),
    onLoad: () => console.log('Successfully loaded')
  }
]);
```

---

### Debug Mode

```javascript
// Enable verbose logging (development only)
window.DEBUG_OPTIMIZER = true;

// Will log:
// - Script load triggers
// - Timing information
// - Strategy decisions
// - Error details
```

---

## TypeScript Definitions

```typescript
// Type definitions (planned for npm package)
declare namespace DeferLib {
  interface ScriptObject {
    src: string;
    attrs?: Record<string, string>;
  }

  function loadGroupWhenIdle(urls: ScriptObject[]): void;
  function loadGroupOnInteraction(urls: ScriptObject[]): void;
  function loadWhenVisible(selector: string, urls: ScriptObject[]): void;
}

declare namespace OptimizedAnalytics {
  interface Config {
    gtm?: { enabled: boolean; id: string };
    facebook?: { enabled: boolean; pixelId: string };
    bing?: { enabled: boolean; tagId: string };
    linkedin?: { enabled: boolean; partnerId: string };
    timing?: {
      interactionDelay?: number;
      noInteractionFallback?: number;
      loadFallback?: number;
    };
  }

  function init(config: Config): void;
  function load(): void;
  const config: Readonly<Config>;
}

declare namespace WidgetOptimizer {
  interface CustomWidget {
    enabled: boolean;
    name: string;
    selectors: string[];
    scriptUrl: string;
    loadStrategy: 'visibility' | 'interaction' | 'idle';
    attrs?: Record<string, string>;
  }

  interface Config {
    recharge?: { enabled: boolean };
    reviewsIO?: { enabled: boolean };
    yotpo?: { enabled: boolean; appKey: string };
    tolstoy?: { enabled: boolean };
    klaviyo?: { enabled: boolean; companyId: string };
    custom?: CustomWidget[];
  }

  function init(config: Config): void;
  const config: Readonly<Config>;
}
```

---

## Performance Monitoring

### Measuring Impact

```javascript
// Mark when optimizer initializes
performance.mark('optimizer-start');

// Measure to first script load
window.addEventListener('load', () => {
  performance.mark('optimizer-complete');
  performance.measure('optimizer-duration',
    'optimizer-start',
    'optimizer-complete'
  );

  const measure = performance.getEntriesByName('optimizer-duration')[0];
  console.log('Optimizer took:', measure.duration, 'ms');
});
```

---

## Common Patterns

### Progressive Enhancement

```javascript
// Check if DeferLib is available before using
if (window.DeferLib) {
  window.DeferLib.loadWhenVisible('[data-widget]', [/*...*/]);
} else {
  // Fallback: load immediately
  var script = document.createElement('script');
  script.src = 'widget.js';
  document.head.appendChild(script);
}
```

### Consent Management Integration

```javascript
// Wait for user consent before loading analytics
window.addEventListener('usercentrics-consent', (e) => {
  if (e.detail.analytics === true) {
    window.OptimizedAnalytics.load();
  }
});
```

---

## Next Steps

- **[Performance Guide](../PERFORMANCE.md)** - Benchmarks and case studies
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Examples](../examples/)** - Platform-specific implementations

---

**Questions? Open an issue on GitHub or check the documentation!**

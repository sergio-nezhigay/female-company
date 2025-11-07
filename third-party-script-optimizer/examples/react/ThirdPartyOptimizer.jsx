/**
 * ========================================
 * REACT INTEGRATION EXAMPLE
 * ========================================
 *
 * React component for managing third-party script optimization
 *
 * Features:
 * - Lazy loads analytics and widgets
 * - Hooks-based API for React apps
 * - TypeScript-ready
 * - SSR-compatible (Next.js)
 *
 * Usage:
 * import { ThirdPartyOptimizer, useAnalytics, useWidget } from './ThirdPartyOptimizer';
 *
 * function App() {
 *   return (
 *     <>
 *       <ThirdPartyOptimizer config={config} />
 *       <YourApp />
 *     </>
 *   );
 * }
 */

import { useEffect, useRef } from 'react';

// =============================================
// CONFIGURATION INTERFACE (TypeScript-ready)
// =============================================

/**
 * @typedef {Object} AnalyticsConfig
 * @property {boolean} enabled
 * @property {string} id
 */

/**
 * @typedef {Object} ThirdPartyConfig
 * @property {AnalyticsConfig} gtm
 * @property {AnalyticsConfig} facebook
 * @property {AnalyticsConfig} bing
 * @property {AnalyticsConfig} linkedin
 * @property {Object} widgets
 */

// =============================================
// MAIN COMPONENT
// =============================================

export function ThirdPartyOptimizer({ config }) {
  const scriptsLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptsLoadedRef.current) return;
    scriptsLoadedRef.current = true;

    // Load core defer library
    loadScript('/scripts/defer-third-party.js', true).then(() => {
      console.log('✅ DeferLib loaded');

      // Initialize analytics
      if (window.OptimizedAnalytics) {
        window.OptimizedAnalytics.init(config);
      }

      // Initialize widget optimizer
      if (window.WidgetOptimizer) {
        window.WidgetOptimizer.init(config.widgets || {});
      }
    });

    // Load optimized analytics
    loadScript('/scripts/optimized-analytics.js');

    // Load widget optimizer
    loadScript('/scripts/third-party-optimizer.js');

  }, [config]);

  return null; // This component doesn't render anything
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Dynamically load a script
 */
function loadScript(src, async = false) {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    if (async) script.async = true;
    else script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
}

// =============================================
// REACT HOOKS
// =============================================

/**
 * Hook to manually trigger analytics loading
 */
export function useAnalytics() {
  const loadAnalytics = () => {
    if (window.OptimizedAnalytics) {
      window.OptimizedAnalytics.load();
    }
  };

  const trackEvent = (event, data = {}) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event,
        ...data
      });
    }

    if (window.fbq) {
      window.fbq('track', event, data);
    }
  };

  return { loadAnalytics, trackEvent };
}

/**
 * Hook to check if a widget has loaded
 */
export function useWidget(widgetName) {
  const isLoaded = () => {
    switch (widgetName) {
      case 'yotpo':
        return typeof window.yotpo !== 'undefined';
      case 'reviewsio':
        return typeof window.ReviewsWidget !== 'undefined';
      case 'klaviyo':
        return typeof window._learnq !== 'undefined';
      default:
        return false;
    }
  };

  return { isLoaded: isLoaded() };
}

// =============================================
// WIDGET COMPONENTS
// =============================================

/**
 * Reviews Widget Component
 * Automatically loads Reviews.io when visible
 */
export function ReviewsWidget({ productId, ...props }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Widget will auto-load via IntersectionObserver in third-party-optimizer.js
    // Just need to set the proper data attribute
  }, [productId]);

  return (
    <div
      ref={containerRef}
      data-reviews-io
      data-product-id={productId}
      {...props}
    >
      {/* Reviews widget will load here */}
      <div className="reviews-placeholder">
        Loading reviews...
      </div>
    </div>
  );
}

/**
 * Yotpo Widget Component
 */
export function YotpoWidget({ instanceId, ...props }) {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      data-yotpo-instance-id={instanceId}
      className="yotpo-widget-instance"
      {...props}
    >
      {/* Yotpo widget will load here */}
    </div>
  );
}

/**
 * Video Widget Component (GoTolstoy)
 */
export function VideoWidget({ videoId, ...props }) {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      data-tolstoy
      data-video-id={videoId}
      className="tolstoy-widget"
      {...props}
    >
      {/* Video widget will load here */}
    </div>
  );
}

// =============================================
// EXAMPLE USAGE
// =============================================

/**
 * Example App.jsx implementation
 */
export function ExampleApp() {
  const config = {
    gtm: {
      enabled: true,
      id: 'GTM-XXXXXX'
    },
    facebook: {
      enabled: true,
      pixelId: 'YOUR_PIXEL_ID'
    },
    linkedin: {
      enabled: true,
      partnerId: 'YOUR_PARTNER_ID'
    },
    widgets: {
      reviewsIO: {
        enabled: true
      },
      yotpo: {
        enabled: true,
        appKey: 'YOUR_APP_KEY'
      },
      tolstoy: {
        enabled: true
      }
    }
  };

  const { trackEvent } = useAnalytics();

  const handleAddToCart = () => {
    trackEvent('AddToCart', {
      productId: '123',
      value: 29.99
    });
  };

  return (
    <div>
      <ThirdPartyOptimizer config={config} />

      <h1>Product Page</h1>
      <button onClick={handleAddToCart}>Add to Cart</button>

      {/* Reviews widget - loads on visibility */}
      <ReviewsWidget productId="123" />

      {/* Loyalty widget - loads on interaction */}
      <YotpoWidget instanceId="demo" />

      {/* Video widget - loads on visibility */}
      <VideoWidget videoId="abc123" />
    </div>
  );
}

// =============================================
// HOC FOR PAGE-LEVEL OPTIMIZATION
// =============================================

/**
 * Higher-Order Component to wrap pages with optimization
 */
export function withThirdPartyOptimization(Component, config) {
  return function OptimizedComponent(props) {
    return (
      <>
        <ThirdPartyOptimizer config={config} />
        <Component {...props} />
      </>
    );
  };
}

// Usage:
// export default withThirdPartyOptimization(MyPage, config);

// =============================================
// CONTEXT PROVIDER (Advanced)
// =============================================

import { createContext, useContext } from 'react';

const ThirdPartyContext = createContext(null);

export function ThirdPartyProvider({ children, config }) {
  const { trackEvent } = useAnalytics();
  const widgetStatus = {
    yotpo: useWidget('yotpo'),
    reviewsio: useWidget('reviewsio'),
    klaviyo: useWidget('klaviyo')
  };

  return (
    <ThirdPartyContext.Provider value={{ trackEvent, widgetStatus }}>
      <ThirdPartyOptimizer config={config} />
      {children}
    </ThirdPartyContext.Provider>
  );
}

export function useThirdParty() {
  const context = useContext(ThirdPartyContext);
  if (!context) {
    throw new Error('useThirdParty must be used within ThirdPartyProvider');
  }
  return context;
}

// Usage:
// function MyComponent() {
//   const { trackEvent, widgetStatus } = useThirdParty();
//   return <div>...</div>;
// }

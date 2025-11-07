/**
 * ========================================
 * NEXT.JS INTEGRATION EXAMPLE
 * ========================================
 *
 * This example shows how to integrate the third-party script optimizer
 * into a Next.js application using the App Router or Pages Router.
 *
 * Features:
 * - SSR-compatible
 * - Uses Next.js Script component for optimal loading
 * - Supports both App Router (_app.js) and Pages Router
 * - TypeScript-ready
 *
 * File: pages/_app.js (Pages Router)
 * For App Router, adapt this for app/layout.js
 */

import Script from 'next/script';
import { useEffect } from 'react';

// =============================================
// CONFIGURATION
// =============================================

const THIRD_PARTY_CONFIG = {
  analytics: {
    gtm: {
      enabled: process.env.NEXT_PUBLIC_GTM_ENABLED === 'true',
      id: process.env.NEXT_PUBLIC_GTM_ID || ''
    },
    facebook: {
      enabled: process.env.NEXT_PUBLIC_FB_ENABLED === 'true',
      pixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || ''
    },
    bing: {
      enabled: process.env.NEXT_PUBLIC_BING_ENABLED === 'true',
      tagId: process.env.NEXT_PUBLIC_BING_TAG_ID || ''
    },
    linkedin: {
      enabled: process.env.NEXT_PUBLIC_LINKEDIN_ENABLED === 'true',
      partnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || ''
    }
  },
  widgets: {
    reviewsIO: {
      enabled: process.env.NEXT_PUBLIC_REVIEWS_IO_ENABLED === 'true'
    },
    yotpo: {
      enabled: process.env.NEXT_PUBLIC_YOTPO_ENABLED === 'true',
      appKey: process.env.NEXT_PUBLIC_YOTPO_APP_KEY || ''
    },
    tolstoy: {
      enabled: process.env.NEXT_PUBLIC_TOLSTOY_ENABLED === 'true'
    },
    klaviyo: {
      enabled: process.env.NEXT_PUBLIC_KLAVIYO_ENABLED === 'true',
      companyId: process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID || ''
    }
  }
};

// =============================================
// MAIN APP COMPONENT
// =============================================

function MyApp({ Component, pageProps }) {
  // Initialize configs on client side only
  useEffect(() => {
    // Make config available globally
    window.ANALYTICS_CONFIG = THIRD_PARTY_CONFIG.analytics;
    window.WIDGET_CONFIG = THIRD_PARTY_CONFIG.widgets;
  }, []);

  return (
    <>
      {/* Third-Party Script Optimizer */}
      <ThirdPartyScripts />

      {/* Your app content */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

// =============================================
// THIRD-PARTY SCRIPTS COMPONENT
// =============================================

function ThirdPartyScripts() {
  return (
    <>
      {/* Core defer library - load first with async */}
      <Script
        src="/scripts/defer-third-party.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ DeferLib loaded');
        }}
      />

      {/* Optimized analytics */}
      <Script
        src="/scripts/optimized-analytics.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Analytics optimizer loaded');
        }}
      />

      {/* Widget optimizer */}
      <Script
        src="/scripts/third-party-optimizer.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Widget optimizer loaded');
        }}
      />

      {/* Preconnect hints for critical domains */}
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      <link rel="dns-prefetch" href="https://widget.reviews.io" />
      <link rel="dns-prefetch" href="https://static.klaviyo.com" />
    </>
  );
}

// =============================================
// CUSTOM DOCUMENT (pages/_document.js)
// =============================================

/**
 * Create this file: pages/_document.js
 * This adds preconnect hints in the document head
 */

/*
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Performance hints *\/}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://widget.reviews.io" />
        <link rel="dns-prefetch" href="https://static.klaviyo.com" />
        <link rel="dns-prefetch" href="https://bat.bing.com" />
        <link rel="dns-prefetch" href="https://snap.licdn.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
*/

// =============================================
// ENVIRONMENT VARIABLES (.env.local)
// =============================================

/**
 * Create this file: .env.local
 *
 * # Analytics
 * NEXT_PUBLIC_GTM_ENABLED=true
 * NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
 * NEXT_PUBLIC_FB_ENABLED=true
 * NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
 * NEXT_PUBLIC_BING_ENABLED=false
 * NEXT_PUBLIC_BING_TAG_ID=
 * NEXT_PUBLIC_LINKEDIN_ENABLED=false
 * NEXT_PUBLIC_LINKEDIN_PARTNER_ID=
 *
 * # Widgets
 * NEXT_PUBLIC_REVIEWS_IO_ENABLED=true
 * NEXT_PUBLIC_YOTPO_ENABLED=false
 * NEXT_PUBLIC_YOTPO_APP_KEY=
 * NEXT_PUBLIC_TOLSTOY_ENABLED=true
 * NEXT_PUBLIC_KLAVIYO_ENABLED=false
 * NEXT_PUBLIC_KLAVIYO_COMPANY_ID=
 */

// =============================================
// APP ROUTER VERSION (app/layout.js)
// =============================================

/**
 * For Next.js App Router, use this in app/layout.js instead
 */

/*
import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'My App',
  description: 'Description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body>
        {children}

        {/* Third-Party Scripts *\/}
        <Script
          src="/scripts/defer-third-party.js"
          strategy="afterInteractive"
        />
        <Script
          src="/scripts/optimized-analytics.js"
          strategy="afterInteractive"
        />
        <Script
          src="/scripts/third-party-optimizer.js"
          strategy="afterInteractive"
        />

        {/* Configuration *\/}
        <Script id="third-party-config" strategy="beforeInteractive">
          {`
            window.ANALYTICS_CONFIG = {
              gtm: {
                enabled: ${process.env.NEXT_PUBLIC_GTM_ENABLED === 'true'},
                id: '${process.env.NEXT_PUBLIC_GTM_ID || ''}'
              },
              facebook: {
                enabled: ${process.env.NEXT_PUBLIC_FB_ENABLED === 'true'},
                pixelId: '${process.env.NEXT_PUBLIC_FB_PIXEL_ID || ''}'
              }
            };
            window.WIDGET_CONFIG = {
              reviewsIO: { enabled: ${process.env.NEXT_PUBLIC_REVIEWS_IO_ENABLED === 'true'} },
              yotpo: { enabled: ${process.env.NEXT_PUBLIC_YOTPO_ENABLED === 'true'}, appKey: '${process.env.NEXT_PUBLIC_YOTPO_APP_KEY || ''}' }
            };
          `}
        </Script>
      </body>
    </html>
  );
}
*/

// =============================================
// USAGE HOOKS
// =============================================

/**
 * Hook to track events with all analytics platforms
 */
export function useTracking() {
  const trackEvent = (eventName, data = {}) => {
    // GTM
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...data
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', eventName, data);
    }

    // Bing
    if (window.uetq) {
      window.uetq.push('event', eventName, data);
    }

    // LinkedIn
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: eventName });
    }
  };

  const trackPageView = (url) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: url
      });
    }

    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  };

  return { trackEvent, trackPageView };
}

/**
 * Usage in a page component
 */

/*
import { useTracking } from './_app';
import { useEffect } from 'react';

export default function ProductPage({ product }) {
  const { trackEvent } = useTracking();

  const handleAddToCart = () => {
    trackEvent('AddToCart', {
      productId: product.id,
      value: product.price,
      currency: 'USD'
    });
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <button onClick={handleAddToCart}>Add to Cart</button>

      {/* Reviews widget - auto-optimized *\/}
      <div data-reviews-io data-product-id={product.id}>
        Reviews will load here when visible
      </div>
    </div>
  );
}
*/

// =============================================
// PUBLIC FOLDER STRUCTURE
// =============================================

/**
 * Place the optimizer files in your Next.js public folder:
 *
 * public/
 * └── scripts/
 *     ├── defer-third-party.js
 *     ├── optimized-analytics.js
 *     └── third-party-optimizer.js
 *
 * These will be accessible at /scripts/*.js
 */

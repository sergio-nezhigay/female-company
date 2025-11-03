# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shopify theme for The Female Company, built on the **Focal theme** (v10.1.3) by Maestrooo. It's a multi-market e-commerce store selling period underwear and related products across multiple European countries (Germany, France, Switzerland, Austria, Belgium, Denmark, Netherlands, Sweden, and international markets).

## Development Commands

```bash
# Start local development server
npm run dev

# Push theme changes to Shopify
npm run push

# Pull latest theme from Shopify
npm run pull
```

**Store configuration**: `thefemalecompany.myshopify.com`, Theme ID: `185405636874`

## Tech Stack

- **Platform**: Shopify Liquid
- **Base Theme**: Focal v10.1.3
- **JavaScript Libraries**:
  - GSAP (animations with ScrollTrigger)
  - Flickity (carousels)
  - PhotoSwipe (image galleries)
  - Custom elements (Web Components pattern)
- **Third-party integrations**:
  - PageFly (page builder - many `pf-*.liquid` sections)
  - Klaviyo (email marketing)
  - Intelligems (A/B testing)
  - Tracify (analytics)
  - Zendesk (customer support)

## Important: Image Filters

**ALWAYS use `image_url` filter, NOT the deprecated `img_url` filter** when working with Shopify images.

## Architecture

### Directory Structure

```
├── assets/          # CSS, JS, and static assets
├── config/          # Theme settings (settings_schema.json, settings_data.json)
├── layout/          # Base layouts (theme.liquid, checkout.liquid, theme.pagefly.liquid)
├── locales/         # Multi-language translations (de, en, fr, es, it, nl, sv, etc.)
├── sections/        # Reusable page sections
├── snippets/        # Reusable code components
└── templates/       # Page templates (product, collection, cart, blog, etc.)
```

### Multi-Market Configuration

The theme supports context-specific configurations via JSON files:
- Header/footer/overlay groups have `.context.{country}.json` variants (e.g., `header-group.context.de.json`)
- Countries: `austria`, `belgium`, `de`, `denmark`, `france`, `international`, `netherlands`, `sweden`, `switzerland`

### Key Sections

- `main-product.liquid` - Product detail pages (PDP)
- `main-collection.liquid` - Collection/category pages
- `main-cart.liquid` - Cart page
- `header.liquid` - Site header
- `footer.liquid` - Site footer
- `mini-cart.liquid` - Cart drawer

### Important Snippets

- `product-info.liquid` - Product information display with price overrides via metafields
- `product-media.liquid` - Product images and galleries
- `facet-filters.liquid` - Collection filtering
- `absorbency-droplets.liquid` - Custom absorbency indicator
- `css-variables.liquid` - Dynamic CSS custom properties
- `js-variables.liquid` - JavaScript configuration

## Custom Features

### Product Metafields

The theme extensively uses metafields:
- `product.metafields.filters.absorbancy` - Absorbency level (droplet display)
- `product.metafields.filters.style` - Product style icons
- `product.metafields.pricing.override_shown_price` - Override displayed price

### Cart Features

- Free shipping thresholds by country (configurable in theme settings)
- Free gift thresholds with country/variant/threshold logic
- Volume discounts (PDP and cart)
- Upsell popup and cart drawer upsells

### Custom JavaScript Events

The theme uses custom events for extensibility (see `assets/custom.js`):

```javascript
// Variant changed
document.addEventListener('variant:changed', function(event) {
  let variant = event.detail.variant;
});

// Variant added to cart
document.addEventListener('variant:added', function(event) {
  var variant = event.detail.variant;
});

// Cart updated
document.addEventListener('cart:updated', function(event) {
  var cart = event.detail.cart;
});

// Refresh cart display
document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
  bubbles: true
}));
```

### Custom Elements

Theme uses Web Components pattern:
- `<product-variants>` - Variant selector with `selectVariant(id)` method
- `<drawer-content>` - Drawer component (e.g., `mini-cart`)
- `<popover-content>` - Popover/modal component
- Toggle with `element.open = true/false`

## Styling Guidelines

- **Mobile-first approach**: Write CSS starting with mobile, then add tablet/desktop breakpoints
- Breakpoints: `741px` (tablet), `1200px`/`1400px` (desktop depending on filter position)
- Uses CSS custom properties extensively (defined in `snippets/css-variables.liquid`)
- RTL support for Arabic, Hebrew, Urdu, etc. via `ly-rtl.css.liquid`

## JavaScript Guidelines

- **Always use `console.log()` for debugging, NOT logger**
- Main theme JS: `assets/theme.js`, `assets/vendor.js`, `assets/global.js`
- Custom code: `assets/custom.js`
- Extensive documentation in `custom.js` header comments

## Common Tasks

### Product Card Display Settings

Controlled in theme settings (`config/settings_schema.json` > "Product Cards"):
- Show vendor
- Secondary image on hover
- Quick add to cart
- Product ratings
- Discount labels (percentage vs. saving)
- Color swatches
- Product style icons

### A/B Testing

- Theme settings include `a_b_test_products` (product list)
- **NEVER fill out on main/live theme** (for testing themes only)
- Intelligems integration for shipping bars and pricing tests

### Breadcrumbs

Configurable separately for:
- Collection pages (desktop/mobile)
- Product pages (desktop/mobile)

### PDP Sticky Behavior

Theme setting: `pdp_atc_button_behaviour`
- `default` - Normal behavior
- `sticky_in_viewport` - Sticks when in viewport
- `always_sticky` - Always sticky on mobile/tablet

### Coming Soon Products

Use `pdp_coming_soon_signup_id` setting for Klaviyo popup ID when products are unavailable.

## TypeScript Considerations

While this is a Liquid theme (no TypeScript), if adding TypeScript integrations:
- **Remember to check for TypeScript errors after making changes**

## Multi-Language

- Default language: English (`locales/en.default.json`)
- Supported: German, French, Italian, Spanish, Portuguese, Dutch, Swedish, Norwegian, Finnish, Polish, Arabic, Japanese
- Use Liquid translation tags: `{{ 'key.path' | t }}`

## PageFly Integration

Many sections prefixed with `pf-{hash}.liquid` are PageFly-generated:
- Do not manually edit unless necessary
- PageFly-specific snippets: `pagefly-*.liquid`
- Layouts include `theme.pagefly.liquid`

## Important Theme Settings

Key settings in `config/settings_schema.json`:
- **Appearance**: Border radius, spacing, button behavior
- **Colors**: Extensive color customization per component
- **Cart**: Free shipping/gift thresholds by country
- **Upselling**: Volume discounts, progress bars, popups
- **Product Cards**: Display options for collection grids
- **Animation**: Image zoom, reveal effects

## Special Notes

- The theme handles RTL languages automatically based on locale
- Custom liquid wrappers: `{% comment %}ly_liquid_scripts_begin{% endcomment %}` for certain integrations
- Tracify analytics loaded via `snippets/load-tracify.liquid`
- Customer registration can redirect via `customer_registration_redirect` setting

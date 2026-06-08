---
name: Perdana Prima Express
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#434843'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#737872'
  outline-variant: '#c3c8c1'
  surface-tint: '#506354'
  primary: '#334537'
  on-primary: '#ffffff'
  primary-container: '#4a5d4e'
  on-primary-container: '#c0d5c2'
  inverse-primary: '#b7ccb9'
  secondary: '#566252'
  on-secondary: '#ffffff'
  secondary-container: '#d4e1cd'
  on-secondary-container: '#586454'
  tertiary: '#45413b'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c5852'
  on-tertiary-container: '#d5cec6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e8d5'
  primary-fixed-dim: '#b7ccb9'
  on-primary-fixed: '#0e1f13'
  on-primary-fixed-variant: '#394b3d'
  secondary-fixed: '#d9e6d2'
  secondary-fixed-dim: '#bdcab7'
  on-secondary-fixed: '#141e12'
  on-secondary-fixed-variant: '#3e4a3b'
  tertiary-fixed: '#e9e1d9'
  tertiary-fixed-dim: '#ccc5be'
  on-tertiary-fixed: '#1e1b16'
  on-tertiary-fixed-variant: '#4a4640'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system for this cargo courier brand focuses on "Sophisticated Logistics"—moving away from the industrial, high-visibility tropes of the shipping industry toward an aesthetic of calm, quiet efficiency. The brand personality is professional, dependable, and meticulously organized.

The design style is **Minimalism** with a focus on high-end editorial layouts. It utilizes generous whitespace, precise alignment, and a "less is more" philosophy to convey a sense of control and premium service. The UI should evoke an emotional response of trust and serenity, suggesting that the user's cargo is in capable, refined hands.

## Colors
The palette shifts away from standard "urgent" colors like red or orange, instead using muted earth tones to signal stability and sustainability.

- **Primary (Sage Forest):** A deep, muted green used for core branding, primary actions, and headers. It represents growth and reliability.
- **Secondary (Soft Sage):** Used for decorative elements, subtle highlights, and success states.
- **Tertiary (Warm Sand):** A muted earth tone for secondary containers, dividers, and background depth.
- **Neutral (Off-White/Bone):** The primary background color to avoid the harshness of pure white, providing a gallery-like backdrop for content.
- **Text:** Deep Charcoal (#2D2D2D) for maximum readability without the starkness of pure black.

## Typography
The typography strategy pairs the geometric authority of **Montserrat** for headings with the functional clarity of **Inter** for body copy.

Headings should be set with tight letter-spacing to feel modern and "locked-in." Body text utilizes Inter’s systematic approach to ensure legibility during complex tasks like tracking shipments or reading logistical manifests. Use the `label-caps` style for categories, small headers, and metadata to add a touch of editorial sophistication.

## Layout & Spacing
The layout follows a **fixed grid** philosophy for desktop to maintain a centered, premium feel, transitioning to a fluid model for mobile devices.

- **Grid:** A 12-column grid for desktop with 24px gutters.
- **Rhythm:** An 8px linear scale drives all padding and margins. 
- **White Space:** Information density should be kept low. Group related logistics data into distinct modules separated by significant vertical margins (48px+) to allow the eye to rest.
- **Mobile:** Elements stack vertically with reduced side margins (16px), ensuring touch targets remain large and accessible.

## Elevation & Depth
This design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

Depth is created by placing components on slightly different colored backgrounds (e.g., a Warm Sand card on an Off-White background). When elevation is required for interactivity (like a floating tracking bar), use a very soft, ambient shadow: `0px 4px 20px rgba(74, 93, 78, 0.05)`. This subtle tinting of the shadow with the primary green color maintains the organic feel of the brand.

## Shapes
The shape language is **Soft**. It uses small corner radii to feel approachable but maintains enough structural "sharpness" to look professional and serious.

- **Standard Elements:** 0.25rem (4px) radius for buttons and input fields.
- **Cards/Containers:** 0.5rem (8px) for larger layout blocks.
- **Icons:** Should use a 1.5pt or 2pt stroke weight with slightly rounded caps to match the UI's geometry.

## Components
- **Buttons:** Primary buttons use the Forest Green background with white text. Secondary buttons use a "ghost" style with a 1px border in Sage and no fill.
- **Input Fields:** Large, 56px height inputs with a subtle Warm Sand background and a bottom-only border that transitions to a full Sage border on focus.
- **Tracking Cards:** High-contrast cards with a Soft Sage header and a white body. Use clear, vertical progress steppers to indicate cargo status.
- **Chips:** Used for shipment status (e.g., "In Transit", "Delivered"). Use the tertiary earth tones with darker text to keep them subtle and non-distracting.
- **Lists:** Clean, borderless list items separated by 1px horizontal rules in a very light gray.
- **Tracking Bar:** A prominent, minimalist search input at the top of the experience, treated as the most important functional element.
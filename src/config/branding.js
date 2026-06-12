/**
 * ==========================================================================
 *  BRANDING CONFIG - update this file to rebrand the entire app.
 *  Name, colors, logo, fonts, and footer info are centralized here;
 *  no component hardcodes any of these.
 *
 *  - colors are injected as CSS variables (see applyBranding below) and
 *    referenced by tailwind.config.js, so changing a hex here re-themes
 *    every Tailwind `primary`/`success`/... class app-wide.
 *  - To use an image logo: set logo.type = "image" and drop the file at
 *    public/logo.svg (or change imagePath).
 *  - Favicon: replace public/favicon.svg (referenced from index.html).
 * ==========================================================================
 */
export const branding = {
  appName: 'CorpusIQ', // placeholder - easy to rename later
  tagline: 'Understand your retirement future in 3 minutes',
  logo: {
    type: 'text', // "text" | "image" - switch to "image" once a logo is ready
    text: 'CorpusIQ',
    imagePath: '/logo.svg', // used if type === "image"
  },
  colors: {
    primary: '#0F766E',
    secondary: '#F59E0B',
    accent: '#6366F1',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    // dark-mode counterparts (used when <html> has class="dark")
    backgroundDark: '#0B1220',
    surfaceDark: '#151E2E',
    textPrimaryDark: '#E5EAF2',
    textSecondaryDark: '#94A3B8',
  },
  fonts: {
    heading: "'Plus Jakarta Sans', Inter, sans-serif",
    body: 'Inter, sans-serif',
  },
  seo: {
    siteUrl: 'https://corpusiq.netlify.app', // update when deployed
    ogImage: '/og-image.png', // drop a 1200×630 image in /public
  },
  footer: {
    disclaimer:
      'These are illustrative projections based on assumptions, not guaranteed returns. Consult a financial advisor for personalized advice.',
    copyrightText: '© 2026 CorpusIQ. All rights reserved.',
    contactEmail: 'hello@example.com',
    links: [{ label: 'How It Works', href: '/how-it-works' }],
  },
  social: {
    twitter: '',
    linkedin: '',
    instagram: '',
  },
};

/** "#0F766E" -> "15 118 110" (space-separated RGB for Tailwind alpha support). */
function hexToRgbTriplet(hex) {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/**
 * Inject branding colors/fonts as CSS variables on :root.
 * Called once at startup (main.jsx). Each color is set twice:
 *   --color-x       the raw hex (for gradients, charts, plain CSS)
 *   --color-x-rgb   an RGB triplet (lets Tailwind opacity modifiers work)
 * Tailwind classes like `bg-primary/10` resolve to these variables,
 * so this is the single theming hook. Colors must be hex values.
 */
export function applyBranding() {
  const root = document.documentElement;
  const c = branding.colors;
  const colorVars = {
    '--color-primary': c.primary,
    '--color-secondary': c.secondary,
    '--color-accent-brand': c.accent,
    '--color-success': c.success,
    '--color-warning': c.warning,
    '--color-danger': c.danger,
    '--color-background': c.background,
    '--color-surface': c.surface,
    '--color-text-primary': c.textPrimary,
    '--color-text-secondary': c.textSecondary,
    '--color-background-dark': c.backgroundDark,
    '--color-surface-dark': c.surfaceDark,
    '--color-text-primary-dark': c.textPrimaryDark,
    '--color-text-secondary-dark': c.textSecondaryDark,
  };
  for (const [key, value] of Object.entries(colorVars)) {
    root.style.setProperty(key, value);
    root.style.setProperty(`${key}-rgb`, hexToRgbTriplet(value));
  }
  root.style.setProperty('--font-heading', branding.fonts.heading);
  root.style.setProperty('--font-body', branding.fonts.body);

  document.title = `${branding.appName} - ${branding.tagline}`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta)
    meta.setAttribute('content', `${branding.appName}: ${branding.tagline}`);
}

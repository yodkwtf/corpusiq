import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ExternalLink, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { branding } from '../../config/branding';
import { usePlanner } from '../../context/PlannerContext';

// lucide-react no longer ships brand icons - social links render as labels.
const SOCIAL_LABELS = {
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
};

export function Navbar() {
  const { state, dispatch, isDark } = usePlanner();
  const location = useLocation();

  return (
    <header className="print-hide sticky top-0 z-40 border-b border-ink-100/80 bg-canvas/75 backdrop-blur-lg dark:border-ink-800/70 dark:bg-canvas-dark/75">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          aria-label={`${branding.appName} home`}
          className="text-text-primary dark:text-text-primary-dark"
        >
          <Logo />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/how-it-works"
            className={`rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-ink-100 dark:hover:bg-ink-800 sm:px-3 ${
              location.pathname === '/how-it-works' ? 'text-primary' : ''
            }`}
          >
            <span className="hidden sm:inline">How It Works</span>
            <span className="sm:hidden">Guide</span>
          </Link>
          {state.ui.hasResults && (
            <Link
              to="/dashboard"
              className={`rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-ink-100 dark:hover:bg-ink-800 sm:px-3 ${
                location.pathname === '/dashboard' ? 'text-primary' : ''
              }`}
            >
              Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_DARK', value: !isDark })}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg p-2 transition-colors hover:bg-ink-100 dark:hover:bg-ink-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const socials = Object.entries(branding.social).filter(([, url]) => url);

  return (
    <footer className="print-hide mt-16 border-t border-ink-100/80 dark:border-ink-800/70">
      <div className="mx-auto max-w-6xl px-4">
        {/* Main row */}
        <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand side */}
          <div className="max-w-xs space-y-3">
            <Link
              to="/"
              aria-label={`${branding.appName} home`}
              className="text-text-primary dark:text-text-primary-dark"
            >
              <Logo />
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
              {branding.tagline}
            </p>
          </div>

          {/* Links + socials */}
          {(branding.footer.links.length > 0 || socials.length > 0) && (
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:justify-end"
            >
              {branding.footer.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-text-secondary transition-colors hover:text-primary dark:text-text-secondary-dark dark:hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              {socials.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-primary dark:text-text-secondary-dark dark:hover:text-primary"
                >
                  {SOCIAL_LABELS[key] || key}
                  <ExternalLink size={11} aria-hidden="true" />
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-xl border border-ink-100 bg-surface/60 px-4 py-3 backdrop-blur dark:border-ink-800 dark:bg-surface-dark/50">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p className="text-xs leading-relaxed text-text-secondary dark:text-text-secondary-dark">
            {branding.footer.disclaimer}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-ink-100 py-5 dark:border-ink-800">
          <p className="text-center text-xs text-text-secondary dark:text-text-secondary-dark sm:text-left">
            ©{new Date().getFullYear()} {branding.appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

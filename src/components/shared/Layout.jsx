import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Mail, ExternalLink } from "lucide-react";
import Logo from "./Logo";
import { branding } from "../../config/branding";
import { usePlanner } from "../../context/PlannerContext";

// lucide-react no longer ships brand icons - social links render as labels.
const SOCIAL_LABELS = { twitter: "Twitter / X", linkedin: "LinkedIn", instagram: "Instagram" };

export function Navbar() {
  const { state, dispatch, isDark } = usePlanner();
  const location = useLocation();

  return (
    <header className="print-hide sticky top-0 z-40 border-b border-ink-100 bg-surface/90 backdrop-blur dark:border-ink-800 dark:bg-surface-dark/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" aria-label={`${branding.appName} home`} className="text-text-primary dark:text-text-primary-dark">
          <Logo />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-3">
          <Link
            to="/how-it-works"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-ink-100 dark:hover:bg-ink-800 ${
              location.pathname === "/how-it-works" ? "text-primary" : ""
            }`}
          >
            How It Works
          </Link>
          {state.ui.hasResults && (
            <Link
              to="/dashboard"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-ink-100 dark:hover:bg-ink-800 ${
                location.pathname === "/dashboard" ? "text-primary" : ""
              }`}
            >
              Dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_DARK", value: !isDark })}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
    <footer className="print-hide mt-12 border-t border-ink-100 bg-surface py-8 dark:border-ink-800 dark:bg-surface-dark">
      <div className="mx-auto max-w-6xl space-y-4 px-4 text-sm text-text-secondary dark:text-text-secondary-dark">
        <p className="max-w-3xl leading-relaxed">{branding.footer.disclaimer}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {branding.footer.links.map((link) => (
            <Link key={link.href} to={link.href} className="font-medium hover:text-primary">
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${branding.footer.contactEmail}`}
            className="inline-flex items-center gap-1.5 font-medium hover:text-primary"
          >
            <Mail size={14} aria-hidden="true" />
            {branding.footer.contactEmail}
          </a>
          {socials.map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium hover:text-primary"
            >
              {SOCIAL_LABELS[key] || key}
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="text-xs">{branding.footer.copyrightText}</p>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      <Footer />
    </div>
  );
}

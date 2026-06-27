import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, ShieldCheck, Heart } from "lucide-react";
import Logo from "./Logo";
import { branding } from "../../config/branding";
import { usePlanner } from "../../context/PlannerContext";

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
              location.pathname === "/how-it-works" ? "text-primary" : ""
            }`}
          >
            <span className="hidden sm:inline">How It Works</span>
            <span className="sm:hidden">Guide</span>
          </Link>
          {state.ui.hasResults && (
            <Link
              to="/dashboard"
              className={`rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-ink-100 dark:hover:bg-ink-800 sm:px-3 ${
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
  return (
    <footer className="print-hide mt-24 border-t border-ink-100 bg-gradient-to-b from-transparent to-surface/70 dark:border-ink-800 dark:to-surface-dark/70">
      <div className="mx-auto max-w-6xl px-4">
        {/* Main Content */}
        <div className="grid gap-12 py-16 md:grid-cols-[1fr_1fr]">
          {/* Brand */}
          <div className="space-y-5">
            <Link
              to="/"
              aria-label={`${branding.appName} home`}
              className="inline-block transition-opacity hover:opacity-80"
            >
              <Logo />
            </Link>

            <p className="max-w-sm text-sm leading-7 text-text-secondary dark:text-text-secondary-dark">
              {branding.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="justify-self-start md:justify-self-end">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-text-primary dark:text-text-primary-dark">
              Navigation
            </h3>

            <nav className="space-y-3">
              {branding.footer.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm text-text-secondary transition-all duration-200 hover:translate-x-1 hover:text-primary dark:text-text-secondary-dark"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 dark:border-primary/20 dark:bg-primary/10">
          <div className="flex items-start gap-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary" />

            <div>
              <h4 className="font-medium text-text-primary dark:text-text-primary-dark">
                Educational Disclaimer
              </h4>

              <p className="mt-2 text-sm leading-6 text-text-secondary dark:text-text-secondary-dark">
                {branding.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-100 py-6 text-sm dark:border-ink-800 md:flex-row">
          <p className="text-text-secondary dark:text-text-secondary-dark">
            © {new Date().getFullYear()} {branding.appName}. All rights
            reserved.
          </p>

          <p className="flex items-center gap-1 text-text-secondary dark:text-text-secondary-dark">
            Made with
            <Heart size={14} className="fill-red-500 text-red-500" />
            for better retirement planning.
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

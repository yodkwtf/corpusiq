import { branding } from '../../config/branding';
import { TrendingUp } from 'lucide-react';

/** App logo - reads entirely from branding config. */
export default function Logo({ className = '' }) {
  if (branding.logo.type === 'image') {
    return (
      <img
        src={branding.logo.imagePath}
        alt={branding.appName}
        className={`h-8 w-auto ${className}`}
      />
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 font-bold ${className}`}>
      <span
        className="flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-brand p-1.5 text-white shadow-md shadow-primary/25"
        aria-hidden="true"
      >
        <TrendingUp size={16} />
      </span>
      <span className="translate-y-px leading-none">{branding.logo.text}</span>
    </span>
  );
}

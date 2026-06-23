import { useEffect } from 'react';
import { branding } from '../config/branding';

function setMeta(selector, content) {
  let el = document.querySelector(selector);
  if (!el) {
    const [attr, val] = selector.replace('[', '').replace(']', '').split('=');
    el = document.createElement('meta');
    el.setAttribute(attr.trim(), val.replace(/"/g, '').trim());
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO({ title, description, path = '' } = {}) {
  useEffect(() => {
    const { appName, tagline, seo } = branding;
    const fullTitle = title
      ? `${appName} - ${appName}`
      : `${appName} - ${tagline}`;
    const desc = description || `${appName}: ${tagline}`;
    const url = `${seo.siteUrl}${path}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', desc);
    setMeta('meta[name="robots"]', 'index, follow');

    // Open Graph
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:type"]', 'website');
    setMeta('meta[property="og:site_name"]', appName);
    if (seo.ogImage)
      setMeta('meta[property="og:image"]', `${seo.siteUrl}${seo.ogImage}`);

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', desc);
    if (seo.ogImage)
      setMeta('meta[name="twitter:image"]', `${seo.siteUrl}${seo.ogImage}`);
    if (seo.twitterHandle)
      setMeta('meta[name="twitter:site"]', seo.twitterHandle);

    // Canonical
    setLink('canonical', url);
  }, [title, description, path]);
}

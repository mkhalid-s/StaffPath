import { type AnchorHTMLAttributes, type MouseEvent, useSyncExternalStore } from 'react';

const routeEvent = 'staffpath:navigate';
// vite.config.ts sets base: '/StaffPath/' so the app can deploy under a
// sub-path (GitHub Pages). In-app routes stay root-relative; the base is
// applied here at the URL boundary and stripped when reading the location.
const BASE = import.meta.env.BASE_URL.endsWith('/') && import.meta.env.BASE_URL !== '/'
  ? import.meta.env.BASE_URL.slice(0, -1)
  : import.meta.env.BASE_URL;

export function withBase(to: string): string {
  if (BASE === '/' || to.startsWith(BASE)) return to;
  return `${BASE}${to.startsWith('/') ? to : `/${to}`}`;
}

export function stripBase(pathname: string): string {
  if (BASE !== '/' && (pathname === BASE || pathname.startsWith(`${BASE}/`))) {
    return pathname.slice(BASE.length) || '/';
  }
  return pathname;
}

const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  window.addEventListener(routeEvent, callback);
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener(routeEvent, callback); };
};

export function usePathname() {
  return useSyncExternalStore(subscribe, () => stripBase(window.location.pathname), () => '/');
}

export function navigate(to: string) {
  if (typeof window === 'undefined') return;
  const target = withBase(to);
  if (window.location.pathname !== target) {
    window.history.pushState({}, '', target);
    window.dispatchEvent(new Event(routeEvent));
    window.scrollTo({ top: 0 });
  }
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> { to: string }

export function Link({ to, onClick, ...props }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };
  return <a {...props} href={withBase(to)} onClick={handleClick} />;
}

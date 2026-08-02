import { type AnchorHTMLAttributes, type MouseEvent, useSyncExternalStore } from 'react';

const routeEvent = 'staffpath:navigate';
const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  window.addEventListener(routeEvent, callback);
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener(routeEvent, callback); };
};

export function usePathname() {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/');
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> { to: string }

export function Link({ to, onClick, ...props }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      window.dispatchEvent(new Event(routeEvent));
      window.scrollTo({ top: 0 });
    }
  };
  return <a {...props} href={to} onClick={handleClick} />;
}

export type ConsentValue = 'granted' | 'denied';
export type ConsentSettings = Record<'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization', ConsentValue>
  & Partial<Record<'functionality_storage' | 'security_storage', ConsentValue>>;

type GtmWindow = Window & {
  cifriaGtmLoaded?: boolean;
  dataLayer?: unknown[];
};

export const gtmContainerId = 'GTM-N6SL9MLZ';

export function shouldLoadGoogleTagManager(consent: string | null): boolean {
  return consent === 'granted';
}

export function consentSettings(value: ConsentValue): ConsentSettings {
  return {
    analytics_storage: value,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };
}

export function loadGoogleTagManager(window: GtmWindow, document: Document): boolean {
  if (window.cifriaGtmLoaded || document.querySelector('script[data-cifria-gtm]')) return false;

  window.cifriaGtmLoaded = true;
  window.dataLayer ??= [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.dataset.cifriaGtm = 'true';
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`;
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
  else document.head.append(script);
  return true;
}
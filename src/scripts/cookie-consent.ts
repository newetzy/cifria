export {};

type ConsentValue = 'granted' | 'denied';
type ConsentSettings = Record<'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization', ConsentValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: string, action: string, settings: ConsentSettings) => void;
  }
}

const storageKey = 'cifria_analytics_consent';
const banner = document.querySelector<HTMLElement>('[data-cookie-consent]');
const acceptButton = document.querySelector<HTMLButtonElement>('[data-cookie-accept]');
const rejectButton = document.querySelector<HTMLButtonElement>('[data-cookie-reject]');

function dataLayer(): unknown[] {
  window.dataLayer ??= [];
  return window.dataLayer;
}

function updateConsent(values: ConsentSettings): void {
  window.gtag?.('consent', 'update', values);
}

function showBanner(): void {
  if (banner) banner.hidden = false;
}

function setConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // The consent signal can still be sent for this page view when storage is unavailable.
  }

  updateConsent({
    analytics_storage: value,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  if (value === 'granted') dataLayer().push({ event: 'cifria_consent_granted' });
  if (banner) banner.hidden = true;
}

let savedConsent: string | null = null;
try {
  savedConsent = localStorage.getItem(storageKey);
} catch {
  savedConsent = null;
}

if (!savedConsent) showBanner();
acceptButton?.addEventListener('click', () => setConsent('granted'));
rejectButton?.addEventListener('click', () => setConsent('denied'));
document.querySelectorAll<HTMLAnchorElement>('[data-cookie-settings]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showBanner();
  });
});

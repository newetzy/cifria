import { consentSettings, loadGoogleTagManager, shouldLoadGoogleTagManager, type ConsentSettings, type ConsentValue } from '../lib/gtm';

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

function initializeConsentMode(): void {
  window.dataLayer ??= [];
  window.gtag ??= function gtag(command, action, settings) {
    window.dataLayer?.push([command, action, settings]);
  };
  window.gtag('consent', 'default', {
    ...consentSettings('denied'),
    functionality_storage: 'granted',
    security_storage: 'granted',
  });
}

function updateConsent(value: ConsentValue): void {
  window.gtag?.('consent', 'update', consentSettings(value));
}

function activateAnalytics(): void {
  updateConsent('granted');
  window.dataLayer?.push({ event: 'cifria_consent_granted' });
  loadGoogleTagManager(window, document);
}

function showBanner(): void {
  if (banner) banner.hidden = false;
}

function setConsent(value: ConsentValue): void {
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // The preference applies to this page view when storage is unavailable.
  }

  if (value === 'granted') activateAnalytics();
  else updateConsent('denied');
  if (banner) banner.hidden = true;
}

initializeConsentMode();

let savedConsent: string | null = null;
try {
  savedConsent = localStorage.getItem(storageKey);
} catch {
  savedConsent = null;
}

if (shouldLoadGoogleTagManager(savedConsent)) activateAnalytics();
else if (savedConsent !== 'denied') showBanner();

acceptButton?.addEventListener('click', () => setConsent('granted'));
rejectButton?.addEventListener('click', () => setConsent('denied'));
document.querySelectorAll<HTMLAnchorElement>('[data-cookie-settings]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showBanner();
  });
});

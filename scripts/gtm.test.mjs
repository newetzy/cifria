import assert from 'node:assert/strict';
import test from 'node:test';
import { consentSettings, gtmContainerId, loadGoogleTagManager, shouldLoadGoogleTagManager } from '../src/lib/gtm.ts';

function createDocument() {
  const inserted = [];
  const firstScript = { parentNode: { insertBefore: (script) => inserted.push(script) } };
  return {
    inserted,
    querySelector: () => null,
    createElement: () => ({ dataset: {} }),
    getElementsByTagName: () => [firstScript],
    head: { append: (script) => inserted.push(script) },
  };
}

test('GTM se inserta una sola vez después de conceder consentimiento', () => {
  const document = createDocument();
  const window = { dataLayer: [] };
  assert.equal(loadGoogleTagManager(window, document), true);
  assert.equal(loadGoogleTagManager(window, document), false);
  assert.equal(document.inserted.length, 1);
  assert.equal(document.inserted[0].src, `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`);
});

test('el consentimiento denegado mantiene analítica y publicidad denegadas', () => {
  assert.deepEqual(consentSettings('denied'), {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
});
test('GTM solo se activa en visitas con consentimiento previamente concedido', () => {
  assert.equal(shouldLoadGoogleTagManager(null), false);
  assert.equal(shouldLoadGoogleTagManager('denied'), false);
  assert.equal(shouldLoadGoogleTagManager('granted'), true);
});
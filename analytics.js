/* GardenPro GA4 interaction tracking. Never send form field values or other PII. */
(function () {
  'use strict';

  if (window.__gardenProAnalyticsLoaded) return;
  window.__gardenProAnalyticsLoaded = true;

  var track = function (eventName, parameters) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters || {});
    }
  };

  var cleanText = function (element) {
    return (element.getAttribute('aria-label') || element.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);
  };

  var classifyLink = function (href) {
    if (/^tel:/i.test(href)) return 'phone';
    if (/^mailto:/i.test(href)) return 'email';
    if (/wa\.me|whatsapp/i.test(href)) return 'whatsapp';
    return '';
  };

  document.addEventListener('click', function (event) {
    var element = event.target.closest('a, button');
    if (!element || element.disabled) return;

    var href = element.getAttribute('href') || '';
    var contactMethod = classifyLink(href);
    var label = cleanText(element);

    if (contactMethod) {
      track('contact_click', {
        contact_method: contactMethod,
        link_text: label,
        page_path: window.location.pathname
      });
      return;
    }

    if (element.matches('.faq-q')) {
      track('faq_interaction', {
        question: label,
        page_path: window.location.pathname
      });
      return;
    }

    if (element.matches('.img-tab')) {
      track('select_content', {
        content_type: 'portfolio_image',
        item_id: label || 'portfolio_image'
      });
      return;
    }

    if (element.matches('a.btn-primary, a.btn-ghost, a.nav-cta, a.service-btn, a.card-cta, a.aside-btn, button.plan-cta')) {
      track('cta_click', {
        cta_label: label,
        cta_location: element.closest('header, nav, section, footer')?.tagName.toLowerCase() || 'page',
        destination: href || 'form_action',
        page_path: window.location.pathname
      });
    }
  });

  document.addEventListener('focusin', function (event) {
    var field = event.target;
    if (!field.matches('input, select, textarea')) return;
    var form = field.closest('form');
    if (!form || form.dataset.gaStarted) return;
    form.dataset.gaStarted = 'true';
    track('form_start', {
      form_id: form.id || form.getAttribute('name') || 'lead_form',
      page_path: window.location.pathname
    });
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form.matches('form') || !form.checkValidity()) return;
    track('generate_lead', {
      form_id: form.id || form.getAttribute('name') || 'lead_form',
      page_path: window.location.pathname
    });
  }, true);
}());

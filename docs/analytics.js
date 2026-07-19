/* Keep this copy with the published docs site. It records interaction metadata only, never form values. */
(function () {
  'use strict';
  if (window.__gardenProAnalyticsLoaded) return;
  window.__gardenProAnalyticsLoaded = true;

  var track = function (name, data) {
    if (typeof window.gtag === 'function') window.gtag('event', name, data || {});
  };
  var text = function (element) {
    return (element.getAttribute('aria-label') || element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  };

  document.addEventListener('click', function (event) {
    var element = event.target.closest('a, button');
    if (!element || element.disabled) return;
    var href = element.getAttribute('href') || '';
    var label = text(element);
    var method = /^tel:/i.test(href) ? 'phone' : /^mailto:/i.test(href) ? 'email' : /wa\.me|whatsapp/i.test(href) ? 'whatsapp' : '';
    if (method) {
      track('contact_click', { contact_method: method, link_text: label, page_path: location.pathname });
    } else if (element.matches('.faq-q')) {
      track('faq_interaction', { question: label, page_path: location.pathname });
    } else if (element.matches('.img-tab')) {
      track('select_content', { content_type: 'portfolio_image', item_id: label || 'portfolio_image' });
    } else if (element.matches('a.btn-primary, a.btn-ghost, a.nav-cta, a.service-btn, a.card-cta, a.aside-btn, button.plan-cta')) {
      track('cta_click', { cta_label: label, destination: href || 'form_action', page_path: location.pathname });
    }
  });

  document.addEventListener('focusin', function (event) {
    var field = event.target;
    var form = field.matches('input, select, textarea') && field.closest('form');
    if (!form || form.dataset.gaStarted) return;
    form.dataset.gaStarted = 'true';
    track('form_start', { form_id: form.id || form.getAttribute('name') || 'lead_form', page_path: location.pathname });
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (form.matches('form') && form.checkValidity()) {
      track('generate_lead', { form_id: form.id || form.getAttribute('name') || 'lead_form', page_path: location.pathname });
    }
  }, true);
}());

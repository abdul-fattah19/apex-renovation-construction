// Apex Renovation & Construction — shared site behavior

document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { mainNav.classList.remove('open'); });
    });
  }

  // Active nav link
  var current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 0 var(--gold), 0 8px 20px rgba(15,42,30,0.14)'
        : '0 2px 0 var(--gold)';
    }, { passive: true });
  }

  // Gallery filter
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // Before/after slider
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var wrap = slider.closest('.ba-wrap');
    var after = wrap.querySelector('.side.after');
    var line = wrap.querySelector('.line');
    function update() {
      var val = slider.value;
      if (after) after.style.clipPath = 'inset(0 0 0 ' + val + '%)';
      if (line) line.style.left = val + '%';
    }
    slider.addEventListener('input', update);
    update();
  });

  // Forms — submit to Formspree via fetch, no page reload
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var success = form.parentElement.querySelector('.form-success');
    var errorBox = form.parentElement.querySelector('.form-error');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorBox) errorBox.style.display = 'none';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.dataset.label = submitBtn.dataset.label || submitBtn.textContent; submitBtn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            if (success) {
              success.classList.add('show');
              success.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            if (errorBox) errorBox.style.display = 'block';
          }
        })
        .catch(function () {
          if (errorBox) errorBox.style.display = 'block';
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label; }
        });
    });
  });
});

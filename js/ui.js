// js/ui.js — Cat filter arrows + Post step controller
(function() {
  function initCatArrows() {
    var filter = document.getElementById('cat-filter');
    var btnL   = document.getElementById('cat-arrow-left');
    var btnR   = document.getElementById('cat-arrow-right');
    if (!filter || !btnL || !btnR) return;

    var STEP = 140;

    function updateArrows() {
      btnL.classList.toggle('hidden', filter.scrollLeft <= 4);
      btnR.classList.toggle('hidden', filter.scrollLeft + filter.clientWidth >= filter.scrollWidth - 4);
    }

    btnL.addEventListener('click', function() {
      filter.scrollBy({ left: -STEP, behavior: 'smooth' });
    });
    btnR.addEventListener('click', function() {
      filter.scrollBy({ left: STEP, behavior: 'smooth' });
    });
    filter.addEventListener('scroll', updateArrows, { passive: true });

    // Re-check after feed renders new pills
    var obs = new MutationObserver(updateArrows);
    obs.observe(filter, { childList: true });
    updateArrows();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatArrows);
  } else {
    initCatArrows();
  }
})();

(function() {
  var currentPostStep = 1;

  function setPostStep(n) {
    currentPostStep = n;
    for (var i = 1; i <= 4; i++) {
      var panel = document.getElementById('post-panel-' + i);
      var circle = document.getElementById('step-circle-' + i);
      var label  = document.getElementById('step-label-' + i);
      var line   = document.getElementById('step-line-' + i);
      if (!panel) continue;

      panel.style.display = (i === n) ? '' : 'none';

      if (i < n) {
        // completed
        circle.style.background  = 'var(--tangerine)';
        circle.style.color       = '#fff';
        circle.style.boxShadow   = '2px 2px 0 var(--ink)';
        circle.textContent       = '✓';
        label.style.color        = 'var(--tangerine)';
      } else if (i === n) {
        // active
        circle.style.background  = 'var(--tangerine)';
        circle.style.color       = '#fff';
        circle.style.boxShadow   = '2px 2px 0 var(--ink)';
        circle.textContent       = i;
        label.style.color        = 'var(--tangerine)';
      } else {
        // future
        circle.style.background  = 'var(--surface3)';
        circle.style.color       = 'var(--ink)';
        circle.style.boxShadow   = 'none';
        circle.textContent       = i;
        label.style.color        = 'var(--ink3)';
      }

      if (line) {
        line.style.background = (i < n) ? 'var(--tangerine)' : 'var(--border)';
      }
    }

    if (n === 4) updatePostPreview();

    window.scrollTo(0, 0);
  }

  function updatePostPreview() {
    var imgEl = document.getElementById('post-preview-img');
    if (imgEl && window._selectedFile) {
      var reader = new FileReader();
      reader.onload = function(e) {
        imgEl.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:160px;object-fit:cover;display:block" alt="preview">';
      };
      reader.readAsDataURL(window._selectedFile);
    } else if (imgEl) {
      imgEl.innerHTML = '<span style="font-size:3rem">📷</span>';
    }

    var catEl = document.getElementById('post-preview-cat');
    if (catEl) {
      var catBtn = document.querySelector('#cat-select-grid .cat-tile.selected');
      catEl.textContent = catBtn ? catBtn.dataset.emoji + ' ' + (currentLang === 'en' ? catBtn.dataset.labelEn : catBtn.dataset.label) : t('post_no_cat_preview');
    }

    var descEl = document.getElementById('post-preview-desc');
    if (descEl) {
      var desc = document.getElementById('desc-input').value.trim();
      descEl.textContent = desc || t('post_no_desc_preview');
      descEl.style.fontStyle = desc ? 'normal' : 'italic';
    }
  }

  function enableBtn(id, on) {
    var btn = document.getElementById(id);
    if (!btn) return;
    if (on) {
      btn.disabled = false;
      btn.style.background  = 'var(--tangerine)';
      btn.style.color       = '#fff';
      btn.style.cursor      = 'pointer';
      btn.style.boxShadow   = 'var(--sh)';
    } else {
      btn.disabled = true;
      btn.style.background  = 'var(--surface3)';
      btn.style.color       = 'var(--ink3)';
      btn.style.cursor      = 'not-allowed';
      btn.style.boxShadow   = 'none';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    setPostStep(1);
    document.getElementById('post-next-1')?.addEventListener('click', function() { setPostStep(2); });
    document.getElementById('post-skip-1')?.addEventListener('click', function() { setPostStep(2); });
    document.getElementById('post-next-2')?.addEventListener('click', function() { setPostStep(3); });
    document.getElementById('post-next-3')?.addEventListener('click', function() { setPostStep(4); });
    document.getElementById('post-back-4')?.addEventListener('click', function() { setPostStep(3); });

    var fileInput = document.getElementById('photo-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', function() {
        if (fileInput.files[0]) enableBtn('post-next-1', true);
      });
    }

    var origShowScreen = window.showScreen;
    if (origShowScreen) {
      window.showScreen = function(name) {
        if (name === 'post') {
          var hasFile = !!window._selectedFile;
          var hasCat  = !!document.querySelector('#cat-select-grid .cat-tile.selected');
          if (!hasFile && !hasCat) setPostStep(1);
        }
        origShowScreen.apply(this, arguments);
      };
    }
  });

  window._postStepController = {
    enableNext1: function() { enableBtn('post-next-1', true); },
    goTo: setPostStep
  };
})();
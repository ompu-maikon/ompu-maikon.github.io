(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== スマホ用メニュー ===== */
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('global-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ===== 本文（Markdown）を見やすく整える ===== */
  document.querySelectorAll('.prose').forEach(function (prose) {
    // ## 見出しごとにセクションに分ける
    var current = null;
    Array.prototype.slice.call(prose.childNodes).forEach(function (n) {
      if (n.nodeType === 1 && n.tagName === 'H2') {
        current = document.createElement('section');
        current.className = 'sec reveal' + (n.id ? ' sec-' + n.id : '');
        prose.insertBefore(current, n);
      }
      if (current) current.appendChild(n);
    });

    // 全項目が **太字** で始まる箇条書き → カード表示
    prose.querySelectorAll('ul, ol').forEach(function (list) {
      var items = list.children;
      if (!items.length) return;
      var all = Array.prototype.every.call(items, function (li) {
        var f = li.firstChild;
        while (f && f.nodeType === 3 && !f.nodeValue.trim()) f = f.nextSibling;
        return f && f.nodeType === 1 && f.tagName === 'STRONG';
      });
      if (all) list.classList.add(list.tagName === 'OL' ? 'steps' : 'cards');
    });

    // よくある質問：### を開閉式にする
    prose.querySelectorAll('.sec-faq h3').forEach(function (h) {
      var d = document.createElement('details');
      var s = document.createElement('summary');
      s.innerHTML = h.innerHTML;
      d.appendChild(s);
      var next = h.nextElementSibling;
      while (next && next.tagName !== 'H3') {
        var after = next.nextElementSibling;
        d.appendChild(next);
        next = after;
      }
      h.replaceWith(d);
    });
  });

  /* ===== スクロールでふわっと表示 ===== */
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }


  /* ===== 「Hello, World.」のタイピング ===== */
  var typeEl = document.getElementById('type');
  var typeDelay = 0;
  if (typeEl && !reduce) {
    var full = typeEl.textContent;
    typeEl.textContent = '';
    typeEl.classList.add('typing-now');
    typeDelay = 500 + full.length * 90;
    var k = 0;
    setTimeout(function step() {
      typeEl.textContent = full.slice(0, ++k);
      if (k < full.length) setTimeout(step, 70 + Math.random() * 60);
    }, 400);
  }

  /* ===== 写真の上では透明なヘッダー ===== */
  if (document.body.classList.contains('has-hero-photo')) {
    var solid = function () { document.body.classList.toggle('header-solid', window.scrollY > 40); };
    window.addEventListener('scroll', solid, { passive: true });
    solid();
  }

  /* ===== スマホ下部の「入部案内」ボタン ===== */
  var cta = document.getElementById('sticky-cta');
  if (cta) {
    var onScroll = function () {
      var nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 260;
      cta.classList.toggle('show', window.scrollY > window.innerHeight * 0.5 && !nearEnd);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== ターミナルのタイピング演出 ===== */
  var term = document.getElementById('term');
  if (term) {
    var lines = Array.prototype.slice.call(term.querySelectorAll('.tl'));
    if (reduce) { lines.forEach(function (l) { l.classList.add('show'); }); return; }
    var texts = lines.map(function (l) {
      var t = l.querySelector('.t');
      var s = t ? t.textContent : '';
      if (t) t.textContent = '';
      return s;
    });
    var i = 0;
    setTimeout(function next() {
      if (i >= lines.length) return;
      var line = lines[i], text = texts[i];
      line.classList.add('show');
      i++;
      if (line.classList.contains('cmd') && text) {
        var t = line.querySelector('.t'), c = 0;
        line.classList.add('typing');
        (function type() {
          t.textContent = text.slice(0, ++c);
          if (c < text.length) setTimeout(type, 55 + Math.random() * 50);
          else { line.classList.remove('typing'); setTimeout(next, 450); }
        })();
      } else {
        setTimeout(next, line.classList.contains('out') ? 260 : 0);
      }
    }, typeDelay);
  }
})();

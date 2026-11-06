(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- page transition (arrive) ---------- */
  var shutter = d.querySelector('.shutter');
  if (shutter && root.classList.contains('arriving')) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { shutter.classList.add('out'); }); });
    setTimeout(function () { root.classList.remove('arriving'); shutter.classList.remove('out'); sessionStorage.removeItem('ish'); }, 520);
  }
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && shutter) { root.classList.remove('arriving'); shutter.classList.remove('go', 'out'); }
  });
  /* ---------- internal links: leave transition ---------- */
  d.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href === '#') { e.preventDefault(); return; }
    if (reduce || !shutter || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (/^(https?:|mailto:|tel:)/.test(href) || href.charAt(0) === '#') return;
    if (a.hostname && a.hostname !== location.hostname) return;
    e.preventDefault();
    sessionStorage.setItem('ish', '1');
    shutter.classList.add('go');
    setTimeout(function () { location.href = href; }, 270);
  });

  /* ---------- nav: touch / keyboard ---------- */
  var items = d.querySelectorAll('.nav-item');
  function closeAll(except) {
    items.forEach(function (it) { if (it !== except) { it.classList.remove('open'); var b = it.querySelector('.nav-btn'); if (b) b.setAttribute('aria-expanded', 'false'); } });
  }
  items.forEach(function (it) {
    var btn = it.querySelector('.nav-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !it.classList.contains('open');
      closeAll(it); it.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    it.addEventListener('mouseenter', function () { btn.setAttribute('aria-expanded', 'true'); });
    it.addEventListener('mouseleave', function () { if (!it.classList.contains('open')) btn.setAttribute('aria-expanded', 'false'); });
  });
  d.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) closeAll(); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); var t = d.querySelector('.top'); if (t) t.classList.remove('drawer-open'); } });
  var burger = d.querySelector('.burger'), top = d.querySelector('.top');
  if (burger && top) burger.addEventListener('click', function () {
    var open = !top.classList.contains('drawer-open');
    top.classList.toggle('drawer-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---------- scroll reveal ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var sel = '.band h2.s,.band h1.s,.band .eb,.band .p1,.band .card,.band .ri,.band .stat,.band .st,.band .q,.band .logos,.band .tbl,.band .photo,.band .chip,.band .field,.cta h2,.cta p,.cta .btn';
    var els = d.querySelectorAll(sel);
    var seen = new Map();
    els.forEach(function (el) {
      var p = el.parentElement, n = seen.get(p) || 0; seen.set(p, n + 1);
      el.classList.add('rv'); el.style.setProperty('--d', Math.min(n * 60, 360) + 'ms');
    });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- grid signals ---------- */
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var G = 80, SPEED = 96, TAIL = 180, COL = ['#3C83F6', '#E39A4F'];
  function Signals(cv) {
    var ctx = cv.getContext('2d'), n0 = +cv.dataset.n || 6, rnd = mulberry((+cv.dataset.seed || 1) * 7919 + 13);
    var W = 0, H = 0, sig = [], visible = true, running = false, last = 0;
    function mk() {
      var cols = Math.floor(W / G), rows = Math.floor(H / G);
      var i = Math.floor(rnd() * (cols + 1)), j = Math.floor(rnd() * (rows + 1)), horiz = rnd() < .5, pts = [[W - i * G, j * G]];
      for (var s = 0; s < 4; s++) {
        var len = (2 + Math.floor(rnd() * 4)) * (rnd() < .5 ? 1 : -1);
        if (horiz) i = Math.min(Math.max(i + len, 0), cols); else j = Math.min(Math.max(j + len, 0), rows);
        var x = W - i * G, y = j * G, l = pts[pts.length - 1];
        if (l[0] !== x || l[1] !== y) pts.push([x, y]);
        horiz = !horiz;
      }
      var cum = [0]; for (var k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.abs(pts[k][0] - pts[k - 1][0]) + Math.abs(pts[k][1] - pts[k - 1][1]));
      return { p: pts, cum: cum, L: cum[cum.length - 1] };
    }
    function path() { var P, t = 0; do { P = mk(); t++; } while (P.L < TAIL * 1.4 && t < 40); return P; }
    function at(s, P) {
      for (var i = 0; i < P.p.length - 1; i++) if (s >= P.cum[i] && s <= P.cum[i + 1]) {
        var f = (s - P.cum[i]) / Math.max(P.cum[i + 1] - P.cum[i], 1);
        return [P.p[i][0] + (P.p[i + 1][0] - P.p[i][0]) * f, P.p[i][1] + (P.p[i + 1][1] - P.p[i][1]) * f];
      }
      return P.p[P.p.length - 1];
    }
    function build() {
      var n = W < 860 ? Math.min(n0, 3) : n0; sig = [];
      for (var k = 0; k < n; k++) { var P = path(); sig.push({ P: P, d: rnd() * P.L, c: COL[k % 2] }); }
    }
    function size() {
      var r = Math.min(window.devicePixelRatio || 1, 2), b = cv.parentElement.getBoundingClientRect();
      W = Math.round(b.width); H = Math.round(b.height);
      cv.width = W * r; cv.height = H * r; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(r, 0, 0, r, 0, 0);
      build(); draw(0);
    }
    function draw(dt) {
      ctx.clearRect(0, 0, W, H);
      for (var q = 0; q < sig.length; q++) {
        var s = sig[q];
        if (!reduce) s.d += SPEED * dt;
        if (s.d > s.P.L + TAIL) { s.P = path(); s.d = 0; }
        var fade = Math.min(s.d / (SPEED * .4), 1), steps = 14;
        ctx.lineWidth = 1.5; ctx.lineCap = 'butt'; ctx.strokeStyle = s.c;
        for (var i = 0; i < steps; i++) {
          var a = s.d - TAIL * (steps - i) / steps, b = s.d - TAIL * (steps - i - 1) / steps;
          if (b <= 0 || a > s.P.L) continue; a = Math.max(a, 0); b = Math.min(b, s.P.L);
          var pts = [at(a, s.P)];
          for (var j = 0; j < s.P.p.length; j++) if (s.P.cum[j] > a && s.P.cum[j] < b) pts.push(s.P.p[j]);
          pts.push(at(b, s.P));
          ctx.globalAlpha = (.04 + .46 * (i + 1) / steps) * fade; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
          for (var m = 1; m < pts.length; m++) ctx.lineTo(pts[m][0], pts[m][1]); ctx.stroke();
        }
        if (s.d <= s.P.L) { var h = at(s.d, s.P); ctx.globalAlpha = fade * .6; ctx.fillStyle = s.c; ctx.fillRect(h[0] - 3, h[1] - 3, 6, 6); }
        ctx.globalAlpha = 1;
      }
    }
    function loop(t) {
      if (!running) return;
      var dt = Math.min((t - last) / 1000, .05); last = t; draw(dt); requestAnimationFrame(loop);
    }
    function start() { if (running || reduce || !visible || d.hidden) return; running = true; last = performance.now(); requestAnimationFrame(loop); }
    function stop() { running = false; }
    size();
    if ('ResizeObserver' in window) new ResizeObserver(function () { size(); }).observe(cv.parentElement); else window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(cv.parentElement); else start();
    d.addEventListener('visibilitychange', function () { d.hidden ? stop() : start(); });
  }
  d.querySelectorAll('canvas.sigc').forEach(Signals);

  /* ---------- forms (demo handler) ---------- */
  var form = d.getElementById('contact-form');
  if (form) {
    var msg = d.createElement('div'); msg.className = 'form-msg'; msg.setAttribute('role', 'status'); form.appendChild(msg);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = form.querySelectorAll('[required]'), ok = true;
      bad.forEach(function (f) { if (!f.value.trim()) { ok = false; f.style.borderColor = '#AC631D'; } else f.style.borderColor = ''; });
      msg.classList.add('show');
      msg.textContent = ok ? 'Thank you. This form is not connected to a server yet; connect it to your form handler before launch.' : 'Please complete the required fields.';
    });
    form.addEventListener('reset', function () { msg.classList.remove('show'); });
  }
})();

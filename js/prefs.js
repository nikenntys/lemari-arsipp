// ===== Pengaturan pengunjung: bahasa (Indonesia / Inggris) dan mode gelap / terang =====
// Dipakai di beranda dan semua halaman artikel. Pilihan pengunjung disimpan di browser (localStorage).
// Teks Indonesia di halaman dicocokkan dengan kamus (js/kamus-en.js dan js/kamus-artikel-en.js), lalu diganti.
(function () {
  const root = document.documentElement;
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  let lang = store.get('cm-lang') === 'en' ? 'en' : 'id';
  const dict = () => window.KAMUS_EN || {};

  // Terjemahkan satu teks. Spasi di awal dan akhir dipertahankan. Teks gabungan ("tanggal · durasi", "judul | nama") ikut diterjemahkan per bagian.
  function tr(s) {
    const k = s.trim(), d = dict();
    if (!k) return s;
    let out = d[k], m;
    if (out == null) {
      if ((m = k.match(/^(.*?)(\s*\u2192)$/)) && d[m[1]] != null) out = d[m[1]] + m[2];
      else for (const sep of [' \u00b7 ', ' | ', ' - ']) {
        if (k.includes(sep)) {
          const p = k.split(sep);
          if (p.some(x => d[x] != null)) { out = p.map(x => (d[x] != null ? d[x] : x)).join(sep); break; }
        }
      }
    }
    return out == null ? s : s.replace(k, out);
  }
  const PREFIX = 'Produk yang dibahas: ';
  const trAttr = v => (v.startsWith(PREFIX) ? 'Products discussed: ' + tr(v.slice(PREFIX.length)) : tr(v));

  const head = { title: null, desc: null };
  function apply() {
    const en = lang === 'en';
    root.lang = en ? 'en' : 'id';
    // teks di halaman
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentNode && /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
    });
    let n;
    while ((n = w.nextNode())) {
      if (n.__id === undefined) {
        if (!en) continue;
        const t = tr(n.nodeValue);
        if (t !== n.nodeValue) { n.__id = n.nodeValue; n.nodeValue = t; }
      } else n.nodeValue = en ? tr(n.__id) : n.__id;
    }
    // gambar (alt), kolom isian (placeholder), dan label tombol (aria-label)
    document.querySelectorAll('[alt],[placeholder],[aria-label]').forEach(el => {
      el.__a = el.__a || {};
      for (const a of ['alt', 'placeholder', 'aria-label']) {
        if (!el.hasAttribute(a)) continue;
        if (el.__a[a] === undefined) {
          if (!en) continue;
          const v = el.getAttribute(a), t = trAttr(v);
          if (t !== v) { el.__a[a] = v; el.setAttribute(a, t); }
        } else el.setAttribute(a, en ? trAttr(el.__a[a]) : el.__a[a]);
      }
    });
    // judul tab dan deskripsi
    const md = document.querySelector('meta[name="description"]');
    if (head.title === null) { head.title = document.title; head.desc = md ? md.content : ''; }
    document.title = en ? tr(head.title) : head.title;
    if (md) md.content = en ? tr(head.desc) : head.desc;
    // tombol bahasa
    document.querySelectorAll('[data-lang]').forEach(b => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    });
  }

  function setLang(l) { lang = l === 'en' ? 'en' : 'id'; store.set('cm-lang', lang); apply(); }

  const tcolor = () => document.querySelector('meta[name="theme-color"]');
  function setTheme(t, save) {
    root.classList.add('tswap'); setTimeout(() => root.classList.remove('tswap'), 450);
    root.dataset.theme = t;
    if (save !== false) store.set('cm-theme', t);
    const m = tcolor(); if (m) m.content = t === 'dark' ? '#050d1f' : '#0b1f4a';
    document.querySelectorAll('.theme-btn').forEach(b => b.setAttribute('aria-pressed', t === 'dark'));
  }

  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  document.querySelectorAll('.theme-btn').forEach(b => b.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')));
  // Kalau pengunjung belum memilih, ikuti pengaturan tema perangkatnya
  const mq = matchMedia('(prefers-color-scheme: dark)');
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(e => { if (!store.get('cm-theme')) setTheme(e.matches ? 'dark' : 'light', false); });

  setTheme(root.dataset.theme || (mq.matches ? 'dark' : 'light'), false);
  apply();
  // CM.t('teks') = terjemahan teks untuk skrip lain; CM.apply() = jalankan ulang setelah halaman diubah oleh skrip
  window.CM = { get lang() { return lang; }, t: s => (lang === 'en' ? tr(s) : s), apply };
})();

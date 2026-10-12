// ===== HAPUS BAGIAN CTA BIRU "Bingung memilih merek, model, atau jumlah?" DI SEMUA HALAMAN =====
(function () {
  document.querySelectorAll('section.cta').forEach(function (e) { e.remove(); });
})();

// ===== HERO SEMUA HALAMAN: SAMA DENGAN BERANDA =====
// Semua hero (Beranda, Produk, Portofolio, Artikel, Kontak, isi artikel) memakai foto ruangan
// assets/images/bg/hero-ruangan.jpg dengan gradasi biru muda yang sama.
// Kalau foto itu tidak ada di folder, hero tetap memakai foto lamanya (warna biru muda tetap sama).
(function () {
  const FOTO = 'assets/images/bg/hero-ruangan.jpg';
  const cs = document.currentScript;
  const base = cs && cs.src ? cs.src.replace(/js\/[^\/]*$/, '') : '';
  const url = base + FOTO;

  const css = document.createElement('style');
  css.textContent = `
html .hero[data-bg] .bg-slides,html .a-hero[data-bg] .bg-slides{background:#e8f1ff}
html .hero[data-bg] .bg-slides span,html .a-hero[data-bg] .bg-slides span{
  background-size:cover;background-position:right center;
  filter:brightness(1.35) saturate(1.1) contrast(.95);transform:scale(1.02);
  animation:cmHeroZoom 22s ease-in-out infinite alternate}
@keyframes cmHeroZoom{from{transform:scale(1.02)}to{transform:scale(1.08)}}
@media(prefers-reduced-motion:reduce){html .hero[data-bg] .bg-slides span,html .a-hero[data-bg] .bg-slides span{animation:none}}
html .hero[data-bg]::before,html .hero.home[data-bg]::before,html .a-hero[data-bg]::before{
  background:
    linear-gradient(90deg,rgba(54,124,230,.80) 0%,rgba(84,148,240,.58) 42%,rgba(150,195,250,.10) 100%),
    linear-gradient(0deg,rgba(235,244,255,.55) 0%,transparent 38%)}
html .hero[data-bg] h1,html .a-hero[data-bg] h1{color:#fff;text-shadow:0 2px 16px rgba(25,70,160,.35)}
html .hero[data-bg] p,html .a-hero[data-bg] .meta{color:#fff;text-shadow:0 1px 12px rgba(25,70,160,.35)}
html .hero[data-bg] .btn-ghost{background:rgba(255,255,255,.14);box-shadow:inset 0 0 0 1px rgba(255,255,255,.7)}
html .hero[data-bg] .btn-ghost:hover{background:#fff;color:#367ce6}
html .a-hero[data-bg]{border-bottom:2px solid #c8a96a}
html .a-hero[data-bg] .crumbs,html .a-hero[data-bg] .crumbs a{color:#fff}
html .a-hero[data-bg] .crumbs span{opacity:.8}
html .a-hero[data-bg] .tag{color:#fff;border-color:rgba(255,255,255,.8);background:rgba(255,255,255,.14)}
@media(max-width:900px){
  html .hero[data-bg] .bg-slides span,html .a-hero[data-bg] .bg-slides span{background-position:78% center}
  html .hero[data-bg]::before,html .hero.home[data-bg]::before,html .a-hero[data-bg]::before{
    background:linear-gradient(180deg,rgba(54,124,230,.78),rgba(110,166,244,.60))}
}`;
  document.head.appendChild(css);

  // ganti foto semua hero dengan foto ruangan (satu foto, tidak berganti-ganti)
  const heroes = [...document.querySelectorAll('.hero[data-bg], .a-hero[data-bg]')];
  if (!heroes.length || !base) return;
  const lama = heroes.map(h => {
    const box = h.querySelector(':scope > .bg-slides');
    return { h, bg: h.dataset.bg, html: box ? box.innerHTML : null, box };
  });
  lama.forEach(o => {
    o.h.dataset.bg = url;
    if (o.box) o.box.innerHTML = '<span class="on" style="background-image:url(\'' + url + '\')"></span>';
  });
  // kalau fotonya tidak ditemukan, kembalikan foto lama
  const t = new Image();
  t.onerror = () => lama.forEach(o => { o.h.dataset.bg = o.bg; if (o.box && o.html != null) o.box.innerHTML = o.html; });
  t.src = url;
})();

// ===== FOOTER SEMUA HALAMAN =====
// Footer dibuat di sini supaya SAMA di semua halaman: logo di tengah, lalu 3 kolom
// (Produk, Informasi Perusahaan, Kontak Kami). Warna putih; mode gelap tetap gelap.
// Ubah nomor WhatsApp, email, alamat, dan jam kerja di bagian DATA KONTAK di bawah ini.
(function () {
  const f = document.querySelector('footer.footer');
  if (!f) return;

  // ---- DATA KONTAK (ubah di sini) ----
  const WA_TAMPIL = '0811-330-1819', WA_LINK = '628113791115';
  const EMAIL = 'cahayamustikainternesia@gmail.com';
  const ALAMAT = 'Malang, Jawa Timur';
  const JAM = 'Senin sampai Jumat, 08.00 sampai 16.15';
  // ------------------------------------

  const home = f.querySelector('a.brand, a[href$="index.html"]');
  const p = (home && /^\.\.\//.test(home.getAttribute('href'))) ? '../' : '';
  const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ALAMAT);

  // terjemahan Inggris untuk teks baru (tidak menimpa yang sudah ada)
  const baru = {
    'Informasi Perusahaan': 'Company Information',
    'Chat via WhatsApp': 'Chat on WhatsApp',
    'Lihat lokasi di Google Maps': 'View location on Google Maps',
    'Lokasi': 'Location',
    'Buka di Google Maps': 'Open in Google Maps',
    'Jam kerja': 'Business hours',
    'Email': 'Email',
    'WhatsApp': 'WhatsApp',
    [JAM]: 'Monday to Friday, 08.00 to 16.15'
  };
  const K = (window.KAMUS_EN = window.KAMUS_EN || {});
  Object.keys(baru).forEach(k => { if (K[k] == null) K[k] = baru[k]; });

  const css = document.createElement('style');
  css.textContent = `
footer.footer.ft{background:#fff;color:#5f6f88;padding:0;border-top:3px solid #c8a96a;font-size:.93rem;line-height:1.6}
footer.footer.ft .ft-main{padding-top:64px;padding-bottom:52px}
footer.footer.ft .ft-top{text-align:center;max-width:640px;margin:0 auto 52px}
footer.footer.ft .ft-logo{display:inline-block}
footer.footer.ft .ft-logo img{height:72px;width:auto;display:block;margin:0 auto}
footer.footer.ft .ft-top p{margin:18px auto 0;color:#5f6f88;font-weight:300;line-height:1.75}
footer.footer.ft .ft-grid{display:grid;grid-template-columns:1.15fr .85fr 1.15fr;gap:56px;align-items:start;padding-top:48px;border-top:1px solid #e6edf7}
footer.footer.ft h4{margin:0 0 22px;color:#0b1f4a;font-size:1rem;font-weight:600;letter-spacing:.02em;position:relative;padding-bottom:12px}
footer.footer.ft h4::after{content:"";position:absolute;left:0;bottom:0;width:34px;height:2px;background:#c8a96a;border-radius:2px}
footer.footer.ft .ft-cols{display:grid;grid-template-columns:1fr 1fr;gap:28px}
footer.footer.ft .ft-sub{display:block;color:#0b1f4a;font-weight:600;margin-bottom:8px}
footer.footer.ft a{color:#5f6f88;text-decoration:none;transition:color .2s ease}
footer.footer.ft a:hover{color:#2f6fd6}
footer.footer.ft .ft-list a{display:block;padding:5px 0}
footer.footer.ft .ft-kontak{display:grid;gap:16px}
footer.footer.ft .ft-item{display:grid;grid-template-columns:38px 1fr;gap:14px;align-items:start}
footer.footer.ft .ft-ico{width:38px;height:38px;border-radius:50%;background:#eef4ff;color:#2f6fd6;display:grid;place-items:center}
footer.footer.ft .ft-ico svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
footer.footer.ft .ft-item small{display:block;color:#8a97ad;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;line-height:1.3;margin-bottom:2px}
footer.footer.ft .ft-item b{display:block;color:#0b1f4a;font-weight:500;overflow-wrap:anywhere}
footer.footer.ft .ft-item a.ft-v{color:#0b1f4a;font-weight:500;overflow-wrap:anywhere}
footer.footer.ft .ft-item a.ft-v:hover{color:#2f6fd6}
footer.footer.ft .ft-peta{display:inline-block;margin-top:4px;font-size:.84rem;color:#2f6fd6;font-weight:500}
footer.footer.ft .ft-peta:hover{color:#0b1f4a}
footer.footer.ft .ft-bar{background:#f6f8fc;border-top:1px solid #e6edf7;padding:18px 0;text-align:center;color:#7a8aa3;font-size:.82rem}
[data-theme="dark"] footer.footer.ft{background:#050d1f;color:#93a4c6}
[data-theme="dark"] footer.footer.ft .ft-logo img{background:#fff;padding:10px 18px;border-radius:10px;box-sizing:content-box}
[data-theme="dark"] footer.footer.ft .ft-top p,[data-theme="dark"] footer.footer.ft a{color:#93a4c6}
[data-theme="dark"] footer.footer.ft h4,[data-theme="dark"] footer.footer.ft .ft-sub,[data-theme="dark"] footer.footer.ft .ft-item b,[data-theme="dark"] footer.footer.ft .ft-item a.ft-v{color:#fff}
[data-theme="dark"] footer.footer.ft a:hover,[data-theme="dark"] footer.footer.ft .ft-peta{color:#8fb4ee}
[data-theme="dark"] footer.footer.ft .ft-ico{background:rgba(143,180,238,.14);color:#8fb4ee}
[data-theme="dark"] footer.footer.ft .ft-grid{border-top-color:rgba(255,255,255,.1)}
[data-theme="dark"] footer.footer.ft .ft-bar{background:#030814;border-top-color:rgba(255,255,255,.08);color:#7e8fb0}
@media(max-width:1000px){
  footer.footer.ft .ft-grid{grid-template-columns:1fr 1fr;gap:44px 40px}
  footer.footer.ft .ft-grid>div:first-child{grid-column:1/-1}
}
@media(max-width:620px){
  footer.footer.ft .ft-main{padding-top:48px;padding-bottom:40px}
  footer.footer.ft .ft-grid{grid-template-columns:1fr;gap:36px}
  footer.footer.ft .ft-cols{gap:20px}
}`;
  document.head.appendChild(css);

  const I = {
    wa:'<svg viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-1.9-1.300-2.300-2.300l.8-1-1-2z"/></svg>',
    mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    pin:'<svg viewBox="0 0 24 24"><path d="M12 21s7-6.100 7-11.500A7 7 0 0 0 5 9.500C5 14.900 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/></svg>',
    clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
  };

  f.className = 'footer ft';
  f.innerHTML = `
<div class="wrap ft-main">
  <div class="ft-top">
    <a class="ft-logo" href="${p}index.html" aria-label="CV Cahaya Mustika"><img src="${p}assets/images/LOGO CMI.png" alt="CV Cahaya Mustika" width="220" height="56"></a>
    <p>CV Cahaya Mustika, distributor lemari arsip merek Vivorti dan Zecco di Malang, melayani pengiriman ke seluruh Indonesia.</p>
  </div>
  <div class="ft-grid">
    <div>
      <h4>Produk</h4>
      <div class="ft-cols">
        <div class="ft-list"><a class="ft-sub" href="${p}produk-vivorti.html">Vivorti</a>
          <a href="${p}produk-vivorti.html#vf2">Vivorti VF-2</a><a href="${p}produk-vivorti.html#vf4">Vivorti VF-4</a><a href="${p}produk-vivorti.html#vp2">Vivorti VP-2</a><a href="${p}produk-vivorti.html#vl6">Vivorti VL-6</a></div>
        <div class="ft-list"><a class="ft-sub" href="${p}produk-zecco.html">Zecco</a>
          <a href="${p}produk-zecco.html#zs2">Zecco ZS-2</a><a href="${p}produk-zecco.html#zk2">Zecco ZK-2</a><a href="${p}produk-zecco.html#zr3">Zecco ZR-3</a><a href="${p}produk-zecco.html#zf3">Zecco ZF-3</a></div>
      </div>
    </div>
    <div class="ft-list">
      <h4>Informasi Perusahaan</h4>
      <a href="${p}index.html">Beranda</a><a href="${p}portofolio.html">Portofolio</a><a href="${p}artikel.html">Artikel</a><a href="${p}index.html#faq">Tanya Jawab</a><a href="${p}kontak.html">Kontak Kami</a>
    </div>
    <div>
      <h4>Kontak Kami</h4>
      <div class="ft-kontak">
        <div class="ft-item"><span class="ft-ico" aria-hidden="true">${I.wa}</span><div><small>WhatsApp</small><a class="ft-v" href="https://wa.me/${WA_LINK}" target="_blank" rel="noopener">${WA_TAMPIL}</a></div></div>
        <div class="ft-item"><span class="ft-ico" aria-hidden="true">${I.mail}</span><div><small>Email</small><a class="ft-v" href="mailto:${EMAIL}">${EMAIL}</a></div></div>
        <div class="ft-item"><span class="ft-ico" aria-hidden="true">${I.pin}</span><div><small>Lokasi</small><b>${ALAMAT}</b><a class="ft-peta" href="${maps}" target="_blank" rel="noopener">Buka di Google Maps &rarr;</a></div></div>
        <div class="ft-item"><span class="ft-ico" aria-hidden="true">${I.clock}</span><div><small>Jam kerja</small><b>${JAM}</b></div></div>
      </div>
    </div>
  </div>
</div>
<div class="ft-bar"><div class="wrap">&copy; 2026 CV Cahaya Mustika. Semua hak dilindungi.</div></div>`;
})();

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
// ===== Skrip semua halaman =====
const $ = s => document.querySelector(s);
const toggle = $('.menu-toggle'), menu = $('#menu'), nav = $('.navbar');

// Tombol menu (tiga garis) di HP: buka dan tutup menu
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open'); toggle.setAttribute('aria-expanded', false);
}));
// Header berubah jadi putih setelah halaman digulir sedikit
const gulir = () => nav.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', gulir, {passive: true}); gulir();

// ===== Daftar artikel (halaman artikel.html) =====
// Sumber data: js/articles.js. Artikel terbaru jadi kartu besar, sisanya di bawahnya. Tiap kartu menuju artikel/slug.html
if ($('#article-list')) {
  ARTICLES.sort((a, b) => b.iso.localeCompare(a.iso));
  const list = $('#article-list');
  // Tautan lama berbentuk #artikel/slug dialihkan ke halaman artikelnya
  const alihkan = () => { const m = location.hash.match(/^#artikel\/(.+)$/); if (m) location.replace(`artikel/${decodeURIComponent(m[1])}.html`); };
  alihkan(); addEventListener('hashchange', alihkan);
  // Foto produk untuk tiap kode produk (sama dengan gambar di produk.html)
  const FOTO = {vf2: 'lemari arsip-2', vf4: 'lemari arsip-3', vp2: 'lemari arsip-4', vl6: 'lemari arsip-5', zs2: 'zeco-1', zk2: 'zeco-2', zr3: 'zeco-3', zf3: 'zeco-4'};
  const fotoProduk = id => FOTO[id] ? `assets/images/${FOTO[id]}.png` : '';
  const kartu = (a, i) => {
    const fotos = (a.produk || []).slice(0, i === 0 ? 3 : 1).map(fotoProduk).filter(Boolean);
    return `<a class="art${i === 0 ? ' feat' : ''}" href="artikel/${a.slug}.html">
    <div class="cover"><span>${a.cat}</span>${i === 0 ? '<span>Terbaru</span>' : ''}<div class="imgs">${fotos.map(f => `<img src="${f}" alt="Produk yang dibahas: ${a.title}" loading="lazy">`).join('')}</div></div>
    <div class="body"><h3>${a.title}</h3><p>${a.excerpt}</p>
    <div class="meta"><span>${a.date} &middot; ${a.read}</span></div>
    <span class="btn btn-primary btn-sm">${i === 0 ? 'Baca artikel terbaru' : 'Baca artikel berikutnya'} &rarr;</span></div></a>`;
  };
  // Jumlah artikel yang tampil langsung (1 kartu besar + sisanya). Sisanya muncul lewat tombol "Tampilkan artikel lainnya".
  const TAMPIL = 4;
  const lama = ARTICLES.slice(1);
  list.innerHTML = kartu(ARTICLES[0], 0) + (lama.length
    ? `<h3 class="older-title">Artikel sebelumnya</h3><div class="older">${lama.map((a, i) => kartu(a, i + 1)).join('')}</div>` +
      (lama.length > TAMPIL - 1 ? '<button class="btn btn-ghost" id="more-articles" type="button">Tampilkan artikel lainnya</button>' : '')
    : '');
  document.querySelectorAll('.older .art').forEach((el, i) => { if (i >= TAMPIL - 1) el.classList.add('extra'); });
  const more = $('#more-articles');
  if (more) more.addEventListener('click', () => { $('.older').classList.add('all'); more.remove(); });
}

// ===== Formulir kontak (halaman kontak.html), dikirim lewat WhatsApp =====
const form = $('#contact-form');
if (form) {
  const WA_NUMBER = '628113791115';   // nomor WhatsApp tujuan, tanpa tanda + atau spasi
  // Tombol "Tanya harga" di halaman produk membawa nama produk lewat alamat (?produk=...)
  const dipilih = new URLSearchParams(location.search).get('produk'), sel = $('#produk-select');
  if (dipilih && sel) sel.value = dipilih;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const en = window.CM && CM.lang === 'en';
    const text = en
      ? `Hello CV Cahaya Mustika, I am ${f.get('nama')} (${f.get('wa')}).\nI am buying as ${f.get('peran')} and am interested in ${f.get('produk')}.\n${f.get('pesan')}`
      : `Halo CV Cahaya Mustika, saya ${f.get('nama')} (${f.get('wa')}).\nSaya membeli sebagai ${f.get('peran')} dan tertarik dengan ${f.get('produk')}.\n${f.get('pesan')}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  });
}

// Terjemahkan ulang halaman setelah kartu artikel dibuat (bila pengunjung memilih bahasa Inggris)
if (window.CM) CM.apply();

#!/usr/bin/env python3
"""Bangun halaman artikel (artikel/<slug>.html), sitemap.xml, dan data SEO artikel dari js/articles.js.
Jalankan setiap kali menambah atau mengubah artikel:  python build_artikel.py
Butuh Python 3 saja (tanpa library tambahan)."""
import re, json, html, os, glob
R = os.path.dirname(os.path.abspath(__file__))
def rd(p): return open(os.path.join(R, p), encoding='utf-8').read()
def wr(p, s):
    p = os.path.join(R, p); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'w', encoding='utf-8').write(s)

# --- baca articles.js ---
src = rd('js/articles.js')
src = re.sub(r'^\s*//.*$', '', src, flags=re.M)
src = src[src.index('['):src.rindex(']') + 1]
src = re.sub(r'([{,]\s*)(title|slug|produk|iso|cat|date|read|excerpt|intro|sections|h|p|en)\s*:', r'\1"\2":', src)
src = re.sub(r',(\s*[}\]])', r'\1', src)
A = sorted(json.loads(src), key=lambda a: a['iso'], reverse=True)

# --- kamus terjemahan Inggris untuk artikel (dibuat dari blok en di js/articles.js) ---
kam = {}
for a in A:
    e = a.get('en')
    if not e: continue
    for k in ('title', 'cat', 'date', 'read', 'excerpt', 'intro'):
        if e.get(k): kam[a[k]] = e[k]
    for s, t in zip(a['sections'], e.get('sections', [])):
        kam[s['h']] = t['h']; kam[s['p']] = t['p']
wr('js/kamus-artikel-en.js', '// Dibuat otomatis oleh build_artikel.py dari blok en di js/articles.js. Jangan diedit manual.\nObject.assign(window.KAMUS_EN = window.KAMUS_EN || {}, ' + json.dumps(kam, ensure_ascii=False, indent=1) + ');\n')

index = rd('index.html')
DOMAIN = re.search(r'<link rel="canonical" href="([^"]+)"', index).group(1)
esc = lambda s: html.escape(s, quote=True)
def rel(block):
    block = re.sub(r'href="(?!https?:|mailto:|tel:|#|\.\./)', 'href="../', block)
    return block.replace('src="assets/', 'src="../assets/')

# --- header & footer disalin dari index.html supaya selalu sama ---
nav = re.search(r'<header class="navbar".*?</header>', index, re.S).group(0)
nav = rel(nav).replace('class="navbar"', 'class="navbar scrolled"', 1).replace(' aria-current="page"', '')
nav = nav.replace('<a href="../artikel.html">', '<a href="../artikel.html" aria-current="page">', 1)
# data produk (foto, nama, jenis) dibaca dari kartu produk di index.html
PR = {m.group(1): dict(img=m.group(2), type=m.group(3), name=m.group(4)) for m in re.finditer(
    r'<article class="pcard" id="(\w+)">.*?<img src="([^"]+)" alt="[^"]*".*?<span class="ptype">(.*?)</span><h4>(.*?)</h4>', rd('produk.html'), re.S)}
def prods(a): return [dict(PR[i], id=i) for i in a.get('produk', []) if i in PR]
foot = rel(re.search(r'<footer class="footer">.*?</footer>', index, re.S).group(0))

TPL = '''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>try{var s=localStorage.getItem("cm-theme");document.documentElement.dataset.theme=s||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");if(localStorage.getItem("cm-lang")==="en")document.documentElement.lang="en"}catch(e){}</script>
<title>@@TITLE@@ | CV Cahaya Mustika</title>
<meta name="description" content="@@DESC@@">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0b1f4a">
<link rel="canonical" href="@@URL@@">
<meta property="og:type" content="article"><meta property="og:locale" content="id_ID"><meta property="og:site_name" content="CV Cahaya Mustika">
<meta property="og:title" content="@@TITLE@@"><meta property="og:description" content="@@DESC@@"><meta property="og:url" content="@@URL@@">
<meta property="og:image" content="@@DOMAIN@@assets/images/og-image.svg"><meta property="article:published_time" content="@@ISO@@"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">@@LD@@</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="icon" href="../assets/images/logo.svg"><link rel="stylesheet" href="../css/style.css">
</head>
<body>
@@NAV@@
<main>
<section class="a-hero" data-bg="../assets/images/bg/artikel-1.jpg,../assets/images/bg/artikel-2.jpg" data-interval="7000"><div class="bg-slides"><span class="on" style="background-image:url('../assets/images/bg/artikel-1.jpg')"></span></div><div class="a-inner">
<nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html">Beranda</a><span>/</span><a href="../artikel.html">Artikel</a><span>/</span>@@CAT@@</nav>
<span class="tag">@@CAT@@</span><h1>@@TITLE@@</h1><p class="meta">@@DATE@@ &middot; @@READ@@</p></div></section>
<div class="a-layout">
<article class="a-body">
<p class="intro">@@INTRO@@</p>
@@SECTIONS@@
@@NEXT@@
</article>
<aside class="a-side">
@@FIGS@@
<div class="a-cta"><h2>Butuh bantuan memilih lemari arsip?</h2><p>Kirim denah ruangan dan perkiraan jumlah berkas, kami rekomendasikan modelnya.</p><a href="../kontak.html" class="btn btn-primary">Konsultasi Sekarang</a></div>
<div class="share"><a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=@@WATEXT@@">Bagikan lewat WhatsApp</a><button class="btn btn-ghost btn-sm" id="copy-link" data-url="@@URL@@">Salin tautan</button></div>
</aside>
</div>
<section class="a-more"><div class="a-inner"><h2>Artikel lainnya</h2><div class="more">@@MORE@@</div></div></section>
</main>
@@FOOT@@
<script src="../js/kamus-en.js"></script><script src="../js/kamus-artikel-en.js"></script><script src="../js/prefs.js"></script><script src="../js/latar.js"></script><script src="../js/artikel.js"></script>
</body></html>'''

for f in glob.glob(os.path.join(R, 'artikel', '*.html')): os.remove(f)
for a in A:
    url = f'{DOMAIN}artikel/{a["slug"]}.html'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BlogPosting", "headline": a['title'], "description": a['excerpt'], "datePublished": a['iso'], "dateModified": a['iso'],
         "mainEntityOfPage": url, "url": url, "image": DOMAIN + (prods(a)[0]["img"] if prods(a) else "assets/images/og-image.svg"), "inLanguage": "id",
         "author": {"@type": "Organization", "name": "CV Cahaya Mustika"},
         "publisher": {"@type": "Organization", "name": "CV Cahaya Mustika", "logo": {"@type": "ImageObject", "url": DOMAIN + "assets/images/logo-cv.svg"}}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Beranda", "item": DOMAIN},
            {"@type": "ListItem", "position": 2, "name": "Artikel", "item": DOMAIN + "artikel.html"},
            {"@type": "ListItem", "position": 3, "name": a['title'], "item": url}]}]}
    def card(o):
        pp = prods(o)
        im = f'<div class="imgs"><img src="../{pp[0]["img"]}" alt="Produk yang dibahas: {esc(o["title"])}" loading="lazy"></div>' if pp else ''
        return f'<a class="art" href="{o["slug"]}.html"><div class="cover"><span>{o["cat"]}</span>{im}</div><div class="body"><h3>{o["title"]}</h3><p>{o["excerpt"]}</p><div class="meta"><span>{o["date"]} &middot; {o["read"]}</span></div><span class="btn btn-primary btn-sm">Baca artikel &rarr;</span></div></a>'
    more = ''.join(card(o) for o in [x for x in A if x['slug'] != a['slug']][:6])
    pp = prods(a)
    figs = ('<div class="a-figs"><p class="lbl">Produk yang dibahas</p><div class="a-figrow">' + ''.join(
        f'<a href="../produk.html#{p["id"]}"><img src="../{p["img"]}" alt="{esc(p["name"])} - {esc(p["type"])}" loading="lazy"><b>{p["name"]}</b><small>{p["type"]}</small></a>' for p in pp) + '</div></div>') if pp else ''
    nx = A[(A.index(a) + 1) % len(A)]
    nxt = f'<a class="next-art" href="{nx["slug"]}.html"><span>Baca artikel berikutnya</span><b>{nx["title"]}</b><i>&rarr;</i></a>' if len(A) > 1 else ''
    page = TPL
    for k, v in {'@@TITLE@@': esc(a['title']), '@@DESC@@': esc(a['excerpt']), '@@URL@@': url, '@@DOMAIN@@': DOMAIN, '@@ISO@@': a['iso'],
                 '@@LD@@': json.dumps(ld, ensure_ascii=False), '@@NAV@@': nav, '@@FOOT@@': foot, '@@CAT@@': a['cat'], '@@DATE@@': a['date'],
                 '@@READ@@': a['read'], '@@FIGS@@': figs, '@@NEXT@@': nxt, '@@INTRO@@': a['intro'], '@@MORE@@': more,
                 '@@SECTIONS@@': '\n'.join(f'<h2>{s["h"]}</h2><p>{s["p"]}</p>' for s in a['sections']),
                 '@@WATEXT@@': html.escape(__import__('urllib.parse').parse.quote(f'{a["title"]} {url}'))}.items():
        page = page.replace(k, v)
    wr(f'artikel/{a["slug"]}.html', page)

# --- data SEO artikel di beranda + sitemap ---
posts = [{"@type": "BlogPosting", "headline": a['title'], "description": a['excerpt'], "datePublished": a['iso'],
          "url": f'{DOMAIN}artikel/{a["slug"]}.html', "author": {"@type": "Organization", "name": "CV Cahaya Mustika"}} for a in A]
new_ld = '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": posts}, ensure_ascii=False) + '</script>'
artikel_html = rd('artikel.html')
artikel_html = re.sub(r'<script type="application/ld\+json">(?:(?!</script>).)*"BlogPosting"(?:(?!</script>).)*</script>', lambda m: new_ld, artikel_html, 1, re.S)
wr('artikel.html', artikel_html)
urls = f'  <url><loc>{DOMAIN}</loc><lastmod>{A[0]["iso"]}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n' + ''.join(
    f'  <url><loc>{DOMAIN}{pg}</loc><lastmod>{A[0]["iso"]}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n' for pg in ('produk.html', 'portofolio.html', 'artikel.html', 'kontak.html')) + ''.join(
    f'  <url><loc>{DOMAIN}artikel/{a["slug"]}.html</loc><lastmod>{a["iso"]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n' for a in A)
wr('sitemap.xml', f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
print(f'Selesai: {len(A)} halaman artikel dibuat di folder artikel/')

@echo off
rem Klik dua kali file ini setelah menambah atau mengubah artikel di js/articles.js.
rem Halaman artikel, sitemap, dan data SEO dibuat ulang otomatis (butuh Python 3).
cd /d "%~dp0"
python build_artikel.py || py build_artikel.py
echo.
pause

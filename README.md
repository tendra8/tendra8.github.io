# Perdana Prima Express — Situs Statis

Situs **murni HTML statis** untuk PT Perdana Prima Express (jasa pengiriman barang, paket, kargo). Di-host di GitHub, di-deploy lewat **Cloudflare Pages**. Tidak butuh build step di deploy — file `*/index.html` adalah artefak final yang langsung disajikan.

## Struktur
- `index.html` + folder `*/index.html` → tiap halaman (URL trailing-slash sama dengan situs WordPress lama).
- `assets/css/style.css`, `assets/js/main.js`, `assets/img/` → aset.
- `sitemap.xml`, `robots.txt`, `_redirects`, `_headers`, `404.html`, `favicon.svg`.
- `build.mjs` → **alat bantu OPSIONAL** untuk men-generate ulang semua halaman agar header/footer/SEO konsisten. Jalankan `node build.mjs`. Kamu juga bebas mengedit file HTML hasilnya langsung. **Deploy tidak menjalankan ini.**

## Deploy ke Cloudflare Pages
1. Push repo ini ke GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → pilih repo.
3. Build settings: **Framework preset: None**, **Build command: (kosong)**, **Build output directory: `/`**.
4. Setelah deploy, tambahkan Custom Domain `buanaraya.com` dan `www.buanaraya.com` di tab Custom domains.
5. `_redirects` & `_headers` otomatis dibaca Cloudflare Pages.

## Menjalankan lokal
```bash
python3 -m http.server 8099   # lalu buka http://localhost:8099
```

## Migrasi SEO (WAJIB sebelum/sesudah go-live)
- **URL lama dipertahankan** persis (slug sama) → ranking aman. Sudah diverifikasi 22 URL lama balas 200.
- Setelah live: di **Google Search Console** → tambahkan domain, submit `https://tendra8.github.io/sitemap.xml`, gunakan URL Inspection pada beberapa URL lama untuk memastikan tetap terindeks. Pantau Coverage & Core Web Vitals.
- Cek redirect: `curl -I https://www.buanaraya.com/` harus 301 ke non-www.

## Aset yang MASIH PERLU kamu sediakan
Letakkan di `assets/img/` (dirujuk oleh schema & Open Graph):
- `logo.png` — logo perusahaan (untuk Organization schema & sosial).
- `og-default.jpg` — gambar share sosmed, **1200×630 px**.
- (Opsional) foto kota/armada untuk memperkaya tiap halaman rute (pakai format **WebP**, beri atribut `alt`, `width`, `height`).

## ⭐ Review bintang di Google — cara yang SAH (PENTING)
Situs ini **sengaja tidak memasang rating palsu**. Bintang di hasil Google untuk bisnis lokal berasal dari **Google Business Profile (GBP)**, bukan markup buatan. Markup rating palsu/tak-tampil melanggar pedoman Google dan berisiko **penalti yang menjatuhkan seluruh ranking**.

**Sudah terhubung:** tombol "Tulis Ulasan di Google", "Lihat Ulasan di Google Maps", dan peta di halaman `/cabang/` sudah mengarah ke listing Google Maps resmi PT Perdana Prima Express (CID `16210734692532484167`, dari URL Maps yang Anda berikan). Konstanta `GMAPS_PLACE` & `GMAPS_EMBED` ada di atas `build.mjs`.

Langkah agar bintang muncul di hasil pencarian:
1. **Klaim/verifikasi Google Business Profile** cabang Bandung (dan buat untuk Jakarta & Surabaya) di business.google.com — listing-nya sudah ada, tinggal diklaim.
2. (Opsional) Ambil **short-link ulasan** GBP (format `https://g.page/r/XXXXXXXX/review`) dan ganti `GMAPS_PLACE` agar pelanggan langsung ke form ulasan, bukan ke halaman listing.
3. Minta pelanggan nyata memberi ulasan → bintang akan muncul di Google Search/Maps.
4. Setelah ada ulasan **asli**, ganti kartu testimoni placeholder dengan ulasan nyata, lalu aktifkan blok JSON-LD `AggregateRating`/`Review`. Jangan aktifkan sebelum ada ulasan asli yang tampil di halaman.

## Catatan
- Nomor WhatsApp & alamat cabang dipusatkan di bagian atas `build.mjs` (konstanta `WA_BDG`, dst). Ubah di sana lalu `node build.mjs` untuk memperbarui semua halaman.

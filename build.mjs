/* ============================================================
   Buana Raya Express — perakit halaman statis (OPSIONAL)
   ------------------------------------------------------------
   Situs ini MURNI HTML statis. Skrip ini hanya alat bantu untuk
   meng-generate file *.html agar header/footer/SEO konsisten di
   semua halaman. Output (folder/index.html) di-commit ke repo dan
   itulah yang di-host Cloudflare Pages — TANPA build step di deploy.
   Kamu bebas mengedit HTML hasilnya langsung bila mau.

   Jalankan:  node build.mjs
   ============================================================ */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const SITE = "https://buanaraya.com";
const WA_BDG = "6282130200030";   // 0821-30-2000-30
const WA_JKT = "628128956660";    // 0812-8956-660
const WA_SBY = "6281217812900";   // 0812-1781-2900
const OG = `${SITE}/assets/img/og-default.jpg`;

/* Google Business Profile (cabang Bandung) — dari Google Maps listing resmi.
   CID 16210734692532484167 = 0xe0f81950907ff847 pada URL Google Maps. */
const GMAPS_PLACE = "https://www.google.com/maps?cid=16210734692532484167";   // buka listing resmi + tab Ulasan (tombol "Tulis ulasan" tersedia di sana)
const GMAPS_EMBED = "https://maps.google.com/maps?q=PT.%20Buana%20Raya%20Express%2C%20Jl.%20Jamika%2C%20Bandung&z=16&output=embed";
/* Catatan: jika sudah punya short-link ulasan GBP (format https://g.page/r/XXXX/review),
   ganti GMAPS_PLACE di tombol "Tulis Ulasan" agar pelanggan langsung ke form ulasan. */

const waLink = (num, text) =>
  `https://wa.me/${num}?text=${encodeURIComponent(text)}`;

const WA_DEFAULT = waLink(WA_BDG, "Halo Buana Raya Express, saya mau tanya pengiriman");

/* ---------- shared markup ---------- */
const navItem = (href, label, active) =>
  `<li><a href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a></li>`;

const header = (active = "") => `<header class="site-header">
  <nav class="nav container" aria-label="Navigasi utama">
    <a class="brand" href="/"><span class="logo">BR</span><span>Buana Raya<small>EXPRESS</small></span></a>
    <button class="nav-toggle" aria-label="Buka menu" aria-controls="nav-links" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
    <ul class="nav-links" id="nav-links">
      ${navItem("/tentang-kami/", "Tentang Kami", active === "tentang")}
      ${navItem("/layanan/", "Layanan", active === "layanan")}
      ${navItem("/tarif/", "Tarif", active === "tarif")}
      ${navItem("/cabang/", "Cabang", active === "cabang")}
      ${navItem("/peluang-bisnis/", "Peluang Bisnis", active === "peluang")}
      <li class="nav-cta"><a class="btn btn--primary" href="${WA_DEFAULT}">Pesan Sekarang</a></li>
    </ul>
  </nav>
</header>`;

const footer = `<footer class="site-footer"><div class="container"><div class="footer-grid">
  <div><a class="brand" href="/" style="color:#fff"><span class="logo">BR</span><span style="color:#fff">Buana Raya<small>EXPRESS</small></span></a><p style="margin-top:14px">Jasa pengiriman barang, paket, dan kargo via udara, laut, dan darat ke seluruh Indonesia — khususnya Kalimantan, Sulawesi, Bali, dan Papua.</p></div>
  <div><h4>Layanan</h4><ul><li><a href="/layanan/">Kargo Udara</a></li><li><a href="/layanan/">Kargo Laut</a></li><li><a href="/layanan/">Kargo Darat</a></li><li><a href="/tarif/">Daftar Tarif</a></li></ul></div>
  <div><h4>Perusahaan</h4><ul><li><a href="/tentang-kami/">Tentang Kami</a></li><li><a href="/cabang/">Cabang</a></li><li><a href="/peluang-bisnis/">Peluang Bisnis</a></li><li><a href="/syarat-dan-ketentuan/">Syarat &amp; Ketentuan</a></li></ul></div>
  <div><h4>Hubungi Kami</h4><ul><li><strong>Bandung:</strong> Jl. Jamika No. 136<br>WA/Telp: 0821-30-2000-30</li><li><strong>Jakarta:</strong> Jl. Wedana No. 24<br>WA: 0812-8956-660</li><li><strong>Surabaya:</strong> Jl. Undaan Kulon No. 119<br>WA: 0812-1781-2900</li></ul></div>
</div><div class="footer-bottom">&copy; <span id="year">2026</span> PT Buana Raya Express. Seluruh hak cipta dilindungi.</div></div></footer>`;

const waFloat = `<a class="wa-float" href="${WA_DEFAULT}" aria-label="Chat WhatsApp"><svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 .4C7.4.4.5 7.3.5 15.9c0 2.8.7 5.5 2.1 7.9L.3 31.6l8-2.1c2.3 1.3 4.9 1.9 7.6 1.9 8.6 0 15.5-6.9 15.5-15.5C31.5 7.3 24.6.4 16 .4zm0 28.4c-2.4 0-4.7-.6-6.7-1.9l-.5-.3-4.8 1.3 1.3-4.7-.3-.5c-1.4-2.1-2.1-4.6-2.1-7.1C2.9 8.6 8.8 2.8 16 2.8c7.2 0 13.1 5.9 13.1 13.1 0 7.2-5.9 12.9-13.1 12.9zm7.2-9.6c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.9-2.2-1.3-3-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1 0 1.8 1.3 3.6 1.5 3.8.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z"/></svg><span>Chat WhatsApp</span></a>`;

const orgGraph = `{"@type":"Organization","@id":"${SITE}/#organization","name":"PT Buana Raya Express","url":"${SITE}/","logo":"${SITE}/assets/img/logo.png","description":"Jasa pengiriman barang, paket, dan kargo via udara, laut, dan darat ke seluruh Indonesia.","telephone":"+62-821-3020-0030","sameAs":[]},
    {"@type":"WebSite","@id":"${SITE}/#website","url":"${SITE}/","name":"Buana Raya Express","publisher":{"@id":"${SITE}/#organization"},"inLanguage":"id-ID"}`;

const breadcrumb = (items) => {
  const li = items
    .map((it, i) => `{"@type":"ListItem","position":${i + 1},"name":${JSON.stringify(it.name)}${it.url ? `,"item":"${it.url}"` : ""}}`)
    .join(",");
  return `{"@type":"BreadcrumbList","itemListElement":[${li}]}`;
};

const crumbNav = (items) =>
  `<div class="container"><nav class="breadcrumb" aria-label="breadcrumb">` +
  items
    .map((it, i) =>
      i === items.length - 1
        ? `<span>${it.name}</span>`
        : `<a href="${it.path}">${it.name}</a> &rsaquo; `
    )
    .join("") +
  `</nav></div>`;

const faqAccordion = (faqs) => `<div class="faq">${faqs
  .map((f) => `<details><summary>${f.q}</summary><div>${f.a}</div></details>`)
  .join("\n      ")}</div>`;

const faqJsonld = (faqs) =>
  `{"@type":"FAQPage","mainEntity":[${faqs
    .map((f) => `{"@type":"Question","name":${JSON.stringify(stripTags(f.q))},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(stripTags(f.a))}}}`)
    .join(",")}]}`;

const stripTags = (s) => s.replace(/<[^>]+>/g, "");

const ctaBand = (text = "Siap Mengirim Barang Anda?", sub = "Konsultasi gratis dan dapatkan penawaran ongkir terbaik sekarang juga.", wa = WA_DEFAULT) =>
  `<section class="section"><div class="container"><div class="cta-band"><h2>${text}</h2><p>${sub}</p><a class="btn btn--ghost btn--lg" href="${wa}">Chat WhatsApp Sekarang</a></div></div></section>`;

/* ---------- page shell ---------- */
function shell({ slug, title, description, body, active = "", jsonldGraph = "" }) {
  const url = slug === "" ? `${SITE}/` : `${SITE}/${slug}/`;
  const canonical = url;
  const graph = jsonldGraph ? `,\n    ${jsonldGraph}` : "";
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Buana Raya Express</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Buana Raya Express">
  <meta property="og:locale" content="id_ID">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${OG}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${OG}">
  <link rel="alternate" hreflang="id" href="${url}">
  <meta name="theme-color" content="#102a56">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/css/style.css">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@graph":[
    ${orgGraph}${graph}
  ]}
  </script>
</head>
<body>
${header(active)}
<main>
${body}
</main>
${footer}
${waFloat}
<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

function write(slug, html) {
  const path = slug === "" ? "index.html" : `${slug}/index.html`;
  mkdirSync(dirname(path) === "." ? "." : dirname(path), { recursive: true });
  writeFileSync(path, html);
  console.log("✓", path);
}

/* ============================================================
   ROUTE PAGE GENERATOR (halaman rute kota)
   ============================================================ */
const MODE = {
  udara: ["Kargo Udara", "tercepat — kiriman tiba dalam hitungan hari, cocok untuk barang mendesak, mudah rusak, atau bernilai tinggi"],
  laut: ["Kargo Laut", "paling ekonomis untuk barang berat dan bervolume besar, dikirim via kapal kontainer/kargo"],
  darat: ["Kargo Darat", "via truk dan penyeberangan ferry, ekonomis untuk rute yang terhubung jalur darat"],
};
const modeList = (modes) =>
  `<ul>${modes.map((m) => `<li><strong>${MODE[m][0]}</strong> — ${MODE[m][1]}.</li>`).join("")}</ul>`;
const modeWords = (modes) => {
  const w = modes.map((m) => MODE[m][0].replace("Kargo ", "").toLowerCase());
  return w.length === 1 ? w[0] : `${w.slice(0, -1).join(", ")} dan ${w[w.length - 1]}`;
};
const modeAdvice = (modes) => {
  let s = "Untuk kiriman mendesak, pilih kargo udara; sedangkan untuk barang berat dan bervolume besar, kargo laut jauh lebih hemat.";
  if (modes.includes("darat")) s += " Kargo darat menjadi opsi penerusan ke alamat yang terhubung jalur darat di sekitar kota tujuan.";
  return s;
};

function routePage(r) {
  const wa = waLink(r.wa || WA_BDG, `Halo Buana Raya Express, saya mau kirim barang dari ${r.origin} ke ${r.dest}`);
  const baseFaqs = [
    { q: `Berapa lama pengiriman dari ${r.origin} ke ${r.dest}?`, a: `Estimasi waktu pengiriman ${r.origin}–${r.dest} ${r.eta}. Pengiriman ${modeWords(r.modes)} memiliki estimasi berbeda; waktu juga dipengaruhi jadwal armada dan kondisi cuaca. Hubungi kami untuk jadwal keberangkatan terdekat.` },
    { q: `Bagaimana cara menghitung ongkir ke ${r.dest}?`, a: `Ongkir ke ${r.dest} dihitung dari berat aktual atau berat volume (panjang × lebar × tinggi dalam cm dibagi 6000), mana yang lebih besar. Untuk tarif pasti, hubungi WhatsApp kami atau lihat halaman <a href="/tarif/">Tarif</a>.` },
    ...(r.extra || []),
    { q: `Apakah bisa penjemputan barang di ${r.origin}?`, a: `Bisa. Anda dapat mengantar barang ke kantor cabang ${r.origin} atau meminta penjemputan (pickup). Hubungi kami untuk mengatur jadwal.` },
  ];
  const areasHtml = r.areas && r.areas.length
    ? `<h2>Area Layanan Pengiriman ${r.dest} &amp; Sekitarnya</h2>
    <p>Selain pusat kota ${r.dest}, kami melayani pengiriman hingga wilayah di sekitarnya:</p>
    <div class="chips" style="margin:14px 0 4px">${r.areas.map((a) => `<span class="chip">${a}</span>`).join("")}</div>
    <p>Alamat tujuan di luar daftar ini tetap dapat kami layani — konfirmasikan saat memesan via WhatsApp.</p>`
    : "";
  const body = `${crumbNav([
    { name: "Beranda", path: "/" },
    { name: r.island, path: r.islandPath },
    { name: r.crumb },
  ])}
  <section class="hero" style="padding:48px 0 54px">
    <div class="container">
      <span class="eyebrow">${r.origin} → ${r.dest} · ${r.province}</span>
      <h1>${r.h1}</h1>
      <p>${r.lead}</p>
      <div class="hero-actions">
        <a class="btn btn--wa btn--lg" href="${wa}">Cek Ongkir via WhatsApp</a>
        <a class="btn btn--ghost btn--lg" href="/tarif/">Lihat Tarif</a>
      </div>
    </div>
  </section>

  <section class="section"><div class="container narrow prose">
    <p class="lead">${r.intro}</p>
    <p>${r.body1}</p>

    <h2>Pilihan Moda Pengiriman ${r.origin} ke ${r.dest}</h2>
    <p>Untuk rute ${r.origin}–${r.dest}, Buana Raya Express melayani pengiriman via ${modeWords(r.modes)}:</p>
    ${modeList(r.modes)}
    <p>${modeAdvice(r.modes)}</p>

    <div class="callout"><strong>Estimasi waktu ${r.origin}–${r.dest}:</strong> ${r.eta}. Untuk ongkir pasti dan jadwal armada terbaru, hubungi WhatsApp <a href="${wa}">kami</a>.</div>

    <h2>Mengenal ${r.dest}, ${r.province}</h2>
    <p>${r.about}</p>
    <p>${r.hub}</p>

    <h2>Barang yang Sering Dikirim ke ${r.dest}</h2>
    <p>${r.commodities}</p>
    <p>Untuk barang mudah pecah, elektronik, atau bernilai tinggi, kami sarankan menambahkan <a href="/layanan/">packing kayu</a>. Barang yang dilarang undang-undang (narkotika, bahan peledak, senjata ilegal) tidak kami terima — lihat <a href="/syarat-dan-ketentuan/">Syarat &amp; Ketentuan</a>.</p>

    ${areasHtml}

    <h2>Cara Order Pengiriman ${r.origin}–${r.dest}</h2>
    <ol>
      <li>Hubungi WhatsApp kami untuk konsultasi dan cek ongkir ke ${r.dest}.</li>
      <li>Antar barang ke cabang ${r.origin} atau minta penjemputan.</li>
      <li>Barang ditimbang, dikemas (packing kayu bila perlu), dan dijadwalkan.</li>
      <li>Barang berangkat dan tiba di ${r.dest} sesuai estimasi.</li>
    </ol>
    <p class="muted" style="font-size:.92rem">Tip: simpan dimensi dan berat barang sebelum chat agar estimasi ongkir ${r.origin}–${r.dest} lebih cepat kami berikan.</p>
  </div></section>

  <section class="section section--soft"><div class="container narrow">
    <h2 class="center">Pertanyaan Seputar Pengiriman ke ${r.dest}</h2>
    ${faqAccordion(baseFaqs)}
  </div></section>

  ${reviewSection(`Ulasan Pengiriman ke ${r.dest}`)}

  ${r.related && r.related.length ? `<section class="section"><div class="container">
    <h2 class="center">Rute Pengiriman Lainnya</h2>
    <div class="chips" style="justify-content:center;margin-top:20px">
      ${r.related.map((x) => `<a class="chip" href="/${x.slug}/">${x.label}</a>`).join("\n      ")}
    </div>
  </div></section>` : ""}

  ${ctaBand(`Kirim Barang ke ${r.dest} Sekarang`, `Dapatkan ongkir terbaik untuk pengiriman ${r.origin}–${r.dest}.`, wa)}`;

  const jsonld = `${breadcrumb([
    { name: "Beranda", url: `${SITE}/` },
    { name: r.island, url: `${SITE}${r.islandPath}` },
    { name: r.crumb, url: `${SITE}/${r.slug}/` },
  ])},
    {"@type":"Service","serviceType":"Jasa pengiriman kargo ${r.origin} ke ${r.dest}","provider":{"@id":"${SITE}/#organization"},"areaServed":{"@type":"City","name":${JSON.stringify(r.dest)},"containedInPlace":${JSON.stringify(r.province)}},"description":${JSON.stringify(stripTags(r.lead))}},
    ${faqJsonld(baseFaqs)}`;

  return shell({ slug: r.slug, title: r.title, description: r.description, body, jsonldGraph: jsonld });
}

/* Review section — pendekatan SAH (tanpa AggregateRating palsu) */
function reviewSection(heading = "Ulasan Pelanggan") {
  return `<section class="section" id="ulasan"><div class="container narrow">
    <h2 class="center">${heading}</h2>
    <p class="lead center">Bagikan pengalaman Anda atau baca ulasan pelanggan lain langsung di Google.</p>
    <!--
      CATATAN: Bintang di hasil Google berasal dari Google Business Profile, BUKAN markup palsu.
      1) Klaim Google Business Profile tiap cabang.
      2) Ganti URL tombol di bawah dengan link ulasan GBP (mis. https://g.page/r/XXXX/review).
      3) Setelah ada ulasan ASLI, ganti kartu placeholder di bawah & aktifkan JSON-LD Review/AggregateRating.
      Memasang rating palsu melanggar pedoman Google dan berisiko penalti.
    -->
    <div class="center" style="margin:22px 0 30px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a class="btn btn--primary btn--lg" href="${GMAPS_PLACE}" target="_blank" rel="noopener nofollow">★ Tulis Ulasan di Google</a>
      <a class="btn btn--ghost btn--lg" href="${GMAPS_PLACE}" target="_blank" rel="noopener nofollow">Lihat Ulasan di Google Maps</a>
    </div>
    <div class="grid grid-3">
      <article class="testimonial"><div class="stars" aria-hidden="true">★★★★★</div><p>"[Contoh — ganti dengan ulasan asli] Barang sampai dengan aman dan tepat waktu. Pelayanan ramah."</p><div class="who">Nama Pelanggan<small>Pelanggan Buana Raya</small></div></article>
      <article class="testimonial"><div class="stars" aria-hidden="true">★★★★★</div><p>"[Contoh — ganti dengan ulasan asli] Ongkir bersaing dan prosesnya gampang lewat WhatsApp."</p><div class="who">Nama Pelanggan<small>Pelanggan Buana Raya</small></div></article>
      <article class="testimonial"><div class="stars" aria-hidden="true">★★★★★</div><p>"[Contoh — ganti dengan ulasan asli] Sudah langganan, selalu amanah dan komunikatif."</p><div class="who">Nama Pelanggan<small>Pelanggan Buana Raya</small></div></article>
    </div>
  </div></section>`;
}

/* ============================================================
   DATA RUTE
   ============================================================ */
const KAL = { island: "Kalimantan", islandPath: "/kota-dan-kabupaten-di-pulau-kalimantan/" };
const SUL = { island: "Sulawesi", islandPath: "/kabupaten-dan-kota-di-pulau-sulawesi/" };
const PAP = { island: "Papua", islandPath: "/kota-dan-kabupaten-di-pulau-papua/" };
const BALI = { island: "Bali", islandPath: "/tarif/" };

const routes = [
  // ---- LAMA (slug dipertahankan) ----
  { slug: "kargo-pengiriman-bandung-banjarmasin", ...KAL, origin: "Bandung", dest: "Banjarmasin", province: "Kalimantan Selatan", crumb: "Bandung → Banjarmasin",
    modes: ["udara", "laut", "darat"],
    title: "Kargo Pengiriman Bandung Banjarmasin — Ongkir Murah",
    h1: "Kargo &amp; Pengiriman Bandung ke Banjarmasin",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Banjarmasin (Kalimantan Selatan) via udara, laut, dan darat. Ongkir murah, aman, terpercaya. WA 0821-30-2000-30.",
    lead: "Kirim barang, paket, dan kargo dari Bandung ke Banjarmasin dengan aman dan ongkir bersaing.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Banjarmasin, ibu kota Kalimantan Selatan, untuk berbagai jenis barang mulai dari paket pribadi hingga kargo dalam jumlah besar.",
    body1: "Sebagai “Kota Seribu Sungai” yang menjadi simpul perdagangan Kalimantan bagian selatan, Banjarmasin menerima arus barang yang tinggi dari Pulau Jawa setiap harinya — mulai dari stok toko hingga perlengkapan usaha.",
    eta: "umumnya 3–7 hari kerja tergantung moda",
    about: "Banjarmasin terkenal dengan pasar terapung dan kanal sungai yang membelah kota, sekaligus menjadi gerbang logistik utama Kalimantan Selatan sebelum barang diteruskan ke Banjarbaru, Martapura, dan kabupaten sekitarnya.",
    hub: "Kiriman udara masuk melalui Bandara Syamsudin Noor, sedangkan kargo laut dibongkar di Pelabuhan Trisakti Banjarmasin — keduanya kami layani sesuai kebutuhan kecepatan dan budget Anda.",
    commodities: "Pelaku usaha di Banjarmasin paling sering mendatangkan barang dagangan grosir, sembako, produk fashion, perlengkapan toko, hingga suku cadang dari Bandung. Pengiriman furnitur dan elektronik untuk kebutuhan rumah tangga juga rutin kami tangani.",
    areas: ["Banjarmasin Tengah", "Banjarmasin Utara", "Banjarmasin Selatan", "Banjarbaru", "Martapura", "Kabupaten Banjar"],
    extra: [{ q: "Apakah pengiriman bisa sampai ke Martapura dan Banjarbaru?", a: "Bisa. Setelah tiba di Banjarmasin, barang dapat kami teruskan ke Banjarbaru, Martapura, dan kabupaten sekitar via jalur darat. Sebutkan alamat lengkap saat memesan." }],
    related: [{ slug: "ongkir-bandung-banjarbaru-murah", label: "Bandung → Banjarbaru" }, { slug: "kirim-barang-bandung-balikpapan", label: "Bandung → Balikpapan" }, { slug: "pengiriman-bandung-palangkaraya", label: "Bandung → Palangka Raya" }] },

  { slug: "kirim-barang-bandung-balikpapan", ...KAL, origin: "Bandung", dest: "Balikpapan", province: "Kalimantan Timur", crumb: "Bandung → Balikpapan",
    modes: ["udara", "laut", "darat"],
    title: "Kirim Barang Bandung Balikpapan — Kargo Murah &amp; Cepat",
    h1: "Kirim Barang Bandung ke Balikpapan",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Balikpapan (Kalimantan Timur) via udara, laut, dan darat. Ongkir murah & terpercaya. WA 0821-30-2000-30.",
    lead: "Layanan kirim barang Bandung–Balikpapan yang cepat, aman, dan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Balikpapan untuk paket, barang dagangan, sparepart, hingga kargo proyek.",
    body1: "Balikpapan adalah gerbang ekonomi Kalimantan Timur sekaligus pintu masuk logistik menuju Ibu Kota Nusantara (IKN), sehingga arus barang dari Jawa ke kota ini termasuk yang paling padat di Kalimantan.",
    eta: "umumnya 3–7 hari kerja tergantung moda",
    about: "Dikenal sebagai kota minyak dengan kilang dan kawasan industri besar, Balikpapan menjadi basis banyak perusahaan migas, kontraktor, dan penyedia jasa proyek yang membutuhkan pasokan material dari luar pulau.",
    hub: "Kiriman udara melalui Bandara Sultan Aji Muhammad Sulaiman (Sepinggan) dan kargo laut via Pelabuhan Semayang serta Kariangau, dengan opsi penerusan darat ke kawasan IKN dan Penajam.",
    commodities: "Barang yang paling sering dikirim ke Balikpapan adalah sparepart dan peralatan industri/migas, material serta kebutuhan proyek IKN, elektronik, hingga barang pindahan karyawan yang mutasi kerja. Kargo proyek berukuran besar kami tangani dengan packing khusus.",
    areas: ["Balikpapan Kota", "Balikpapan Selatan", "Sepinggan", "Batakan", "Kariangau", "Penajam (IKN)"],
    extra: [{ q: "Apakah melayani pengiriman material proyek ke kawasan IKN dari Balikpapan?", a: "Ya. Balikpapan adalah pintu masuk utama ke IKN. Kami melayani kargo proyek dan material yang diteruskan via darat ke kawasan Ibu Kota Nusantara dan Penajam." }],
    related: [{ slug: "pengiriman-bandung-ke-samarinda", label: "Bandung → Samarinda" }, { slug: "pengiriman-bandung-bontang", label: "Bandung → Bontang" }, { slug: "pengiriman-bandung-tarakan", label: "Bandung → Tarakan" }] },

  { slug: "pengiriman-bandung-ke-samarinda", ...KAL, origin: "Bandung", dest: "Samarinda", province: "Kalimantan Timur", crumb: "Bandung → Samarinda",
    modes: ["udara", "laut", "darat"],
    title: "Pengiriman Bandung ke Samarinda — Kargo &amp; Paket Murah",
    h1: "Pengiriman Bandung ke Samarinda",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Samarinda (Kalimantan Timur) via udara, laut, dan darat. Ongkir murah & aman. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Samarinda untuk segala jenis barang dengan ongkir bersaing.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Samarinda, ibu kota Provinsi Kalimantan Timur yang terletak di tepi Sungai Mahakam.",
    body1: "Sebagai kota terbesar di Kalimantan Timur dan pusat pemerintahan provinsi, Samarinda memiliki kebutuhan logistik yang tinggi untuk menopang aktivitas perdagangan, jasa, dan pertambangan di sekitarnya.",
    eta: "umumnya 4–8 hari kerja tergantung moda",
    about: "Samarinda berkembang di sepanjang Sungai Mahakam yang menjadi urat nadi transportasi menuju pedalaman Kalimantan Timur, termasuk Tenggarong dan Kutai Kartanegara.",
    hub: "Kiriman udara via Bandara APT Pranoto dan kargo laut/sungai melalui Pelabuhan Samarinda di Sungai Mahakam, dengan penerusan darat ke Tenggarong dan sekitarnya.",
    commodities: "Permintaan terbesar ke Samarinda meliputi sparepart dan peralatan ringan untuk tambang, furnitur, barang dagangan toko, serta kebutuhan rumah tangga. Banyak pelaku UMKM mengambil stok dari Bandung untuk dijual kembali di Samarinda.",
    areas: ["Samarinda Ilir", "Samarinda Ulu", "Sungai Kunjang", "Samarinda Seberang", "Tenggarong", "Kutai Kartanegara"],
    extra: [{ q: "Apakah bisa kirim sampai Tenggarong dan Kutai Kartanegara?", a: "Bisa. Setelah tiba di Samarinda, barang kami teruskan via darat ke Tenggarong dan wilayah Kutai Kartanegara. Cantumkan alamat lengkap penerima." }],
    related: [{ slug: "kirim-barang-bandung-balikpapan", label: "Bandung → Balikpapan" }, { slug: "pengiriman-bandung-bontang", label: "Bandung → Bontang" }, { slug: "pengiriman-bandung-tarakan", label: "Bandung → Tarakan" }] },

  { slug: "pengiriman-paket-bandung-pontianak-murah-cepat", ...KAL, origin: "Bandung", dest: "Pontianak", province: "Kalimantan Barat", crumb: "Bandung → Pontianak",
    modes: ["udara", "laut", "darat"],
    title: "Pengiriman Paket Bandung Pontianak Murah &amp; Cepat",
    h1: "Pengiriman Paket Bandung ke Pontianak",
    description: "Jasa pengiriman paket, barang, dan kargo dari Bandung ke Pontianak (Kalimantan Barat) via udara, laut, dan darat. Murah, cepat, terpercaya. WA 0821-30-2000-30.",
    lead: "Kirim paket dan kargo Bandung–Pontianak dengan cepat dan ongkir hemat.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Pontianak, ibu kota Kalimantan Barat yang tepat dilalui garis khatulistiwa.",
    body1: "Pontianak adalah pusat perdagangan Kalimantan Barat dan titik distribusi barang menuju kabupaten di sekitarnya, sehingga rute dari Jawa ke kota ini selalu ramai sepanjang tahun.",
    eta: "umumnya 3–7 hari kerja tergantung moda",
    about: "Dijuluki Kota Khatulistiwa dengan Tugu Khatulistiwa yang ikonik, Pontianak dibelah Sungai Kapuas — sungai terpanjang di Indonesia — yang menjadi jalur logistik penting ke pedalaman.",
    hub: "Kiriman udara melalui Bandara Supadio dan kargo laut via Pelabuhan Dwikora Pontianak, dengan penerusan darat ke Kubu Raya dan Singkawang.",
    commodities: "Yang paling sering dikirim ke Pontianak adalah barang dagangan, sembako, produk fashion, kosmetik, serta suku cadang. Pengiriman untuk reseller dan toko online dari Bandung juga tinggi.",
    areas: ["Pontianak Kota", "Pontianak Selatan", "Pontianak Timur", "Sungai Raya", "Kubu Raya", "Mempawah"],
    extra: [{ q: "Apakah bisa kirim ke Singkawang lewat Pontianak?", a: "Bisa. Banyak kiriman ke Singkawang masuk via Pontianak lalu diteruskan darat sekitar 145 km. Lihat juga halaman rute Bandung → Singkawang." }],
    related: [{ slug: "pengiriman-bandung-singkawang", label: "Bandung → Singkawang" }, { slug: "kargo-pengiriman-bandung-banjarmasin", label: "Bandung → Banjarmasin" }, { slug: "pengiriman-bandung-palangkaraya", label: "Bandung → Palangka Raya" }] },

  { slug: "ongkir-bandung-banjarbaru-murah", ...KAL, origin: "Bandung", dest: "Banjarbaru", province: "Kalimantan Selatan", crumb: "Bandung → Banjarbaru",
    modes: ["udara", "laut", "darat"],
    title: "Ongkir Bandung Banjarbaru Murah — Kargo &amp; Paket",
    h1: "Ongkir Bandung ke Banjarbaru yang Murah",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Banjarbaru (Kalimantan Selatan) via udara, laut, dan darat. Ongkir murah & terpercaya. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Banjarbaru dengan ongkir hemat dan layanan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Banjarbaru, kota yang kini menjadi ibu kota Provinsi Kalimantan Selatan.",
    body1: "Sejak ditetapkan sebagai ibu kota provinsi, Banjarbaru berkembang pesat menjadi pusat pemerintahan dan kawasan hunian baru, sehingga kebutuhan pengiriman perlengkapan kantor dan rumah tangga meningkat tajam.",
    eta: "umumnya 3–7 hari kerja tergantung moda",
    about: "Banjarbaru berjarak dekat dengan Banjarmasin dan menaungi kawasan Landasan Ulin tempat Bandara Syamsudin Noor berada, menjadikannya simpul transit yang praktis untuk Kalimantan Selatan.",
    hub: "Justru Bandara Syamsudin Noor berlokasi di Banjarbaru sehingga kiriman udara sangat efisien; kargo laut tetap melalui Pelabuhan Trisakti Banjarmasin lalu diteruskan darat dalam waktu singkat.",
    commodities: "Kiriman ke Banjarbaru didominasi perlengkapan perkantoran pemerintahan provinsi, furnitur, ATK, barang dagangan, serta kebutuhan perumahan yang terus tumbuh seiring perpindahan pusat administrasi.",
    areas: ["Landasan Ulin", "Cempaka", "Liang Anggang", "Banjarbaru Utara", "Banjarbaru Selatan", "Martapura"],
    extra: [{ q: "Apa beda kirim ke Banjarbaru dan Banjarmasin?", a: "Keduanya berdekatan. Kiriman udara ke Banjarbaru bahkan lebih dekat ke bandara, sementara kargo laut sama-sama lewat Pelabuhan Trisakti Banjarmasin lalu diteruskan darat." }],
    related: [{ slug: "kargo-pengiriman-bandung-banjarmasin", label: "Bandung → Banjarmasin" }, { slug: "kirim-barang-bandung-balikpapan", label: "Bandung → Balikpapan" }, { slug: "pengiriman-bandung-palangkaraya", label: "Bandung → Palangka Raya" }] },

  { slug: "kirim-paket-bandung-makassar-ongkir-murah", ...SUL, origin: "Bandung", dest: "Makassar", province: "Sulawesi Selatan", crumb: "Bandung → Makassar",
    modes: ["udara", "laut", "darat"],
    title: "Kirim Paket Bandung Makassar Ongkir Murah",
    h1: "Kirim Paket &amp; Kargo Bandung ke Makassar",
    description: "Jasa pengiriman paket, barang, dan kargo dari Bandung ke Makassar (Sulawesi Selatan) via udara, laut, dan darat. Ongkir murah & aman. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Makassar untuk paket dan kargo dengan ongkir bersaing.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Makassar, kota terbesar sekaligus gerbang utama Indonesia Timur.",
    body1: "Makassar adalah hub distribusi yang meneruskan barang ke seluruh Sulawesi dan kawasan timur, sehingga volume kiriman dari Jawa ke kota ini sangat besar dan jadwal armadanya pun paling sering.",
    eta: "umumnya 4–8 hari kerja tergantung moda",
    about: "Sebagai ibu kota Sulawesi Selatan, Makassar adalah pusat perdagangan, pendidikan, dan pelabuhan utama yang menghubungkan banyak rute pelayaran nasional di Indonesia Timur.",
    hub: "Kiriman udara via Bandara Sultan Hasanuddin dan kargo laut melalui Pelabuhan Makassar (Soekarno–Hatta), dengan penerusan ke Maros, Gowa, dan kota lain di Sulawesi.",
    commodities: "Barang yang paling banyak dikirim ke Makassar adalah dagangan grosir untuk didistribusikan ulang ke Indonesia Timur, elektronik, produk fashion, kosmetik, serta sparepart. Banyak distributor menjadikan Makassar sebagai gudang transit.",
    areas: ["Panakkukang", "Tamalanrea", "Biringkanaya", "Rappocini", "Maros", "Gowa"],
    extra: [{ q: "Apakah Makassar bisa jadi transit ke kota lain di Sulawesi?", a: "Ya. Makassar adalah hub kami untuk Indonesia Timur. Dari sini barang dapat diteruskan ke Palu, Kendari, Manado, dan kota Sulawesi lainnya." }],
    related: [{ slug: "pengiriman-bandung-palu", label: "Bandung → Palu" }, { slug: "pengiriman-bandung-kendari", label: "Bandung → Kendari" }, { slug: "pengiriman-bandung-manado", label: "Bandung → Manado" }] },

  { slug: "kiriman-paket-dengan-ongkir-murah-bandung-ke-denpasar-bali", ...BALI, origin: "Bandung", dest: "Denpasar", province: "Bali", crumb: "Bandung → Denpasar",
    modes: ["darat", "laut", "udara"],
    title: "Kiriman Paket Ongkir Murah Bandung ke Denpasar Bali",
    h1: "Kiriman Paket &amp; Kargo Bandung ke Denpasar (Bali)",
    description: "Jasa pengiriman paket, barang, dan kargo dari Bandung ke Denpasar, Bali via darat, laut, dan udara. Ongkir murah & terpercaya. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Denpasar Bali dengan ongkir hemat untuk paket dan kargo.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Denpasar dan sekitarnya di Pulau Bali.",
    body1: "Berbeda dengan rute ke Kalimantan dan Sulawesi, Bali terhubung jalur darat dari Jawa melalui penyeberangan Ketapang–Gilimanuk, sehingga kargo darat menjadi pilihan paling hemat dan sering ke Denpasar.",
    eta: "umumnya 2–5 hari kerja tergantung moda",
    about: "Denpasar adalah ibu kota Bali dan pusat aktivitas ekonomi yang menopang sektor pariwisata, kuliner, dan UMKM di seluruh pulau, dari Kuta hingga Ubud.",
    hub: "Kargo darat menyeberang via ferry Ketapang–Gilimanuk, kargo laut melalui Pelabuhan Benoa, dan kiriman cepat via Bandara I Gusti Ngurah Rai.",
    commodities: "Kiriman ke Denpasar banyak berupa produk UMKM, bahan baku kerajinan, perlengkapan usaha kuliner dan kafe, produk fashion, serta stok barang untuk toko oleh-oleh dan kebutuhan pariwisata.",
    areas: ["Denpasar Barat", "Denpasar Selatan", "Kuta", "Badung", "Gianyar", "Tabanan"],
    extra: [{ q: "Kenapa kirim ke Bali bisa lebih cepat dari ke Kalimantan?", a: "Karena Bali terhubung jalur darat via ferry Ketapang–Gilimanuk, sehingga truk bisa langsung menyeberang tanpa menunggu jadwal kapal kargo antar pulau." }],
    related: [{ slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Bandung → Makassar" }, { slug: "kargo-pengiriman-bandung-banjarmasin", label: "Bandung → Banjarmasin" }] },

  // ---- BARU: SULAWESI ----
  { slug: "pengiriman-bandung-palu", ...SUL, origin: "Bandung", dest: "Palu", province: "Sulawesi Tengah", crumb: "Bandung → Palu",
    modes: ["udara", "laut"],
    title: "Pengiriman Bandung Palu — Kargo &amp; Paket Murah",
    h1: "Pengiriman Bandung ke Palu",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Palu (Sulawesi Tengah) via udara dan laut. Ongkir murah, aman, terpercaya. WA 0821-30-2000-30.",
    lead: "Kirim barang dan kargo Bandung–Palu dengan ongkir bersaing dan aman.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Palu, ibu kota Sulawesi Tengah yang terletak di tepi teluk.",
    body1: "Pasca pemulihan dari bencana 2018, Palu terus membangun dan membutuhkan pasokan material serta barang konsumsi dari luar pulau, menjadikan rute dari Jawa cukup aktif.",
    eta: "umumnya 5–9 hari kerja tergantung moda",
    about: "Palu berada di lembah yang diapit pegunungan dan Teluk Palu, menjadi pusat pemerintahan dan perdagangan Sulawesi Tengah serta titik distribusi ke Donggala dan Sigi.",
    hub: "Kiriman udara via Bandara Mutiara SIS Al-Jufri dan kargo laut melalui Pelabuhan Pantoloan di utara kota Palu.",
    commodities: "Barang yang sering dikirim ke Palu mencakup material bangunan dan kebutuhan proyek rekonstruksi, perlengkapan rumah tangga, barang dagangan toko, serta sparepart kendaraan.",
    areas: ["Palu Timur", "Palu Barat", "Palu Selatan", "Palu Utara", "Donggala", "Sigi"],
    extra: [{ q: "Apakah pengiriman ke Palu lewat udara atau laut?", a: "Keduanya tersedia. Udara via Bandara Mutiara SIS Al-Jufri untuk kiriman cepat, dan laut via Pelabuhan Pantoloan untuk kargo besar yang lebih ekonomis." }],
    related: [{ slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Bandung → Makassar" }, { slug: "pengiriman-bandung-kendari", label: "Bandung → Kendari" }, { slug: "pengiriman-bandung-manado", label: "Bandung → Manado" }] },

  { slug: "pengiriman-bandung-kendari", ...SUL, origin: "Bandung", dest: "Kendari", province: "Sulawesi Tenggara", crumb: "Bandung → Kendari",
    modes: ["udara", "laut"],
    title: "Pengiriman Bandung Kendari — Kargo &amp; Paket Murah",
    h1: "Pengiriman Bandung ke Kendari",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Kendari (Sulawesi Tenggara) via udara dan laut. Ongkir murah & terpercaya. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Kendari untuk paket dan kargo dengan layanan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Kendari, ibu kota Sulawesi Tenggara yang berbentuk kota teluk.",
    body1: "Sebagai daerah penghasil nikel, Sulawesi Tenggara menarik banyak aktivitas industri dan tenaga kerja, sehingga kebutuhan barang serta sparepart dari Jawa ke Kendari terus meningkat.",
    eta: "umumnya 5–10 hari kerja tergantung moda",
    about: "Kendari mengelilingi sebuah teluk yang indah dan menjadi pusat pemerintahan serta ekonomi Sulawesi Tenggara, sekaligus pintu distribusi ke Konawe dan kawasan tambang sekitarnya.",
    hub: "Kiriman udara via Bandara Haluoleo dan kargo laut melalui Pelabuhan Kendari/Bungkutoko.",
    commodities: "Permintaan ke Kendari banyak berupa sparepart dan kebutuhan operasional tambang nikel, peralatan teknik, barang dagangan, sembako, serta perlengkapan rumah tangga.",
    areas: ["Kendari Barat", "Kambu", "Poasia", "Mandonga", "Konawe", "Konawe Selatan"],
    extra: [{ q: "Apakah bisa kirim sparepart dan kebutuhan tambang ke Kendari?", a: "Bisa. Kami sering menangani sparepart dan peralatan untuk kawasan tambang nikel di Konawe dan sekitarnya. Untuk barang berat, kargo laut lebih ekonomis." }],
    related: [{ slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Bandung → Makassar" }, { slug: "pengiriman-bandung-palu", label: "Bandung → Palu" }, { slug: "pengiriman-bandung-mamuju", label: "Bandung → Mamuju" }] },

  { slug: "pengiriman-bandung-manado", ...SUL, origin: "Bandung", dest: "Manado", province: "Sulawesi Utara", crumb: "Bandung → Manado",
    modes: ["udara", "laut"],
    title: "Pengiriman Bandung Manado — Kargo &amp; Paket Murah",
    h1: "Pengiriman Bandung ke Manado",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Manado (Sulawesi Utara) via udara dan laut. Ongkir murah, aman & cepat. WA 0821-30-2000-30.",
    lead: "Kirim barang dan kargo Bandung–Manado dengan ongkir bersaing.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Manado, ibu kota Sulawesi Utara yang menjadi gerbang utara Indonesia.",
    body1: "Manado adalah kota pariwisata sekaligus pusat perdagangan Sulawesi Utara, dengan kebutuhan logistik tinggi untuk menopang sektor wisata, kuliner, dan perdagangan ritelnya.",
    eta: "umumnya 5–10 hari kerja tergantung moda",
    about: "Terkenal sebagai pintu gerbang ke Taman Laut Bunaken, Manado adalah kota tepi pantai yang ramai dan dekat dengan pelabuhan peti kemas besar di Bitung.",
    hub: "Kiriman udara via Bandara Sam Ratulangi dan kargo laut melalui Pelabuhan Bitung yang berjarak sekitar 45 km, lalu diteruskan darat ke Manado.",
    commodities: "Barang yang sering dikirim ke Manado meliputi barang dagangan, produk kebutuhan kuliner dan wisata, elektronik, bahan bangunan, serta perlengkapan usaha ritel.",
    areas: ["Manado Utara", "Mapanget", "Malalayang", "Tikala", "Tomohon", "Bitung"],
    extra: [{ q: "Apakah kargo laut ke Manado lewat Pelabuhan Bitung?", a: "Ya. Kargo laut umumnya bongkar di Pelabuhan Bitung lalu diteruskan darat sekitar 45 km ke Manado. Kiriman cepat dapat memakai jalur udara langsung." }],
    related: [{ slug: "pengiriman-bandung-gorontalo", label: "Bandung → Gorontalo" }, { slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Bandung → Makassar" }, { slug: "pengiriman-bandung-palu", label: "Bandung → Palu" }] },

  { slug: "pengiriman-bandung-gorontalo", ...SUL, origin: "Bandung", dest: "Gorontalo", province: "Gorontalo", crumb: "Bandung → Gorontalo",
    modes: ["udara", "laut"],
    title: "Pengiriman Bandung Gorontalo — Kargo &amp; Paket Murah",
    h1: "Pengiriman Bandung ke Gorontalo",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Gorontalo via udara dan laut. Ongkir murah, aman, terpercaya. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Gorontalo untuk paket dan kargo dengan ongkir hemat.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Gorontalo, ibu kota Provinsi Gorontalo di pesisir utara Sulawesi.",
    body1: "Sebagai daerah agraris penghasil jagung, Gorontalo memiliki perputaran perdagangan hasil bumi yang aktif sekaligus kebutuhan barang konsumsi dan peralatan dari luar pulau.",
    eta: "umumnya 6–10 hari kerja tergantung moda",
    about: "Gorontalo dijuluki “Serambi Madinah” karena kentalnya nuansa religius, dan menjadi pusat ekonomi provinsi yang terus berkembang di kawasan utara Sulawesi.",
    hub: "Kiriman udara via Bandara Djalaluddin dan kargo laut melalui Pelabuhan Gorontalo serta Pelabuhan Anggrek.",
    commodities: "Kiriman ke Gorontalo banyak berupa peralatan dan kebutuhan pertanian, barang dagangan toko, sembako, perlengkapan rumah tangga, serta sparepart kendaraan.",
    areas: ["Kota Tengah", "Kota Selatan", "Kota Barat", "Limboto", "Telaga", "Kabupaten Gorontalo"],
    extra: [{ q: "Apakah Gorontalo bisa dikirim via Manado?", a: "Bisa. Sebagian kiriman dapat transit melalui jalur utara Sulawesi. Kami atur rute paling efisien sesuai moda dan jadwal armada." }],
    related: [{ slug: "pengiriman-bandung-manado", label: "Bandung → Manado" }, { slug: "pengiriman-bandung-palu", label: "Bandung → Palu" }, { slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Bandung → Makassar" }] },

  { slug: "pengiriman-bandung-mamuju", ...SUL, origin: "Bandung", dest: "Mamuju", province: "Sulawesi Barat", crumb: "Bandung → Mamuju",
    modes: ["udara", "laut"],
    title: "Pengiriman Bandung Mamuju — Kargo &amp; Paket Murah",
    h1: "Pengiriman Bandung ke Mamuju",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Mamuju (Sulawesi Barat) via udara dan laut. Ongkir murah & terpercaya. WA 0821-30-2000-30.",
    lead: "Kirim barang dan kargo Bandung–Mamuju dengan layanan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Mamuju, ibu kota Sulawesi Barat.",
    body1: "Sebagai provinsi termuda di Sulawesi, Sulawesi Barat dengan ibu kota Mamuju sedang giat membangun infrastruktur pemerintahan, sehingga kebutuhan pasokan barang dari Jawa terus tumbuh.",
    eta: "umumnya 6–11 hari kerja tergantung moda",
    about: "Mamuju berada di pesisir barat Sulawesi dengan potensi ekonomi di sektor perkebunan sawit, kakao, dan perikanan, menjadi pusat administrasi Provinsi Sulawesi Barat.",
    hub: "Kiriman udara via Bandara Tampa Padang dan kargo laut melalui Pelabuhan Mamuju.",
    commodities: "Barang yang sering dikirim ke Mamuju meliputi perlengkapan perkantoran pemerintahan, peralatan perkebunan, barang dagangan, sembako, serta kebutuhan rumah tangga.",
    areas: ["Mamuju", "Simboro", "Kalukku", "Tapalang", "Kabupaten Mamuju"],
    extra: [{ q: "Berapa lama kargo laut ke Mamuju?", a: "Kargo laut ke Mamuju umumnya memerlukan waktu lebih lama dibanding udara karena jadwal kapal. Untuk barang mendesak, jalur udara via Bandara Tampa Padang lebih cepat." }],
    related: [{ slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Bandung → Makassar" }, { slug: "pengiriman-bandung-palu", label: "Bandung → Palu" }, { slug: "pengiriman-bandung-kendari", label: "Bandung → Kendari" }] },

  // ---- BARU: KALIMANTAN ----
  { slug: "pengiriman-bandung-palangkaraya", ...KAL, origin: "Bandung", dest: "Palangka Raya", province: "Kalimantan Tengah", crumb: "Bandung → Palangka Raya",
    modes: ["udara", "laut", "darat"],
    title: "Pengiriman Bandung Palangka Raya — Kargo &amp; Paket",
    h1: "Pengiriman Bandung ke Palangka Raya",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Palangka Raya (Kalimantan Tengah) via udara, laut, dan darat. Ongkir murah. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Palangka Raya untuk paket dan kargo dengan ongkir hemat.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Palangka Raya, ibu kota Kalimantan Tengah.",
    body1: "Palangka Raya adalah salah satu kota dengan wilayah administratif terluas di Indonesia, dengan tata kota yang lapang dan kebutuhan logistik pemerintahan serta perdagangan yang terus tumbuh.",
    eta: "umumnya 4–8 hari kerja tergantung moda",
    about: "Berada di tepi Sungai Kahayan, Palangka Raya sempat digadang sebagai calon ibu kota negara di masa lalu dan kini menjadi pusat administrasi Kalimantan Tengah.",
    hub: "Kiriman udara via Bandara Tjilik Riwut; kargo laut umumnya bongkar di Pelabuhan Sampit lalu diteruskan darat, atau via jalur Sungai Kahayan.",
    commodities: "Kiriman ke Palangka Raya banyak berupa perlengkapan perkantoran, ATK, furnitur, barang dagangan toko, serta kebutuhan rumah tangga dan material ringan.",
    areas: ["Pahandut", "Jekan Raya", "Sebangau", "Bukit Batu", "Sampit", "Kuala Kapuas"],
    extra: [{ q: "Apakah kargo laut ke Palangka Raya lewat Sampit?", a: "Umumnya ya. Kargo laut bongkar di Pelabuhan Sampit lalu diteruskan via darat ke Palangka Raya. Untuk kiriman cepat tersedia jalur udara via Bandara Tjilik Riwut." }],
    related: [{ slug: "kargo-pengiriman-bandung-banjarmasin", label: "Bandung → Banjarmasin" }, { slug: "pengiriman-paket-bandung-pontianak-murah-cepat", label: "Bandung → Pontianak" }, { slug: "kirim-barang-bandung-balikpapan", label: "Bandung → Balikpapan" }] },

  { slug: "pengiriman-bandung-tarakan", ...KAL, origin: "Bandung", dest: "Tarakan", province: "Kalimantan Utara", crumb: "Bandung → Tarakan",
    modes: ["udara", "laut"],
    title: "Pengiriman Bandung Tarakan — Kargo &amp; Paket Murah",
    h1: "Pengiriman Bandung ke Tarakan",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Tarakan (Kalimantan Utara) via udara dan laut. Ongkir murah & terpercaya. WA 0821-30-2000-30.",
    lead: "Kirim barang dan kargo Bandung–Tarakan dengan layanan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Tarakan, kota terbesar di Kalimantan Utara.",
    body1: "Tarakan adalah kota pulau yang menjadi pusat ekonomi dan pintu gerbang Kalimantan Utara, termasuk untuk distribusi menuju kawasan perbatasan dengan Malaysia.",
    eta: "umumnya 5–10 hari kerja tergantung moda",
    about: "Karena berupa pulau tersendiri, seluruh pasokan barang ke Tarakan masuk melalui jalur laut dan udara — menjadikan kota ini sangat bergantung pada kelancaran logistik antar pulau.",
    hub: "Kiriman udara via Bandara Juwata dan kargo laut melalui Pelabuhan Malundung/Tengkayu Tarakan.",
    commodities: "Barang yang sering dikirim ke Tarakan meliputi sembako, kebutuhan industri perikanan, barang dagangan untuk diteruskan ke wilayah perbatasan, sparepart, serta perlengkapan rumah tangga.",
    areas: ["Tarakan Tengah", "Tarakan Barat", "Tarakan Timur", "Tarakan Utara"],
    extra: [{ q: "Kenapa pengiriman ke Tarakan hanya via laut dan udara?", a: "Karena Tarakan adalah kota pulau yang tidak terhubung jalur darat. Seluruh kiriman masuk melalui Pelabuhan Malundung (laut) atau Bandara Juwata (udara)." }],
    related: [{ slug: "pengiriman-bandung-ke-samarinda", label: "Bandung → Samarinda" }, { slug: "kirim-barang-bandung-balikpapan", label: "Bandung → Balikpapan" }, { slug: "pengiriman-bandung-bontang", label: "Bandung → Bontang" }] },

  { slug: "pengiriman-bandung-singkawang", ...KAL, origin: "Bandung", dest: "Singkawang", province: "Kalimantan Barat", crumb: "Bandung → Singkawang",
    modes: ["udara", "laut", "darat"],
    title: "Pengiriman Bandung Singkawang — Kargo &amp; Paket",
    h1: "Pengiriman Bandung ke Singkawang",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Singkawang (Kalimantan Barat) via udara, laut, dan darat. Ongkir murah. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Singkawang untuk paket dan kargo dengan ongkir hemat.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Singkawang, kota wisata di pesisir Kalimantan Barat.",
    body1: "Singkawang dikenal dengan perayaan Cap Go Meh yang meriah dan sektor pariwisata-kulinernya yang hidup, sehingga kebutuhan pasokan barang dagangan dan perlengkapan usaha cukup tinggi.",
    eta: "umumnya 4–9 hari kerja tergantung moda",
    about: "Dijuluki “Kota Amoy” dengan budaya Tionghoa yang kuat, Singkawang menjadi destinasi wisata sekaligus pusat perdagangan kedua terbesar di Kalimantan Barat setelah Pontianak.",
    hub: "Kiriman umumnya masuk via Pontianak (Bandara Supadio / Pelabuhan Dwikora) lalu diteruskan darat sekitar 145 km ke Singkawang.",
    commodities: "Barang yang sering dikirim ke Singkawang meliputi perlengkapan toko dan usaha kuliner, produk fashion, kebutuhan wisata dan oleh-oleh, serta barang dagangan ritel.",
    areas: ["Singkawang Tengah", "Singkawang Barat", "Singkawang Selatan", "Sedau", "Sambas"],
    extra: [{ q: "Bagaimana barang sampai ke Singkawang?", a: "Kiriman biasanya tiba di Pontianak terlebih dahulu, lalu kami teruskan via darat sekitar 145 km ke Singkawang. Estimasi total tetap kami informasikan saat order." }],
    related: [{ slug: "pengiriman-paket-bandung-pontianak-murah-cepat", label: "Bandung → Pontianak" }, { slug: "kargo-pengiriman-bandung-banjarmasin", label: "Bandung → Banjarmasin" }, { slug: "pengiriman-bandung-palangkaraya", label: "Bandung → Palangka Raya" }] },

  { slug: "pengiriman-bandung-bontang", ...KAL, origin: "Bandung", dest: "Bontang", province: "Kalimantan Timur", crumb: "Bandung → Bontang",
    modes: ["udara", "laut", "darat"],
    title: "Pengiriman Bandung Bontang — Kargo &amp; Paket Murah",
    h1: "Pengiriman Bandung ke Bontang",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Bontang (Kalimantan Timur) via udara, laut, dan darat. Ongkir murah & terpercaya. WA 0821-30-2000-30.",
    lead: "Kirim barang dan kargo Bandung–Bontang dengan layanan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Bontang, kota industri di Kalimantan Timur.",
    body1: "Bontang adalah rumah bagi perusahaan gas alam cair (LNG) dan pupuk berskala nasional, sehingga arus barang industri, sparepart, dan kebutuhan kontraktor ke kota ini sangat aktif.",
    eta: "umumnya 4–9 hari kerja tergantung moda",
    about: "Meski berukuran kecil, Bontang adalah salah satu kota dengan pendapatan per kapita tertinggi di Indonesia berkat sektor industri gas dan pupuk yang besar.",
    hub: "Kiriman umumnya transit via Balikpapan atau Samarinda (Bandara Sepinggan / APT Pranoto, Pelabuhan Semayang) lalu diteruskan darat ke Bontang; kargo laut juga dapat bongkar di Pelabuhan Lhok Tuan.",
    commodities: "Barang yang sering dikirim ke Bontang meliputi material dan sparepart industri (LNG, pupuk), peralatan teknik, kebutuhan kontraktor proyek, serta perlengkapan rumah tangga karyawan.",
    areas: ["Bontang Utara", "Bontang Selatan", "Bontang Barat", "Lhok Tuan", "Tanjung Laut"],
    extra: [{ q: "Apakah bisa kirim sparepart dan material industri ke Bontang?", a: "Bisa. Kami terbiasa menangani sparepart dan material untuk kebutuhan industri serta kontraktor di Bontang. Untuk barang berat, kargo laut lebih ekonomis." }],
    related: [{ slug: "pengiriman-bandung-ke-samarinda", label: "Bandung → Samarinda" }, { slug: "kirim-barang-bandung-balikpapan", label: "Bandung → Balikpapan" }, { slug: "pengiriman-bandung-tarakan", label: "Bandung → Tarakan" }] },

  // ---- BARU: PAPUA ----
  { slug: "kargo-bandung-jayapura", ...PAP, origin: "Bandung", dest: "Jayapura", province: "Papua", crumb: "Bandung → Jayapura",
    modes: ["udara", "laut"],
    title: "Kargo Bandung Jayapura — Pengiriman Barang &amp; Paket",
    h1: "Kargo &amp; Pengiriman Bandung ke Jayapura",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Jayapura (Papua) via udara dan laut. Ongkir bersaing, aman & terpercaya. WA 0821-30-2000-30.",
    lead: "Kirim barang dan kargo Bandung–Jayapura dengan layanan aman dan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Jayapura, ibu kota Provinsi Papua.",
    body1: "Sebagai kota terbesar di utara Papua, Jayapura menjadi gerbang distribusi barang ke seluruh wilayah Papua bagian timur, dengan kebutuhan pasokan dari Jawa yang sangat tinggi mengingat keterbatasan produksi lokal.",
    eta: "umumnya 7–14 hari kerja tergantung moda",
    about: "Jayapura terletak di Teluk Yos Sudarso berbatasan langsung dengan Papua Nugini, dan menjadi pusat pemerintahan, perdagangan, serta pendidikan di Papua bagian utara.",
    hub: "Kiriman udara via Bandara Sentani dan kargo laut melalui Pelabuhan Jayapura.",
    commodities: "Barang yang sering dikirim ke Jayapura meliputi sembako dan barang konsumsi, barang dagangan toko, perlengkapan perkantoran dan proyek konstruksi, elektronik, serta kebutuhan rumah tangga.",
    areas: ["Jayapura Utara", "Jayapura Selatan", "Abepura", "Sentani", "Kabupaten Jayapura"],
    extra: [{ q: "Kenapa estimasi ke Jayapura lebih lama?", a: "Karena jarak yang jauh dan ketergantungan pada jadwal kapal serta penerbangan kargo. Untuk barang mendesak, jalur udara via Bandara Sentani lebih cepat meski biayanya lebih tinggi." }],
    related: [{ slug: "kargo-bandung-sorong", label: "Bandung → Sorong" }, { slug: "kargo-bandung-manokwari", label: "Bandung → Manokwari" }, { slug: "kargo-bandung-merauke", label: "Bandung → Merauke" }] },

  { slug: "kargo-bandung-sorong", ...PAP, origin: "Bandung", dest: "Sorong", province: "Papua Barat Daya", crumb: "Bandung → Sorong",
    modes: ["udara", "laut"],
    title: "Kargo Bandung Sorong — Pengiriman Barang &amp; Paket",
    h1: "Kargo &amp; Pengiriman Bandung ke Sorong",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Sorong (Papua Barat Daya) via udara dan laut. Ongkir bersaing & terpercaya. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Sorong untuk paket dan kargo dengan layanan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Sorong, gerbang barat Papua.",
    body1: "Sorong adalah kota pelabuhan dan simpul transportasi utama menuju Papua bagian barat, termasuk pintu masuk wisatawan dan logistik ke Kepulauan Raja Ampat.",
    eta: "umumnya 7–14 hari kerja tergantung moda",
    about: "Sebagai kota terbesar di Papua Barat Daya, Sorong adalah hub laut dan udara yang menghubungkan banyak rute ke kawasan kepala burung Papua dan Raja Ampat.",
    hub: "Kiriman udara via Bandara Domine Eduard Osok (DEO) dan kargo laut melalui Pelabuhan Sorong.",
    commodities: "Barang yang sering dikirim ke Sorong meliputi sparepart migas dan perikanan, logistik dan perbekalan menuju Raja Ampat, sembako, bahan bangunan, serta barang dagangan.",
    areas: ["Sorong Kota", "Sorong Timur", "Sorong Barat", "Aimas", "Kabupaten Sorong"],
    extra: [{ q: "Apakah bisa kirim perbekalan menuju Raja Ampat?", a: "Bisa. Sorong adalah pintu masuk Raja Ampat. Kami melayani pengiriman perbekalan dan logistik yang akan diteruskan ke kawasan Raja Ampat dari Sorong." }],
    related: [{ slug: "kargo-bandung-manokwari", label: "Bandung → Manokwari" }, { slug: "kargo-bandung-jayapura", label: "Bandung → Jayapura" }, { slug: "kargo-bandung-merauke", label: "Bandung → Merauke" }] },

  { slug: "kargo-bandung-manokwari", ...PAP, origin: "Bandung", dest: "Manokwari", province: "Papua Barat", crumb: "Bandung → Manokwari",
    modes: ["udara", "laut"],
    title: "Kargo Bandung Manokwari — Pengiriman Barang &amp; Paket",
    h1: "Kargo &amp; Pengiriman Bandung ke Manokwari",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Manokwari (Papua Barat) via udara dan laut. Ongkir bersaing & terpercaya. WA 0821-30-2000-30.",
    lead: "Kirim barang dan kargo Bandung–Manokwari dengan layanan aman.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Manokwari, ibu kota Provinsi Papua Barat.",
    body1: "Manokwari adalah pusat pemerintahan Papua Barat yang terus berbenah, dengan kebutuhan pasokan barang konsumsi, material, dan perlengkapan administrasi dari luar pulau.",
    eta: "umumnya 8–14 hari kerja tergantung moda",
    about: "Dikenal sebagai “Kota Injil” karena sejarah masuknya agama Kristen di Papua, Manokwari berada di pesisir utara dengan pelabuhan yang melayani distribusi antar wilayah.",
    hub: "Kiriman udara via Bandara Rendani dan kargo laut melalui Pelabuhan Manokwari.",
    commodities: "Barang yang sering dikirim ke Manokwari meliputi perlengkapan perkantoran pemerintahan, sembako, material bangunan, barang dagangan, serta kebutuhan rumah tangga.",
    areas: ["Manokwari Barat", "Manokwari Timur", "Manokwari Utara", "Prafi", "Kabupaten Manokwari"],
    extra: [{ q: "Moda apa yang paling hemat ke Manokwari?", a: "Kargo laut via Pelabuhan Manokwari paling ekonomis untuk barang berat dan besar, sementara jalur udara via Bandara Rendani lebih cepat untuk kiriman mendesak." }],
    related: [{ slug: "kargo-bandung-sorong", label: "Bandung → Sorong" }, { slug: "kargo-bandung-jayapura", label: "Bandung → Jayapura" }, { slug: "kargo-bandung-merauke", label: "Bandung → Merauke" }] },

  { slug: "kargo-bandung-merauke", ...PAP, origin: "Bandung", dest: "Merauke", province: "Papua Selatan", crumb: "Bandung → Merauke",
    modes: ["udara", "laut"],
    title: "Kargo Bandung Merauke — Pengiriman Barang &amp; Paket",
    h1: "Kargo &amp; Pengiriman Bandung ke Merauke",
    description: "Jasa pengiriman barang, paket, dan kargo dari Bandung ke Merauke (Papua Selatan) via udara dan laut. Ongkir bersaing & terpercaya. WA 0821-30-2000-30.",
    lead: "Pengiriman Bandung–Merauke untuk paket dan kargo dengan layanan terpercaya.",
    intro: "Buana Raya Express melayani pengiriman dari Bandung ke Merauke, kota paling timur Indonesia.",
    body1: "Sebagai kawasan lumbung pangan dengan program food estate, Merauke membutuhkan pasokan alat pertanian, sarana produksi, dan barang konsumsi dari luar pulau yang terus berdatangan.",
    eta: "umumnya 8–15 hari kerja tergantung moda",
    about: "Merauke adalah ibu kota Papua Selatan dan kota paling timur Indonesia, terkenal dengan Taman Nasional Wasur dan hamparan lahan pertanian yang luas.",
    hub: "Kiriman udara via Bandara Mopah dan kargo laut melalui Pelabuhan Merauke.",
    commodities: "Barang yang sering dikirim ke Merauke meliputi alat dan sarana pertanian (food estate), sembako, barang dagangan, material bangunan, serta kebutuhan rumah tangga.",
    areas: ["Merauke Kota", "Semangga", "Tanah Miring", "Kurik", "Kabupaten Merauke"],
    extra: [{ q: "Apakah bisa kirim alat pertanian ke Merauke?", a: "Bisa. Kami melayani pengiriman alat dan sarana pertanian untuk kebutuhan food estate serta petani di Merauke. Untuk alat berukuran besar, kargo laut lebih ekonomis." }],
    related: [{ slug: "kargo-bandung-jayapura", label: "Bandung → Jayapura" }, { slug: "kargo-bandung-sorong", label: "Bandung → Sorong" }, { slug: "kargo-bandung-manokwari", label: "Bandung → Manokwari" }] },
];

routes.forEach((r) => write(r.slug, routePage(r)));

/* ============================================================
   HALAMAN HUB (pulau & kota asal)
   ============================================================ */
function cityChips(list) {
  return `<div class="chips" style="justify-content:center;margin-top:20px">${list
    .map((c) => (c.slug ? `<a class="chip" href="/${c.slug}/">${c.label}</a>` : `<span class="chip">${c.label}</span>`))
    .join("\n      ")}</div>`;
}

function hubPage({ slug, title, description, active, h1, lead, intro, sections, chips, chipsHeading, crumbItems, faqs }) {
  const wa = WA_DEFAULT;
  const body = `${crumbNav(crumbItems)}
  <section class="hero" style="padding:48px 0 54px"><div class="container">
    <h1>${h1}</h1><p>${lead}</p>
    <div class="hero-actions"><a class="btn btn--wa btn--lg" href="${wa}">Konsultasi via WhatsApp</a><a class="btn btn--ghost btn--lg" href="/tarif/">Lihat Tarif</a></div>
  </div></section>
  <section class="section"><div class="container narrow prose">
    <p class="lead">${intro}</p>
    ${sections}
  </div></section>
  ${chips ? `<section class="section section--soft"><div class="container"><h2 class="center">${chipsHeading}</h2>${cityChips(chips)}</div></section>` : ""}
  ${faqs ? `<section class="section"><div class="container narrow"><h2 class="center">Pertanyaan Umum</h2>${faqAccordion(faqs)}</div></section>` : ""}
  ${reviewSection()}
  ${ctaBand()}`;
  const jsonld = `${breadcrumb(crumbItems.map((c, i) => ({ name: c.name, url: i === crumbItems.length - 1 ? `${SITE}/${slug}/` : `${SITE}${c.path}` })))}${faqs ? `,\n    ${faqJsonld(faqs)}` : ""}`;
  return shell({ slug, title, description, body, active: active || "", jsonldGraph: jsonld });
}

/* ---- HUB PULAU ---- */
write("kota-dan-kabupaten-di-pulau-kalimantan", hubPage({
  slug: "kota-dan-kabupaten-di-pulau-kalimantan",
  title: "Pengiriman ke Kota &amp; Kabupaten di Pulau Kalimantan",
  description: "Layanan pengiriman barang, paket, dan kargo ke seluruh kota dan kabupaten di Pulau Kalimantan: Banjarmasin, Balikpapan, Samarinda, Pontianak, dan lainnya. WA 0821-30-2000-30.",
  h1: "Pengiriman ke Pulau Kalimantan",
  lead: "Buana Raya Express melayani pengiriman barang, paket, dan kargo ke seluruh kota dan kabupaten di Pulau Kalimantan.",
  intro: "Kalimantan adalah pulau terbesar di Indonesia dengan lima provinsi dan kebutuhan logistik yang tinggi. Buana Raya Express melayani pengiriman dari Bandung, Jakarta, dan Surabaya ke berbagai kota di Kalimantan via udara, laut, dan darat.",
  sections: `<h2>Provinsi &amp; Kota Tujuan di Kalimantan</h2>
    <p>Kami melayani pengiriman ke lima provinsi di Kalimantan: Kalimantan Selatan, Kalimantan Timur, Kalimantan Barat, Kalimantan Tengah, dan Kalimantan Utara — mencakup kota besar maupun kabupaten.</p>
    <h2>Pilihan Moda Pengiriman</h2>
    <ul><li><strong>Udara</strong> untuk kiriman cepat.</li><li><strong>Laut</strong> untuk kargo berat dan ekonomis.</li><li><strong>Darat</strong> untuk rute yang terjangkau jalur darat.</li></ul>`,
  chipsHeading: "Rute Populer ke Kalimantan",
  chips: [
    { slug: "kargo-pengiriman-bandung-banjarmasin", label: "Banjarmasin" },
    { slug: "ongkir-bandung-banjarbaru-murah", label: "Banjarbaru" },
    { slug: "kirim-barang-bandung-balikpapan", label: "Balikpapan" },
    { slug: "pengiriman-bandung-ke-samarinda", label: "Samarinda" },
    { slug: "pengiriman-bandung-bontang", label: "Bontang" },
    { slug: "pengiriman-paket-bandung-pontianak-murah-cepat", label: "Pontianak" },
    { slug: "pengiriman-bandung-singkawang", label: "Singkawang" },
    { slug: "pengiriman-bandung-palangkaraya", label: "Palangka Raya" },
    { slug: "pengiriman-bandung-tarakan", label: "Tarakan" },
  ],
  crumbItems: [{ name: "Beranda", path: "/" }, { name: "Pulau Kalimantan" }],
  faqs: [
    { q: "Kota apa saja di Kalimantan yang dilayani?", a: "Banjarmasin, Banjarbaru, Balikpapan, Samarinda, Bontang, Pontianak, Singkawang, Palangka Raya, Tarakan, dan kota/kabupaten lainnya. Hubungi kami untuk tujuan spesifik Anda." },
    { q: "Apa moda tercepat ke Kalimantan?", a: "Kargo udara adalah pilihan tercepat, sementara kargo laut lebih ekonomis untuk barang berat dan volume besar." },
  ],
}));

write("kabupaten-dan-kota-di-pulau-sulawesi", hubPage({
  slug: "kabupaten-dan-kota-di-pulau-sulawesi",
  title: "Pengiriman ke Kabupaten &amp; Kota di Pulau Sulawesi",
  description: "Layanan pengiriman barang, paket, dan kargo ke seluruh kabupaten dan kota di Pulau Sulawesi: Makassar, Palu, Kendari, Manado, Gorontalo, Mamuju, dan lainnya. WA 0821-30-2000-30.",
  h1: "Pengiriman ke Pulau Sulawesi",
  lead: "Buana Raya Express melayani pengiriman barang, paket, dan kargo ke seluruh kabupaten dan kota di Pulau Sulawesi.",
  intro: "Sulawesi memiliki enam provinsi dengan Makassar sebagai gerbang utama Indonesia Timur. Buana Raya Express melayani pengiriman dari Jawa ke berbagai kota di Sulawesi via udara dan laut.",
  sections: `<h2>Provinsi &amp; Kota Tujuan di Sulawesi</h2>
    <p>Kami melayani pengiriman ke Sulawesi Selatan, Sulawesi Tengah, Sulawesi Tenggara, Sulawesi Utara, Sulawesi Barat, dan Gorontalo.</p>
    <h2>Pilihan Moda Pengiriman</h2>
    <ul><li><strong>Udara</strong> untuk kiriman cepat.</li><li><strong>Laut</strong> untuk kargo berat dan ekonomis.</li></ul>`,
  chipsHeading: "Rute Populer ke Sulawesi",
  chips: [
    { slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Makassar" },
    { slug: "pengiriman-bandung-palu", label: "Palu" },
    { slug: "pengiriman-bandung-kendari", label: "Kendari" },
    { slug: "pengiriman-bandung-manado", label: "Manado" },
    { slug: "pengiriman-bandung-gorontalo", label: "Gorontalo" },
    { slug: "pengiriman-bandung-mamuju", label: "Mamuju" },
  ],
  crumbItems: [{ name: "Beranda", path: "/" }, { name: "Pulau Sulawesi" }],
  faqs: [
    { q: "Kota apa saja di Sulawesi yang dilayani?", a: "Makassar, Palu, Kendari, Manado, Gorontalo, Mamuju, dan kota/kabupaten lainnya. Hubungi kami untuk tujuan spesifik." },
    { q: "Berapa lama pengiriman ke Sulawesi?", a: "Estimasi 4–10 hari kerja tergantung kota tujuan dan moda pengiriman." },
  ],
}));

write("kota-dan-kabupaten-di-pulau-papua", hubPage({
  slug: "kota-dan-kabupaten-di-pulau-papua",
  title: "Pengiriman ke Kota &amp; Kabupaten di Pulau Papua",
  description: "Layanan pengiriman barang, paket, dan kargo ke seluruh kota dan kabupaten di Pulau Papua: Jayapura, Sorong, Manokwari, Merauke, dan lainnya. WA 0821-30-2000-30.",
  h1: "Pengiriman ke Pulau Papua",
  lead: "Buana Raya Express melayani pengiriman barang, paket, dan kargo ke kota-kota besar di Pulau Papua.",
  intro: "Papua adalah wilayah dengan kebutuhan logistik tinggi dan biaya distribusi yang menantang. Buana Raya Express melayani pengiriman dari Jawa ke kota-kota utama Papua via udara dan laut dengan ongkir yang bersaing.",
  sections: `<h2>Kota Tujuan di Papua</h2>
    <p>Kami melayani pengiriman ke Jayapura, Sorong, Manokwari, Merauke, dan kota lainnya di wilayah Papua, Papua Barat, Papua Barat Daya, dan Papua Selatan.</p>
    <h2>Pilihan Moda Pengiriman</h2>
    <ul><li><strong>Udara</strong> untuk kiriman cepat dan mendesak.</li><li><strong>Laut</strong> untuk kargo besar dengan ongkir lebih hemat.</li></ul>`,
  chipsHeading: "Rute Populer ke Papua",
  chips: [
    { slug: "kargo-bandung-jayapura", label: "Jayapura" },
    { slug: "kargo-bandung-sorong", label: "Sorong" },
    { slug: "kargo-bandung-manokwari", label: "Manokwari" },
    { slug: "kargo-bandung-merauke", label: "Merauke" },
  ],
  crumbItems: [{ name: "Beranda", path: "/" }, { name: "Pulau Papua" }],
  faqs: [
    { q: "Apakah bisa kirim barang ke Papua?", a: "Ya. Kami melayani pengiriman ke Jayapura, Sorong, Manokwari, Merauke, dan kota lain di Papua via udara dan laut." },
    { q: "Berapa lama pengiriman ke Papua?", a: "Estimasi 7–15 hari kerja tergantung kota tujuan dan moda pengiriman." },
  ],
}));

/* ---- HUB KOTA ASAL ---- */
write("ekspedisi-kiriman-kargo-barang-paket-dari-bandung", hubPage({
  slug: "ekspedisi-kiriman-kargo-barang-paket-dari-bandung",
  title: "Ekspedisi &amp; Kiriman Kargo, Barang, Paket dari Bandung",
  description: "Jasa ekspedisi pengiriman kargo, barang, dan paket dari Bandung ke Kalimantan, Sulawesi, Bali, dan Papua via udara, laut, dan darat. Ongkir murah. WA 0821-30-2000-30.",
  h1: "Ekspedisi &amp; Pengiriman Kargo dari Bandung",
  lead: "Kirim barang, paket, dan kargo dari Bandung ke seluruh Indonesia bersama Buana Raya Express.",
  intro: "Kantor cabang Bandung kami berlokasi di Jl. Jamika No. 136 dan melayani pengiriman ke Kalimantan, Sulawesi, Bali, dan Papua via udara, laut, dan darat.",
  sections: `<h2>Layanan Pengiriman dari Bandung</h2>
    <p>Buana Raya Express cabang Bandung melayani pengiriman paket pribadi, barang dagangan, hingga kargo proyek dengan armada sendiri dan jadwal rutin.</p>
    <div class="callout"><strong>Cabang Bandung:</strong> Jl. Jamika No. 136 — WA/Telp <a href="${waLink(WA_BDG, "Halo, saya mau kirim barang dari Bandung")}">0821-30-2000-30</a>.</div>`,
  chipsHeading: "Tujuan Populer dari Bandung",
  chips: [
    { slug: "kargo-pengiriman-bandung-banjarmasin", label: "Banjarmasin" },
    { slug: "kirim-barang-bandung-balikpapan", label: "Balikpapan" },
    { slug: "pengiriman-bandung-ke-samarinda", label: "Samarinda" },
    { slug: "pengiriman-paket-bandung-pontianak-murah-cepat", label: "Pontianak" },
    { slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Makassar" },
    { slug: "kargo-bandung-jayapura", label: "Jayapura" },
  ],
  crumbItems: [{ name: "Beranda", path: "/" }, { name: "Ekspedisi dari Bandung" }],
}));

write("ekspedisi-surabaya-kiriman-kargo-barang-paket-dari-surabaya", hubPage({
  slug: "ekspedisi-surabaya-kiriman-kargo-barang-paket-dari-surabaya",
  title: "Ekspedisi Surabaya — Kiriman Kargo, Barang, Paket",
  description: "Jasa ekspedisi pengiriman kargo, barang, dan paket dari Surabaya ke Kalimantan, Sulawesi, Bali, dan Papua via udara, laut, dan darat. WA 0812-1781-2900.",
  h1: "Ekspedisi &amp; Pengiriman Kargo dari Surabaya",
  lead: "Kirim barang, paket, dan kargo dari Surabaya ke seluruh Indonesia bersama Buana Raya Express.",
  intro: "Kantor cabang Surabaya kami berlokasi di Jl. Undaan Kulon No. 119 dan melayani pengiriman ke Kalimantan, Sulawesi, Bali, dan Papua.",
  sections: `<h2>Layanan Pengiriman dari Surabaya</h2>
    <p>Sebagai kota pelabuhan terbesar di Indonesia Timur, Surabaya menjadi titik distribusi strategis. Buana Raya Express cabang Surabaya melayani pengiriman kargo laut dan udara dengan ongkir bersaing.</p>
    <div class="callout"><strong>Cabang Surabaya:</strong> Jl. Undaan Kulon No. 119 — WA <a href="${waLink(WA_SBY, "Halo, saya mau kirim barang dari Surabaya")}">0812-1781-2900</a>.</div>`,
  chipsHeading: "Tujuan Populer dari Surabaya",
  chips: [
    { slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Makassar" },
    { slug: "kargo-pengiriman-bandung-banjarmasin", label: "Banjarmasin" },
    { slug: "kirim-barang-bandung-balikpapan", label: "Balikpapan" },
    { slug: "kargo-bandung-jayapura", label: "Jayapura" },
  ],
  crumbItems: [{ name: "Beranda", path: "/" }, { name: "Ekspedisi dari Surabaya" }],
}));

write("pengiriman-ekspedisi-paket-kargo-jakarta", hubPage({
  slug: "pengiriman-ekspedisi-paket-kargo-jakarta",
  title: "Pengiriman Ekspedisi Paket &amp; Kargo dari Jakarta",
  description: "Jasa ekspedisi pengiriman paket, barang, dan kargo dari Jakarta ke Kalimantan, Sulawesi, Bali, dan Papua via udara, laut, dan darat. WA 0812-8956-660.",
  h1: "Ekspedisi &amp; Pengiriman Kargo dari Jakarta",
  lead: "Kirim paket, barang, dan kargo dari Jakarta ke seluruh Indonesia bersama Buana Raya Express.",
  intro: "Kantor cabang Jakarta kami berlokasi di Jl. Wedana No. 24 dan melayani pengiriman ke Kalimantan, Sulawesi, Bali, dan Papua via udara, laut, dan darat.",
  sections: `<h2>Layanan Pengiriman dari Jakarta</h2>
    <p>Buana Raya Express cabang Jakarta melayani pengiriman paket pribadi hingga kargo bisnis dengan layanan yang cepat dan ongkir bersaing.</p>
    <div class="callout"><strong>Cabang Jakarta:</strong> Jl. Wedana No. 24 — WA <a href="${waLink(WA_JKT, "Halo, saya mau kirim barang dari Jakarta")}">0812-8956-660</a>.</div>`,
  chipsHeading: "Tujuan Populer dari Jakarta",
  chips: [
    { slug: "kargo-pengiriman-bandung-banjarmasin", label: "Banjarmasin" },
    { slug: "kirim-barang-bandung-balikpapan", label: "Balikpapan" },
    { slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Makassar" },
    { slug: "kargo-bandung-sorong", label: "Sorong" },
  ],
  crumbItems: [{ name: "Beranda", path: "/" }, { name: "Ekspedisi dari Jakarta" }],
}));

/* ============================================================
   HALAMAN STATIS
   ============================================================ */
function staticPage({ slug, title, description, active, body, jsonldGraph }) {
  return shell({ slug, title, description, active: active || "", body, jsonldGraph: jsonldGraph || "" });
}

const crumb2 = (name) => `${SITE}`; // helper not needed

/* HOME */
write("", shell({
  slug: "",
  title: "Jasa Pengiriman Barang, Paket &amp; Kargo Murah ke Seluruh Indonesia",
  description: "Buana Raya Express — jasa pengiriman barang, paket, dan kargo murah, aman & terpercaya via udara, laut, dan darat dari Bandung, Jakarta, Surabaya ke Kalimantan, Sulawesi, Bali, dan Papua. WA 0821-30-2000-30.",
  active: "",
  jsonldGraph: `${faqJsonld([
    { q: "Apa saja layanan Buana Raya Express?", a: "Kami melayani pengiriman barang, paket, dan kargo via udara, laut, dan darat ke seluruh Indonesia, termasuk pengiriman kendaraan/motor, barang cair, serta jasa packing kayu." },
    { q: "Dari kota mana saja Buana Raya Express melayani pengiriman?", a: "Kami memiliki kantor cabang di Bandung, Jakarta, dan Surabaya, dengan tujuan utama ke Kalimantan, Sulawesi, Bali, dan Papua." },
    { q: "Bagaimana cara mengetahui ongkos kirim?", a: "Hubungi kami melalui WhatsApp 0821-30-2000-30 atau lihat halaman Tarif. Ongkir dihitung berdasarkan berat aktual atau berat volume, mana yang lebih besar, dan kota tujuan." },
    { q: "Apakah barang saya aman selama pengiriman?", a: "Ya. Buana Raya Express memiliki armada sendiri dan kantor cabang resmi di kota asal pengiriman sehingga barang Anda tertangani secara profesional." },
  ])}`,
  body: `<section class="hero"><div class="container">
    <span class="eyebrow">Pengiriman Udara · Laut · Darat</span>
    <h1>Jasa Pengiriman Barang, Paket &amp; Kargo Murah ke Seluruh Indonesia</h1>
    <p>Buana Raya Express mengirim barang, paket, dan kargo Anda dengan <strong>aman, cepat, dan terpercaya</strong> dari Bandung, Jakarta, dan Surabaya ke Kalimantan, Sulawesi, Bali, hingga Papua.</p>
    <div class="hero-actions"><a class="btn btn--wa btn--lg" href="${waLink(WA_BDG, "Halo Buana Raya Express, saya mau kirim barang")}">Konsultasi &amp; Pesan via WhatsApp</a><a class="btn btn--ghost btn--lg" href="/tarif/">Lihat Daftar Tarif</a></div>
    <div class="hero-trust"><div><b>Armada Sendiri</b> via udara, laut &amp; darat</div><div><b>3 Cabang</b> Bandung · Jakarta · Surabaya</div><div><b>200+ Kota</b> tujuan se-Indonesia</div></div>
  </div></section>

  <section class="section"><div class="container">
    <div class="center" style="max-width:720px;margin:0 auto 12px"><h2>Layanan Pengiriman Buana Raya Express</h2><p class="lead">Solusi pengiriman lengkap untuk perorangan maupun bisnis, dari paket kecil hingga kargo besar.</p></div>
    <div class="grid grid-4" style="margin-top:30px">
      <a class="card card--link" href="/layanan/"><div class="ico">✈️</div><h3>Kargo Udara</h3><p class="muted">Pengiriman cepat via pesawat untuk barang yang butuh tiba dalam waktu singkat.</p></a>
      <a class="card card--link" href="/layanan/"><div class="ico">🚢</div><h3>Kargo Laut</h3><p class="muted">Pilihan ekonomis untuk kiriman berat dan volume besar dengan kapal cepat.</p></a>
      <a class="card card--link" href="/layanan/"><div class="ico">🚚</div><h3>Kargo Darat</h3><p class="muted">Layanan via truk &amp; ekspedisi darat antar pulau dan antar kota.</p></a>
      <a class="card card--link" href="/layanan/"><div class="ico">📦</div><h3>Packing &amp; Kayu</h3><p class="muted">Jasa pengemasan dan packing kayu agar barang Anda lebih aman.</p></a>
    </div>
  </div></section>

  <section class="section section--soft"><div class="container">
    <h2 class="center">Rute Pengiriman Populer dari Bandung</h2>
    <p class="lead center" style="max-width:680px;margin:0 auto 26px">Klik tujuan Anda untuk melihat informasi lengkap pengiriman, estimasi waktu, dan cara order.</p>
    ${cityChips([
      { slug: "kargo-pengiriman-bandung-banjarmasin", label: "Bandung → Banjarmasin" },
      { slug: "kirim-barang-bandung-balikpapan", label: "Bandung → Balikpapan" },
      { slug: "pengiriman-bandung-ke-samarinda", label: "Bandung → Samarinda" },
      { slug: "pengiriman-paket-bandung-pontianak-murah-cepat", label: "Bandung → Pontianak" },
      { slug: "ongkir-bandung-banjarbaru-murah", label: "Bandung → Banjarbaru" },
      { slug: "kirim-paket-bandung-makassar-ongkir-murah", label: "Bandung → Makassar" },
      { slug: "pengiriman-bandung-palu", label: "Bandung → Palu" },
      { slug: "pengiriman-bandung-kendari", label: "Bandung → Kendari" },
      { slug: "pengiriman-bandung-manado", label: "Bandung → Manado" },
      { slug: "pengiriman-bandung-palangkaraya", label: "Bandung → Palangka Raya" },
      { slug: "pengiriman-bandung-tarakan", label: "Bandung → Tarakan" },
      { slug: "kargo-bandung-jayapura", label: "Bandung → Jayapura" },
      { slug: "kargo-bandung-sorong", label: "Bandung → Sorong" },
      { slug: "kiriman-paket-dengan-ongkir-murah-bandung-ke-denpasar-bali", label: "Bandung → Denpasar" },
    ])}
    <div class="center" style="margin-top:24px"><a class="btn btn--ghost" href="/tarif/">Lihat semua kota tujuan →</a></div>
  </div></section>

  <section class="section"><div class="container">
    <h2 class="center">Kenapa Memilih Buana Raya Express?</h2>
    <div class="grid grid-3" style="margin-top:28px">
      <div class="card"><div class="ico">🛡️</div><h3>Aman &amp; Terpercaya</h3><p class="muted">Barang ditangani profesional dari kantor cabang resmi di kota asal hingga tiba di tujuan.</p></div>
      <div class="card"><div class="ico">💰</div><h3>Ongkir Bersaing</h3><p class="muted">Tarif kompetitif untuk pengiriman ke Kalimantan, Sulawesi, Bali, dan Papua.</p></div>
      <div class="card"><div class="ico">🚛</div><h3>Armada Sendiri</h3><p class="muted">Didukung armada milik sendiri dan pengalaman bertahun-tahun di bidang ekspedisi.</p></div>
      <div class="card"><div class="ico">🗺️</div><h3>Jangkauan Luas</h3><p class="muted">Melayani 200+ kota &amp; kabupaten di seluruh Indonesia.</p></div>
      <div class="card"><div class="ico">⚡</div><h3>Proses Cepat</h3><p class="muted">Pemesanan mudah lewat WhatsApp, respon cepat, jadwal pengiriman rutin.</p></div>
      <div class="card"><div class="ico">📞</div><h3>Layanan Personal</h3><p class="muted">Tim kami siap membantu konsultasi jenis pengiriman yang paling sesuai.</p></div>
    </div>
  </div></section>

  <section class="section section--soft"><div class="container narrow">
    <h2 class="center">Cara Kirim Barang Bersama Kami</h2>
    <div class="grid grid-4" style="margin-top:26px">
      <div class="card center"><div class="ico" style="margin:0 auto 12px">1</div><h3>Hubungi Kami</h3><p class="muted">Chat WhatsApp untuk konsultasi &amp; cek tarif.</p></div>
      <div class="card center"><div class="ico" style="margin:0 auto 12px">2</div><h3>Kirim/Pickup</h3><p class="muted">Antar ke cabang atau minta penjemputan barang.</p></div>
      <div class="card center"><div class="ico" style="margin:0 auto 12px">3</div><h3>Packing</h3><p class="muted">Barang dikemas aman, packing kayu bila perlu.</p></div>
      <div class="card center"><div class="ico" style="margin:0 auto 12px">4</div><h3>Terkirim</h3><p class="muted">Barang dikirim &amp; sampai di kota tujuan.</p></div>
    </div>
  </div></section>

  ${reviewSection("Ulasan Pelanggan")}

  <section class="section section--soft"><div class="container">
    <h2 class="center">Kantor Cabang Kami</h2>
    <div class="grid grid-3" style="margin-top:26px">
      <div class="branch"><h3>Bandung</h3><address>Jl. Jamika No. 136, Bandung, Jawa Barat</address><a class="btn btn--wa" href="${waLink(WA_BDG, "Halo, saya mau kirim barang dari Bandung")}">WA 0821-30-2000-30</a></div>
      <div class="branch"><h3>Jakarta</h3><address>Jl. Wedana No. 24, Jakarta</address><a class="btn btn--wa" href="${waLink(WA_JKT, "Halo, saya mau kirim barang dari Jakarta")}">WA 0812-8956-660</a></div>
      <div class="branch"><h3>Surabaya</h3><address>Jl. Undaan Kulon No. 119, Surabaya, Jawa Timur</address><a class="btn btn--wa" href="${waLink(WA_SBY, "Halo, saya mau kirim barang dari Surabaya")}">WA 0812-1781-2900</a></div>
    </div>
  </div></section>

  <section class="section"><div class="container narrow">
    <h2 class="center">Pertanyaan yang Sering Diajukan</h2>
    ${faqAccordion([
      { q: "Apa saja layanan Buana Raya Express?", a: "Kami melayani pengiriman barang, paket, dan kargo via udara, laut, dan darat ke seluruh Indonesia, termasuk pengiriman kendaraan/motor, barang cair, serta jasa packing kayu." },
      { q: "Dari kota mana saja Buana Raya Express melayani pengiriman?", a: "Kami memiliki kantor cabang di Bandung, Jakarta, dan Surabaya, dengan tujuan utama ke Kalimantan, Sulawesi, Bali, dan Papua." },
      { q: "Bagaimana cara mengetahui ongkos kirim?", a: "Hubungi kami melalui WhatsApp 0821-30-2000-30 atau lihat halaman <a href=\"/tarif/\">Tarif</a>. Ongkir dihitung berdasarkan berat aktual atau berat volume (mana yang lebih besar) dan kota tujuan." },
      { q: "Apakah barang saya aman selama pengiriman?", a: "Ya. Buana Raya Express memiliki armada sendiri dan kantor cabang resmi di kota asal pengiriman sehingga barang Anda tertangani secara profesional." },
    ])}
  </div></section>

  ${ctaBand()}`,
}));

/* TENTANG KAMI */
write("tentang-kami", staticPage({
  slug: "tentang-kami", active: "tentang",
  title: "Tentang Buana Raya Express — Jasa Kargo &amp; Ekspedisi Terpercaya",
  description: "Mengenal PT Buana Raya Express, perusahaan jasa pengiriman barang, paket, dan kargo via udara, laut, dan darat dengan armada sendiri dan cabang di Bandung, Jakarta, Surabaya.",
  jsonldGraph: breadcrumb([{ name: "Beranda", url: `${SITE}/` }, { name: "Tentang Kami", url: `${SITE}/tentang-kami/` }]),
  body: `${crumbNav([{ name: "Beranda", path: "/" }, { name: "Tentang Kami" }])}
  <section class="section"><div class="container narrow prose">
    <h1>Tentang Buana Raya Express</h1>
    <p class="lead">PT Buana Raya Express adalah perusahaan jasa pengiriman barang, paket, dan kargo yang melayani pengiriman ke seluruh Indonesia melalui jalur udara, laut, dan darat.</p>
    <p>Berbekal pengalaman bertahun-tahun di bidang ekspedisi, Buana Raya Express tumbuh menjadi mitra pengiriman yang dipercaya oleh perorangan maupun pelaku usaha. Kami memahami bahwa setiap kiriman — baik paket kecil maupun kargo besar — adalah amanah yang harus tiba dengan aman dan tepat waktu.</p>
    <h2>Visi &amp; Komitmen Kami</h2>
    <p>Visi kami: menjadi jasa pengiriman antar pulau yang paling diandalkan dengan tarif bersaing dan pelayanan ramah. Kami menangani setiap barang secara profesional, dari penerimaan di kantor cabang hingga tiba di kota tujuan.</p>
    <h2>Kenapa Buana Raya Express?</h2>
    <ul>
      <li><strong>Armada sendiri</strong> sehingga jadwal dan kualitas pengiriman lebih terkontrol.</li>
      <li><strong>Kantor cabang resmi</strong> di Bandung, Jakarta, dan Surabaya.</li>
      <li><strong>Multi-moda</strong> via udara (cepat), laut (ekonomis), dan darat.</li>
      <li><strong>Jangkauan luas</strong> ke 200+ kota, fokus Kalimantan, Sulawesi, Bali, dan Papua.</li>
      <li><strong>Layanan lengkap</strong> termasuk pengiriman kendaraan/motor, barang cair, dan packing kayu.</li>
    </ul>
    <div class="callout"><strong>Butuh kirim barang sekarang?</strong> Hubungi WhatsApp <a href="${WA_DEFAULT}">0821-30-2000-30</a>.</div>
    <h2>Jangkauan Layanan</h2>
    <p>Kami melayani pengiriman dari Bandung, Jakarta, dan Surabaya ke kota besar di <a href="/kota-dan-kabupaten-di-pulau-kalimantan/">Kalimantan</a>, <a href="/kabupaten-dan-kota-di-pulau-sulawesi/">Sulawesi</a>, Bali, dan <a href="/kota-dan-kabupaten-di-pulau-papua/">Papua</a>. Lihat <a href="/tarif/">daftar tarif</a> untuk kota tujuan dan estimasi ongkir.</p>
  </div></section>
  ${ctaBand("Mari Kirim Bersama Buana Raya Express")}`,
}));

/* LAYANAN */
write("layanan", staticPage({
  slug: "layanan", active: "layanan",
  title: "Layanan Pengiriman Ekspedisi Paket, Barang &amp; Kargo",
  description: "Layanan Buana Raya Express: kargo udara, kargo laut, kargo darat, pengiriman kendaraan/motor, barang cair, dan jasa packing kayu ke Kalimantan, Sulawesi, Bali, Papua.",
  jsonldGraph: `${breadcrumb([{ name: "Beranda", url: `${SITE}/` }, { name: "Layanan", url: `${SITE}/layanan/` }])},
    {"@type":"Service","serviceType":"Jasa pengiriman barang, paket, dan kargo","provider":{"@id":"${SITE}/#organization"},"areaServed":"Indonesia","description":"Pengiriman via udara, laut, dan darat, termasuk pengiriman kendaraan, barang cair, dan packing kayu."}`,
  body: `${crumbNav([{ name: "Beranda", path: "/" }, { name: "Layanan" }])}
  <section class="section"><div class="container narrow prose">
    <h1>Layanan Pengiriman Buana Raya Express</h1>
    <p class="lead">Solusi pengiriman lengkap via udara, laut, dan darat untuk perorangan maupun bisnis.</p>
  </div>
  <div class="container"><div class="grid grid-3" style="margin-top:10px">
    <div class="card"><div class="ico">✈️</div><h3>Kargo Udara</h3><p class="muted">Pengiriman tercepat via pesawat untuk barang yang ditunggu atau mudah rusak.</p></div>
    <div class="card"><div class="ico">🚢</div><h3>Kargo Laut</h3><p class="muted">Pilihan ekonomis untuk barang berat dan volume besar dengan kapal cepat.</p></div>
    <div class="card"><div class="ico">🚚</div><h3>Kargo Darat</h3><p class="muted">Pengiriman via truk dan ekspedisi darat antar kota dan antar pulau.</p></div>
    <div class="card"><div class="ico">🏍️</div><h3>Pengiriman Kendaraan</h3><p class="muted">Kirim motor dan kendaraan dengan penanganan khusus dan aman.</p></div>
    <div class="card"><div class="ico">🛢️</div><h3>Barang Cair</h3><p class="muted">Penanganan khusus untuk pengiriman barang cair sesuai ketentuan.</p></div>
    <div class="card"><div class="ico">📦</div><h3>Packing Kayu</h3><p class="muted">Jasa pengemasan dan packing kayu agar barang lebih terlindungi.</p></div>
  </div></div>
  <div class="container narrow prose" style="margin-top:30px">
    <h2>Pengiriman ke Seluruh Indonesia</h2>
    <p>Buana Raya Express melayani pengiriman dari Bandung, Jakarta, dan Surabaya ke <a href="/kota-dan-kabupaten-di-pulau-kalimantan/">Kalimantan</a>, <a href="/kabupaten-dan-kota-di-pulau-sulawesi/">Sulawesi</a>, Bali, dan <a href="/kota-dan-kabupaten-di-pulau-papua/">Papua</a>. Lihat <a href="/tarif/">daftar tarif</a> untuk informasi ongkir.</p>
  </div></section>
  ${ctaBand()}`,
}));

/* CABANG */
write("cabang", staticPage({
  slug: "cabang", active: "cabang",
  title: "Kantor Cabang Buana Raya Express — Bandung, Jakarta, Surabaya",
  description: "Alamat dan kontak kantor cabang Buana Raya Express di Bandung (Jl. Jamika 136), Jakarta (Jl. Wedana 24), dan Surabaya (Jl. Undaan Kulon 119). Hubungi WA untuk pengiriman.",
  jsonldGraph: `${breadcrumb([{ name: "Beranda", url: `${SITE}/` }, { name: "Cabang", url: `${SITE}/cabang/` }])},
    {"@type":"LocalBusiness","name":"Buana Raya Express — Cabang Bandung","telephone":"+62-821-3020-0030","image":"${SITE}/assets/img/logo.png","address":{"@type":"PostalAddress","streetAddress":"Jl. Jamika No. 136","addressLocality":"Bandung","addressRegion":"Jawa Barat","addressCountry":"ID"},"priceRange":"$$"},
    {"@type":"LocalBusiness","name":"Buana Raya Express — Cabang Jakarta","telephone":"+62-812-8956-660","image":"${SITE}/assets/img/logo.png","address":{"@type":"PostalAddress","streetAddress":"Jl. Wedana No. 24","addressLocality":"Jakarta","addressRegion":"DKI Jakarta","addressCountry":"ID"},"priceRange":"$$"},
    {"@type":"LocalBusiness","name":"Buana Raya Express — Cabang Surabaya","telephone":"+62-812-1781-2900","image":"${SITE}/assets/img/logo.png","address":{"@type":"PostalAddress","streetAddress":"Jl. Undaan Kulon No. 119","addressLocality":"Surabaya","addressRegion":"Jawa Timur","addressCountry":"ID"},"priceRange":"$$"}`,
  body: `${crumbNav([{ name: "Beranda", path: "/" }, { name: "Cabang" }])}
  <section class="section"><div class="container">
    <div class="narrow prose"><h1>Kantor Cabang Buana Raya Express</h1><p class="lead">Kunjungi atau hubungi cabang terdekat untuk mengirim barang Anda.</p></div>
    <div class="grid grid-3" style="margin-top:20px">
      <div class="branch"><h3>Bandung</h3><address>Jl. Jamika No. 136<br>Bandung, Jawa Barat</address><p>Telp/WA: 0821-30-2000-30</p><a class="btn btn--wa" href="${waLink(WA_BDG, "Halo, saya mau kirim barang dari Bandung")}">Chat WhatsApp</a></div>
      <div class="branch"><h3>Jakarta</h3><address>Jl. Wedana No. 24<br>Jakarta</address><p>Telp: (021) 628-2128 · WA: 0812-8956-660</p><a class="btn btn--wa" href="${waLink(WA_JKT, "Halo, saya mau kirim barang dari Jakarta")}">Chat WhatsApp</a></div>
      <div class="branch"><h3>Surabaya</h3><address>Jl. Undaan Kulon No. 119<br>Surabaya, Jawa Timur</address><p>Telp: (031) 535-1525 · WA: 0812-1781-2900</p><a class="btn btn--wa" href="${waLink(WA_SBY, "Halo, saya mau kirim barang dari Surabaya")}">Chat WhatsApp</a></div>
    </div>
    <div class="narrow prose" style="margin-top:40px"><h2>Lokasi Kantor Pusat (Bandung)</h2><p>Kunjungi langsung kantor pusat kami di Jl. Jamika No. 136, Bandung. Lihat juga <a href="${GMAPS_PLACE}" target="_blank" rel="noopener">profil &amp; ulasan kami di Google Maps</a>.</p></div>
    <div class="map-embed"><iframe src="${GMAPS_EMBED}" title="Lokasi PT Buana Raya Express di Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
  </div></section>
  ${ctaBand()}`,
}));

/* TARIF — tabel tujuan */
const tarifRows = [
  ["Banjarmasin", "Kalimantan Selatan", "10 kg", "kargo-pengiriman-bandung-banjarmasin"],
  ["Banjarbaru", "Kalimantan Selatan", "10 kg", "ongkir-bandung-banjarbaru-murah"],
  ["Balikpapan", "Kalimantan Timur", "10 kg", "kirim-barang-bandung-balikpapan"],
  ["Samarinda", "Kalimantan Timur", "10 kg", "pengiriman-bandung-ke-samarinda"],
  ["Bontang", "Kalimantan Timur", "20 kg", "pengiriman-bandung-bontang"],
  ["Pontianak", "Kalimantan Barat", "10 kg", "pengiriman-paket-bandung-pontianak-murah-cepat"],
  ["Singkawang", "Kalimantan Barat", "20 kg", "pengiriman-bandung-singkawang"],
  ["Palangka Raya", "Kalimantan Tengah", "20 kg", "pengiriman-bandung-palangkaraya"],
  ["Tarakan", "Kalimantan Utara", "20 kg", "pengiriman-bandung-tarakan"],
  ["Makassar", "Sulawesi Selatan", "10 kg", "kirim-paket-bandung-makassar-ongkir-murah"],
  ["Palu", "Sulawesi Tengah", "20 kg", "pengiriman-bandung-palu"],
  ["Kendari", "Sulawesi Tenggara", "20 kg", "pengiriman-bandung-kendari"],
  ["Manado", "Sulawesi Utara", "20 kg", "pengiriman-bandung-manado"],
  ["Gorontalo", "Gorontalo", "25 kg", "pengiriman-bandung-gorontalo"],
  ["Mamuju", "Sulawesi Barat", "25 kg", "pengiriman-bandung-mamuju"],
  ["Denpasar", "Bali", "5 kg", "kiriman-paket-dengan-ongkir-murah-bandung-ke-denpasar-bali"],
  ["Jayapura", "Papua", "30 kg", "kargo-bandung-jayapura"],
  ["Sorong", "Papua Barat Daya", "30 kg", "kargo-bandung-sorong"],
  ["Manokwari", "Papua Barat", "30 kg", "kargo-bandung-manokwari"],
  ["Merauke", "Papua Selatan", "30 kg", "kargo-bandung-merauke"],
];
const tarifTable = `<div class="table-wrap"><table>
  <thead><tr><th>Kota Tujuan</th><th>Provinsi</th><th>Min. Berat</th><th>Tarif</th></tr></thead>
  <tbody>${tarifRows.map(([kota, prov, min, slug]) => `<tr><td><a href="/${slug}/">${kota}</a></td><td>${prov}</td><td>${min}</td><td><a class="btn btn--wa" style="padding:7px 14px;font-size:.85rem" href="${waLink(WA_BDG, `Halo, minta tarif kirim ke ${kota}`)}">Cek WA</a></td></tr>`).join("\n  ")}</tbody>
</table></div>`;

write("tarif", staticPage({
  slug: "tarif", active: "tarif",
  title: "Daftar Tarif Pengiriman Barang, Kargo &amp; Paket",
  description: "Daftar tarif & kota tujuan pengiriman Buana Raya Express ke Kalimantan, Sulawesi, Bali, dan Papua. Ongkir dihitung per berat/volume. Hubungi WA 0821-30-2000-30 untuk harga terbaik.",
  jsonldGraph: breadcrumb([{ name: "Beranda", url: `${SITE}/` }, { name: "Tarif", url: `${SITE}/tarif/` }]),
  body: `${crumbNav([{ name: "Beranda", path: "/" }, { name: "Tarif" }])}
  <section class="section"><div class="container narrow prose">
    <h1>Daftar Tarif Pengiriman</h1>
    <p class="lead">Ongkir Buana Raya Express dihitung berdasarkan berat aktual atau berat volume (mana yang lebih besar) dan kota tujuan. Hubungi kami via WhatsApp untuk harga terbaik dan jadwal terbaru.</p>
    <div class="callout"><strong>Cara hitung berat volume:</strong> panjang (cm) × lebar (cm) × tinggi (cm) ÷ 6000. Bandingkan dengan berat aktual — yang lebih besar dipakai sebagai dasar ongkir.</div>
    ${tarifTable}
    <p>Tujuan Anda tidak tercantum? Kami melayani 200+ kota dan kabupaten. Hubungi WhatsApp <a href="${WA_DEFAULT}">0821-30-2000-30</a> untuk cek tarif kota lain. Lihat juga tarif berdasarkan kota asal: <a href="/tarif-kirim-dari-bandung/">dari Bandung</a> dan <a href="/tarif-kirim-asal-jakarta/">dari Jakarta</a>.</p>
  </div></section>
  ${ctaBand()}`,
}));

/* TARIF dari BANDUNG / JAKARTA — varian */
function tarifAsal(slug, kotaAsal, wa) {
  return staticPage({
    slug, active: "tarif",
    title: `Tarif Kirim ${slug.includes("asal") ? "asal" : "dari"} ${kotaAsal} — Ongkir Pengiriman`,
    description: `Daftar tarif dan kota tujuan pengiriman barang, paket, dan kargo dari ${kotaAsal} ke Kalimantan, Sulawesi, Bali, dan Papua. Hubungi WA untuk harga terbaik.`,
    jsonldGraph: breadcrumb([{ name: "Beranda", url: `${SITE}/` }, { name: "Tarif", url: `${SITE}/tarif/` }, { name: `Tarif dari ${kotaAsal}`, url: `${SITE}/${slug}/` }]),
    body: `${crumbNav([{ name: "Beranda", path: "/" }, { name: "Tarif", path: "/tarif/" }, { name: `Dari ${kotaAsal}` }])}
  <section class="section"><div class="container narrow prose">
    <h1>Tarif Kirim dari ${kotaAsal}</h1>
    <p class="lead">Daftar kota tujuan dan tarif pengiriman barang, paket, dan kargo dari ${kotaAsal} bersama Buana Raya Express.</p>
    <div class="callout"><strong>Cabang ${kotaAsal}</strong> siap melayani pengiriman Anda. Hubungi WhatsApp <a href="${wa}">kami</a> untuk cek ongkir &amp; jadwal.</div>
    ${tarifTable}
    <p>Ongkir dihitung dari berat aktual atau berat volume, mana yang lebih besar. Tujuan tidak tercantum? Hubungi kami untuk 200+ kota tujuan lainnya.</p>
  </div></section>
  ${ctaBand(`Kirim dari ${kotaAsal} Sekarang`, "Dapatkan ongkir terbaik via WhatsApp.", wa)}`,
  });
}
write("tarif-kirim-dari-bandung", tarifAsal("tarif-kirim-dari-bandung", "Bandung", waLink(WA_BDG, "Halo, minta info tarif dari Bandung")));
write("tarif-kirim-asal-jakarta", tarifAsal("tarif-kirim-asal-jakarta", "Jakarta", waLink(WA_JKT, "Halo, minta info tarif dari Jakarta")));

/* SYARAT & KETENTUAN */
write("syarat-dan-ketentuan", staticPage({
  slug: "syarat-dan-ketentuan",
  title: "Syarat &amp; Ketentuan Pengiriman",
  description: "Syarat dan ketentuan layanan pengiriman barang, paket, dan kargo Buana Raya Express: barang yang dilarang, tanggung jawab, packing, dan klaim.",
  jsonldGraph: breadcrumb([{ name: "Beranda", url: `${SITE}/` }, { name: "Syarat & Ketentuan", url: `${SITE}/syarat-dan-ketentuan/` }]),
  body: `${crumbNav([{ name: "Beranda", path: "/" }, { name: "Syarat & Ketentuan" }])}
  <section class="section"><div class="container narrow prose">
    <h1>Syarat &amp; Ketentuan</h1>
    <p class="lead">Mohon perhatikan ketentuan berikut sebelum mengirim barang bersama Buana Raya Express.</p>
    <h2>Barang yang Dilarang</h2>
    <p>Kami tidak menerima pengiriman barang yang dilarang undang-undang, seperti narkotika, bahan peledak, senjata ilegal, serta barang berbahaya lain yang membahayakan keselamatan pengiriman.</p>
    <h2>Pengemasan (Packing)</h2>
    <p>Pengirim wajib memastikan barang dikemas dengan baik. Untuk barang mudah pecah atau bernilai tinggi, kami sarankan menggunakan jasa <a href="/layanan/">packing kayu</a> kami.</p>
    <h2>Perhitungan Ongkir</h2>
    <p>Ongkir dihitung berdasarkan berat aktual atau berat volume (panjang × lebar × tinggi ÷ 6000), mana yang lebih besar.</p>
    <h2>Estimasi Waktu</h2>
    <p>Estimasi waktu pengiriman bersifat perkiraan dan dapat berubah karena jadwal armada, moda pengiriman, cuaca, atau kondisi di luar kendali kami.</p>
    <h2>Klaim</h2>
    <p>Klaim atas kerusakan atau kehilangan mengikuti ketentuan yang berlaku. Hubungi cabang tempat Anda mengirim untuk proses klaim. Untuk pertanyaan, hubungi WhatsApp <a href="${WA_DEFAULT}">0821-30-2000-30</a>.</p>
  </div></section>`,
}));

/* PELUANG BISNIS */
write("peluang-bisnis", staticPage({
  slug: "peluang-bisnis", active: "peluang",
  title: "Peluang Bisnis Keagenan Buana Raya Express",
  description: "Bergabung menjadi agen/mitra Buana Raya Express. Peluang bisnis di bidang ekspedisi dan pengiriman kargo ke Kalimantan, Sulawesi, Bali, dan Papua. Hubungi kami.",
  jsonldGraph: breadcrumb([{ name: "Beranda", url: `${SITE}/` }, { name: "Peluang Bisnis", url: `${SITE}/peluang-bisnis/` }]),
  body: `${crumbNav([{ name: "Beranda", path: "/" }, { name: "Peluang Bisnis" }])}
  <section class="section"><div class="container narrow prose">
    <h1>Peluang Bisnis Bersama Buana Raya Express</h1>
    <p class="lead">Jadilah mitra/agen kami dan kembangkan bisnis di bidang ekspedisi pengiriman barang antar pulau.</p>
    <p>Buana Raya Express membuka peluang kerja sama keagenan bagi Anda yang ingin terjun di bisnis pengiriman barang dan kargo. Dengan jaringan, armada, dan pengalaman kami, Anda dapat memulai usaha ekspedisi dengan lebih mudah.</p>
    <h2>Keuntungan Menjadi Mitra</h2>
    <ul>
      <li>Dukungan jaringan pengiriman ke Kalimantan, Sulawesi, Bali, dan Papua.</li>
      <li>Brand yang sudah dikenal di bidang ekspedisi.</li>
      <li>Sistem kerja sama yang jelas dan saling menguntungkan.</li>
    </ul>
    <div class="callout"><strong>Tertarik bermitra?</strong> Hubungi kami via WhatsApp <a href="${waLink(WA_BDG, "Halo, saya tertarik dengan peluang bisnis keagenan Buana Raya Express")}">0821-30-2000-30</a> untuk informasi lebih lanjut.</div>
  </div></section>
  ${ctaBand("Mulai Bisnis Ekspedisi Anda", "Hubungi kami untuk informasi kemitraan.", waLink(WA_BDG, "Halo, saya tertarik dengan peluang bisnis Buana Raya Express"))}`,
}));

/* BUANA EXPRESS LINK (halaman tautan) */
write("buana-express-link", staticPage({
  slug: "buana-express-link",
  title: "Tautan &amp; Kontak Buana Raya Express",
  description: "Kumpulan tautan penting dan kontak Buana Raya Express: layanan, tarif, cabang, dan WhatsApp untuk pengiriman barang, paket, dan kargo.",
  jsonldGraph: breadcrumb([{ name: "Beranda", url: `${SITE}/` }, { name: "Tautan", url: `${SITE}/buana-express-link/` }]),
  body: `${crumbNav([{ name: "Beranda", path: "/" }, { name: "Tautan" }])}
  <section class="section"><div class="container narrow prose">
    <h1>Tautan &amp; Kontak Buana Raya Express</h1>
    <p class="lead">Akses cepat ke informasi dan kontak kami.</p>
    <div class="grid grid-2" style="margin:20px 0">
      <a class="card card--link" href="/layanan/"><h3>Layanan</h3><p class="muted">Kargo udara, laut, darat, packing.</p></a>
      <a class="card card--link" href="/tarif/"><h3>Daftar Tarif</h3><p class="muted">Kota tujuan & cara hitung ongkir.</p></a>
      <a class="card card--link" href="/cabang/"><h3>Cabang</h3><p class="muted">Bandung, Jakarta, Surabaya.</p></a>
      <a class="card card--link" href="${WA_DEFAULT}"><h3>WhatsApp</h3><p class="muted">Konsultasi & pemesanan langsung.</p></a>
    </div>
  </div></section>`,
}));

/* ============================================================
   FILE SEO / INFRA
   ============================================================ */
const allSlugs = [
  "", "tentang-kami", "layanan", "tarif", "tarif-kirim-dari-bandung", "tarif-kirim-asal-jakarta",
  "cabang", "peluang-bisnis", "syarat-dan-ketentuan", "buana-express-link",
  "kota-dan-kabupaten-di-pulau-kalimantan", "kabupaten-dan-kota-di-pulau-sulawesi", "kota-dan-kabupaten-di-pulau-papua",
  "ekspedisi-kiriman-kargo-barang-paket-dari-bandung", "ekspedisi-surabaya-kiriman-kargo-barang-paket-dari-surabaya",
  "pengiriman-ekspedisi-paket-kargo-jakarta",
  ...routes.map((r) => r.slug),
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSlugs.map((s) => `  <url><loc>${SITE}/${s ? s + "/" : ""}</loc><lastmod>${today}</lastmod><changefreq>${s === "" ? "weekly" : "monthly"}</changefreq><priority>${s === "" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;
writeFileSync("sitemap.xml", sitemap);
console.log("✓ sitemap.xml");

writeFileSync("robots.txt", `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
console.log("✓ robots.txt");

writeFileSync("_redirects", `# Cloudflare Pages redirects — Buana Raya Express
# Kanonikalisasi www -> non-www (301 permanen)
https://www.buanaraya.com/*  https://buanaraya.com/:splat  301!

# Sisa URL WordPress lama yang mungkin terindeks
/feed/                       /                              301
/feed                        /                              301
/wp-login.php                /                              301
/wp-admin/*                  /                              301
# Halaman attachment lama -> halaman induk terdekat (sesuaikan bila perlu)
/?p=*                        /                              301
`);
console.log("✓ _redirects");

writeFileSync("_headers", `# Cloudflare Pages headers — Buana Raya Express
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
`);
console.log("✓ _headers");

write("404", shell({
  slug: "404",
  title: "Halaman Tidak Ditemukan (404)",
  description: "Halaman yang Anda cari tidak ditemukan. Kembali ke beranda Buana Raya Express.",
  body: `<section class="section center"><div class="container narrow prose">
    <h1>404 — Halaman Tidak Ditemukan</h1>
    <p class="lead">Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.</p>
    <p><a class="btn btn--primary btn--lg" href="/">Kembali ke Beranda</a></p>
    <p style="margin-top:20px">Atau hubungi kami via WhatsApp <a href="${WA_DEFAULT}">0821-30-2000-30</a>.</p>
  </div></section>`,
}));
// 404.html harus di root (bukan folder)
import { renameSync, rmSync } from "node:fs";
renameSync("404/index.html", "404.html");
rmSync("404", { recursive: true, force: true });
console.log("✓ 404.html");

console.log(`\nSelesai. Total halaman: ${allSlugs.length} + 404.`);

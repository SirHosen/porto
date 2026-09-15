# Phase 2 — Section waypoints integrated

Status: **Gate 2 menunggu konfirmasi Hosen.** Phase 3 belum dimulai.
Preview lokal: [Midnight Panel](http://127.0.0.1:4175/porto/).
Belum di-push atau di-deploy; GitHub Pages tetap pada versi sebelumnya.

## Hasil

- Satu jalur kamera kontinu: Hero → About → 9 proyek → Skills → Contact.
  Kamera menempuh 456 unit pada sumbu Z, dengan lengkungan X/Y. Tidak ada camera cut.
- Panel proyek adalah teks DOM aksesibel yang diproyeksikan dari anchor 3D nyata,
  bersama frame mesh pada posisi yang sama. Ukuran dan posisi mengikuti kamera,
  bukan persentase scroll CSS. Ilustrasi geometris adalah emblem, bukan screenshot produk.
- Identitas Midnight Panel dipertahankan: ink/paper/vermilion dan tiga font lokal.
  Skill frontend-design membantu menentukan hirarki tipografi, ritme panel manga,
  serta mengoreksi kontras setelah inspeksi screenshot.
- Sembilan proyek lama tetap ada, termasuk arsip privat. Tidak ada tautan mati yang
  ditambahkan kembali atau detail sensitif yang direkonstruksi.
- 45 skill, 6 kategori, 6 deskripsi, nama dan warna kategori, serta wording UI Skills
  tetap sama. “CHAPTER 02” dan “1 connected projects” sengaja tidak diperbaiki.
- Perubahan copy proyek hanya pada portofolio ini sendiri: satu tagline dan tech tags
  kini menyebut implementasi Next.js/R3F/GSAP yang benar-benar ada.
- Mode reduced-motion, tanpa JavaScript, tanpa WebGL, dan context loss menampilkan
  semua konten sebagai halaman statis. Semua domain Skills terbuka pada mode statis.
- Tidak ada dependency mayor baru, model eksternal, postprocessing atau Draco asset;
  seluruh geometri masih prosedural. Prototipe /prototype/ tetap tersedia.

## Screenshot setiap waypoint

Desktop: 1440 × 900. Mobile: viewport 390 × 844, screenshot DPR 2.
Ini emulasi Chrome, bukan pengujian perangkat fisik.

[Galeri visual lengkap](evidence/phase-2/index.html)

| # | Waypoint | Desktop | Mobile |
| --- | --- | --- | --- |
| 01 | Hero | [Desktop](evidence/phase-2/desktop-00-hero.png) | [Mobile](evidence/phase-2/mobile-00-hero.png) |
| 02 | About | [Desktop](evidence/phase-2/desktop-01-about.png) | [Mobile](evidence/phase-2/mobile-01-about.png) |
| 03 | NESTfetch | [Desktop](evidence/phase-2/desktop-02-p-nestfetch.png) | [Mobile](evidence/phase-2/mobile-02-p-nestfetch.png) |
| 04 | GameNest | [Desktop](evidence/phase-2/desktop-03-p-gamenest.png) | [Mobile](evidence/phase-2/mobile-03-p-gamenest.png) |
| 05 | Spinwheel AI Lab | [Desktop](evidence/phase-2/desktop-04-p-spin.png) | [Mobile](evidence/phase-2/mobile-04-p-spin.png) |
| 06 | Sonorus | [Desktop](evidence/phase-2/desktop-05-p-sonorus.png) | [Mobile](evidence/phase-2/mobile-05-p-sonorus.png) |
| 07 | SonicCipher | [Desktop](evidence/phase-2/desktop-06-p-sonic.png) | [Mobile](evidence/phase-2/mobile-06-p-sonic.png) |
| 08 | Adaptive Form QA | [Desktop](evidence/phase-2/desktop-07-p-formqa.png) | [Mobile](evidence/phase-2/mobile-07-p-formqa.png) |
| 09 | Browser Session Reliability Lab | [Desktop](evidence/phase-2/desktop-08-p-sessionlab.png) | [Mobile](evidence/phase-2/mobile-08-p-sessionlab.png) |
| 10 | This System / Midnight Panel | [Desktop](evidence/phase-2/desktop-09-p-portfolio.png) | [Mobile](evidence/phase-2/mobile-09-p-portfolio.png) |
| 11 | Aqila Atelier | [Desktop](evidence/phase-2/desktop-10-p-aqila.png) | [Mobile](evidence/phase-2/mobile-10-p-aqila.png) |
| 12 | Skills | [Desktop](evidence/phase-2/desktop-11-arsenal.png) | [Mobile](evidence/phase-2/mobile-11-arsenal.png) |
| 13 | Contact | [Desktop](evidence/phase-2/desktop-12-contact.png) | [Mobile](evidence/phase-2/mobile-12-contact.png) |

Semua state Skills:
[LANG](evidence/phase-2/skills-lang.png),
[WEB](evidence/phase-2/skills-web.png),
[AI](evidence/phase-2/skills-ai.png),
[AUTO](evidence/phase-2/skills-auto.png),
[SYS](evidence/phase-2/skills-sys.png),
[ENG](evidence/phase-2/skills-eng.png).

Fallback lengkap:
[Reduced motion](evidence/phase-2/fallback-reduced.png),
[No JavaScript](evidence/phase-2/fallback-no-js.png),
[No WebGL](evidence/phase-2/fallback-no-webgl.png).

## Verifikasi

- Production static export dan TypeScript: lulus.
- Snapshot: 45 skill, enam deskripsi, dan semua file aplikasi/aset baseline lama
  tetap tidak berubah. Data migrasi juga dibandingkan langsung dengan snapshot.
- Integrasi: 10 kelompok tes lulus; 13 waypoint, semua proyek, enam domain, navigasi,
  perspektif reversibel, drag/reset crystal, mode statis, context loss, no-JS,
  no-WebGL dan sentuhan native ter-emulasi.
- Layout 320/390/768/1440 px, termasuk tinggi 568 px. Panel yang lebih tinggi dari
  viewport pendek dapat digulir secara native; kontennya tidak dipotong permanen.
- Tujuh pemeriksaan axe A/AA tidak menemukan pelanggaran pada state yang diuji.
  Ini bukan sertifikasi aksesibilitas menyeluruh atau QA perangkat fisik.
- Regresi prototipe Phase 1: 13 kelompok tes lulus.
- 2.002 sampel kamera identik dengan posisi/tangen Three, termasuk endpoint.
  Vektor sampel tangen dipakai ulang untuk mengurangi alokasi per frame.
- Tidak ada uncaught page errors atau asset request gagal pada tes.

## FPS integrasi — bukan Lighthouse

Host: Linux, Intel i3-1115G4 (2 core / 4 thread), Mesa Intel UHD (TGL GT2).
Browser: 153.0.8010.36. Canvas DPR 1, mobile device scale 2, CPU slowdown 4×.
Setiap run adalah traversal linear 12 detik pada build statis produksi.
GPU hardware digunakan, bukan SwiftShader. Screenshot/trace dijalankan terpisah
dari benchmark final.

| Profil | FPS rata-rata | p95 frame | Frame terlama | >33,4 ms |
| --- | --- | --- | --- | --- |
| Desktop | 60.01 | 16.9 ms | 17.6 ms | 0 |
| Mobile 4× / 1 | 60.01 | 17.4 ms | 19.0 ms | 0 |
| Mobile 4× / 2 | 60.01 | 17.3 ms | 18.2 ms | 0 |
| Mobile 4× / 3 | 60.01 | 17.9 ms | 35.5 ms | 1 |

Hasil final lulus definisi nominal-60 yang sama dengan Phase 1: mean ≥59 fps,
p95 ≤18,5 ms, dan interval >33,4 ms ≤1%. **Ini bukan klaim 60 fps tanpa satu pun
frame terlambat.** Run mobile ketiga masih mencatat satu interval 35,5 ms.
Interval yang diukur adalah callback render, bukan timestamp presentasi layar.

Pemeriksaan awal gagal pada p95 mobile 18,8/18,7 ms, dengan satu frame 41,8 ms.
Menghentikan pembaruan matriks frame yang tidak terlihat dan penulisan atribut
DOM per-frame yang tidak diperlukan memperbaiki frame-time. Tidak ada efek yang
ditambahkan untuk menutupi masalah atau batas tes yang dilonggarkan.

Lonjakan run ketiga berulang pada beberapa run. Trace diagnostik terpisah
menunjukkan MajorGC 37,145 ms bertepatan dengan lonjakan 43,3 ms dalam run dengan
overhead tracing. Ini bukti penyebab pada run diagnostik, bukan alasan untuk
menghapus sampel lambat dari benchmark. Reuse vektor mengurangi alokasi, tetapi
tidak menghilangkan seluruh jeda GC. Klaim “locked 60” belum layak.

[Bukti ringkas + hash sumber](phase-2-evidence.json),
[interval final lengkap](evidence/phase-2/benchmark.json),
[benchmark awal](evidence/phase-2/benchmark-before-frame-work.json),
[trace Chrome terkompresi](evidence/phase-2/trace.json.gz).

## Batas tahap / konten yang belum tersedia

- Tidak ada Lighthouse atau production score pada tahap ini; Phase 4 belum dibuka.
- Safari iPhone, Android fisik, dan Firefox belum diuji; itu Gate 5.
- Deployment dan perubahan pipeline GitHub Pages tetap menunggu Phase 6.
- [NEED CONTENT] Proyek tambahan dari sesi chat yang tidak tersedia di thread ini.
  Tidak ada entri rekaan untuk mengisinya. Sembilan proyek terverifikasi sudah masuk.
- Nama HOSEA dan kontak GitHub dipertahankan dari sumber. Email baru tidak direka.
- Gate 2 hanya meminta review integrasi dan screenshot ini. Jeda GC yang tercatat
  tetap menjadi catatan terbuka untuk pass performa; jangan menyebut hasil ini
  bukti 60 fps tanpa jeda di semua perangkat.

## Menjalankan ulang

```sh
npm run build
npm run preview
# Terminal kedua
npm run test:content
npm run test:camera-sampling
npm run test:portfolio
PORTFOLIO_CAMERA_OUTPUT=test-results/phase-2/prototype-regression npm run test:prototype
PORTFOLIO_PROTOTYPE_URL=http://127.0.0.1:4175/porto/ PORTFOLIO_CAMERA_OUTPUT=test-results/phase-2 npm run test:camera-benchmark
```

Gate berikutnya tidak dikerjakan tanpa konfirmasi eksplisit.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Tim inspeksi lapangan, auditor teknik sipil, dan structural engineer yang memeriksa, mengukur, dan mendokumentasikan keretakan infrastruktur beton (jembatan, pilar gedung, dinding bendungan, jalan layang). Pengguna membutuhkan alat audit cepat di lapangan yang menghasilkan data teknis kuantitatif dan bukti visual yang dapat dipertanggungjawabkan kepada pemilik aset atau regulator.

## Product Purpose

Menyediakan platform pemantauan, analisis otomatis, dan audit keretakan struktur beton berbasis kecerdasan buatan (AI Vision ResNet-18 Grid Slicing) untuk menggantikan inspeksi visual manual yang subjektif. Sukses berarti inspektor dapat mengunggah foto struktur di lapangan, mendapatkan analisis rasio petak retak dan tingkat keparahan struktur secara instan, serta mengunduh dokumen laporan audit PDF resmi bertanda tangan dalam hitungan detik.

## Positioning

Platform inspeksi beton presisi tinggi yang menggabungkan dekomposisi spasial matriks petak 6x6 (36 petak komputasi) dengan deep learning ResNet-18, rasio sebaran kerusakan akurat, indikator spektrum keparahan dinamis (Aman, Ringan, Sedang, Kritis), komparasi slider interaktif citra asli vs AI, pemetaan GIS Leaflet, dan auto-generasi laporan PDF standar teknik sipil.

## Operating Context

- **Lingkungan Kerja:** Lapangan proyek konstruksi, inspeksi jembatan, pilar basement gedung tinggi, dan bendungan dengan kondisi pencahayaan dan tekstur beton bervariasi.
- **Perangkat:** Desktop dan laptop inspektur di posko/kantor teknis, serta tablet/mobile browser saat berada di lapangan.
- **Artefak Output:** Laporan audit teknis format PDF resmi bertanda tangan inspektor & structural engineer penanggung jawab untuk arsip kepatuhan struktur.

## Capabilities and Constraints

- **Backend AI Engine:** FastAPI, PyTorch ResNet-18 (`best_crack_detector.pth`) dengan Adaptive Heuristic fallback computer vision (Sobel gradients & dynamic luminance thresholding).
- **Frontend Stack:** React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet GIS map.
- **Grid Slicing Standard:** Matriks 6x6 (36 petak koordinat [r,c]), klasifikasi biner crack vs normal per petak dengan persentase keyakinan AI.
- **Skala Tingkat Keparahan:**
  - Aman (0.0% retak / 0 petak)
  - Ringan (> 0% s.d. 10.0% / 1-3 petak)
  - Sedang (> 10.0% s.d. 25.0% / 4-9 petak)
  - Kritis (> 25.0% / ≥ 10 petak)
- **Pelaporan:** Generator PDF ReportLab otomatis dengan metrik audit, foto berdampingan, tabel rincian petak, dan kolom pengesahan.

## Brand Commitments

- **Nama Platform:** Crack Inspection Platform (Sistem Audit Retak Struktur Beton AI ResNet-18).
- **Tone & Voice:** Presisi, otoritatif, teknikal teknik sipil, modern, dan profesional.
- **Warna & Visual:** Dark Slate mode premium (`#0f172a`, `#1e293b`), aksen biru teknik (`#2563eb`, `#38bdf8`), indikator warna risiko standar keselamatan (Emerald, Yellow, Amber, Rose).

## Evidence on Hand

- Bobot model AI terlatih: `backend/models_weight/best_crack_detector.pth` (ResNet-18 PyTorch binary ~44.8 MB).
- Lokasi infrastruktur terdaftar: Jembatan Suramadu, Menara Astra, Bendungan Jatiluhur, Jembatan Pasupati.
- Data inspeksi sampel terverifikasi dengan foto riil/sintetis resolusi tinggi, hasil pemindaian petak, dan arsip PDF laporan.

## Product Principles

1. **Integritas Metrik Teknis:** Persentase kerusakan dan status tingkat keparahan harus berbasis kalkulasi matematis petak yang jelas dan transparan, bukan perkiraan acak.
2. **Keterbacaan Lapangan Kritis:** Antarmuka harus menyajikan data esensial (rasio retak, lokasi, tingkat bahaya) dalam waktu kurang dari 3 detik bagi inspektor.
3. **Audit Trails & Akuntabilitas:** Setiap hasil pemindaian tersimpan permanen bersama foto asli, koordinat petak, catatan inspektor, dan dokumen PDF resmi yang siap diaudit.
4. **Responsif & Siap Operasional:** Sistem bekerja mulus baik dengan akselerasi GPU maupun CPU standar dengan fallback algoritma visi komputer adaptif.

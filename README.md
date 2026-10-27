# Crack Inspection Platform (AI ResNet-18 Grid Slicing)

Platform pemantauan dan audit keretakan struktur beton infrastruktur (jembatan, gedung, bendungan) berbasis deep learning **ResNet-18 Grid Slicing** dengan FastAPI dan React + Tailwind CSS.

---

## 📁 Struktur Proyek

```
crack_inspection_platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py             # Login, register, JWT token
│   │   │   ├── inspections.py      # Upload foto, run AI scan, ambil riwayat
│   │   │   └── locations.py        # CRUD master data gedung/jembatan
│   │   ├── core/
│   │   │   ├── config.py           # Database URL, secret key, path storage
│   │   │   └── database.py         # Inisialisasi engine SQLAlchemy
│   │   ├── models/
│   │   │   └── schema.py           # Tabel-tabel ORM database & skema Pydantic
│   │   ├── services/
│   │   │   ├── ai_scanner.py       # Logika Grid Slicing ResNet-18 (6x6 petak)
│   │   │   └── pdf_generator.py    # Pembuat dokumen PDF resmi (ReportLab)
│   │   └── main.py                 # File entry point server & auto-seeder
│   ├── models_weight/
│   │   └── best_crack_detector.pth # Bobot model AI ResNet-18
│   ├── storage/                    # Tempat penyimpanan berkas gambar & laporan
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Header navigasi & status AI
    │   │   ├── StatCard.jsx        # Kotak metrik angka
    │   │   ├── ImageCompare.jsx    # Slider komparasi foto interaktif
    │   │   └── InspectionMap.jsx   # Komponen peta Leaflet GIS
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Halaman ringkasan statistik & peta
    │   │   ├── NewInspection.jsx   # Form upload & pemicu scan AI
    │   │   ├── InspectionDetail.jsx# Detail foto berkotak merah & data petak
    │   │   └── HistoryList.jsx     # Tabel daftar seluruh riwayat inspeksi
    │   ├── services/
    │   │   └── api.js              # Instance Axios terhubung ke FastAPI
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

---

## 🚀 Cara Menjalankan

### 1. Backend (FastAPI)
```bash
cd backend
py -m pip install -r requirements.txt
py -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Dokumentasi Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Berkas Storage: [http://127.0.0.1:8000/storage/](http://127.0.0.1:8000/storage/)
- Akun Default Seeder:
  - **Username:** `admin`
  - **Password:** `admin123`

### 2. Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
- Akses UI di browser: [http://localhost:5173](http://localhost:5173)

---

## ⚡ Fitur Utama
1. **ResNet-18 Grid Slicing**: Memecah foto resolusi tinggi ke dalam matriks petak (6x6 = 36 petak), mendeteksi retak pada tiap petak dengan bounding box merah dan keyakinan AI.
2. **Interactive Image Slider**: Membandingkan citra asli dengan citra beranotasi retak secara fleksibel (slider dan mode berdampingan).
3. **Peta GIS Interaktif (Leaflet)**: Pemetaan titik inspeksi dengan pin warna status risiko (*Aman, Ringan, Sedang, Kritis*).
4. **Laporan Resmi PDF**: Ekspor dokumen audit teknik sipil otomatis via ReportLab dilengkapi metrik, komparasi visual, tabel temuan petak, dan tanda tangan pengesahan.

# SIPENA MI PERSONAL
### Sistem Informasi Perangkat Ajar Madrasah Ibtidaiyah
**Edisi Personal Guru MI • Kurikulum Merdeka (KMA 450 Tahun 2024)**

SIPENA MI PERSONAL adalah aplikasi web modern yang dirancang khusus untuk membantu guru Madrasah Ibtidaiyah (MI) di seluruh Indonesia menyusun, mengelola, mengedit, dan mengunduh seluruh perangkat ajar secara otomatis dan berkesinambungan (pipeline cascading) dengan bantuan Google Gemini AI dan database Supabase PostgreSQL.

---

## 🌟 Fitur Utama

1. **30 Jenis Perangkat Ajar Otomatis**:
   - **Perencanaan & Regulasi**: Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Alur TP (ATP), Program Tahunan (PROTA), Program Semester (PROMES), Kriteria KKTP, Modul Ajar / RPP, dan Pemetaan Materi.
   - **Asesmen & Evaluasi**: Asesmen Diagnostik, Asesmen Formatif, Asesmen Sumatif (Lingkup Materi/SAS), Kisi-kisi Soal, Bank Soal, Soal Pilihan Ganda (PG), PG Kompleks (Model AKMI), Benar/Salah, Menjodohkan, Isian Singkat, Uraian HOTS, Kunci Jawaban, dan Rubrik Penilaian.
   - **Bahan Ajar & Siswa**: Lembar Kerja Siswa (LKPD), Materi per Bab, dan Ringkasan Materi.
   - **Administrasi Guru**: Jurnal Mengajar Harian, Agenda Mengajar, Rekap Nilai Siswa, Program Remedial, Program Pengayaan, dan Laporan Belajar.

2. **Hubungan Antar Dokumen (Cascading Pipeline)**:
   - Alur data mengalir otomatis: `CP → TP → ATP → PROTA → PROMES → Modul Ajar → Asesmen → LKPD → Jurnal`.
   - Data materi, kompetensi, dan alokasi waktu tersambung langsung dari dokumen sebelumnya sehingga guru tidak perlu mengetik ulang informasi yang sama.
   - Deteksi otomatis perubahan dokumen induk untuk menyelaraskan dokumen turunan.

3. **Grounding Kurikulum & Anti-Halusinasi AI**:
   - Terintegrasi dengan dokumen resmi regulasi Kemenag KMA 450 Tahun 2024 dan BSKAP 032.
   - Guru dapat mengunggah referensi CP dan buku teks sendiri. Jika topik belum memiliki CP resmi terdaftar, sistem memberikan penanda verifikasi otomatis.

4. **Editor Dokumen Profesional & Ekspor Word/PDF**:
   - Editor kaya fitur: Bold, italic, underline, heading, daftar bernomor, bullet list, penyisipan tabel matriks, autosave otomatis setiap 20 detik, dan konfirmasi unsaved changes.
   - **Ekspor Asli Microsoft Word (.docx)**: Dokumen Word lengkap dengan Kop Surat madrasah, tabel bergaris, margin A4/F4, dan tanda tangan kepala madrasah serta guru.
   - **Cetak / Ekspor PDF Resmi**: Layout ramah cetak A4 dengan titimangsa Kemenag.

5. **Keamanan & Arsitektur Cloud (Supabase PostgreSQL + RLS)**:
   - 28 tabel skema relasional dengan Row Level Security (RLS) berbasis `auth.uid() = user_id`.
   - Mode Hybrid: Bekerja 100% mandiri secara offline (Local Storage) dan dapat disinkronkan ke Supabase Cloud kapan saja.
   - Kunci rahasia API Gemini dan Service Role tersimpan aman di server, tidak pernah terekspos ke browser.

---

## 🚀 Teknologi yang Digunakan

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend / Proxy**: Node.js, Express, `tsx`.
- **Kecerdasan Buatan**: `@google/genai` (Google Gemini 3.8 Flash).
- **Database & Auth**: Supabase PostgreSQL, Supabase Authentication, Row Level Security.
- **Dokumen Generator**: `docx` library (Word .docx generation) & native CSS print engine (PDF).

---

## 🛠️ Instalasi & Menjalankan di Komputer Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/username/sipena-mi-personal.git
cd sipena-mi-personal
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi variabel yang diperlukan pada file `.env`:
```env
# Google Gemini API Key (diperoleh dari Google AI Studio)
GEMINI_API_KEY="AIzaSy..."

# Supabase Cloud (diperoleh dari Project Settings -> API)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka peramban pada alamat `http://localhost:3000`.

---

## 🗄️ Setup Database Supabase

1. Buat proyek baru di [Supabase](https://supabase.com).
2. Buka menu **SQL Editor** pada dashboard Supabase Anda.
3. Buka file `supabase/schema.sql` pada proyek ini, salin seluruh kodenya, lalu tempelkan dan jalankan (Run) di SQL Editor.
4. Skrip tersebut akan otomatis membuat 28 tabel lengkap beserta relasi *Foreign Key* dan kebijakan *Row Level Security (RLS)*.
5. Salin **Project URL** dan **Anon Key** dari menu *Project Settings -> API* ke file `.env` atau menu Pengaturan di aplikasi.

---

## ☁️ Panduan Deployment ke Cloudflare Pages

Aplikasi ini siap di-deploy ke Cloudflare Pages dengan konfigurasi berikut:

### Langkah-langkah:
1. Hubungkan repositori GitHub Anda ke **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Pilih repositori `sipena-mi-personal`.
3. Pada bagian **Build settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (kosongkan / root)
4. Pada bagian **Environment variables**:
   - Tambahkan `VITE_SUPABASE_URL` = Nilai URL Supabase Anda.
   - Tambahkan `VITE_SUPABASE_ANON_KEY` = Kunci Anon Supabase Anda.
   - Tambahkan `GEMINI_API_KEY` = Kunci API Google Gemini Anda (atau gunakan Cloudflare Pages Functions jika menggunakan server-side endpoint).
5. Klik **Save and Deploy**.

---

## 📂 Struktur Folder Proyek

```
/
├── server.ts                       # Backend Express proxy & Gemini API endpoints
├── supabase/
│   └── schema.sql                  # Skrip 28 tabel PostgreSQL + RLS Supabase
├── src/
│   ├── components/
│   │   ├── common/                 # KopMadrasah, StatCard, SignatureSection
│   │   ├── layout/                 # Header, Sidebar, MobileNav
│   │   └── modals/                 # AIDocumentModal, DocumentEditorModal, DocumentPreviewModal, PanduanModal
│   ├── context/
│   │   └── AppContext.tsx          # State management global, auth, & AI helpers
│   ├── data/
│   │   └── initialData.ts          # Data standar awal MI (KMA 450/2024)
│   ├── lib/
│   │   ├── documentRelations.ts    # Hubungan cascading 30 dokumen & pipeline
│   │   ├── exportDocument.ts       # Generator Microsoft Word (.docx) & PDF
│   │   └── supabaseClient.ts       # Inisialisasi Supabase client & koneksi
│   ├── pages/                      # 29 halaman modul aplikasi MI
│   │   ├── DashboardPage.tsx
│   │   ├── DokumenSayaPage.tsx
│   │   ├── ModulAjarPage.tsx
│   │   ├── ReferensiKurikulumPage.tsx
│   │   ├── PengaturanPage.tsx
│   │   └── ...
│   ├── types/                      # Definisi tipe TypeScript
│   ├── App.tsx                     # Routing halaman dan notifikasi
│   └── main.tsx                    # Entry point React
├── package.json
└── README.md
```

---

## 📄 Lisensi
Hak Cipta © 2026 SIPENA MI PERSONAL. Dibuat untuk memajukan pendidikan madrasah di Indonesia.

import {
  MadrasahProfile,
  TeacherProfile,
  SchoolYear,
  Semester,
  Curriculum,
  ClassGrade,
  Subject,
  DocumentItem,
  JournalEntry,
  AgendaEntry,
  StudentScore,
  QuestionItem,
  LkpdItem,
  RemedialItem,
  CurriculumReference,
} from '../types';

export const initialMadrasahProfile: MadrasahProfile = {
  namaMadrasah: 'Madrasah Ibtidaiyah Swasta (MIS) Nurul Huda',
  npsn: '60728192',
  nsm: '111232010045',
  jenjang: 'MI',
  status: 'Swasta',
  akreditasi: 'A',
  alamat: 'Jl. KH. Hasyim Asy\'ari No. 18, RT 03 / RW 02',
  desaKelurahan: 'Mekarsari',
  kecamatan: 'Cibadak',
  kabupatenKota: 'Kabupaten Sukabumi',
  provinsi: 'Jawa Barat',
  kodePos: '43351',
  email: 'misnurulhuda.official@kemenag.go.id',
  telepon: '(0266) 531890',
  website: 'https://misnurulhuda.sch.id',
  namaKepala: 'H. Muhammad Yusuf, M.Pd.',
  nipKepala: '197508142002121004',
  logoUrl: '',
  kementerian: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
};

export const initialTeacherProfile: TeacherProfile = {
  namaLengkap: 'Ahmad Fauzi',
  gelarDepan: 'Ust.',
  gelarBelakang: 'S.Pd.I',
  nipNiy: '198804152019031008',
  nuptk: '4537766667200032',
  jabatan: 'Guru Kelas / Guru PAI MI',
  pangkatGolongan: 'Penata Muda Tk. I (III/b)',
  jenisKelamin: 'L',
  pendidikanTerakhir: 'S1 Pendidikan Agama Islam (PAI)',
  jurusan: 'Fakultas Tarbiyah dan Keguruan',
  email: 'ahmadfauzi.guru@kemenag.go.id',
  noHp: '0812-8899-7721',
  alamat: 'Komplek Griya Asri Blok C4 No. 12, Cibadak, Sukabumi',
  fotoUrl: '',
  mapelDiampu: ['Akidah Akhlak', 'Al-Qur\'an Hadis', 'Fikih', 'IPAS'],
  kelasDiampu: [1, 2, 4],
};

export const initialSchoolYears: SchoolYear[] = [
  {
    id: 'sy-2024-2025',
    tahun: '2024/2025',
    statusAktif: true,
    tanggalMulai: '2024-07-15',
    tanggalSelesai: '2025-06-21',
    keterangan: 'Tahun Pelajaran Berjalan (Implementasi Mandiri Berbagi KMA 450/2024)',
  },
  {
    id: 'sy-2023-2024',
    tahun: '2023/2024',
    statusAktif: false,
    tanggalMulai: '2023-07-17',
    tanggalSelesai: '2024-06-22',
    keterangan: 'Tahun Pelajaran Lalu (Arsip)',
  },
  {
    id: 'sy-2025-2026',
    tahun: '2025/2026',
    statusAktif: false,
    tanggalMulai: '2025-07-14',
    tanggalSelesai: '2026-06-20',
    keterangan: 'Tahun Pelajaran Mendatang',
  },
];

export const initialSemesters: Semester[] = [
  {
    id: 'sem-1-2024',
    tahunId: 'sy-2024-2025',
    semester: 'Ganjil',
    nomor: 1,
    statusAktif: true,
    pekanEfektif: 19,
    pekanTidakEfektif: 5,
    totalPekan: 24,
    tanggalBagiRapor: '2024-12-21',
  },
  {
    id: 'sem-2-2024',
    tahunId: 'sy-2024-2025',
    semester: 'Genap',
    nomor: 2,
    statusAktif: false,
    pekanEfektif: 18,
    pekanTidakEfektif: 6,
    totalPekan: 24,
    tanggalBagiRapor: '2025-06-21',
  },
];

export const initialCurriculums: Curriculum[] = [
  {
    id: 'cur-merdeka-kma450',
    nama: 'Kurikulum Merdeka Madrasah',
    kode: 'KM-MI-2024',
    regulasi: 'KMA Nomor 450 Tahun 2024 tentang Pedoman Implementasi Kurikulum pada Madrasah',
    statusAktif: true,
    fase: [
      { fase: 'A', kelas: [1, 2], deskripsi: 'Fondasi awal literasi, numerasi & pembiasaan akhlak mulia' },
      { fase: 'B', kelas: [3, 4], deskripsi: 'Penguatan konsep, ibadah amaliah, dan eksplorasi lingkungan sekitar' },
      { fase: 'C', kelas: [5, 6], deskripsi: 'Pemantapan pemikiran kritis, akidah kokoh, dan kesiapan jenjang MTs' },
    ],
  },
  {
    id: 'cur-2013-mi',
    nama: 'Kurikulum 2013 MI (KMA 183 & 184)',
    kode: 'K13-MI',
    regulasi: 'KMA Nomor 183 dan 184 Tahun 2019',
    statusAktif: false,
    fase: [
      { fase: 'A', kelas: [1, 2], deskripsi: 'Kelas Awal K13' },
      { fase: 'B', kelas: [3, 4], deskripsi: 'Kelas Menengah K13' },
      { fase: 'C', kelas: [5, 6], deskripsi: 'Kelas Tinggi K13' },
    ],
  },
];

export const initialClasses: ClassGrade[] = [
  { id: 'cls-1a', tingkat: 1, fase: 'A', namaKelas: 'Kelas 1-A (Abu Bakar)', rombel: 'A', jumlahSiswaL: 14, jumlahSiswaP: 14, waliKelas: 'Siti Aminah, S.Pd.', ruang: 'Gedung A R.01' },
  { id: 'cls-1b', tingkat: 1, fase: 'A', namaKelas: 'Kelas 1-B (Umar bin Khattab)', rombel: 'B', jumlahSiswaL: 13, jumlahSiswaP: 15, waliKelas: 'Fatimah Az-Zahra, S.Pd.I', ruang: 'Gedung A R.02' },
  { id: 'cls-2a', tingkat: 2, fase: 'A', namaKelas: 'Kelas 2-A (Utsman bin Affan)', rombel: 'A', jumlahSiswaL: 15, jumlahSiswaP: 13, waliKelas: 'Nur Hasanah, S.Pd.', ruang: 'Gedung A R.03' },
  { id: 'cls-3a', tingkat: 3, fase: 'B', namaKelas: 'Kelas 3-A (Ali bin Abi Thalib)', rombel: 'A', jumlahSiswaL: 16, jumlahSiswaP: 12, waliKelas: 'Drs. Subhan', ruang: 'Gedung B R.01' },
  { id: 'cls-4a', tingkat: 4, fase: 'B', namaKelas: 'Kelas 4-A (Bilal bin Rabah)', rombel: 'A', jumlahSiswaL: 15, jumlahSiswaP: 15, waliKelas: 'Ahmad Fauzi, S.Pd.I', ruang: 'Gedung B R.02' },
  { id: 'cls-5a', tingkat: 5, fase: 'C', namaKelas: 'Kelas 5-A (Khalid bin Walid)', rombel: 'A', jumlahSiswaL: 14, jumlahSiswaP: 16, waliKelas: 'M. Ridwan, M.Pd.', ruang: 'Gedung C R.01' },
  { id: 'cls-6a', tingkat: 6, fase: 'C', namaKelas: 'Kelas 6-A (Thalhah bin Ubaidillah)', rombel: 'A', jumlahSiswaL: 15, jumlahSiswaP: 14, waliKelas: 'Hj. Rohanah, S.Ag.', ruang: 'Gedung C R.02' },
];

export const initialSubjects: Subject[] = [
  { id: 'sub-1', kode: 'QH', nama: 'Al-Qur\'an Hadis', kategori: 'Pendidikan Agama Islam', jpPerMinggu: 2, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Membaca, menulis, memahami huruf hijaiyah, surat pendek pilihan, dan hadis adab.' },
  { id: 'sub-2', kode: 'AA', nama: 'Akidah Akhlak', kategori: 'Pendidikan Agama Islam', jpPerMinggu: 2, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Penanaman akidah Islam, asmaul husna, kalimat thayyibah, dan adab islami.' },
  { id: 'sub-3', kode: 'FIQ', nama: 'Fikih', kategori: 'Pendidikan Agama Islam', jpPerMinggu: 2, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Thaharah, shalat fardhu, shalat sunnah, adzan & iqomah, serta ibadah harian.' },
  { id: 'sub-4', kode: 'SKI', nama: 'Sejarah Kebudayaan Islam', kategori: 'Pendidikan Agama Islam', jpPerMinggu: 2, kelas: [3, 4, 5, 6], ringkasan: 'Kisah dakwah Rasulullah SAW, Khulafaur Rasyidin, dan tokoh penyebar Islam nusantara.' },
  { id: 'sub-5', kode: 'BAR', nama: 'Bahasa Arab', kategori: 'Bahasa Arab', jpPerMinggu: 2, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Keterampilan menyimak, berbicara, membaca, dan menulis kosakata Arab dasar sehari-hari.' },
  { id: 'sub-6', kode: 'PPN', nama: 'Pendidikan Pancasila', kategori: 'Mata Pelajaran Umum', jpPerMinggu: 4, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Identitas diri, keragaman, aturan dan norma, hak & kewajiban warga negara.' },
  { id: 'sub-7', kode: 'BIN', nama: 'Bahasa Indonesia', kategori: 'Mata Pelajaran Umum', jpPerMinggu: 6, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Kemampuan literasi, membaca nyaring, pemahaman teks fiksi/nonfiksi, dan menulis kreatif.' },
  { id: 'sub-8', kode: 'MAT', nama: 'Matematika', kategori: 'Mata Pelajaran Umum', jpPerMinggu: 5, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Bilangan cacah, pecahan, operasi hitung, pengukuran, geometri, dan data sederhana.' },
  { id: 'sub-9', kode: 'IPAS', nama: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)', kategori: 'Mata Pelajaran Umum', jpPerMinggu: 5, kelas: [3, 4, 5, 6], ringkasan: 'Interaksi makhluk hidup, energi & perubahannya, kearifan lokal, dan bentang alam.' },
  { id: 'sub-10', kode: 'PJK', nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan', kategori: 'Mata Pelajaran Umum', jpPerMinggu: 3, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Pola gerak dasar lokomotor/nonlokomotor, kebugaran jasmani, dan perilaku hidup sehat.' },
  { id: 'sub-11', kode: 'SNB', nama: 'Seni Rupa & Seni Budaya', kategori: 'Mata Pelajaran Umum', jpPerMinggu: 3, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Eksplorasi garis, bentuk, warna kaligrafi, dan karya rupa kearifan lokal.' },
  { id: 'sub-12', kode: 'BIG', nama: 'Bahasa Inggris', kategori: 'Muatan Lokal', jpPerMinggu: 2, kelas: [1, 2, 3, 4, 5, 6], ringkasan: 'Pengenalan kosakata, sapaan, anggota keluarga, lingkungan sekolah, dan benda sekitar.' },
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-001',
    judul: 'Modul Ajar Akidah Akhlak Kelas 4 - Kalimah Thayyibah Subhanallah dan Masya Allah',
    tipe: 'MODUL_AJAR',
    tipeLabel: 'Modul Ajar / RPP',
    kelas: 4,
    fase: 'B',
    mataPelajaran: 'Akidah Akhlak',
    tahunPelajaran: '2024/2025',
    semester: 'Ganjil',
    kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
    tanggalDibuat: '2024-07-20',
    tanggalDiperbarui: '2024-08-05',
    status: 'Final',
    alokasiWaktu: '4 JP (2 Pertemuan x 35 Menit)',
    tujuanRingkas: 'Peserta didik mampu melafalkan, mengartikan, dan membiasakan mengucap kalimat thayyibah Subhanallah dan Masya Allah dalam kehidupan sehari-hari.',
    tags: ['Fase B', 'Kalimat Thayyibah', 'P5-PPRA Berakhlak Mulia'],
    isAiGenerated: true,
    sections: [
      {
        id: 'sec-1',
        title: 'I. INFORMASI UMUM',
        content: `A. IDENTITAS MODUL
- Nama Penyusun: Ahmad Fauzi, S.Pd.I
- Satuan Pendidikan: MIS Nurul Huda
- Tahun Ajaran: 2024/2025
- Jenjang / Fase: MI / Fase B (Kelas IV)
- Mata Pelajaran: Akidah Akhlak
- Alokasi Waktu: 4 Jam Pelajaran (2 x Pertemuan)

B. KOMPETENSI AWAL
- Peserta didik telah mengenal lafal basmalah dan hamdalah pada fase A.
- Peserta didik mampu mengucapkan lafal tasbih secara sederhana.

C. PROFIL PELAJAR PANCASILA & RAHMATAN LIL ALAMIN (P5 - PPRA)
- Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia.
- Qudwah (Keteladanan): Mencontohkan tutur kata santun dan zikir lisan.
- Muwatanah (Kebangsaan) & Tasamuh (Toleransi).

D. SARANA DAN PRASARANA
- Mushaf Al-Qur'an / Juz Amma
- Kartu kata kalimat thayyibah (Flashcard)
- Proyektor & Laptop (video animasi tadabbur alam)
- LKPD Peserta Didik`,
      },
      {
        id: 'sec-2',
        title: 'II. KOMPONEN INTI',
        content: `A. TUJUAN PEMBELAJARAN
1. Peserta didik dapat melafalkan kalimat thayyibah Subhanallah dan Masya Allah dengan makhraj yang fasih dan benar.
2. Peserta didik dapat menguraikan makna serta perbedaan waktu pengucapan Subhanallah dan Masya Allah.
3. Peserta didik dapat membiasakan mengucapkan kalimat thayyibah saat melihat keindahan alam dan ciptaan Allah SWT yang mengagumkan.

B. PEMAHAMAN BERMAKNA
- Setiap kata zikir yang terucap menghadirkan ketenangan hati, mendatangkan pahala, dan mendekatkan diri kepada Sang Maha Pencipta.

C. PERTANYAAN PEMANTIK
- "Anak-anak, apa yang kalian ucapkan ketika melihat pemandangan pelangi yang sangat indah atau melihat gunung yang megah?"
- "Tahukah kalian perbedaan saat mengucap Subhanallah dengan Masya Allah?"

D. KEGIATAN PEMBELAJARAN (PERTEMUAN 1)
1. Pendahuluan (10 Menit):
- Guru membuka dengan salam, berdoa bersama, dan presensi.
- Guru mengajak peserta didik membaca basmalah dan ice-breaking tepuk anak sholeh.
- Guru memberikan pertanyaan pemantik dengan menayangkan gambar alam ciptaan Allah.

2. Kegiatan Inti (50 Menit):
- Eksplorasi: Peserta didik menyimak penjelasan tentang arti Subhanallah (Maha Suci Allah).
- Elaborasi: Bermain 'Tebak Situasi' menggunakan kartu gambar kapan saat yang tepat mengucap Subhanallah.
- Kolaborasi: Siswa berkelompok mempraktikkan pengucapan yang fasih dan mendiskusikan manfaat berzikir.

3. Penutup (10 Menit):
- Guru dan siswa menyimpulkan materi bersama.
- Guru memberikan penguatan dan penugasan lembar refleksi pembiasaan zikir di rumah.
- Doa penutup majelis dan salam.`,
      },
      {
        id: 'sec-3',
        title: 'III. ASESMEN DAN LAMPIRAN',
        content: `A. ASESMEN
1. Asesmen Diagnostik: Tanya jawab lisan di awal pembelajaran.
2. Asesmen Formatif: Observasi unjuk kerja pelafalan dan keaktifan diskusi kelompok.
3. Asesmen Sumatif: Tes tertulis pilihan ganda dan menjodohkan situasi pada LKPD.

B. PENGAYAAN DAN REMEDIAL
- Remedial: Bimbingan khusus pelafalan makhraj huruf bagi siswa yang belum lancar.
- Pengayaan: Menghafalkan dalil hadis ringkas keutamaan kalimat Subhanallah wa Bihamdihi.`,
      },
    ],
  },
  {
    id: 'doc-002',
    judul: 'Program Tahunan (PROTA) Akidah Akhlak Kelas 4 Tahun 2024/2025',
    tipe: 'PROTA',
    tipeLabel: 'Program Tahunan (PROTA)',
    kelas: 4,
    fase: 'B',
    mataPelajaran: 'Akidah Akhlak',
    tahunPelajaran: '2024/2025',
    semester: 'Ganjil',
    kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
    tanggalDibuat: '2024-07-16',
    tanggalDiperbarui: '2024-07-18',
    status: 'Final',
    alokasiWaktu: '72 JP / Tahun',
    tujuanRingkas: 'Pemetaan materi pokok dan alokasi waktu tahunan mapel Akidah Akhlak Kelas 4 MI.',
    tags: ['PROTA', 'Fase B', 'Akidah Akhlak', '2024/2025'],
    sections: [
      {
        id: 'sec-p1',
        title: 'SEMESTER GANJIL (36 JP)',
        content: `1. Bab 1: Indahnya Kalimah Thayyibah (Subhanallah, Masya Allah, Allahu Akbar) - 8 JP
2. Bab 2: Mengenal Sifat-Sifat Allah SWT melalui Asmaul Husna (Al-Malik, Al-Quddus, As-Salam) - 10 JP
3. Bab 3: Mengimani Kitab-Kitab Suci Allah SWT - 8 JP
4. Bab 4: Adab Terhadap Guru dan Orang Tua dalam Islam - 6 JP
5. Cadangan / Penilaian Sumatif Akhir Semester (SAS) - 4 JP`,
      },
      {
        id: 'sec-p2',
        title: 'SEMESTER GENAP (36 JP)',
        content: `1. Bab 5: Kalimah Thayyibah Laa Haula Walaa Quwwata Illaa Billaah - 8 JP
2. Bab 6: Mengenal Asmaul Husna (Al-Aziz, Al-Ghaffar, Al-Bashir) - 8 JP
3. Bab 7: Meneladani Kisah Nabi Musa AS - 8 JP
4. Bab 8: Akhlak Terpuji: Sikap Rendah Hati (Tawadhu) dan Menjauhi Sombong - 8 JP
5. Cadangan / Penilaian Sumatif Akhir Tahun (SAT) - 4 JP`,
      },
    ],
  },
  {
    id: 'doc-003',
    judul: 'Program Semester (PROMES) Akidah Akhlak Kelas 4 Semester Ganjil',
    tipe: 'PROMES',
    tipeLabel: 'Program Semester (PROMES)',
    kelas: 4,
    fase: 'B',
    mataPelajaran: 'Akidah Akhlak',
    tahunPelajaran: '2024/2025',
    semester: 'Ganjil',
    kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
    tanggalDibuat: '2024-07-17',
    tanggalDiperbarui: '2024-07-19',
    status: 'Final',
    alokasiWaktu: '36 JP (18 Minggu Efektif)',
    tujuanRingkas: 'Distribusi pekan efektif per bulan (Juli - Desember 2024).',
    tags: ['PROMES', 'Semester Ganjil', 'Akidah Akhlak'],
    sections: [
      {
        id: 'sec-pr1',
        title: 'DISTRIBUSI MINGGU EFEKTIF PER BULAN',
        content: `- Juli: 2 Pekan Efektif (Bab 1: Kalimah Thayyibah - Subhanallah & Masya Allah)
- Agustus: 4 Pekan Efektif (Bab 1 Lanjutan & Bab 2: Asmaul Husna Al-Malik, Al-Quddus)
- September: 4 Pekan Efektif (Bab 2 Lanjutan & Asesmen Sumatif Tengah Semester / STS)
- Oktober: 4 Pekan Efektif (Bab 3: Beriman kepada Kitab-Kitab Allah)
- November: 4 Pekan Efektif (Bab 4: Adab kepada Orang Tua dan Guru)
- Desember: 1 Pekan Efektif Review, Sumatif Akhir Semester (SAS), Pengolahan & Pembagian Rapor`,
      },
    ],
  },
  {
    id: 'doc-004',
    judul: 'Alur Tujuan Pembelajaran (ATP) Al-Qur\'an Hadis Kelas 1 Fase A',
    tipe: 'ATP',
    tipeLabel: 'Alur Tujuan Pembelajaran (ATP)',
    kelas: 1,
    fase: 'A',
    mataPelajaran: 'Al-Qur\'an Hadis',
    tahunPelajaran: '2024/2025',
    semester: 'Ganjil',
    kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
    tanggalDibuat: '2024-07-15',
    tanggalDiperbarui: '2024-07-15',
    status: 'Final',
    alokasiWaktu: '72 JP',
    tujuanRingkas: 'Alur pembiasaan membaca huruf hijaiyah dan hafalan surat pendek Fase A.',
    tags: ['ATP', 'Fase A', 'Al-Quran Hadis'],
    sections: [
      {
        id: 'sec-atp1',
        title: 'ALUR TUJUAN PEMBELAJARAN TAHAP 1 & 2',
        content: `1.1 Mengenal dan melafalkan huruf hijaiyah tunggal berharakat fathah, kasrah, dan dhammah (12 JP)
1.2 Menulis huruf hijaiyah tunggal sesuai kaidah garis buku (8 JP)
1.3 Melafalkan dan menghafal Surat Al-Fatihah dengan tartil dan makhraj yang tepat (10 JP)
1.4 Menghafalkan Surat An-Nas dan Al-Falaq disertai pemahaman pesan pokok perlindungan kepada Allah (14 JP)
1.5 Menyimak dan meneladani hadis tentang kebersihan adalah sebagian dari iman (6 JP)`,
      },
    ],
  },
  {
    id: 'doc-005',
    judul: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Fikih Kelas 4 Fase B',
    tipe: 'KKTP',
    tipeLabel: 'KKTP',
    kelas: 4,
    fase: 'B',
    mataPelajaran: 'Fikih',
    tahunPelajaran: '2024/2025',
    semester: 'Ganjil',
    kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
    tanggalDibuat: '2024-07-22',
    tanggalDiperbarui: '2024-07-22',
    status: 'Final',
    alokasiWaktu: 'Semester Ganjil',
    tujuanRingkas: 'Interval ketercapaian dan rubrik penilaian materi Tanda-tanda Baligh.',
    tags: ['KKTP', 'Fikih', 'Fase B'],
    sections: [
      {
        id: 'sec-kktp1',
        title: 'RUBRIK KRITERIA DAN TINDAK LANJUT',
        content: `Materi: Memahami Tanda-tanda Baligh menurut Ilmu Fikih dan Biologi
- 0 - 65% (Perlu Bimbingan): Belum mampu menyebutkan tanda baligh. Tindak lanjut: Pendampingan intensif guru dan tutor sebaya.
- 66 - 75% (Cukup): Mampu menyebutkan sebagian tanda baligh laki-laki dan perempuan. Tindak lanjut: Latihan membaca rangkuman mandiri.
- 76 - 85% (Baik): Mampu mengidentifikasi tanda baligh dan konsekuensi kewajiban syariat (shalat & menutup aurat).
- 86 - 100% (Sangat Baik): Menguasai konsep baligh secara mendalam serta mampu mempraktikkan tata cara mandi wajib dengan sempurna.`,
      },
    ],
  },
  {
    id: 'doc-006',
    judul: 'Lembar Kerja Peserta Didik (LKPD) IPAS Kelas 4 - Bagian Tubuh Tumbuhan',
    tipe: 'LKPD',
    tipeLabel: 'LKPD',
    kelas: 4,
    fase: 'B',
    mataPelajaran: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    tahunPelajaran: '2024/2025',
    semester: 'Ganjil',
    kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
    tanggalDibuat: '2024-08-01',
    tanggalDiperbarui: '2024-08-01',
    status: 'Final',
    alokasiWaktu: '2 JP (2 x 35 Menit)',
    tujuanRingkas: 'Eksplorasi tanaman di halaman madrasah untuk mengenali akar, batang, daun, dan bunga.',
    tags: ['LKPD', 'IPAS', 'Fase B', 'Praktik Lapangan'],
    sections: [
      {
        id: 'sec-lkpd1',
        title: 'PETUNJUK AKTIVITAS',
        content: `Nama Kelompok: __________________
Nama Anggota: 1. ____________ 2. ____________ 3. ____________
Alat & Bahan: Lup kaca pembesar, sampel tanaman kecil liar berakar serabut & tunggang.

Langkah Kerja:
1. Amatilah bagian akar, batang, dan daun tanaman yang kalian temukan di taman madrasah.
2. Gambarkan bentuk daun dan tuliskan apakah bertulang daun menyirip, menjari, atau sejajar!
3. Tuliskan kesimpulan fungsi akar dan daun bagi proses fotosintesis.`,
      },
    ],
  },
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: 'jrn-1',
    tanggal: '2024-08-05',
    kelas: 'Kelas 4-A',
    mataPelajaran: 'Akidah Akhlak',
    jamKe: 'Jam ke 1-2 (07.30 - 08.40)',
    materiPokok: 'Kalimah Thayyibah Subhanallah dan Masya Allah',
    tujuanPembelajaran: 'Melafalkan dan memahami situasi pengucapan Subhanallah dan Masya Allah',
    jumlahHadir: 29,
    jumlahAbsen: 1,
    catatanSiswa: 'Siswa atas nama Muhammad Rayhan izin sakit demam.',
    kendalaDanRefleksi: 'Siswa sangat antusias saat video animasi keindahan alam diputar. Pembiasaan lisan perlu terus diingatkan.',
  },
  {
    id: 'jrn-2',
    tanggal: '2024-08-06',
    kelas: 'Kelas 1-A',
    mataPelajaran: 'Al-Qur\'an Hadis',
    jamKe: 'Jam ke 3-4 (09.00 - 10.10)',
    materiPokok: 'Mengenal Huruf Hijaiyah Tunggal (Alif sampai Jim)',
    tujuanPembelajaran: 'Mampu melafalkan huruf hijaiyah dengan makhraj yang benar',
    jumlahHadir: 28,
    jumlahAbsen: 0,
    catatanSiswa: 'Semua siswa hadir lengkap, kelas tertib dan gembira.',
    kendalaDanRefleksi: 'Beberapa siswa masih tertukar pelafalan huruf Kha dan Ha. Diberikan drill lisan ulang.',
  },
  {
    id: 'jrn-3',
    tanggal: '2024-08-07',
    kelas: 'Kelas 4-A',
    mataPelajaran: 'IPAS',
    jamKe: 'Jam ke 1-3 (07.30 - 09.15)',
    materiPokok: 'Eksplorasi Bagian Tubuh Tumbuhan',
    tujuanPembelajaran: 'Mengidentifikasi akar serabut, akar tunggang, dan jenis pertulangan daun',
    jumlahHadir: 30,
    jumlahAbsen: 0,
    catatanSiswa: 'Aktivitas observasi langsung di halaman madrasah berjalan lancar.',
    kendalaDanRefleksi: 'Waktu praktik terasa cepat, perlu manajemen pembagian kelompok yang lebih presisi.',
  },
];

export const initialAgendaEntries: AgendaEntry[] = [
  { id: 'agd-1', hari: 'Senin', jamMulai: '07.00', jamSelesai: '07.30', kelas: 'Seluruh MI', mataPelajaran: 'Upacara Bendera', ruang: 'Lapangan Utama', kegiatanKhusus: 'Pembina Upacara: Kepala Madrasah' },
  { id: 'agd-2', hari: 'Senin', jamMulai: '07.30', jamSelesai: '08.40', kelas: 'Kelas 4-A', mataPelajaran: 'Akidah Akhlak', ruang: 'Gedung B R.02', kegiatanKhusus: 'Tatap muka reguler' },
  { id: 'agd-3', hari: 'Senin', jamMulai: '09.00', jamSelesai: '10.45', kelas: 'Kelas 4-A', mataPelajaran: 'IPAS', ruang: 'Gedung B R.02', kegiatanKhusus: 'Praktikum sains' },
  { id: 'agd-4', hari: 'Selasa', jamMulai: '07.15', jamSelesai: '07.45', kelas: 'Seluruh MI', mataPelajaran: 'Pembiasaan Shalat Dhuha Bersama', ruang: 'Masjid Madrasah', kegiatanKhusus: 'Imam: Guru PAI' },
  { id: 'agd-5', hari: 'Selasa', jamMulai: '08.00', jamSelesai: '09.10', kelas: 'Kelas 1-A', mataPelajaran: 'Al-Qur\'an Hadis', ruang: 'Gedung A R.01', kegiatanKhusus: 'Bimbingan tartil' },
  { id: 'agd-6', hari: 'Rabu', jamMulai: '07.30', jamSelesai: '08.40', kelas: 'Kelas 4-A', mataPelajaran: 'Fikih', ruang: 'Gedung B R.02', kegiatanKhusus: 'Praktik wudhu & shalat' },
  { id: 'agd-7', hari: 'Kamis', jamMulai: '08.00', jamSelesai: '09.45', kelas: 'Kelas 4-A', mataPelajaran: 'Bahasa Indonesia', ruang: 'Gedung B R.02', kegiatanKhusus: 'Literasi membaca' },
  { id: 'agd-8', hari: 'Jumat', jamMulai: '07.00', jamSelesai: '07.45', kelas: 'Seluruh MI', mataPelajaran: 'Senam Sehat & Bersih Lingkungan', ruang: 'Halaman MI', kegiatanKhusus: 'Jum\'at Bersih' },
];

export const initialStudentScores: StudentScore[] = [
  { id: 'sc-1', nisn: '0139882711', namaSiswa: 'Abdullah Azzam', kelas: 'Kelas 4-A', mataPelajaran: 'Akidah Akhlak', tpScores: { 'TP1': 88, 'TP2': 90, 'TP3': 85 }, nilaiFormatif: 88, nilaiSumatifMateri: 89, nilaiSTS: 87, nilaiSAS: 92, nilaiAkhir: 89, capaianTertinggi: 'Sangat baik dalam melafalkan dan mengartikan kalimat tayyibah', capaianTerendah: 'Perlu bimbingan pembiasaan adab terhadap sesama teman' },
  { id: 'sc-2', nisn: '0139882712', namaSiswa: 'Aisyah Humaira', kelas: 'Kelas 4-A', mataPelajaran: 'Akidah Akhlak', tpScores: { 'TP1': 95, 'TP2': 92, 'TP3': 94 }, nilaiFormatif: 94, nilaiSumatifMateri: 93, nilaiSTS: 96, nilaiSAS: 95, nilaiAkhir: 95, capaianTertinggi: 'Sangat istimewa dalam mengamalkan asmaul husna dan zikir harian', capaianTerendah: 'Tingkatkan keaktifan memimpin doa bersama' },
  { id: 'sc-3', nisn: '0139882713', namaSiswa: 'Bilal Habibi', kelas: 'Kelas 4-A', mataPelajaran: 'Akidah Akhlak', tpScores: { 'TP1': 74, 'TP2': 78, 'TP3': 75 }, nilaiFormatif: 76, nilaiSumatifMateri: 77, nilaiSTS: 75, nilaiSAS: 80, nilaiAkhir: 77, capaianTertinggi: 'Cukup baik dalam memahami dalil kalimat thayyibah', capaianTerendah: 'Perlu peningkatan fokus saat diskusi materi asmaul husna' },
  { id: 'sc-4', nisn: '0139882714', namaSiswa: 'Fathimah Zahira', kelas: 'Kelas 4-A', mataPelajaran: 'Akidah Akhlak', tpScores: { 'TP1': 90, 'TP2': 88, 'TP3': 92 }, nilaiFormatif: 90, nilaiSumatifMateri: 90, nilaiSTS: 88, nilaiSAS: 91, nilaiAkhir: 90, capaianTertinggi: 'Sangat baik dalam penguasaan rukun iman dan adab santun', capaianTerendah: 'Pertahankan prestasi belajar yang sudah sangat baik' },
  { id: 'sc-5', nisn: '0139882715', namaSiswa: 'Zaid bin Tsabit', kelas: 'Kelas 4-A', mataPelajaran: 'Akidah Akhlak', tpScores: { 'TP1': 82, 'TP2': 85, 'TP3': 80 }, nilaiFormatif: 82, nilaiSumatifMateri: 83, nilaiSTS: 84, nilaiSAS: 85, nilaiAkhir: 84, capaianTertinggi: 'Baik dalam hafalan nama-nama malaikat dan tugasnya', capaianTerendah: 'Perlu latihan menulis kaligrafi Arab dengan rapi' },
];

export const initialQuestions: QuestionItem[] = [
  {
    id: 'qst-1',
    mapel: 'Akidah Akhlak',
    kelas: 4,
    bab: 'Kalimah Thayyibah',
    indikator: 'Menyebutkan arti kalimat thayyibah Subhanallah',
    bentukSoal: 'Pilihan Ganda',
    tingkatKesulitan: 'Mudah',
    pertanyaan: 'Lafal kalimat thayyibah "Subhanallah" (سُبْحَانَ اللَّهِ) memiliki arti ...',
    pilihan: ['A. Allah Maha Besar', 'B. Segala Puji bagi Allah', 'C. Maha Suci Allah', 'D. Tiada daya dan upaya melainkan dari Allah'],
    kunciJawaban: 'C. Maha Suci Allah',
    pembahasan: 'Subhanallah disebut juga kalimat tasbih yang bermakna mensucikan Allah SWT dari segala kekurangan dan sifat tercela.',
  },
  {
    id: 'qst-2',
    mapel: 'Akidah Akhlak',
    kelas: 4,
    bab: 'Kalimah Thayyibah',
    indikator: 'Mengidentifikasi situasi yang tepat saat mengucap Masya Allah',
    bentukSoal: 'Pilihan Ganda',
    tingkatKesulitan: 'Sedang',
    pertanyaan: 'Ketika Ahmad melihat panorama gunung yang sangat indah dan megah, kalimat thayyibah yang paling utama diucapkan adalah ...',
    pilihan: ['A. Inna lillahi wa inna ilaihi raji\'un', 'B. Masya Allah tabarakallah', 'C. Astaghfirullah', 'D. Laa haula walaa quwwata illa billah'],
    kunciJawaban: 'B. Masya Allah tabarakallah',
    pembahasan: 'Kalimat Masya Allah diucapkan ketika melihat sesuatu yang menakjubkan dan mengagumkan agar terhindar dari penyakit ain dan mengembalikan segala keindahan kepada kuasa Allah.',
  },
  {
    id: 'qst-3',
    mapel: 'Fikih',
    kelas: 4,
    bab: 'Tanda-tanda Baligh',
    indikator: 'Menyebutkan tanda baligh bagi anak laki-laki',
    bentukSoal: 'Isian Singkat',
    tingkatKesulitan: 'Sedang',
    pertanyaan: 'Salah satu tanda baligh bagi anak laki-laki menurut ilmu fikih adalah mengalami peristiwa ...',
    kunciJawaban: 'Mimpi basah (Ihtilam)',
    pembahasan: 'Ihtilam adalah keluarnya mani bagi anak laki-laki saat tidur, yang menandakan telah memasuki masa aqil baligh.',
  },
  {
    id: 'qst-4',
    mapel: 'Al-Qur\'an Hadis',
    kelas: 1,
    bab: 'Surat Al-Fatihah',
    indikator: 'Menentukan jumlah ayat dalam Surat Al-Fatihah',
    bentukSoal: 'Pilihan Ganda',
    tingkatKesulitan: 'Mudah',
    pertanyaan: 'Surat Al-Fatihah terdiri dari ... ayat.',
    pilihan: ['A. 5 ayat', 'B. 6 ayat', 'C. 7 ayat', 'D. 8 ayat'],
    kunciJawaban: 'C. 7 ayat',
    pembahasan: 'Surat Al-Fatihah disebut as-Sab\'ul Matsani karena terdiri dari tujuh ayat yang dibaca berulang-ulang.',
  },
  {
    id: 'qst-5',
    mapel: 'IPAS',
    kelas: 4,
    bab: 'Tumbuhan Sumber Kehidupan',
    indikator: 'Menjelaskan fungsi akar pada tumbuhan',
    bentukSoal: 'Uraian',
    tingkatKesulitan: 'Sedang',
    pertanyaan: 'Jelaskan dua fungsi utama akar bagi kelangsungan hidup tumbuhan!',
    kunciJawaban: '1. Menyerap air dan zat hara dari dalam tanah. 2. Memperkokoh berdirinya batang tumbuhan di tanah.',
    pembahasan: 'Akar berfungsi sebagai penopang fisik dan jalur transport air dan unsur hara mineral yang dibutuhkan untuk fotosintesis.',
  },
];

export const initialRemedials: RemedialItem[] = [
  { id: 'rem-1', mapel: 'Akidah Akhlak', kelas: 'Kelas 4-A', tpMateri: 'Pelafalan & Makna Asmaul Husna Al-Malik', namaSiswa: 'Bilal Habibi', nilaiAwal: 62, nilaiAkhir: 78, bentukRemedial: 'Tutor sebaya dan penugasan lembar kerja mandiri', keterangan: 'Tuntas' },
  { id: 'rem-2', mapel: 'Fikih', kelas: 'Kelas 4-A', tpMateri: 'Urutan Wudhu & Syarat Sah Shalat', namaSiswa: 'Zaid bin Tsabit', nilaiAwal: 65, nilaiAkhir: 82, bentukRemedial: 'Bimbingan perorangan praktik langsung wudhu', keterangan: 'Tuntas' },
];

export const sampleCPData = [
  {
    fase: 'A',
    kelas: 'Kelas 1 - 2',
    mapel: 'Akidah Akhlak',
    elemen: 'Akidah',
    deskripsi: 'Peserta didik mampu mengenal rukun iman kepada Allah melalui asmaul husna (Ar-Rahman, Ar-Rahim), mengenal rukun Islam, serta melafalkan kalimat syahadatain dengan fasih.',
  },
  {
    fase: 'A',
    kelas: 'Kelas 1 - 2',
    mapel: 'Akidah Akhlak',
    elemen: 'Akhlak',
    deskripsi: 'Peserta didik terbiasa mengucapkan kalimat thayyibah (basmalah, hamdalah, salam) dan mempraktikkan adab santun kepada orang tua, guru, serta teman sebaya.',
  },
  {
    fase: 'B',
    kelas: 'Kelas 3 - 4',
    mapel: 'Akidah Akhlak',
    elemen: 'Akidah',
    deskripsi: 'Peserta didik mampu memahami sifat-sifat Allah melalui asmaul husna (Al-Malik, Al-Quddus, As-Salam), meyakini kitab-kitab suci Allah, dan mengenal para rasul ulul azmi.',
  },
  {
    fase: 'B',
    kelas: 'Kelas 3 - 4',
    mapel: 'Akidah Akhlak',
    elemen: 'Akhlak',
    deskripsi: 'Peserta didik mampu membiasakan melafalkan kalimat thayyibah (Subhanallah, Masya Allah, Allahu Akbar), meneladani akhlak mulia dalam bersosialisasi dan menjaga alam sekitar.',
  },
  {
    fase: 'C',
    kelas: 'Kelas 5 - 6',
    mapel: 'Akidah Akhlak',
    elemen: 'Akidah & Akhlak',
    deskripsi: 'Peserta didik mampu menganalisis hari akhir, takdir baik dan buruk (qada dan qadar), serta menginternalisasi sikap tawadhu, ikhlas, pemaaf, dan menghindari akhlak mazmumah.',
  },
  {
    fase: 'B',
    kelas: 'Kelas 3 - 4',
    mapel: 'Fikih',
    elemen: 'Fikih Ibadah',
    deskripsi: 'Peserta didik memahami konsep baligh dan tata cara bersuci dari hadas besar (mandi wajib), mempraktikkan shalat sunnah rawatib, dhuha, tahajud, dan puasa ramadhan.',
  },
];

export const initialCurriculumReferences: CurriculumReference[] = [
  {
    id: 'ref-01',
    title: 'KMA Nomor 450 Tahun 2024 tentang Pedoman Implementasi Kurikulum pada Madrasah',
    category: 'Kurikulum',
    subject: 'Seluruh Mata Pelajaran MI',
    fase: 'Semua',
    classGrade: 4,
    fileName: 'KMA_450_Tahun_2024_Pedoman_Kurikulum_Madrasah.pdf',
    fileSize: 2450000,
    contentText: 'KMA 450 Tahun 2024 mengatur struktur kurikulum madrasah (MI, MTs, MA, MAK), standar beban belajar intrakurikuler dan kokurikuler P5-PPRA. Nilai Profil Pelajar Rahmatan Lil Alamin meliputi: Berkeadaban (Ta’addub), Keteladanan (Qudwah), Kewarganegaraan (Muwatanah), Mengambil Jalan Tengah (Tawassut), Berimbang (Tawazun), Lurus dan Tegas (I’tidal), Kesetaraan (Musawah), Musyawarah (Syura), Toleransi (Tasamuh), Dinamis dan Inovatif (Tatawwur wa Ibtikar).',
    isVerified: true,
    createdAt: '2024-07-01',
    updatedAt: '2024-07-01',
  },
  {
    id: 'ref-02',
    title: 'Keputusan BSKAP No. 032/H/KR/2024 tentang Capaian Pembelajaran MI Fase A, B, C',
    category: 'CP',
    subject: 'Mata Pelajaran Umum & PAI Kemenag',
    fase: 'Semua',
    classGrade: 4,
    fileName: 'BSKAP_032_Capaian_Pembelajaran_Madrasah.pdf',
    fileSize: 3120000,
    contentText: 'Dokumen rujukan Capaian Pembelajaran resmi per mata pelajaran jenjang Madrasah Ibtidaiyah: Fase A (Kelas 1-2), Fase B (Kelas 3-4), dan Fase C (Kelas 5-6). Menetapkan elemen materi dan deskripsi kompetensi akhir setiap fase.',
    isVerified: true,
    createdAt: '2024-07-05',
    updatedAt: '2024-07-05',
  },
  {
    id: 'ref-03',
    title: 'Buku Panduan Guru Akidah Akhlak MI Fase B Kelas 4 Kemenag RI',
    category: 'Buku Pelajaran',
    subject: 'Akidah Akhlak',
    fase: 'B',
    classGrade: 4,
    fileName: 'Buku_Guru_Akidah_Akhlak_Kelas_4_Kemenag.pdf',
    fileSize: 4500000,
    contentText: 'Panduan operasional pembelajaran Akidah Akhlak Kelas 4. Bab 1: Kalimah Thayyibah (Subhanallah, Masya Allah, Allahu Akbar). Bab 2: Asmaul Husna (Al-Malik, Al-Quddus, As-Salam). Bab 3: Mengimani Kitab Suci. Bab 4: Adab Santun kepada Orang Tua dan Guru.',
    isVerified: true,
    createdAt: '2024-07-10',
    updatedAt: '2024-07-10',
  },
  {
    id: 'ref-04',
    title: 'Panduan Pembelajaran dan Asesmen (PPA) pada Madrasah Kemenag',
    category: 'Panduan',
    subject: 'Metodologi & Asesmen',
    fase: 'Semua',
    classGrade: 4,
    fileName: 'Panduan_Pembelajaran_dan_Asesmen_Madrasah_2024.pdf',
    fileSize: 1850000,
    contentText: 'Ketentuan perencanaan asesmen: Diagnostik/Awal, Formatif (sebagai asesmen untuk dan sebagai pembelajaran), dan Sumatif (lingkup materi & akhir semester). Kriteria Ketercapaian TP (KKTP) menggunakan rubrik interval skor deskripsi ketercapaian.',
    isVerified: true,
    createdAt: '2024-07-12',
    updatedAt: '2024-07-12',
  },
];

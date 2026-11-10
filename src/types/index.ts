export type DocumentType =
  // Inti Kurikulum & Perencanaan
  | 'CP'
  | 'TP'
  | 'ATP'
  | 'PROTA'
  | 'PROMES'
  | 'KKTP'
  | 'MODUL_AJAR'
  | 'PEMETAAN_MATERI'
  // Asesmen & Evaluasi
  | 'ASESMEN_DIAGNOSTIK'
  | 'ASESMEN_FORMATIF'
  | 'ASESMEN_SUMATIF'
  | 'KISI_KISI'
  | 'BANK_SOAL'
  | 'SOAL_PG'
  | 'SOAL_PG_KOMPLEKS'
  | 'SOAL_BENAR_SALAH'
  | 'SOAL_MENJODOHKAN'
  | 'SOAL_ISIAN'
  | 'SOAL_URAIAN'
  | 'KUNCI_JAWABAN'
  | 'RUBRIK_PENILAIAN'
  // Bahan Ajar & Aktivitas Siswa
  | 'LKPD'
  | 'MATERI_BAB'
  | 'RINGKASAN_MATERI'
  // Administrasi Mengajar & Rekap
  | 'JURNAL'
  | 'AGENDA'
  | 'REKAP_NILAI'
  | 'REMEDIAL'
  | 'PENGAYAAN'
  | 'LAPORAN_BELAJAR'
  // Legacy / Aliases
  | 'ASESMEN'
  | 'MATERI'
  | 'RPE';

export interface PaperSettings {
  size: 'A4' | 'F4';
  margin: 'normal' | 'narrow' | 'wide';
  includeKop: boolean;
  includeSignatures: boolean;
}

export interface MadrasahProfile {
  namaMadrasah: string;
  npsn: string;
  nsm: string;
  jenjang: 'MI' | 'RA' | 'MTs' | 'MA';
  status: 'Negeri' | 'Swasta';
  akreditasi: 'A' | 'B' | 'C' | 'Belum Terakreditasi';
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  email: string;
  telepon: string;
  website: string;
  namaKepala: string;
  nipKepala: string;
  logoUrl: string;
  kementerian: string;
}

export interface TeacherProfile {
  namaLengkap: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  nipNiy: string;
  nuptk: string;
  jabatan: string;
  pangkatGolongan: string;
  jenisKelamin: 'L' | 'P';
  pendidikanTerakhir: string;
  jurusan: string;
  email: string;
  noHp: string;
  alamat: string;
  fotoUrl: string;
  mapelDiampu: string[];
  kelasDiampu: number[];
}

export interface SchoolYear {
  id: string;
  tahun: string;
  statusAktif: boolean;
  tanggalMulai: string;
  tanggalSelesai: string;
  keterangan?: string;
}

export interface Semester {
  id: string;
  tahunId: string;
  semester: 'Ganjil' | 'Genap';
  nomor: 1 | 2;
  statusAktif: boolean;
  pekanEfektif: number;
  pekanTidakEfektif: number;
  totalPekan: number;
  tanggalBagiRapor: string;
}

export interface Curriculum {
  id: string;
  nama: string;
  kode: string;
  regulasi: string;
  statusAktif: boolean;
  fase: {
    fase: 'A' | 'B' | 'C';
    kelas: number[];
    deskripsi: string;
  }[];
}

export interface ClassGrade {
  id: string;
  tingkat: number;
  fase: 'A' | 'B' | 'C';
  namaKelas: string;
  rombel: string;
  jumlahSiswaL: number;
  jumlahSiswaP: number;
  waliKelas: string;
  ruang: string;
}

export interface Subject {
  id: string;
  kode: string;
  nama: string;
  kategori: 'Pendidikan Agama Islam' | 'Bahasa Arab' | 'Mata Pelajaran Umum' | 'Muatan Lokal';
  jpPerMinggu: number;
  kelas: number[];
  ringkasan: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
}

export interface DocumentItem {
  id: string;
  judul: string;
  tipe: DocumentType;
  tipeLabel: string;
  kelas: number;
  fase: 'A' | 'B' | 'C';
  mataPelajaran: string;
  tahunPelajaran: string;
  semester: 'Ganjil' | 'Genap';
  kurikulum: string;
  tanggalDibuat: string;
  tanggalDiperbarui: string;
  status: 'Draft' | 'Final' | 'Disetujui';
  alokasiWaktu?: string;
  tujuanRingkas?: string;
  sections: DocumentSection[];
  tags: string[];
  isAiGenerated?: boolean;
  // Cascading Document Relationships
  sourceDocId?: string;
  sourceDocTitle?: string;
  sourceDocType?: DocumentType;
  derivedDocIds?: string[];
  needsSyncWithSource?: boolean;
  sourceModifiedAt?: string;
  paperSettings?: PaperSettings;
}

export interface JournalEntry {
  id: string;
  tanggal: string;
  kelas: string;
  mataPelajaran: string;
  jamKe: string;
  materiPokok: string;
  tujuanPembelajaran: string;
  jumlahHadir: number;
  jumlahAbsen: number;
  catatanSiswa: string;
  kendalaDanRefleksi: string;
}

export interface AgendaEntry {
  id: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  kelas: string;
  mataPelajaran: string;
  ruang: string;
  kegiatanKhusus?: string;
}

export interface StudentScore {
  id: string;
  nisn: string;
  namaSiswa: string;
  kelas: string;
  mataPelajaran: string;
  tpScores: { [tpCode: string]: number };
  nilaiFormatif: number;
  nilaiSumatifMateri: number;
  nilaiSTS: number;
  nilaiSAS: number;
  nilaiAkhir: number;
  capaianTertinggi: string;
  capaianTerendah: string;
}

export interface QuestionItem {
  id: string;
  mapel: string;
  kelas: number;
  bab: string;
  indikator: string;
  bentukSoal: 'Pilihan Ganda' | 'Isian Singkat' | 'Uraian' | 'Benar/Salah' | 'Menjodohkan';
  tingkatKesulitan: 'Mudah' | 'Sedang' | 'Sukar';
  pertanyaan: string;
  pilihan?: string[];
  kunciJawaban: string;
  pembahasan: string;
}

export interface LkpdItem {
  id: string;
  judul: string;
  mapel: string;
  kelas: number;
  bab: string;
  alokasiWaktu: string;
  petunjukBelajar: string[];
  aktivitas: string;
  tugasMandiri: string;
}

export interface RemedialItem {
  id: string;
  mapel: string;
  kelas: string;
  tpMateri: string;
  namaSiswa: string;
  nilaiAwal: number;
  nilaiAkhir: number;
  bentukRemedial: string;
  keterangan: 'Tuntas' | 'Belum Tuntas';
}

export interface CurriculumReference {
  id: string;
  title: string;
  category: 'CP' | 'Kurikulum' | 'Buku Pelajaran' | 'Panduan' | 'Lainnya';
  subject?: string;
  fase?: 'A' | 'B' | 'C' | 'Semua';
  classGrade?: number;
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  contentText?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIGenerationLog {
  id: string;
  feature: string;
  promptInput: string;
  responseOutput: string;
  modelUsed: string;
  createdAt: string;
}

export type PageId =
  | 'login'
  | 'dashboard'
  | 'profil-madrasah'
  | 'profil-guru'
  | 'pengaturan-tahun'
  | 'pengaturan-semester'
  | 'pengaturan-kurikulum'
  | 'referensi-kurikulum'
  | 'data-kelas'
  | 'data-mapel'
  | 'perencanaan'
  | 'cp'
  | 'tp'
  | 'atp'
  | 'prota'
  | 'promes'
  | 'kktp'
  | 'modul-ajar'
  | 'asesmen'
  | 'bank-soal'
  | 'lkpd'
  | 'materi'
  | 'jurnal'
  | 'agenda'
  | 'rekap-nilai'
  | 'remedial'
  | 'laporan'
  | 'template'
  | 'dokumen-saya'
  | 'pengaturan-aplikasi';

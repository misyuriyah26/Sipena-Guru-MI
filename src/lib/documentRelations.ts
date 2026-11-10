import { DocumentType, DocumentItem } from '../types';

export interface DocumentTypeMeta {
  type: DocumentType;
  label: string;
  category: 'Perencanaan' | 'Asesmen' | 'Bahan Ajar' | 'Administrasi';
  recommendedNext?: DocumentType;
  allowedParents?: DocumentType[];
  description: string;
}

export const DOCUMENT_TYPE_METAS: Record<DocumentType, DocumentTypeMeta> = {
  CP: {
    type: 'CP',
    label: 'Capaian Pembelajaran (CP)',
    category: 'Perencanaan',
    recommendedNext: 'TP',
    description: 'Kompetensi pembelajaran resmi fase yang harus dicapai peserta didik pada setiap fase MI.',
  },
  TP: {
    type: 'TP',
    label: 'Tujuan Pembelajaran (TP)',
    category: 'Perencanaan',
    allowedParents: ['CP'],
    recommendedNext: 'ATP',
    description: 'Penjabaran kompetensi dan lingkup materi dari CP ke dalam tujuan spesifik yang terukur.',
  },
  ATP: {
    type: 'ATP',
    label: 'Alur Tujuan Pembelajaran (ATP)',
    category: 'Perencanaan',
    allowedParents: ['TP', 'CP'],
    recommendedNext: 'PROTA',
    description: 'Rangkaian tujuan pembelajaran yang disusun secara sistematis dan logis dalam fase.',
  },
  PROTA: {
    type: 'PROTA',
    label: 'Program Tahunan (PROTA)',
    category: 'Perencanaan',
    allowedParents: ['ATP', 'TP'],
    recommendedNext: 'PROMES',
    description: 'Alokasi waktu pembelajaran selama satu tahun ajaran untuk mencapai TP dalam ATP.',
  },
  PROMES: {
    type: 'PROMES',
    label: 'Program Semester (PROMES)',
    category: 'Perencanaan',
    allowedParents: ['PROTA', 'ATP'],
    recommendedNext: 'MODUL_AJAR',
    description: 'Rincian alokasi waktu dan distribusi materi tiap pekan efektif dalam satu semester.',
  },
  KKTP: {
    type: 'KKTP',
    label: 'Kriteria Ketercapaian TP (KKTP)',
    category: 'Perencanaan',
    allowedParents: ['TP', 'MODUL_AJAR'],
    recommendedNext: 'ASESMEN_FORMATIF',
    description: 'Deskripsi kriteria ketuntasan dan rubrik interval ketercapaian tujuan pembelajaran.',
  },
  MODUL_AJAR: {
    type: 'MODUL_AJAR',
    label: 'Modul Ajar / RPP Merdeka',
    category: 'Perencanaan',
    allowedParents: ['PROMES', 'ATP', 'TP'],
    recommendedNext: 'LKPD',
    description: 'Panduan lengkap pembelajaran tatap muka berisikan asesmen, langkah P5-PPRA, dan media.',
  },
  PEMETAAN_MATERI: {
    type: 'PEMETAAN_MATERI',
    label: 'Pemetaan Materi Pelajaran',
    category: 'Perencanaan',
    allowedParents: ['ATP', 'CP'],
    recommendedNext: 'PROMES',
    description: 'Distribusi materi esensial per semester dan per pekan berdasarkan kalender pendidikan.',
  },
  // Asesmen & Evaluasi
  ASESMEN_DIAGNOSTIK: {
    type: 'ASESMEN_DIAGNOSTIK',
    label: 'Asesmen Diagnostik Awal',
    category: 'Asesmen',
    allowedParents: ['TP', 'MODUL_AJAR'],
    recommendedNext: 'MODUL_AJAR',
    description: 'Instrumen identifikasi kesiapan belajar, gaya belajar, dan minat peserta didik di awal bab.',
  },
  ASESMEN_FORMATIF: {
    type: 'ASESMEN_FORMATIF',
    label: 'Asesmen Formatif Proses',
    category: 'Asesmen',
    allowedParents: ['MODUL_AJAR', 'KKTP'],
    recommendedNext: 'ASESMEN_SUMATIF',
    description: 'Penilaian umpan balik selama proses belajar (observasi, unjuk kerja, lembar refleksi).',
  },
  ASESMEN_SUMATIF: {
    type: 'ASESMEN_SUMATIF',
    label: 'Asesmen Sumatif (Lingkup Materi / SAS)',
    category: 'Asesmen',
    allowedParents: ['MODUL_AJAR', 'KKTP'],
    recommendedNext: 'KISI_KISI',
    description: 'Penilaian akhir lingkup materi atau akhir semester untuk mengukur capaian hasil belajar.',
  },
  KISI_KISI: {
    type: 'KISI_KISI',
    label: 'Kisi-kisi Soal Evaluasi',
    category: 'Asesmen',
    allowedParents: ['ASESMEN_SUMATIF', 'TP'],
    recommendedNext: 'BANK_SOAL',
    description: 'Matriks sebaran indikator soal, level kognitif (C1-C6/HOTS), dan bentuk soal.',
  },
  BANK_SOAL: {
    type: 'BANK_SOAL',
    label: 'Bank Soal MI Terpadu',
    category: 'Asesmen',
    allowedParents: ['KISI_KISI', 'ASESMEN_SUMATIF'],
    recommendedNext: 'KUNCI_JAWABAN',
    description: 'Kumpulan butir soal komprehensif berbagai variasi bentuk soal standar madrasah.',
  },
  SOAL_PG: {
    type: 'SOAL_PG',
    label: 'Paket Soal Pilihan Ganda',
    category: 'Asesmen',
    allowedParents: ['KISI_KISI'],
    recommendedNext: 'KUNCI_JAWABAN',
    description: 'Paket butir soal pilihan ganda 4 opsi (A, B, C, D) dengan stimulus teks Islami kontekstual.',
  },
  SOAL_PG_KOMPLEKS: {
    type: 'SOAL_PG_KOMPLEKS',
    label: 'Soal Pilihan Ganda Kompleks (AKMI/AKM)',
    category: 'Asesmen',
    allowedParents: ['KISI_KISI'],
    recommendedNext: 'KUNCI_JAWABAN',
    description: 'Soal dengan lebih dari satu jawaban benar atau model ceklis/pernyataan kesesuaian.',
  },
  SOAL_BENAR_SALAH: {
    type: 'SOAL_BENAR_SALAH',
    label: 'Soal Benar / Salah',
    category: 'Asesmen',
    allowedParents: ['KISI_KISI'],
    recommendedNext: 'KUNCI_JAWABAN',
    description: 'Soal pernyataan yang meminta siswa menilai kebenaran fakta konsep materi.',
  },
  SOAL_MENJODOHKAN: {
    type: 'SOAL_MENJODOHKAN',
    label: 'Soal Menjodohkan (Matching)',
    category: 'Asesmen',
    allowedParents: ['KISI_KISI'],
    recommendedNext: 'KUNCI_JAWABAN',
    description: 'Soal memasangkan pernyataan premis dengan pilihan respon atau arti istilah.',
  },
  SOAL_ISIAN: {
    type: 'SOAL_ISIAN',
    label: 'Soal Isian Singkat',
    category: 'Asesmen',
    allowedParents: ['KISI_KISI'],
    recommendedNext: 'KUNCI_JAWABAN',
    description: 'Soal melengkapi kalimat rumpang dengan kata kunci atau istilah tepat.',
  },
  SOAL_URAIAN: {
    type: 'SOAL_URAIAN',
    label: 'Soal Uraian / Essay HOTS',
    category: 'Asesmen',
    allowedParents: ['KISI_KISI'],
    recommendedNext: 'RUBRIK_PENILAIAN',
    description: 'Soal analisis, penalaran kritis, dan studi kasus pemecahan masalah kontekstual.',
  },
  KUNCI_JAWABAN: {
    type: 'KUNCI_JAWABAN',
    label: 'Kunci Jawaban & Pembahasan',
    category: 'Asesmen',
    allowedParents: ['BANK_SOAL', 'SOAL_PG', 'SOAL_URAIAN'],
    recommendedNext: 'RUBRIK_PENILAIAN',
    description: 'Daftar kunci jawaban benar disertai uraian pembahasan konsep dan dalil/dasar materi.',
  },
  RUBRIK_PENILAIAN: {
    type: 'RUBRIK_PENILAIAN',
    label: 'Rubrik & Pedoman Penskoran',
    category: 'Asesmen',
    allowedParents: ['SOAL_URAIAN', 'KKTP', 'ASESMEN_SUMATIF'],
    recommendedNext: 'REKAP_NILAI',
    description: 'Pedoman kriteria skor bertingkat untuk soal uraian, proyek, dan unjuk performa.',
  },
  // Bahan Ajar & Aktivitas Siswa
  LKPD: {
    type: 'LKPD',
    label: 'Lembar Kerja Peserta Didik (LKPD)',
    category: 'Bahan Ajar',
    allowedParents: ['MODUL_AJAR', 'TP'],
    recommendedNext: 'JURNAL',
    description: 'Lembar kerja aktivitas kelompok/mandiri dengan petunjuk, gambar stimulus, dan lembar refleksi.',
  },
  MATERI_BAB: {
    type: 'MATERI_BAB',
    label: 'Bahan Ajar & Materi Pembelajaran per Bab',
    category: 'Bahan Ajar',
    allowedParents: ['TP', 'MODUL_AJAR'],
    recommendedNext: 'RINGKASAN_MATERI',
    description: 'Uraian materi mendalam dilengkapi dalil ayat/hadits, kisah inspiratif, dan kosa kata.',
  },
  RINGKASAN_MATERI: {
    type: 'RINGKASAN_MATERI',
    label: 'Ringkasan / Rangkuman Intisari Materi',
    category: 'Bahan Ajar',
    allowedParents: ['MATERI_BAB', 'MODUL_AJAR'],
    recommendedNext: 'SOAL_PG',
    description: 'Poin-poin penting esensial, peta konsep, dan ikhtisar mudah hafal bagi peserta didik.',
  },
  // Administrasi Mengajar & Rekap
  JURNAL: {
    type: 'JURNAL',
    label: 'Jurnal Mengajar Harian Guru',
    category: 'Administrasi',
    allowedParents: ['MODUL_AJAR', 'PROMES'],
    recommendedNext: 'AGENDA',
    description: 'Catatan pelaksanaan tatap muka, kehadiran siswa, dinamika kelas, dan catatan refleksi.',
  },
  AGENDA: {
    type: 'AGENDA',
    label: 'Agenda Mengajar & Jadwal Mingguan',
    category: 'Administrasi',
    allowedParents: ['PROMES'],
    recommendedNext: 'REKAP_NILAI',
    description: 'Jadwal tatap muka, jam mengajar, pembagian ruang kelas, dan agenda kegiatan madrasah.',
  },
  REKAP_NILAI: {
    type: 'REKAP_NILAI',
    label: 'Rekap Nilai Siswa (Formatif & Sumatif)',
    category: 'Administrasi',
    allowedParents: ['ASESMEN_SUMATIF', 'KKTP'],
    recommendedNext: 'REMEDIAL',
    description: 'Rekapitulasi nilai per TP, nilai STS, nilai SAS, dan deskripsi capaian rapor Kurikulum Merdeka.',
  },
  REMEDIAL: {
    type: 'REMEDIAL',
    label: 'Program & Pelaksanaan Remedial',
    category: 'Administrasi',
    allowedParents: ['REKAP_NILAI', 'KKTP'],
    recommendedNext: 'PENGAYAAN',
    description: 'Program bimbingan khusus bagi peserta didik yang belum mencapai batas interval KKTP.',
  },
  PENGAYAAN: {
    type: 'PENGAYAAN',
    label: 'Program Kegiatan Pengayaan',
    category: 'Administrasi',
    allowedParents: ['REKAP_NILAI'],
    recommendedNext: 'LAPORAN_BELAJAR',
    description: 'Pendalaman materi kontekstual bagi peserta didik yang telah melampaui kriteria ketuntasan.',
  },
  LAPORAN_BELAJAR: {
    type: 'LAPORAN_BELAJAR',
    label: 'Laporan Capaian Pembelajaran Siswa',
    category: 'Administrasi',
    allowedParents: ['REKAP_NILAI', 'JURNAL'],
    description: 'Laporan deskriptif perkembangan belajar siswa untuk disampaikan kepada wali murid dan kepala madrasah.',
  },
  // Legacy Aliases
  ASESMEN: {
    type: 'ASESMEN',
    label: 'Dokumen Asesmen Umum',
    category: 'Asesmen',
    description: 'Format asesmen umum.',
  },
  MATERI: {
    type: 'MATERI',
    label: 'Bahan Ajar Umum',
    category: 'Bahan Ajar',
    description: 'Format bahan ajar umum.',
  },
  RPE: {
    type: 'RPE',
    label: 'Rincian Pekan Efektif (RPE)',
    category: 'Perencanaan',
    description: 'Hitungan pekan efektif semester.',
  },
};

/**
 * Pipeline Chain Hierarchy for Auto-Carrying Data
 */
export const DOCUMENT_PIPELINE: { from: DocumentType; to: DocumentType; label: string }[] = [
  { from: 'CP', to: 'TP', label: 'Rumuskan TP dari Capaian Pembelajaran' },
  { from: 'TP', to: 'ATP', label: 'Susun Alur Tujuan Pembelajaran (ATP)' },
  { from: 'ATP', to: 'PROTA', label: 'Alokasikan Jam ke Program Tahunan (PROTA)' },
  { from: 'PROTA', to: 'PROMES', label: 'Rinci ke Program Semester (PROMES)' },
  { from: 'PROMES', to: 'MODUL_AJAR', label: 'Buat Modul Ajar / RPP Berdasarkan PROMES' },
  { from: 'MODUL_AJAR', to: 'KKTP', label: 'Tetapkan Kriteria Ketercapaian TP (KKTP)' },
  { from: 'MODUL_AJAR', to: 'LKPD', label: 'Susun Lembar Kerja Peserta Didik (LKPD)' },
  { from: 'MODUL_AJAR', to: 'ASESMEN_FORMATIF', label: 'Buat Instrumen Asesmen Formatif' },
  { from: 'MODUL_AJAR', to: 'ASESMEN_SUMATIF', label: 'Buat Instrumen Asesmen Sumatif' },
  { from: 'ASESMEN_SUMATIF', to: 'KISI_KISI', label: 'Susun Kisi-kisi Soal Evaluasi' },
  { from: 'KISI_KISI', to: 'BANK_SOAL', label: 'Buat Paket Bank Soal Lengkap' },
  { from: 'BANK_SOAL', to: 'KUNCI_JAWABAN', label: 'Buat Kunci Jawaban & Pembahasan' },
  { from: 'BANK_SOAL', to: 'RUBRIK_PENILAIAN', label: 'Buat Rubrik Penilaian & Skor' },
  { from: 'MODUL_AJAR', to: 'JURNAL', label: 'Catat ke Jurnal Mengajar Harian' },
  { from: 'REKAP_NILAI', to: 'REMEDIAL', label: 'Buat Program Remedial untuk Siswa Belum Tuntas' },
  { from: 'REKAP_NILAI', to: 'PENGAYAAN', label: 'Buat Program Pengayaan Siswa Mahir' },
];

/**
 * Extract context data from a parent document to prepopulate child document generator
 */
export function extractContextFromParent(parentDoc: DocumentItem): {
  materi: string;
  tujuan: string;
  alokasiWaktu: string;
  suggestedPrompt: string;
} {
  const contentAll = parentDoc.sections.map((s) => `${s.title}\n${s.content}`).join('\n\n');

  // Extract Tujuan if available
  let tujuan = parentDoc.tujuanRingkas || '';
  if (!tujuan) {
    const tpMatch = contentAll.match(/(?:Tujuan Pembelajaran|TP|Indikator)[:\s]+([^\n.]+)/i);
    if (tpMatch) tujuan = tpMatch[1].trim();
  }

  // Extract Materi if available
  let materi = '';
  const materiMatch = contentAll.match(/(?:Materi Pokok|Topik|Bab|Lingkup Materi)[:\s]+([^\n.]+)/i);
  if (materiMatch) {
    materi = materiMatch[1].trim();
  } else {
    materi = parentDoc.judul.replace(/\[AI\]\s*/i, '').split('-')[0].trim();
  }

  const alokasiWaktu = parentDoc.alokasiWaktu || '2 x 35 Menit';

  const suggestedPrompt = `Lanjutkan penyusunan turunan dari dokumen "${parentDoc.judul}" (${parentDoc.tipeLabel}) untuk ${parentDoc.mataPelajaran} Kelas ${parentDoc.kelas} Semester ${parentDoc.semester}. Materi: ${materi || 'Topik Terkait'}. Tujuan: ${tujuan || 'Sesuai dokumen rujukan'}.`;

  return {
    materi,
    tujuan,
    alokasiWaktu,
    suggestedPrompt,
  };
}

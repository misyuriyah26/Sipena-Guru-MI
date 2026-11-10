import React, { useState } from 'react';
import { FileQuestion, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AsesmenPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);
  const [jenisAsesmen, setJenisAsesmen] = useState<'Awal' | 'Formatif' | 'Sumatif'>('Formatif');

  const handleCreateAsesmenDoc = () => {
    const content = `
PANDUAN & INSTRUMEN ASESMEN PEMBELAJARAN
Mata Pelajaran: ${mapel} | Kelas: ${kelas}
Jenis Asesmen: Asesmen ${jenisAsesmen}
Tahun Pelajaran: ${activeSchoolYear.tahun} | Semester: ${activeSemester.semester}

A. TUJUAN ASESMEN:
Mengukur ketercapaian pemahaman kompetensi peserta didik pada materi pokok ${mapel}.

B. BENTUK ASESMEN:
${jenisAsesmen === 'Awal' ? '1. Pertanyaan Pemantik Diagnostik Lisan\n2. Lembar Kuesioner Minat dan Gaya Belajar\n3. Pre-test Konsep Dasar' : jenisAsesmen === 'Formatif' ? '1. Lembar Observasi Partisipasi Diskusi Kelompok\n2. Penilaian Antar Teman (Peer Assessment)\n3. Unjuk Kerja Praktik dan Catatan Anekdot' : '1. Tes Tertulis Pilihan Ganda & Uraian\n2. Tugas Proyek Portofolio\n3. Penilaian Akhir Lingkup Materi (Sumatif Bab)'}

C. RUBRIK PENILAIAN & SKALA SKOR:
- Skor 4 (Sangat Baik): Menguasai seluruh indikator secara tepat dan mandiri.
- Skor 3 (Baik): Menguasai sebagian besar indikator dengan sedikit arahan.
- Skor 2 (Cukup): Menunjukkan pemahaman dasar namun memerlukan bimbingan rutin.
- Skor 1 (Kurang): Belum memenuhi kriteria minimal dan membutuhkan remedial intensif.
    `.trim();

    const newDoc = addDocument({
      judul: `Instrumen Asesmen ${jenisAsesmen} ${mapel} Kelas ${kelas}`,
      tipe: 'ASESMEN',
      tipeLabel: 'Asesmen dan Penilaian',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: 'Sesuai Pembelajaran',
      tujuanRingkas: `Instrumen asesmen ${jenisAsesmen.toLowerCase()} dan rubrik penilaian`,
      sections: [
        {
          id: 'sec-asesmen-1',
          title: `I. INSTRUMEN DAN RUBRIK ASESMEN ${jenisAsesmen.toUpperCase()}`,
          content,
        },
      ],
      tags: ['Asesmen', jenisAsesmen, mapel, `Kelas ${kelas}`],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Asesmen & Instrumen Penilaian
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rancang Asesmen Diagnostik Awal, Formatif (Proses), dan Sumatif (Hasil Belajar) terintegrasi P5-PPRA.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateAsesmenDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Buat Dokumen Asesmen</span>
        </button>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Asesmen</label>
          <select
            value={jenisAsesmen}
            onChange={(e) => setJenisAsesmen(e.target.value as any)}
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
          >
            <option value="Awal">Asesmen Awal / Diagnostik</option>
            <option value="Formatif">Asesmen Formatif (Saat Pembelajaran)</option>
            <option value="Sumatif">Asesmen Sumatif (Lingkup Materi & Akhir)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
          <select
            value={mapel}
            onChange={(e) => setMapel(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.nama}>
                {s.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
          <select
            value={kelas}
            onChange={(e) => setKelas(Number(e.target.value))}
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
          >
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <option key={k} value={k}>
                Kelas {k} (Fase {k <= 2 ? 'A' : k <= 4 ? 'B' : 'C'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 uppercase">
            Tahap Awal
          </span>
          <h2 className="text-sm font-bold text-slate-900 mt-2">Asesmen Diagnostik</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Mengetahui kesiapan kognitif dan non-kognitif siswa sebelum materi diajarkan. Digunakan untuk merancang pembelajaran berdiferensiasi.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 uppercase">
            Tahap Proses
          </span>
          <h2 className="text-sm font-bold text-slate-900 mt-2">Asesmen Formatif</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Memberikan umpan balik langsung selama tatap muka. Berupa observasi keaktifan, kuis singkat, dan lembar refleksi diri.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 uppercase">
            Tahap Akhir
          </span>
          <h2 className="text-sm font-bold text-slate-900 mt-2">Asesmen Sumatif</h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Mengukur penguasaan siswa pada akhir satu lingkup materi (bab), Sumatif Tengah Semester (STS), dan Sumatif Akhir Semester (SAS).
          </p>
        </div>
      </div>
    </div>
  );
};

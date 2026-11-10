import React, { useState } from 'react';
import { FileSpreadsheet, Plus, FileText, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProtaPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);

  const protaSem1 = [
    { no: 1, bab: 'Bab 1: Kalimah Thayyibah (Subhanallah, Masya Allah, Allahu Akbar)', materi: 'Pelafalan, makna dan adab pengucapan kalimat tayyibah', jp: 8 },
    { no: 2, bab: 'Bab 2: Mengenal Asmaul Husna (Al-Malik, Al-Quddus, As-Salam)', materi: 'Karakteristik dan bukti kekuasaan Allah SWT', jp: 10 },
    { no: 3, bab: 'Bab 3: Beriman kepada Kitab-Kitab Suci Allah', materi: 'Nama kitab suci dan nabi penerimanya serta kewajiban mengamalkan Al-Qur\'an', jp: 10 },
    { no: 4, bab: 'Bab 4: Adab Santun kepada Orang Tua dan Guru', materi: 'Keteladanan adab, birrul walidain, dan sopan santun di madrasah', jp: 4 },
    { no: 5, bab: 'Asesmen Sumatif Tengah & Akhir Semester 1', materi: 'Evaluasi ketercapaian kompetensi semester ganjil', jp: 4 },
  ];

  const protaSem2 = [
    { no: 6, bab: 'Bab 5: Kalimah Thayyibah Hauqalah (Laa Haula Walaa Quwwata Illaa Billaah)', materi: 'Penyerahan diri dan tawakkal hanya kepada Allah', jp: 8 },
    { no: 7, bab: 'Bab 6: Asmaul Husna Lanjutan (Al-Aziz, Al-Ghaffar, Al-Bashir)', materi: 'Pemahaman sifat Maha Perkasa, Maha Pengampun, dan Maha Melihat', jp: 8 },
    { no: 8, bab: 'Bab 7: Meneladani Kisah Nabi Musa AS', materi: 'Keberanian menegakkan kebenaran dan kesabaran melawan kedurhakaan Firaun', jp: 10 },
    { no: 9, bab: 'Bab 8: Akhlak Terpuji: Sikap Rendah Hati (Tawadhu)', materi: 'Menghindari perilaku takabur, sombong, dan riya', jp: 6 },
    { no: 10, bab: 'Asesmen Akhir Tahun (SAT) & Penguatan Karakter P5-PPRA', materi: 'Penilaian sumatif akhir tahun dan unjuk karya profil pelajar', jp: 4 },
  ];

  const totalSem1 = protaSem1.reduce((acc, r) => acc + r.jp, 0);
  const totalSem2 = protaSem2.reduce((acc, r) => acc + r.jp, 0);
  const totalTahun = totalSem1 + totalSem2;

  const handleCreateProtaDoc = () => {
    const sem1Text = protaSem1
      .map((r) => `${r.no}. ${r.bab} (${r.jp} JP)\n   Materi: ${r.materi}`)
      .join('\n');
    const sem2Text = protaSem2
      .map((r) => `${r.no}. ${r.bab} (${r.jp} JP)\n   Materi: ${r.materi}`)
      .join('\n');

    const newDoc = addDocument({
      judul: `Program Tahunan (PROTA) ${mapel} Kelas ${kelas} Tahun Pelajaran ${activeSchoolYear.tahun}`,
      tipe: 'PROTA',
      tipeLabel: 'Program Tahunan (PROTA)',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: `${totalTahun} JP / Tahun`,
      tujuanRingkas: `Program Tahunan pemetaan materi dan alokasi waktu tahun ajaran ${activeSchoolYear.tahun}`,
      sections: [
        {
          id: 'sec-prota-s1',
          title: `SEMESTER 1 / GANJIL (TOTAL: ${totalSem1} JP)`,
          content: sem1Text,
        },
        {
          id: 'sec-prota-s2',
          title: `SEMESTER 2 / GENAP (TOTAL: ${totalSem2} JP)`,
          content: sem2Text,
        },
      ],
      tags: ['PROTA', mapel, `Kelas ${kelas}`, 'Program Tahunan'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Program Tahunan (PROTA)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rancangan alokasi waktu satu tahun pelajaran untuk mencapai seluruh Capaian Pembelajaran MI.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateProtaDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Simpan & Buka Dokumen PROTA</span>
        </button>
      </div>

      {/* Selectors & Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div>
            <label className="font-semibold text-slate-700 mr-2">Mata Pelajaran:</label>
            <select
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 mr-2">Kelas:</label>
            <select
              value={kelas}
              onChange={(e) => setKelas(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <option key={k} value={k}>
                  Kelas {k} (Fase {k <= 2 ? 'A' : k <= 4 ? 'B' : 'C'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono font-bold">
          <span className="text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            Sem 1: {totalSem1} JP
          </span>
          <span className="text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            Sem 2: {totalSem2} JP
          </span>
          <span className="text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
            Total: {totalTahun} JP / Tahun
          </span>
        </div>
      </div>

      {/* Semester 1 Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-emerald-900 text-white flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            Semester 1 (Ganjil) — Alokasi: {totalSem1} JP
          </h2>
          <span className="text-xs text-emerald-200 font-mono">18 Pekan Efektif</span>
        </div>
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-[11px] uppercase">
            <tr>
              <th className="px-4 py-2.5 w-12 text-center">No</th>
              <th className="px-4 py-2.5">Tujuan Pembelajaran / Lingkup Materi Pokok</th>
              <th className="px-4 py-2.5">Rincian Materi</th>
              <th className="px-4 py-2.5 text-center w-28">Alokasi Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {protaSem1.map((row) => (
              <tr key={row.no} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-center font-bold text-slate-800">{row.no}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{row.bab}</td>
                <td className="px-4 py-3 text-slate-600">{row.materi}</td>
                <td className="px-4 py-3 text-center font-mono font-bold text-emerald-800">
                  {row.jp} JP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Semester 2 Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-slate-800 text-white flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            Semester 2 (Genap) — Alokasi: {totalSem2} JP
          </h2>
          <span className="text-xs text-slate-300 font-mono">18 Pekan Efektif</span>
        </div>
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-[11px] uppercase">
            <tr>
              <th className="px-4 py-2.5 w-12 text-center">No</th>
              <th className="px-4 py-2.5">Tujuan Pembelajaran / Lingkup Materi Pokok</th>
              <th className="px-4 py-2.5">Rincian Materi</th>
              <th className="px-4 py-2.5 text-center w-28">Alokasi Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {protaSem2.map((row) => (
              <tr key={row.no} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-center font-bold text-slate-800">{row.no}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{row.bab}</td>
                <td className="px-4 py-3 text-slate-600">{row.materi}</td>
                <td className="px-4 py-3 text-center font-mono font-bold text-emerald-800">
                  {row.jp} JP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CalendarRange, Plus, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PerencanaanPage: React.FC = () => {
  const { activeSchoolYear, activeSemester, subjects, addDocument, openPreviewDoc } = useApp();

  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);
  const [jumlahPekan, setJumlahPekan] = useState(24);
  const [pekanLibur, setPekanLibur] = useState(5);
  const [jpPerMinggu, setJpPerMinggu] = useState(2);

  const pekanEfektif = Math.max(0, jumlahPekan - pekanLibur);
  const totalJPEfektif = pekanEfektif * jpPerMinggu;
  const jpUlangan = 4;
  const jpCadangan = 2;
  const jpTatapMuka = Math.max(0, totalJPEfektif - jpUlangan - jpCadangan);

  const handleCreateRPEDoc = () => {
    const rpeContent = `
A. PERHITUNGAN PEKAN EFEKTIF SEMESTER ${activeSemester.semester.toUpperCase()}:
1. Jumlah Seluruh Pekan: ${jumlahPekan} Pekan
2. Jumlah Pekan Tidak Efektif (Libur Semester, MOS, dll): ${pekanLibur} Pekan
3. Jumlah Pekan Efektif Belajar: ${pekanEfektif} Pekan

B. DISTRIBUSI ALOKASI WAKTU JAM PELAJARAN:
1. Jam Pelajaran Efektif (${pekanEfektif} Pekan x ${jpPerMinggu} JP) = ${totalJPEfektif} JP
2. Alokasi Asesmen Sumatif (STS & SAS) = ${jpUlangan} JP
3. Alokasi Waktu Cadangan = ${jpCadangan} JP
4. Alokasi Tatap Muka Materi Pokok = ${jpTatapMuka} JP
    `.trim();

    const newDoc = addDocument({
      judul: `Rencana Pekan Efektif (RPE) ${mapel} Kelas ${kelas} Semester ${activeSemester.semester}`,
      tipe: 'RPE',
      tipeLabel: 'Rencana Pekan Efektif (RPE)',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: `${totalJPEfektif} JP / Semester`,
      tujuanRingkas: `Analisis alokasi jam tatap muka dan pekan efektif semester ${activeSemester.semester}`,
      sections: [
        {
          id: 'sec-rpe-1',
          title: 'I. ANALISIS PEKAN EFEKTIF DAN ALOKASI WAKTU',
          content: rpeContent,
        },
      ],
      tags: ['RPE', mapel, `Kelas ${kelas}`, 'Perencanaan'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <CalendarRange className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Perencanaan Pembelajaran & RPE
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis Rincian Pekan Efektif (RPE) dan pemetaan jam tatap muka guru per semester.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateRPEDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Simpan & Cetak Dokumen RPE</span>
        </button>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Parameter Perhitungan RPE
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
            <select
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
            <select
              value={kelas}
              onChange={(e) => setKelas(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <option key={k} value={k}>
                  Kelas {k} ({k <= 2 ? 'Fase A' : k <= 4 ? 'Fase B' : 'Fase C'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah Seluruh Pekan Semester
            </label>
            <input
              type="number"
              min={1}
              value={jumlahPekan}
              onChange={(e) => setJumlahPekan(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pekan Tidak Efektif (Libur & Penilaian)
            </label>
            <input
              type="number"
              min={0}
              value={pekanLibur}
              onChange={(e) => setPekanLibur(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alokasi JP per Minggu
            </label>
            <input
              type="number"
              min={1}
              value={jpPerMinggu}
              onChange={(e) => setJpPerMinggu(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Calculation Result Preview (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Ringkasan Hasil Perhitungan RPE
              </h2>
              <p className="text-xs text-slate-500">
                T.P. {activeSchoolYear.tahun} · Semester {activeSemester.semester}
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
              {pekanEfektif} Pekan Efektif
            </span>
          </div>

          {/* Stat metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Total Pekan</span>
              <span className="text-xl font-bold font-mono text-slate-900">{jumlahPekan}</span>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
              <span className="text-[11px] text-red-700 block">Tidak Efektif</span>
              <span className="text-xl font-bold font-mono text-red-800">{pekanLibur}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[11px] text-emerald-700 block">Pekan Efektif</span>
              <span className="text-xl font-bold font-mono text-emerald-800">{pekanEfektif}</span>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-center">
              <span className="text-[11px] text-teal-700 block">Total Beban JP</span>
              <span className="text-xl font-bold font-mono text-teal-800">{totalJPEfektif} JP</span>
            </div>
          </div>

          {/* Distribution Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-2.5">No</th>
                  <th className="px-4 py-2.5">Distribusi Peruntukan Jam Pelajaran</th>
                  <th className="px-4 py-2.5 text-center">Alokasi Waktu</th>
                  <th className="px-4 py-2.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-4 py-2.5 font-mono">1</td>
                  <td className="px-4 py-2.5 font-medium">Tatap Muka Pembelajaran Materi Pokok</td>
                  <td className="px-4 py-2.5 text-center font-mono font-bold text-emerald-800">
                    {jpTatapMuka} JP
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">Penyampaian materi dan LKPD</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono">2</td>
                  <td className="px-4 py-2.5 font-medium">Asesmen Sumatif (STS & SAS)</td>
                  <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-800">
                    {jpUlangan} JP
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">Tes tengah dan akhir semester</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono">3</td>
                  <td className="px-4 py-2.5 font-medium">Alokasi Waktu Cadangan & Remedial</td>
                  <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-800">
                    {jpCadangan} JP
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">Pengayaan dan pembinaan</td>
                </tr>
                <tr className="bg-slate-50/80 font-bold text-slate-900 border-t border-slate-200">
                  <td className="px-4 py-2.5" colSpan={2}>
                    Jumlah Total Jam Pelajaran Semester
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-emerald-800">
                    {totalJPEfektif} JP
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {pekanEfektif} Pekan Efektif x {jpPerMinggu} JP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

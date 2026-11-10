import React, { useState } from 'react';
import { Award, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RemedialItem } from '../types';

export const RemedialPage: React.FC = () => {
  const { remedials, addRemedial, subjects, classes, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [showForm, setShowForm] = useState(false);

  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState('Kelas 4-A');
  const [tpMateri, setTpMateri] = useState('Pelafalan & Makna Asmaul Husna Al-Malik');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [nilaiAwal, setNilaiAwal] = useState(60);
  const [nilaiAkhir, setNilaiAkhir] = useState(78);
  const [bentukRemedial, setBentukRemedial] = useState('Tutor sebaya dan penugasan lembar kerja mandiri');
  const [keterangan, setKeterangan] = useState<'Tuntas' | 'Belum Tuntas'>('Tuntas');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim()) return;

    addRemedial({
      mapel,
      kelas,
      tpMateri,
      namaSiswa,
      nilaiAwal: Number(nilaiAwal),
      nilaiAkhir: Number(nilaiAkhir),
      bentukRemedial,
      keterangan,
    });

    setNamaSiswa('');
    setShowForm(false);
  };

  const handleExportDoc = () => {
    const listText = remedials
      .map(
        (r, i) =>
          `${i + 1}. Siswa: ${r.namaSiswa} (${r.kelas}) - Mapel: ${r.mapel}\n` +
          `   Materi: ${r.tpMateri}\n` +
          `   Nilai Awal: ${r.nilaiAwal} -> Nilai Setelah Remedial: ${r.nilaiAkhir} (${r.keterangan})\n` +
          `   Bentuk Intervensi: ${r.bentukRemedial}`
      )
      .join('\n\n--------------------\n\n');

    const newDoc = addDocument({
      judul: `Laporan Pelaksanaan Program Remedial & Pengayaan Semester ${activeSemester.semester} T.P. ${activeSchoolYear.tahun}`,
      tipe: 'REMEDIAL',
      tipeLabel: 'Remedial dan Pengayaan',
      kelas: 4,
      fase: 'B',
      mataPelajaran: 'Seluruh Mapel',
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: 'Sesuai Pelaksanaan',
      tujuanRingkas: `Hasil pelaksanaan program tindak lanjut remedial dan pengayaan siswa`,
      sections: [
        {
          id: 'sec-rem-1',
          title: 'I. DAFTAR PELAKSANAAN REMEDIAL DAN PENGAYAAN PESERTA DIDIK',
          content: listText,
        },
      ],
      tags: ['Remedial', 'Pengayaan', 'Tindak Lanjut'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Program Remedial & Pengayaan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan intervensi perbaikan bagi siswa yang belum tuntas KKTP serta program akselerasi pengayaan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan Remedial</span>
          </button>
          <button
            onClick={handleExportDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-semibold transition-colors border border-emerald-300"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Cetak Dokumen Laporan</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            Tambah Data Siswa Remedial
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.namaKelas}>
                    {c.namaKelas}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Siswa</label>
              <input
                type="text"
                required
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                placeholder="Nama lengkap siswa..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materi / TP yang Belum Tuntas</label>
              <input
                type="text"
                value={tpMateri}
                onChange={(e) => setTpMateri(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai Awal (Sebelum)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={nilaiAwal}
                onChange={(e) => setNilaiAwal(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600 text-red-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai Akhir (Sesudah)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={nilaiAkhir}
                onChange={(e) => setNilaiAkhir(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600 text-emerald-800 font-bold"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bentuk Intervensi Pembelajaran</label>
              <input
                type="text"
                value={bentukRemedial}
                onChange={(e) => setBentukRemedial(e.target.value)}
                placeholder="Tutor sebaya, latihan terbimbing, bimbingan perorangan..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Ketercapaian</label>
              <select
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
              >
                <option value="Tuntas">Tuntas (Mencapai KKTP)</option>
                <option value="Belum Tuntas">Belum Tuntas</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
            >
              Simpan Data
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3 text-center w-12">No</th>
                <th className="px-4 py-3">Nama Siswa & Kelas</th>
                <th className="px-4 py-3">Mata Pelajaran & Materi</th>
                <th className="px-3 py-3 text-center w-24">Nilai Awal</th>
                <th className="px-3 py-3 text-center w-24">Nilai Akhir</th>
                <th className="px-4 py-3">Bentuk Intervensi</th>
                <th className="px-3 py-3 text-center w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {remedials.map((r, idx) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-3.5 text-center font-bold text-slate-700">{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 block">{r.namaSiswa}</span>
                    <span className="text-[11px] text-slate-400">{r.kelas}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-800 block">{r.mapel}</span>
                    <span className="text-[11px] text-slate-500">{r.tpMateri}</span>
                  </td>
                  <td className="px-3 py-3.5 text-center font-mono font-bold text-red-600">
                    {r.nilaiAwal}
                  </td>
                  <td className="px-3 py-3.5 text-center font-mono font-bold text-emerald-800">
                    {r.nilaiAkhir}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{r.bentukRemedial}</td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {r.keterangan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

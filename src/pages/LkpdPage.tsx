import React, { useState } from 'react';
import { FileCode, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LkpdPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [mapel, setMapel] = useState('Ilmu Pengetahuan Alam dan Sosial (IPAS)');
  const [kelas, setKelas] = useState(4);
  const [judulLKPD, setJudulLKPD] = useState('Eksplorasi Bagian Tubuh Tumbuhan dan Fungsinya');
  const [tujuan, setTujuan] = useState('Siswa mampu mengidentifikasi bagian akar, batang, dan daun tumbuhan');

  const sampleActivities = [
    'Amati tanaman yang dibawa oleh kelompok kalian dengan cermat.',
    'Pisahkan secara hati-hati antara bagian akar, batang, dan daun.',
    'Gambarkan bentuk pertulangan daun pada kolom yang telah disediakan (menyirip/menjari/sejajar).',
    'Diskusikan bersama kelompok: Mengapa tumbuhan memerlukan akar yang kokoh?',
  ];

  const handleCreateLKPDDoc = () => {
    const content = `
LEMBAR KERJA PESERTA DIDIK (LKPD)
Mata Pelajaran: ${mapel} | Kelas: ${kelas} (Fase ${kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C'})
Topik / Materi: ${judulLKPD}
Tahun Pelajaran: ${activeSchoolYear.tahun} | Semester: ${activeSemester.semester}

A. IDENTITAS SISWA / KELOMPOK:
Nama Kelompok: _____________________________
Anggota: 1. _______________ 2. _______________ 3. _______________ 4. _______________

B. TUJUAN AKTIVITAS:
${tujuan}

C. ALAT DAN BAHAN:
1. Sampel tanaman kecil berakar serabut dan tunggang
2. Kaca pembesar (lup)
3. Alat tulis dan lembar kerja

D. LANGKAH-LANGKAH EKSPLORASI:
${sampleActivities.map((act, i) => `${i + 1}. ${act}`).join('\n')}

E. TABEL HASIL PENGAMATAN:
[Tabel Kolom Pengamatan: Bagian Tumbuhan | Ciri-ciri Fisik | Fungsi Utama]

F. KESIMPULAN KELOMPOK:
Tuliskan kesimpulan apa yang kalian pelajari hari ini:
____________________________________________________________________________________
____________________________________________________________________________________
    `.trim();

    const newDoc = addDocument({
      judul: `LKPD ${mapel} Kelas ${kelas} - ${judulLKPD}`,
      tipe: 'LKPD',
      tipeLabel: 'Lembar Kerja Peserta Didik (LKPD)',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: '2 JP (2 x 35 Menit)',
      tujuanRingkas: `Lembar kerja aktivitas eksplorasi siswa: ${judulLKPD}`,
      sections: [
        {
          id: 'sec-lkpd-body',
          title: 'I. LEMBAR AKTIVITAS DAN TUGAS PESERTA DIDIK',
          content,
        },
      ],
      tags: ['LKPD', mapel, `Kelas ${kelas}`, 'Aktivitas'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Lembar Kerja Peserta Didik (LKPD)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Format lembar kegiatan siswa berbasis penemuan (inquiry), kolaborasi kelompok, dan penguatan karakter.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateLKPDDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Buat & Cetak LKPD</span>
        </button>
      </div>

      {/* Editor Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul / Topik LKPD</label>
            <input
              type="text"
              value={judulLKPD}
              onChange={(e) => setJudulLKPD(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tujuan Aktivitas Belajar</label>
            <input
              type="text"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Steps Preview */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Langkah Instruksi Aktivitas Siswa:
          </h2>
          <div className="space-y-2">
            {sampleActivities.map((act, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {i + 1}
                </span>
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

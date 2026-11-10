import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JournalEntry } from '../types';

export const JurnalPage: React.FC = () => {
  const { journalEntries, addJournalEntry, deleteJournalEntry, subjects, classes, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [showForm, setShowForm] = useState(false);

  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kelas, setKelas] = useState('Kelas 4-A');
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [jamKe, setJamKe] = useState('Jam ke 1-2 (07.30 - 08.40)');
  const [materiPokok, setMateriPokok] = useState('');
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState('');
  const [jumlahHadir, setJumlahHadir] = useState(30);
  const [jumlahAbsen, setJumlahAbsen] = useState(0);
  const [catatanSiswa, setCatatanSiswa] = useState('');
  const [kendalaDanRefleksi, setKendalaDanRefleksi] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiPokok.trim()) return;

    addJournalEntry({
      tanggal,
      kelas,
      mataPelajaran: mapel,
      jamKe,
      materiPokok,
      tujuanPembelajaran: tujuanPembelajaran || 'Mencapai indikator materi pokok',
      jumlahHadir: Number(jumlahHadir),
      jumlahAbsen: Number(jumlahAbsen),
      catatanSiswa: catatanSiswa || 'Seluruh siswa tertib dan aktif.',
      kendalaDanRefleksi: kendalaDanRefleksi || 'Pembelajaran berjalan lancar sesuai rencana.',
    });

    setMateriPokok('');
    setTujuanPembelajaran('');
    setCatatanSiswa('');
    setKendalaDanRefleksi('');
    setShowForm(false);
  };

  const handleExportJournalDoc = () => {
    const journalText = journalEntries
      .map(
        (j, i) =>
          `Pertemuan ${i + 1} (${j.tanggal}) - ${j.kelas} - ${j.jamKe}\n` +
          `Mata Pelajaran: ${j.mataPelajaran}\n` +
          `Materi Pokok: ${j.materiPokok}\n` +
          `Kehadiran: ${j.jumlahHadir} Hadir / ${j.jumlahAbsen} Absen\n` +
          `Catatan Siswa: ${j.catatanSiswa}\n` +
          `Refleksi Guru: ${j.kendalaDanRefleksi}`
      )
      .join('\n\n----------------------------------------\n\n');

    const newDoc = addDocument({
      judul: `Buku Jurnal Mengajar Harian Guru - Semester ${activeSemester.semester} T.P. ${activeSchoolYear.tahun}`,
      tipe: 'JURNAL',
      tipeLabel: 'Jurnal Mengajar',
      kelas: 4,
      fase: 'B',
      mataPelajaran: 'Seluruh Mapel Diampu',
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: '1 Semester',
      tujuanRingkas: `Catatan harian pelaksanaan pembelajaran tatap muka di kelas`,
      sections: [
        {
          id: 'sec-jurnal-1',
          title: 'I. REKAPITULASI CATATAN JURNAL MENGAJAR HARIAN',
          content: journalText,
        },
      ],
      tags: ['Jurnal', 'Administrasi Guru', 'Presensi', 'Refleksi'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Jurnal Mengajar Harian Guru
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Catatan autentik tatap muka, kehadiran siswa, capaian materi, dan refleksi pembelajaran di kelas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Isi Jurnal Hari Ini</span>
          </button>
          <button
            onClick={handleExportJournalDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-semibold transition-colors border border-emerald-300"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Cetak Buku Jurnal</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            Tambah Catatan Jurnal Mengajar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Tatap Muka</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas / Rombel</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Pelajaran ke-</label>
              <input
                type="text"
                value={jamKe}
                onChange={(e) => setJamKe(e.target.value)}
                placeholder="Misal: Jam ke 1-2 (07.30 - 08.40)"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Materi Pokok / Bab</label>
              <input
                type="text"
                required
                value={materiPokok}
                onChange={(e) => setMateriPokok(e.target.value)}
                placeholder="Contoh: Kalimah Thayyibah Subhanallah"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tujuan Pembelajaran</label>
              <input
                type="text"
                value={tujuanPembelajaran}
                onChange={(e) => setTujuanPembelajaran(e.target.value)}
                placeholder="Capaian kompetensi pada tatap muka ini"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Siswa Hadir</label>
              <input
                type="number"
                min={0}
                value={jumlahHadir}
                onChange={(e) => setJumlahHadir(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Siswa Tidak Hadir (Absen)</label>
              <input
                type="number"
                min={0}
                value={jumlahAbsen}
                onChange={(e) => setJumlahAbsen(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Khusus Siswa / Kejadian</label>
              <input
                type="text"
                value={catatanSiswa}
                onChange={(e) => setCatatanSiswa(e.target.value)}
                placeholder="Catatan siswa sakit, izin, atau berprestasi..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kendala Pembelajaran & Refleksi Tindak Lanjut Guru
              </label>
              <input
                type="text"
                value={kendalaDanRefleksi}
                onChange={(e) => setKendalaDanRefleksi(e.target.value)}
                placeholder="Evaluasi proses mengajar dan rencana tindak lanjut pertemuan berikutnya..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
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
              Simpan Jurnal
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-3">
        {journalEntries.map((j) => (
          <div
            key={j.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                  {j.tanggal}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {j.kelas}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-700">{j.mataPelajaran}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-[11px] text-slate-500">{j.jamKe}</span>
              </div>

              <h2 className="text-sm font-bold text-slate-900">{j.materiPokok}</h2>
              <p className="text-xs text-slate-600">
                <strong className="text-slate-800">Tujuan:</strong> {j.tujuanPembelajaran}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block">Presensi & Catatan Siswa:</span>
                  <span className="text-emerald-800 font-mono font-bold mr-2">{j.jumlahHadir} Hadir</span>
                  <span className="text-red-700 font-mono">{j.jumlahAbsen} Absen</span>
                  <p className="text-[11px] text-slate-600 mt-1">{j.catatanSiswa}</p>
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-[11px] font-semibold text-emerald-900 block">Refleksi Guru:</span>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{j.kendalaDanRefleksi}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => deleteJournalEntry(j.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg self-end sm:self-start"
              title="Hapus Catatan Jurnal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {journalEntries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Belum ada catatan jurnal mengajar</h3>
            <p className="text-xs text-slate-500 mt-1">Klik tombol 'Isi Jurnal Hari Ini' untuk memulai mencatat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuestionItem } from '../types';

export const BankSoalPage: React.FC = () => {
  const { questions, addQuestion, deleteQuestion, subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [selectedMapel, setSelectedMapel] = useState('ALL');
  const [selectedKelas, setSelectedKelas] = useState<number | 'ALL'>('ALL');

  const [showAddForm, setShowAddForm] = useState(false);
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);
  const [bab, setBab] = useState('Kalimah Thayyibah');
  const [bentukSoal, setBentukSoal] = useState<QuestionItem['bentukSoal']>('Pilihan Ganda');
  const [tingkatKesulitan, setTingkatKesulitan] = useState<QuestionItem['tingkatKesulitan']>('Sedang');
  const [pertanyaan, setPertanyaan] = useState('');
  const [kunciJawaban, setKunciJawaban] = useState('');
  const [pembahasan, setPembahasan] = useState('');

  const filtered = questions.filter((q) => {
    const matchMapel = selectedMapel === 'ALL' || q.mapel === selectedMapel;
    const matchKelas = selectedKelas === 'ALL' || q.kelas === selectedKelas;
    return matchMapel && matchKelas;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pertanyaan.trim()) return;

    addQuestion({
      mapel,
      kelas,
      bab,
      indikator: `Mampu memahami ${bab}`,
      bentukSoal,
      tingkatKesulitan,
      pertanyaan,
      kunciJawaban,
      pembahasan,
    });

    setPertanyaan('');
    setKunciJawaban('');
    setPembahasan('');
    setShowAddForm(false);
  };

  const handleExportToExamDoc = () => {
    const questionsText = filtered
      .map(
        (q, idx) =>
          `Soal No. ${idx + 1} (${q.bentukSoal} - Tingkat: ${q.tingkatKesulitan})\n${q.pertanyaan}\n${
            q.pilihan ? q.pilihan.join('\n') + '\n' : ''
          }Kunci Jawaban: ${q.kunciJawaban}\nPembahasan: ${q.pembahasan}`
      )
      .join('\n\n--------------------\n\n');

    const newDoc = addDocument({
      judul: `Paket Naskah Soal ${selectedMapel === 'ALL' ? 'MI' : selectedMapel} Kelas ${selectedKelas === 'ALL' ? '4' : selectedKelas}`,
      tipe: 'BANK_SOAL',
      tipeLabel: 'Bank Soal',
      kelas: typeof selectedKelas === 'number' ? selectedKelas : 4,
      fase: (typeof selectedKelas === 'number' ? selectedKelas : 4) <= 2 ? 'A' : 'B',
      mataPelajaran: selectedMapel === 'ALL' ? 'Akidah Akhlak' : selectedMapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: '60 Menit',
      tujuanRingkas: `Naskah butir soal evaluasi pembelajaran peserta didik`,
      sections: [
        {
          id: 'sec-bank-soal-1',
          title: 'I. BUTIR SOAL DAN KISI-KISI EVALUASI',
          content: questionsText,
        },
      ],
      tags: ['Bank Soal', 'Ujian', 'KMA 450'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Bank Soal Madrasah Ibtidaiyah
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Koleksi butir soal Pilihan Ganda, Isian, dan Uraian HOTS beserta kunci jawaban dan pembahasan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal</span>
          </button>
          <button
            onClick={handleExportToExamDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-semibold transition-colors border border-emerald-300"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Cetak Paket Ujian</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            Tambah Butir Soal Baru
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
                onChange={(e) => setKelas(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                {[1, 2, 3, 4, 5, 6].map((k) => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bentuk Soal</label>
              <select
                value={bentukSoal}
                onChange={(e) => setBentukSoal(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Isian Singkat">Isian Singkat</option>
                <option value="Uraian">Uraian</option>
                <option value="Benar/Salah">Benar / Salah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kesulitan</label>
              <select
                value={tingkatKesulitan}
                onChange={(e) => setTingkatKesulitan(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sukar">Sukar (HOTS)</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Pertanyaan</label>
              <textarea
                rows={3}
                required
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                placeholder="Tuliskan butir soal di sini..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kunci Jawaban</label>
              <input
                type="text"
                value={kunciJawaban}
                onChange={(e) => setKunciJawaban(e.target.value)}
                placeholder="Kunci jawaban benar..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pembahasan / Penjelasan</label>
              <input
                type="text"
                value={pembahasan}
                onChange={(e) => setPembahasan(e.target.value)}
                placeholder="Pembahasan materi terkait..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
            >
              Simpan Soal
            </button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3 text-xs">
        <span className="font-semibold text-slate-600">Filter Bank Soal:</span>
        <select
          value={selectedMapel}
          onChange={(e) => setSelectedMapel(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
        >
          <option value="ALL">Semua Mapel</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.nama}>
              {s.nama}
            </option>
          ))}
        </select>

        <select
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
        >
          <option value="ALL">Semua Kelas</option>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <option key={k} value={k}>
              Kelas {k}
            </option>
          ))}
        </select>

        <span className="ml-auto text-slate-500 font-mono">
          Menampilkan {filtered.length} Soal
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-900">{q.mapel} · Kelas {q.kelas}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-[11px] font-semibold text-slate-500">{q.bab}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {q.bentukSoal}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    q.tingkatKesulitan === 'Mudah'
                      ? 'bg-blue-50 text-blue-800'
                      : q.tingkatKesulitan === 'Sedang'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {q.tingkatKesulitan}
                </span>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded"
                  title="Hapus Soal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed pl-8">
              {q.pertanyaan}
            </p>

            {q.pilihan && (
              <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                {q.pilihan.map((p, pIdx) => (
                  <div key={pIdx} className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    {p}
                  </div>
                ))}
              </div>
            )}

            <div className="pl-8 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <span className="text-emerald-800 font-semibold">
                Kunci Jawaban: <span className="font-bold underline">{q.kunciJawaban}</span>
              </span>
              {q.pembahasan && (
                <span className="text-slate-500 text-[11px] italic">
                  Pembahasan: {q.pembahasan}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

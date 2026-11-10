import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Plus, FileText, ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TujuanPembelajaranPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();

  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);
  const [kompetensiKKO, setKompetensiKKO] = useState('Menjelaskan dan mempraktikkan');
  const [kontenMateri, setKontenMateri] = useState('makna kalimat thayyibah Subhanallah dan Masya Allah');
  const [konteks, setKonteks] = useState('dalam interaksi sosial dan tadabbur keindahan alam sehari-hari');

  const generatedTP = `Peserta didik mampu ${kompetensiKKO} ${kontenMateri} ${konteks}.`;

  const [tpList, setTpList] = useState<string[]>([
    'Peserta didik mampu melafalkan dan mengartikan kalimat thayyibah Subhanallah dan Masya Allah dengan benar.',
    'Peserta didik mampu membedakan waktu dan situasi penggunaan kalimat Subhanallah dan Masya Allah.',
    'Peserta didik mampu membiasakan mengucapkan kalimat thayyibah saat takjub melihat ciptaan Allah SWT.',
  ]);

  const handleAddToList = () => {
    if (!kontenMateri.trim()) return;
    setTpList([...tpList, generatedTP]);
  };

  const handleCreateTPDoc = () => {
    const content = `
DAFTAR TUJUAN PEMBELAJARAN (TP)
Mata Pelajaran: ${mapel}
Kelas: ${kelas} (Fase ${kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C'})
Tahun Pelajaran: ${activeSchoolYear.tahun}

URAIAN TUJUAN PEMBELAJARAN:
${tpList.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}
    `.trim();

    const newDoc = addDocument({
      judul: `Tujuan Pembelajaran (TP) ${mapel} Kelas ${kelas}`,
      tipe: 'TP',
      tipeLabel: 'Tujuan Pembelajaran (TP)',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: '1 Semester',
      tujuanRingkas: `Rumusan Tujuan Pembelajaran mapel ${mapel} Kelas ${kelas}`,
      sections: [
        {
          id: 'sec-tp-1',
          title: 'I. RUMUSAN TUJUAN PEMBELAJARAN (KOMPETENSI & KONTEN)',
          content,
        },
      ],
      tags: ['TP', mapel, `Kelas ${kelas}`, 'Taksonomi Bloom'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Perumusan Tujuan Pembelajaran (TP)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rumuskan TP dari CP dengan formula: Kompetensi (KKO Bloom) + Lingkup Materi Konten + Variasi Konteks.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateTPDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Simpan Dokumen TP</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Formulasi Kata Kerja Operasional (KKO)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                    Kelas {k} ({k <= 2 ? 'Fase A' : k <= 4 ? 'Fase B' : 'Fase C'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              1. Kompetensi (KKO Taksonomi Bloom)
            </label>
            <input
              type="text"
              value={kompetensiKKO}
              onChange={(e) => setKompetensiKKO(e.target.value)}
              placeholder="Contoh: Menjelaskan, menganalisis, mempraktikkan..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              2. Konten Materi Pokok
            </label>
            <input
              type="text"
              value={kontenMateri}
              onChange={(e) => setKontenMateri(e.target.value)}
              placeholder="Contoh: konsep shalat berjamaah dan adab masjid..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              3. Variasi Konteks & Karakter PPRA
            </label>
            <input
              type="text"
              value={konteks}
              onChange={(e) => setKonteks(e.target.value)}
              placeholder="Contoh: dengan penuh keteladanan (Qudwah) dalam kehidupan sehari-hari"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-900 block mb-1">Hasil Rumusan Kalimat TP:</span>
            <p className="text-emerald-950 font-medium leading-relaxed italic">
              "{generatedTP}"
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToList}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambahkan ke Daftar TP</span>
          </button>
        </div>

        {/* TP List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Daftar Tujuan Pembelajaran ({tpList.length})
              </h2>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {mapel}
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {tpList.map((tp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">{tp}</p>
                  </div>
                  <button
                    onClick={() => setTpList(tpList.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-red-600 shrink-0 text-xs"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Siap disusun menjadi Alur TP (ATP)</span>
            <button
              onClick={handleCreateTPDoc}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Jadikan Dokumen Dinas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

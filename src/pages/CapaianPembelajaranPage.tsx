import React, { useState } from 'react';
import { Target, Search, FileText, BookOpen, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleCPData } from '../data/initialData';

export const CapaianPembelajaranPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [selectedFase, setSelectedFase] = useState<'A' | 'B' | 'C' | 'ALL'>('ALL');
  const [selectedMapel, setSelectedMapel] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredCP = sampleCPData.filter((item) => {
    const matchFase = selectedFase === 'ALL' || item.fase === selectedFase;
    const matchMapel = selectedMapel === 'ALL' || item.mapel === selectedMapel;
    const matchSearch =
      search === '' ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
      item.elemen.toLowerCase().includes(search.toLowerCase()) ||
      item.mapel.toLowerCase().includes(search.toLowerCase());
    return matchFase && matchMapel && matchSearch;
  });

  const handleExportToDoc = (cpItem: typeof sampleCPData[0]) => {
    const newDoc = addDocument({
      judul: `Capaian Pembelajaran (CP) ${cpItem.mapel} Fase ${cpItem.fase} Elemen ${cpItem.elemen}`,
      tipe: 'CP',
      tipeLabel: 'Capaian Pembelajaran (CP)',
      kelas: cpItem.fase === 'A' ? 1 : cpItem.fase === 'B' ? 4 : 5,
      fase: cpItem.fase as 'A' | 'B' | 'C',
      mataPelajaran: cpItem.mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: 'Sesuai Fase',
      tujuanRingkas: `Capaian Pembelajaran resmi Kemenag RI Elemen ${cpItem.elemen}`,
      sections: [
        {
          id: 'sec-cp-1',
          title: `ELEMEN: ${cpItem.elemen.toUpperCase()}`,
          content: cpItem.deskripsi,
        },
      ],
      tags: ['CP', `Fase ${cpItem.fase}`, cpItem.mapel, 'KMA 450'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Pustaka Capaian Pembelajaran (CP)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar Capaian Pembelajaran resmi KMA 450 Tahun 2024 Kementerian Agama RI per elemen materi.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg">
          Kemenag RI & BSKAP
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kata kunci CP (contoh: rukun iman, shalat, huruf hijaiyah)..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedFase}
            onChange={(e) => setSelectedFase(e.target.value as any)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          >
            <option value="ALL">Semua Fase</option>
            <option value="A">Fase A (Kelas 1–2)</option>
            <option value="B">Fase B (Kelas 3–4)</option>
            <option value="C">Fase C (Kelas 5–6)</option>
          </select>

          <select
            value={selectedMapel}
            onChange={(e) => setSelectedMapel(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          >
            <option value="ALL">Semua Mapel</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.nama}>
                {s.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCP.map((cp, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono">
                    Fase {cp.fase}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{cp.kelas}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Elemen {cp.elemen}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 mt-2">{cp.mapel}</h2>
              <p className="mt-3 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                "{cp.deskripsi}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Kurikulum Merdeka MI</span>
              <button
                onClick={() => handleExportToDoc(cp)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Jadikan Dokumen</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

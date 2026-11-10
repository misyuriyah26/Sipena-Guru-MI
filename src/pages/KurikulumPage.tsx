import React from 'react';
import { BookOpen, CheckCircle2, ShieldCheck, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KurikulumPage: React.FC = () => {
  const { curriculums, activeCurriculum, setActiveCurriculumId } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Pengaturan Kurikulum Madrasah
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar acuan Capaian Pembelajaran (CP) dan struktur alokasi waktu mata pelajaran Kementerian Agama RI.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
          KMA 450 Tahun 2024
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curriculums.map((curr) => {
          const isActive = curr.id === activeCurriculum.id;
          return (
            <div
              key={curr.id}
              className={`rounded-2xl p-6 border transition-all ${
                isActive
                  ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono">
                    {curr.kode}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1.5">{curr.nama}</h2>
                </div>
                {isActive && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-700 text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Digunakan</span>
                  </span>
                )}
              </div>

              <div className="mt-4 p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block mb-1">Landasan Regulasi:</span>
                <p className="leading-relaxed">{curr.regulasi}</p>
              </div>

              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Struktur Fase MI:</span>
                <div className="space-y-1.5 text-xs">
                  {curr.fase.map((f: { fase: string; kelas: number[]; deskripsi: string }) => (
                    <div
                      key={f.fase}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <div className="font-semibold text-slate-900">
                        Fase {f.fase} (Kelas {f.kelas.join(' & ')})
                      </div>
                      <div className="text-[11px] text-slate-500">{f.deskripsi}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                {isActive ? (
                  <div className="w-full text-center py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">
                    Kurikulum Sedang Aktif
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveCurriculumId(curr.id)}
                    className="w-full py-2 bg-white hover:bg-emerald-600 hover:text-white border border-slate-300 hover:border-emerald-600 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                  >
                    Terapkan Kurikulum Ini
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

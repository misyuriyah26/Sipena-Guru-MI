import React from 'react';
import { Clock, CheckCircle2, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SemesterPage: React.FC = () => {
  const { semesters, activeSemester, setActiveSemesterId, activeSchoolYear } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Pengaturan Semester Aktif
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih semester aktif untuk penyusunan Program Semester (PROMES), RPE, dan pengolahan nilai rapor.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          T.P. Berjalan: <strong className="text-slate-800">{activeSchoolYear.tahun}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {semesters.map((sem) => {
          const isActive = sem.id === activeSemester.id;
          return (
            <div
              key={sem.id}
              className={`rounded-2xl p-6 border transition-all ${
                isActive
                  ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Semester {sem.nomor}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    Semester {sem.semester}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {sem.nomor === 1
                      ? 'Periode Juli - Desember'
                      : 'Periode Januari - Juni'}
                  </p>
                </div>
                {isActive && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-700 text-white shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aktif</span>
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-3 pt-4 border-t border-slate-200/70 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Jumlah Pekan Efektif:</span>
                  <span className="font-mono font-bold text-slate-900">{sem.pekanEfektif} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>Pekan Tidak Efektif (Libur/PTS):</span>
                  <span className="font-mono text-slate-700">{sem.pekanTidakEfektif} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Pekan Semester:</span>
                  <span className="font-mono font-semibold text-slate-900">{sem.totalPekan} Pekan</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-dashed border-slate-200">
                  <span>Perkiraan Bagi Rapor:</span>
                  <span className="font-semibold text-emerald-800">{sem.tanggalBagiRapor}</span>
                </div>
              </div>

              <div className="mt-6 pt-4">
                {isActive ? (
                  <div className="w-full text-center py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold">
                    Semester Sedang Digunakan
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveSemesterId(sem.id)}
                    className="w-full py-2 bg-white hover:bg-emerald-600 hover:text-white border border-slate-300 hover:border-emerald-600 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-xs"
                  >
                    Aktifkan Semester {sem.semester}
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

import React, { useState } from 'react';
import { CalendarDays, Plus, Check, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchoolYear } from '../types';

export const TahunPelajaranPage: React.FC = () => {
  const { schoolYears, setSchoolYears, activeSchoolYear, setActiveSchoolYearId } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTahun, setNewTahun] = useState('');
  const [tglMulai, setTglMulai] = useState('2025-07-14');
  const [tglSelesai, setTglSelesai] = useState('2026-06-20');
  const [keterangan, setKeterangan] = useState('');

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTahun.trim()) return;

    const newYear: SchoolYear = {
      id: `sy-${Date.now()}`,
      tahun: newTahun.trim(),
      statusAktif: false,
      tanggalMulai: tglMulai,
      tanggalSelesai: tglSelesai,
      keterangan: keterangan || 'Tahun Pelajaran Baru',
    };

    setSchoolYears((prev) => [...prev, newYear]);
    setNewTahun('');
    setKeterangan('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Pengaturan Tahun Pelajaran
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola daftar tahun pelajaran aktif untuk penataan kurikulum dan arsip dokumen madrasah.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tahun Pelajaran</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddYear} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Tambah Tahun Pelajaran Baru
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tahun Pelajaran
              </label>
              <input
                type="text"
                required
                value={newTahun}
                onChange={(e) => setNewTahun(e.target.value)}
                placeholder="Contoh: 2026/2027"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Mulai (Awal Semester 1)
              </label>
              <input
                type="date"
                required
                value={tglMulai}
                onChange={(e) => setTglMulai(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Selesai (Akhir Semester 2)
              </label>
              <input
                type="date"
                required
                value={tglSelesai}
                onChange={(e) => setTglSelesai(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan</label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan regulasi atau fase penerapan..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
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
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {schoolYears.map((year) => {
            const isActive = year.id === activeSchoolYear.id;
            return (
              <div
                key={year.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isActive ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-900">
                      {year.tahun}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-700 text-white">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Sedang Aktif</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Arsip / Riwayat</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Periode: <span className="font-mono">{year.tanggalMulai}</span> s/d{' '}
                    <span className="font-mono">{year.tanggalSelesai}</span>
                  </p>
                  {year.keterangan && (
                    <p className="text-xs text-slate-600 mt-0.5 italic">{year.keterangan}</p>
                  )}
                </div>

                <div>
                  {isActive ? (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                      Tahun Pelajaran Utama
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveSchoolYearId(year.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:border-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Jadikan Aktif
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Clock, MapPin, School } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AgendaEntry } from '../types';

export const AgendaPage: React.FC = () => {
  const { agendaEntries, addAgendaEntry, deleteAgendaEntry, classes, subjects } = useApp();
  const [showForm, setShowForm] = useState(false);

  const [hari, setHari] = useState('Senin');
  const [jamMulai, setJamMulai] = useState('07.30');
  const [jamSelesai, setJamSelesai] = useState('08.40');
  const [kelas, setKelas] = useState('Kelas 4-A');
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [ruang, setRuang] = useState('Gedung B R.02');
  const [kegiatanKhusus, setKegiatanKhusus] = useState('');

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAgendaEntry({
      hari,
      jamMulai,
      jamSelesai,
      kelas,
      mataPelajaran: mapel,
      ruang,
      kegiatanKhusus: kegiatanKhusus || undefined,
    });
    setKegiatanKhusus('');
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Agenda & Jadwal Mengajar Mingguan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Jadwal tatap muka rutin, pembiasaan shalat dhuha, upacara bendera, dan agenda khusus madrasah.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Agenda</span>
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            Tambah Agenda Jadwal Baru
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hari</label>
              <select
                value={hari}
                onChange={(e) => setHari(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Mulai</label>
              <input
                type="text"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                placeholder="07.30"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Selesai</label>
              <input
                type="text"
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
                placeholder="08.40"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option value="Seluruh MI">Seluruh MI (Bersama)</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.namaKelas}>
                    {c.namaKelas}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran / Aktivitas</label>
              <input
                type="text"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ruangan / Tempat</label>
              <input
                type="text"
                value={ruang}
                onChange={(e) => setRuang(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan Khusus</label>
              <input
                type="text"
                value={kegiatanKhusus}
                onChange={(e) => setKegiatanKhusus(e.target.value)}
                placeholder="Misal: Praktik wudhu & shalat berjamaah..."
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
              Simpan Jadwal
            </button>
          </div>
        </form>
      )}

      {/* Schedule by Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((dayName) => {
          const items = agendaEntries.filter((a) => a.hari === dayName);
          return (
            <div key={dayName} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="font-bold text-sm text-slate-900">{dayName}</h2>
                  <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {items.length} Sesi
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {items.map((it) => (
                    <div key={it.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 group">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-800">
                          {it.jamMulai} - {it.jamSelesai}
                        </span>
                        <button
                          onClick={() => deleteAgendaEntry(it.id)}
                          className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-bold text-slate-900">{it.mataPelajaran}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>{it.kelas}</span>
                        <span>{it.ruang}</span>
                      </div>
                      {it.kegiatanKhusus && (
                        <p className="text-[10px] text-emerald-700 font-medium italic pt-0.5">
                          {it.kegiatanKhusus}
                        </p>
                      )}
                    </div>
                  ))}

                  {items.length === 0 && (
                    <p className="text-center py-6 text-slate-400 text-xs italic">
                      Tidak ada jadwal mengajar.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

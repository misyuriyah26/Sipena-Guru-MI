import React, { useState } from 'react';
import { BookMarked, Plus, Clock, Trash2, Edit2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Subject } from '../types';

export const DataMapelPage: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, requestConfirm } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<Subject['kategori']>('Pendidikan Agama Islam');
  const [jpPerMinggu, setJpPerMinggu] = useState(2);
  const [ringkasan, setRingkasan] = useState('');

  const resetForm = () => {
    setKode('');
    setNama('');
    setKategori('Pendidikan Agama Islam');
    setJpPerMinggu(2);
    setRingkasan('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (s: Subject) => {
    setEditingId(s.id);
    setKode(s.kode);
    setNama(s.nama);
    setKategori(s.kategori);
    setJpPerMinggu(s.jpPerMinggu);
    setRingkasan(s.ringkasan);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    if (editingId) {
      updateSubject(editingId, {
        kode: kode || nama.slice(0, 3).toUpperCase(),
        nama,
        kategori,
        jpPerMinggu: Number(jpPerMinggu),
        ringkasan,
      });
    } else {
      addSubject({
        kode: kode || nama.slice(0, 3).toUpperCase(),
        nama,
        kategori,
        jpPerMinggu: Number(jpPerMinggu),
        kelas: [1, 2, 3, 4, 5, 6],
        ringkasan,
      });
    }
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    requestConfirm('Hapus Mata Pelajaran', `Apakah Anda yakin ingin menghapus "${name}"?`, () => {
      deleteSubject(id);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Data Mata Pelajaran Madrasah Ibtidaiyah
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Struktur mata pelajaran Pendidikan Agama Islam (Kemenag), Bahasa Arab, Mapel Umum & Muatan Lokal.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mata Pelajaran</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            {editingId ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Mapel</label>
              <input
                type="text"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="Contoh: AA / FIQ"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mata Pelajaran</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Akidah Akhlak"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Beban Jam (JP / Minggu)</label>
              <input
                type="number"
                min={1}
                value={jpPerMinggu}
                onChange={(e) => setJpPerMinggu(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kelompok Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as Subject['kategori'])}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option value="Pendidikan Agama Islam">Pendidikan Agama Islam (PAI)</option>
                <option value="Bahasa Arab">Bahasa Arab</option>
                <option value="Mata Pelajaran Umum">Mata Pelajaran Umum</option>
                <option value="Muatan Lokal">Muatan Lokal</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
              <input
                type="text"
                value={ringkasan}
                onChange={(e) => setRingkasan(e.target.value)}
                placeholder="Fokus capaian dan materi utama..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
            >
              {editingId ? 'Simpan' : 'Tambahkan'}
            </button>
          </div>
        </form>
      )}

      {/* Subjects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Kode</th>
                <th className="px-4 py-3.5">Nama Mata Pelajaran</th>
                <th className="px-4 py-3.5">Kelompok</th>
                <th className="px-4 py-3.5 text-center">Beban JP/Minggu</th>
                <th className="px-4 py-3.5">Ringkasan Materi</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{sub.kode}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{sub.nama}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        sub.kategori === 'Pendidikan Agama Islam'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : sub.kategori === 'Bahasa Arab'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {sub.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-slate-900">
                    {sub.jpPerMinggu} JP
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{sub.ringkasan}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id, sub.nama)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

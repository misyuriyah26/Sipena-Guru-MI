import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Edit2, Users, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassGrade } from '../types';

export const DataKelasPage: React.FC = () => {
  const { classes, addClass, updateClass, deleteClass, requestConfirm } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tingkat, setTingkat] = useState(1);
  const [namaKelas, setNamaKelas] = useState('');
  const [rombel, setRombel] = useState('A');
  const [siswaL, setSiswaL] = useState(15);
  const [siswaP, setSiswaP] = useState(15);
  const [waliKelas, setWaliKelas] = useState('');
  const [ruang, setRuang] = useState('Gedung A R.01');

  const resetForm = () => {
    setTingkat(1);
    setNamaKelas('');
    setRombel('A');
    setSiswaL(15);
    setSiswaP(15);
    setWaliKelas('');
    setRuang('Gedung A R.01');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (c: ClassGrade) => {
    setEditingId(c.id);
    setTingkat(c.tingkat);
    setNamaKelas(c.namaKelas);
    setRombel(c.rombel);
    setSiswaL(c.jumlahSiswaL);
    setSiswaP(c.jumlahSiswaP);
    setWaliKelas(c.waliKelas);
    setRuang(c.ruang);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fase = tingkat <= 2 ? 'A' : tingkat <= 4 ? 'B' : 'C';
    const finalName = namaKelas.trim() || `Kelas ${tingkat}-${rombel}`;

    if (editingId) {
      updateClass(editingId, {
        tingkat,
        fase,
        namaKelas: finalName,
        rombel,
        jumlahSiswaL: Number(siswaL),
        jumlahSiswaP: Number(siswaP),
        waliKelas,
        ruang,
      });
    } else {
      addClass({
        tingkat,
        fase,
        namaKelas: finalName,
        rombel,
        jumlahSiswaL: Number(siswaL),
        jumlahSiswaP: Number(siswaP),
        waliKelas,
        ruang,
      });
    }
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    requestConfirm('Hapus Data Kelas', `Apakah Anda yakin ingin menghapus "${name}"?`, () => {
      deleteClass(id);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Data Kelas (Tingkat 1 s/d 6)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemetaan rombongan belajar dan fase perkembangan (Fase A, B, C) Madrasah Ibtidaiyah.
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
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            {editingId ? 'Edit Data Kelas' : 'Tambah Rombongan Belajar Baru'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
              <select
                value={tingkat}
                onChange={(e) => setTingkat(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    Kelas {num} (Fase {num <= 2 ? 'A' : num <= 4 ? 'B' : 'C'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Rombel / Kelas</label>
              <input
                type="text"
                value={namaKelas}
                onChange={(e) => setNamaKelas(e.target.value)}
                placeholder="Contoh: Kelas 4-A (Bilal bin Rabah)"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Rombel</label>
              <input
                type="text"
                value={rombel}
                onChange={(e) => setRombel(e.target.value)}
                placeholder="A / B / C"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Siswa Laki-laki</label>
              <input
                type="number"
                min={0}
                value={siswaL}
                onChange={(e) => setSiswaL(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Siswa Perempuan</label>
              <input
                type="number"
                min={0}
                value={siswaP}
                onChange={(e) => setSiswaP(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wali Kelas</label>
              <input
                type="text"
                value={waliKelas}
                onChange={(e) => setWaliKelas(e.target.value)}
                placeholder="Nama guru wali kelas..."
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
              {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
            </button>
          </div>
        </form>
      )}

      {/* Grid of classes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const total = cls.jumlahSiswaL + cls.jumlahSiswaP;
          return (
            <div
              key={cls.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      Fase {cls.fase} · Kelas {cls.tingkat}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{cls.namaKelas}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Rombel {cls.rombel}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Wali Kelas:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                      {cls.waliKelas || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ruang Kelas:</span>
                    <span className="text-slate-700">{cls.ruang || '-'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100 font-mono">
                    <span>Jumlah Siswa:</span>
                    <span className="font-bold text-emerald-800">
                      {total} Siswa ({cls.jumlahSiswaL} L / {cls.jumlahSiswaP} P)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEditClick(cls)}
                  className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1"
                  title="Edit Data"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cls.id, cls.namaKelas)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs"
                  title="Hapus Kelas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

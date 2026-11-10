import React, { useState } from 'react';
import { UserCheck, Save, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeacherProfile } from '../types';

export const ProfilGuruPage: React.FC = () => {
  const { teacherProfile, updateTeacherProfile, subjects } = useApp();
  const [formData, setFormData] = useState<TeacherProfile>({ ...teacherProfile });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleMapelToggle = (mapelName: string) => {
    const current = formData.mapelDiampu || [];
    if (current.includes(mapelName)) {
      setFormData({ ...formData, mapelDiampu: current.filter((m: string) => m !== mapelName) });
    } else {
      setFormData({ ...formData, mapelDiampu: [...current, mapelName] });
    }
  };

  const handleKelasToggle = (kelasNum: number) => {
    const current = formData.kelasDiampu || [];
    if (current.includes(kelasNum)) {
      setFormData({ ...formData, kelasDiampu: current.filter((k: number) => k !== kelasNum) });
    } else {
      setFormData({ ...formData, kelasDiampu: [...current, kelasNum].sort((a, b) => a - b) });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Profil & Identitas Guru Penyusun
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Identitas ini digunakan sebagai nama penyusun dan penanda tangan dokumen perangkat ajar.
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tersimpan!</span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Section 1: Data Pribadi */}
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              1. Data Pribadi & Kepegawaian
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gelar Depan</label>
                <input
                  type="text"
                  value={formData.gelarDepan || ''}
                  onChange={(e) => setFormData({ ...formData, gelarDepan: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Misal: Ust. / Drs."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap (Tanpa Gelar)
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
                  placeholder="Contoh: Ahmad Fauzi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gelar Belakang</label>
                <input
                  type="text"
                  value={formData.gelarBelakang || ''}
                  onChange={(e) => setFormData({ ...formData, gelarBelakang: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Misal: S.Pd.I / M.Pd."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NIY / NPK
                </label>
                <input
                  type="text"
                  value={formData.nipNiy}
                  onChange={(e) => setFormData({ ...formData, nipNiy: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                  placeholder="Contoh: 198804152019031008"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NUPTK</label>
                <input
                  type="text"
                  value={formData.nuptk}
                  onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                  placeholder="Contoh: 4537766667200032"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Guru</label>
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Contoh: Guru Kelas / Guru PAI MI"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pangkat & Golongan Ruang
                </label>
                <input
                  type="text"
                  value={formData.pangkatGolongan}
                  onChange={(e) => setFormData({ ...formData, pangkatGolongan: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Misal: Penata Muda Tk. I (III/b)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) =>
                    setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })
                  }
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pendidikan Terakhir
                </label>
                <input
                  type="text"
                  value={formData.pendidikanTerakhir}
                  onChange={(e) => setFormData({ ...formData, pendidikanTerakhir: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Misal: S1 Pendidikan Agama Islam"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Penugasan Ajar (Mapel & Kelas) */}
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              2. Penugasan Mengajar (Mata Pelajaran & Kelas yang Diampu)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Tingkat Kelas yang Diampu:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((k) => {
                    const isChecked = (formData.kelasDiampu || []).includes(k);
                    return (
                      <button
                        type="button"
                        key={k}
                        onClick={() => handleKelasToggle(k)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isChecked
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        Kelas {k} ({k <= 2 ? 'Fase A' : k <= 4 ? 'Fase B' : 'Fase C'})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Mata Pelajaran yang Diampu:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {subjects.map((sub) => {
                    const isChecked = (formData.mapelDiampu || []).includes(sub.nama);
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        onClick={() => handleMapelToggle(sub.nama)}
                        className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="block truncate">{sub.nama}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{sub.kategori}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Kontak & Komunikasi */}
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              3. Kontak & Komunikasi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.noHp}
                  onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                  placeholder="Contoh: 0812-8899-7721"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Guru
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Contoh: ahmadfauzi.guru@kemenag.go.id"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Profil Guru</span>
          </button>
        </div>
      </form>
    </div>
  );
};

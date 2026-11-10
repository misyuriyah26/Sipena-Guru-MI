import React, { useState } from 'react';
import { Building2, Save, Upload, School, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MadrasahProfile } from '../types';

export const ProfilMadrasahPage: React.FC = () => {
  const { madrasahProfile, updateMadrasahProfile } = useApp();
  const [formData, setFormData] = useState<MadrasahProfile>({ ...madrasahProfile });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMadrasahProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: MadrasahProfile) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Profil & Identitas Madrasah Ibtidaiyah
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Identitas ini otomatis tertera pada Kop Surat dan lembar pengesahan seluruh dokumen perangkat ajar.
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
          {/* Logo & Basic Info */}
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              1. Identitas Lembaga & Logo Madrasah
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Box */}
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70 text-center">
                <div className="w-24 h-24 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden mb-3 shadow-xs">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo Madrasah"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <School className="w-10 h-10 text-emerald-700" />
                  )}
                </div>
                <label className="cursor-pointer px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Logo MI</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-2">
                  Format PNG / JPG (Maks. 2MB)
                </p>
              </div>

              {/* Basic Fields */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Resmi Madrasah
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaMadrasah}
                    onChange={(e) => setFormData({ ...formData, namaMadrasah: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold text-slate-900"
                    placeholder="Contoh: Madrasah Ibtidaiyah Swasta (MIS) Nurul Huda"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Pokok Sekolah Nasional (NPSN)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.npsn}
                    onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Statistik Madrasah (NSM)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nsm}
                    onChange={(e) => setFormData({ ...formData, nsm: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Madrasah</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'Negeri' | 'Swasta' })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Swasta">Swasta (MIS)</option>
                    <option value="Negeri">Negeri (MIN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Peringkat Akreditasi</label>
                  <select
                    value={formData.akreditasi}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        akreditasi: e.target.value as 'A' | 'B' | 'C' | 'Belum Terakreditasi',
                      })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="A">Terakreditasi A (Unggul)</option>
                    <option value="B">Terakreditasi B (Baik)</option>
                    <option value="C">Terakreditasi C (Cukup)</option>
                    <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              2. Alamat Lengkap & Kontak Madrasah
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Jalan / Dusun / RT & RW
                </label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Contoh: Jl. KH. Hasyim Asy'ari No. 18"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Desa / Kelurahan
                </label>
                <input
                  type="text"
                  value={formData.desaKelurahan}
                  onChange={(e) => setFormData({ ...formData, desaKelurahan: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={formData.kecamatan}
                  onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kabupaten / Kota
                </label>
                <input
                  type="text"
                  value={formData.kabupatenKota}
                  onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={formData.provinsi}
                  onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Telepon</label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Resmi Madrasah
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Headmaster Information */}
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              3. Kepala Madrasah (Penanda Tangan Pengesahan)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kepala Madrasah Lengkap + Gelar
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaKepala}
                  onChange={(e) => setFormData({ ...formData, namaKepala: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
                  placeholder="Contoh: H. Muhammad Yusuf, M.Pd."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NIY Kepala Madrasah
                </label>
                <input
                  type="text"
                  value={formData.nipKepala}
                  onChange={(e) => setFormData({ ...formData, nipKepala: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                  placeholder="Contoh: 197508142002121004"
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
            <span>Simpan Profil Madrasah</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileDown,
  Printer,
  Building2,
  Layers,
  Database
} from 'lucide-react';

interface PanduanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiDoc?: () => void;
}

export const PanduanModal: React.FC<PanduanModalProps> = ({ isOpen, onClose, onOpenAiDoc }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Lengkapi Profil & Identitas Madrasah',
      icon: Building2,
      desc: 'Isi nama madrasah, NSM, NPSN, nama kepala madrasah, dan profil guru. Informasi ini otomatis dicetak pada Kop Surat dan titimangsa tanda tangan resmi dokumen.',
    },
    {
      num: 2,
      title: 'Unggah / Verifikasi Referensi Kurikulum',
      icon: ShieldCheck,
      desc: 'Buka menu "Referensi Kurikulum". Daftarkan teks Capaian Pembelajaran (CP) resmi KMA 450 Tahun 2024. Dokumen ini menjadi acuan utama AI agar terhindar dari halusinasi materi.',
    },
    {
      num: 3,
      title: 'Penyusunan Berantai (Pipeline Otomatis)',
      icon: Layers,
      desc: 'Susun perangkat secara berkesinambungan: CP → TP → ATP → PROTA → PROMES → Modul Ajar → Asesmen → LKPD. Sistem akan membawa data materi dan tujuan dari dokumen sebelumnya secara otomatis.',
    },
    {
      num: 4,
      title: 'Sunting di Editor Dokumen Profesional',
      icon: BookOpen,
      desc: 'Gunakan editor teks berfitur lengkap untuk menambahkan tabel, indikator, tebal/miring, dan daftar. Dilengkapi fitur autosave otomatis setiap 20 detik.',
    },
    {
      num: 5,
      title: 'Ekspor Microsoft Word (.docx) & PDF',
      icon: FileDown,
      desc: 'Unduh dokumen berformat asli Microsoft Word (.docx) dengan margin dan tabel rapi, atau cetak langsung ke PDF A4 dengan Kop Surat dan tanda tangan madrasah.',
    },
    {
      num: 6,
      title: 'Sinkronisasi Cloud Supabase (Opsional)',
      icon: Database,
      desc: 'Aplikasi bekerja 100% mandiri secara offline. Jika ingin menyimpan di cloud, masukkan URL dan Anon Key Supabase di Pengaturan Aplikasi untuk sinkronisasi PostgreSQL.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-300" />
            <h3 className="text-base font-bold text-white">
              Panduan Praktis Penggunaan SIPENA MI PERSONAL
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            Selamat datang di <strong>SIPENA MI PERSONAL</strong> (Sistem Informasi Perangkat Ajar Madrasah Ibtidaiyah). Ikuti 6 langkah mudah berikut untuk menyusun perangkat pembelajaran Kurikulum Merdeka (KMA 450/2024):
          </p>

          <div className="space-y-3">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {st.num}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{st.title}</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">KMA 450 Tahun 2024 • P5 & PPRA Madrasah</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Tutup Panduan
            </button>
            {onOpenAiDoc && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAiDoc();
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mulai Buat dengan AI</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

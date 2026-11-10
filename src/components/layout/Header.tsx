import React from 'react';
import {
  Menu,
  Sparkles,
  PlusCircle,
  School,
  User,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

const pageTitles: Record<PageId, string> = {
  login: 'Masuk Akun Guru',
  dashboard: 'Dashboard Utama',
  'profil-madrasah': 'Profil Madrasah',
  'profil-guru': 'Profil Guru',
  'pengaturan-tahun': 'Pengaturan Tahun Pelajaran',
  'pengaturan-semester': 'Pengaturan Semester',
  'pengaturan-kurikulum': 'Pengaturan Kurikulum',
  'referensi-kurikulum': 'Referensi Kurikulum & Acuan AI',
  'data-kelas': 'Data Kelas (1–6)',
  'data-mapel': 'Data Mata Pelajaran',
  perencanaan: 'Perencanaan Pembelajaran (RPE)',
  cp: 'Capaian Pembelajaran (CP)',
  tp: 'Tujuan Pembelajaran (TP)',
  atp: 'Alur Tujuan Pembelajaran (ATP)',
  prota: 'Program Tahunan (PROTA)',
  promes: 'Program Semester (PROMES)',
  kktp: 'Kriteria Ketercapaian TP (KKTP)',
  'modul-ajar': 'Modul Ajar / RPP Merdeka',
  asesmen: 'Asesmen dan Penilaian',
  'bank-soal': 'Bank Soal MI',
  lkpd: 'Lembar Kerja Peserta Didik (LKPD)',
  materi: 'Bahan & Materi Pembelajaran',
  jurnal: 'Jurnal Mengajar Harian',
  agenda: 'Agenda & Jadwal Mengajar',
  'rekap-nilai': 'Rekap Nilai Siswa',
  remedial: 'Program Remedial & Pengayaan',
  laporan: 'Laporan Pembelajaran',
  template: 'Template Dokumen Dinas',
  'dokumen-saya': 'Dokumen Saya',
  'pengaturan-aplikasi': 'Pengaturan Aplikasi',
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const {
    activePage,
    setActivePage,
    teacherProfile,
    activeSchoolYear,
    activeSemester,
    activeCurriculum,
    openCreateDoc,
    openAiDoc,
  } = useApp();

  const teacherDisplayName = [teacherProfile.gelarDepan, teacherProfile.namaLengkap, teacherProfile.gelarBelakang]
    .filter(Boolean)
    .join(' ');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white border-b border-slate-200">
      {/* Zone 1: Mobile Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Buka navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="hidden sm:inline">SIPENA MI</span>
            <span className="hidden sm:inline" aria-hidden="true">/</span>
            <span className="text-emerald-700 font-medium truncate">
              {pageTitles[activePage] || 'Menu'}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
            {pageTitles[activePage] || 'SIPENA MI PERSONAL'}
          </h1>
        </div>
      </div>

      {/* Zone 2: Academic Info Bar (Desktop) */}
      <div className="hidden xl:flex items-center gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>T.P. {activeSchoolYear.tahun}</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Semester {activeSemester.semester}</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5 font-medium text-emerald-800">
          <School className="w-3.5 h-3.5" />
          <span>{activeCurriculum.kode}</span>
        </div>
      </div>

      {/* Zone 3: Primary Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Tombol Buat dengan AI */}
        <button
          onClick={() => openAiDoc()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          title="Buka Generator Perangkat Ajar AI"
        >
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Buat dengan AI</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Tombol Buat Dokumen Baru */}
        <button
          onClick={openCreateDoc}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Buat Dokumen Baru</span>
          <span className="sm:hidden">Baru</span>
        </button>

        {/* User Profile avatar quick link */}
        <button
          onClick={() => setActivePage('profil-guru')}
          className="flex items-center gap-2 pl-2 text-left hover:opacity-85 transition-opacity"
          title="Lihat Profil Guru"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-emerald-100">
            {teacherProfile.namaLengkap.charAt(0) || 'G'}
          </div>
          <div className="hidden md:block max-w-[120px]">
            <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
              {teacherDisplayName}
            </p>
            <p className="text-[10px] text-slate-500 truncate leading-tight">Guru MI</p>
          </div>
        </button>
      </div>
    </header>
  );
};

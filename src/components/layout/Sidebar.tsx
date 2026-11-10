import React from 'react';
import {
  LayoutDashboard,
  Building2,
  UserCheck,
  CalendarDays,
  Clock,
  BookOpen,
  GraduationCap,
  BookMarked,
  CalendarRange,
  Target,
  GitBranch,
  FileSpreadsheet,
  CalendarCheck,
  CheckCircle2,
  FileText,
  FileQuestion,
  HelpCircle,
  FileCode,
  BookOpenCheck,
  ClipboardList,
  Calendar,
  BarChart3,
  Award,
  Printer,
  Copy,
  Files,
  Settings,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigationGroups: NavGroup[] = [
  {
    title: 'UTAMA',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'dokumen-saya', label: 'Dokumen Saya', icon: Files, badge: 'Utama' },
    ],
  },
  {
    title: 'IDENTITAS LEMBAGA',
    items: [
      { id: 'profil-madrasah', label: 'Profil Madrasah', icon: Building2 },
      { id: 'profil-guru', label: 'Profil Guru', icon: UserCheck },
      { id: 'pengaturan-tahun', label: 'Tahun Pelajaran', icon: CalendarDays },
      { id: 'pengaturan-semester', label: 'Pengaturan Semester', icon: Clock },
      { id: 'pengaturan-kurikulum', label: 'Pengaturan Kurikulum', icon: BookOpen },
      { id: 'referensi-kurikulum', label: 'Referensi Kurikulum', icon: BookOpenCheck, badge: 'AI Acuan' },
    ],
  },
  {
    title: 'DATA MASTER',
    items: [
      { id: 'data-kelas', label: 'Data Kelas 1–6', icon: GraduationCap },
      { id: 'data-mapel', label: 'Data Mata Pelajaran', icon: BookMarked },
    ],
  },
  {
    title: 'PERANGKAT AJAR (KMA 450)',
    items: [
      { id: 'perencanaan', label: 'Perencanaan (RPE)', icon: CalendarRange },
      { id: 'cp', label: 'Capaian Pembelajaran (CP)', icon: Target },
      { id: 'tp', label: 'Tujuan Pembelajaran (TP)', icon: CheckCircle2 },
      { id: 'atp', label: 'Alur TP (ATP)', icon: GitBranch },
      { id: 'prota', label: 'Program Tahunan (PROTA)', icon: FileSpreadsheet },
      { id: 'promes', label: 'Program Semester (PROMES)', icon: CalendarCheck },
      { id: 'kktp', label: 'Kriteria KKTP', icon: CheckCircle2 },
      { id: 'modul-ajar', label: 'Modul Ajar / RPP', icon: FileText, badge: 'Inti' },
    ],
  },
  {
    title: 'ASESMEN & BAHAN AJAR',
    items: [
      { id: 'asesmen', label: 'Asesmen & Penilaian', icon: FileQuestion },
      { id: 'bank-soal', label: 'Bank Soal MI', icon: HelpCircle },
      { id: 'lkpd', label: 'Lembar LKPD', icon: FileCode },
      { id: 'materi', label: 'Materi Pembelajaran', icon: BookOpenCheck },
    ],
  },
  {
    title: 'ADMINISTRASI GURU',
    items: [
      { id: 'jurnal', label: 'Jurnal Mengajar', icon: ClipboardList },
      { id: 'agenda', label: 'Agenda Mengajar', icon: Calendar },
      { id: 'rekap-nilai', label: 'Rekap Nilai Siswa', icon: BarChart3 },
      { id: 'remedial', label: 'Remedial & Pengayaan', icon: Award },
      { id: 'laporan', label: 'Laporan Pembelajaran', icon: Printer },
    ],
  },
  {
    title: 'PENGATURAN & TEMPLATE',
    items: [
      { id: 'template', label: 'Template Dokumen', icon: Copy },
      { id: 'pengaturan-aplikasi', label: 'Pengaturan Aplikasi', icon: Settings },
      { id: 'login', label: 'Status Akun / Login', icon: LogIn },
    ],
  },
];

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { activePage, setActivePage, madrasahProfile, openAiDoc, documents } = useApp();

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-72 bg-emerald-950 text-slate-100 flex flex-col h-full shrink-0 border-r border-emerald-900 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-emerald-900/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 shrink-0 font-black text-lg tracking-wider">
          SP
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-white tracking-wide">
              SIPENA MI
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200">
              Personal
            </span>
          </div>
          <p className="text-[11px] text-emerald-300/80 truncate mt-0.5">
            {madrasahProfile.namaMadrasah}
          </p>
        </div>
      </div>

      {/* AI Quick Assistant Banner */}
      <div className="px-3 pt-3">
        <button
          onClick={() => {
            openAiDoc();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-xs transition-all border border-emerald-600/40"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Asisten AI Guru MI</span>
          </div>
          <span className="text-[10px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-200">
            Generate
          </span>
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-xs scrollbar-thin scrollbar-thumb-emerald-800">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-emerald-400/80 uppercase">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-emerald-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.id === 'dokumen-saya' && documents.length > 0 ? (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-900 text-emerald-300'
                        }`}
                      >
                        {documents.length}
                      </span>
                    ) : item.badge ? (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          isActive
                            ? 'bg-emerald-800 text-emerald-100'
                            : 'bg-emerald-900/80 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Identity Footer */}
      <div className="p-3 border-t border-emerald-900/80 bg-emerald-950/90 text-[11px] text-emerald-300/80">
        <div className="flex items-center justify-between">
          <span className="truncate">Kurikulum Merdeka MI</span>
          <span className="font-mono text-[10px] text-emerald-400 font-bold">KMA 450</span>
        </div>
        <p className="text-[10px] text-emerald-400/60 truncate mt-0.5">
          Kemudahan Perangkat Guru MI Indonesia
        </p>
      </div>
    </aside>
  );
};

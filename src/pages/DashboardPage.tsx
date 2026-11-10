import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Layers,
  Sparkles,
  PlusCircle,
  Clock,
  ArrowRight,
  School,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  Users,
  Eye,
  Edit3,
  GitMerge,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { PageId } from '../types';
import { PanduanModal } from '../components/modals/PanduanModal';

export const DashboardPage: React.FC = () => {
  const {
    teacherProfile,
    madrasahProfile,
    activeSchoolYear,
    activeSemester,
    activeCurriculum,
    documents,
    openCreateDoc,
    openAiDoc,
    openPreviewDoc,
    openEditDoc,
    setActivePage,
    classes,
    subjects,
    journalEntries,
  } = useApp();

  const teacherDisplayName = [
    teacherProfile.gelarDepan,
    teacherProfile.namaLengkap,
    teacherProfile.gelarBelakang,
  ]
    .filter(Boolean)
    .join(' ');

  const totalModulAjar = documents.filter((d) => d.tipe === 'MODUL_AJAR').length;
  const totalPerangkat = documents.length;
  const totalSiswa = classes.reduce((acc, c) => acc + c.jumlahSiswaL + c.jumlahSiswaP, 0);

  const [isPanduanOpen, setIsPanduanOpen] = useState(false);

  const recentDocs = documents.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative geometric overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-600/50">
              SIPENA MI PERSONAL
            </span>
            <span className="text-[11px] font-semibold text-emerald-200">
              {activeCurriculum.regulasi}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {teacherDisplayName}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Sistem Informasi Perangkat Ajar Madrasah Ibtidaiyah untuk {madrasahProfile.namaMadrasah}.
            Kelola Modul Ajar, PROTA, PROMES, ATP, KKTP, dan asesmen secara otomatis dan terstandar.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openAiDoc()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-md shadow-emerald-950/20"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Buat dengan AI</span>
            </button>

            <button
              onClick={openCreateDoc}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/90 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm transition-all border border-emerald-500/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Dokumen Baru</span>
            </button>

            <button
              onClick={() => setIsPanduanOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60 text-xs sm:text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <span>Panduan Aplikasi</span>
            </button>

            <button
              onClick={() => setActivePage('dokumen-saya')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-emerald-200 hover:text-white transition-colors"
            >
              <span>Lihat Semua Dokumen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Academic Status Strip */}
        <div className="mt-6 pt-4 border-t border-emerald-700/60 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
          <div className="flex items-center gap-1.5">
            <School className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold text-white">{madrasahProfile.namaMadrasah}</span>
          </div>
          <span className="text-emerald-500">·</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>Tahun Pelajaran: <strong className="text-white">{activeSchoolYear.tahun}</strong></span>
          </div>
          <span className="text-emerald-500">·</span>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-300" />
            <span>Semester: <strong className="text-white">{activeSemester.semester}</strong></span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Dokumen Dibuat"
          value={totalPerangkat}
          subtitle="Tersimpan di katalog dokumen"
          icon={<FileText className="w-5 h-5" />}
          badge="Katalog"
          badgeColor="emerald"
          onClick={() => setActivePage('dokumen-saya')}
        />
        <StatCard
          title="Modul Ajar / RPP"
          value={totalModulAjar}
          subtitle="Kurikulum Merdeka MI"
          icon={<BookOpen className="w-5 h-5" />}
          badge="Inti Ajar"
          badgeColor="blue"
          onClick={() => setActivePage('modul-ajar')}
        />
        <StatCard
          title="Kelas & Rombel"
          value={classes.length}
          subtitle={`Total ${totalSiswa} Siswa`}
          icon={<Users className="w-5 h-5" />}
          badge="Kelas 1-6"
          badgeColor="slate"
          onClick={() => setActivePage('data-kelas')}
        />
        <StatCard
          title="Jurnal Tatap Muka"
          value={journalEntries.length}
          subtitle="Catatan mengajar aktif"
          icon={<Clock className="w-5 h-5" />}
          badge="Harian"
          badgeColor="amber"
          onClick={() => setActivePage('jurnal')}
        />
      </div>

      {/* Alur Berkesinambungan Perangkat Ajar MI (Pipeline Roadmap) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Alur Berkesinambungan Perangkat Ajar MI (KMA 450/2024)
              </h2>
              <p className="text-xs text-slate-500">
                Data mengalir otomatis dari Capaian ke Modul dan Asesmen tanpa perlu mengetik ulang
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPanduanOpen(true)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto flex items-center gap-1"
          >
            <span>Pelajari Alur Lengkap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-4">
          {[
            { id: 'cp', label: '1. CP Resmi', step: 'Capaian', page: 'cp' },
            { id: 'tp', label: '2. Rumus TP', step: 'Tujuan', page: 'tp' },
            { id: 'atp', label: '3. Alur ATP', step: 'Alur Fase', page: 'atp' },
            { id: 'prota', label: '4. PROTA', step: 'Tahunan', page: 'prota' },
            { id: 'promes', label: '5. PROMES', step: 'Semester', page: 'promes' },
            { id: 'modul-ajar', label: '6. Modul Ajar', step: 'Inti RPP', page: 'modul-ajar' },
            { id: 'asesmen', label: '7. Asesmen', step: 'Formatif/Sumatif', page: 'asesmen' },
            { id: 'lkpd', label: '8. Lembar LKPD', step: 'Aktivitas', page: 'lkpd' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.page as any)}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-center group"
            >
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 block">
                {item.step}
              </span>
              <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 mt-0.5 truncate">
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Split: Recent Documents + Quick Navigation Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Documents (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Aktivitas Dokumen Terbaru</h2>
              <p className="text-xs text-slate-500">Perangkat pembelajaran yang baru dibuat atau disunting</p>
            </div>
            <button
              onClick={() => setActivePage('dokumen-saya')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Semua Dokumen ({documents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {doc.tipeLabel}
                    </span>
                    {doc.isAiGenerated && (
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        AI Generated
                      </span>
                    )}
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">Kelas {doc.kelas} (Fase {doc.fase})</span>
                  </div>
                  <h3
                    onClick={() => openPreviewDoc(doc)}
                    className="font-semibold text-xs sm:text-sm text-slate-900 mt-1 cursor-pointer group-hover:text-emerald-700 transition-colors line-clamp-1"
                  >
                    {doc.judul}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {doc.mataPelajaran} · Diperbarui: {doc.tanggalDiperbarui} · Status: {doc.status}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openPreviewDoc(doc)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Pratinjau</span>
                  </button>
                  <button
                    onClick={() => openEditDoc(doc)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}

            {recentDocs.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">Belum ada dokumen yang dibuat.</p>
                <button
                  onClick={openCreateDoc}
                  className="mt-3 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Buat Dokumen Sekarang
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Akses Cepat Modul Utama</h2>
            <p className="text-xs text-slate-500">Navigasi langsung ke perangkat ajar</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            {[
              { id: 'modul-ajar' as PageId, title: 'Modul Ajar / RPP', desc: 'Penyusunan RPP KMA 450', icon: BookOpen },
              { id: 'prota' as PageId, title: 'Program Tahunan (PROTA)', desc: 'Matriks alokasi jam 1 tahun', icon: FileSpreadsheet },
              { id: 'promes' as PageId, title: 'Program Semester (PROMES)', desc: 'Distribusi pekan efektif', icon: Calendar },
              { id: 'atp' as PageId, title: 'Alur Tujuan (ATP)', desc: 'Urutan TP Fase A, B, C', icon: CheckCircle2 },
              { id: 'kktp' as PageId, title: 'Kriteria KKTP', desc: 'Interval penilaian capaian', icon: Award },
              { id: 'bank-soal' as PageId, title: 'Bank Soal MI', desc: 'Kumpulan soal & kisi-kisi', icon: Layers },
              { id: 'jurnal' as PageId, title: 'Jurnal Mengajar', desc: 'Catatan harian kelas', icon: Clock },
            ].map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <button
                  key={shortcut.id}
                  onClick={() => setActivePage(shortcut.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate group-hover:text-emerald-800">
                        {shortcut.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{shortcut.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 transition-colors shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Onboarding Guide Modal */}
      <PanduanModal
        isOpen={isPanduanOpen}
        onClose={() => setIsPanduanOpen(false)}
        onOpenAiDoc={() => openAiDoc()}
      />
    </div>
  );
};

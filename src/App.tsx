import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Modals
import { CreateDocumentModal } from './components/modals/CreateDocumentModal';
import { AIDocumentModal } from './components/modals/AIDocumentModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { DocumentEditorModal } from './components/modals/DocumentEditorModal';
import { ConfirmDialog } from './components/modals/ConfirmDialog';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilMadrasahPage } from './pages/ProfilMadrasahPage';
import { ProfilGuruPage } from './pages/ProfilGuruPage';
import { TahunPelajaranPage } from './pages/TahunPelajaranPage';
import { SemesterPage } from './pages/SemesterPage';
import { KurikulumPage } from './pages/KurikulumPage';
import ReferensiKurikulumPage from './pages/ReferensiKurikulumPage';
import { DataKelasPage } from './pages/DataKelasPage';
import { DataMapelPage } from './pages/DataMapelPage';
import { PerencanaanPage } from './pages/PerencanaanPage';
import { CapaianPembelajaranPage } from './pages/CapaianPembelajaranPage';
import { TujuanPembelajaranPage } from './pages/TujuanPembelajaranPage';
import { AlurTujuanPembelajaranPage } from './pages/AlurTujuanPembelajaranPage';
import { ProtaPage } from './pages/ProtaPage';
import { PromesPage } from './pages/PromesPage';
import { KktpPage } from './pages/KktpPage';
import { ModulAjarPage } from './pages/ModulAjarPage';
import { AsesmenPage } from './pages/AsesmenPage';
import { BankSoalPage } from './pages/BankSoalPage';
import { LkpdPage } from './pages/LkpdPage';
import { MateriPage } from './pages/MateriPage';
import { JurnalPage } from './pages/JurnalPage';
import { AgendaPage } from './pages/AgendaPage';
import { RekapNilaiPage } from './pages/RekapNilaiPage';
import { RemedialPage } from './pages/RemedialPage';
import { LaporanPage } from './pages/LaporanPage';
import { TemplatePage } from './pages/TemplatePage';
import { DokumenSayaPage } from './pages/DokumenSayaPage';
import { PengaturanPage } from './pages/PengaturanPage';

import { CheckCircle2, AlertCircle, Info, WifiOff } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, notification } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderActiveView = () => {
    switch (activePage) {
      case 'login':
        return <LoginPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'profil-madrasah':
        return <ProfilMadrasahPage />;
      case 'profil-guru':
        return <ProfilGuruPage />;
      case 'pengaturan-tahun':
        return <TahunPelajaranPage />;
      case 'pengaturan-semester':
        return <SemesterPage />;
      case 'pengaturan-kurikulum':
        return <KurikulumPage />;
      case 'referensi-kurikulum':
        return <ReferensiKurikulumPage />;
      case 'data-kelas':
        return <DataKelasPage />;
      case 'data-mapel':
        return <DataMapelPage />;
      case 'perencanaan':
        return <PerencanaanPage />;
      case 'cp':
        return <CapaianPembelajaranPage />;
      case 'tp':
        return <TujuanPembelajaranPage />;
      case 'atp':
        return <AlurTujuanPembelajaranPage />;
      case 'prota':
        return <ProtaPage />;
      case 'promes':
        return <PromesPage />;
      case 'kktp':
        return <KktpPage />;
      case 'modul-ajar':
        return <ModulAjarPage />;
      case 'asesmen':
        return <AsesmenPage />;
      case 'bank-soal':
        return <BankSoalPage />;
      case 'lkpd':
        return <LkpdPage />;
      case 'materi':
        return <MateriPage />;
      case 'jurnal':
        return <JurnalPage />;
      case 'agenda':
        return <AgendaPage />;
      case 'rekap-nilai':
        return <RekapNilaiPage />;
      case 'remedial':
        return <RemedialPage />;
      case 'laporan':
        return <LaporanPage />;
      case 'template':
        return <TemplatePage />;
      case 'dokumen-saya':
        return <DokumenSayaPage />;
      case 'pengaturan-aplikasi':
        return <PengaturanPage />;
      default:
        return <DashboardPage />;
    }
  };

  const { isOnline } = useApp();

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans flex-col">
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs py-1 px-4 flex items-center justify-center gap-2 font-medium z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Anda sedang dalam mode Offline. Data tetap disimpan di penyimpanan lokal peramban Anda.</span>
        </div>
      )}

      <div className="flex flex-1 w-full overflow-hidden">
        {/* Desktop Sidebar (Left) */}
        <div className="hidden lg:flex shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Mobile Drawer */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        {/* Main View Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <CreateDocumentModal />
      <AIDocumentModal />
      <DocumentPreviewModal />
      <DocumentEditorModal />
      <ConfirmDialog />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl text-xs border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

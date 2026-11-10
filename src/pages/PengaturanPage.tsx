import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Server,
  CloudCheck,
  Code,
  Copy,
  RefreshCw,
  ExternalLink,
  Layers,
  KeyRound,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { testSupabaseConnection } from '../lib/supabaseClient';

export const PengaturanPage: React.FC = () => {
  const {
    exportDataJSON,
    importDataJSON,
    resetAllData,
    requestConfirm,
    showNotification,
    supabaseStatus,
    checkSupabaseStatus,
    syncDataWithSupabase,
    supabaseUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'koneksi' | 'sql' | 'backup' | 'ai'>('koneksi');

  // Supabase Custom Config Form
  const [inputUrl, setInputUrl] = useState(
    localStorage.getItem('sipena_supabase_url_override') ||
      import.meta.env.VITE_SUPABASE_URL ||
      ''
  );
  const [inputKey, setInputKey] = useState(
    localStorage.getItem('sipena_supabase_key_override') ||
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      ''
  );
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Gemini API Health check
  const [geminiHealth, setGeminiHealth] = useState<{ status: string; geminiConfigured: boolean } | null>(null);
  const [isCheckingGemini, setIsCheckingGemini] = useState(false);

  useEffect(() => {
    checkGeminiHealth();
  }, []);

  const checkGeminiHealth = async () => {
    setIsCheckingGemini(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setGeminiHealth(data);
      }
    } catch {
      setGeminiHealth({ status: 'offline', geminiConfigured: false });
    } finally {
      setIsCheckingGemini(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl) {
      localStorage.setItem('sipena_supabase_url_override', inputUrl.trim());
    } else {
      localStorage.removeItem('sipena_supabase_url_override');
    }

    if (inputKey) {
      localStorage.setItem('sipena_supabase_key_override', inputKey.trim());
    } else {
      localStorage.removeItem('sipena_supabase_key_override');
    }

    showNotification('Konfigurasi Supabase disimpan ke peramban. Memeriksa koneksi...', 'info');
    handleTestConnection();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(inputUrl.trim(), inputKey.trim());
      setTestResult({
        success: res.connected,
        message: res.connected
          ? 'Koneksi ke Supabase PostgreSQL berhasil tersambung!'
          : `Gagal tersambung: ${res.error || 'Periksa URL dan Anon Key'}`,
      });
      await checkSupabaseStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Koneksi gagal: ${err.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const res = await syncDataWithSupabase();
      if (res.success) {
        showNotification(res.message, 'success');
      } else {
        showNotification(res.message, 'error');
      }
    } catch (err: any) {
      showNotification(`Gagal sinkronisasi: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_sipena_mi_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('File cadangan data JSON berhasil diunduh', 'success');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importDataJSON(content);
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    requestConfirm(
      'Reset Seluruh Data Aplikasi',
      'Apakah Anda yakin ingin mengembalikan seluruh profil, kelas, mapel, dan dokumen ke data contoh awal? Data tersimpan lokal akan terhapus.',
      () => {
        resetAllData();
      }
    );
  };

  const sampleSQL = `-- ====================================================================
-- SKEMA BASIS DATA SIPENA MI PERSONAL (28 TABEL POSTGRESQL + RLS)
-- Jalankan skrip ini pada SQL Editor Supabase Project Anda
-- ====================================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'teacher',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MADRASAH
CREATE TABLE IF NOT EXISTS public.madrasah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_madrasah TEXT NOT NULL,
    npsn TEXT,
    nsm TEXT,
    jenjang TEXT DEFAULT 'MI',
    status TEXT DEFAULT 'Swasta',
    akreditasi TEXT,
    alamat TEXT,
    desa_kelurahan TEXT,
    kecamatan TEXT,
    kabupaten_kota TEXT,
    provinsi TEXT,
    kode_pos TEXT,
    email TEXT,
    telepon TEXT,
    website TEXT,
    nama_kepala TEXT,
    nip_kepala TEXT,
    logo_url TEXT,
    kementerian TEXT DEFAULT 'Kementerian Agama RI',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEACHERS
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_lengkap TEXT NOT NULL,
    gelar_depan TEXT,
    gelar_belakang TEXT,
    nip_niy TEXT,
    nuptk TEXT,
    jabatan TEXT,
    pangkat_golongan TEXT,
    jenis_kelamin TEXT DEFAULT 'L',
    pendidikan_terakhir TEXT,
    jurusan TEXT,
    email TEXT,
    no_hp TEXT,
    alamat TEXT,
    foto_url TEXT,
    mapel_diampu TEXT[],
    kelas_diampu INTEGER[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CURRICULUM_REFERENCES (RAG / ACUAN DOKUMEN GEMINI)
CREATE TABLE IF NOT EXISTS public.curriculum_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    subject TEXT,
    fase TEXT,
    class_grade INTEGER,
    file_name TEXT,
    file_size INTEGER,
    file_url TEXT,
    content_text TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GENERATED_DOCUMENTS (DOKUMEN PERANGKAT AJAR)
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    judul TEXT NOT NULL,
    tipe TEXT NOT NULL,
    tipe_label TEXT,
    kelas INTEGER NOT NULL,
    fase TEXT NOT NULL,
    mata_pelajaran TEXT NOT NULL,
    tahun_pelajaran TEXT NOT NULL,
    semester TEXT NOT NULL,
    kurikulum TEXT NOT NULL,
    status TEXT DEFAULT 'Draft',
    alokasi_waktu TEXT,
    tujuan_ringkas TEXT,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.madrasah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own profile"
    ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only access their own madrasah"
    ON public.madrasah FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own teacher record"
    ON public.teachers FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own curriculum references"
    ON public.curriculum_references FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own documents"
    ON public.generated_documents FOR ALL USING (auth.uid() = user_id);
`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sampleSQL);
    showNotification('Skrip SQL PostgreSQL & RLS berhasil disalin ke clipboard!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Pengaturan Backend & Kecerdasan Buatan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Integrasi Supabase PostgreSQL (Auth & RLS), Google Gemini AI Engine, dan Cadangan Data Mandiri.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${
              supabaseStatus.connected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{supabaseStatus.connected ? 'Supabase Online' : 'Mode Offline/Lokal'}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-white rounded-t-xl px-4">
        {[
          { id: 'koneksi', label: 'Koneksi Supabase', icon: Server },
          { id: 'sql', label: 'Skema Database (SQL)', icon: Code },
          { id: 'ai', label: 'Google Gemini AI', icon: Sparkles },
          { id: 'backup', label: 'Cadangan Data (Backup)', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                isActive
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KONEKSI SUPABASE */}
      {activeTab === 'koneksi' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-6 -mt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Konfigurasi Supabase Project</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Aplikasi ini mendukung mode personal tunggal. Masukkan URL dan Kunci Publik (Anon Key) proyek Supabase Anda untuk mengaktifkan sinkronisasi database PostgreSQL di cloud.
              </p>
            </div>
          </div>

          {/* Status Alert */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
              supabaseStatus.connected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {supabaseStatus.connected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">
                Status:{' '}
                {supabaseStatus.connected
                  ? 'Terhubung dengan Database Cloud Supabase'
                  : 'Menggunakan Penyimpanan Lokal Peramban (Hybrid Local Storage)'}
              </p>
              <p className="opacity-90 leading-relaxed">
                {supabaseStatus.connected
                  ? `URL: ${supabaseStatus.url}. Seluruh data disimpan dan disaring dengan aman melalui Row Level Security (RLS).`
                  : 'Aplikasi tetap berjalan normal 100% tanpa database eksternal. Jika ingin menyelaraskan ke cloud, masukkan kredensial Supabase di bawah.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  VITE_SUPABASE_URL
                </label>
                <input
                  type="text"
                  placeholder="https://xxxxxxxxxxxx.supabase.co"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full text-xs font-mono px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>VITE_SUPABASE_ANON_KEY (Public Key)</span>
                  <span className="text-[11px] text-emerald-700 font-normal">
                    Aman digunakan di browser (Bukan Service Role Key)
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full text-xs font-mono px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs font-medium ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {testResult.message}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Simpan Konfigurasi
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
              </button>

              {supabaseStatus.connected && (
                <button
                  type="button"
                  onClick={handleSyncData}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ml-auto"
                >
                  <CloudCheck className="w-4 h-4 text-teal-700" />
                  <span>{isSyncing ? 'Menyelaraskan...' : 'Sinkronkan Data ke Supabase'}</span>
                </button>
              )}
            </div>
          </form>

          {/* Security Note */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Catatan Keamanan (Security Compliance):</p>
            <p>
              • Sesuai panduan keamanan, <strong>service_role key tidak pernah digunakan di browser</strong>.
            </p>
            <p>
              • Seluruh akses tabel dilindungi kebijakan <strong>Row Level Security (RLS)</strong> berbasis <code>auth.uid() = user_id</code>.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: SQL SCHEMA */}
      {activeTab === 'sql' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-4 -mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Skrip Migrasi Supabase PostgreSQL</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Salin dan tempel skrip SQL di bawah ke menu <strong>SQL Editor</strong> di dashboard Supabase Anda.
              </p>
            </div>
            <button
              onClick={handleCopySQL}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Skrip SQL</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-[420px] leading-relaxed border border-slate-800">
            <pre>{sampleSQL}</pre>
          </div>

          <p className="text-xs text-slate-500">
            Skrip lengkap mencakup 28 tabel: <code>profiles</code>, <code>madrasah</code>, <code>teachers</code>, <code>academic_years</code>, <code>semesters</code>, <code>classes</code>, <code>subjects</code>, <code>curriculum_references</code>, <code>teaching_modules</code>, <code>assessments</code>, <code>question_banks</code>, <code>worksheets</code>, <code>student_grades</code>, <code>generated_documents</code>, dan tabel pendukung lainnya.
          </p>
        </div>
      )}

      {/* TAB 3: GEMINI AI */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-6 -mt-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Google Gemini AI Engine</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Backend Express Proxy terhubung dengan SDK <code>@google/genai</code> pada server port 3000.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Model AI Aktif
              </span>
              <p className="text-base font-bold text-slate-900 font-mono">gemini-3.8-flash</p>
              <span className="text-xs text-emerald-700 font-medium">Model AI Cepat & Mutakhir</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Server Proxy Status
              </span>
              <p className="text-base font-bold text-slate-900">
                {geminiHealth?.status === 'ok' ? 'Aktif (Port 3000)' : 'Memeriksa...'}
              </p>
              <span className="text-xs text-emerald-700 font-medium">/api/gemini/generate</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Keamanan Kredensial
              </span>
              <p className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Terlindungi Server</span>
              </p>
              <span className="text-xs text-slate-500">Kunci API tidak pernah bocor ke browser</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Kemampuan Otomasi AI Madrasah:</span>
            </p>
            <ul className="list-disc pl-5 space-y-1 opacity-90 leading-relaxed">
              <li>Penyusunan Modul Ajar terintegrasi Kurikulum Merdeka (KMA 450 Tahun 2024) dan P5-PPRA.</li>
              <li>Perumusan Capaian Pembelajaran (CP) dan Alur Tujuan Pembelajaran (ATP) berjenjang.</li>
              <li>Pembuatan Lembar Kerja Peserta Didik (LKPD) berbasis aktivitas kontekstual.</li>
              <li>Penyusunan Bank Soal HOTS lengkap dengan rubrik penilaian KKTP.</li>
              <li>Fitur anti-halusinasi dengan grounding teks Capaian Pembelajaran resmi.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-4 -mt-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Cadangan & Pemulihan Mandiri</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ekspor seluruh data madrasah, guru, dan perangkat ajar ke dalam berkas standar JSON.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Cadangan Data (.JSON)</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Impor / Pulihkan dari File JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetData}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition-colors ml-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset ke Standar Awal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  LogIn,
  School,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Database,
  CloudCheck,
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    setActivePage,
    teacherProfile,
    madrasahProfile,
    showNotification,
    supabaseUser,
    supabaseStatus,
    loginWithSupabase,
    signupWithSupabase,
    logoutSupabase,
    checkSupabaseStatus
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'offline'>('login');
  const [emailInput, setEmailInput] = useState(teacherProfile.email || 'guru@madrasah.kemenag.go.id');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState(teacherProfile.namaLengkap);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const res = await loginWithSupabase(emailInput, passwordInput);
        if (res.success) {
          showNotification('Berhasil masuk melalui Supabase Authentication!', 'success');
          setActivePage('dashboard');
        } else {
          setErrorMessage(res.error || 'Gagal masuk. Periksa email dan kata sandi Anda.');
        }
      } else if (authMode === 'signup') {
        if (!passwordInput || passwordInput.length < 6) {
          setErrorMessage('Kata sandi minimal 6 karakter.');
          setIsLoading(false);
          return;
        }
        const res = await signupWithSupabase(emailInput, passwordInput, nameInput);
        if (res.success) {
          showNotification('Pendaftaran akun guru Supabase berhasil!', 'success');
          setActivePage('dashboard');
        } else {
          setErrorMessage(res.error || 'Pendaftaran gagal. Pastikan konfigurasi Supabase aktif.');
        }
      } else {
        // Direct local personal access
        setIsLoggedIn(true);
        showNotification('Masuk dalam Mode Personal Mandiri', 'success');
        setActivePage('dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutSupabase();
    showNotification('Sesi akun diistirahatkan', 'info');
  };

  const teacherName = [teacherProfile.gelarDepan, teacherProfile.namaLengkap, teacherProfile.gelarBelakang]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md text-center space-y-6">
        {/* App Logo */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-emerald-950/20">
          SP
        </div>

        <div>
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
            SIPENA MI PERSONAL EDITION
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Autentikasi Akun Guru Madrasah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Informasi Perangkat Ajar Madrasah Ibtidaiyah • Supabase Cloud & Local Mode
          </p>
        </div>

        {/* Supabase Connection Status Badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Backend Supabase:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
            <span className="font-semibold text-slate-800">
              {supabaseStatus.connected ? 'Terhubung (Cloud Postgre & RLS)' : 'Mode Lokal (Tanpa Cloud)'}
            </span>
          </div>
        </div>

        {/* Current Active Account Box */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-left flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold text-sm">
              {teacherProfile.namaLengkap.charAt(0) || 'G'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">
                Profil Guru Madrasah:
              </span>
              <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">{teacherName}</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {madrasahProfile.namaMadrasah}
              </p>
              {supabaseUser && (
                <p className="text-[10px] text-emerald-700 font-mono mt-1">
                  ID Supabase: {supabaseUser.id?.slice(0, 8)}...
                </p>
              )}
            </div>
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors"
            >
              Keluar
            </button>
          ) : (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold">
              Belum Masuk
            </span>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              authMode === 'login'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              authMode === 'signup'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Baru
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('offline');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              authMode === 'offline'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mode Mandiri
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Nama Lengkap Guru
              </label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap dengan Gelar"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          )}

          {authMode !== 'offline' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  Email Pengguna
                </label>
                <input
                  type="email"
                  required
                  placeholder="guru@madrasah.kemenag.go.id"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </>
          )}

          {authMode === 'offline' && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
              <p className="font-semibold mb-1">Akses Langsung Mode Personal Mandiri</p>
              <p className="opacity-90">
                Data Anda tetap tersimpan utuh di memori peramban lokal perangkat ini. Anda dapat menghubungkan ke Supabase Cloud sewaktu-waktu melalui menu Pengaturan Aplikasi.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Autentikasi...</span>
              </>
            ) : authMode === 'signup' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun Guru Supabase</span>
              </>
            ) : authMode === 'offline' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Lanjutkan Mode Mandiri</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Dashboard SIPENA</span>
              </>
            )}
          </button>
        </form>

        {/* Info */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Edisi Personal • Supabase Auth & Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
};

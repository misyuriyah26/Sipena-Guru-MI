import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  X,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurriculumReference } from '../types';

export default function ReferensiKurikulumPage() {
  const {
    curriculumReferences,
    addCurriculumReference,
    updateCurriculumReference,
    deleteCurriculumReference,
    requestConfirm,
    showNotification,
    openAiDoc
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedFase, setSelectedFase] = useState<string>('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<CurriculumReference | null>(null);
  const [viewingRef, setViewingRef] = useState<CurriculumReference | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<CurriculumReference['category']>('CP');
  const [formSubject, setFormSubject] = useState('');
  const [formFase, setFormFase] = useState<'A' | 'B' | 'C' | 'Semua'>('Semua');
  const [formClassGrade, setFormClassGrade] = useState<number | undefined>(undefined);
  const [formContentText, setFormContentText] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formIsVerified, setFormIsVerified] = useState(true);

  // Filtered references
  const filteredReferences = curriculumReferences.filter((ref) => {
    const matchSearch =
      ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ref.subject && ref.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ref.contentText && ref.contentText.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'Semua' || ref.category === selectedCategory;
    const matchFase = selectedFase === 'Semua' || ref.fase === selectedFase || ref.fase === 'Semua';
    return matchSearch && matchCat && matchFase;
  });

  const handleOpenAdd = () => {
    setEditingRef(null);
    setFormTitle('');
    setFormCategory('CP');
    setFormSubject('');
    setFormFase('Semua');
    setFormClassGrade(undefined);
    setFormContentText('');
    setFormFileName('');
    setFormIsVerified(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ref: CurriculumReference) => {
    setEditingRef(ref);
    setFormTitle(ref.title);
    setFormCategory(ref.category);
    setFormSubject(ref.subject || '');
    setFormFase(ref.fase || 'Semua');
    setFormClassGrade(ref.classGrade);
    setFormContentText(ref.contentText || '');
    setFormFileName(ref.fileName || '');
    setFormIsVerified(ref.isVerified);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showNotification('Judul referensi harus diisi', 'error');
      return;
    }

    if (editingRef) {
      updateCurriculumReference(editingRef.id, {
        title: formTitle,
        category: formCategory,
        subject: formSubject || undefined,
        fase: formFase,
        classGrade: formClassGrade,
        contentText: formContentText,
        fileName: formFileName || undefined,
        isVerified: formIsVerified,
      });
      showNotification('Referensi berhasil diperbarui', 'success');
    } else {
      addCurriculumReference({
        title: formTitle,
        category: formCategory,
        subject: formSubject || undefined,
        fase: formFase,
        classGrade: formClassGrade,
        contentText: formContentText,
        fileName: formFileName || undefined,
        isVerified: formIsVerified,
      });
      showNotification('Referensi baru berhasil ditambahkan', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (ref: CurriculumReference) => {
    requestConfirm(
      'Hapus Dokumen Referensi',
      `Apakah Anda yakin ingin menghapus "${ref.title}"? Dokumen ini tidak akan lagi menjadi dasar grounding AI saat menghasilkan perangkat ajar.`,
      () => {
        deleteCurriculumReference(ref.id);
        showNotification('Referensi berhasil dihapus', 'info');
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormFileName(file.name);
    // Read text content if text or markdown
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setFormContentText(text);
          showNotification(`File ${file.name} berhasil dimuat dan diekstrak`, 'success');
        }
      };
      reader.readAsText(file);
    } else {
      // Simulate extraction or note for PDF/DOCX
      showNotification(`File ${file.name} dipilih. Masukkan poin penting atau teks ekstrak pada kotak konten`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/50 rounded-full text-xs font-medium text-emerald-100 mb-2 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Grounding AI & Regulasi Resmi Kemenag
          </div>
          <h1 className="text-2xl font-bold">Referensi Kurikulum & Regulasi Madrasah</h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-2xl leading-relaxed">
            Kelola dokumen Capaian Pembelajaran (CP), KMA 450/2024, buku teks guru, dan panduan resmi. Gemini AI menggunakan dokumen ini agar tidak mengarang (hallucination) dan hasil perangkat ajar selalu sesuai standar madrasah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openAiDoc()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium border border-white/20 transition-all backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            Uji Generator AI
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Referensi
          </button>
        </div>
      </div>

      {/* Grounding Info Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-emerald-900 text-sm">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-950">Prinsip Akurasi AI Madrasah (Anti-Halusinasi)</p>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Setiap dokumen CP resmi yang Anda unggah atau daftarkan di sini akan langsung disuntikkan ke dalam sistem AI. Jika suatu mata pelajaran atau fase belum memiliki dokumen acuan resmi di daftar ini, AI secara otomatis memberikan penanda peringatan <em>"Perlu Verifikasi Mandiri"</em> pada draf perangkat ajar.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Dokumen</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{curriculumReferences.length}</div>
          <span className="text-xs text-slate-500">Tersimpan dalam basis data</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Capaian Pembelajaran (CP)</span>
            <FileCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {curriculumReferences.filter((r) => r.category === 'CP').length}
          </div>
          <span className="text-xs text-blue-600 font-medium">Fase A, B, & C</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Buku & Panduan</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {curriculumReferences.filter((r) => r.category === 'Buku Pelajaran' || r.category === 'Panduan').length}
          </div>
          <span className="text-xs text-slate-500">Buku Guru & Asesmen</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Terverifikasi Resmi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {curriculumReferences.filter((r) => r.isVerified).length}
          </div>
          <span className="text-xs text-emerald-600 font-medium">KMA / Kemdikbud</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari referensi, CP, atau materi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua</option>
              <option value="CP">Capaian Pembelajaran (CP)</option>
              <option value="Kurikulum">Regulasi Kurikulum</option>
              <option value="Buku Pelajaran">Buku Teks & Guru</option>
              <option value="Panduan">Panduan Pembelajaran</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600">
            <span className="font-medium">Fase:</span>
            <select
              value={selectedFase}
              onChange={(e) => setSelectedFase(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Fase</option>
              <option value="A">Fase A (Kelas 1-2)</option>
              <option value="B">Fase B (Kelas 3-4)</option>
              <option value="C">Fase C (Kelas 5-6)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reference List / Cards */}
      {filteredReferences.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">Tidak Ada Referensi Ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
            Tidak ada dokumen acuan yang cocok dengan kriteria pencarian Anda. Klik tombol di bawah untuk menambahkan referensi baru.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Referensi Baru
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReferences.map((ref) => (
            <div
              key={ref.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      ref.category === 'CP'
                        ? 'bg-blue-100 text-blue-800'
                        : ref.category === 'Kurikulum'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ref.category === 'Buku Pelajaran'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {ref.category}
                  </span>

                  {ref.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      Perlu Review
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 mb-2">
                  {ref.title}
                </h3>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-3">
                  {ref.subject && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                      {ref.subject}
                    </span>
                  )}
                  {ref.fase && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                      Fase {ref.fase}
                    </span>
                  )}
                  {ref.classGrade && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                      Kelas {ref.classGrade}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {ref.contentText
                    ? ref.contentText
                    : 'Belum ada kutipan teks ekstrak. Klik Lihat / Edit untuk melengkapi teks acuan agar AI dapat merujuk secara akurat.'}
                </p>
              </div>

              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate max-w-[140px]">
                  {ref.fileName ? `📁 ${ref.fileName}` : 'Ekstrak Teks'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingRef(ref)}
                    title="Lihat Teks Grounding"
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(ref)}
                    title="Edit Referensi"
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ref)}
                    title="Hapus Referensi"
                    className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View Reference Details */}
      {viewingRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Detail Teks Referensi Grounding AI</h3>
              </div>
              <button
                onClick={() => setViewingRef(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  {viewingRef.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{viewingRef.title}</h2>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  {viewingRef.subject && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      Mapel: {viewingRef.subject}
                    </span>
                  )}
                  {viewingRef.fase && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      Fase: {viewingRef.fase}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded font-medium ${
                      viewingRef.isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {viewingRef.isVerified ? '✓ Terverifikasi Resmi' : '⚠ Perlu Verifikasi'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Teks Dokumen yang Disuntikkan ke AI:
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {viewingRef.contentText || '(Tidak ada teks konten yang tersimpan)'}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center justify-between">
                <span>Ingin menggunakan referensi ini untuk membuat modul ajar sekarang?</span>
                <button
                  onClick={() => {
                    setViewingRef(null);
                    openAiDoc(`Buatkan Modul Ajar berdasarkan referensi: ${viewingRef.title}`);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                  Gunakan dengan AI
                </button>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewingRef(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Reference */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-base">
                {editingRef ? 'Edit Dokumen Referensi' : 'Tambah Referensi Kurikulum Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Referensi / Regulasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Capaian Pembelajaran Akidah Akhlak MI Fase B - KMA 450/2024"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Dokumen <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CP">Capaian Pembelajaran (CP Resmi)</option>
                    <option value="Kurikulum">Regulasi Kurikulum (KMA / Permendikbud)</option>
                    <option value="Buku Pelajaran">Buku Teks & Buku Guru</option>
                    <option value="Panduan">Panduan Pembelajaran & Asesmen</option>
                    <option value="Lainnya">Dokumen Pendukung Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mata Pelajaran (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Akidah Akhlak, Fikih, IPAS"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fase Kurikulum Merdeka
                  </label>
                  <select
                    value={formFase}
                    onChange={(e) => setFormFase(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Semua">Semua Fase (A, B, C)</option>
                    <option value="A">Fase A (Kelas 1 - 2)</option>
                    <option value="B">Fase B (Kelas 3 - 4)</option>
                    <option value="C">Fase C (Kelas 5 - 6)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Kelas Tertentu (Opsional)
                  </label>
                  <select
                    value={formClassGrade || ''}
                    onChange={(e) => setFormClassGrade(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Semua Kelas dalam Fase</option>
                    <option value="1">Kelas 1</option>
                    <option value="2">Kelas 2</option>
                    <option value="3">Kelas 3</option>
                    <option value="4">Kelas 4</option>
                    <option value="5">Kelas 5</option>
                    <option value="6">Kelas 6</option>
                  </select>
                </div>
              </div>

              {/* Upload file helper */}
              <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Unggah File Dokumen (.txt, .md, .pdf)</span>
                  {formFileName && (
                    <span className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Terpilih: {formFileName}
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-sm transition-colors">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    Pilih Berkas Dokumen
                    <input
                      type="file"
                      className="hidden"
                      accept=".txt,.md,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    Ketik langsung atau salin isi CP ke kotak di bawah untuk hasil terbaik.
                  </span>
                </div>
              </div>

              {/* Text content for AI Grounding */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Isi Teks / Ekstrak Referensi (Disuntikkan ke AI)</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {formContentText.length} karakter
                  </span>
                </label>
                <textarea
                  rows={6}
                  placeholder="Ketik atau tempel teks Capaian Pembelajaran, tujuan materi, atau regulasi di sini. Teks ini akan dibaca oleh model Gemini AI saat menyusun Modul Ajar, ATP, PROMES, dan LKPD."
                  value={formContentText}
                  onChange={(e) => setFormContentText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* Status Verification checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isVerifiedCheck"
                  checked={formIsVerified}
                  onChange={(e) => setFormIsVerified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isVerifiedCheck" className="text-xs text-slate-700 cursor-pointer select-none">
                  Tandai sebagai <strong>Dokumen Resmi Terverifikasi Kemenag / Kemdikbud</strong>
                </label>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  {editingRef ? 'Simpan Perubahan' : 'Tambahkan Referensi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

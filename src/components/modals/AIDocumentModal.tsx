import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BookOpen,
  FileCheck,
  Zap,
  ArrowRight,
  ShieldCheck,
  Copy,
  Save,
  RefreshCw,
  GitMerge,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentType, DocumentSection, DocumentItem } from '../../types';
import { DOCUMENT_TYPE_METAS, DOCUMENT_PIPELINE, extractContextFromParent } from '../../lib/documentRelations';

interface PresetPrompt {
  label: string;
  type: DocumentType;
  mapel: string;
  kelas: number;
  prompt: string;
}

const promptPresets: PresetPrompt[] = [
  {
    label: 'Modul Ajar Fikih - Shalat Berjamaah',
    type: 'MODUL_AJAR',
    mapel: 'Fikih',
    kelas: 4,
    prompt: 'Susun Modul Ajar Fikih Kelas 4 tentang Shalat Berjamaah dan Adzan Iqomah lengkap dengan nilai PPRA Qudwah dan Asesmen Formatif.',
  },
  {
    label: 'Alur Tujuan Pembelajaran (ATP) Al-Qur\'an Hadis',
    type: 'ATP',
    mapel: 'Al-Qur\'an Hadis',
    kelas: 2,
    prompt: 'Susun Alur Tujuan Pembelajaran (ATP) Al-Qur\'an Hadis Fase A materi Surat Al-Fatihah dan An-Nas lengkap dengan alokasi waktu JP.',
  },
  {
    label: 'KKTP Akidah Akhlak - Asmaul Husna',
    type: 'KKTP',
    mapel: 'Akidah Akhlak',
    kelas: 4,
    prompt: 'Buat Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Akidah Akhlak materi Asmaul Husna Al-Malik dan Al-Quddus dengan rubrik interval 4 tingkat.',
  },
  {
    label: 'LKPD IPAS - Siklus Air dan Pelestarian',
    type: 'LKPD',
    mapel: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    kelas: 5,
    prompt: 'Rancang Lembar Kerja Peserta Didik (LKPD) eksperimen sederhana daur air dan tadabbur ayat Al-Qur\'an tentang hujan.',
  },
  {
    label: 'Bank Soal HOTS & Kisi-Kisi Sejarah Islam',
    type: 'BANK_SOAL',
    mapel: 'Sejarah Kebudayaan Islam',
    kelas: 3,
    prompt: 'Buat paket 5 butir soal HOTS Sejarah Kebudayaan Islam materi Masyarakat Arab Pra-Islam beserta kunci jawaban dan pembahasan.',
  },
  {
    label: 'Program Remedial & Pengayaan Matematika',
    type: 'REMEDIAL',
    mapel: 'Matematika',
    kelas: 4,
    prompt: 'Rancang instrumen bimbingan remedial pecahan senilai bagi peserta didik belum tuntas dan pengayaan teka-teki logika.',
  },
];

export const AIDocumentModal: React.FC = () => {
  const {
    isAiDocOpen,
    closeAiDoc,
    addDocument,
    openPreviewDoc,
    subjects,
    activeSchoolYear,
    activeSemester,
    activeCurriculum,
    teacherProfile,
    madrasahProfile,
    curriculumReferences,
    generateDocumentWithAI,
    performAIAction,
    showNotification,
    documents,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'generate' | 'quick-tools'>('generate');

  // Generator form states
  const [prompt, setPrompt] = useState('');
  const [docType, setDocType] = useState<DocumentType>('MODUL_AJAR');
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);
  const [selectedParentDocId, setSelectedParentDocId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Quick action states
  const [actionType, setActionType] = useState<string>('PERBAIKI_DOKUMEN');
  const [quickInput, setQuickInput] = useState('');
  const [quickResult, setQuickResult] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // When parent document selection changes, auto-carry forward information
  useEffect(() => {
    if (selectedParentDocId) {
      const parent = documents.find((d) => d.id === selectedParentDocId);
      if (parent) {
        setMapel(parent.mataPelajaran);
        setKelas(parent.kelas);
        const { suggestedPrompt } = extractContextFromParent(parent);
        setPrompt((prev) => (prev ? prev : suggestedPrompt));
      }
    }
  }, [selectedParentDocId, documents]);

  if (!isAiDocOpen) return null;

  const currentFase = kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C';

  // Check if matching official reference exists
  const matchingRefs = curriculumReferences.filter(
    (r) =>
      r.isVerified &&
      (r.fase === currentFase || r.fase === 'Semua') &&
      (!r.subject || r.subject.toLowerCase().includes(mapel.toLowerCase()))
  );

  const hasOfficialReference = matchingRefs.length > 0;

  const handleApplyPreset = (preset: PresetPrompt) => {
    setPrompt(preset.prompt);
    setDocType(preset.type);
    setMapel(preset.mapel);
    setKelas(preset.kelas);
  };

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      showNotification('Tuliskan perintah atau topik perangkat ajar terlebih dahulu', 'error');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Menghubungkan ke Google Gemini AI (Model gemini-3.8-flash)...');

    const stepInterval = setInterval(() => {
      setGenerationStep((current) => {
        if (current.includes('Menghubungkan')) {
          return 'Menganalisis regulasi Kemenag KMA 450/2024 & acuan CP resmi...';
        }
        if (current.includes('Menganalisis')) {
          return 'Menyusun komponen pedagogis & integrasi profil PPRA-P5...';
        }
        return 'Memvalidasi rubrik, matriks tabel, dan format cetak dokumen...';
      });
    }, 1400);

    try {
      const parentDoc = documents.find((d) => d.id === selectedParentDocId);
      const enhancedPrompt = parentDoc
        ? `${prompt}\n[RUJUKAN DOKUMEN SUMBER]: Merujuk pada ${parentDoc.tipeLabel}: "${parentDoc.judul}". Pastikan tujuan dan materi turunan selaras dengan dokumen induk ini.`
        : prompt;

      const response = await generateDocumentWithAI({
        prompt: enhancedPrompt,
        docType,
        mapel,
        kelas,
        fase: currentFase,
        materi: prompt,
      });

      clearInterval(stepInterval);

      if (!response.success && !response.content) {
        showNotification(response.error || 'Gagal menghasilkan dokumen via AI', 'error');
        setIsGenerating(false);
        return;
      }

      const generatedRaw = response.content || '';

      // Parse generated content into structured sections
      let parsedSections: DocumentSection[] = [];

      if (generatedRaw.includes('##') || generatedRaw.includes('BAGIAN') || generatedRaw.includes('I.')) {
        const parts = generatedRaw.split(/(?=^##\s+|^###\s+|^[I|V|X]+\.\s+)/gm);
        parsedSections = parts
          .filter((p) => p.trim().length > 0)
          .map((part, index) => {
            const lines = part.trim().split('\n');
            const title = lines[0].replace(/^#+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
            const content = lines.slice(1).join('\n').trim();
            return {
              id: `sec-ai-${Date.now()}-${index}`,
              title: title || `Bagian ${index + 1}`,
              content: content || part.trim(),
            };
          });
      }

      if (parsedSections.length === 0) {
        parsedSections = [
          {
            id: `sec-ai-${Date.now()}-1`,
            title: 'I. INFORMASI UMUM & IDENTITAS MODUL',
            content: `A. Identitas Modul:
- Penyusun: ${teacherProfile.namaLengkap}
- Madrasah: ${madrasahProfile.namaMadrasah}
- Jenjang / Fase: Madrasah Ibtidaiyah / Fase ${currentFase} (Kelas ${kelas})
- Mata Pelajaran: ${mapel}
- Alokasi Waktu: 4 Jam Pelajaran (2 Pertemuan x 35 Menit)
- Kurikulum: ${activeCurriculum.nama}

B. Dimensi Profil Pelajar Pancasila & PPRA:
1. Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia.
2. Mandiri, Bernalar Kritis, dan Bergotong Royong.
3. Nilai Rahmatan Lil Alamin: Qudwah (Keteladanan), Tawassuth (Mengambil Jalan Tengah), dan Tasamuh (Toleransi).

C. Catatan Verifikasi:
${hasOfficialReference ? '✓ Disusun berdasarkan referensi CP resmi Kemenag' : '⚠ Perlu verifikasi mandiri guru dengan dokumen CP resmi madrasah'}`,
          },
          {
            id: `sec-ai-${Date.now()}-2`,
            title: 'II. KOMPONEN INTI & AKTIVITAS PEMBELAJARAN',
            content: generatedRaw || `A. Tujuan Pembelajaran:
Peserta didik dapat memahami konsep ${mapel} materi "${prompt.slice(0, 80)}" dan mengamalkannya dalam kehidupan madrasah.

B. Langkah-langkah Pembelajaran:
1. Pendahuluan: Tadarus, motivasi, dan apersepsi kontekstual.
2. Inti: Eksplorasi materi, diskusi kelompok terarah, dan latihan refleksi.
3. Penutup: Rangkuman hikmah, asesmen formatif, dan doa bersama.`,
          },
          {
            id: `sec-ai-${Date.now()}-3`,
            title: 'III. INSTRUMEN ASESMEN & TINDAK LANJUT',
            content: `A. Asesmen Formatif: Pengamatan proses diskusi dan lembar observasi sikap PPRA.
B. Asesmen Sumatif: Uji pemahaman tertulis dan penilaian kinerja siswa.
C. Rencana Tindak Lanjut: Bimbingan remedial terbimbing dan pengayaan penguatan literasi islami.`,
          },
        ];
      }

      const meta = DOCUMENT_TYPE_METAS[docType] || { label: docType };
      const docTitle = `[AI] ${meta.label} ${mapel} Kelas ${kelas} - ${prompt.slice(0, 35)}...`;

      const newDoc = addDocument({
        judul: docTitle,
        tipe: docType,
        tipeLabel: meta.label,
        kelas,
        fase: currentFase,
        mataPelajaran: mapel,
        tahunPelajaran: activeSchoolYear.tahun,
        semester: activeSemester.semester,
        kurikulum: activeCurriculum.nama,
        status: 'Draft',
        alokasiWaktu: '4 JP (2 Pertemuan x 35 Menit)',
        tujuanRingkas: `Hasil rancangan otomatis AI Asisten Guru untuk: ${prompt.slice(0, 100)}`,
        sections: parsedSections,
        tags: ['AI Generated', `Kelas ${kelas}`, `Fase ${currentFase}`, mapel, 'KMA 450'],
        isAiGenerated: true,
        sourceDocId: parentDoc ? parentDoc.id : undefined,
        sourceDocTitle: parentDoc ? parentDoc.judul : undefined,
        sourceDocType: parentDoc ? parentDoc.tipe : undefined,
        paperSettings: {
          size: 'A4',
          margin: 'normal',
          includeKop: true,
          includeSignatures: true,
        },
      });

      showNotification('Dokumen perangkat ajar berhasil dibuat dengan AI!', 'success');
      closeAiDoc();
      openPreviewDoc(newDoc);
    } catch (err: any) {
      clearInterval(stepInterval);
      showNotification(err.message || 'Terjadi kesalahan sistem saat menghubungi Gemini AI', 'error');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleRunQuickAction = async () => {
    if (!quickInput.trim()) {
      showNotification('Masukkan teks atau materi yang ingin diproses oleh AI', 'error');
      return;
    }

    setIsProcessingAction(true);
    setQuickResult('');

    try {
      const res = await performAIAction(actionType, quickInput, {
        mapel,
        kelas,
        fase: currentFase,
      });

      if (res.success && res.result) {
        setQuickResult(res.result);
        showNotification('Proses AI selesai!', 'success');
      } else {
        showNotification(res.error || 'Gagal memproses AI Action', 'error');
      }
    } catch (err: any) {
      showNotification(err.message || 'Gagal memproses tindakan AI', 'error');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleCopyResult = () => {
    if (quickResult) {
      navigator.clipboard.writeText(quickResult);
      showNotification('Teks hasil AI berhasil disalin ke clipboard', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  SIPENA AI ASSISTANT • GOOGLE GEMINI
                </span>
                <span className="text-[9px] bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded-full font-medium">
                  30 Jenis Dokumen • KMA 450/2024
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Generator Perangkat Ajar & Asesmen MI Lengkap
              </h3>
            </div>
          </div>

          <button
            onClick={closeAiDoc}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'generate'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Penyusunan Berantai (CP → TP → ATP → PROTA → PROMES → Modul → Asesmen)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quick-tools')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'quick-tools'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Aksi Cepat AI (Perbaiki / Ringkas / Soal HOTS / LKPD)
          </button>
        </div>

        {/* Tab 1: Full Document Generator */}
        {activeTab === 'generate' && (
          <form onSubmit={handleGenerateAI} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Grounding & Verification Notice Banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                hasOfficialReference
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {hasOfficialReference ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 flex-1">
                <div className="font-semibold flex items-center justify-between">
                  <span>
                    {hasOfficialReference
                      ? '✓ Terkoneksi Referensi Resmi Kemenag'
                      : '⚠ Penanda Verifikasi Otomatis Aktif'}
                  </span>
                  <span className="text-[11px] font-mono">
                    Fase {currentFase} (Kelas {kelas})
                  </span>
                </div>
                <p className="leading-relaxed opacity-90">
                  {hasOfficialReference
                    ? `Ditemukan ${matchingRefs.length} dokumen referensi/CP resmi yang sesuai untuk ${mapel}. AI akan menyusun perangkat berdasarkan dokumen tersebut.`
                    : `Belum ada CP resmi terdaftar khusus ${mapel} Fase ${currentFase}. Dokumen yang dihasilkan akan diberi penanda khusus agar Anda memverifikasinya.`}
                </p>
              </div>
            </div>

            {/* Cascading Parent Document Selector */}
            {documents.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1.5">
                  <GitMerge className="w-4 h-4 text-emerald-700" />
                  <span>Rujuk Dokumen Sumber Sebelumnya (Hubungan Antar Dokumen Berantai):</span>
                </div>
                <select
                  value={selectedParentDocId}
                  onChange={(e) => setSelectedParentDocId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="">-- Buat Mandiri (Tanpa Merujuk Dokumen Sebelumnya) --</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      [{d.tipeLabel || d.tipe}] {d.judul} • {d.mataPelajaran} Kelas {d.kelas}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Memilih dokumen rujukan akan menyelaraskan materi dan tujuan secara otomatis sehingga Anda tidak perlu mengisi ulang informasi.
                </p>
              </div>
            )}

            {/* Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Inspirasi & Contoh Prompt Cepat
                </label>
                <span className="text-[11px] text-slate-500">Klik untuk memuat instan</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {promptPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-xs group"
                  >
                    <p className="font-semibold text-slate-900 group-hover:text-emerald-800 truncate">
                      {preset.label}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {preset.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Parameters: 30 Document Types Categorized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Dokumen (30 Pilihan)
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
                >
                  <optgroup label="1. Inti Kurikulum & Perencanaan">
                    <option value="CP">1. Capaian Pembelajaran (CP)</option>
                    <option value="TP">2. Tujuan Pembelajaran (TP)</option>
                    <option value="ATP">3. Alur Tujuan Pembelajaran (ATP)</option>
                    <option value="PROTA">4. Program Tahunan (PROTA)</option>
                    <option value="PROMES">5. Program Semester (PROMES)</option>
                    <option value="KKTP">6. Kriteria Ketercapaian TP (KKTP)</option>
                    <option value="MODUL_AJAR">7. Modul Ajar / RPP Merdeka</option>
                    <option value="PEMETAAN_MATERI">8. Pemetaan Materi Pelajaran</option>
                  </optgroup>
                  <optgroup label="2. Asesmen & Evaluasi">
                    <option value="ASESMEN_DIAGNOSTIK">9. Asesmen Diagnostik Awal</option>
                    <option value="ASESMEN_FORMATIF">10. Asesmen Formatif Proses</option>
                    <option value="ASESMEN_SUMATIF">11. Asesmen Sumatif (Lingkup Materi/SAS)</option>
                    <option value="KISI_KISI">12. Kisi-kisi Soal Evaluasi</option>
                    <option value="BANK_SOAL">13. Bank Soal MI Terpadu</option>
                    <option value="SOAL_PG">14. Soal Pilihan Ganda (PG)</option>
                    <option value="SOAL_PG_KOMPLEKS">15. Soal PG Kompleks (Model AKMI)</option>
                    <option value="SOAL_BENAR_SALAH">16. Soal Benar / Salah</option>
                    <option value="SOAL_MENJODOHKAN">17. Soal Menjodohkan</option>
                    <option value="SOAL_ISIAN">18. Soal Isian Singkat</option>
                    <option value="SOAL_URAIAN">19. Soal Uraian / Essay HOTS</option>
                    <option value="KUNCI_JAWABAN">20. Kunci Jawaban & Pembahasan</option>
                    <option value="RUBRIK_PENILAIAN">21. Rubrik Penilaian & Penskoran</option>
                  </optgroup>
                  <optgroup label="3. Bahan Ajar & Aktivitas">
                    <option value="LKPD">22. Lembar Kerja Siswa (LKPD)</option>
                    <option value="MATERI_BAB">23. Materi Pembelajaran per Bab</option>
                    <option value="RINGKASAN_MATERI">24. Ringkasan / Intisari Materi</option>
                  </optgroup>
                  <optgroup label="4. Administrasi Mengajar & Rekap">
                    <option value="JURNAL">25. Jurnal Mengajar Harian</option>
                    <option value="AGENDA">26. Agenda Mengajar</option>
                    <option value="REKAP_NILAI">27. Rekap Nilai Siswa</option>
                    <option value="REMEDIAL">28. Program Remedial</option>
                    <option value="PENGAYAAN">29. Program Pengayaan</option>
                    <option value="LAPORAN_BELAJAR">30. Laporan Capaian Pembelajaran</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelas MI & Fase
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  {[1, 2, 3, 4, 5, 6].map((k) => (
                    <option key={k} value={k}>
                      Kelas {k} (Fase {k <= 2 ? 'A' : k <= 4 ? 'B' : 'C'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI Prompt Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Topik / Instruksi Pembelajaran Khusus</span>
                <span className="text-[11px] text-emerald-700 font-normal">
                  KMA 450/2024 • P5 & PPRA
                </span>
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tuliskan materi pokok, bab, kompetensi yang ingin ditekankan, atau instruksi model pembelajaran (misal: Problem Based Learning, pendekatan kontekstual)..."
                className="w-full text-xs sm:text-sm p-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed text-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Data madrasah ({madrasahProfile.namaMadrasah}) dan guru ({teacherProfile.namaLengkap}) akan disematkan otomatis pada kop dan tanda tangan dokumen.
              </p>
            </div>

            {/* Generation Progress Indicator */}
            {isGenerating && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2 animate-pulse">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Proses Penyusunan Perangkat Ajar AI Berjalan...</span>
                </div>
                <p className="font-mono text-[11px] text-emerald-800 pl-6">
                  {generationStep || 'Memproses instruksi...'}
                </p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Model Gemini 3.8 Flash • Siap Ekspor DOCX & PDF</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeAiDoc}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 rounded-lg transition-colors shadow-xs"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyusun Dokumen...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Quick AI Actions */}
        {activeTab === 'quick-tools' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'PERBAIKI_DOKUMEN', label: 'Perbaiki Dokumen' },
                { id: 'KEMBANGKAN_MATERI', label: 'Kembangkan Materi' },
                { id: 'RINGKAS_MATERI', label: 'Ringkas Materi' },
                { id: 'BUAT_SOAL', label: 'Buat Soal HOTS' },
                { id: 'BUAT_RUBRIK', label: 'Rubrik Penilaian' },
                { id: 'BUAT_LKPD', label: 'Buat LKPD' },
                { id: 'BUAT_MODUL', label: 'Draft Modul Ajar' },
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setActionType(act.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                    actionType === act.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Masukkan Teks Bahan / Dokumen untuk Diproses
              </label>
              <textarea
                rows={4}
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Tempelkan paragraf materi, draf soal lama, atau teks pembelajaran yang ingin diolah..."
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 leading-relaxed font-mono"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleRunQuickAction}
                disabled={isProcessingAction}
                className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                {isProcessingAction ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sedang Memproses...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Jalankan Tindakan AI</span>
                  </>
                )}
              </button>
            </div>

            {quickResult && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 space-y-2 p-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Hasil Pengolahan AI:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyResult}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-medium text-slate-700"
                    >
                      <Copy className="w-3 h-3" />
                      Salin
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto p-2 bg-white rounded border border-slate-200">
                  {quickResult}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

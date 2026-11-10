import React, { useState } from 'react';
import {
  Files,
  Search,
  Plus,
  Sparkles,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Filter,
  CheckCircle2,
  FileText,
  FileDown,
  Printer,
  GitBranch,
  ArrowRight,
  AlertTriangle,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentType, DocumentItem } from '../types';
import { exportToDocx, printDocumentAsPdf, downloadBlob, generateDocumentFilename } from '../lib/exportDocument';
import { DOCUMENT_TYPE_METAS } from '../lib/documentRelations';

export const DokumenSayaPage: React.FC = () => {
  const {
    documents,
    openCreateDoc,
    openAiDoc,
    openPreviewDoc,
    openEditDoc,
    duplicateDocument,
    deleteDocument,
    requestConfirm,
    subjects,
    schoolYears,
    showNotification,
    madrasahProfile,
    teacherProfile,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState<number | 'ALL'>('ALL');
  const [filterMapel, setFilterMapel] = useState<string>('ALL');
  const [filterTipe, setFilterTipe] = useState<string>('ALL');
  const [filterTahun, setFilterTahun] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Draft' | 'Final' | 'Disetujui'>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc'>('date-desc');
  const [exportingDocId, setExportingDocId] = useState<string | null>(null);

  // Filter and Sort
  const filteredDocs = documents
    .filter((doc) => {
      const matchSearch =
        search === '' ||
        doc.judul.toLowerCase().includes(search.toLowerCase()) ||
        doc.mataPelajaran.toLowerCase().includes(search.toLowerCase()) ||
        doc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchKelas = filterKelas === 'ALL' || doc.kelas === filterKelas;
      const matchMapel = filterMapel === 'ALL' || doc.mataPelajaran === filterMapel;
      const matchTipe = filterTipe === 'ALL' || doc.tipe === filterTipe;
      const matchTahun = filterTahun === 'ALL' || doc.tahunPelajaran === filterTahun;
      const matchStatus = filterStatus === 'ALL' || doc.status === filterStatus;

      return matchSearch && matchKelas && matchMapel && matchTipe && matchTahun && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title-asc') {
        return a.judul.localeCompare(b.judul);
      }
      if (sortBy === 'date-asc') {
        return (a.tanggalDiperbarui || '').localeCompare(b.tanggalDiperbarui || '');
      }
      return (b.tanggalDiperbarui || '').localeCompare(a.tanggalDiperbarui || '');
    });

  const handleDelete = (doc: DocumentItem) => {
    requestConfirm(
      'Hapus Dokumen Perangkat Ajar',
      `Apakah Anda yakin ingin menghapus "${doc.judul}"? Tindakan ini tidak dapat dibatalkan.`,
      () => {
        deleteDocument(doc.id);
        showNotification('Dokumen berhasil dihapus', 'info');
      }
    );
  };

  const handleExportWord = async (doc: DocumentItem) => {
    setExportingDocId(doc.id);
    try {
      const blob = await exportToDocx(doc, madrasahProfile, teacherProfile);
      const filename = generateDocumentFilename(doc, 'docx');
      downloadBlob(blob, filename);
      showNotification(`File Word (${filename}) berhasil diunduh!`, 'success');
    } catch (err: any) {
      showNotification(`Gagal mengunduh file Word: ${err.message}`, 'error');
    } finally {
      setExportingDocId(null);
    }
  };

  const handlePrintPdf = (doc: DocumentItem) => {
    printDocumentAsPdf(doc, madrasahProfile, teacherProfile);
  };

  const handleContinuePipeline = (doc: DocumentItem) => {
    const meta = DOCUMENT_TYPE_METAS[doc.tipe];
    const nextType = meta?.recommendedNext;
    const nextMeta = nextType ? DOCUMENT_TYPE_METAS[nextType] : null;

    const promptSeed = `Buatkan ${nextMeta?.label || 'dokumen lanjutan'} berdasarkan rujukan ${doc.tipeLabel}: "${doc.judul}" untuk ${doc.mataPelajaran} Kelas ${doc.kelas}.`;
    openAiDoc(promptSeed);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Files className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Dokumen Saya (Katalog & Ekspor)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola, alur berantai (pipeline), edit, duplikat, dan unduh dokumen Microsoft Word (.docx) atau PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAiDoc()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-semibold transition-colors border border-emerald-300 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Buat dengan AI</span>
          </button>

          <button
            onClick={openCreateDoc}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Dokumen Baru</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Realtime Search Input & Sorter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan judul dokumen, bab materi, atau kata kunci tag..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-500">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-slate-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Terbaru Diperbarui</option>
                <option value="date-asc">Terlama</option>
                <option value="title-asc">Judul (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kelas MI</label>
            <select
              value={filterKelas}
              onChange={(e) =>
                setFilterKelas(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
              }
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              <option value="ALL">Semua Kelas</option>
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <option key={k} value={k}>
                  Kelas {k} ({k <= 2 ? 'Fase A' : k <= 4 ? 'Fase B' : 'Fase C'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Mata Pelajaran</label>
            <select
              value={filterMapel}
              onChange={(e) => setFilterMapel(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              <option value="ALL">Semua Mapel</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Jenis Dokumen</label>
            <select
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              <option value="ALL">Semua Jenis (30 Tipe)</option>
              <option value="CP">Capaian Pembelajaran (CP)</option>
              <option value="TP">Tujuan Pembelajaran (TP)</option>
              <option value="ATP">Alur TP (ATP)</option>
              <option value="PROTA">Program Tahunan (PROTA)</option>
              <option value="PROMES">Program Semester (PROMES)</option>
              <option value="KKTP">Kriteria KKTP</option>
              <option value="MODUL_AJAR">Modul Ajar / RPP</option>
              <option value="PEMETAAN_MATERI">Pemetaan Materi</option>
              <option value="ASESMEN_DIAGNOSTIK">Asesmen Diagnostik</option>
              <option value="ASESMEN_FORMATIF">Asesmen Formatif</option>
              <option value="ASESMEN_SUMATIF">Asesmen Sumatif</option>
              <option value="KISI_KISI">Kisi-kisi Soal</option>
              <option value="BANK_SOAL">Bank Soal MI</option>
              <option value="SOAL_PG">Soal Pilihan Ganda</option>
              <option value="SOAL_URAIAN">Soal Uraian HOTS</option>
              <option value="LKPD">Lembar LKPD</option>
              <option value="MATERI_BAB">Materi per Bab</option>
              <option value="JURNAL">Jurnal Mengajar</option>
              <option value="AGENDA">Agenda Mengajar</option>
              <option value="REKAP_NILAI">Rekap Nilai</option>
              <option value="REMEDIAL">Program Remedial</option>
              <option value="PENGAYAAN">Program Pengayaan</option>
              <option value="LAPORAN_BELAJAR">Laporan Belajar</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tahun Pelajaran</label>
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
            >
              <option value="ALL">Semua Tahun</option>
              {schoolYears.map((y) => (
                <option key={y.id} value={y.tahun}>
                  {y.tahun}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status Dokumen</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              <option value="ALL">Semua Status</option>
              <option value="Draft">Draft</option>
              <option value="Final">Final</option>
              <option value="Disetujui">Disetujui Kepala MI</option>
            </select>
          </div>
        </div>

        {/* Active filter summary count */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-900 font-mono">{filteredDocs.length}</strong>{' '}
            dari <span className="font-mono">{documents.length}</span> total dokumen
          </span>
          {(filterKelas !== 'ALL' ||
            filterMapel !== 'ALL' ||
            filterTipe !== 'ALL' ||
            filterTahun !== 'ALL' ||
            filterStatus !== 'ALL' ||
            search) && (
            <button
              onClick={() => {
                setSearch('');
                setFilterKelas('ALL');
                setFilterMapel('ALL');
                setFilterTipe('ALL');
                setFilterTahun('ALL');
                setFilterStatus('ALL');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Document Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const meta = DOCUMENT_TYPE_METAS[doc.tipe];
          const hasNextStep = meta?.recommendedNext;
          const nextMeta = hasNextStep ? DOCUMENT_TYPE_METAS[hasNextStep] : null;

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {doc.tipeLabel || doc.tipe}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Kelas {doc.kelas} (Fase {doc.fase})
                    </span>
                    {doc.isAiGenerated && (
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>AI</span>
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      doc.status === 'Final'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'Disetujui'
                        ? 'bg-teal-100 text-teal-900'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                {/* Cascading parent relation badge */}
                {doc.sourceDocTitle && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 truncate max-w-full">
                    <GitBranch className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">Sumber: {doc.sourceDocTitle}</span>
                  </div>
                )}

                {doc.needsSyncWithSource && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Dokumen sumber telah diubah, periksa keselarasan</span>
                  </div>
                )}

                <h2
                  onClick={() => openPreviewDoc(doc)}
                  className="text-sm font-bold text-slate-900 mt-2 hover:text-emerald-700 cursor-pointer transition-colors line-clamp-2 leading-snug"
                >
                  {doc.judul}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Mapel: <strong className="text-slate-800">{doc.mataPelajaran}</strong> · T.P.{' '}
                  {doc.tahunPelajaran} (Sem. {doc.semester})
                </p>

                {doc.tujuanRingkas && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {doc.tujuanRingkas}
                  </p>
                )}

                {/* Next Step in Pipeline Action */}
                {nextMeta && (
                  <div className="mt-3 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span className="text-[11px] text-slate-500">Langkah lanjut:</span>
                    <button
                      onClick={() => handleContinuePipeline(doc)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition-colors"
                    >
                      <span>Buat {nextMeta.type}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {doc.tanggalDiperbarui}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openPreviewDoc(doc)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Pratinjau Dokumen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openEditDoc(doc)}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Dokumen"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleExportWord(doc)}
                    disabled={exportingDocId === doc.id}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Unduh Microsoft Word (.docx)"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePrintPdf(doc)}
                    className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                    title="Cetak atau Unduh PDF Resmi"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => duplicateDocument(doc.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                    title="Duplikat Dokumen"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Tidak ada dokumen yang ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba sesuaikan filter pencarian atau buat dokumen baru dengan AI.
            </p>
            <button
              onClick={openCreateDoc}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              Buat Dokumen Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Edit3,
  Download,
  Check,
  FileDown,
  GitBranch,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KopMadrasah } from '../common/KopMadrasah';
import { SignatureSection } from '../common/SignatureSection';
import { exportToDocx, printDocumentAsPdf, downloadBlob, generateDocumentFilename } from '../../lib/exportDocument';
import { DOCUMENT_TYPE_METAS } from '../../lib/documentRelations';

export const DocumentPreviewModal: React.FC = () => {
  const {
    previewDoc,
    closePreviewDoc,
    openEditDoc,
    showNotification,
    madrasahProfile,
    teacherProfile,
    openAiDoc,
  } = useApp();

  const printAreaRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  if (!previewDoc) return null;

  const currentMeta = DOCUMENT_TYPE_METAS[previewDoc.tipe];
  const nextRecommendedType = currentMeta?.recommendedNext;
  const nextRecommendedMeta = nextRecommendedType ? DOCUMENT_TYPE_METAS[nextRecommendedType] : null;

  const handlePrint = () => {
    printDocumentAsPdf(previewDoc, madrasahProfile, teacherProfile);
  };

  const handleExportWord = async () => {
    setIsExportingWord(true);
    try {
      const blob = await exportToDocx(previewDoc, madrasahProfile, teacherProfile);
      const filename = generateDocumentFilename(previewDoc, 'docx');
      downloadBlob(blob, filename);
      showNotification(`Dokumen Microsoft Word (${filename}) berhasil diunduh!`, 'success');
    } catch (err: any) {
      showNotification(`Gagal mengunduh file Word: ${err.message}`, 'error');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleCopyText = async () => {
    const fullText = `
${previewDoc.judul}
Tipe: ${previewDoc.tipeLabel} | Kelas: ${previewDoc.kelas} (Fase ${previewDoc.fase})
Mata Pelajaran: ${previewDoc.mataPelajaran} | Kurikulum: ${previewDoc.kurikulum}
Tahun Pelajaran: ${previewDoc.tahunPelajaran} | Semester: ${previewDoc.semester}

${previewDoc.sections.map((s) => `\n=== ${s.title} ===\n${s.content}\n`).join('\n')}
    `.trim();

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      showNotification('Teks dokumen berhasil disalin ke clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showNotification('Gagal menyalin teks', 'error');
    }
  };

  const handleCreateDerived = () => {
    const promptSeed = `Buatkan ${nextRecommendedMeta?.label || 'dokumen lanjutan'} berdasarkan rujukan ${previewDoc.tipeLabel}: "${previewDoc.judul}" untuk ${previewDoc.mataPelajaran} Kelas ${previewDoc.kelas}.`;
    closePreviewDoc();
    openAiDoc(promptSeed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Modal Toolbar (Non-printable) */}
        <div className="no-print flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900 text-white shrink-0">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                {previewDoc.tipeLabel || previewDoc.tipe}
              </span>
              {previewDoc.sourceDocTitle && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-emerald-400" />
                  Rujukan: {previewDoc.sourceDocTitle.slice(0, 30)}...
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-lg">
              {previewDoc.judul}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const doc = previewDoc;
                closePreviewDoc();
                openEditDoc(doc);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Edit Dokumen di Editor Lengkap"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Edit Dokumen</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Salin Teks"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-300">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline">Salin</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportWord}
              disabled={isExportingWord}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 rounded-lg transition-colors shadow-xs"
              title="Unduh format Microsoft Word (.docx)"
            >
              {isExportingWord ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden sm:inline">Unduh Word (.docx)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              title="Cetak atau Unduh Dokumen sebagai PDF Resmi"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={closePreviewDoc}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
              aria-label="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cascading Next Document Callout */}
        {nextRecommendedMeta && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">
                Langkah Berikutnya dalam Alur Pembelajaran:{' '}
                <strong>{nextRecommendedMeta.label}</strong>
              </span>
            </div>
            <button
              onClick={handleCreateDerived}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors shadow-2xs ml-3"
            >
              <span>Lanjutkan Buat {nextRecommendedMeta.type}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Out-of-sync Warning if Parent Changed */}
        {previewDoc.needsSyncWithSource && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Dokumen sumber rujukan ({previewDoc.sourceDocTitle || 'Induk'}) telah diperbarui baru-baru ini. Periksa kembali keselarasan tujuan dan materi dokumen turunan ini.
            </span>
          </div>
        )}

        {/* Document Sheet Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60">
          <div
            ref={printAreaRef}
            className="print-page max-w-[210mm] mx-auto bg-white p-6 sm:p-10 shadow-md border border-slate-200 rounded-xl text-slate-900"
          >
            {/* Kop Madrasah Resmi */}
            <KopMadrasah
              documentTitle={previewDoc.judul.replace(/\[AI\]\s*/i, '')}
              documentSubtitle={`${previewDoc.tipeLabel || previewDoc.tipe} · Kelas ${previewDoc.kelas} (Fase ${previewDoc.fase}) · Semester ${previewDoc.semester} · T.P. ${previewDoc.tahunPelajaran}`}
            />

            {/* Document Metadata Table */}
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-slate-500 block">Mata Pelajaran:</span>
                <span className="font-semibold text-slate-900">{previewDoc.mataPelajaran}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Fase / Kelas:</span>
                <span className="font-semibold text-slate-900">
                  Fase {previewDoc.fase} / Kelas {previewDoc.kelas}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Alokasi Waktu:</span>
                <span className="font-semibold text-slate-900">
                  {previewDoc.alokasiWaktu || 'Sesuai ATP'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Kurikulum:</span>
                <span className="font-semibold text-slate-900">{previewDoc.kurikulum}</span>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
              {previewDoc.sections.map((section) => (
                <div key={section.id} className="border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-950 text-sm sm:text-base mb-2 border-b-2 border-emerald-700/50 pb-1 inline-block">
                    {section.title}
                  </h3>
                  <div className="whitespace-pre-wrap font-sans text-slate-800 space-y-1">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Signatures */}
            <SignatureSection tanggalDokumen={previewDoc.tanggalDiperbarui} />
          </div>
        </div>
      </div>
    </div>
  );
};

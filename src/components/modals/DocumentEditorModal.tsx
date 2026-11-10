import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Eye,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  FileDown,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Settings2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, DocumentSection, PaperSettings } from '../../types';
import { exportToDocx, printDocumentAsPdf, downloadBlob, generateDocumentFilename } from '../../lib/exportDocument';

export const DocumentEditorModal: React.FC = () => {
  const {
    editingDoc,
    closeEditDoc,
    updateDocument,
    openPreviewDoc,
    subjects,
    madrasahProfile,
    teacherProfile,
    showNotification,
  } = useApp();

  const [formData, setFormData] = useState<Partial<DocumentItem>>({});
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [paperSettings, setPaperSettings] = useState<PaperSettings>({
    size: 'A4',
    margin: 'normal',
    includeKop: true,
    includeSignatures: true,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  const textareaRefs = useRef<{ [key: number]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    if (editingDoc) {
      setFormData({
        judul: editingDoc.judul,
        tipe: editingDoc.tipe,
        tipeLabel: editingDoc.tipeLabel,
        kelas: editingDoc.kelas,
        fase: editingDoc.fase,
        mataPelajaran: editingDoc.mataPelajaran,
        tahunPelajaran: editingDoc.tahunPelajaran,
        semester: editingDoc.semester,
        kurikulum: editingDoc.kurikulum,
        status: editingDoc.status,
        alokasiWaktu: editingDoc.alokasiWaktu,
        tujuanRingkas: editingDoc.tujuanRingkas,
        sourceDocId: editingDoc.sourceDocId,
        sourceDocTitle: editingDoc.sourceDocTitle,
      });
      setSections([...editingDoc.sections]);
      if (editingDoc.paperSettings) {
        setPaperSettings(editingDoc.paperSettings);
      }
      setIsDirty(false);
      setLastAutoSaved(null);
    }
  }, [editingDoc]);

  // Periodic Autosave effect (every 20s if dirty)
  useEffect(() => {
    if (!editingDoc || !isDirty) return;

    const timer = setInterval(() => {
      if (editingDoc && isDirty && formData.judul?.trim()) {
        updateDocument(editingDoc.id, {
          ...formData,
          sections,
          paperSettings,
        });
        setIsDirty(false);
        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setLastAutoSaved(`Tersimpan otomatis ${timeNow}`);
      }
    }, 20000);

    return () => clearInterval(timer);
  }, [editingDoc, isDirty, formData, sections, paperSettings, updateDocument]);

  if (!editingDoc) return null;

  const handleFieldChange = (key: keyof DocumentItem, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleAddSection = () => {
    const newSection: DocumentSection = {
      id: `sec-${Date.now()}`,
      title: `BAGIAN ${sections.length + 1}. RINCIAN PEMBELAJARAN`,
      content: 'Tuliskan rincian materi atau lembar aktivitas di sini...',
    };
    setSections([...sections, newSection]);
    setActiveSectionIndex(sections.length);
    setIsDirty(true);
  };

  const handleUpdateSection = (index: number, key: keyof DocumentSection, val: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [key]: val };
    setSections(updated);
    setIsDirty(true);
  };

  const handleDeleteSection = (index: number) => {
    if (sections.length <= 1) {
      showNotification('Dokumen minimal memiliki 1 bagian', 'info');
      return;
    }
    const filtered = sections.filter((_, i) => i !== index);
    setSections(filtered);
    setActiveSectionIndex(Math.max(0, index - 1));
    setIsDirty(true);
  };

  const insertTextAtCursor = (prefix: string, suffix: string = '') => {
    const textarea = textareaRefs.current[activeSectionIndex];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = `${prefix}${selected || 'teks'}${suffix}`;

    const newContent =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    handleUpdateSection(activeSectionIndex, 'content', newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 50);
  };

  const insertTableTemplate = () => {
    const tableTemplate = `\n| No | Indikator / Aspek | Kriteria Ketercapaian | Keterangan |\n|---|---|---|---|\n| 1 | Pemahaman Konsep | Menjelaskan intisari materi | Tercapai |\n| 2 | Pengamalan Nyata | Mempraktikkan dalam pergaulan | Sangat Baik |\n`;
    insertTextAtCursor(tableTemplate, '');
  };

  const handleSave = () => {
    if (!formData.judul?.trim()) {
      showNotification('Judul dokumen wajib diisi', 'error');
      return;
    }
    updateDocument(editingDoc.id, {
      ...formData,
      sections,
      paperSettings,
    });
    setIsDirty(false);
    showNotification('Perubahan dokumen berhasil disimpan permanen', 'success');
    closeEditDoc();
  };

  const handleClose = () => {
    if (isDirty) {
      if (confirm('Terdapat perubahan dokumen yang belum disimpan. Tetap ingin menutup editor?')) {
        closeEditDoc();
      }
    } else {
      closeEditDoc();
    }
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      const currentDoc: DocumentItem = {
        ...editingDoc,
        ...formData,
        sections,
        paperSettings,
      } as DocumentItem;

      const blob = await exportToDocx(currentDoc, madrasahProfile, teacherProfile);
      const filename = generateDocumentFilename(currentDoc, 'docx');
      downloadBlob(blob, filename);
      showNotification(`File Microsoft Word (${filename}) berhasil diunduh!`, 'success');
    } catch (err: any) {
      showNotification(`Gagal mengekspor Word: ${err.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = () => {
    const currentDoc: DocumentItem = {
      ...editingDoc,
      ...formData,
      sections,
      paperSettings,
    } as DocumentItem;
    printDocumentAsPdf(currentDoc, madrasahProfile, teacherProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[94vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              EDIT
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {formData.tipeLabel || formData.tipe}
                </span>
                {lastAutoSaved && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {lastAutoSaved}
                  </span>
                )}
                {isDirty && (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Belum tersimpan
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-lg">
                {formData.judul || 'Dokumen Perangkat Ajar'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Pengaturan Format & Kop Surat"
            >
              <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Format Kertas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                openPreviewDoc({ ...editingDoc, ...formData, sections, paperSettings } as DocumentItem);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pratinjau</span>
            </button>

            <button
              type="button"
              onClick={handleExportDocx}
              disabled={isExporting}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 rounded-lg transition-colors flex items-center gap-1.5"
              title="Unduh Microsoft Word (.docx)"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Word</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              className="px-3 py-1.5 text-xs font-semibold text-sky-200 bg-sky-950 hover:bg-sky-900 border border-sky-700 rounded-lg transition-colors flex items-center gap-1.5"
              title="Cetak atau Unduh PDF Resmi"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Settings Drawer */}
        {showSettingsDrawer && (
          <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs animate-in slide-in-from-top-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ukuran Kertas</label>
              <select
                value={paperSettings.size}
                onChange={(e) => {
                  setPaperSettings({ ...paperSettings, size: e.target.value as any });
                  setIsDirty(true);
                }}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="A4">A4 (21 x 29.7 cm)</option>
                <option value="F4">F4 / Folio (21.5 x 33 cm)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Margin Dokumen</label>
              <select
                value={paperSettings.margin}
                onChange={(e) => {
                  setPaperSettings({ ...paperSettings, margin: e.target.value as any });
                  setIsDirty(true);
                }}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="normal">Normal (2.5 cm)</option>
                <option value="narrow">Sempit (1.5 cm)</option>
                <option value="wide">Lebar (3 cm)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="kopToggle"
                checked={paperSettings.includeKop}
                onChange={(e) => {
                  setPaperSettings({ ...paperSettings, includeKop: e.target.checked });
                  setIsDirty(true);
                }}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="kopToggle" className="font-semibold text-slate-700 cursor-pointer">
                Tampilkan Kop Madrasah
              </label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="ttdToggle"
                checked={paperSettings.includeSignatures}
                onChange={(e) => {
                  setPaperSettings({ ...paperSettings, includeSignatures: e.target.checked });
                  setIsDirty(true);
                }}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="ttdToggle" className="font-semibold text-slate-700 cursor-pointer">
                Tampilkan Tanda Tangan
              </label>
            </div>
          </div>
        )}

        {/* Rich Formatting Toolbar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-1 text-slate-700 shrink-0">
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
            <button
              type="button"
              onClick={() => insertTextAtCursor('**', '**')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
              title="Tebal (Bold) - **teks**"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('*', '*')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
              title="Miring (Italic) - *teks*"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('<u>', '</u>')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
              title="Garis Bawah (Underline)"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
            <button
              type="button"
              onClick={() => insertTextAtCursor('\n### ', '')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
              title="Sub-Judul (Heading)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('\n- ', '')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
              title="Daftar Poin (Bullet List)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor('\n1. ', '')}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
              title="Daftar Bernomor (Numbered List)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
            <button
              type="button"
              onClick={insertTableTemplate}
              className="inline-flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700"
              title="Sisipkan Tabel Matriks Rapi"
            >
              <TableIcon className="w-4 h-4 text-emerald-600" />
              <span>Sisip Tabel</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 ml-auto hidden md:inline">
            Bagian Aktif: #{activeSectionIndex + 1} ({sections[activeSectionIndex]?.title || 'Bagian'})
          </span>
        </div>

        {/* Editor Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
          {/* Metadata Parameters Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Dokumen Perangkat
              </label>
              <input
                type="text"
                value={formData.judul || ''}
                onChange={(e) => handleFieldChange('judul', e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Contoh: Modul Ajar Akidah Akhlak Kelas 4..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Mata Pelajaran
              </label>
              <select
                value={formData.mataPelajaran || ''}
                onChange={(e) => handleFieldChange('mataPelajaran', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kelas & Fase</label>
              <select
                value={formData.kelas || 1}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const fase = val <= 2 ? 'A' : val <= 4 ? 'B' : 'C';
                  handleFieldChange('kelas', val);
                  handleFieldChange('fase', fase);
                }}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    Kelas {num} (Fase {num <= 2 ? 'A' : num <= 4 ? 'B' : 'C'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Semester</label>
              <select
                value={formData.semester || 'Ganjil'}
                onChange={(e) => handleFieldChange('semester', e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status Dokumen</label>
              <select
                value={formData.status || 'Draft'}
                onChange={(e) => handleFieldChange('status', e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
              >
                <option value="Draft">Draft</option>
                <option value="Final">Final</option>
                <option value="Disetujui">Disetujui Kepala Madrasah</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Alokasi Waktu</label>
              <input
                type="text"
                value={formData.alokasiWaktu || ''}
                onChange={(e) => handleFieldChange('alokasiWaktu', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Misal: 4 JP (2 Pertemuan x 35 Menit)"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tujuan Ringkas / Catatan Kurikulum
              </label>
              <input
                type="text"
                value={formData.tujuanRingkas || ''}
                onChange={(e) => handleFieldChange('tujuanRingkas', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Ringkasan capaian tujuan pembelajaran"
              />
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Rincian Komponen & Bagian Dokumen ({sections.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Klik bagian untuk mengaktifkan toolbar pemformatan dan penyisipan tabel.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Bagian</span>
              </button>
            </div>

            {sections.map((section, idx) => {
              const isActive = activeSectionIndex === idx;
              return (
                <div
                  key={section.id || idx}
                  onClick={() => setActiveSectionIndex(idx)}
                  className={`border rounded-xl p-4 bg-white shadow-2xs space-y-3 transition-all ${
                    isActive
                      ? 'border-emerald-500 ring-2 ring-emerald-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                      className="flex-1 font-bold text-xs sm:text-sm text-slate-900 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                      placeholder="Judul Bagian..."
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(idx);
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Bagian Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    ref={(el) => {
                      textareaRefs.current[idx] = el;
                    }}
                    rows={8}
                    value={section.content}
                    onFocus={() => setActiveSectionIndex(idx)}
                    onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                    className="w-full text-xs sm:text-sm p-3.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-sans leading-relaxed text-slate-800 bg-slate-50/30"
                    placeholder="Ketik rincian isi bagian dokumen atau gunakan toolbar di atas..."
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

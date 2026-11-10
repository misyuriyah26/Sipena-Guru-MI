import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Sparkles,
  Search,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ModulAjarPage: React.FC = () => {
  const {
    documents,
    openPreviewDoc,
    openEditDoc,
    duplicateDocument,
    deleteDocument,
    requestConfirm,
    openCreateDoc,
    openAiDoc,
    subjects,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedKelas, setSelectedKelas] = useState<number | 'ALL'>('ALL');
  const [selectedMapel, setSelectedMapel] = useState<string>('ALL');

  const modulDocs = documents.filter((d) => d.tipe === 'MODUL_AJAR');

  const filtered = modulDocs.filter((doc) => {
    const matchSearch =
      search === '' ||
      doc.judul.toLowerCase().includes(search.toLowerCase()) ||
      doc.mataPelajaran.toLowerCase().includes(search.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchKelas = selectedKelas === 'ALL' || doc.kelas === selectedKelas;
    const matchMapel = selectedMapel === 'ALL' || doc.mataPelajaran === selectedMapel;

    return matchSearch && matchKelas && matchMapel;
  });

  const handleDelete = (id: string, judul: string) => {
    requestConfirm('Hapus Modul Ajar', `Apakah Anda yakin ingin menghapus "${judul}"?`, () => {
      deleteDocument(id);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Modul Ajar / RPP Kurikulum Merdeka
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola, edit, dan cetak Modul Ajar terintegrasi Dimensi Profil Pelajar Pancasila & PPRA (KMA 450/2024).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAiDoc('Buatkan Modul Ajar Kurikulum Merdeka MI')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 text-emerald-950 font-semibold rounded-xl text-xs hover:bg-emerald-200 transition-colors border border-emerald-300 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Generate AI</span>
          </button>

          <button
            onClick={openCreateDoc}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Modul Ajar Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul modul ajar, topik, atau kata kunci..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedKelas}
            onChange={(e) =>
              setSelectedKelas(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
            }
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          >
            <option value="ALL">Semua Kelas (1–6)</option>
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <option key={k} value={k}>
                Kelas {k} ({k <= 2 ? 'Fase A' : k <= 4 ? 'Fase B' : 'Fase C'})
              </option>
            ))}
          </select>

          <select
            value={selectedMapel}
            onChange={(e) => setSelectedMapel(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
          >
            <option value="ALL">Semua Mata Pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.nama}>
                {s.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Kelas {doc.kelas} (Fase {doc.fase})
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Semester {doc.semester}
                  </span>
                  {doc.isAiGenerated && (
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>AI Generated</span>
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

              <h2
                onClick={() => openPreviewDoc(doc)}
                className="text-sm font-bold text-slate-900 mt-2.5 hover:text-emerald-700 cursor-pointer transition-colors line-clamp-2 leading-snug"
              >
                {doc.judul}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Mapel: <strong className="text-slate-800">{doc.mataPelajaran}</strong> · Alokasi: {doc.alokasiWaktu || '2 Pertemuan'}
              </p>

              {doc.tujuanRingkas && (
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {doc.tujuanRingkas}
                </p>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {doc.tanggalDiperbarui}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openPreviewDoc(doc)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
                  title="Lihat Pratinjau Dokumen Resmi"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau</span>
                </button>

                <button
                  onClick={() => openEditDoc(doc)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  title="Edit Isi Modul"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => duplicateDocument(doc.id)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                  title="Duplikat Dokumen"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(doc.id, doc.judul)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Hapus Modul Ajar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Tidak ada modul ajar yang sesuai</h3>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau buat modul ajar baru.</p>
            <button
              onClick={openCreateDoc}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              Buat Modul Ajar Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

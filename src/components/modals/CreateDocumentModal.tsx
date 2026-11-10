import React, { useState } from 'react';
import { X, FileText, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentType, DocumentSection } from '../../types';

import { DOCUMENT_TYPE_METAS } from '../../lib/documentRelations';

interface DocTypeOption {
  type: DocumentType;
  label: string;
  desc: string;
}

const docTypes: DocTypeOption[] = Object.values(DOCUMENT_TYPE_METAS).map((meta) => ({
  type: meta.type,
  label: meta.label,
  desc: meta.description,
}));

export const CreateDocumentModal: React.FC = () => {
  const {
    isCreateDocOpen,
    closeCreateDoc,
    addDocument,
    openPreviewDoc,
    openAiDoc,
    subjects,
    activeSchoolYear,
    activeSemester,
    activeCurriculum,
    teacherProfile,
  } = useApp();

  const [selectedType, setSelectedType] = useState<DocumentType>('MODUL_AJAR');
  const [judul, setJudul] = useState('');
  const [kelas, setKelas] = useState(4);
  const [mapel, setMapel] = useState(subjects[0]?.nama || 'Akidah Akhlak');
  const [alokasiWaktu, setAlokasiWaktu] = useState('4 JP (2 Pertemuan x 35 Menit)');

  if (!isCreateDocOpen) return null;

  const currentOption = docTypes.find((d) => d.type === selectedType)!;
  const fase = kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C';

  const handleGenerateDefaultSections = (type: DocumentType): DocumentSection[] => {
    switch (type) {
      case 'MODUL_AJAR':
        return [
          {
            id: 'sec-1',
            title: 'I. INFORMASI UMUM',
            content: `A. Identitas Modul:\n- Guru Penyusun: ${teacherProfile.namaLengkap}\n- Satuan Pendidikan: Madrasah Ibtidaiyah\n- Fase / Kelas: Fase ${fase} / Kelas ${kelas}\n- Mata Pelajaran: ${mapel}\n- Alokasi Waktu: ${alokasiWaktu}\n\nB. Kompetensi Awal:\nPeserta didik memiliki pemahaman dasar awal mengenai konsep materi.\n\nC. Profil Pelajar Pancasila & PPRA:\n- Beriman, Bertakwa kepada Tuhan YME dan Berakhlak Mulia.\n- Qudwah (Keteladanan) & Tasamuh (Toleransi).`,
          },
          {
            id: 'sec-2',
            title: 'II. KOMPONEN INTI',
            content: `A. Tujuan Pembelajaran:\n1. Peserta didik mampu memahami dan menjelaskan konsep pokok materi dengan benar.\n2. Peserta didik mampu mempraktikkan dalam kehidupan sehari-hari.\n\nB. Pertanyaan Pemantik:\n- "Anak-anak, apa yang kalian amati di sekitar kalian terkait materi ini?"\n\nC. Kegiatan Pembelajaran:\n1. Pendahuluan (10 Menit): Salam, doa pembuka, presensi, ice breaking dan apersepsi.\n2. Kegiatan Inti (50 Menit): Pengamatan stimulus, diskusi terbimbing, kerja kelompok LKPD, presentasi.\n3. Penutup (10 Menit): Kesimpulan materi bersama, penguatan pesan moral, doa dan salam.`,
          },
          {
            id: 'sec-3',
            title: 'III. ASESMEN & LAMPIRAN',
            content: `A. Asesmen:\n- Diagnostik: Tanya jawab awal pembelajaran.\n- Formatif: Observasi keaktifan diskusi dan pengisian LKPD.\n- Sumatif: Tes tertulis pemahaman akhir materi.\n\nB. Pengayaan dan Remedial:\n- Pengayaan diberikan kepada siswa yang telah mencapai KKTP.\n- Remedial bimbingan ulang bagi siswa yang belum tuntas.`,
          },
        ];
      case 'PROTA':
        return [
          {
            id: 'sec-prota-1',
            title: 'SEMESTER GANJIL (36 JP)',
            content: '1. Bab 1: Pengenalan Konsep Dasar (8 JP)\n2. Bab 2: Pendalaman Materi Pokok (10 JP)\n3. Bab 3: Penerapan dan Studi Kasus (10 JP)\n4. Asesmen Sumatif Tengah & Akhir Semester (8 JP)',
          },
          {
            id: 'sec-prota-2',
            title: 'SEMESTER GENAP (36 JP)',
            content: '1. Bab 4: Konsep Lanjutan (10 JP)\n2. Bab 5: Refleksi dan Praktik Nyata (10 JP)\n3. Bab 6: Proyek Penguatan Karakter Profil Pelajar (8 JP)\n4. Asesmen Akhir Tahun (8 JP)',
          },
        ];
      case 'PROMES':
        return [
          {
            id: 'sec-promes-1',
            title: 'PEMBAGIAN MINGGU EFEKTIF PER BULAN',
            content: '- Bulan ke-1: Pengenalan materi bab 1 (4 pekan)\n- Bulan ke-2: Pembahasan bab 2 (4 pekan)\n- Bulan ke-3: Sumatif Tengah Semester (STS) & Pembahasan bab 3 (4 pekan)\n- Bulan ke-4: Pendalaman materi bab 3 & LKPD (4 pekan)\n- Bulan ke-5: Penilaian Sumatif Akhir Semester & Pembagian Rapor',
          },
        ];
      default:
        return [
          {
            id: 'sec-gen-1',
            title: 'RINCIAN DAN URAIAN DOKUMEN',
            content: `Dokumen: ${currentOption.label}\nMata Pelajaran: ${mapel}\nKelas: ${kelas} (Fase ${fase})\nTahun Pelajaran: ${activeSchoolYear.tahun}\nSemester: ${activeSemester.semester}\n\nSilakan lengkapi rincian isi dokumen sesuai panduan kurikulum ${activeCurriculum.regulasi}.`,
          },
        ];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const docTitle =
      judul.trim() ||
      `${currentOption.label} - ${mapel} Kelas ${kelas} Semester ${activeSemester.semester}`;

    const created = addDocument({
      judul: docTitle,
      tipe: selectedType,
      tipeLabel: currentOption.label,
      kelas,
      fase,
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: activeCurriculum.nama,
      status: 'Draft',
      alokasiWaktu,
      tujuanRingkas: `Penyusunan ${currentOption.label} mata pelajaran ${mapel} Kelas ${kelas}`,
      sections: handleGenerateDefaultSections(selectedType),
      tags: [currentOption.label, `Kelas ${kelas}`, `Fase ${fase}`, mapel],
      isAiGenerated: false,
    });

    closeCreateDoc();
    openPreviewDoc(created);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              SIPENA MI PERSONAL
            </span>
            <h3 className="text-base font-bold text-slate-900">Buat Perangkat Pembelajaran Baru</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeCreateDoc();
                openAiDoc();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Gunakan AI Asisten</span>
            </button>
            <button
              onClick={closeCreateDoc}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Document Type Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. Pilih Jenis Perangkat Pembelajaran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {docTypes.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setSelectedType(item.type)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {item.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Form Details */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. Detail Dokumen & Identitas Mata Pelajaran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Judul Dokumen (Opsional - Kosongkan untuk nama otomatis)
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder={`Contoh: ${currentOption.label} ${mapel} Kelas ${kelas} Bab 1`}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mata Pelajaran (Kemenag & Umum)
                </label>
                <select
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama} ({s.kategori})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kelas & Fase MI
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value={1}>Kelas 1 (Fase A)</option>
                  <option value={2}>Kelas 2 (Fase A)</option>
                  <option value={3}>Kelas 3 (Fase B)</option>
                  <option value={4}>Kelas 4 (Fase B)</option>
                  <option value={5}>Kelas 5 (Fase C)</option>
                  <option value={6}>Kelas 6 (Fase C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tahun Pelajaran & Semester
                </label>
                <div className="text-xs px-3 py-2 bg-slate-200/70 border border-slate-300 rounded-lg text-slate-700 font-mono">
                  {activeSchoolYear.tahun} · Semester {activeSemester.semester}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Alokasi Waktu
                </label>
                <input
                  type="text"
                  value={alokasiWaktu}
                  onChange={(e) => setAlokasiWaktu(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={closeCreateDoc}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Buat dan Buka Dokumen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

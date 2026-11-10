import React from 'react';
import { Copy, Plus, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentType } from '../types';

interface TemplateItem {
  id: string;
  title: string;
  type: DocumentType;
  typeLabel: string;
  desc: string;
  defaultMapel: string;
  sectionsCount: number;
}

export const TemplatePage: React.FC = () => {
  const { addDocument, openPreviewDoc, activeSchoolYear, activeSemester, activeCurriculum } = useApp();

  const templates: TemplateItem[] = [
    {
      id: 'tpl-1',
      title: 'Template Modul Ajar Lengkap (Format Baku KMA 450/2024)',
      type: 'MODUL_AJAR',
      typeLabel: 'Modul Ajar',
      desc: 'Memuat Informasi Umum, Sarpras, Dimensi PPRA, Pemantik, Langkah Pendahuluan-Inti-Penutup, serta Asesmen & Lampiran.',
      defaultMapel: 'Akidah Akhlak',
      sectionsCount: 3,
    },
    {
      id: 'tpl-2',
      title: 'Template Program Tahunan (PROTA) Matriks Semester',
      type: 'PROTA',
      typeLabel: 'PROTA',
      desc: 'Tabel distribusi materi pokok dan pembagian jam pelajaran untuk semester ganjil dan genap.',
      defaultMapel: 'Fikih',
      sectionsCount: 2,
    },
    {
      id: 'tpl-3',
      title: 'Template Program Semester (PROMES) Pekan Efektif',
      type: 'PROMES',
      typeLabel: 'PROMES',
      desc: 'Matriks alokasi pekan efektif dan tanggal pelaksanaan materi per bulan (Juli-Desember / Januari-Juni).',
      defaultMapel: 'Al-Qur\'an Hadis',
      sectionsCount: 1,
    },
    {
      id: 'tpl-4',
      title: 'Template Alur Tujuan Pembelajaran (ATP) Berbasis Fase',
      type: 'ATP',
      typeLabel: 'ATP',
      desc: 'Alur tahapan TP, alokasi JP tatap muka, integrasi nilai Rahmatan Lil Alamin, dan kata kunci glosarium.',
      defaultMapel: 'Bahasa Arab',
      sectionsCount: 1,
    },
    {
      id: 'tpl-5',
      title: 'Template Kriteria Ketercapaian TP (KKTP) 4 Interval',
      type: 'KKTP',
      typeLabel: 'KKTP',
      desc: 'Rubrik penilaian 4 level ketercapaian (Perlu Bimbingan, Cukup, Baik, Sangat Baik) beserta rencana intervensi.',
      defaultMapel: 'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      sectionsCount: 1,
    },
    {
      id: 'tpl-6',
      title: 'Template Lembar Kerja Peserta Didik (LKPD) Eksplorasi',
      type: 'LKPD',
      typeLabel: 'LKPD',
      desc: 'Lembar aktivitas tugas kelompok/mandiri dengan alat bahan, langkah kerja, dan kolom kesimpulan.',
      defaultMapel: 'Matematika',
      sectionsCount: 1,
    },
  ];

  const handleUseTemplate = (tpl: TemplateItem) => {
    const newDoc = addDocument({
      judul: `${tpl.title.replace('Template ', '')} - ${tpl.defaultMapel} Kelas 4`,
      tipe: tpl.type,
      tipeLabel: tpl.typeLabel,
      kelas: 4,
      fase: 'B',
      mataPelajaran: tpl.defaultMapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: activeCurriculum.nama,
      status: 'Draft',
      alokasiWaktu: 'Sesuai ATP',
      tujuanRingkas: `Dibuat dari ${tpl.title}`,
      sections: [
        {
          id: 'sec-tpl-1',
          title: 'I. INFORMASI UMUM & IDENTITAS PERANGKAT',
          content: `Satuan Pendidikan: Madrasah Ibtidaiyah\nMata Pelajaran: ${tpl.defaultMapel}\nKelas: 4 (Fase B)\nTahun Pelajaran: ${activeSchoolYear.tahun}\nKurikulum: ${activeCurriculum.nama}\n\nSilakan lengkapi kompetensi awal, profil pelajar rahmatan lil alamin, dan sarana prasarana.`,
        },
        {
          id: 'sec-tpl-2',
          title: 'II. KOMPONEN INTI & RENCANA PEMBELAJARAN',
          content: 'A. Tujuan Pembelajaran:\n1. Peserta didik mampu menguraikan konsep dasar materi dengan tepat.\n\nB. Pertanyaan Pemantik:\n- "Apa yang kalian ketahui mengenai materi ini?"\n\nC. Kegiatan Pembelajaran:\n- Pendahuluan (10 Menit): Berdoa, apersepsi, ice breaking.\n- Kegiatan Inti (50 Menit): Pengamatan stimulus, diskusi kelompok, pengerjaan LKPD.\n- Penutup (10 Menit): Refleksi, kesimpulan bersama, doa penutup.',
        },
      ],
      tags: ['Template Master', tpl.typeLabel, tpl.defaultMapel],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Copy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Master Template Dokumen Dinas
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilihan format baku perangkat ajar resmi Kementerian Agama RI siap pakai dan terintegrasi kop madrasah.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {tpl.typeLabel}
              </span>
              <h2 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                {tpl.title}
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {tpl.desc}
              </p>
              <div className="mt-3 text-[11px] text-slate-500">
                Mapel Acuan: <strong className="text-slate-800">{tpl.defaultMapel}</strong>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {tpl.sectionsCount} Komponen
              </span>
              <button
                onClick={() => handleUseTemplate(tpl)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
              >
                <span>Gunakan Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

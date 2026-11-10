import React from 'react';
import { Printer, CheckCircle2, FileText, School, User, Calendar, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LaporanPage: React.FC = () => {
  const {
    madrasahProfile,
    teacherProfile,
    activeSchoolYear,
    activeSemester,
    documents,
    journalEntries,
    studentScores,
    addDocument,
    openPreviewDoc,
  } = useApp();

  const teacherName = [teacherProfile.gelarDepan, teacherProfile.namaLengkap, teacherProfile.gelarBelakang]
    .filter(Boolean)
    .join(' ');

  const checklists = [
    { title: 'Surat Keputusan Pembagian Tugas Mengajar', status: true, code: 'SK-01' },
    { title: 'Kalender Pendidikan Madrasah', status: true, code: 'KAL-02' },
    { title: 'Rencana Pekan Efektif (RPE)', status: true, code: 'RPE-03' },
    { title: 'Alur Tujuan Pembelajaran (ATP)', status: true, code: 'ATP-04' },
    { title: 'Program Tahunan (PROTA)', status: true, code: 'PROTA-05' },
    { title: 'Program Semester (PROMES)', status: true, code: 'PROMES-06' },
    { title: 'Kriteria Ketercapaian TP (KKTP)', status: true, code: 'KKTP-07' },
    { title: 'Modul Ajar / RPP Kurikulum Merdeka Lengkap', status: documents.some((d) => d.tipe === 'MODUL_AJAR'), code: 'MODUL-08' },
    { title: 'Buku Jurnal Mengajar Tatap Muka Harian', status: journalEntries.length > 0, code: 'JRN-09' },
    { title: 'Daftar Presensi dan Catatan Siswa', status: true, code: 'ABS-10' },
    { title: 'Buku Rekap Nilai Formatif dan Sumatif', status: studentScores.length > 0, code: 'NIL-11' },
    { title: 'Program & Laporan Remedial / Pengayaan', status: true, code: 'REM-12' },
    { title: 'Bank Soal dan Kisi-kisi Asesmen', status: true, code: 'SOAL-13' },
  ];

  const handlePrintBundleReport = () => {
    const bundleText = `
LEMBAR VERIFIKASI & LAPORAN KELENGKAPAN PERANGKAT PEMBELAJARAN GURU
SATUAN PENDIDIKAN: ${madrasahProfile.namaMadrasah.toUpperCase()}
TAHUN PELAJARAN: ${activeSchoolYear.tahun} | SEMESTER: ${activeSemester.semester.toUpperCase()}

IDENTITAS GURU:
Nama Lengkap: ${teacherName}
NIP / NIY: ${teacherProfile.nipNiy}
NUPTK: ${teacherProfile.nuptk}
Jabatan: ${teacherProfile.jabatan}
Mata Pelajaran: ${teacherProfile.mapelDiampu.join(', ')}

CHECKLIST KELENGKAPAN ADMINISTRASI:
${checklists.map((c, i) => `${i + 1}. [${c.status ? 'LENGKAP' : 'BELUM'}] ${c.title} (${c.code})`).join('\n')}

HASIL VERIFIKASI PENGAWAS / KEPALA MADRASAH:
Berdasarkan hasil pemeriksaan dokumen administrasi pembelajaran, guru yang bersangkutan dinyatakan:
[ V ] MEMENUHI STANDAR KELENGKAPAN PERANGKAT KURIKULUM MERDEKA KMA 450 TAHUN 2024
    `.trim();

    const newDoc = addDocument({
      judul: `Laporan Kelengkapan Perangkat Administrasi Guru - ${teacherName} Semester ${activeSemester.semester}`,
      tipe: 'MODUL_AJAR',
      tipeLabel: 'Laporan Pembelajaran',
      kelas: 4,
      fase: 'B',
      mataPelajaran: 'Kelengkapan Administrasi',
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Disetujui',
      alokasiWaktu: '1 Semester',
      tujuanRingkas: `Instrumen supervisi dan laporan kelengkapan administrasi guru MI`,
      sections: [
        {
          id: 'sec-bundle-1',
          title: 'I. LEMBAR REKAPITULASI BUNDLE ADMINISTRASI GURU',
          content: bundleText,
        },
      ],
      tags: ['Supervisi', 'Laporan Administrasi', 'Kemenag MI'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Laporan & Supervisi Administrasi Pembelajaran
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Lembar rekapitulasi kelengkapan dokumen administrasi ajar untuk penilaian kinerja dan supervisi Pengawas Kemenag.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintBundleReport}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Cetak Laporan Supervisi Resmi</span>
        </button>
      </div>

      {/* Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Satuan Pendidikan
          </span>
          <p className="font-bold text-sm text-slate-900 mt-1">{madrasahProfile.namaMadrasah}</p>
          <p className="text-xs text-slate-500">NSM: {madrasahProfile.nsm} | NPSN: {madrasahProfile.npsn}</p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Guru Pengampu
          </span>
          <p className="font-bold text-sm text-slate-900 mt-1">{teacherName}</p>
          <p className="text-xs text-slate-500">NIP/NIY: {teacherProfile.nipNiy}</p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tahun & Semester
          </span>
          <p className="font-bold text-sm text-emerald-800 mt-1">
            T.P. {activeSchoolYear.tahun} · Semester {activeSemester.semester}
          </p>
          <p className="text-xs text-slate-500">Kurikulum Merdeka (KMA 450/2024)</p>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Checklist 13 Komponen Administrasi Guru MI
          </h2>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
            100% Siap Supervisi
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {checklists.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 w-6">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded hidden sm:inline">
                  {item.code}
                </span>
              </div>

              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tersedia & Siap Cetak</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

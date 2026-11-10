import React, { useState } from 'react';
import { BarChart3, FileText, CheckCircle2, Save, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentScore } from '../types';

export const RekapNilaiPage: React.FC = () => {
  const { studentScores, updateStudentScore, subjects, classes, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [selectedMapel, setSelectedMapel] = useState('Akidah Akhlak');
  const [selectedKelas, setSelectedKelas] = useState('Kelas 4-A');

  const filteredScores = studentScores.filter(
    (s) => s.mataPelajaran === selectedMapel && s.kelas === selectedKelas
  );

  const handleScoreChange = (id: string, field: keyof StudentScore, val: number) => {
    const student = studentScores.find((s) => s.id === id);
    if (!student) return;

    const updated = { ...student, [field]: val };
    const nf = field === 'nilaiFormatif' ? val : student.nilaiFormatif;
    const nsm = field === 'nilaiSumatifMateri' ? val : student.nilaiSumatifMateri;
    const nsts = field === 'nilaiSTS' ? val : student.nilaiSTS;
    const nsas = field === 'nilaiSAS' ? val : student.nilaiSAS;

    // Automatic calculation: 30% Formatif + 30% Sumatif Materi + 20% STS + 20% SAS
    const finalScore = Math.round(nf * 0.3 + nsm * 0.3 + nsts * 0.2 + nsas * 0.2);

    updateStudentScore(id, {
      ...updated,
      nilaiAkhir: finalScore,
    });
  };

  const handleExportLegerDoc = () => {
    const legerTableText = filteredScores
      .map(
        (s, i) =>
          `${i + 1}. ${s.namaSiswa} (NISN: ${s.nisn})\n` +
          `   Formatif: ${s.nilaiFormatif} | Sumatif Bab: ${s.nilaiSumatifMateri} | STS: ${s.nilaiSTS} | SAS: ${s.nilaiSAS} | NILAI AKHIR: ${s.nilaiAkhir}\n` +
          `   Capaian Tertinggi: ${s.capaianTertinggi}\n` +
          `   Capaian Terendah: ${s.capaianTerendah}`
      )
      .join('\n\n--------------------\n\n');

    const newDoc = addDocument({
      judul: `Leger Rekap Nilai Siswa ${selectedMapel} ${selectedKelas} Semester ${activeSemester.semester}`,
      tipe: 'REKAP_NILAI',
      tipeLabel: 'Rekap Nilai',
      kelas: 4,
      fase: 'B',
      mataPelajaran: selectedMapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: 'Semester Ganjil',
      tujuanRingkas: `Rekapitulasi nilai sumatif dan deskripsi capaian rapor Kurikulum Merdeka`,
      sections: [
        {
          id: 'sec-leger-1',
          title: 'I. DAFTAR NILAI SISWA DAN DESKRIPSI CAPAIAN KOMPETENSI',
          content: legerTableText,
        },
      ],
      tags: ['Rekap Nilai', 'Leger Rapor', selectedMapel, selectedKelas],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Rekap Nilai & Pengolahan Nilai Rapor
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Penilaian Kurikulum Merdeka: Formatif, Sumatif Materi, STS, SAS, dan formulasi deskripsi capaian rapor.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportLegerDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Cetak Leger Nilai Resmi</span>
        </button>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div>
            <label className="font-semibold text-slate-700 mr-2">Mata Pelajaran:</label>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 mr-2">Kelas:</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-semibold"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.namaKelas}>
                  {c.namaKelas}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Formula: <span className="font-mono font-bold text-slate-800">(30% Formatif + 30% Sumatif + 20% STS + 20% SAS)</span>
        </div>
      </div>

      {/* Scores Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3 text-center w-12">No</th>
                <th className="px-4 py-3">NISN & Nama Siswa</th>
                <th className="px-3 py-3 text-center w-24">Formatif (30%)</th>
                <th className="px-3 py-3 text-center w-24">Sumatif Bab (30%)</th>
                <th className="px-3 py-3 text-center w-20">STS (20%)</th>
                <th className="px-3 py-3 text-center w-20">SAS (20%)</th>
                <th className="px-3 py-3 text-center w-24 bg-emerald-50 text-emerald-900">Nilai Akhir</th>
                <th className="px-4 py-3">Deskripsi Capaian Rapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScores.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50/70">
                  <td className="px-3 py-3 text-center font-bold text-slate-700">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{student.namaSiswa}</span>
                    <span className="text-[10px] font-mono text-slate-400">NISN: {student.nisn}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={student.nilaiFormatif}
                      onChange={(e) => handleScoreChange(student.id, 'nilaiFormatif', Number(e.target.value))}
                      className="w-16 text-center text-xs px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={student.nilaiSumatifMateri}
                      onChange={(e) => handleScoreChange(student.id, 'nilaiSumatifMateri', Number(e.target.value))}
                      className="w-16 text-center text-xs px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={student.nilaiSTS}
                      onChange={(e) => handleScoreChange(student.id, 'nilaiSTS', Number(e.target.value))}
                      className="w-14 text-center text-xs px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={student.nilaiSAS}
                      onChange={(e) => handleScoreChange(student.id, 'nilaiSAS', Number(e.target.value))}
                      className="w-14 text-center text-xs px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </td>
                  <td className="px-3 py-3 text-center bg-emerald-50/60 font-mono font-black text-sm text-emerald-900">
                    {student.nilaiAkhir}
                  </td>
                  <td className="px-4 py-3 text-xs space-y-0.5 max-w-xs">
                    <p className="text-[11px] text-emerald-800 line-clamp-1">
                      ▲ {student.capaianTertinggi}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      ▼ {student.capaianTerendah}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

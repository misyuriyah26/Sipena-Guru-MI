import React, { useState } from 'react';
import { CalendarCheck, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PromesPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);

  const months = activeSemester.nomor === 1
    ? ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    : ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

  const promesData = [
    {
      materi: 'Bab 1: Kalimah Thayyibah Subhanallah & Masya Allah',
      jp: 8,
      distribution: ['v', 'v', '', '', '', ''],
    },
    {
      materi: 'Bab 2: Mengenal Asmaul Husna Al-Malik & Al-Quddus',
      jp: 10,
      distribution: ['', 'v', 'v', '', '', ''],
    },
    {
      materi: 'Asesmen Sumatif Tengah Semester (STS)',
      jp: 2,
      distribution: ['', '', 'STS', '', '', ''],
    },
    {
      materi: 'Bab 3: Beriman kepada Kitab-Kitab Suci Allah',
      jp: 8,
      distribution: ['', '', '', 'v', 'v', ''],
    },
    {
      materi: 'Bab 4: Adab Santun kepada Orang Tua & Guru',
      jp: 4,
      distribution: ['', '', '', '', 'v', ''],
    },
    {
      materi: 'Asesmen Sumatif Akhir Semester (SAS) & Rapor',
      jp: 4,
      distribution: ['', '', '', '', '', 'SAS'],
    },
  ];

  const handleCreatePromesDoc = () => {
    const content = `
PROGRAM SEMESTER (PROMES)
Mata Pelajaran: ${mapel} | Kelas: ${kelas}
Semester: ${activeSemester.semester} | Tahun Pelajaran: ${activeSchoolYear.tahun}

RINCIAN DISTRIBUSI BULANAN:
${promesData
  .map(
    (item) =>
      `- ${item.materi} (${item.jp} JP)\n  Distribusi: ${months
        .map((m, i) => `${m}: ${item.distribution[i] || '-'}`)
        .join(', ')}`
  )
  .join('\n\n')}
    `.trim();

    const newDoc = addDocument({
      judul: `Program Semester (PROMES) ${mapel} Kelas ${kelas} Semester ${activeSemester.semester}`,
      tipe: 'PROMES',
      tipeLabel: 'Program Semester (PROMES)',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: '36 JP / Semester',
      tujuanRingkas: `Distribusi pelaksanaan materi per pekan dan bulan semester ${activeSemester.semester}`,
      sections: [
        {
          id: 'sec-promes-1',
          title: 'I. MATRIKS DISTRIBUSI PROGRAM SEMESTER',
          content,
        },
      ],
      tags: ['PROMES', mapel, `Kelas ${kelas}`, activeSemester.semester],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Program Semester (PROMES)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Penjabaran Program Tahunan ke dalam matriks pekan efektif per bulan selama satu semester.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreatePromesDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Simpan Dokumen PROMES</span>
        </button>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div>
            <label className="font-semibold text-slate-700 mr-2">Mata Pelajaran:</label>
            <select
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
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
              value={kelas}
              onChange={(e) => setKelas(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <option key={k} value={k}>
                  Kelas {k} (Fase {k <= 2 ? 'A' : k <= 4 ? 'B' : 'C'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          Semester {activeSemester.semester} · T.P. {activeSchoolYear.tahun}
        </div>
      </div>

      {/* Matriks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-[11px] uppercase">
              <tr>
                <th className="px-4 py-3" rowSpan={2}>
                  Materi Pokok / Tujuan Pembelajaran
                </th>
                <th className="px-3 py-3 text-center w-20" rowSpan={2}>
                  Alokasi JP
                </th>
                <th className="px-4 py-2 text-center border-b border-slate-200" colSpan={months.length}>
                  Distribusi Pelaksanaan Bulan
                </th>
              </tr>
              <tr>
                {months.map((m) => (
                  <th key={m} className="px-3 py-2 text-center text-[10px] w-20">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promesData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-medium text-slate-900">{row.materi}</td>
                  <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-800">
                    {row.jp} JP
                  </td>
                  {row.distribution.map((dist, mIdx) => (
                    <td key={mIdx} className="px-3 py-3.5 text-center">
                      {dist === 'v' ? (
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-xs">
                          ✓
                        </span>
                      ) : dist ? (
                        <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {dist}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

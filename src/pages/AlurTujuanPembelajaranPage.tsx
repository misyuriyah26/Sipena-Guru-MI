import React, { useState } from 'react';
import { GitBranch, Plus, FileText, ArrowRight, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ATPRow {
  no: number;
  tp: string;
  materiPokok: string;
  alokasiJP: number;
  dimensiProfil: string;
  glosarium: string;
}

export const AlurTujuanPembelajaranPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);

  const [atpRows, setAtpRows] = useState<ATPRow[]>([
    {
      no: 1,
      tp: 'Melafalkan kalimat thayyibah Subhanallah dan Masya Allah dengan makhraj fasih',
      materiPokok: 'Kalimah Thayyibah Tasbih',
      alokasiJP: 4,
      dimensiProfil: 'Beriman & Bertakwa, Qudwah (Keteladanan)',
      glosarium: 'Tasbih, Thayyibah, Makhraj',
    },
    {
      no: 2,
      tp: 'Membedakan situasi pengucapan Subhanallah dan Masya Allah dalam kehidupan',
      materiPokok: 'Penerapan Kalimah Thayyibah',
      alokasiJP: 4,
      dimensiProfil: 'Bernalar Kritis, Berakhlak Mulia',
      glosarium: 'Tadabbur, Hikmah',
    },
    {
      no: 3,
      tp: 'Menganalisis makna Asmaul Husna Al-Malik, Al-Quddus, dan As-Salam',
      materiPokok: 'Sifat-sifat Mulia Allah',
      alokasiJP: 6,
      dimensiProfil: 'Mandiri, Tasamuh (Toleransi)',
      glosarium: 'Asmaul Husna, Al-Malik',
    },
    {
      no: 4,
      tp: 'Meyakini kitab-kitab suci Allah (Taurat, Zabur, Injil, dan Al-Qur\'an)',
      materiPokok: 'Rukun Iman ke-3',
      alokasiJP: 6,
      dimensiProfil: 'Beriman, Qudwah',
      glosarium: 'Suhuf, Wahyu, Mukjizat',
    },
  ]);

  const totalJP = atpRows.reduce((acc, row) => acc + row.alokasiJP, 0);

  const handleCreateATPDoc = () => {
    const tableText = atpRows
      .map(
        (r) =>
          `${r.no}. TP: ${r.tp}\n   Materi: ${r.materiPokok} | Alokasi: ${r.alokasiJP} JP\n   Profil P5-PPRA: ${r.dimensiProfil}\n   Kata Kunci: ${r.glosarium}`
      )
      .join('\n\n');

    const newDoc = addDocument({
      judul: `Alur Tujuan Pembelajaran (ATP) ${mapel} Kelas ${kelas} Fase ${kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C'}`,
      tipe: 'ATP',
      tipeLabel: 'Alur Tujuan Pembelajaran (ATP)',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: `${totalJP} JP`,
      tujuanRingkas: `Alur Tujuan Pembelajaran terstruktur untuk ${mapel} Kelas ${kelas}`,
      sections: [
        {
          id: 'sec-atp-table',
          title: 'I. MATRIKS ALUR TUJUAN PEMBELAJARAN (ATP) MADRASAH',
          content: tableText,
        },
      ],
      tags: ['ATP', mapel, `Kelas ${kelas}`, 'KMA 450'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Alur Tujuan Pembelajaran (ATP)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Urutan logis pencapaian TP sepanjang fase, pemetaan alokasi jam tatap muka, dan penanaman Profil PPRA.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateATPDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Simpan & Buka Dokumen ATP</span>
        </button>
      </div>

      {/* Filter Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-4 text-xs">
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

        <div className="ml-auto text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          Total Alokasi: {totalJP} Jam Pelajaran (JP)
        </div>
      </div>

      {/* ATP Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3 text-center">Urutan</th>
                <th className="px-4 py-3">Tujuan Pembelajaran (TP)</th>
                <th className="px-4 py-3">Materi Pokok</th>
                <th className="px-3 py-3 text-center">Alokasi JP</th>
                <th className="px-4 py-3">Dimensi Profil P5 & PPRA</th>
                <th className="px-4 py-3">Kata Kunci / Glosarium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {atpRows.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-3 py-3.5 text-center font-bold font-mono text-emerald-800">
                    {row.no}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900 max-w-sm">{row.tp}</td>
                  <td className="px-4 py-3.5 text-slate-800 font-semibold">{row.materiPokok}</td>
                  <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-900">
                    {row.alokasiJP} JP
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium inline-block">
                      {row.dimensiProfil}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                    {row.glosarium}
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

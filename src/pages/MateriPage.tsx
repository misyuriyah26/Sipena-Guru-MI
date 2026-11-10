import React, { useState } from 'react';
import { BookOpenCheck, Plus, FileText, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MateriPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);
  const [judulMateri, setJudulMateri] = useState('Rangkuman Materi: Makna dan Keutamaan Kalimah Thayyibah');

  const materiList = [
    {
      bab: 'Bab 1',
      judul: 'Indahnya Mengucap Kalimah Thayyibah',
      ringkasan: 'Kalimat thayyibah adalah perkataan yang baik yang bernilai zikir dan berpahala besar. Subhanallah diucapkan saat heran atas hal yang tidak layak bagi Allah, sedangkan Masya Allah saat takjub atas keindahan ciptaan-Nya.',
      kataKunci: ['Tasbih', 'Keagungan Allah', 'Zikir Lisan'],
    },
    {
      bab: 'Bab 2',
      judul: 'Mengenal Sifat-sifat Allah melalui Asmaul Husna',
      ringkasan: 'Al-Malik berarti Maha Merajai, Al-Quddus berarti Maha Suci dari kekurangan, dan As-Salam berarti Maha Memberi Keselamatan dan Kesejahteraan.',
      kataKunci: ['Asmaul Husna', 'Al-Malik', 'Al-Quddus', 'As-Salam'],
    },
    {
      bab: 'Bab 3',
      judul: 'Meyakini Kitab-Kitab Allah SWT',
      ringkasan: 'Kitab Taurat diturunkan kepada Nabi Musa AS, Zabur kepada Nabi Daud AS, Injil kepada Nabi Isa AS, dan Al-Qur\'an kepada Nabi Muhammad SAW sebagai penyempurna.',
      kataKunci: ['Rukun Iman', 'Wahyu', 'Al-Qur\'an'],
    },
  ];

  const handleCreateMateriDoc = (item: typeof materiList[0]) => {
    const newDoc = addDocument({
      judul: `Bahan Ajar ${mapel} Kelas ${kelas} - ${item.judul}`,
      tipe: 'MATERI',
      tipeLabel: 'Materi Pembelajaran',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: 'Sesuai Bab',
      tujuanRingkas: `Rangkuman bahan bacaan dan intisari materi: ${item.judul}`,
      sections: [
        {
          id: 'sec-materi-1',
          title: `RANGKUMAN INTI: ${item.judul.toUpperCase()}`,
          content: `${item.ringkasan}\n\nKata Kunci & Glosarium:\n${item.kataKunci.join(', ')}`,
        },
      ],
      tags: ['Bahan Ajar', mapel, `Kelas ${kelas}`, item.bab],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Bahan & Materi Pembelajaran MI
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pustaka rangkuman bahan bacaan ringkas dan intisari konsep materi ajar siap dibagikan ke siswa.
            </p>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3 text-xs">
        <span className="font-semibold text-slate-700">Pilih Mapel:</span>
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

        <select
          value={kelas}
          onChange={(e) => setKelas(Number(e.target.value))}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
        >
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <option key={k} value={k}>
              Kelas {k}
            </option>
          ))}
        </select>
      </div>

      {/* Materi Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {materiList.map((m, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-all"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono">
                {m.bab}
              </span>
              <h2 className="text-sm font-bold text-slate-900 mt-2">{m.judul}</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {m.ringkasan}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {m.kataKunci.map((kw, i) => (
                  <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleCreateMateriDoc(m)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cetak Bahan Ajar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

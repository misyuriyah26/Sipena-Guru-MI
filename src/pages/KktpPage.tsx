import React, { useState } from 'react';
import { Award, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KktpPage: React.FC = () => {
  const { subjects, addDocument, openPreviewDoc, activeSchoolYear, activeSemester } = useApp();
  const [mapel, setMapel] = useState('Akidah Akhlak');
  const [kelas, setKelas] = useState(4);
  const [tp, setTp] = useState('Memahami makna dan penerapan Kalimah Thayyibah Subhanallah dan Masya Allah');

  const intervals = [
    {
      range: '0 – 65%',
      label: 'Perlu Bimbingan (Intervensi Khusus)',
      deskripsi: 'Belum mampu melafalkan kalimat thayyibah dengan makhraj yang tepat dan belum mengerti artinya.',
      tindakLanjut: 'Diberikan pendampingan intensif oleh guru dan bimbingan tutor sebaya pada jam bimbingan mandiri.',
      badgeClass: 'bg-red-50 text-red-800 border-red-200',
    },
    {
      range: '66 – 75%',
      label: 'Cukup',
      deskripsi: 'Mampu melafalkan kalimat thayyibah namun masih sering tertukar situasi pengucapan antara Subhanallah dan Masya Allah.',
      tindakLanjut: 'Diberikan latihan mandiri berupa kartu situasi dan pembiasaan zikir harian di kelas.',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      range: '76 – 85%',
      label: 'Baik (Mencapai Ketuntasan)',
      deskripsi: 'Mampu melafalkan dengan fasih, mengartikan dengan benar, serta tepat membedakan situasi penggunaannya.',
      tindakLanjut: 'Melanjutkan ke tujuan pembelajaran berikutnya.',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      range: '86 – 100%',
      label: 'Sangat Baik (Istimewa)',
      deskripsi: 'Sangat fasih melafalkan, menguasai dalil hadis, dan telah menjadi teladan (qudwah) berakhlak mulia di lingkungan madrasah.',
      tindakLanjut: 'Diberikan program pengayaan berupa peran sebagai tutor sebaya dan menghafal dalil zikir pilihan.',
      badgeClass: 'bg-teal-50 text-teal-900 border-teal-200',
    },
  ];

  const handleCreateKKTPDoc = () => {
    const content = `
KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)
Mata Pelajaran: ${mapel} | Kelas: ${kelas}
Tujuan Pembelajaran: ${tp}
Tahun Pelajaran: ${activeSchoolYear.tahun} | Semester: ${activeSemester.semester}

RUBRIK INTERVAL NILAI & TINDAK LANJUT:
${intervals
  .map(
    (i) =>
      `[${i.range}] ${i.label}\nDeskripsi: ${i.deskripsi}\nTindak Lanjut: ${i.tindakLanjut}`
  )
  .join('\n\n')}
    `.trim();

    const newDoc = addDocument({
      judul: `Kriteria Ketercapaian TP (KKTP) ${mapel} Kelas ${kelas} - ${tp.slice(0, 35)}...`,
      tipe: 'KKTP',
      tipeLabel: 'Kriteria Ketercapaian TP (KKTP)',
      kelas,
      fase: kelas <= 2 ? 'A' : kelas <= 4 ? 'B' : 'C',
      mataPelajaran: mapel,
      tahunPelajaran: activeSchoolYear.tahun,
      semester: activeSemester.semester,
      kurikulum: 'Kurikulum Merdeka (KMA 450/2024)',
      status: 'Final',
      alokasiWaktu: 'Sesuai TP',
      tujuanRingkas: `Pedoman kriteria ketuntasan capaian siswa materi ${mapel}`,
      sections: [
        {
          id: 'sec-kktp-1',
          title: 'I. INTERVAL NILAI DAN TINDAK LANJUT HASIL ASESMEN',
          content,
        },
      ],
      tags: ['KKTP', mapel, `Kelas ${kelas}`, 'Rubrik'],
    });

    openPreviewDoc(newDoc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Kriteria Ketercapaian TP (KKTP)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Penetapan kriteria ketercapaian berbasis rubrik deskripsi dan interval nilai (KMA 450 Tahun 2024).
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateKKTPDoc}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>Simpan Dokumen KKTP</span>
        </button>
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
            <select
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat Kelas</label>
            <select
              value={kelas}
              onChange={(e) => setKelas(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
            >
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <option key={k} value={k}>
                  Kelas {k} (Fase {k <= 2 ? 'A' : k <= 4 ? 'B' : 'C'})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tujuan Pembelajaran (TP) yang Diukur
            </label>
            <input
              type="text"
              value={tp}
              onChange={(e) => setTp(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Interval Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Rubrik Interval Nilai & Rekomendasi Tindak Lanjut
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intervals.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {item.range}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}
                  >
                    {item.label}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mt-3">
                  <strong className="text-slate-900">Deskripsi Capaian:</strong> {item.deskripsi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-xl text-xs">
                <span className="font-bold text-emerald-900 block mb-0.5">Tindak Lanjut Guru:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{item.tindakLanjut}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

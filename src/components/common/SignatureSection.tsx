import React from 'react';
import { useApp } from '../../context/AppContext';

interface SignatureProps {
  tanggalDokumen?: string;
}

export const SignatureSection: React.FC<SignatureProps> = ({ tanggalDokumen }) => {
  const { madrasahProfile, teacherProfile } = useApp();

  const formattedDate = tanggalDokumen || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full mt-10 pt-4 text-xs text-slate-800 break-inside-avoid">
      <div className="text-right mb-6 text-slate-700">
        <span>{madrasahProfile.kabupatenKota.replace(/Kabupaten|Kota/gi, '').trim() || 'Sukabumi'}, </span>
        <span>{formattedDate}</span>
      </div>

      <div className="grid grid-cols-2 gap-8 text-center">
        {/* Left: Kepala Madrasah */}
        <div className="flex flex-col items-center">
          <p className="text-slate-600 font-medium">Mengetahui,</p>
          <p className="font-semibold text-slate-900">Kepala {madrasahProfile.namaMadrasah}</p>
          <div className="h-20 flex items-end justify-center">
            <span className="text-[10px] text-slate-400 italic font-sans">[Tanda Tangan & Cap]</span>
          </div>
          <p className="font-bold underline text-slate-950 mt-1">
            {madrasahProfile.namaKepala || 'H. Muhammad Yusuf, M.Pd.'}
          </p>
          <p className="text-[11px] font-mono text-slate-600 mt-0.5">
            NIP. {madrasahProfile.nipKepala || '197508142002121004'}
          </p>
        </div>

        {/* Right: Guru Pengampu */}
        <div className="flex flex-col items-center">
          <p className="text-slate-600 font-medium">Guru Mata Pelajaran / Kelas,</p>
          <p className="font-semibold text-slate-900">{teacherProfile.jabatan || 'Guru Kelas'}</p>
          <div className="h-20 flex items-end justify-center">
            <span className="text-[10px] text-slate-400 italic font-sans">[Tanda Tangan]</span>
          </div>
          <p className="font-bold underline text-slate-950 mt-1">
            {[teacherProfile.gelarDepan, teacherProfile.namaLengkap, teacherProfile.gelarBelakang]
              .filter(Boolean)
              .join(' ')}
          </p>
          <p className="text-[11px] font-mono text-slate-600 mt-0.5">
            NIP/NIY. {teacherProfile.nipNiy || '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

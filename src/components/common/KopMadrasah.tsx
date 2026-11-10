import React from 'react';
import { useApp } from '../../context/AppContext';

interface KopMadrasahProps {
  documentTitle?: string;
  documentSubtitle?: string;
}

export const KopMadrasah: React.FC<KopMadrasahProps> = ({
  documentTitle,
  documentSubtitle,
}) => {
  const { madrasahProfile } = useApp();

  return (
    <div className="w-full text-center pb-4 mb-6 border-b-4 border-double border-slate-900">
      <div className="flex items-center justify-between gap-4">
        {/* Emblem / Logo Kemenag / Madrasah */}
        <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
          {madrasahProfile.logoUrl ? (
            <img
              src={madrasahProfile.logoUrl}
              alt="Logo Madrasah"
              className="w-16 h-16 object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-center">
              <span className="text-xs font-bold block">IKHLAS</span>
              <span className="text-[10px] font-semibold block leading-tight">BERAMAL</span>
              <span className="text-[9px] text-emerald-700 block">KEMENAG</span>
            </div>
          )}
        </div>

        {/* Center Kop Text */}
        <div className="flex-1 text-center px-2">
          <p className="text-xs font-bold tracking-widest text-slate-800 uppercase leading-tight">
            {madrasahProfile.kementerian}
          </p>
          <p className="text-xs font-semibold text-slate-700 uppercase leading-tight">
            KANTOR KEMENTERIAN AGAMA {madrasahProfile.kabupatenKota.toUpperCase()}
          </p>
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-wide uppercase mt-0.5">
            {madrasahProfile.namaMadrasah}
          </h1>
          <p className="text-[11px] text-slate-600 leading-tight mt-1">
            NSM: <span className="font-mono font-medium">{madrasahProfile.nsm}</span> | NPSN:{' '}
            <span className="font-mono font-medium">{madrasahProfile.npsn}</span> | Akreditasi:{' '}
            <span className="font-bold text-emerald-800">{madrasahProfile.akreditasi}</span>
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">
            {madrasahProfile.alamat}, {madrasahProfile.desaKelurahan}, Kec. {madrasahProfile.kecamatan},{' '}
            {madrasahProfile.kabupatenKota}, {madrasahProfile.provinsi} {madrasahProfile.kodePos}
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">
            Email: {madrasahProfile.email} | Telp: {madrasahProfile.telepon}
          </p>
        </div>

        {/* Right Emblem placeholder / Madrasah badge */}
        <div className="w-20 h-20 shrink-0 hidden sm:flex items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-center p-1 text-xs">
          <div>
            <div className="text-sm">MI</div>
            <div className="text-[9px] font-normal leading-tight opacity-90">KMA 450</div>
            <div className="text-[8px] font-mono opacity-80">2024</div>
          </div>
        </div>
      </div>

      {documentTitle && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
            {documentTitle}
          </h2>
          {documentSubtitle && (
            <p className="text-xs text-slate-600 mt-0.5">{documentSubtitle}</p>
          )}
        </div>
      )}
    </div>
  );
};

"use client";

import type { SchoolSetting } from "@/lib/types";
import { defaultKetentuanBelakang } from "@/lib/mock-data";
import SafeImage from "@/components/ui/SafeImage";

interface CardBackProps {
  school: SchoolSetting;
  layout?: "portrait" | "landscape";
}

export default function CardBack({ school, layout = "landscape" }: CardBackProps) {
  const primaryColor = school.warna_primary || "#003366";
  const secondaryColor = school.warna_secondary || "#0066cc";

  const rawRules = school.ketentuan_belakang || defaultKetentuanBelakang;
  const ruleLines = rawRules
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (layout === "portrait") {
    return (
      <div
        className="card-ktp-portrait bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 relative flex flex-col justify-between text-slate-800 select-none print:shadow-none print:border-slate-300 print:rounded-none"
        style={{
          boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Center Watermark: Official School Logo */}
        {school.show_watermark !== false && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
            {school.logo_url ? (
              <img
                src={school.logo_url}
                alt=""
                className="w-28 h-28 object-contain select-none grayscale contrast-125"
                style={{ opacity: school.watermark_opacity ?? 0.08 }}
              />
            ) : (
              <svg
                viewBox="0 0 100 100"
                className="w-28 h-28 text-slate-900 fill-current"
                style={{ opacity: school.watermark_opacity ?? 0.06 }}
              >
                <path d="M50 8 L85 22 L85 50 C85 72 50 92 50 92 C50 92 15 72 15 50 L15 22 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M32 45 L50 35 L68 45 L50 55 Z" />
                <path d="M40 52 L40 64 C40 66 60 66 60 64 L60 52" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            )}
          </div>
        )}

        {/* Top Header */}
        <div
          className="relative px-3 pt-2.5 pb-2 text-white text-center shrink-0 z-10"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <SafeImage
              src={school.logo_url}
              alt="Logo"
              className="w-5 h-5 rounded-full object-contain bg-white/20 p-0.5 shrink-0"
              fallbackType="logo"
              fallbackText={school.nama_sekolah}
            />
            <div className="text-left leading-tight">
              <p className="font-extrabold text-[8.5px] uppercase tracking-wide">
                {school.nama_sekolah || "KARTU PELAJAR"}
              </p>
              <p className="text-[5.5px] text-white/85 line-clamp-1">
                {school.alamat || "Jl. Pendidikan No. 123, Surabaya"}
              </p>
            </div>
          </div>
          <p className="text-[5.5px] text-white/90 font-medium tracking-wide">
            TATA TERTIB & KETENTUAN PENGGUNAAN
          </p>
        </div>

        {/* Badge / Header Divider */}
        <div className="text-center pt-1.5 pb-0.5 relative z-10 shrink-0">
          <span
            className="inline-block px-3 py-0.5 rounded-full text-white font-extrabold text-[6px] tracking-widest uppercase shadow-xs"
            style={{
              background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            }}
          >
            KETENTUAN KARTU
          </span>
        </div>

        {/* Content Body */}
        <div className="px-3 py-1 flex-1 flex flex-col justify-between text-[6.5px] leading-relaxed text-slate-700 z-10">
          <div className="space-y-1">
            <ol className="space-y-0.5 list-none pl-0">
              {ruleLines.map((line, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="font-bold text-slate-800 shrink-0 text-[6.2px]">
                    {line.match(/^\d+[\.\)]/) ? "" : `${idx + 1}.`}
                  </span>
                  <span className="leading-tight text-slate-700">
                    {line.replace(/^\d+[\.\)]\s*/, "")}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* School Contact & Lost Card Box */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-lg p-1.5 mt-1 backdrop-blur-2xs">
            <p className="font-bold text-[6.5px] text-slate-800 mb-0.5">
              Sekretariat & Informasi:
            </p>
            <p className="text-[5.8px] text-slate-600 line-clamp-2 leading-tight">
              {school.alamat || "Alamat sekolah tertera di bagian depan kartu."}
            </p>
            <p className="text-[5.5px] text-slate-500 italic mt-0.5 leading-tight">
              * Apabila menemukan kartu ini, harap dikembalikan ke pihak sekolah.
            </p>
          </div>
        </div>

        {/* Footer Banner */}
        <div
          className="text-center py-1 text-white font-bold tracking-widest text-[6px] uppercase shrink-0 mt-0.5"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          {school.teks_footer_belakang || school.nama_sekolah || "KARTU TANDA PELAJAR RESMI"}
        </div>
      </div>
    );
  }

  // Landscape Layout
  return (
    <div
      className="card-ktp-landscape bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 relative flex flex-col justify-between text-slate-800 select-none print:shadow-none print:border-slate-300 print:rounded-none"
      style={{
        boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Center Watermark: Official School Logo */}
      {school.show_watermark !== false && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
          {school.logo_url ? (
            <img
              src={school.logo_url}
              alt=""
              className="w-32 h-32 object-contain select-none grayscale contrast-125"
              style={{ opacity: school.watermark_opacity ?? 0.08 }}
            />
          ) : (
            <svg
              viewBox="0 0 100 100"
              className="w-32 h-32 text-slate-900 fill-current"
              style={{ opacity: school.watermark_opacity ?? 0.06 }}
            >
              <path d="M50 8 L85 22 L85 50 C85 72 50 92 50 92 C50 92 15 72 15 50 L15 22 Z" fill="none" stroke="currentColor" strokeWidth="4" />
              <path d="M32 45 L50 35 L68 45 L50 55 Z" />
              <path d="M40 52 L40 64 C40 66 60 66 60 64 L60 52" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          )}
        </div>
      )}

      {/* Top Header */}
      <div
        className="relative px-3.5 py-1.5 text-white flex items-center justify-between shrink-0 z-10"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="flex items-center gap-2">
          <SafeImage
            src={school.logo_url}
            alt="Logo"
            className="w-6 h-6 rounded-full object-contain bg-white/20 p-0.5 shrink-0"
            fallbackType="logo"
            fallbackText={school.nama_sekolah}
          />
          <div className="leading-tight">
            <p className="font-extrabold text-[9px] uppercase tracking-wide">
              {school.nama_sekolah || "KARTU TANDA PELAJAR"}
            </p>
            <p className="text-[5.8px] text-white/85 line-clamp-1">
              {school.alamat || "Jl. Pendidikan No. 123, Ketintang, Surabaya"}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white font-extrabold text-[6.5px] tracking-wider uppercase border border-white/30">
            TATA TERTIB
          </span>
        </div>
      </div>

      {/* Rules in 2 Balanced Columns */}
      <div className="px-3.5 py-1.5 flex-1 flex gap-3 items-center text-[6.8px] leading-relaxed text-slate-700 z-10">
        {/* Left Column: Numbered Rules */}
        <div className="flex-1 space-y-0.5">
          <ol className="space-y-0.5 list-none pl-0">
            {ruleLines.map((line, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="font-bold text-slate-800 shrink-0 text-[6.5px]">
                  {line.match(/^\d+[\.\)]/) ? "" : `${idx + 1}.`}
                </span>
                <span className="leading-tight text-slate-700">
                  {line.replace(/^\d+[\.\)]\s*/, "")}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Right Column: School Info & Return Notice */}
        <div className="w-36 bg-slate-50/90 border border-slate-200 rounded-xl p-2 text-left shrink-0 backdrop-blur-2xs flex flex-col justify-between h-full">
          <div>
            <p className="font-bold text-[7px] text-slate-800 mb-0.5">
              Sekretariat Sekolah:
            </p>
            <p className="text-[6.2px] text-slate-600 line-clamp-2 leading-tight">
              {school.alamat || "Jl. Pendidikan No. 123"}
            </p>
            {school.slogan && (
              <p className="text-[5.8px] text-slate-500 italic mt-0.5 leading-tight">
                &ldquo;{school.slogan}&rdquo;
              </p>
            )}
          </div>

          <div className="pt-1 border-t border-slate-200/80 mt-1">
            <p className="text-[5.5px] text-slate-500 leading-tight">
              ⚠️ Bagi yang menemukan kartu ini, mohon untuk diserahkan ke pihak sekolah.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div
        className="px-3 py-0.5 text-white flex items-center justify-between text-[5.8px] font-medium shrink-0"
        style={{
          background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <span>{school.nama_sekolah || "KARTU TANDA PELAJAR"}</span>
        <span className="uppercase tracking-widest font-bold">
          {school.teks_footer_belakang || "TATA TERTIB & KETENTUAN RESMI"}
        </span>
      </div>
    </div>
  );
}

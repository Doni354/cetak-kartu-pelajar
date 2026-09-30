"use client";

import type { Student, SchoolSetting } from "@/lib/types";
import Barcode from "@/components/cards/Barcode";
import SafeImage from "@/components/ui/SafeImage";

interface PortraitCardProps {
  student: Student;
  school: SchoolSetting;
}

export default function PortraitCard({ student, school }: PortraitCardProps) {
  const primaryColor = school.warna_primary || "#003366";
  const secondaryColor = school.warna_secondary || "#0066cc";

  return (
    <div
      className="card-ktp-portrait bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 relative flex flex-col justify-between text-slate-800 select-none print:shadow-none print:border-slate-300 print:rounded-none"
      style={{
        boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Subtle Security Background Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-[130%] h-[130%] text-slate-900 fill-current">
          <circle cx="50" cy="50" r="45" />
          <polygon points="50,15 61,38 85,38 66,54 73,78 50,64 27,78 34,54 15,38 39,38" fill="#fff" />
        </svg>
      </div>

      {/* Top Header */}
      <div
        className="relative px-3 pt-2.5 pb-2 text-white text-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        {/* School Logo & Title */}
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
              {school.nama_sekolah || "SMK NEGERI 1 CONTOH"}
            </p>
            <p className="text-[5.5px] text-white/85 line-clamp-1">
              {school.alamat || "Jl. Pendidikan No. 123, Surabaya"}
            </p>
          </div>
        </div>

        {school.slogan && (
          <p className="italic text-white/75 text-[5px] mt-0.5 leading-none">
            &ldquo;{school.slogan}&rdquo;
          </p>
        )}

        {/* Decorative Wave Divider */}
        <div className="absolute -bottom-1.5 left-0 w-full overflow-hidden leading-none z-10">
          <svg
            className="relative block w-full h-[6px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.31,192,109.43,234.34,101.19,278.43,76.6,321.39,56.44Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* Badge: KARTU TANDA PELAJAR */}
      <div className="text-center pt-2 pb-1 relative z-10 shrink-0">
        <span
          className="inline-block px-3 py-0.5 rounded-full text-white font-extrabold text-[6.5px] tracking-widest uppercase shadow-xs"
          style={{
            background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          KARTU TANDA PELAJAR
        </span>
      </div>

      {/* Main Content Body */}
      <div className="px-3 flex-1 flex flex-col items-center justify-between z-10">
        {/* Student Photo */}
        <div
          className="w-16 h-20 rounded-lg overflow-hidden border-2 bg-slate-100 flex items-center justify-center shrink-0 shadow-xs relative"
          style={{ borderColor: primaryColor }}
        >
          <SafeImage
            src={student.foto_url}
            alt={student.nama}
            className="w-full h-full object-cover"
            fallbackType="avatar"
            fallbackText={student.nama}
          />
        </div>

        {/* Student Information Table */}
        <div className="w-full space-y-0.5 text-[6.5px] my-1">
          <div className="flex items-start">
            <span className="w-11 shrink-0 text-slate-500 font-medium">Nama</span>
            <span className="mr-1 text-slate-400">:</span>
            <span className="font-bold text-slate-900 truncate uppercase">
              {student.nama}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-11 shrink-0 text-slate-500 font-medium">NIS / NISN</span>
            <span className="mr-1 text-slate-400">:</span>
            <span className="font-bold text-slate-900 font-mono">
              {student.nis}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-11 shrink-0 text-slate-500 font-medium">TTL</span>
            <span className="mr-1 text-slate-400">:</span>
            <span className="text-slate-800 truncate">
              {student.ttl}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-11 shrink-0 text-slate-500 font-medium">Kelas</span>
            <span className="mr-1 text-slate-400">:</span>
            <span className="font-semibold text-slate-800">
              {student.kelas || "X"}
            </span>
          </div>

          <div className="flex items-start">
            <span className="w-11 shrink-0 text-slate-500 font-medium">Alamat</span>
            <span className="mr-1 text-slate-400">:</span>
            <span className="text-slate-800 truncate">
              {student.alamat}
            </span>
          </div>
        </div>

        {/* Barcode Section */}
        <div className="w-full flex flex-col items-center justify-center pt-0.5">
          <Barcode value={student.nis} width={1.1} height={16} />
        </div>
      </div>

      {/* Footer Banner */}
      <div
        className="text-center py-1 text-white font-bold tracking-widest text-[6px] uppercase shrink-0 mt-1"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        BERLAKU SELAMA MENJADI SISWA
      </div>
    </div>
  );
}

"use client";

import type { Student, SchoolSetting } from "@/lib/types";
import Barcode from "@/components/cards/Barcode";
import SafeImage from "@/components/ui/SafeImage";

interface LandscapeCardProps {
  student: Student;
  school: SchoolSetting;
}

export default function LandscapeCard({
  student,
  school,
}: LandscapeCardProps) {
  const primaryColor = school.warna_primary || "#003366";
  const secondaryColor = school.warna_secondary || "#0066cc";

  return (
    <div
      className="card-ktp-landscape bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 relative flex flex-col justify-between text-slate-800 select-none print:shadow-none print:border-slate-300 print:rounded-none"
      style={{
        boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Subtle Security Background Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] text-slate-900 fill-current">
          <circle cx="50" cy="50" r="45" />
          <polygon points="50,15 61,38 85,38 66,54 73,78 50,64 27,78 34,54 15,38 39,38" fill="#fff" />
        </svg>
      </div>

      {/* Top Header */}
      <div
        className="relative px-3 pt-2 pb-1.5 text-white flex items-center justify-between shrink-0"
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
              {school.nama_sekolah || "SMK NEGERI 1 CONTOH"}
            </p>
            <p className="text-[5.8px] text-white/85 line-clamp-1">
              {school.alamat || "Jl. Pendidikan No. 123, Ketintang, Surabaya"}
            </p>
            {school.slogan && (
              <p className="italic text-white/70 text-[5px]">
                &ldquo;{school.slogan}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Badge KARTU PELAJAR */}
        <div className="text-right shrink-0">
          <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white font-extrabold text-[6.5px] tracking-wider uppercase border border-white/30">
            KARTU PELAJAR
          </span>
          <p className="text-[5.5px] text-white/80 mt-0.5 font-medium">
            TA {student.tahun || "2026/2027"}
          </p>
        </div>

        {/* Decorative Wave Divider */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none z-10">
          <svg
            className="relative block w-full h-[5px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* Main Content Body: 2 Columns */}
      <div className="px-3.5 py-1.5 flex-1 flex gap-3 items-center z-10">
        {/* Left Column: Photo & Barcode */}
        <div className="flex flex-col items-center justify-between h-full shrink-0 w-20">
          {/* Photo */}
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

          {/* Barcode under photo */}
          <div className="w-full pt-1 flex items-center justify-center">
            <Barcode value={student.nis} width={0.9} height={14} />
          </div>
        </div>

        {/* Right Column: Student Details */}
        <div className="flex-1 flex flex-col justify-between h-full text-[7px] leading-tight">
          <div className="space-y-1">
            <div className="flex items-start">
              <span className="w-12 shrink-0 text-slate-500 font-medium">Nama</span>
              <span className="mr-1 text-slate-400">:</span>
              <span className="font-bold text-slate-900 truncate uppercase">
                {student.nama}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-12 shrink-0 text-slate-500 font-medium">NIS / NISN</span>
              <span className="mr-1 text-slate-400">:</span>
              <span className="font-bold text-slate-900 font-mono">
                {student.nis}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-12 shrink-0 text-slate-500 font-medium">TTL</span>
              <span className="mr-1 text-slate-400">:</span>
              <span className="text-slate-800 truncate">
                {student.ttl}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-12 shrink-0 text-slate-500 font-medium">Kelas</span>
              <span className="mr-1 text-slate-400">:</span>
              <span className="font-semibold text-slate-800">
                {student.kelas || "X"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-12 shrink-0 text-slate-500 font-medium">Alamat</span>
              <span className="mr-1 text-slate-400">:</span>
              <span className="text-slate-800 truncate">
                {student.alamat}
              </span>
            </div>
          </div>

          {/* Headmaster Signature & Stamp on Bottom Right */}
          <div className="flex justify-end pt-1">
            <div className="text-center w-28 scale-90 origin-bottom-right leading-none">
              <p className="text-[6px] text-slate-500 mb-0.5">
                Surabaya, 15 Juli {student.tahun?.split("/")[0] || "2026"}
              </p>
              <p className="text-[6.2px] text-slate-700 font-semibold mb-0.5">
                Kepala Sekolah,
              </p>
              <div className="h-6 flex items-center justify-center my-0.5 relative">
                {/* Stamp watermark */}
                <span
                  className="absolute font-bold text-[6px] text-red-600/70 border border-red-500/70 rounded-full px-1.5 py-0.5 -rotate-6 select-none"
                >
                  STEMPEL
                </span>
                {/* Signature stroke */}
                <svg className="w-14 h-5" viewBox="0 0 100 40" fill="none" stroke="#0f172a" strokeWidth="1.8">
                  <path d="M10,25 C20,10 30,30 45,15 C55,25 65,12 85,20" />
                </svg>
              </div>
              <p className="text-[6.5px] font-bold text-slate-900 underline truncate">
                {school.kepala_sekolah || "Nama Kepala Sekolah"}
              </p>
            </div>
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
        <span>KARTU TANDA PELAJAR RESMI</span>
        <span className="uppercase tracking-widest font-bold">
          BERLAKU SELAMA MENJADI SISWA
        </span>
      </div>
    </div>
  );
}

"use client";

import type { SchoolSetting } from "@/lib/types";
import SafeImage from "@/components/ui/SafeImage";

interface CardBackProps {
  school: SchoolSetting;
  layout?: "portrait" | "landscape";
}

export default function CardBack({ school, layout = "landscape" }: CardBackProps) {
  const primaryColor = school.warna_primary || "#003366";
  const secondaryColor = school.warna_secondary || "#0066cc";

  if (layout === "portrait") {
    return (
      <div
        className="card-ktp-portrait bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 relative flex flex-col justify-between text-slate-800 select-none print:shadow-none print:border-slate-300"
        style={{
          boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] text-slate-900 fill-current">
            <circle cx="50" cy="50" r="45" />
            <polygon points="50,15 61,38 85,38 66,54 73,78 50,64 27,78 34,54 15,38 39,38" fill="#fff" />
          </svg>
        </div>

        {/* Top Header */}
        <div
          className="px-3 py-2 text-white relative z-10 flex items-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          <SafeImage
            src={school.logo_url}
            alt="Logo"
            className="w-5 h-5 rounded-full object-contain bg-white/20 p-0.5"
            fallbackType="logo"
            fallbackText={school.nama_sekolah}
          />
          <div className="leading-tight">
            <p className="font-bold text-[8.5px] uppercase tracking-wide">
              {school.nama_sekolah || "KARTU PELAJAR"}
            </p>
            <p className="text-[6.5px] text-white/80">Tata Tertib & Ketentuan Penggunaan</p>
          </div>
        </div>

        {/* Content Rules */}
        <div className="px-3 py-2 flex-1 flex flex-col justify-between text-[7px] leading-relaxed text-slate-600">
          <div>
            <p className="font-bold text-[8px] text-slate-800 uppercase tracking-wide mb-1 text-center border-b border-slate-200 pb-1">
              KETENTUAN KARTU SISWA
            </p>
            <ol className="space-y-1 list-decimal list-inside pl-0.5 text-[6.8px]">
              <li>Kartu ini adalah identitas resmi siswa {school.nama_sekolah || "sekolah"}.</li>
              <li>Wajib dibawa selama jam sekolah & kegiatan resmi sekolah.</li>
              <li>Kartu ini tidak boleh dipinjamkan atau disalahgunakan oleh pihak lain.</li>
              <li>Jika kartu hilang atau rusak, segera melapor ke staf Tata Usaha.</li>
              <li>Penemu kartu ini dimohon menyerahkan ke alamat sekolah tertera.</li>
            </ol>
          </div>

          {/* School Contact Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 mt-2">
            <p className="font-semibold text-[7px] text-slate-800 mb-0.5">
              Alamat Sekretariat:
            </p>
            <p className="text-[6.2px] text-slate-600 line-clamp-2">
              {school.alamat || "Jl. Pendidikan No. 123"}
            </p>
            <p className="text-[6px] text-slate-500 italic mt-0.5">
              &ldquo;{school.slogan || "Disiplin, Berkarakter, Berprestasi"}&rdquo;
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        />
      </div>
    );
  }

  // Landscape Layout
  return (
    <div
      className="card-ktp-landscape bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 relative flex flex-col justify-between text-slate-800 select-none print:shadow-none print:border-slate-300"
      style={{
        boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Top Header */}
      <div
        className="px-3.5 py-2 text-white relative z-10 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="flex items-center gap-2">
          <SafeImage
            src={school.logo_url}
            alt="Logo"
            className="w-5 h-5 rounded-full object-contain bg-white/20 p-0.5"
            fallbackType="logo"
            fallbackText={school.nama_sekolah}
          />
          <div>
            <p className="font-bold text-[9px] uppercase tracking-wide">
              {school.nama_sekolah || "KARTU TANDA PELAJAR"}
            </p>
            <p className="text-[6.5px] text-white/80">Tata Tertib & Ketentuan Penggunaan</p>
          </div>
        </div>
        <span className="text-[7px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
          Ketentuan
        </span>
      </div>

      {/* Rules in 2 Columns or structured */}
      <div className="px-4 py-2 flex-1 flex gap-3 items-center text-[7px] leading-relaxed text-slate-600">
        <div className="flex-1 space-y-1">
          <ol className="space-y-1 list-decimal list-inside pl-0.5 text-[6.8px]">
            <li>Kartu ini adalah bukti identitas sah siswa {school.nama_sekolah || "sekolah"}.</li>
            <li>Wajib dibawa selama kegiatan pembelajaran dan acara resmi sekolah.</li>
            <li>Tidak dapat dialihkan atau dipindahtangankan kepada orang lain.</li>
            <li>Jika kartu hilang atau rusak, segera hubungi bagian Tata Usaha (TU).</li>
            <li>Barang siapa menemukan kartu ini, harap mengembalikan ke alamat sekolah.</li>
          </ol>
        </div>

        {/* School Info Box Right */}
        <div className="w-36 bg-slate-50 border border-slate-200 rounded-lg p-2 text-left shrink-0">
          <p className="font-bold text-[7.5px] text-slate-800 mb-0.5">
            Sekretariat Sekolah:
          </p>
          <p className="text-[6.5px] text-slate-600 line-clamp-2 leading-tight">
            {school.alamat || "Jl. Pendidikan No. 123"}
          </p>
          <p className="text-[6px] text-slate-500 italic mt-1 leading-tight">
            &ldquo;{school.slogan || "Berkarakter & Berprestasi"}&rdquo;
          </p>
        </div>
      </div>

      {/* Footer stripe */}
      <div
        className="px-3 py-1 text-white flex items-center justify-between text-[6.5px] font-medium"
        style={{
          background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <span>Aplikasi Cetak Kartu Pelajar Resmi</span>
        <span>Dokumen Internal Sekolah</span>
      </div>
    </div>
  );
}

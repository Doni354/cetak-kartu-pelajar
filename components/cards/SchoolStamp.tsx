"use client";

interface SchoolStampProps {
  kepalaSekolah?: string;
  namaSekolah?: string;
  kota?: string;
  tahun?: string;
  color?: string;
}

export default function SchoolStamp({
  kepalaSekolah = "Drs. H. Bambang Sutrisno, M.Pd.",
  namaSekolah = "SMK NEGERI 1",
  kota = "Surabaya",
  tahun = "2026",
  color = "#1d4ed8",
}: SchoolStampProps) {
  return (
    <div className="relative flex flex-col items-center text-center select-none leading-none">
      <p className="text-[7.5px] text-slate-600 mb-0.5 font-medium">
        {kota}, 15 Juli {tahun.split("/")[0] || tahun}
      </p>
      <p className="text-[7.5px] text-slate-700 font-semibold mb-1">
        Kepala Sekolah,
      </p>

      {/* Signature and Stamp Container */}
      <div className="relative w-28 h-10 flex items-center justify-center my-0.5">
        {/* Authentic Indonesian Circular School Stamp Watermark */}
        <div
          className="absolute -left-2 top-0 pointer-events-none transform -rotate-12"
          style={{ opacity: 0.85 }}
        >
          <svg width="44" height="44" viewBox="0 0 100 100">
            {/* Outer double border */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={color}
              strokeWidth="2.5"
            />
            <circle
              cx="50"
              cy="50"
              r="41"
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />

            {/* Circular Path for Text */}
            <path
              id="stampUpperPath"
              d="M 16,50 A 34,34 0 0,1 84,50"
              fill="none"
            />
            <path
              id="stampLowerPath"
              d="M 84,50 A 34,34 0 0,1 16,50"
              fill="none"
            />

            <text
              fill={color}
              fontSize="8.5"
              fontWeight="bold"
              letterSpacing="1.2"
            >
              <textPath href="#stampUpperPath" startOffset="50%" textAnchor="middle">
                DINAS PENDIDIKAN
              </textPath>
            </text>

            <text
              fill={color}
              fontSize="7"
              fontWeight="bold"
              letterSpacing="0.8"
            >
              <textPath href="#stampLowerPath" startOffset="50%" textAnchor="middle">
                {namaSekolah.slice(0, 16).toUpperCase()}
              </textPath>
            </text>

            {/* Center star and line */}
            <polygon
              points="50,38 52.5,45 60,45 54,49 56,56 50,52 44,56 46,49 40,45 47.5,45"
              fill={color}
            />
            <line
              x1="22"
              y1="50"
              x2="78"
              y2="50"
              stroke={color}
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
          </svg>
        </div>

        {/* Digital Signature stroke */}
        <svg
          className="w-20 h-8 relative z-10"
          viewBox="0 0 100 40"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15,28 C25,12 30,35 42,18 C48,26 55,10 65,30 C72,20 80,24 88,15 M35,26 Q50,28 75,24" />
        </svg>
      </div>

      {/* Headmaster Name & NIP */}
      <p className="text-[8px] font-bold text-slate-800 underline decoration-slate-400 underline-offset-1">
        {kepalaSekolah}
      </p>
      <p className="text-[6.5px] text-slate-500 font-mono mt-0.5">
        NIP. 19740612 199903 1 004
      </p>
    </div>
  );
}

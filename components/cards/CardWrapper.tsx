"use client";

import { useState } from "react";
import type { Student, SchoolSetting, CardTemplate } from "@/lib/types";
import PortraitCard from "@/templates/PortraitCard";
import LandscapeCard from "@/templates/LandscapeCard";
import CardBack from "@/templates/CardBack";
import { RotateCw, ZoomIn, ZoomOut, Check, Printer } from "lucide-react";

interface CardWrapperProps {
  student: Student;
  school: SchoolSetting;
  template?: CardTemplate;
  showControls?: boolean;
  initialSide?: "front" | "back";
  side?: "front" | "back";
  onSideChange?: (side: "front" | "back") => void;
  zoom?: number; // scale multiplier e.g. 1, 1.25, 1.5
  onPrintSingle?: (student: Student) => void;
}

export default function CardWrapper({
  student,
  school,
  template = "portrait",
  showControls = true,
  initialSide = "front",
  side: controlledSide,
  onSideChange,
  zoom = 1,
  onPrintSingle,
}: CardWrapperProps) {
  const [internalSide, setInternalSide] = useState<"front" | "back">(initialSide);
  const side = controlledSide !== undefined ? controlledSide : internalSide;
  const [isFlipping, setIsFlipping] = useState(false);

  const toggleSide = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const nextSide = side === "front" ? "back" : "front";
      if (controlledSide === undefined) {
        setInternalSide(nextSide);
      }
      onSideChange?.(nextSide);
      setIsFlipping(false);
    }, 150);
  };

  const isPortrait = template === "portrait";

  // Base dimensions at 96 DPI: Portrait ~204x324px; Landscape ~324x204px
  const widthMm = isPortrait ? 53.98 : 85.6;
  const heightMm = isPortrait ? 85.6 : 53.98;

  return (
    <div className="flex flex-col items-center">
      {/* Interactive Card Canvas */}
      <div
        className="relative transition-all duration-300"
        style={{
          width: `${widthMm * zoom}mm`,
          height: `${heightMm * zoom}mm`,
        }}
      >
        <div
          className={`origin-top-left transition-all duration-200 ${
            isFlipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          {side === "front" ? (
            isPortrait ? (
              <PortraitCard student={student} school={school} />
            ) : (
              <LandscapeCard student={student} school={school} />
            )
          ) : (
            <CardBack school={school} layout={template} />
          )}
        </div>
      </div>

      {/* Mini Controls under Card */}
      {showControls && (
        <div className="flex items-center justify-between w-full max-w-[85.6mm] mt-2 px-1">
          <button
            onClick={toggleSide}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-primary transition-colors bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-xs hover:border-primary/40"
            title="Balik kartu depan/belakang"
          >
            <RotateCw size={12} className={isFlipping ? "animate-spin" : ""} />
            <span>{side === "front" ? "Lihat Belakang" : "Lihat Depan"}</span>
          </button>

          {onPrintSingle && (
            <button
              onClick={() => onPrintSingle(student)}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-primary transition-colors bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-xs hover:border-primary/40"
              title="Cetak kartu ini"
            >
              <Printer size={12} />
              <span>Cetak</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

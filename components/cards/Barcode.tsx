"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string | number;
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
}

export default function Barcode({
  value,
  width = 1.3,
  height = 24,
  showText = true,
  className = "",
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const strVal = value ? String(value).trim() : "0000000000";

  useEffect(() => {
    if (svgRef.current && strVal) {
      try {
        JsBarcode(svgRef.current, strVal, {
          format: "CODE128",
          width,
          height,
          displayValue: false,
          margin: 0,
          background: "transparent",
          lineColor: "#1e293b",
        });
      } catch (err) {
        console.warn("Barcode rendering fallback:", err);
      }
    }
  }, [strVal, width, height]);

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg ref={svgRef} className="max-w-full overflow-visible" />
      {showText && (
        <span className="font-mono text-[7.5px] font-bold tracking-widest text-slate-700 mt-0.5">
          *{strVal}*
        </span>
      )}
    </div>
  );
}

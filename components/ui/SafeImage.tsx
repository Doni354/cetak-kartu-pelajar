"use client";

import { useState } from "react";
import { User, Image as ImageIcon } from "lucide-react";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackType?: "avatar" | "logo" | "icon";
  fallbackText?: string;
}

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackType = "avatar",
  fallbackText,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const isValidUrl =
    src &&
    typeof src === "string" &&
    (src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("data:image/") ||
      src.startsWith("/"));

  if (!src || !isValidUrl || hasError) {
    if (fallbackType === "avatar") {
      return (
        <div
          className={`bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex flex-col items-center justify-center text-slate-400 select-none ${className}`}
        >
          {fallbackText ? (
            <span className="font-bold text-slate-600 text-sm tracking-wide">
              {fallbackText
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          ) : (
            <User className="w-1/2 h-1/2 opacity-60" />
          )}
        </div>
      );
    }

    if (fallbackType === "logo") {
      return (
        <div
          className={`bg-white/20 backdrop-blur-xs border border-white/30 rounded-full flex items-center justify-center text-white font-bold select-none ${className}`}
        >
          {fallbackText ? (
            <span className="text-[10px] tracking-wider uppercase">
              {fallbackText.slice(0, 3)}
            </span>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
          )}
        </div>
      );
    }

    return (
      <div
        className={`bg-slate-100 flex items-center justify-center text-slate-400 ${className}`}
      >
        <ImageIcon className="w-1/2 h-1/2 opacity-60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      crossOrigin="anonymous"
      loading="lazy"
    />
  );
}

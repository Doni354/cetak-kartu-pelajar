"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  LayoutTemplate,
  Loader2,
  Search,
  Printer,
  RotateCw,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { getStudents, getSchoolSettings } from "@/lib/api";
import {
  getCachedStudents,
  setCachedStudents,
  getCachedSchool,
  setCachedSchool,
} from "@/lib/cache";
import type { Student, SchoolSetting, CardTemplate } from "@/lib/types";
import CardWrapper from "@/components/cards/CardWrapper";
import toast from "react-hot-toast";

export default function PreviewPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [school, setSchool] = useState<SchoolSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<CardTemplate>("portrait");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [zoom, setZoom] = useState<number>(1.25); // Default 1.25x for clear screen reading
  const [globalSide, setGlobalSide] = useState<"front" | "back">("front");

  useEffect(() => {
    // 1. Instantly hydrate from local cache on client mount (0ms, no flicker)
    const cachedStudents = getCachedStudents();
    const cachedSchool = getCachedSchool();
    if (cachedStudents && cachedStudents.length > 0) {
      setStudents(cachedStudents);
      setLoading(false);
    }
    if (cachedSchool) {
      setSchool(cachedSchool);
    }

    // 2. Background revalidation from API
    const fetchData = async () => {
      try {
        const [studentsData, schoolData] = await Promise.all([
          getStudents(),
          getSchoolSettings(),
        ]);
        setStudents(studentsData);
        setCachedStudents(studentsData);

        setSchool(schoolData);
        setCachedSchool(schoolData);
      } catch {
        if (!cachedStudents) {
          toast.error("Gagal memuat data kartu");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const classes = Array.from(new Set(students.map((s) => s.kelas).filter(Boolean)));

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.nama?.toLowerCase().includes(search.toLowerCase()) ||
      s.nis?.toLowerCase().includes(search.toLowerCase());
    const matchClass = selectedClass === "all" || s.kelas === selectedClass;
    return matchSearch && matchClass;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm text-slate-500 font-medium">Memuat preview kartu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Title and Quick Print */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Eye size={24} className="text-primary" />
            Preview Kartu Pelajar
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Lihat visualisasi kartu pelajar sebelum dicetak ke kertas A4
          </p>
        </div>

        <Link
          href="/cetak"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-all shadow-sm"
        >
          <Printer size={16} />
          Cetak Kartu ({filteredStudents.length})
        </Link>
      </div>

      {/* Control Bar: Template, Side, Zoom, Search, Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Template & Side Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Template Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setTemplate("portrait")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  template === "portrait"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutTemplate size={14} />
                Portrait
              </button>
              <button
                onClick={() => setTemplate("landscape")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  template === "landscape"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutTemplate size={14} className="rotate-90" />
                Landscape
              </button>
            </div>

            {/* Front / Back Toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setGlobalSide("front")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  globalSide === "front"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tampak Depan
              </button>
              <button
                onClick={() => setGlobalSide("back")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  globalSide === "back"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tampak Belakang
              </button>
            </div>
          </div>

          {/* Zoom Level Controller */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Ukuran:</span>
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              {[
                { label: "100%", val: 1 },
                { label: "125%", val: 1.25 },
                { label: "150%", val: 1.5 },
              ].map((z) => (
                <button
                  key={z.label}
                  onClick={() => setZoom(z.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    zoom === z.val
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari siswa atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {classes.length > 0 && (
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Filter Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="all">Semua Kelas ({students.length})</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-slate-500 text-sm">Tidak ada siswa yang sesuai pencarian.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center items-start py-4">
          {filteredStudents.map((student) => (
            <div
              key={`${student.id}-${globalSide}-${template}`}
              className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              {school && (
                <CardWrapper
                  student={student}
                  school={school}
                  template={template}
                  initialSide={globalSide}
                  zoom={zoom}
                  showControls={true}
                  onPrintSingle={() => {
                    window.location.href = `/cetak?studentId=${student.id}`;
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

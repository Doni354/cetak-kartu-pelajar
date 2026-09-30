"use client";

import { useEffect, useState } from "react";
import {
  Printer,
  Loader2,
  LayoutTemplate,
  CheckSquare,
  Square,
  Scissors,
  Check,
  RotateCw,
} from "lucide-react";
import { getStudents, getSchoolSettings } from "@/lib/api";
import type { Student, SchoolSetting, CardTemplate } from "@/lib/types";
import PortraitCard from "@/templates/PortraitCard";
import LandscapeCard from "@/templates/LandscapeCard";
import CardBack from "@/templates/CardBack";
import toast from "react-hot-toast";

export default function CetakPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [school, setSchool] = useState<SchoolSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<CardTemplate>("landscape");
  const [side, setSide] = useState<"front" | "back">("front");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [selectedClass, setSelectedClass] = useState("all");
  const [showCropMarks, setShowCropMarks] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, schoolData] = await Promise.all([
          getStudents(),
          getSchoolSettings(),
        ]);
        setStudents(studentsData);
        setSchool(schoolData);

        // Check URL params for studentId
        const params = new URLSearchParams(window.location.search);
        const singleId = params.get("studentId");
        if (singleId) {
          setSelectedIds(new Set([singleId]));
        } else {
          // Select all by default
          setSelectedIds(new Set(studentsData.map((s) => s.id)));
        }
      } catch {
        toast.error("Gagal memuat data cetak");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSelect = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === students.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(students.map((s) => s.id)));
    }
  };

  const classes = Array.from(new Set(students.map((s) => s.kelas).filter(Boolean)));

  const filteredStudents = students.filter((s) => {
    if (selectedClass === "all") return true;
    return s.kelas === selectedClass;
  });

  const selectedStudents = students.filter((s) => selectedIds.has(s.id));

  // Determine cards per A4 sheet:
  // Landscape (85.6mm x 54mm): 2 cols x 4 rows = 8 cards per page
  // Portrait (54mm x 85.6mm): 3 cols x 2 rows = 6 cards or 2 cols x 3 rows = 6 cards per page
  const cardsPerPage = template === "landscape" ? 8 : 6;
  const totalPages = Math.ceil(selectedStudents.length / cardsPerPage);

  const handlePrint = () => {
    if (selectedStudents.length === 0) {
      toast.error("Pilih minimal 1 siswa untuk dicetak");
      return;
    }
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm text-slate-500 font-medium">Menyiapkan halaman cetak...</p>
      </div>
    );
  }

  return (
    <>
      {/* Interactive Controls Bar — hidden when printing */}
      <div className="space-y-6 animate-fade-in no-print mb-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Printer size={24} className="text-primary" />
              Cetak Kartu Pelajar A4
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Tata letak presisi kertas A4 standar KTP (85.60 mm × 53.98 mm)
            </p>
          </div>

          <button
            onClick={handlePrint}
            disabled={selectedStudents.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer size={18} />
            Cetak Sekarang ({selectedStudents.length} Kartu)
          </button>
        </div>

        {/* Layout & Print Config */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Template & Side Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Template Toggle */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  onClick={() => setTemplate("landscape")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    template === "landscape"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutTemplate size={14} className="rotate-90" />
                  Landscape (8 kartu/lbr)
                </button>
                <button
                  onClick={() => setTemplate("portrait")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    template === "portrait"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutTemplate size={14} />
                  Portrait (6 kartu/lbr)
                </button>
              </div>

              {/* Side Toggle */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  onClick={() => setSide("front")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    side === "front"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Sisi Depan
                </button>
                <button
                  onClick={() => setSide("back")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    side === "back"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Sisi Belakang
                </button>
              </div>

              {/* Crop Marks Option */}
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showCropMarks}
                  onChange={(e) => setShowCropMarks(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <Scissors size={14} className="text-slate-500" />
                Tampilkan Garis Potong
              </label>
            </div>

            {/* Quick summary */}
            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-800">{selectedStudents.length}</span> kartu dipilih • Memerlukan{" "}
              <span className="font-bold text-slate-800">{totalPages || 0} lembar</span> kertas A4
            </div>
          </div>

          {/* Student Selector Checklist */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-primary transition-colors"
                >
                  {selectedIds.size === students.length ? (
                    <CheckSquare size={16} className="text-primary" />
                  ) : (
                    <Square size={16} className="text-slate-400" />
                  )}
                  {selectedIds.size === students.length ? "Batal Pilih Semua" : "Pilih Semua Siswa"}
                </button>

                <span className="text-xs text-slate-400">|</span>

                <span className="text-xs text-slate-500">
                  {selectedIds.size} dari {students.length} siswa dipilih
                </span>
              </div>

              {classes.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Filter Kelas:</span>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">Semua Kelas</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Student Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
              {filteredStudents.map((student) => {
                const isSelected = selectedIds.has(student.id);
                return (
                  <button
                    key={student.id}
                    onClick={() => toggleSelect(student.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left border text-xs transition-all ${
                      isSelected
                        ? "bg-primary/5 border-primary text-slate-900 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare size={14} className="text-primary shrink-0" />
                    ) : (
                      <Square size={14} className="text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{student.nama}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Paper Layout Indicator */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
          <p>
            📄 Pratinjau Kertas A4 ({totalPages} Lembar) — Klik tombol &ldquo;Cetak Sekarang&rdquo; untuk memulai
          </p>
          <p className="text-slate-400 hidden sm:block">
            Ukuran Kartu: 85.6 mm × 53.98 mm (Standard ID Card)
          </p>
        </div>
      </div>

      {/* Realistic A4 Sheets Area */}
      <div className="print-area flex flex-col items-center gap-8 py-2">
        {selectedStudents.length === 0 ? (
          <div className="no-print text-center py-20 bg-white rounded-2xl border border-slate-200 w-full max-w-2xl shadow-xs">
            <p className="text-slate-500 text-sm">
              Silahkan pilih minimal 1 siswa di atas untuk melihat tata letak cetak.
            </p>
          </div>
        ) : (
          Array.from({ length: totalPages }).map((_, pageIdx) => {
            const pageStudents = selectedStudents.slice(
              pageIdx * cardsPerPage,
              (pageIdx + 1) * cardsPerPage
            );

            return (
              <div
                key={pageIdx}
                className="print-sheet bg-white border border-slate-200 shadow-xl rounded-sm p-[8mm] relative flex flex-col justify-start"
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  boxSizing: "border-box",
                }}
              >
                {/* On-screen A4 Header label (hidden when printing) */}
                <div className="no-print absolute -top-6 left-0 text-[11px] font-bold text-slate-500 flex items-center justify-between w-full">
                  <span>Lembar A4 Halaman #{pageIdx + 1}</span>
                  <span>{pageStudents.length} Kartu Pelajar</span>
                </div>

                {/* Cards Grid on A4 */}
                <div
                  className={`grid justify-center items-center gap-[4mm] ${
                    template === "landscape"
                      ? "grid-cols-2" // 2 columns x 4 rows = 8 cards (each 85.6mm wide, total ~175mm fits inside 194mm printable A4 width)
                      : "grid-cols-3" // 3 columns x 2 rows = 6 cards (each 54mm wide, total ~168mm fits inside 194mm printable A4 width)
                  }`}
                >
                  {pageStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`relative flex items-center justify-center ${
                        showCropMarks ? "border border-dashed border-slate-300 p-[1.5mm]" : ""
                      }`}
                    >
                      {school &&
                        (side === "front" ? (
                          template === "landscape" ? (
                            <LandscapeCard student={student} school={school} />
                          ) : (
                            <PortraitCard student={student} school={school} />
                          )
                        ) : (
                          <CardBack school={school} layout={template} />
                        ))}
                    </div>
                  ))}
                </div>

                {/* Print Sheet Footer Notice */}
                <div className="no-print mt-auto pt-4 text-center text-[10px] text-slate-400">
                  © Cetak Kartu Pelajar • Standar ISO/IEC 7810 ID-1
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

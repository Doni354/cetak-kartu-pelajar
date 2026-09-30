"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  Printer,
  Settings,
  GraduationCap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";
import { getStudents, getSchoolSettings } from "@/lib/api";
import type { Student, SchoolSetting, CardTemplate } from "@/lib/types";
import CardWrapper from "@/components/cards/CardWrapper";
import SafeImage from "@/components/ui/SafeImage";
import {
  getCachedStudents,
  setCachedStudents,
  getCachedSchool,
  setCachedSchool,
} from "@/lib/cache";
import toast from "react-hot-toast";

export default function DashboardPage() {
  // SWR: Instant load from cache (0ms)
  const [students, setStudents] = useState<Student[]>(() => getCachedStudents() || []);
  const [school, setSchool] = useState<SchoolSetting | null>(() => getCachedSchool());
  const [loading, setLoading] = useState(() => !getCachedStudents());
  const [previewTemplate, setPreviewTemplate] = useState<CardTemplate>("portrait");
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);

  const fetchData = async () => {
    if (!getCachedStudents()) setLoading(true);
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
      if (!getCachedStudents()) {
        toast.error("Gagal memuat data dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStudents = students.length;
  const completePhotos = students.filter((s) => s.foto_url).length;
  const missingPhotos = totalStudents - completePhotos;
  const featuredStudent = students[selectedStudentIndex] || students[0];

  const quickActions = [
    {
      label: "Preview Kartu Pelajar",
      description: "Visualisasi kartu depan & belakang sebelum dicetak",
      href: "/preview",
      icon: Eye,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600 bg-blue-50",
    },
    {
      label: "Cetak ke Kertas A4",
      description: "Tata letak presisi A4 dengan garis potong rapi",
      href: "/cetak",
      icon: Printer,
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Kelola Data Siswa",
      description: "Tambah, edit, hapus identitas dan foto siswa",
      href: "/siswa",
      icon: Users,
      color: "from-amber-600 to-orange-600",
      accent: "text-amber-600 bg-amber-50",
    },
    {
      label: "Pengaturan & Desain",
      description: "Atur kop sekolah, logo, warna, dan tanda tangan",
      href: "/pengaturan",
      icon: Settings,
      color: "from-slate-700 to-slate-900",
      accent: "text-slate-700 bg-slate-100",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-2xl animate-pulse border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary to-primary-light rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-white/90 mb-1 border border-white/20">
            <Sparkles size={14} className="text-amber-300" />
            <span>Sistem Generator Kartu Pelajar v1.0</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang di {school?.nama_sekolah || "Sistem Administrasi"}
          </h1>
          <p className="text-white/80 text-sm max-w-xl">
            Kelola data siswa, upload foto secara instan ke Cloudinary, dan cetak kartu pelajar berkualitas tinggi sesuai standar ukuran KTP.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white text-xs font-semibold border border-white/20 transition-all"
          >
            <RefreshCw size={14} />
            Muat Ulang Data
          </button>
          <Link
            href="/cetak"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary text-xs font-bold hover:bg-slate-100 transition-all shadow-md"
          >
            <Printer size={15} />
            Cetak Kartu A4
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Users size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Siswa</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalStudents}</p>
            <p className="text-[11px] text-slate-400">Terdaftar di sistem</p>
          </div>
        </div>

        {/* Foto Lengkap */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Foto Lengkap</p>
            <p className="text-2xl font-black text-emerald-700 mt-0.5">{completePhotos}</p>
            <p className="text-[11px] text-emerald-600/80 font-medium">
              {totalStudents > 0 ? `${Math.round((completePhotos / totalStudents) * 100)}% siswa berfoto` : "0%"}
            </p>
          </div>
        </div>

        {/* Belum Ada Foto */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Belum Ada Foto</p>
            <p className="text-2xl font-black text-amber-700 mt-0.5">{missingPhotos}</p>
            <p className="text-[11px] text-amber-600/80 font-medium">Perlu diunggah</p>
          </div>
        </div>

        {/* Status Database */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <GraduationCap size={22} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Sekolah</p>
            <p className="text-base font-bold text-slate-900 mt-0.5 truncate max-w-[120px]">
              {school?.nama_sekolah ? "Aktif" : "-"}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Siap Cetak
            </p>
          </div>
        </div>
      </div>

      {/* Main Showcase: Live Card Preview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Live Card Preview Showcase (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-7 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                Live Card Preview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pratinjau langsung kartu pelajar dengan data dan logo aktual
              </p>
            </div>

            {/* Template Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setPreviewTemplate("portrait")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewTemplate === "portrait"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutTemplate size={13} />
                Portrait
              </button>
              <button
                onClick={() => setPreviewTemplate("landscape")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  previewTemplate === "landscape"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutTemplate size={13} className="rotate-90" />
                Landscape
              </button>
            </div>
          </div>

          {/* Card Presentation Container */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center min-h-[380px]">
            {featuredStudent && school ? (
              <CardWrapper
                student={featuredStudent}
                school={school}
                template={previewTemplate}
                zoom={1.25}
                showControls={true}
                onPrintSingle={() => {
                  window.location.href = `/cetak?studentId=${featuredStudent.id}`;
                }}
              />
            ) : (
              <p className="text-xs text-slate-400">Tidak ada data siswa untuk ditampilkan.</p>
            )}
          </div>

          {/* Quick Student Switcher */}
          {students.length > 1 && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Ganti Siswa:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm py-1">
                {students.slice(0, 5).map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedStudentIndex === idx
                        ? "bg-primary text-white shadow-xs font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s.nama.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions & Navigation (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Aksi Cepat</h2>
            <span className="text-xs text-slate-400">Menu Utama</span>
          </div>

          <div className="flex flex-col gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${action.accent} group-hover:scale-105 transition-transform`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-primary transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>

          {/* School Information Box */}
          {school && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-md flex flex-col gap-3 mt-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <SafeImage
                    src={school.logo_url}
                    alt="Logo"
                    className="w-7 h-7 rounded-full object-contain bg-white/10 p-0.5"
                    fallbackType="logo"
                    fallbackText={school.nama_sekolah}
                  />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wide">
                      {school.nama_sekolah}
                    </h4>
                    <p className="text-[10px] text-white/60">Identitas Sekolah Aktif</p>
                  </div>
                </div>
                <Link
                  href="/pengaturan"
                  className="text-[10px] font-semibold text-blue-300 hover:text-white underline underline-offset-2"
                >
                  Ubah
                </Link>
              </div>

              <div className="text-[11px] space-y-1.5 text-white/80">
                <div className="flex justify-between">
                  <span className="text-white/50">Kepala Sekolah:</span>
                  <span className="font-medium text-white">{school.kepala_sekolah}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Alamat:</span>
                  <span className="font-medium text-white text-right truncate max-w-[180px]">
                    {school.alamat}
                  </span>
                </div>
                {school.slogan && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Slogan:</span>
                    <span className="font-medium italic text-white text-right truncate max-w-[180px]">
                      &ldquo;{school.slogan}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

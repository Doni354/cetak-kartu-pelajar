"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Loader2,
  Upload,
  Save,
  Check,
  Palette,
  Sparkles,
  LayoutTemplate,
  FileText,
  Shield,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { getSchoolSettings, updateSchoolSettings } from "@/lib/api";
import { getCachedSchool, setCachedSchool } from "@/lib/cache";
import type { SchoolSetting, CardTemplate } from "@/lib/types";
import { defaultSchoolSetting, defaultStudents, defaultKetentuanBelakang } from "@/lib/mock-data";
import SafeImage from "@/components/ui/SafeImage";
import CardWrapper from "@/components/cards/CardWrapper";
import toast from "react-hot-toast";

const colorPresets = [
  { name: "Navy Blue (Default)", primary: "#003366", secondary: "#0066cc" },
  { name: "Emerald Islamic / Madrasah", primary: "#065f46", secondary: "#059669" },
  { name: "Royal Blue & Cyan", primary: "#1e3a8a", secondary: "#0284c7" },
  { name: "Maroon & Crimson", primary: "#831843", secondary: "#e11d48" },
  { name: "Dark Slate & Amber", primary: "#1e293b", secondary: "#d97706" },
  { name: "Deep Purple & Violet", primary: "#4c1d95", secondary: "#7c3aed" },
];

export default function PengaturanPage() {
  const [settings, setSettings] = useState<SchoolSetting>(defaultSchoolSetting);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<CardTemplate>("portrait");
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // 1. Instantly hydrate from local cache on client mount
    const cached = getCachedSchool();
    if (cached) {
      setSettings(cached);
      setLoading(false);
    }

    const fetchSettings = async () => {
      try {
        const data = await getSchoolSettings();
        const merged = { ...defaultSchoolSetting, ...data };
        setSettings(merged);
        setCachedSchool(merged);
      } catch {
        if (!cached) {
          toast.error("Gagal memuat pengaturan sekolah");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "logo");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success && data.url) {
        setSettings((prev) => {
          const updated = { ...prev, logo_url: data.url };
          setCachedSchool(updated);
          return updated;
        });
        toast.success("Logo sekolah berhasil diunggah!");
      } else {
        toast.error(data.message || "Gagal upload logo ke Cloudinary");
      }
    } catch {
      toast.error("Gagal upload logo");
    } finally {
      setUploading(false);
    }
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        warna_primary: preset.primary,
        warna_secondary: preset.secondary,
      };
      setCachedSchool(updated);
      return updated;
    });
    toast.success(`Palet ${preset.name} diterapkan!`);
  };

  const handleSave = async () => {
    setSaved(true);
    // Optimistic: Simpan ke cache lokal langsung agar langsung aktif di seluruh halaman
    setCachedSchool(settings);

    try {
      const res = await updateSchoolSettings(settings);
      if (res.success) {
        toast.success("Pengaturan sekolah & desain berhasil disimpan ke Google Sheets!");
      } else {
        toast.error(res.message || "Gagal menyimpan ke Google Sheets, data tetap aman di cache browser");
      }
    } catch {
      toast.error("Gagal sinkron ke Google Sheets, data tetap aman di cache browser");
    } finally {
      setTimeout(() => setSaved(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm text-slate-500 font-medium">Memuat pengaturan sekolah...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings size={24} className="text-primary" />
            Pengaturan & Personalisasi Kartu
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Sesuaikan identitas sekolah, logo, dan tema warna kartu pelajar dengan pratinjau langsung
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all shadow-sm"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>

      {/* Split Layout: Settings Form (Left) & Live Card Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Settings (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-7 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Identitas Sekolah
          </h2>

          {/* Logo Sekolah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Logo Resmi Sekolah
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center p-2 shrink-0 shadow-xs">
                <SafeImage
                  src={settings.logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  fallbackType="logo"
                  fallbackText={settings.nama_sekolah}
                />
              </div>

              <div className="space-y-2 flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-primary cursor-pointer transition-all">
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin text-primary" />
                  ) : (
                    <Upload size={14} className="text-primary" />
                  )}
                  <span>{uploading ? "Mengunggah Logo..." : "Upload Logo Baru"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                  />
                </label>
                <input
                  type="text"
                  value={settings.logo_url}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, logo_url: e.target.value }))
                  }
                  placeholder="Atau masukkan URL logo (https://...)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Nama Sekolah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Sekolah (Kop Utama) *
            </label>
            <input
              type="text"
              value={settings.nama_sekolah}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, nama_sekolah: e.target.value }))
              }
              placeholder="Contoh: SMK NEGERI 1 SURABAYA"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
            />
          </div>

          {/* Alamat Sekolah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap Sekolah *
            </label>
            <input
              type="text"
              value={settings.alamat}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, alamat: e.target.value }))
              }
              placeholder="Contoh: Jl. Pendidikan No. 123, Surabaya"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Slogan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Slogan / Motto Sekolah
            </label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, slogan: e.target.value }))
              }
              placeholder="Contoh: Berkarakter, Kompeten, Siap Kerja"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all italic"
            />
          </div>

          {/* Kepala Sekolah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Kepala Sekolah (Tanda Tangan) *
            </label>
            <input
              type="text"
              value={settings.kepala_sekolah}
              onChange={(e) =>
                setSettings((prev) => {
                  const updated = { ...prev, kepala_sekolah: e.target.value };
                  setCachedSchool(updated);
                  return updated;
                })
              }
              placeholder="Contoh: Drs. H. Bambang Sutrisno, M.Pd."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          {/* Kota Penerbitan Kartu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kota Penerbitan Kartu (Di Atas TTD Kepala Sekolah)
            </label>
            <input
              type="text"
              value={settings.kota_terbit || ""}
              onChange={(e) =>
                setSettings((prev) => {
                  const updated = { ...prev, kota_terbit: e.target.value };
                  setCachedSchool(updated);
                  return updated;
                })
              }
              placeholder="Contoh: Surabaya"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          {/* Palette Presets */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Palette size={14} className="text-primary" />
              Pilihan Tema Warna Cepat
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-primary bg-slate-50/70 hover:bg-slate-100 text-left transition-all group"
                >
                  <div className="flex gap-1 shrink-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white"
                      style={{ background: preset.primary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white"
                      style={{ background: preset.secondary }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 group-hover:text-primary truncate">
                    {preset.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Warna Primer (Kop)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.warna_primary}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      warna_primary: e.target.value,
                    }))
                  }
                  className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={settings.warna_primary}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      warna_primary: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Warna Sekunder (Aksen)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.warna_secondary}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      warna_secondary: e.target.value,
                    }))
                  }
                  className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={settings.warna_secondary}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      warna_secondary: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: Watermark & Keamanan Kartu */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              Watermark Logo Sekolah di Tengah Kartu
            </h2>

            {/* Toggle Watermark */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-800">Watermark Logo di Latar Belakang Kartu</p>
                <p className="text-[11px] text-slate-500">
                  Tampilkan logo sekolah transparan di tengah kartu (depan & belakang)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.show_watermark !== false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSettings((prev) => {
                      const updated = { ...prev, show_watermark: checked };
                      setCachedSchool(updated);
                      return updated;
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Opacity Watermark Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Tingkat Transparansi (Opacity) Watermark Logo: {Math.round((settings.watermark_opacity ?? 0.08) * 100)}%
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Sangat Halus (4%)", val: 0.04 },
                  { label: "Sedang / Rekomendasi (8%)", val: 0.08 },
                  { label: "Tegas (12%)", val: 0.12 },
                  { label: "Jelas (16%)", val: 0.16 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setSettings((prev) => {
                        const updated = { ...prev, watermark_opacity: item.val };
                        setCachedSchool(updated);
                        return updated;
                      });
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                      (settings.watermark_opacity ?? 0.08) === item.val
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Tata Tertib & Ketentuan Belakang */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Tata Tertib & Ketentuan Sisi Belakang Kartu
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSettings((prev) => {
                    const updated = { ...prev, ketentuan_belakang: defaultKetentuanBelakang };
                    setCachedSchool(updated);
                    return updated;
                  });
                  toast.success("Ketentuan kartu dikembalikan ke teks standar resmi!");
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-primary transition-colors bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg"
              >
                <RotateCcw size={12} />
                <span>Reset Standar</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Ketikkan ketentuan sekolah per baris. Setiap baris baru otomatis diformat menjadi poin bernomor (1, 2, 3...) yang rapi pada kartu bagian belakang.
            </p>
            <textarea
              rows={5}
              value={settings.ketentuan_belakang ?? defaultKetentuanBelakang}
              onChange={(e) => {
                const val = e.target.value;
                setSettings((prev) => {
                  const updated = { ...prev, ketentuan_belakang: val };
                  setCachedSchool(updated);
                  return updated;
                });
              }}
              placeholder="1. Kartu ini adalah tanda pengenal sah siswa..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all leading-relaxed"
            />
          </div>

          {/* Section: Teks Footer Banner Kartu */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              Teks Footer Kartu (Depan & Belakang)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Footer Kartu Depan
                </label>
                <input
                  type="text"
                  value={settings.teks_footer_depan || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSettings((prev) => {
                      const updated = { ...prev, teks_footer_depan: val };
                      setCachedSchool(updated);
                      return updated;
                    });
                  }}
                  placeholder="BERLAKU SELAMA MENJADI SISWA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Footer Kartu Belakang
                </label>
                <input
                  type="text"
                  value={settings.teks_footer_belakang || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSettings((prev) => {
                      const updated = { ...prev, teks_footer_belakang: val };
                      setCachedSchool(updated);
                      return updated;
                    });
                  }}
                  placeholder="KARTU TANDA PELAJAR RESMI"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Card Preview Box (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 sticky top-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles size={15} className="text-primary" />
                Live Card Preview
              </h3>
              <p className="text-[11px] text-slate-500">
                Pembaruan warna & teks tampil secara instan
              </p>
            </div>

            {/* Template & Side Selectors */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Orientation */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate("portrait")}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                    previewTemplate === "portrait"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate("landscape")}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                    previewTemplate === "landscape"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Landscape
                </button>
              </div>

              {/* Side (Front/Back) */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewSide("front")}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                    previewSide === "front"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Depan
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewSide("back")}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                    previewSide === "back"
                      ? "bg-white text-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Belakang
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Card Presentation */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col items-center justify-center min-h-[380px]">
            <CardWrapper
              student={defaultStudents[0]}
              school={settings}
              template={previewTemplate}
              side={previewSide}
              onSideChange={setPreviewSide}
              zoom={1.2}
              showControls={true}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-[11px] text-blue-900">
            <p className="font-bold mb-0.5">ℹ️ Catatan Sinkronisasi</p>
            <p className="text-blue-700 leading-relaxed">
              Perubahan desain otomatis diterapkan di halaman Preview dan Cetak. Data juga dapat disinkronkan ke Google Sheets pada sheet <strong>SETTING_SEKOLAH</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

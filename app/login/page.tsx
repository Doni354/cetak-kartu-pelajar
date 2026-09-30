"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Loader2, User, Lock, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Login berhasil!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Username atau password salah");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi. Silahkan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
    toast.success("Kredensial demo terisi!");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at top, #003366 0%, #001a33 60%, #000d1a 100%)",
      }}
    >
      {/* Decorative Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "#0066cc" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "#3388dd" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ background: "#004080" }}
        />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[420px] relative z-10 animate-fade-in flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-xl border border-white/20"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <GraduationCap size={34} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Cetak Kartu Pelajar
          </h1>
          <p className="text-xs text-white/60 mt-1 font-medium">
            Sistem Administrasi & Generator Kartu Sekolah
          </p>
        </div>

        {/* Card Form */}
        <div
          className="w-full rounded-3xl bg-white shadow-2xl p-7 sm:p-8 border border-slate-100/80"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Masuk ke Akun</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan kredensial Anda untuk mengakses dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <User size={13} className="text-slate-400" />
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Lock size={13} className="text-slate-400" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-white text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #003366 0%, #0066cc 100%)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Memproses Masuk...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="leading-tight">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">
                Akun Demo Operator
              </span>
              <span className="font-mono text-xs text-slate-700">
                admin / admin123
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-2xs"
            >
              <Sparkles size={12} />
              <span>Isi Otomatis</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-[11px] mt-6 font-medium">
          © Cetak Kartu Pelajar • Sistem Pembuatan & Cetak Kartu Identitas Siswa
        </p>
      </div>
    </div>
  );
}

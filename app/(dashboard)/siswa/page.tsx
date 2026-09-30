"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Loader2,
  Eye,
  Printer,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getSchoolSettings,
} from "@/lib/api";
import type { Student, StudentFormData, SchoolSetting } from "@/lib/types";
import SafeImage from "@/components/ui/SafeImage";
import CardWrapper from "@/components/cards/CardWrapper";
import toast from "react-hot-toast";

const emptyForm: StudentFormData = {
  nama: "",
  ttl: "",
  alamat: "",
  nis: "",
  foto_url: "",
  kelas: "X-A",
  tahun: "2026/2027",
};

export default function SiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [school, setSchool] = useState<SchoolSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<StudentFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const [data, schoolData] = await Promise.all([
        getStudents(),
        getSchoolSettings(),
      ]);
      setStudents(data);
      setSchool(schoolData);
    } catch {
      toast.error("Gagal memuat data siswa");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const classes = Array.from(new Set(students.map((s) => s.kelas).filter(Boolean)));

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.nama?.toLowerCase().includes(search.toLowerCase()) ||
      s.nis?.toLowerCase().includes(search.toLowerCase()) ||
      s.alamat?.toLowerCase().includes(search.toLowerCase());
    const matchClass = selectedClass === "all" || s.kelas === selectedClass;
    return matchSearch && matchClass;
  });

  const openAddForm = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (student: Student) => {
    setEditingStudent(student);
    setForm({
      nama: student.nama,
      ttl: student.ttl,
      alamat: student.alamat,
      nis: student.nis,
      foto_url: student.foto_url,
      kelas: student.kelas,
      tahun: student.tahun,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingStudent(null);
    setForm(emptyForm);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "photo");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success && data.url) {
        setForm((prev) => ({ ...prev, foto_url: data.url }));
        toast.success("Foto berhasil diunggah!");
      } else {
        toast.error(data.message || "Gagal upload foto ke Cloudinary");
      }
    } catch {
      toast.error("Gagal upload foto");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingStudent) {
        const result = await updateStudent({ ...form, id: editingStudent.id });
        if (result.success) {
          toast.success("Data siswa berhasil diperbarui");
          closeForm();
          fetchStudents();
        } else {
          toast.error("Gagal memperbarui siswa");
        }
      } else {
        const result = await addStudent(form);
        if (result.success) {
          toast.success("Siswa baru berhasil ditambahkan");
          closeForm();
          fetchStudents();
        } else {
          toast.error("Gagal menambahkan siswa");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) return;

    setDeletingId(id);
    try {
      const res = await deleteStudent(id);
      if (res.success) {
        toast.success("Data siswa berhasil dihapus");
        fetchStudents();
      } else {
        toast.error("Gagal menghapus siswa");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users size={24} className="text-primary" />
            Manajemen Data Siswa
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Kelola data identitas dan foto siswa untuk cetak kartu pelajar
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          Tambah Siswa
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIS, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {classes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 whitespace-nowrap">Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
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

          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Total: <strong className="text-slate-800">{filteredStudents.length}</strong>
          </span>
        </div>
      </div>

      {/* Table Data Siswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-14">Foto</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">NIS / NISN</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Tempat, Tgl Lahir</th>
                <th className="py-3.5 px-4">Kelas</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Alamat</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-9 bg-slate-100 rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <p className="text-sm">Tidak ada data siswa yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Foto */}
                    <td className="py-3 px-4">
                      <SafeImage
                        src={student.foto_url}
                        alt={student.nama}
                        className="w-9 h-11 rounded-md object-cover border border-slate-200 shadow-2xs"
                        fallbackType="avatar"
                        fallbackText={student.nama}
                      />
                    </td>

                    {/* Nama */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {student.nama}
                    </td>

                    {/* NIS */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {student.nis}
                    </td>

                    {/* TTL */}
                    <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">
                      {student.ttl}
                    </td>

                    {/* Kelas */}
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        {student.kelas}
                      </span>
                    </td>

                    {/* Alamat */}
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate hidden md:table-cell">
                      {student.alamat}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick Card Preview */}
                        <button
                          onClick={() => setPreviewStudent(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Lihat Pratinjau Kartu"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Print */}
                        <button
                          onClick={() => {
                            window.location.href = `/cetak?studentId=${student.id}`;
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
                          title="Cetak Kartu Siswa Ini"
                        >
                          <Printer size={15} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditForm(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Edit Data Siswa"
                        >
                          <Edit2 size={15} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(student.id)}
                          disabled={deletingId === student.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Siswa"
                        >
                          {deletingId === student.id ? (
                            <Loader2 size={15} className="animate-spin text-red-500" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Card Preview Modal */}
      {previewStudent && school && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-md w-full relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pratinjau Kartu Pelajar
                </h3>
                <p className="text-xs text-slate-500">{previewStudent.nama}</p>
              </div>
              <button
                onClick={() => setPreviewStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Render Card Wrapper */}
            <div className="flex justify-center py-2">
              <CardWrapper
                student={previewStudent}
                school={school}
                template="portrait"
                zoom={1.25}
                showControls={true}
                onPrintSingle={() => {
                  window.location.href = `/cetak?studentId=${previewStudent.id}`;
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
              <h2 className="text-base font-bold text-slate-900">
                {editingStudent ? "Perbarui Data Siswa" : "Tambah Siswa Baru"}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Foto Siswa (Pass Photo 3x4)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 shadow-xs">
                    <SafeImage
                      src={form.foto_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      fallbackType="avatar"
                      fallbackText={form.nama}
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-primary cursor-pointer transition-all">
                      {uploading ? (
                        <Loader2 size={14} className="animate-spin text-primary" />
                      ) : (
                        <Upload size={14} className="text-primary" />
                      )}
                      <span>{uploading ? "Mengunggah ke Cloudinary..." : "Upload Foto Baru"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Format: JPG, PNG, atau WEBP. Maksimal 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* URL Foto Manual (opsional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Atau URL Foto Langsung (opsional)
                </label>
                <input
                  type="text"
                  value={form.foto_url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, foto_url: e.target.value }))
                  }
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  required
                  placeholder="Contoh: Ahmad Rizki Pratama"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              {/* NIS & Kelas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIS / NISN *
                  </label>
                  <input
                    type="text"
                    value={form.nis}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, nis: e.target.value }))
                    }
                    required
                    placeholder="Contoh: 0087654321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas *
                  </label>
                  <input
                    type="text"
                    value={form.kelas}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, kelas: e.target.value }))
                    }
                    required
                    placeholder="Contoh: X TKJ 1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* TTL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempat, Tanggal Lahir *
                </label>
                <input
                  type="text"
                  value={form.ttl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ttl: e.target.value }))
                  }
                  required
                  placeholder="Contoh: Surabaya, 12 Januari 2008"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Tempat Tinggal *
                </label>
                <input
                  type="text"
                  value={form.alamat}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, alamat: e.target.value }))
                  }
                  required
                  placeholder="Contoh: Jl. Ketintang Baru No. 45, Surabaya"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Tahun Ajaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  value={form.tahun}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tahun: e.target.value }))
                  }
                  placeholder="Contoh: 2026/2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all shadow-sm disabled:opacity-50"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {editingStudent ? "Simpan Perubahan" : "Simpan Siswa Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

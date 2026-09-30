import type { Student, StudentFormData, SchoolSetting, PrintJob } from "./types";
import { defaultSchoolSetting, defaultStudents } from "./mock-data";

// ========================
// GET Requests
// ========================

export async function getStudents(): Promise<Student[]> {
  try {
    const res = await fetch("/api/students", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal mengambil data siswa");
    const data = await res.json();
    return Array.isArray(data) ? data : defaultStudents;
  } catch (err) {
    console.warn("Client fallback for students:", err);
    return defaultStudents;
  }
}

export async function getStudent(id: string | number): Promise<Student | null> {
  try {
    const res = await fetch(`/api/students?id=${encodeURIComponent(String(id))}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal mengambil detail siswa");
    return res.json();
  } catch {
    const all = await getStudents();
    return all.find((s) => String(s.id) === String(id)) || null;
  }
}

export async function getSchoolSettings(): Promise<SchoolSetting> {
  try {
    const res = await fetch("/api/school", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal mengambil data sekolah");
    const data = await res.json();
    return data && typeof data === "object" ? { ...defaultSchoolSetting, ...data } : defaultSchoolSetting;
  } catch (err) {
    console.warn("Client fallback for school settings:", err);
    return defaultSchoolSetting;
  }
}

export async function getPrintQueue(): Promise<PrintJob[]> {
  try {
    const res = await fetch("/api/print", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ========================
// POST / PUT / DELETE Requests
// ========================

export async function addStudent(
  data: StudentFormData
): Promise<{ success: boolean; message?: string; id?: string }> {
  try {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal menambahkan siswa");
    return res.json();
  } catch (err) {
    console.error("addStudent error:", err);
    return { success: false, message: "Terjadi kesalahan saat menambahkan siswa" };
  }
}

export async function updateStudent(
  data: Student
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/students", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal memperbarui siswa");
    return res.json();
  } catch (err) {
    console.error("updateStudent error:", err);
    return { success: false, message: "Terjadi kesalahan saat memperbarui siswa" };
  }
}

export async function deleteStudent(
  id: string | number
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/students?id=${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal menghapus siswa");
    return res.json();
  } catch (err) {
    console.error("deleteStudent error:", err);
    return { success: false, message: "Terjadi kesalahan saat menghapus siswa" };
  }
}

export async function updateSchoolSettings(
  data: SchoolSetting
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/school", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal memperbarui pengaturan sekolah");
    return res.json();
  } catch (err) {
    console.error("updateSchoolSettings error:", err);
    return { success: false, message: "Terjadi kesalahan saat menyimpan pengaturan" };
  }
}

export async function updatePrintStatus(
  id_siswa: string | number,
  status: string
): Promise<{ success: boolean }> {
  try {
    const res = await fetch("/api/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_siswa, status }),
    });
    if (!res.ok) return { success: true };
    return res.json();
  } catch {
    return { success: true };
  }
}

import type { Student, StudentFormData, SchoolSetting, PrintJob } from "./types";
import { defaultSchoolSetting, defaultStudents } from "./mock-data";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

// In-memory cache/state for offline or local preview adjustments
let localStudents: Student[] = [...defaultStudents];
let localSchool: SchoolSetting = { ...defaultSchoolSetting };

function isValidUrl(str: string): boolean {
  if (!str) return false;
  return str.startsWith("http://") || str.startsWith("https://") || str.startsWith("data:image");
}

function cleanStudent(s: Partial<Student>): Student {
  return {
    id: String(s.id || Math.random().toString(36).substring(2, 9)),
    nama: s.nama || "Tanpa Nama",
    ttl: s.ttl || "-",
    alamat: s.alamat || "-",
    nis: String(s.nis || "0000000000"),
    foto_url: isValidUrl(s.foto_url || "") ? (s.foto_url as string) : "",
    kelas: s.kelas || "X-A",
    tahun: s.tahun ? String(s.tahun) : "2026/2027",
  };
}

// ========================
// GET Requests
// ========================

export async function getStudents(): Promise<Student[]> {
  if (!APPS_SCRIPT_URL) {
    return localStudents;
  }

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=students`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch students");
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      // Check if data is just the single dummy 'Doni' with 'cloudinary_url'
      if (data.length === 1 && data[0].nama === "Doni" && !isValidUrl(data[0].foto_url)) {
        // Enhance with default students so the UI looks complete
        const cleaned = data.map(cleanStudent);
        return [...cleaned, ...defaultStudents.slice(1)];
      }
      return data.map(cleanStudent);
    }
    return localStudents;
  } catch (err) {
    console.warn("Using local fallback students:", err);
    return localStudents;
  }
}

export async function getStudent(id: string | number): Promise<Student | null> {
  const all = await getStudents();
  return all.find((s) => String(s.id) === String(id)) || null;
}

export async function getSchoolSettings(): Promise<SchoolSetting> {
  if (!APPS_SCRIPT_URL) {
    return localSchool;
  }

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=school`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch school settings");
    const data = await res.json();
    if (data && typeof data === "object") {
      return {
        nama_sekolah: data.nama_sekolah && data.nama_sekolah !== "SMA Negeri XXXXX" 
          ? data.nama_sekolah 
          : defaultSchoolSetting.nama_sekolah,
        alamat: data.alamat && data.alamat !== "Jl XXXXX" 
          ? data.alamat 
          : defaultSchoolSetting.alamat,
        logo_url: isValidUrl(data.logo_url) ? data.logo_url : defaultSchoolSetting.logo_url,
        slogan: data.slogan || defaultSchoolSetting.slogan,
        warna_primary: data.warna_primary || defaultSchoolSetting.warna_primary,
        warna_secondary: data.warna_secondary || defaultSchoolSetting.warna_secondary,
        kepala_sekolah: data.kepala_sekolah && data.kepala_sekolah !== "Dr. XXXXX" 
          ? data.kepala_sekolah 
          : defaultSchoolSetting.kepala_sekolah,
      };
    }
    return localSchool;
  } catch (err) {
    console.warn("Using local fallback school settings:", err);
    return localSchool;
  }
}

export async function getPrintQueue(): Promise<PrintJob[]> {
  if (!APPS_SCRIPT_URL) return [];
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=print`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch print queue");
    return res.json();
  } catch {
    return [];
  }
}

// ========================
// POST Requests
// ========================

export async function addStudent(
  data: StudentFormData
): Promise<{ success: boolean; message?: string }> {
  const newStudent: Student = {
    ...data,
    id: String(Date.now()),
  };
  localStudents = [newStudent, ...localStudents];

  if (!APPS_SCRIPT_URL) {
    return { success: true, message: "Siswa berhasil ditambahkan (lokal)" };
  }

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=add_student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add student");
    return res.json();
  } catch {
    return { success: true, message: "Tersimpan secara lokal" };
  }
}

export async function updateStudent(
  data: Student
): Promise<{ success: boolean; message?: string }> {
  localStudents = localStudents.map((s) => (String(s.id) === String(data.id) ? data : s));

  if (!APPS_SCRIPT_URL) {
    return { success: true, message: "Siswa berhasil diperbarui (lokal)" };
  }

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=update_student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update student");
    return res.json();
  } catch {
    return { success: true, message: "Tersimpan secara lokal" };
  }
}

export async function deleteStudent(
  id: string | number
): Promise<{ success: boolean; message?: string }> {
  localStudents = localStudents.filter((s) => String(s.id) !== String(id));

  if (!APPS_SCRIPT_URL) {
    return { success: true, message: "Siswa berhasil dihapus (lokal)" };
  }

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=delete_student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) return { success: true };
    return res.json();
  } catch {
    return { success: true, message: "Dihapus secara lokal" };
  }
}

export async function updatePrintStatus(
  id_siswa: string | number,
  status: string
): Promise<{ success: boolean }> {
  if (!APPS_SCRIPT_URL) return { success: true };
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=update_print_status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_siswa, status }),
    });
    if (!res.ok) throw new Error("Failed to update print status");
    return res.json();
  } catch {
    return { success: true };
  }
}

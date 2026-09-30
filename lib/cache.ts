import type { Student, SchoolSetting } from "./types";

const KEY_STUDENTS = "ckp_students_cache";
const KEY_SCHOOL = "ckp_school_cache";
const KEY_PRINT_QUEUE = "ckp_print_queue_cache";

/**
 * Read cached students from localStorage (Client-only, SSR-safe)
 */
export function getCachedStudents(): Student[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_STUDENTS);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Save students to localStorage
 */
export function setCachedStudents(students: Student[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_STUDENTS, JSON.stringify(students));
  } catch {}
}

/**
 * Read cached school settings from localStorage
 */
export function getCachedSchool(): SchoolSetting | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_SCHOOL);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save school settings to localStorage
 */
export function setCachedSchool(school: SchoolSetting): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_SCHOOL, JSON.stringify(school));
  } catch {}
}

/**
 * Read cached print queue map ({ [id_siswa]: "READY" | "PRINTED" })
 */
export function getCachedPrintQueue(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_PRINT_QUEUE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save print queue map to localStorage
 */
export function setCachedPrintQueue(queue: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_PRINT_QUEUE, JSON.stringify(queue));
  } catch {}
}

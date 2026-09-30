import { NextRequest, NextResponse } from "next/server";
import { defaultStudents } from "@/lib/mock-data";
import type { Student, StudentFormData } from "@/lib/types";
import { fetchAppsScript } from "@/lib/apps-script";

export const dynamic = "force-dynamic";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

// In-memory store for fallback and cache
let serverStudents: Student[] = [...defaultStudents];
let lastStudentsFetch = 0;
const CACHE_TTL_MS = 25000; // 25s cache to ensure snappy UI navigation

function cleanStudent(s: Partial<Student>): Student {
  return {
    id: String(s.id || Math.random().toString(36).substring(2, 9)),
    nama: s.nama || "Tanpa Nama",
    ttl: s.ttl || "-",
    alamat: s.alamat || "-",
    nis: String(s.nis || "0000000000"),
    foto_url: s.foto_url && (s.foto_url.startsWith("http") || s.foto_url.startsWith("data:")) ? s.foto_url : "",
    kelas: s.kelas || "X",
    tahun: s.tahun ? String(s.tahun) : "2026/2027",
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const now = Date.now();

  // If fetching all students and cache is fresh, return immediately for instant response
  if (!id && now - lastStudentsFetch < CACHE_TTL_MS && serverStudents.length > 0) {
    return NextResponse.json(serverStudents);
  }

  if (!APPS_SCRIPT_URL) {
    if (id) {
      const found = serverStudents.find((s) => String(s.id) === String(id));
      return NextResponse.json(found || null);
    }
    return NextResponse.json(serverStudents);
  }

  try {
    const targetUrl = id
      ? `${APPS_SCRIPT_URL}?action=student&id=${encodeURIComponent(id)}`
      : `${APPS_SCRIPT_URL}?action=students`;

    const res = await fetchAppsScript(targetUrl);

    if (!res.ok) {
      throw new Error(`Apps Script returned status ${res.status}`);
    }

    const data = await res.json();

    if (id) {
      if (data && typeof data === "object") {
        return NextResponse.json(cleanStudent(data));
      }
      return NextResponse.json(null);
    }

    if (Array.isArray(data) && data.length > 0) {
      const cleaned = data.map(cleanStudent);
      serverStudents = cleaned;
      lastStudentsFetch = now;
      return NextResponse.json(cleaned);
    }

    return NextResponse.json(serverStudents);
  } catch (err) {
    console.warn("Falling back to server cache for students:", err);
    if (id) {
      const found = serverStudents.find((s) => String(s.id) === String(id));
      return NextResponse.json(found || null);
    }
    return NextResponse.json(serverStudents);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StudentFormData;

    const newStudent: Student = {
      ...body,
      id: String(Date.now()),
    };

    serverStudents = [newStudent, ...serverStudents];
    lastStudentsFetch = 0; // Invalidate cache

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json({
        success: true,
        message: "Siswa berhasil disimpan (lokal)",
        id: newStudent.id,
        data: newStudent,
      });
    }

    try {
      const res = await fetchAppsScript(`${APPS_SCRIPT_URL}?action=add_student`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Apps Script responded with ${res.status}`);
      }

      const result = await res.json();
      return NextResponse.json(result);
    } catch (appsScriptErr) {
      console.warn("Apps Script add_student error, saved locally:", appsScriptErr);
      return NextResponse.json({
        success: true,
        message: "Siswa disimpan secara lokal",
        id: newStudent.id,
        data: newStudent,
      });
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid payload or server error" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Student;

    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, message: "ID siswa diperlukan" },
        { status: 400 }
      );
    }

    serverStudents = serverStudents.map((s) =>
      String(s.id) === String(body.id) ? { ...s, ...body } : s
    );
    lastStudentsFetch = 0; // Invalidate cache

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json({
        success: true,
        message: "Data siswa berhasil diperbarui (lokal)",
        data: body,
      });
    }

    try {
      const res = await fetchAppsScript(`${APPS_SCRIPT_URL}?action=update_student`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Apps Script responded with ${res.status}`);
      }

      const result = await res.json();
      return NextResponse.json(result);
    } catch (appsScriptErr) {
      console.warn("Apps Script update_student error, updated locally:", appsScriptErr);
      return NextResponse.json({
        success: true,
        message: "Data diperbarui secara lokal",
        data: body,
      });
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Parameter id diperlukan" },
        { status: 400 }
      );
    }

    serverStudents = serverStudents.filter((s) => String(s.id) !== String(id));
    lastStudentsFetch = 0; // Invalidate cache

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json({
        success: true,
        message: "Siswa berhasil dihapus (lokal)",
      });
    }

    try {
      const res = await fetchAppsScript(`${APPS_SCRIPT_URL}?action=delete_student`, {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(`Apps Script responded with ${res.status}`);
      }

      const result = await res.json();
      return NextResponse.json(result);
    } catch (appsScriptErr) {
      console.warn("Apps Script delete_student error, deleted locally:", appsScriptErr);
      return NextResponse.json({
        success: true,
        message: "Siswa dihapus secara lokal",
      });
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


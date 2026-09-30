import { NextRequest, NextResponse } from "next/server";
import { defaultSchoolSetting } from "@/lib/mock-data";
import type { SchoolSetting } from "@/lib/types";
import { fetchAppsScript } from "@/lib/apps-script";

export const dynamic = "force-dynamic";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

// In-memory store for fallback and high-speed cache
let serverSchool: SchoolSetting = { ...defaultSchoolSetting };
let lastSchoolFetch = 0;
const CACHE_TTL_MS = 30000; // 30 seconds cache to eliminate Apps Script cold boot latency

export async function GET() {
  const now = Date.now();
  // Return cached school settings if fresh and school name is present
  if (now - lastSchoolFetch < CACHE_TTL_MS && serverSchool.nama_sekolah) {
    return NextResponse.json(serverSchool);
  }

  if (!APPS_SCRIPT_URL) {
    return NextResponse.json(serverSchool);
  }

  try {
    const res = await fetchAppsScript(`${APPS_SCRIPT_URL}?action=school`);

    if (!res.ok) {
      throw new Error(`Apps Script returned status ${res.status}`);
    }

    const data = await res.json();

    if (data && typeof data === "object") {
      const merged: SchoolSetting = {
        nama_sekolah: data.nama_sekolah || serverSchool.nama_sekolah,
        alamat: data.alamat || serverSchool.alamat,
        logo_url: data.logo_url && data.logo_url !== "cloudinary" ? data.logo_url : (serverSchool.logo_url || ""),
        slogan: data.slogan || serverSchool.slogan,
        warna_primary: data.warna_primary || serverSchool.warna_primary,
        warna_secondary: data.warna_secondary || serverSchool.warna_secondary,
        kepala_sekolah: data.kepala_sekolah || serverSchool.kepala_sekolah,
        ketentuan_belakang: data.ketentuan_belakang || serverSchool.ketentuan_belakang,
        teks_footer_depan: data.teks_footer_depan || serverSchool.teks_footer_depan,
        teks_footer_belakang: data.teks_footer_belakang || serverSchool.teks_footer_belakang,
        kota_terbit: data.kota_terbit || serverSchool.kota_terbit,
        watermark_opacity: data.watermark_opacity !== undefined ? Number(data.watermark_opacity) : serverSchool.watermark_opacity,
        show_watermark: data.show_watermark !== undefined ? Boolean(data.show_watermark) : serverSchool.show_watermark,
      };
      serverSchool = merged;
      lastSchoolFetch = now;
      return NextResponse.json(merged);
    }

    return NextResponse.json(serverSchool);
  } catch (err) {
    console.warn("Falling back to server cache for school settings:", err);
    return NextResponse.json(serverSchool);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SchoolSetting;

    serverSchool = { ...serverSchool, ...body };
    lastSchoolFetch = Date.now(); // Update cache

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json({
        success: true,
        message: "Pengaturan tersimpan secara lokal",
        data: serverSchool,
      });
    }

    try {
      const res = await fetchAppsScript(`${APPS_SCRIPT_URL}?action=update_school`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Apps Script responded with ${res.status}`);
      }

      const result = await res.json();
      return NextResponse.json(result);
    } catch (appsScriptErr) {
      console.warn("Apps Script update_school error, updated locally:", appsScriptErr);
      return NextResponse.json({
        success: true,
        message: "Pengaturan tersimpan secara lokal",
        data: serverSchool,
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
  return POST(request);
}

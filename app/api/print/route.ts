import { NextRequest, NextResponse } from "next/server";
import type { PrintJob } from "@/lib/types";
import { fetchAppsScript } from "@/lib/apps-script";

export const dynamic = "force-dynamic";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

let serverPrintQueue: PrintJob[] = [];

export async function GET() {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json(serverPrintQueue);
  }

  try {
    const res = await fetchAppsScript(`${APPS_SCRIPT_URL}?action=print`);

    if (!res.ok) throw new Error("Failed to fetch print queue");
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : serverPrintQueue);
  } catch (err) {
    console.warn("Print queue fallback:", err);
    return NextResponse.json(serverPrintQueue);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_siswa, status } = body;

    if (!id_siswa) {
      return NextResponse.json(
        { success: false, message: "id_siswa diperlukan" },
        { status: 400 }
      );
    }

    const existingIndex = serverPrintQueue.findIndex(
      (p) => String(p.id_siswa) === String(id_siswa)
    );

    if (existingIndex !== -1) {
      serverPrintQueue[existingIndex].status = status || "PRINTED";
    } else {
      serverPrintQueue.push({ id_siswa, status: status || "PRINTED" });
    }

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json({ success: true, message: "Status cetak diperbarui" });
    }

    try {
      const res = await fetchAppsScript(`${APPS_SCRIPT_URL}?action=update_print_status`, {
        method: "POST",
        body: JSON.stringify({ id_siswa, status }),
      });
      if (!res.ok) throw new Error("Failed to update status in Apps Script");
      return res.json();
    } catch {
      return NextResponse.json({ success: true, message: "Tersimpan secara lokal" });
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }
}

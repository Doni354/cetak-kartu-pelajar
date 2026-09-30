import { uploadImage, uploadLogo } from "@/lib/cloudinary";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "photo" or "logo"

    if (!file) {
      return Response.json(
        { success: false, message: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let url: string;

    if (type === "logo") {
      url = await uploadLogo(buffer);
    } else {
      url = await uploadImage(buffer);
    }

    return Response.json({
      success: true,
      url,
      message: "Upload berhasil",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { success: false, message: "Gagal mengupload file" },
      { status: 500 }
    );
  }
}

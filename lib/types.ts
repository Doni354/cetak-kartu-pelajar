// ========================
// Student Types
// ========================

export interface Student {
  id: string | number;
  nama: string;
  ttl: string;
  alamat: string;
  nis: string;
  foto_url: string;
  kelas: string;
  tahun: string;
}

export type StudentFormData = Omit<Student, "id">;

// ========================
// School Setting Types
// ========================

export interface SchoolSetting {
  nama_sekolah: string;
  alamat: string;
  logo_url: string;
  slogan: string;
  warna_primary: string;
  warna_secondary: string;
  kepala_sekolah: string;
  // Kustomisasi Kartu Tambahan
  ketentuan_belakang?: string;
  teks_footer_depan?: string;
  teks_footer_belakang?: string;
  kota_terbit?: string;
  watermark_opacity?: number;
  show_watermark?: boolean;
}

// ========================
// Print Queue Types
// ========================

export interface PrintJob {
  id_siswa: string | number;
  status: "READY" | "PRINTED" | "PENDING";
}

// ========================
// API Response Types
// ========================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// ========================
// Card Template Types
// ========================

export type CardTemplate = "portrait" | "landscape";

export interface CardData {
  student: Student;
  school: SchoolSetting;
  template: CardTemplate;
}

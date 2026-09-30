import type { Student, SchoolSetting } from "./types";

export const defaultKetentuanBelakang = `1. Kartu ini adalah tanda pengenal sah siswa di lingkungan sekolah.
2. Wajib dibawa setiap hari selama kegiatan belajar mengajar berlangsung.
3. Tidak diperkenankan dipinjamkan atau disalahgunakan oleh pihak lain.
4. Apabila kartu hilang atau rusak, segera melapor ke bagian Tata Usaha.
5. Bagi yang menemukan kartu ini, harap mengembalikan ke alamat sekolah.`;

export const defaultSchoolSetting: SchoolSetting = {
  nama_sekolah: "SMK NEGERI 1 CONTOH",
  alamat: "Jl. Pendidikan No. 123, Ketintang, Surabaya",
  logo_url: "",
  slogan: "Berkarakter, Unggul, dan Siap Kerja",
  warna_primary: "#003366",
  warna_secondary: "#0066cc",
  kepala_sekolah: "Drs. H. Bambang Sutrisno, M.Pd.",
  ketentuan_belakang: defaultKetentuanBelakang,
  teks_footer_depan: "BERLAKU SELAMA MENJADI SISWA",
  teks_footer_belakang: "KARTU TANDA PELAJAR RESMI",
  kota_terbit: "Surabaya",
  watermark_opacity: 0.08,
  show_watermark: true,
};

export const defaultStudents: Student[] = [
  {
    id: "1",
    nama: "Ahmad Rizki Pratama",
    ttl: "Surabaya, 12 Januari 2008",
    alamat: "Jl. Ketintang Baru No. 45, Surabaya",
    nis: "0087654321",
    foto_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    kelas: "X TKJ 1",
    tahun: "2026/2027",
  },
  {
    id: "2",
    nama: "Siti Nurhaliza Putri",
    ttl: "Sidoarjo, 25 Maret 2008",
    alamat: "Jl. Pahlawan No. 12, Sidoarjo",
    nis: "0087654322",
    foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    kelas: "X TKJ 1",
    tahun: "2026/2027",
  },
  {
    id: "3",
    nama: "Budi Santoso",
    ttl: "Malang, 08 Agustus 2007",
    alamat: "Jl. Ijen Boulevard No. 88, Malang",
    nis: "0087654323",
    foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    kelas: "XI RPL 2",
    tahun: "2026/2027",
  },
  {
    id: "4",
    nama: "Dewi Anggraini",
    ttl: "Surabaya, 17 November 2007",
    alamat: "Jl. Darmo Permai II No. 15, Surabaya",
    nis: "0087654324",
    foto_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    kelas: "XI MM 1",
    tahun: "2026/2027",
  },
  {
    id: "5",
    nama: "Muhammad Fajar Ramadhan",
    ttl: "Gresik, 03 Mei 2007",
    alamat: "Jl. Veteran No. 34, Gresik",
    nis: "0087654325",
    foto_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    kelas: "XI RPL 1",
    tahun: "2026/2027",
  },
  {
    id: "6",
    nama: "Anisa Rahmawati",
    ttl: "Mojokerto, 20 September 2008",
    alamat: "Jl. Gajah Mada No. 102, Mojokerto",
    nis: "0087654326",
    foto_url: "",
    kelas: "X MM 2",
    tahun: "2026/2027",
  },
];

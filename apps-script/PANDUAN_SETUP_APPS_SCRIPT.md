# 📋 Panduan Setup & Deploy Google Apps Script

Panduan lengkap untuk menghubungkan Google Spreadsheet sebagai database utama aplikasi **Cetak Kartu Pelajar**.

---

## 📌 Informasi Spreadsheet Anda
* **Spreadsheet ID**: `1hCq8PSGQX7nDpIiSvPB6NsUlD0N-yXc2saPUW87a6-E`
* **File Script**: [`apps-script/Code.gs`](file:///d:/Project/cetak-kartu-pelajar/apps-script/Code.gs)

---

## 🚀 Langkah 1: Buka Apps Script di Google Sheets

1. Buka Google Spreadsheet Anda di browser:
   👉 [Buka Google Spreadsheet](https://docs.google.com/spreadsheets/d/1hCq8PSGQX7nDpIiSvPB6NsUlD0N-yXc2saPUW87a6-E/edit)
2. Di menu atas, klik **Ekstensi (Extensions)** ➔ pilih **Apps Script**.
3. Tab baru editor Google Apps Script akan terbuka.

---

## 📝 Langkah 2: Salin Kode ke `Code.gs`

1. Di editor Apps Script, hapus semua kode bawaan di file `Code.gs`.
2. Buka file [Code.gs](file:///d:/Project/cetak-kartu-pelajar/apps-script/Code.gs) di project ini, lalu salin (**Copy**) seluruh isinya.
3. Tempel (**Paste**) ke editor Apps Script Google.
4. Klik tombol **Simpan (Ikon Disket / Ctrl + S)**.

---

## ⚡ Langkah 3: Inisialisasi Otomatis (Opsional / Sekali Saja)

Agar sheet `SISWA`, `SETTING_SEKOLAH`, dan `CETAK` langsung terbuat rapi beserta header dan contoh datanya:

1. Di menu atas editor Apps Script, cari dropdown fungsi (biasanya tertulis `myFunction` atau `doGet`).
2. Ubah pilihan dropdown ke: **`setupInitialData`**.
3. Klik tombol **Jalankan (Run)**.
4. Jika Google meminta izin akses (*Authorization required*):
   * Klik **Tinjau Izin (Review Permissions)**.
   * Pilih akun Google Anda.
   * Klik **Lanjutan (Advanced)** di pojok kiri bawah.
   * Klik **Buka Untitled project (tidak aman)**.
   * Klik **Izinkan (Allow)**.
5. Selesai! Buka kembali tab Spreadsheet Anda, 3 sheet (`SISWA`, `SETTING_SEKOLAH`, `CETAK`) akan otomatis terbuat dengan format yang indah dan rapi.

---

## 🌐 Langkah 4: Deploy sebagai Web App

Ini langkah paling penting agar Next.js dapat membaca dan menulis data:

1. Di pojok kanan atas editor Apps Script, klik tombol biru **Terapkan (Deploy)** ➔ pilih **Penerapan baru (New deployment)**.
2. Klik ikon gerigi ⚙️ di sebelah kiri (*Pilih jenis penerapan*) ➔ pilih **Aplikasi web (Web app)**.
3. Atur konfigurasi berikut:
   * **Deskripsi**: `API Cetak Kartu Pelajar v1`
   * **Jalankan sebagai (Execute as)**: **Saya (email Anda)**
   * **Yang memiliki akses (Who has access)**: **Siapa saja (Anyone)** ⚠️ *(Wajib "Anyone" agar API dapat diakses oleh aplikasi web)*
4. Klik tombol **Terapkan (Deploy)**.
5. Salin URL yang dihasilkan pada bagian **URL Aplikasi Web (Web app URL)**.
   Formatnya:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## 🔗 Langkah 5: Pasang URL ke `.env.local`

1. Buka file `.env.local` di root folder project Next.js.
2. Perbarui variabel `NEXT_PUBLIC_APPS_SCRIPT_URL` dengan URL baru yang Anda dapatkan:
   ```env
   NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
   ```
3. Simpan file `.env.local`.

---

## 🧪 Langkah 6: Pengujian API

Buka browser dan uji URL Anda:
* **Ambil semua siswa**:
  `https://script.google.com/macros/s/.../exec?action=students`
* **Ambil info sekolah**:
  `https://script.google.com/macros/s/.../exec?action=school`
* **Ambil antrian cetak**:
  `https://script.google.com/macros/s/.../exec?action=print`

Jika mengembalikan JSON siswa dan setting sekolah, integrasi telah **100% Berhasil**! 🎉

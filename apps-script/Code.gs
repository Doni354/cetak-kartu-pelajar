/**
 * =========================================================================
 * GOOGLE APPS SCRIPT API - APLIKASI CETAK KARTU PELAJAR
 * =========================================================================
 * 
 * Spreadsheet ID: 1hCq8PSGQX7nDpIiSvPB6NsUlD0N-yXc2saPUW87a6-E
 * Database Sheets:
 * 1. SISWA           : Data Identitas & Foto Siswa
 * 2. SETTING_SEKOLAH : Konfigurasi Kop, Logo, Warna & Kepala Sekolah
 * 3. CETAK           : Antrian Cetak Kartu Siswa
 * 
 * Petunjuk Deployment:
 * 1. Buka script.google.com atau Google Spreadsheet -> Extensions -> Apps Script
 * 2. Paste seluruh isi file ini ke Code.gs
 * 3. Klik "Deploy" -> "New deployment"
 * 4. Select type: "Web app"
 * 5. Configuration:
 *    - Description: "API Cetak Kartu Pelajar v1.0"
 *    - Execute as: "Me" (email Anda)
 *    - Who has access: "Anyone" (PENTING! Agar web Next.js dapat mengakses API)
 * 6. Klik "Deploy" dan salin URL Web App yang dihasilkan.
 * =========================================================================
 */

const SPREADSHEET_ID = "1hCq8PSGQX7nDpIiSvPB6NsUlD0N-yXc2saPUW87a6-E";

const SHEET_SISWA = "SISWA";
const SHEET_SETTING = "SETTING_SEKOLAH";
const SHEET_CETAK = "CETAK";

// =========================================================================
// HELPER: GET SPREADSHEET INSTANCE
// =========================================================================
function getSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      return SpreadsheetApp.openById(SPREADSHEET_ID);
    }
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

// =========================================================================
// HELPER: JSON RESPONSE BUILDER (CORS Safe)
// =========================================================================
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// GET REQUEST ROUTER
// =========================================================================
function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action ? e.parameter.action : "students";

    switch (action) {
      case "students":
        return jsonResponse(getStudents());

      case "student":
        const studentId = e.parameter.id;
        return jsonResponse(getStudent(studentId));

      case "school":
        return jsonResponse(getSchoolSetting());

      case "print":
        return jsonResponse(getPrintQueue());

      case "init":
        return jsonResponse(setupInitialData());

      default:
        return jsonResponse({
          success: false,
          message: "Action '" + action + "' tidak ditemukan.",
          available_actions: ["students", "student", "school", "print", "init"]
        });
    }
  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

// =========================================================================
// POST REQUEST ROUTER
// =========================================================================
function doPost(e) {
  try {
    let action = e && e.parameter && e.parameter.action ? e.parameter.action : "";
    let body = {};

    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
        if (!action && body.action) {
          action = body.action;
        }
      } catch (parseErr) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    switch (action) {
      case "add_student":
        return jsonResponse(addStudent(body));

      case "update_student":
        return jsonResponse(updateStudent(body));

      case "delete_student":
        return jsonResponse(deleteStudent(body.id || body.id_siswa));

      case "update_school":
        return jsonResponse(updateSchoolSetting(body));

      case "update_print_status":
        return jsonResponse(updatePrintStatus(body.id_siswa || body.id, body.status));

      default:
        return jsonResponse({
          success: false,
          message: "Action POST '" + action + "' tidak valid.",
          available_actions: ["add_student", "update_student", "delete_student", "update_school", "update_print_status"]
        });
    }
  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

// =========================================================================
// 1. DATA SISWA FUNCTIONS
// =========================================================================

/**
 * Mengambil semua data siswa dari sheet SISWA
 */
function getStudents() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SISWA);

  if (!sheet) {
    setupInitialData();
    sheet = ss.getSheetByName(SHEET_SISWA);
  }

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  // Header: id, nama, ttl, alamat, nis, foto_url, kelas, tahun
  const data = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

  const students = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    // Skip baris kosong
    if (!row[0] && !row[1] && !row[4]) continue;

    students.push({
      id: String(row[0] || (i + 1)),
      nama: String(row[1] || ""),
      ttl: String(row[2] || ""),
      alamat: String(row[3] || ""),
      nis: String(row[4] || ""),
      foto_url: String(row[5] || ""),
      kelas: String(row[6] || ""),
      tahun: String(row[7] || "2026/2027")
    });
  }

  return students;
}

/**
 * Mengambil satu siswa berdasarkan ID
 */
function getStudent(id) {
  if (!id) return null;
  const students = getStudents();
  const found = students.filter(function(s) {
    return String(s.id) === String(id);
  });
  return found.length > 0 ? found[0] : null;
}

/**
 * Menambahkan siswa baru
 */
function addStudent(studentData) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SISWA);
  if (!sheet) {
    setupInitialData();
    sheet = ss.getSheetByName(SHEET_SISWA);
  }

  // Buat ID baru (Timestamp)
  const newId = String(Date.now());
  const nama = studentData.nama || "";
  const ttl = studentData.ttl || "";
  const alamat = studentData.alamat || "";
  const nis = String(studentData.nis || "");
  const foto_url = studentData.foto_url || "";
  const kelas = studentData.kelas || "X";
  const tahun = String(studentData.tahun || "2026/2027");

  sheet.appendRow([newId, nama, ttl, alamat, nis, foto_url, kelas, tahun]);

  return {
    success: true,
    message: "Siswa berhasil ditambahkan",
    id: newId,
    data: {
      id: newId,
      nama: nama,
      ttl: ttl,
      alamat: alamat,
      nis: nis,
      foto_url: foto_url,
      kelas: kelas,
      tahun: tahun
    }
  };
}

/**
 * Memperbarui data siswa
 */
function updateStudent(studentData) {
  if (!studentData || !studentData.id) {
    return { success: false, message: "ID siswa wajib disertakan" };
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SISWA);
  if (!sheet) {
    return { success: false, message: "Sheet SISWA tidak ditemukan" };
  }

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { success: false, message: "Data siswa masih kosong" };
  }

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  let targetRow = -1;

  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(studentData.id)) {
      targetRow = i + 2; // baris ke- (1-indexed, baris 1 adalah header)
      break;
    }
  }

  if (targetRow === -1) {
    return { success: false, message: "Siswa dengan ID " + studentData.id + " tidak ditemukan" };
  }

  // Update nilai kolom: id, nama, ttl, alamat, nis, foto_url, kelas, tahun
  sheet.getRange(targetRow, 2).setValue(studentData.nama || "");
  sheet.getRange(targetRow, 3).setValue(studentData.ttl || "");
  sheet.getRange(targetRow, 4).setValue(studentData.alamat || "");
  sheet.getRange(targetRow, 5).setValue(String(studentData.nis || ""));
  if (studentData.foto_url !== undefined) {
    sheet.getRange(targetRow, 6).setValue(studentData.foto_url);
  }
  sheet.getRange(targetRow, 7).setValue(studentData.kelas || "");
  sheet.getRange(targetRow, 8).setValue(String(studentData.tahun || "2026/2027"));

  return {
    success: true,
    message: "Data siswa berhasil diperbarui",
    id: studentData.id
  };
}

/**
 * Menghapus siswa berdasarkan ID
 */
function deleteStudent(id) {
  if (!id) {
    return { success: false, message: "ID siswa wajib disertakan" };
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SISWA);
  if (!sheet) {
    return { success: false, message: "Sheet SISWA tidak ditemukan" };
  }

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { success: false, message: "Data siswa kosong" };
  }

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      sheet.deleteRow(i + 2);
      return { success: true, message: "Siswa berhasil dihapus" };
    }
  }

  return { success: false, message: "Siswa tidak ditemukan" };
}

// =========================================================================
// 2. SETTING SEKOLAH FUNCTIONS
// =========================================================================

/**
 * Mengambil setting sekolah dari sheet SETTING_SEKOLAH (Key-Value format)
 */
function getSchoolSetting() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SETTING);

  if (!sheet) {
    setupInitialData();
    sheet = ss.getSheetByName(SHEET_SETTING);
  }

  const lastRow = sheet.getLastRow();
  const defaultSetting = {
    nama_sekolah: "SMK NEGERI 1 CONTOH",
    alamat: "Jl. Pendidikan No. 123, Ketintang, Surabaya",
    logo_url: "",
    slogan: "Berkarakter, Unggul, dan Siap Kerja",
    warna_primary: "#003366",
    warna_secondary: "#0066cc",
    kepala_sekolah: "Drs. H. Bambang Sutrisno, M.Pd.",
    tahun_ajaran: "2026/2027"
  };

  if (lastRow <= 1) {
    return defaultSetting;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  const settings = {};

  for (let i = 0; i < data.length; i++) {
    const key = String(data[i][0]).trim();
    const val = String(data[i][1]).trim();
    if (key) {
      settings[key] = val;
    }
  }

  // Merge dengan default jika ada field kosong
  return {
    nama_sekolah: settings.nama_sekolah || defaultSetting.nama_sekolah,
    alamat: settings.alamat || defaultSetting.alamat,
    logo_url: settings.logo_url || "",
    slogan: settings.slogan || defaultSetting.slogan,
    warna_primary: settings.warna_primary || defaultSetting.warna_primary,
    warna_secondary: settings.warna_secondary || defaultSetting.warna_secondary,
    kepala_sekolah: settings.kepala_sekolah || defaultSetting.kepala_sekolah,
    tahun_ajaran: settings.tahun_ajaran || defaultSetting.tahun_ajaran
  };
}

/**
 * Memperbarui setting sekolah
 */
function updateSchoolSetting(newSettings) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SETTING);
  if (!sheet) {
    setupInitialData();
    sheet = ss.getSheetByName(SHEET_SETTING);
  }

  const keys = [
    "nama_sekolah",
    "alamat",
    "logo_url",
    "slogan",
    "warna_primary",
    "warna_secondary",
    "kepala_sekolah",
    "tahun_ajaran"
  ];

  const lastRow = sheet.getLastRow();
  let existingKeys = {};

  if (lastRow > 1) {
    const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < data.length; i++) {
      existingKeys[String(data[i][0]).trim()] = i + 2;
    }
  }

  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    if (newSettings[key] !== undefined) {
      if (existingKeys[key]) {
        sheet.getRange(existingKeys[key], 2).setValue(newSettings[key]);
      } else {
        sheet.appendRow([key, newSettings[key]]);
      }
    }
  }

  return {
    success: true,
    message: "Pengaturan sekolah berhasil disimpan"
  };
}

// =========================================================================
// 3. CETAK QUEUE FUNCTIONS
// =========================================================================

/**
 * Mengambil daftar antrian cetak
 */
function getPrintQueue() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_CETAK);
  if (!sheet) {
    return [];
  }

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  const queue = [];

  for (let i = 0; i < data.length; i++) {
    if (!data[i][0]) continue;
    queue.push({
      id_siswa: String(data[i][0]),
      status: String(data[i][1] || "READY")
    });
  }

  return queue;
}

/**
 * Memperbarui status cetak siswa
 */
function updatePrintStatus(id_siswa, status) {
  if (!id_siswa) return { success: false, message: "id_siswa diperlukan" };

  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_CETAK);
  if (!sheet) {
    setupInitialData();
    sheet = ss.getSheetByName(SHEET_CETAK);
  }

  const lastRow = sheet.getLastRow();
  let targetRow = -1;

  if (lastRow > 1) {
    const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][0]) === String(id_siswa)) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (targetRow !== -1) {
    sheet.getRange(targetRow, 2).setValue(status || "PRINTED");
  } else {
    sheet.appendRow([String(id_siswa), status || "PRINTED"]);
  }

  return { success: true, message: "Status cetak berhasil diperbarui" };
}

// =========================================================================
// 4. SETUP INITIAL DATA (Jalankan sekali jika sheet masih kosong)
// =========================================================================
function setupInitialData() {
  const ss = getSpreadsheet();

  // 1. Sheet SISWA
  let sheetSiswa = ss.getSheetByName(SHEET_SISWA);
  if (!sheetSiswa) {
    sheetSiswa = ss.insertSheet(SHEET_SISWA);
  }
  if (sheetSiswa.getLastRow() === 0) {
    sheetSiswa.appendRow(["id", "nama", "ttl", "alamat", "nis", "foto_url", "kelas", "tahun"]);
    sheetSiswa.getRange("A1:H1").setFontWeight("bold").setBackground("#003366").setFontColor("#ffffff");

    // Sample data siswa
    sheetSiswa.appendRow([
      "1",
      "Ahmad Rizki Pratama",
      "Surabaya, 12 Januari 2008",
      "Jl. Ketintang Baru No. 45, Surabaya",
      "0087654321",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
      "X TKJ 1",
      "2026/2027"
    ]);
    sheetSiswa.appendRow([
      "2",
      "Siti Nurhaliza Putri",
      "Sidoarjo, 25 Maret 2008",
      "Jl. Pahlawan No. 12, Sidoarjo",
      "0087654322",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      "X TKJ 1",
      "2026/2027"
    ]);
  }

  // 2. Sheet SETTING_SEKOLAH
  let sheetSetting = ss.getSheetByName(SHEET_SETTING);
  if (!sheetSetting) {
    sheetSetting = ss.insertSheet(SHEET_SETTING);
  }
  if (sheetSetting.getLastRow() === 0) {
    sheetSetting.appendRow(["key", "value"]);
    sheetSetting.getRange("A1:B1").setFontWeight("bold").setBackground("#003366").setFontColor("#ffffff");

    const defaultPairs = [
      ["nama_sekolah", "SMK NEGERI 1 CONTOH"],
      ["alamat", "Jl. Pendidikan No. 123, Ketintang, Surabaya"],
      ["logo_url", ""],
      ["slogan", "Berkarakter, Unggul, dan Siap Kerja"],
      ["warna_primary", "#003366"],
      ["warna_secondary", "#0066cc"],
      ["kepala_sekolah", "Drs. H. Bambang Sutrisno, M.Pd."],
      ["tahun_ajaran", "2026/2027"]
    ];

    for (let i = 0; i < defaultPairs.length; i++) {
      sheetSetting.appendRow(defaultPairs[i]);
    }
  }

  // 3. Sheet CETAK
  let sheetCetak = ss.getSheetByName(SHEET_CETAK);
  if (!sheetCetak) {
    sheetCetak = ss.insertSheet(SHEET_CETAK);
  }
  if (sheetCetak.getLastRow() === 0) {
    sheetCetak.appendRow(["id_siswa", "status"]);
    sheetCetak.getRange("A1:B1").setFontWeight("bold").setBackground("#003366").setFontColor("#ffffff");
    sheetCetak.appendRow(["1", "READY"]);
  }

  return {
    success: true,
    message: "Setup sheet SISWA, SETTING_SEKOLAH, dan CETAK berhasil diinisialisasi!"
  };
}

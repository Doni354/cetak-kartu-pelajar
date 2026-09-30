# Project Blueprint
# Aplikasi Cetak Kartu Pelajar

Version:
1.0 MVP


---

# 1. Project Overview

Aplikasi web untuk membantu sekolah membuat dan mencetak kartu pelajar secara cepat.

Admin sekolah dapat:

- Mengelola data siswa
- Mengupload foto siswa
- Melihat preview kartu pelajar
- Memilih template kartu
- Mencetak kartu pada kertas A4


Aplikasi dibuat untuk penggunaan internal sekolah.

Tidak membutuhkan sistem kompleks.


---

# 2. Main Goal

Membuat generator kartu pelajar dengan:

- Database Google Spreadsheet
- Image storage Cloudinary
- Framework Next.js Fullstack
- Deployment menggunakan Vercel


Fokus utama:

- Desain kartu pelajar
- Presisi ukuran cetak
- Kemudahan penggunaan operator sekolah


---

# 3. Technology Stack


## Frontend

Framework:

- Next.js
- TypeScript
- Tailwind CSS


UI:

- shadcn/ui


## Backend

Menggunakan:

- Next.js Route Handlers

Tidak menggunakan Express.


## Database

Google Spreadsheet API


Google Sheet menjadi source of truth.


## Storage

Cloudinary


Digunakan untuk:

- Foto siswa
- Logo sekolah


## Deployment

Vercel


---

# 4. Application Architecture


```
User Browser

      |
      |

Next.js Application

      |
      |
 ---------------------
 |                   |
API Routes       UI Components

      |
      |

Google Spreadsheet API

      |
      |

Google Sheet



Image Upload:

Browser

 |
 |

Cloudinary

 |
 |

Image URL

 |
 |

Google Sheet
```


---

# 5. Project Structure


```
student-card-generator/


app/

 ├ page.tsx

 ├ login/

 ├ dashboard/

 ├ siswa/

 ├ preview/

 └ pengaturan/


app/api/

 ├ auth/

 ├ students/

 ├ school/

 └ upload/


components/

 ├ layout/

 ├ sidebar/

 ├ table/

 └ cards/


templates/

 ├ PortraitCard.tsx

 └ LandscapeCard.tsx


lib/

 ├ google-sheet.ts

 ├ cloudinary.ts

 └ auth.ts


public/


.env


```


---

# 6. Database Design


Database menggunakan Google Spreadsheet.


## Sheet: SISWA


Columns:


| Field | Description |
|---|---|
| id | unique id siswa |
| nama | nama siswa |
| ttl | tempat tanggal lahir |
| alamat | alamat siswa |
| nis | nomor induk siswa |
| foto_url | URL foto Cloudinary |
| kelas | kelas siswa |
| tahun | tahun ajaran |



Example:


|id|nama|ttl|alamat|nis|foto_url|kelas|tahun|
|-|-|-|-|-|-|-|-|
|001|Ahmad Rizki|12 Januari 2008|Surabaya|0087654321|url|X-A|2026|



---

## Sheet: SETTING_SEKOLAH


Columns:


| key | value |
|-|-|
|nama_sekolah|SMK Negeri 1 Contoh|
|alamat|Jl Pendidikan No 123|
|logo_url|cloudinary url|
|slogan|Berkarakter Kompeten Siap Bersaing|
|warna_primary|#003366|
|warna_secondary|#0066cc|
|kepala_sekolah|Nama Kepala Sekolah|



---

## Sheet: CETAK


Digunakan untuk menentukan siswa yang akan dicetak.


|id_siswa|status|
|-|-|
|001|READY|



---

# 7. Authentication


Authentication sederhana.


Tidak menggunakan Firebase Auth.


Menggunakan:

Environment Variable:


```
ADMIN_USERNAME=
ADMIN_PASSWORD=
```


Flow:


```
Login

 |

Verify Credential

 |

Create Session Cookie

 |

Dashboard
```


---

# 8. Main Features


## Dashboard


Menampilkan:


- Total siswa
- Informasi sekolah
- Quick action


Menu:


```
Dashboard

Data Siswa

Pengaturan

Preview

Cetak
```



---

# 9. Student Management


Admin dapat:


- Melihat daftar siswa
- Search siswa
- Tambah siswa
- Edit siswa
- Upload foto
- Menghapus siswa


---

# 10. Image Upload Flow


```
Admin upload foto

        |

Next.js API

        |

Cloudinary

        |

Return Image URL

        |

Save URL to Google Sheet
```



---

# 11. Card Design


Ukuran kartu:


Standard KTP:


```
85.60 mm x 53.98 mm
```



Support dua template.


---

# 12. Portrait Card Template


Component:


```
PortraitCard.tsx
```


Layout:


```
+----------------------+
| LOGO SEKOLAH         |
| NAMA SEKOLAH         |
| ALAMAT               |
| SLOGAN               |
|----------------------|
|                      |
|        FOTO          |
|                      |
| Nama                 |
| TTL                  |
| Alamat               |
| NIS                  |
|                      |
| Barcode              |
|                      |
| KARTU PELAJAR        |
+----------------------+
```


Style:


- Header warna sekolah
- Rounded corner
- Wave background
- Foto siswa
- Data siswa
- Barcode


---

# 13. Landscape Card Template


Component:


```
LandscapeCard.tsx
```


Layout:


```
+--------------------------------+

 LOGO   NAMA SEKOLAH


 [ FOTO ]


 Nama :

 TTL  :

 Alamat :

 NIS :


 Barcode


              KARTU PELAJAR


+--------------------------------+
```



---

# 14. Printing System


Menggunakan browser print.


Tidak menggunakan server PDF generation.


Ukuran menggunakan CSS mm.


Example:


```css
.card {

width:85.60mm;

height:53.98mm;

}

```


Output:


Paper:

```
A4
```


Support:

- Multiple cards per halaman
- Print preview
- Direct printing


---

# 15. API Routes


## Authentication


POST


```
/api/auth/login
```


## Students


GET


```
/api/students
```


POST


```
/api/students
```


PUT


```
/api/students
```


## School Setting


GET


```
/api/school
```


## Upload


POST


```
/api/upload
```



---

# 16. Environment Variables


```
ADMIN_USERNAME=

ADMIN_PASSWORD=


GOOGLE_SPREADSHEET_ID=

GOOGLE_CLIENT_EMAIL=

GOOGLE_PRIVATE_KEY=


CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

```



---

# 17. UI Reference


Dashboard style:


- Clean
- Modern
- Simple
- School administration theme


Color:

Primary:

Navy Blue


Secondary:

Blue


Card design mengikuti referensi:

- Header sekolah
- Logo
- Foto siswa
- Informasi siswa
- Barcode
- Footer kartu pelajar



---

# 18. Development Rules


IMPORTANT:


- Keep components modular
- Do not hardcode school data
- All school information comes from Google Sheet
- Card template must be reusable
- Card size must use real KTP dimension
- Avoid unnecessary complexity
- Prioritize print accuracy


---

# 19. Development Roadmap


## Phase 1

Project setup:

- Initialize Next.js
- Setup Tailwind
- Setup environment


## Phase 2

Integration:

- Google Sheet API
- Cloudinary upload


## Phase 3

Dashboard:

- Layout
- Navigation
- Student table


## Phase 4

Card Generator:

- Portrait template
- Landscape template
- Preview


## Phase 5

Printing:

- A4 layout
- Print optimization


## Phase 6

Deployment:

- GitHub
- Vercel


---

# End of Blueprint
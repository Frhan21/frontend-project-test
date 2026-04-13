# Frontend Test Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query">
  <img src="https://img.shields.io/badge/TanStack_Table-8-FF4154?style=for-the-badge&logo=tablecheck&logoColor=white" alt="TanStack Table">
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</p>

<p align="center">
  Frontend dashboard untuk manajemen penghuni, kategori, rumah, hunian, iuran, dan pengeluaran.
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,typescript,vite,tailwind,github" alt="Tech Stack">
</p>

## Ringkasan

Project ini adalah aplikasi frontend berbasis React + TypeScript yang digunakan untuk:

- autentikasi user dengan halaman `login` dan `register`
- memisahkan `public route` dan `protected route`
- menampilkan dashboard ringkasan data
- mengelola data `residents`, `categories`, `houses`, `housing`, `fees`, dan `outcomes`
- upload gambar KTP untuk resident sebelum data resident dibuat

Halaman `payments` sudah tersedia pada navigasi, tetapi integrasi API-nya memang belum diaktifkan karena policy backend berbeda.

## Fitur Utama

- Login dan register terhubung ke API backend
- Session auth disimpan di `localStorage`
- Axios interceptor otomatis menambahkan `Bearer token`
- Route guard untuk memisahkan area publik dan area internal
- Dashboard utama dengan summary card
- CRUD data untuk:
  - Residents
  - Categories
  - Houses
  - Housing
  - Fees
  - Outcomes
- Tabel data menggunakan `@tanstack/react-table`
- Form menggunakan `react-hook-form`
- Validasi form resident menggunakan `zod`
- Upload file KTP dan otomatis mengisi field `ktp_image`
- Toast notification dengan `sonner`

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- TanStack Table
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui components

## Instalasi

### 1. Clone repository

```bash
git clone <url-repository-frontend>
cd frontend-test
```

### 2. Install dependency

Project ini memakai `pnpm`.

```bash
pnpm install
```

Kalau `pnpm` belum tersedia:

```bash
npm install -g pnpm
```

### 3. Pastikan backend berjalan

Frontend ini mengarah ke base URL berikut:

```ts
http://127.0.0.1:8000/api
```

Lokasinya ada di file [src/lib/axios.ts](src/lib/axios.ts).

Jadi sebelum menjalankan frontend, backend Laravel/API harus aktif di:

```bash
http://127.0.0.1:8000
```

### 4. Jalankan project

```bash
pnpm dev
```

Secara default Vite akan membuka aplikasi di:

```bash
http://localhost:3000
```

### 5. Build production

```bash
pnpm build
```

### 6. Preview hasil build

```bash
pnpm preview
```

## Cara Menggunakan Sistem

### 1. Login atau register

- buka halaman `/login`
- masukkan email dan password
- jika belum punya akun, buka `/register`
- setelah berhasil login, user akan diarahkan ke `/dashboard`

### 2. Gunakan sidebar

Setelah login, sidebar akan menampilkan menu:

- Dashboard
- Residents
- Categories
- Houses
- Housing
- Fees
- Outcomes
- Payments

### 3. Kelola data

Masing-masing halaman data sudah disiapkan agar bisa:

- menampilkan list data
- menambah data baru
- mengubah data
- menghapus data

### 4. Logout

Klik tombol `Logout` di sidebar untuk menghapus session dan token lokal.

## Alur Auth

Sistem auth pada project ini bekerja seperti berikut:

1. User login atau register dari form frontend.
2. Backend mengembalikan data user dan token.
3. Token disimpan ke `localStorage` dengan key `token`.
4. Session user disimpan ke `localStorage`.
5. Axios interceptor otomatis mengirim `Authorization: Bearer <token>` untuk request berikutnya.
6. Jika backend membalas `401` atau `403`, session lokal akan dibersihkan otomatis.

Provider auth utama ada di [src/providers/session-provider.tsx](src/providers/session-provider.tsx).

## Route Aplikasi

### Public route

- `/login`
- `/register`

### Protected route

- `/dashboard`
- `/dashboard/penghuni`
- `/dashboard/penghuni/create`
- `/dashboard/categories`
- `/dashboard/houses`
- `/dashboard/housing`
- `/dashboard/fees`
- `/dashboard/outcomes`
- `/dashboard/payments`

Routing utama ada di [src/utils/router.ts](src/utils/router.ts).

## Contoh Penggunaan

### Contoh login

Gunakan akun yang sudah terdaftar di backend, lalu login dari halaman:

```txt
/login
```

Contoh payload login:

```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

### Contoh register

Contoh payload register:

```json
{
  "name": "Admin Perumahan",
  "email": "admin@example.com",
  "password": "secret123",
  "confirmation_password": "secret123"
}
```

### Contoh create resident

Contoh payload resident yang dikirim setelah upload KTP sukses:

```json
{
  "name": "Budi Santoso",
  "ktp_image": "https://res.cloudinary.com/example/image/upload/v1/residents-ktp/sample.jpg",
  "status": "tetap",
  "no_telp": "081234567890",
  "is_married": false
}
```

### Contoh alur upload KTP

Alur upload pada form resident:

1. User memilih file gambar KTP.
2. Frontend mengirim file ke endpoint upload.
3. Backend mengembalikan response seperti:

```json
{
  "public_id": "residents-ktp/vfxi0fxeogcv1nldxxd4",
  "url": "https://res.cloudinary.com/dwmovi4tu/image/upload/v1776018605/residents-ktp/vfxi0fxeogcv1nldxxd4.jpg",
  "original_filename": "bg zoom dot",
  "width": 1920,
  "height": 1080,
  "format": "jpg"
}
```

4. Nilai `url` otomatis disimpan ke field `ktp_image`.
5. Saat form resident disubmit, field `ktp_image` ikut terkirim ke endpoint create resident.

## Struktur Folder Singkat

```txt
src/
  api/            fungsi request API
  components/     layout, pages, dan UI components
  hooks/          custom hooks query dan mutation
  lib/            konfigurasi axios dan helper umum
  providers/      query provider dan session provider
  types/          reusable interface response API
  utils/          router dan util lain
  validations/    schema validasi form
```

## Modul yang Tersedia

### Residents

- list resident
- create resident
- upload KTP image
- validasi form dengan Zod

### Categories

- list category
- create category
- update category
- delete category

### Houses

- list house
- create house
- update house
- delete house

### Housing

- list hunian
- create hunian
- update hunian
- delete hunian

### Fees

- list iuran
- create iuran
- update iuran
- delete iuran

### Outcomes

- list pengeluaran
- create pengeluaran
- update pengeluaran
- delete pengeluaran

### Payments

- halaman sudah tersedia
- integrasi API belum diaktifkan

## Catatan Pengembangan

- Base API masih di-hardcode pada [src/lib/axios.ts](src/lib/axios.ts)
- Jika domain backend berubah, update `baseURL` pada file tersebut
- Session user dan token saat ini disimpan di browser `localStorage`

## Script yang Tersedia

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

## Rekomendasi Pengembangan Selanjutnya

- pindahkan `baseURL` ke environment variable
- tambahkan pagination berbasis API di semua tabel
- tambahkan search dan filter data
- tambahkan halaman detail/edit terpisah bila dibutuhkan
- aktifkan integrasi API payments bila policy backend sudah siap

## Kontributor

Silakan gunakan repository ini sebagai dasar pengembangan dashboard internal atau technical test frontend.

Jika ingin menambahkan modul baru, pola yang sudah tersedia bisa diikuti dari folder:

- `src/api`
- `src/hooks`
- `src/components/pages`


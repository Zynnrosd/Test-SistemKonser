# 🎟️ ConcertHub - Sistem Manajemen & Ticketing Konser

![ConcertHub Preview](https://via.placeholder.com/1200x600/0f172a/ffffff?text=ConcertHub+Ticketing+System)

## 📌 Tentang Proyek
**ConcertHub** adalah aplikasi web modern berbasis *Role-Based* (Admin & User) yang dirancang untuk mengelola pendataan konser dan transaksi pemesanan tiket secara *real-time*. Proyek ini dikembangkan sebagai **Tugas Akhir Praktikum Sistem Basis Data**.

Aplikasi ini mendemonstrasikan implementasi CRUD (*Create, Read, Update, Delete*), relasi antar tabel, manajemen *state* pada *frontend*, serta penggunaan *Row Level Security* (RLS) untuk keamanan akses data.

---

## 👥 Tim Pengembang
**Kelompok 14** (Gabungan Kelompok 34 & Kelompok 40)
Program Studi Teknik Komputer - Universitas Diponegoro

*   **M. Azyan Naufan Rosada** (NIM: 21120123140146)
*   **MUHAMMAD RIZA SAPUTRA** (NIM: 21120123140117)
*   **ABDULLAH FATIH AZZAM** (NIM: 21120123140118)
*   **RIFAT GIBRAN WIDIYANTO** (NIM: 21120123140179)
*   **HIZKIA YOSEFHA WETRAWATRI SANJAYA** (NIM: 21120124130091)
*   **RIO HOTASY PARULIAN SIMANJUNTAK** (NIM: 21120124140144)
*   **ALIYA UMU KHOLISOH** (NIM: 21120124120003)
*   **RADHINE MUHAMMAD ROSSIE** (NIM: 21120124120017)
---

## ✨ Fitur Utama

### 👤 Customer (User) Portal
*   **Katalog Konser:** Melihat daftar konser yang tersedia beserta detail jadwal, lokasi, dan harga.
*   **Sistem Pemesanan (*Booking*):** Memesan tiket dengan pengecekan ketersediaan kursi secara *real-time* untuk mencegah *overbooking*.
*   **Kalkulasi Harga Dinamis:** Menghitung total harga berdasarkan kategori kursi (Reguler, VIP, VVIP) dan tambahan pajak (5%).
*   **Optimistic UI:** Sinkronisasi status sisa kursi seketika pada antarmuka *user* tanpa *delay* pemuatan halaman.
*   **Manajemen Tiket:** Melihat histori dan status tiket yang telah dipesan.

### 👑 Administrator Dashboard
*   **CRUD Konser:** Mengelola seluruh data konser (Tambah, Edit, Hapus Permanen, dan Arsip/Hapus Sementara).
*   **Auto-Status Sync:** Otomatis mengubah status konser menjadi "Sold Out" saat kapasitas kursi habis, dan kembali "Active" jika kapasitas ditambah.
*   **Monitoring Transaksi:** Memantau semua tiket yang masuk ke sistem *database*.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini menggunakan arsitektur pemisahan antara antarmuka pengguna (*Frontend*) dan basis data (*Backend-as-a-Service*):

*   **Bahasa Pemrograman:** TypeScript
*   **Frontend Framework:** React (Vite)
*   **Styling & Animasi:** Tailwind CSS, Framer Motion, Lucide Icons
*   **Database & Auth:** Supabase (PostgreSQL)
*   **Manajemen RLS:** Supabase Row Level Security untuk proteksi *update* sisa kursi pada tabel publik.

---

## 🚀 Cara Menjalankan Proyek (Lokal)

1. **Clone repository ini**
   
```bash
   git clone [https://github.com/username-kamu/concerthub.git](https://github.com/username-kamu/concerthub.git)
   cd concerthub
# PROMPT FRONTEND: Aplikasi Budaya Indonesia
## Project Context & Existing State

**PROJECT SUDAH ADA DAN BERJALAN.**

Aplikasi saat ini sudah memiliki:
- ✅ Halaman Chat yang sudah berfungsi
- ✅ Sidebar yang sudah ada strukturnya
- ✅ Topbar dengan logo, profil, dan ikon settings global
- ✅ Layout dasar (Topbar + Sidebar + Main Content)
- ✅ Sistem navigasi antar halaman

**YANG AKAN DIKERJAKAN:**
Melakukan update pada Sidebar Chat dan menambahkan implementasi UI lengkap untuk 3 halaman baru (Library, Culture, Creative) dengan mock data dan state handling.

---

## 🎯 TUJUAN UTAMA

Implementasi **FRONTEND-ONLY** untuk:
1. **Update Sidebar Chat** - mengganti isi sidebar, menghapus Settings dari sidebar
2. **Library** - sistem manajemen file dengan preview
3. **Culture** - analisis budaya Indonesia dengan hasil visual
4. **Creative** - suite tools untuk membuat konten (image/video/audio)

**SANGAT PENTING:**
- Ini adalah tugas **UI/UX only** - TIDAK ADA backend, API, atau endpoint
- Gunakan **mock data statis** untuk semua konten
- Sediakan **state visual** untuk: loading, empty, success, error
- Semua teks UI dalam **Bahasa Indonesia**

---

## 🎨 DESIGN SYSTEM & VISUAL LANGUAGE

### Warna & Tema
**Tema Utama: Emas Budaya Indonesia**

- **Warna Primer:** Emas hangat (#C9A04F) untuk aksen, highlight, dan elemen interaktif
- **Background:** Hitam atau abu gelap (#0A0A0A, #1A1A1A) untuk latar utama
- **Background Cards:** Abu sedang (#2A2A2A, #333333) untuk cards dan panels
- **Text Primer:** Putih (#FFFFFF) atau krem (#F5F5DC) untuk teks utama
- **Text Sekunder:** Abu terang (#A0A0A0) untuk meta info dan teks pendukung
- **Aksen:** Gunakan emas untuk hover states, active states, borders elemen aktif

### Tipografi
- **UI Elements (buttons, labels, menu):** Gunakan font sans-serif yang clean
- **Headings & Titles:** Sans-serif bold atau medium weight
- **Long-form Content (Culture stories):** Serif ringan untuk body text (opsional, hanya untuk artikel panjang)
- **Ukuran minimal untuk body text:** 14px agar mudah dibaca

### Spacing & Layout
- **Corner Radius:** Moderat (8px untuk cards, 4-6px untuk buttons)
- **Padding cards:** 16-24px untuk desktop, 12-16px untuk mobile
- **Gap antar elements:** 8px (tight), 16px (normal), 24px (loose)
- **Touch targets (mobile):** Minimal 44×44 px untuk semua tombol interaktif
- **Whitespace:** Gunakan ruang lega - jangan terlalu padat

### Micro-animations
Semua transisi dan animasi gunakan durasi **120-240ms** dengan easing smooth:
- Fade in/out untuk muncul/hilang element
- Slide untuk sidebar, modals, drawers
- Scale subtle (1.0 → 1.02) untuk hover buttons
- Color transition untuk hover states

### Elevation & Shadows
- **Low elevation:** Subtle shadow untuk cards di atas background
- **Medium elevation:** Modals, dropdowns, tooltips
- **High elevation:** Alerts, confirmation dialogs

---

## 📐 LAYOUT STRUCTURE (KONSISTEN DI SEMUA HALAMAN)

Setiap halaman HARUS memiliki struktur ini:

```
┌─────────────────────────────────────────────────────┐
│ TOPBAR (Fixed Top)                                  │
│ [Logo]              [Search?]    [Profile] [⚙️]     │
└─────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────┐
│          │                                          │
│ SIDEBAR  │    MAIN CONTENT AREA                     │
│ (Fixed)  │                                          │
│          │    (Scrollable)                          │
│          │                                          │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Topbar (Tidak Berubah)
**Posisi:** Fixed di atas, tinggi ~60px
**Isi:**
- Kiri: Logo aplikasi (clickable, kembali ke home)
- Tengah: Search bar global (opsional per halaman)
- Kanan: 
  - Icon notifikasi (opsional)
  - Profile avatar (clickable → dropdown)
  - Icon settings ⚙️ (clickable → modal settings global)

**Catatan:** Settings global HANYA ada di Topbar/Profile. TIDAK ADA settings di Sidebar Chat.

### Sidebar (Konten Berubah Sesuai Section)
**Posisi:** Fixed di kiri, lebar ~240-280px (desktop), collapsible di mobile
**Behavior:**
- Isi sidebar **berganti sesuai section aktif** (Chat / Library / Culture / Creative)
- Item aktif: highlight emas + border kiri 3px emas
- Item hover: background abu lebih terang + tooltip muncul
- Animasi transisi saat ganti section: fade + slide 180ms

### Main Content Area
**Posisi:** Mengisi sisa layar, scrollable
**Padding:** 24-32px (desktop), 16px (mobile)
**Max-width content:** 1200-1400px (centered jika layar sangat lebar)

---

## 🔧 KOMPONEN GLOBAL & PATTERNS

### Modals
**Behavior Standar:**
- Backdrop semi-transparent (rgba(0,0,0,0.7))
- Modal muncul dengan fade + scale dari 0.95 → 1.0
- Closable dengan:
  1. Tombol X di top-right modal
  2. Klik di backdrop (area di luar modal)
  3. Tekan ESC key
- Focus harus trapped dalam modal (keyboard navigation hanya dalam modal)
- Saat modal dibuka, scroll di background diblock

### Dropdowns
- Muncul dengan fade + slide 120ms
- Max-height jika banyak item, lalu scrollable
- Close saat klik di luar atau pilih item

### Tooltips
- Muncul saat hover ~300ms delay
- Posisi: auto (atas/bawah/kiri/kanan sesuai ruang)
- Ukuran: kecil, max 200px width
- Warna: background #333, text putih
- Arrow kecil menunjuk ke element

### Toast Notifications
**Posisi:** Top-right (desktop) atau top-center (mobile)
**Durasi:** 3-4 detik auto-dismiss, atau manual close
**Types:**
- Success: ✓ icon, border hijau, "Berhasil disimpan di Library"
- Error: ✕ icon, border merah, "Terjadi kesalahan. Coba lagi"
- Info: ⓘ icon, border biru, informasi umum
- Warning: ⚠ icon, border kuning, peringatan

### Loading States
**Skeleton Screens:**
- Gunakan placeholder shapes dengan shimmer animation (abu → abu terang)
- Ukuran sesuai dengan konten asli
- Contoh: card skeleton, text line skeleton, thumbnail skeleton

**Progress Indicators:**
- Spinner: untuk proses cepat (1-3 detik)
- Progress bar: untuk proses lama dengan persentase
- Loading text: "Menganalisis motif…", "Sedang membuat varian…"

### Empty States
**Struktur:**
- Icon/ilustrasi kecil (80-120px)
- Heading: "Belum ada [item]"
- Subtext: Penjelasan singkat
- CTA button: "Unggah", "Mulai", dll

### Error States
**Struktur:**
- Icon error (⚠️)
- Heading: "Terjadi Kesalahan"
- Subtext: Penjelasan singkat masalah
- CTA button: "Coba Lagi"

---

## 📱 RESPONSIVE BEHAVIOR

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Adaptations
- Sidebar menjadi drawer (slide dari kiri), toggle dengan hamburger menu
- Grid cards: 1 kolom
- Topbar: Logo kiri, hamburger menu (untuk sidebar), profile kanan
- Touch-friendly: semua interactive elements minimal 44×44px
- Bottom sheet untuk beberapa actions (alternatif modal)

### Tablet Adaptations
- Sidebar dapat pinned atau floating
- Grid cards: 2 kolom
- Hybrid touch + mouse interactions

### Desktop
- Sidebar always visible (pinned)
- Grid cards: 3-4 kolom
- Hover states lebih prominent
- Keyboard shortcuts aktif

---

## 1️⃣ SIDEBAR CHAT - UPDATE & PERUBAHAN

### 🔴 HAPUS DARI SIDEBAR CHAT
- **Settings** - HAPUS SEPENUHNYA dari sidebar Chat
- Settings global tetap ada di Topbar → Profile dropdown atau Topbar → Icon ⚙️

### ✅ ISI BARU SIDEBAR CHAT

**Urutan HARUS PERSIS seperti ini (dari atas ke bawah):**

1. **New Chat**
   - Icon: ➕ atau 📝
   - Label: "New Chat"
   - Behavior: Klik → bersihkan chat, mulai chat kosong baru
   - Visual: Tombol dengan background emas atau border emas

2. **Recent Chats**
   - Icon: 🕐
   - Label: "Recent Chats"
   - Behavior: Klik → expand/collapse list chat terakhir (5-10 chat)
   - Item chat: tampilkan preview text (1 line, 40 karakter) + timestamp relatif ("2 jam lalu")
   - Hover item: show ellipsis menu (Rename, Pin, Delete)

3. **Saved Chats**
   - Icon: 🔖 atau ⭐
   - Label: "Saved Chats"
   - Behavior: Klik → expand/collapse list saved chats
   - **Empty state:** 
     - Card kecil dengan background abu
     - Text: "Belum ada saved chat. Tekan tombol Simpan pada pesan untuk menyimpan."
     - CTA: "Pelajari Prompt" (link ke help)

4. **My Prompts**
   - Icon: 📋
   - Label: "My Prompts"
   - Behavior: Klik → buka halaman/modal daftar custom prompts
   - Subtext kecil: "X prompt tersimpan"

5. **History**
   - Icon: 📚
   - Label: "History"
   - Behavior: Klik → buka halaman full history dengan filter tanggal
   - Subtext kecil: "Lihat semua percakapan"

### Visual Behavior Sidebar Chat

**Active Item:**
- Background: emas semi-transparent (#C9A04F20)
- Border kiri: 3px solid emas (#C9A04F)
- Text: warna emas

**Hover State:**
- Background: abu terang (#2A2A2A)
- Cursor: pointer
- Tooltip: muncul setelah 300ms hover
  - "Mulai chat baru"
  - "Chat yang baru dibuka"
  - "Chat yang kamu simpan"
  - dll

**Interaction Feedback:**
- Klik: slight scale 0.98 → 1.0 (50ms)
- Ripple effect dari titik klik (opsional)

### Mock Data untuk Review

Sediakan contoh untuk Saved Chats (jika ada):
```
- "Resep rendang tradisional" (2 hari lalu)
- "Cerita asal-usul batik mega..." (1 minggu lalu)
- "Tourism kit untuk Danau Toba" (2 minggu lalu)
```

Sediakan contoh untuk Recent Chats:
```
- "Halo, aku ingin tahu tentang..." (5 menit lalu)
- "Bagaimana cara membuat video..." (1 jam lalu)
- "Tolong jelaskan budaya..." (3 jam lalu)
```

---

## 2️⃣ LIBRARY - SISTEM MANAJEMEN FILE

### Sidebar Library

**Header:** "Library" (besar, bold)

**Items (urutan dari atas):**
1. All Files (default, icon 📁)
2. Images (icon 🖼️)
3. Videos (icon 🎥)
4. Audio (icon 🎵)
5. Documents (icon 📄)
6. Favorites (icon ⭐)
7. Trash (icon 🗑️)

**Visual:** 
- Item aktif: highlight emas + icon emas
- Subtext kecil di bawah nama: "24 files", "12 images", dll (mock count)

### Layout Halaman Library

```
┌─────────────────────────────────────────────────────┐
│ HEADER AREA                                         │
│ [Library Title]                     [Upload Button] │
│ [Search Bar]  [Filter ▼]  [Sort ▼]  [View: Grid ⚏] │
├─────────────────────────────────────────────────────┤
│ QUICK ACCESS (Horizontal Scroll)                    │
│ [Collection 1] [Collection 2] [Collection 3]        │
├─────────────────────────────────────────────────────┤
│ MAIN GRID AREA (Scrollable)                         │
│                                                     │
│ [Card] [Card] [Card] [Card]                         │
│ [Card] [Card] [Card] [Card]                         │
│ [Card] [Card] [Card] [Card]                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Header Area Components

**Title:**
- "Library" (heading besar, 28-32px)
- Breadcrumb kecil di bawah jika ada sub-view: "All Files" atau "Images"

**Search Bar:**
- Placeholder: "Cari file, nama, tag…"
- Icon search di kiri
- Width: 300-400px (desktop), full width (mobile)
- Real-time search mock (filter mock data saat ketik)

**Filter Dropdown:**
- Button: "Filter" dengan icon ▼
- Dropdown options:
  - Tipe File (All / Image / Video / Audio / Document)
  - Tanggal (Hari ini / Minggu ini / Bulan ini / Semua)
  - Favorit (Semua / Favorit saja)
  - Ukuran (< 1MB / 1-10MB / > 10MB)

**Sort Dropdown:**
- Button: "Urutkan" dengan icon ▼
- Options:
  - Terbaru
  - Terlama
  - Nama (A-Z)
  - Nama (Z-A)
  - Ukuran (Terbesar)
  - Ukuran (Terkecil)

**View Toggle:**
- Icon Grid ⚏ (aktif)
- Icon List ☰ (non-aktif)
- Toggle antara grid view dan list view

**Upload Button:**
- Label: "Unggah" atau "Upload File"
- Icon: ⬆️ atau ☁️
- Style: primary button dengan background emas
- Klik → tampilkan drag & drop area overlay

### Drag & Drop Area (Overlay saat Upload diklik)

**Visual:**
- Full-screen overlay dengan backdrop blur
- Kotak besar di tengah dengan border dashed emas
- Icon cloud/upload besar di tengah
- Text: "Tarik file ke sini atau klik untuk memilih"
- Subtext: "Mendukung: JPG, PNG, MP4, MP3, PDF (Max 100MB)"
- Button: "Pilih File" (primary)
- Button: "Batal" (secondary)

**States:**
- Default: border dashed abu
- Drag over: border solid emas, background emas semi-transparent
- Uploading: progress bar dengan persentase, text "Mengunggah… 45%"
- Success: checkmark, toast "Berhasil disimpan di Library"
- Error: error icon, text "Gagal mengunggah. Coba lagi", button "Coba Lagi"

### Quick Access Collections

**Layout:**
- Horizontal scroll row (tidak wrap)
- Height: ~100px
- Spacing: 12px gap

**Collection Card (Small):**
- Width: 120-150px
- Thumbnail collage (4 thumbnails kecil dari isi collection)
- Label di bawah: "Proyek Batik" (max 2 lines)
- Count kecil: "12 files"
- Hover: slight lift + shadow

**Mock Collections:**
- "Proyek Batik" (8 files)
- "Tourism Bali" (15 files)
- "Video Tutorial" (5 files)

### Main Grid Area

**Grid Layout:**
- Desktop: 4 kolom (jika layar > 1400px), 3 kolom (standard)
- Tablet: 2 kolom
- Mobile: 1 kolom
- Gap: 16px

**File Card Structure:**

```
┌─────────────────────┐
│   [Thumbnail]       │  ← Image preview atau icon tipe file
│                     │
├─────────────────────┤
│ File Name.jpg       │  ← Truncate jika panjang
│ Image • 2.4 MB      │  ← Meta info (type • size)
│ 3 Nov 2024          │  ← Date
│ [♡] [⋮]             │  ← Favorite icon + overflow menu
└─────────────────────┘
```

**Card Elements:**

1. **Thumbnail Area:**
   - Aspect ratio: 16:9 atau 1:1
   - Background: abu gelap jika loading
   - Untuk images: tampilkan preview
   - Untuk videos: thumbnail + play icon overlay
   - Untuk audio: waveform placeholder atau audio icon
   - Untuk documents: icon dokumen + nama extension (PDF, DOCX)

2. **File Name:**
   - Font: 14-16px, medium weight
   - Max 2 lines, truncate dengan "..."
   - Editable saat diklik jika dalam rename mode

3. **Meta Info:**
   - Font size: 12px
   - Color: abu terang (#A0A0A0)
   - Format: "Tipe • Ukuran • Tanggal" (pisah dengan bullet •)

4. **Favorite Icon (♡):**
   - Position: bottom-left card
   - Inactive: outline, warna abu
   - Active: filled, warna emas
   - Klik: toggle favorite + animation (scale pulse)

5. **Overflow Menu (⋮):**
   - Position: bottom-right card
   - Klik: tampilkan dropdown menu

**Overflow Menu Options:**
- Open Preview (icon 👁️)
- Rename (icon ✏️)
- Move to... (icon 📁)
- Download (icon ⬇️)
- Add to Collection (icon ➕)
- Delete (icon 🗑️, warna merah)

**Card Interactions:**
- Hover: slight lift (translateY -4px), shadow meningkat
- Klik pada thumbnail/nama: buka preview modal
- Long press (mobile): masuk selection mode, tampilkan checkboxes

### Selection Mode

**Trigger:**
- Desktop: Shift+klik atau checkbox muncul saat hover
- Mobile: Long press pada card

**Visual Changes:**
- Checkboxes muncul di top-left setiap card
- Selected cards: border emas 2px
- Top bar muncul dengan: "X dipilih" + bulk actions

**Bulk Actions Bar:**
```
[✓ 5 dipilih]  [Download All]  [Move]  [Add to Favorite]  [Delete]  [Cancel]
```

**Interactions:**
- Download All: trigger multiple downloads atau zip (mock toast "Mengunduh 5 file…")
- Move: tampilkan modal pilih folder/collection
- Add to Favorite: semua jadi favorit, toast "5 file ditambahkan ke Favorit"
- Delete: konfirmasi modal → move to trash, toast "5 file dipindahkan ke Trash"
- Cancel: keluar selection mode

### Preview Modal

**Layout:**
```
┌────────────────────────────────────────────────────┐
│ [✕ Close]                               [⋮ Actions] │
├──────────────────────┬─────────────────────────────┤
│                      │  METADATA PANEL             │
│   PREVIEW AREA       │                             │
│   (Large)            │  📄 Nama File               │
│                      │  Tipe: Image                │
│   [<] [Image] [>]    │  Ukuran: 2.4 MB             │
│                      │  Dibuat: 3 Nov 2024         │
│                      │  Dimensi: 1920 × 1080       │
│                      │                             │
│                      │  🏷️ Tags:                   │
│                      │  [batik] [java] [+]         │
│                      │                             │
│                      │  ACTIONS:                   │
│                      │  [Simpan ke Koleksi]        │
│                      │  [Tambah Tag]               │
│                      │  [Bagikan]                  │
│                      │  [Pindah ke Project]        │
│                      │  [Hapus]                    │
└──────────────────────┴─────────────────────────────┘
```

**Preview Area (Left - 60% width):**
- **Untuk Images:** 
  - Display full image
  - Zoom controls: [−] [100%] [+]
  - Pan/drag jika di-zoom
  
- **Untuk Videos:** 
  - Video player dengan controls
  - Play/pause, timeline scrubber, volume, fullscreen
  
- **Untuk Audio:** 
  - Waveform visualization (mock)
  - Play/pause, timeline, volume
  
- **Untuk Documents:** 
  - Text preview (first page mock) atau PDF viewer mock
  - Page navigation jika multi-page

**Navigation:**
- Arrow kiri/kanan: previous/next file dalam grid
- Keyboard: ← → untuk navigate
- ESC: close modal

**Metadata Panel (Right - 40% width):**

1. **File Info Section:**
   - Icon tipe file + Nama (editable jika klik icon ✏️)
   - Tipe file
   - Ukuran
   - Tanggal upload
   - Dimensi (untuk image/video)
   - Duration (untuk video/audio)

2. **Tags Section:**
   - Tampilkan existing tags sebagai chips (emas background)
   - Button "+ Tambah tag" → input muncul
   - Klik chip: remove tag (dengan confirm)

3. **Actions Section:**
   - **Simpan ke Koleksi:** dropdown pilih collection atau buat baru
   - **Tambah Tag:** input field + suggestions
   - **Bagikan:** (UI-only) modal dengan options: "Copy link", "Email", "Social"
   - **Pindah ke Project:** dropdown pilih project
   - **Hapus:** merah, konfirmasi modal

**Close Behavior:**
- Klik [✕] button
- Klik backdrop (area di luar modal)
- Tekan ESC
- Animasi: fade + slight scale out

### Trash View

**Trigger:** Klik "Trash" di sidebar

**Layout:** Same as main library, tapi:
- Header title: "Trash"
- Subtext: "File akan terhapus permanen setelah 30 hari"
- Button: "Kosongkan Trash" (merah, secondary)

**Card Differences:**
- Tambah info: "Dihapus 2 hari lalu"
- Overflow menu: "Restore" + "Delete Permanently"

**Kosongkan Trash Button:**
- Klik → konfirmasi modal:
  - Title: "Kosongkan Trash?"
  - Text: "X file akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
  - Buttons: "Batal" (secondary), "Kosongkan" (danger/merah)
- Setelah confirm: toast "Trash dikosongkan", refresh view

**Restore Action:**
- Klik Restore pada file → file kembali ke Library
- Toast: "File dipulihkan ke Library"
- Undo option dalam toast (3 detik): "Undo"

### Empty States

**All Files Empty:**
- Icon: 📁 (besar, 80px)
- Heading: "Belum ada file"
- Text: "Unggah file pertamamu untuk memulai."
- Button: "Unggah File" (primary, emas)

**Images Empty:**
- Icon: 🖼️
- Heading: "Belum ada gambar"
- Text: "Unggah foto atau hasil generate dari Creative."
- Button: "Unggah Gambar"

**Trash Empty:**
- Icon: 🗑️
- Heading: "Trash kosong"
- Text: "File yang dihapus akan muncul di sini."

### Loading States

**Initial Load:**
- Skeleton cards (4-8 buah)
- Shimmer animation

**Upload Loading:**
- Progress bar di drag-drop area
- Text: "Mengunggah… 45%"
- Thumbnail preview (jika image)

**Delete Loading:**
- Card fade out + slide out animation
- Toast: "Memindahkan ke Trash…"

### Error States

**Upload Error:**
- Icon: ⚠️
- Text: "Gagal mengunggah. File terlalu besar atau format tidak didukung."
- Button: "Coba Lagi"

**Load Error:**
- Icon: ⚠️
- Text: "Gagal memuat file. Periksa koneksi Anda."
- Button: "Muat Ulang"

**Preview Error:**
- Dalam preview modal:
- Icon: ⚠️
- Text: "Preview tidak tersedia untuk file ini."
- Button: "Download" untuk lihat di device

### Mock Data untuk Library (Minimal 6 Files)

```
1. batik-megamendung.jpg
   - Image • 2.4 MB • 3 Nov 2024
   - Tags: batik, jawa-barat, megamendung

2. tari-saman-video.mp4
   - Video • 45.2 MB • 1 Nov 2024
   - Tags: tari, aceh, saman

3. gamelan-audio.mp3
   - Audio • 8.1 MB • 30 Okt 2024
   - Tags: musik, gamelan, jawa

4. panduan-batik.pdf
   - Document • 1.2 MB • 28 Okt 2024
   - Tags: guide, batik

5. wayang-kulit.jpg
   - Image • 3.1 MB • 25 Okt 2024
   - Tags: wayang, jawa, shadow-puppet

6. taman-mini-video.mp4
   - Video • 67.8 MB • 20 Okt 2024
   - Tags: tourism, jakarta
```

### Accessibility

- Semua cards dapat di-navigate dengan Tab key
- Selected card: border fokus jelas (outline emas)
- Screen reader: announce file type, name, size
- Alt text untuk thumbnails: "Preview [filename]"
- Keyboard shortcuts:
  - Enter: buka preview
  - Delete: hapus (dengan confirm)
  - Ctrl/Cmd + A: select all
  - Escape: deselect all / close modal

### Microcopy (Bahasa Indonesia)

- Upload success: "Berhasil disimpan di Library"
- Rename success: "Nama file diperbarui"
- Move success: "File dipindahkan ke [nama collection]"
- Delete success: "File dipindahkan ke Trash"
- Restore success: "File dipulihkan ke Library"
- Empty trash: "Trash dikosongkan"
- Add to favorite: "Ditambahkan ke Favorit"
- Remove favorite: "Dihapus dari Favorit"
- Upload error: "Gagal mengunggah. Coba lagi"
- Preview error: "Preview tidak tersedia"
- Delete confirm: "Hapus file ini? File akan dipindah ke Trash"
- Empty trash confirm: "Kosongkan Trash? X file akan dihapus permanen"

---

## 3️⃣ CULTURE - ANALISIS BUDAYA INDONESIA

### Sidebar Culture

**Header:** "Culture" (besar, bold)

**Items (urutan dari atas):**
1. Identify Culture (default, icon 🔍)
2. Cultural Story (icon 📖)
3. Craft & Origins (icon 🎨)
4. Rituals & Traditions (icon 🕉️)
5. Map of Indonesia (icon 🗺️)
6. Sources & References (icon 📚)

**Visual:**
- Item aktif: highlight emas
- Subtext kecil: "Kenali budaya dari gambar" untuk Identify

### Layout Halaman Utama: Identify Culture

**Ini adalah halaman DEFAULT saat buka Culture.**

```
┌─────────────────────────────────────────────────────┐
│ HERO / UPLOAD AREA                                  │
│                                                     │
│   [Drag & Drop Area / Upload Card]                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│ RESULT AREA (muncul setelah upload)                 │
│                                                     │
│ [Image + Markers]    [Result Cards Stack]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Hero / Upload Area (Initial State - Sebelum Upload)

**Layout:**
```
┌────────────────────────────────────────┐
│                                        │
│           🔍 (Icon Besar)              │
│                                        │
│      Identify Cultural Objects         │
│                                        │
│  Unggah gambar motif, kain, upacara,   │
│  atau objek budaya. Hasil terbaik      │
│  bila motif difoto dari dekat.         │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │   Drag & Drop Area               │  │
│  │   atau                           │  │
│  │   [Pilih Gambar] [Gunakan Kamera]│  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Format: JPG, PNG (Max 10MB)           │
│                                        │
└────────────────────────────────────────┘
```

**Card Style:**
- Background: abu gelap dengan border dashed emas
- Padding: 48px (desktop), 24px (mobile)
- Corner radius: 12px
- Centered content

**Title:**
- "Identify Cultural Objects"
- Font: 24-28px, bold
- Color: putih

**Subtitle/Description:**
- "Unggah gambar motif, kain, upacara, atau objek budaya. Hasil terbaik bila motif difoto dari dekat."
- Font: 14-16px, regular
- Color: abu terang
- Max-width: 500px, centered

**Drag & Drop Area:**
- Height: 200-250px
- Border: 2px dashed abu terang
- Background: sedikit lebih gelap dari card
- Icon: ☁️ upload icon (besar)
- Text: "Tarik gambar ke sini atau klik untuk memilih"

**States:**
- **Default:** border dashed abu
- **Drag hover:** border solid emas, background emas semi-transparent, text "Lepaskan untuk unggah"
- **Click trigger:** buka file picker

**Buttons:**
- **Pilih Gambar:** Primary button (emas background), width: 160px
- **Gunakan Kamera:** Secondary button (border emas), width: 160px, margin-left: 12px
- Buttons stacked di mobile

**Fine Print:**
- "Format: JPG, PNG (Max 10MB)"
- Font: 12px, abu muda
- Positioned below drag area

### Upload Loading State

**Saat gambar sedang diupload dan dianalisis:**

```
┌────────────────────────────────────────┐
│                                        │
│     [Uploaded Image Preview]           │
│     (Semi-transparent overlay)         │
│                                        │
│     ⏳ Menganalisis motif…             │
│     [Progress Bar 45%]                 │
│                                        │
│     Butuh waktu sedikit —              │
│     terima kasih sabar menunggu        │
│                                        │
└────────────────────────────────────────┘
```

**Loading Elements:**
- Uploaded image ditampilkan dengan opacity 0.6
- Spinner atau animated icon di tengah
- Progress text: "Menganalisis motif…"
- Progress bar visual (indeterminate atau percentage)
- Fallback text (muncul jika > 5 detik): "Butuh waktu sedikit — terima kasih sabar menunggu"

**Loading Variants:**
- 0-3 detik: "Menganalisis motif…"
- 3-6 detik: "Sedang menganalisis detail…"
- 6-10 detik: "Hampir selesai…"
- > 10 detik: "Butuh waktu sedikit — terima kasih sabar menunggu"

### Result Layout (Setelah Analisis Selesai)

**Desktop: Two Columns**
```
┌─────────────────────┬───────────────────────────┐
│                     │                           │
│  IMAGE + MARKERS    │   RESULT CARDS            │
│  (Left - 50%)       │   (Right - 50%)           │
│                     │                           │
│  [Image besar]      │   [Ringkasan]             │
│  [Zoom controls]    │   [What is this?]         │
│  [Markers overlay]  │   [Where from?]           │
│                     │   [How it's made]         │
│                     │   [Meaning & Context]     │
│                     │   [Related Images]        │
│                     │   [Actions]               │
│                     │                           │
└─────────────────────┴───────────────────────────┘
```

**Mobile: Stacked/Accordion**
- Image + markers di atas (full width)
- Result cards di bawah sebagai accordion (collapsible sections)

### Left Panel: Image + Markers

**Image Display:**
- Display uploaded image full size (contain fit)
- Background: hitam
- Padding: 16px

**Zoom Controls:**
- Position: Bottom-right overlay
- Buttons: [−] [100%] [+] [⤢ Fit]
- Style: small, semi-transparent background
- Behavior: 
  - Zoom in: scale 1.0 → 2.0 (max)
  - Zoom out: scale down
  - Fit: reset ke 100%
  - Pan: drag saat zoom > 100%

**Interactive Markers:**
- Overlay pada image: lingkaran kecil (diameter 24px) dengan border emas
- Posisi: titik-titik pada motif yang diidentifikasi (mock positions)
- Isi lingkaran: nomor (1, 2, 3…) atau icon kecil
- Animation: pulse subtle untuk menarik perhatian

**Marker Interactions:**
- **Hover (desktop):** tooltip muncul dengan teks singkat
  - Contoh: "Motif Megamendung — Jawa Barat"
- **Click/Tap:** tooltip lengkap muncul atau scroll ke section terkait di right panel
- **Keyboard:** Tab untuk navigate antar markers, Enter untuk aktivasi

**Mock Markers (Contoh untuk batik):**
1. Marker 1: "Motif Megamendung" (di area motif awan)
2. Marker 2: "Garis Kawung" (di area motif kawung)
3. Marker 3: "Warna Indigo Natural" (di area warna dominan)

### Right Panel: Result Cards (Stacked Vertically)

**Scroll Behavior:**
- Right panel scrollable independently
- Smooth scroll
- Sticky header (opsional) saat scroll

---

#### Card 1: Ringkasan Singkat (Summary)

```
┌─────────────────────────────────────────┐
│ 🏛️ RINGKASAN                            │
├─────────────────────────────────────────┤
│                                         │
│ Batik Tulis Pekalongan                  │
│ Jawa Tengah, Indonesia                  │
│                                         │
│ Confidence: ████████░░ 85%              │
│                                         │
│ [👍] [👎] (Feedback icons)              │
└─────────────────────────────────────────┘
```

**Elements:**
- **Icon:** Emoji atau icon budaya (🏛️, 🎨, 🕉️)
- **Header:** "RINGKASAN" (12px, uppercase, abu terang)
- **Title:** Nama budaya/objek (20-24px, bold, putih)
- **Subtitle:** Wilayah asal (14px, emas)
- **Confidence Bar:**
  - Visual progress bar
  - Percentage text
  - Color: emas (high confidence), kuning (medium), merah (low)
- **Feedback:**
  - Thumbs up 👍 / Thumbs down 👎
  - Click 👎 → textarea kecil muncul: "Sampaikan koreksi singkat" + tombol "Kirim"

**Mock Data:**
```
Batik Tulis Pekalongan
Jawa Tengah, Indonesia
Confidence: 85%
```

---

#### Card 2: What is this? (Apa ini?)

```
┌─────────────────────────────────────────┐
│ 🔍 APA INI?                             │
├─────────────────────────────────────────┤
│                                         │
│ Batik Tulis adalah teknik membuat      │
│ motif kain dengan cara mencanting       │
│ malam pada kain mori. Batik Pekalongan  │
│ terkenal dengan motif pesisir yang      │
│ penuh warna cerah dan pengaruh          │
│ multikultural.                          │
│                                         │
│ [Tampilkan Detail →]                    │
└─────────────────────────────────────────┘
```

**Elements:**
- **Icon:** 🔍
- **Header:** "APA INI?" (12px, uppercase)
- **Body Text:** 
  - Deskripsi singkat 2-3 kalimat (14-16px)
  - Serif font (opsional untuk readability)
  - Max 200 karakter di summary view
- **CTA Link:** "Tampilkan Detail →" 
  - Klik → expand card atau navigate ke Cultural Story page

**Mock Data:**
```
Batik Tulis adalah teknik membuat motif kain dengan cara mencanting malam pada kain mori. Batik Pekalongan terkenal dengan motif pesisir yang penuh warna cerah dan pengaruh multikultural.
```

---

#### Card 3: Where from? (Dari Mana?)

```
┌─────────────────────────────────────────┐
│ 📍 DARI MANA?                           │
├─────────────────────────────────────────┤
│                                         │
│ [Mini Map Preview]                      │
│                                         │
│ Pekalongan, Jawa Tengah                 │
│ Wilayah pesisir utara Jawa              │
│                                         │
│ [Lihat di Peta →]                       │
└─────────────────────────────────────────┘
```

**Elements:**
- **Icon:** 📍
- **Header:** "DARI MANA?" (12px, uppercase)
- **Mini Map:**
  - Static map image (mock) dengan pin di lokasi
  - Size: ~200×120px
  - Clickable → buka full map modal
- **Location Text:**
  - Nama kota/wilayah (16px, bold)
  - Deskripsi wilayah (14px, regular)
- **CTA:** "Lihat di Peta →"
  - Klik → buka modal full Indonesia map dengan pin & info detail

**Map Modal (saat dibuka):**
```
┌──────────────────────────────────────────────┐
│ [✕ Close]        PETA INDONESIA              │
├──────────────────────────────────────────────┤
│                                              │
│        [Full Indonesia Map]                  │
│        [Pin di Pekalongan]                   │
│                                              │
│    ┌──────────────────────┐                  │
│    │ Pekalongan           │                  │
│    │ Jawa Tengah          │                  │
│    │                      │                  │
│    │ Terkenal dengan:     │                  │
│    │ • Batik Pesisir      │                  │
│    │ • Motif Multikultural│                  │
│    └──────────────────────┘                  │
│                                              │
└──────────────────────────────────────────────┘
```

**Map Modal Features:**
- Full size Indonesia map (use static image atau simple SVG mock)
- Pin dengan label di lokasi
- Info card floating di samping/bawah pin
- Zoom controls (opsional)
- Close: ESC, click backdrop, click [✕]

**Mock Data:**
```
Pekalongan, Jawa Tengah
Wilayah pesisir utara Jawa
Terkenal sebagai "Kota Batik"
```

---

#### Card 4: How it's made (Cara Pembuatan)

```
┌─────────────────────────────────────────┐
│ 🎨 CARA PEMBUATAN                       │
├─────────────────────────────────────────┤
│                                         │
│ 1. Persiapan Kain                       │
│    Kain mori dicuci dan dikeringkan     │
│    [Placeholder image]                  │
│                                         │
│ 2. Membuat Pola                         │
│    Pola digambar dengan pensil          │
│    [Placeholder image]                  │
│                                         │
│ 3. Mencanting                           │
│    Malam panas dicanting mengikuti pola │
│    [Placeholder image]                  │
│                                         │
│ 4. Pewarnaan                            │
│    Kain dicelup dalam larutan warna     │
│    [Placeholder image]                  │
│                                         │
│ 5. Melorod                              │
│    Malam dihilangkan dengan air panas   │
│    [Placeholder image]                  │
│                                         │
│ 6. Pengeringan & Finishing              │
│    Kain dijemur dan disetrika           │
│    [Placeholder image]                  │
│                                         │
│ [Lihat Tutorial Lengkap →]              │
└─────────────────────────────────────────┘
```

**Elements:**
- **Icon:** 🎨
- **Header:** "CARA PEMBUATAN" (12px, uppercase)
- **Steps List:**
  - Numbered list (1-6 steps)
  - Each step: 
    - Number badge (emas background, bold)
    - Title (14px, bold)
    - Short description (14px, regular)
    - Placeholder image (small thumbnail ~80×80px)
  - Spacing: 16px between steps
- **CTA:** "Lihat Tutorial Lengkap →"
  - Klik → navigate ke "Craft & Origins" page dengan full tutorial

**Visual Enhancement:**
- Step numbers dalam circle badge dengan background emas
- Placeholder images dengan border subtle
- Dotted line menghubungkan steps (opsional)

**Mock Data:**
```
1. Persiapan Kain - Kain mori dicuci dan dikeringkan
2. Membuat Pola - Pola digambar dengan pensil
3. Mencanting - Malam panas dicanting mengikuti pola
4. Pewarnaan - Kain dicelup dalam larutan warna
5. Melorod - Malam dihilangkan dengan air panas
6. Pengeringan & Finishing - Kain dijemur dan disetrika
```

---

#### Card 5: Meaning & Context (Makna & Konteks)

```
┌─────────────────────────────────────────┐
│ 📜 MAKNA & KONTEKS                      │
├─────────────────────────────────────────┤
│                                         │
│ Symbolism:                              │
│ Motif megamendung melambangkan          │
│ kesabaran, keteduhan, dan pembawa       │
│ keberuntungan. Pengaruh budaya Tionghoa │
│ terlihat dari bentuk awan yang bergulir.│
│                                         │
│ Usage:                                  │
│ Dipakai dalam acara formal, upacara     │
│ adat, dan sebagai warisan budaya yang   │
│ diwariskan turun-temurun.               │
│                                         │
│ Historical Context:                     │
│ Batik Pekalongan berkembang sejak abad │
│ 16-17 dengan pengaruh Arab, Tionghoa,   │
│ dan Eropa karena posisi Pekalongan      │
│ sebagai kota pelabuhan.                 │
│                                         │
│ [Baca Cerita Lengkap →]                 │
└─────────────────────────────────────────┘
```

**Elements:**
- **Icon:** 📜
- **Header:** "MAKNA & KONTEKS" (12px, uppercase)
- **Subsections:**
  - **Symbolism:** (bold subheading) + paragraph
  - **Usage:** (bold subheading) + paragraph
  - **Historical Context:** (bold subheading) + paragraph
- **Typography:**
  - Subheadings: 14px bold
  - Body: 14px regular, serif untuk readability
  - Line height: 1.6 untuk easy reading
- **CTA:** "Baca Cerita Lengkap →"
  - Klik → navigate ke "Cultural Story" page

**Mock Data:**
```
Symbolism:
Motif megamendung melambangkan kesabaran, keteduhan, dan pembawa keberuntungan. Pengaruh budaya Tionghoa terlihat dari bentuk awan yang bergulir.

Usage:
Dipakai dalam acara formal, upacara adat, dan sebagai warisan budaya yang diwariskan turun-temurun.

Historical Context:
Batik Pekalongan berkembang sejak abad 16-17 dengan pengaruh Arab, Tionghoa, dan Eropa karena posisi Pekalongan sebagai kota pelabuhan.
```

---

#### Card 6: Related Images (Gambar Terkait)

```
┌─────────────────────────────────────────┐
│ 🖼️ GAMBAR TERKAIT                       │
├─────────────────────────────────────────┤
│                                         │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │
│ │    │ │    │ │    │ │    │ │    │ →   │
│ └────┘ └────┘ └────┘ └────┘ └────┘     │
│ Batik  Batik  Upacara Pengra Sejarah   │
│ Lain   Detail Adat    jian   Foto       │
│                                         │
│ [Lihat Semua →]                         │
└─────────────────────────────────────────┘
```

**Elements:**
- **Icon:** 🖼️
- **Header:** "GAMBAR TERKAIT" (12px, uppercase)
- **Carousel:**
  - Horizontal scroll (tidak wrap)
  - Thumbnail size: 100×100px
  - Gap: 12px
  - Smooth scroll dengan drag atau arrow navigation
  - Show scroll hint (fade gradient di edges)
- **Thumbnail Card:**
  - Image preview
  - Label di bawah (2 lines max, 10px font)
  - Hover: slight zoom + shadow
  - Click: buka preview modal (reuse Library preview modal)
- **CTA:** "Lihat Semua →"
  - Klik → navigate ke gallery page dengan semua related images

**Mock Related Images:**
```
1. Batik Pekalongan Lainnya
2. Detail Motif Close-up
3. Upacara Adat Pemakaian
4. Proses Pengrajian
5. Foto Sejarah Hitam-Putih
6. Variasi Warna
```

---

#### Card 7: Actions (Aksi)

```
┌─────────────────────────────────────────┐
│ ⚡ AKSI                                  │
├─────────────────────────────────────────┤
│                                         │
│ [💾 Simpan ke Library]                  │
│                                         │
│ [📖 Buat Cerita Panjang]                │
│                                         │
│ [✈️ Buat Tourism Kit]                   │
│                                         │
│ [📤 Bagikan]                            │
│                                         │
└─────────────────────────────────────────┘
```

**Elements:**
- **Icon:** ⚡
- **Header:** "AKSI" (12px, uppercase)
- **Action Buttons:**
  - Full width buttons dalam card
  - Height: 48px (touch-friendly)
  - Icon + label
  - Spacing: 12px between buttons
  - Primary style untuk Simpan (emas)
  - Secondary style untuk lainnya (outline emas)

**Button Actions (UI-only):**

1. **Simpan ke Library:**
   - Click → toast "Berhasil disimpan di Library"
   - Icon berubah jadi checkmark sementara

2. **Buat Cerita Panjang:**
   - Click → navigate ke "Cultural Story" page dengan content pre-filled (mock)
   - Loading transition

3. **Buat Tourism Kit:**
   - Click → navigate ke "Tourism Kit" dalam Creative section
   - Pre-fill dengan data dari Culture analysis (mock)

4. **Bagikan:**
   - Click → buka modal share (UI-only):
     ```
     ┌─────────────────────────┐
     │ Bagikan                 │
     ├─────────────────────────┤
     │ [📋 Salin Link]         │
     │ [✉️ Email]              │
     │ [📱 WhatsApp]           │
     │ [🐦 Twitter]            │
     │ [📘 Facebook]           │
     └─────────────────────────┘
     ```
   - Klik "Salin Link" → toast "Link disalin"
   - Others → placeholder toast "Fitur akan datang"

---

### Tabs/Navigation ke Deeper Pages

**Position:** Di bawah Actions card atau sebagai tab bar di top

**Tabs:**
```
[Identify] [Cultural Story] [Craft & Origins] [Rituals] [Map] [Sources]
```

- Active tab: emas underline + bold
- Inactive: abu, hover: emas
- Click: smooth scroll atau navigate ke page terkait

---

### Deeper Pages (Brief Overview - UI-only)

#### Cultural Story Page

**Layout:**
- Hero image di atas (full-width)
- Article-style layout (centered, max-width 800px)
- Serif font untuk body text
- Headings dengan emas accent
- Pull quotes dengan border kiri emas
- Image galleries inline
- Related stories di bottom

**Mock Content:**
```
[Hero Image: Batik Pekalongan]

BATIK PEKALONGAN: WARISAN PESISIR NUSANTARA

Di pesisir utara Jawa, sebuah tradisi berusia ratusan tahun terus hidup...

[Section 1: Asal-Usul]
[Section 2: Pengaruh Multikultural]
[Section 3: Proses & Filosofi]
[Section 4: Masa Kini]

[Related Stories]
```

#### Craft & Origins Page

**Layout:**
- Step-by-step tutorial format
- Large images untuk tiap step
- Video embed placeholders
- Expandable details
- Download PDF guide button (UI-only)

**Mock Content:**
```
MEMBUAT BATIK TULIS: PANDUAN LENGKAP

[Video placeholder: Intro to Batik Making]

ALAT & BAHAN:
- Kain mori
- Canting
- Malam (lilin)
- Pewarna alami
- ...

LANGKAH-LANGKAH:
[Step 1 dengan foto besar]
[Step 2 dengan foto besar]
...
```

#### Rituals & Traditions Page

**Layout:**
- Timeline view atau card grid
- Each ritual sebagai card
- Filter by: region, type, season
- Visual calendar

**Mock Content:**
```
RITUAL & TRADISI TERKAIT

[Card: Upacara Manten Jawa]
[Card: Nyadran]
[Card: Sekaten]
```

#### Map of Indonesia Page

**Layout:**
- Full-screen interactive map (static image mock)
- Regions clickable (UI hover states)
- Side panel dengan info daerah
- Filter by: craft type, ritual, language

#### Sources & References Page

**Layout:**
- Academic citation style
- Grouped by: Books, Articles, Museums, Experts
- Clickable links (UI-only placeholder)

**Mock Content:**
```
SUMBER & REFERENSI

BUKU:
1. "Batik: Fabled Cloth of Java" - Inger McCabe Elliott
2. "Indonesian Batik: Processes, Patterns and Places" - ...

ARTIKEL:
1. UNESCO Intangible Cultural Heritage...
2. ...

MUSEUM:
1. Museum Batik Pekalongan
2. ...
```

---

### Empty Upload State (Culture)

**Visual:**
- Icon: 🔍 (besar, 80px)
- Heading: "Identifikasi Budaya Indonesia"
- Text: "Tarik atau pilih gambar — hasil terbaik jika foto detail motif diambil dekat."
- Examples row: "Contoh: Batik, Wayang, Tarian, Upacara, Kerajinan"
- Button: "Pilih Gambar" (primary, emas)

### Loading State (Culture Analysis)

**Stage 1 (0-2s):**
- Spinner + "Mengunggah gambar…"

**Stage 2 (2-5s):**
- Progress bar + "Menganalisis motif…"
- Skeleton cards mulai muncul

**Stage 3 (5-8s):**
- "Sedang mengidentifikasi detail budaya…"

**Stage 4 (8s+):**
- "Butuh waktu sedikit — terima kasih sabar menunggu"
- Tips muncul: "Tip: Foto dengan lighting baik akan hasil lebih akurat"

### Error State (Culture)

**Analysis Failed:**
```
┌─────────────────────────────────────┐
│          ⚠️                         │
│                                     │
│    Analisis Tidak Berhasil          │
│                                     │
│ Gambar tidak dapat diidentifikasi.  │
│ Pastikan foto jelas dan fokus pada  │
│ objek budaya.                       │
│                                     │
│ [Coba Gambar Lain] [Hubungi Support]│
└─────────────────────────────────────┘
```

**Low Confidence Warning:**
```
ℹ️ Hasil analisis memiliki tingkat kepercayaan rendah (35%). 
Kami menyarankan untuk:
• Upload foto dengan kualitas lebih baik
• Foto lebih dekat pada detail motif
• Pastikan lighting cukup
```

---

### Accessibility (Culture)

- All markers keyboard accessible (Tab, Enter)
- Image alt text: "Uploaded image untuk analisis budaya"
- Screen reader announce: "X markers ditemukan pada gambar"
- Modals trap focus
- High contrast mode: markers tetap visible
- Mobile: markers dengan size lebih besar (32px) untuk touch

### Microcopy (Culture - Bahasa Indonesia)

- Upload area: "Tarik atau pilih gambar — hasil terbaik bila motif diambil dekat"
- Analysis: "Menganalisis motif…"
- Fallback: "Butuh waktu sedikit — terima kasih sabar menunggu"
- Save: "Disimpan ke Library"
- Share: "Link disalin"
- Error: "Terjadi kesalahan. Coba lagi"
- Low confidence: "Hasil kurang akurat. Coba foto lebih jelas"
- Marker tooltip: "Klik untuk detail"
- Feedback prompt: "Hasil akurat?" + thumbs
- Correction: "Sampaikan koreksi singkat"

---

## 4️⃣ CREATIVE - IMAGE/VIDEO/AUDIO SUITE

### Sidebar Creative

**Header:** "Creative" (besar, bold)

**Items (urutan dari atas):**
1. Image Studio (icon 🎨, default)
2. Video Studio (icon 🎬)
3. Audio Studio (icon 🎙️)
4. Script Writer (icon ✍️)
5. Tourism Kit (icon ✈️)
6. Commercial Maker (icon 📺)
7. My Creative Projects (icon 📂)

**Visual:**
- Item aktif: highlight emas
- Badge count di "My Creative Projects": "12 projects"

---

### 4.1 IMAGE STUDIO

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ TOP CONTROLS                                         │
│ [Mode] [Aspect Ratio] [Style] [Advanced ▼]          │
├──────────────────────────────────────────────────────┤
│                                                      │
│            MAIN CANVAS AREA                          │
│         (Active generated image)                     │
│                                                      │
├──────────────────────────────────────────────────────┤
│ VARIANT THUMBNAILS                                   │
│ [Thumb1] [Thumb2] [Thumb3] [Thumb4]                  │
├──────────────────────────────────────────────────────┤
│ RIGHT PANEL (collapsible)                            │
│ - Prompt input                                       │
│ - Title & Description                                │
│ - Tags                                               │
│ - Actions                                            │
└──────────────────────────────────────────────────────┘
```

#### Top Controls Bar

**Mode Selector:**
```
[📄 Template] [🖼️ From Image] [✨ From Prompt]
```
- Active: emas background
- Toggle between modes
- Each mode changes the input panel

**Aspect Ratio Selector:**
```
[1:1] [4:3] [16:9] [9:16] [Custom]
```
- Dropdown atau button group
- Active: emas border
- Shows preview icon di button

**Style Preset Dropdown:**
```
Style: [Traditional ▼]

Dropdown:
- Traditional (Batik, wayang style)
- Modern (Clean, minimalist)
- Tourism (Vibrant, inviting)
- Cinematic (Dramatic, epic)
- Custom (User defined)
```

**Advanced Options (Collapsible):**
- Quality: [Draft / Standard / High]
- Variations: [2 / 4 / 6]
- Seed: [Random / Custom number]

#### Main Canvas Area

**Default State (Before Generation):**
```
┌────────────────────────────────────┐
│                                    │
│         ✨ (Icon Large)            │
│                                    │
│    Generate Your First Image       │
│                                    │
│    Pilih mode dan masukkan prompt  │
│    atau upload gambar referensi    │
│                                    │
└────────────────────────────────────┘
```

**With Generated Image:**
- Large preview (main selected variant)
- Background: hitam
- Image: contain fit, centered
- Zoom controls di corner: [−] [Fit] [+]
- Info overlay (toggle): dimensions, seed, style used

#### Variant Thumbnails (Bottom Strip)

**Layout:**
- Horizontal row
- 4-6 thumbnails
- Size: ~120×120px
- Gap: 12px
- Scrollable jika > 6

**Thumbnail Card:**
```
┌──────────────┐
│  [Image]     │
│              │
│ Variant 1    │
│ [⭐] [⬇️]    │
└──────────────┘
```

**Interactions:**
- Click: set sebagai main canvas
- Hover: border emas + slight zoom
- Star icon: mark as favorite
- Download icon: quick download
- Selected thumbnail: border emas solid 3px

#### Right Panel (Collapsible)

**FOR TEMPLATE MODE:**
```
┌─────────────────────────────────┐
│ TEMPLATE                        │
├─────────────────────────────────┤
│ Pilih Template:                 │
│                                 │
│ [Grid of template thumbnails]   │
│ - Batik Pattern                 │
│ - Tourism Poster                │
│ - Cultural Hero Banner          │
│ - Social Media Post             │
│                                 │
│ Customize:                      │
│ [Text Input: Headline]          │
│ [Text Input: Subtext]           │
│ [Color Picker]                  │
│                                 │
│ [⚡ Generate]                   │
└─────────────────────────────────┘
```

**FOR FROM IMAGE MODE:**
```
┌─────────────────────────────────┐
│ FROM IMAGE                      │
├─────────────────────────────────┤
│ Upload Reference:               │
│ [Drag & Drop Area]              │
│                                 │
│ Style Transfer:                 │
│ [Traditional / Modern / ...]    │
│                                 │
│ Prompt (optional):              │
│ [Textarea]                      │
│ "Ubah menjadi gaya batik..."    │
│                                 │
│ Strength: ████░░░░ 75%          │
│                                 │
│ [⚡ Generate]                   │
└─────────────────────────────────┘
```

**FOR FROM PROMPT MODE:**
```
┌─────────────────────────────────┐
│ FROM PROMPT                     │
├─────────────────────────────────┤
│ Describe Your Image:            │
│ [Textarea - large]              │
│ "Landscape foto Candi Borobudur │
│  saat sunrise dengan..."        │
│                                 │
│ Negative Prompt (optional):     │
│ [Textarea - small]              │
│ "blurry, low quality..."        │
│                                 │
│ [✨ Enhance Prompt]             │
│                                 │
│ ─────────────────────────────   │
│                                 │
│ Title:                          │
│ [Input]                         │
│                                 │
│ Description:                    │
│ [Textarea]                      │
│                                 │
│ Tags:                           │
│ [batik] [java] [+]              │
│                                 │
│ [⚡ Generate]                   │
│ [💾 Save to Library]            │
│ [⬇️ Download]                   │
└─────────────────────────────────┘
```

#### Generate Button Behavior

**States:**
1. **Ready:** "⚡ Generate" (emas, large)
2. **Loading:** 
   - Button disabled
   - Spinner icon
   - Text: "Sedang membuat varian…"
   - Progress: "25% • Membuat komposisi…"
3. **Success:**
   - Variants muncul di thumbnails
   - Toast: "4 varian berhasil dibuat"
   - Button kembali ke Ready
4. **Error:**
   - Button merah
   - Text: "Generate Gagal"
   - Tooltip: error message
   - Auto-reset ke Ready setelah 3s

#### Loading Skeleton (During Generation)

**Canvas Area:**
- Skeleton placeholder dengan shimmer
- Text: "Sedang membuat varian… 45%"
- Estimated time: "~30 detik tersisa"

**Thumbnails:**
- 4 skeleton cards dengan shimmer

#### Actions After Generation

**Save to Library:**
- Click → modal pilih variant mana yang mau disave
- Multi-select possible
- Toast: "3 gambar disimpan ke Library"

**Download:**
- Single download: click ⬇️ di thumbnail
- Bulk download: select multiple → "Download All" button
- Format options: PNG, JPG, WebP

**Create Variations:**
- Button: "Buat Variasi Lagi"
- Generate more variants from selected image
- Settings: "Mirip" (strength slider)

#### Mock Templates (6 examples)

```
1. Batik Pattern Generator
   - Seamless tileable batik patterns
   - Color customization
   - Traditional / modern styles

2. Tourism Poster
   - Hero image + text overlay
   - Customizable headline & tagline
   - Landscape / portrait

3. Cultural Heritage Banner
   - Wide format for web headers
   - Blend culture object + typography
   
4. Social Media Post
   - Square 1:1 for Instagram
   - Pre-designed layouts
   - Text areas

5. Logo / Icon Set
   - Cultural symbols as logos
   - Vector-style output
   - Multiple color variants

6. Product Mockup
   - Batik on products (shirt, bag, etc)
   - Tourism branding mockups
```

#### Empty State (Image Studio)

**Visual:**
```
      ✨ (Icon 80px)
      
  Welcome to Image Studio
  
  Generate stunning visuals inspired by
  Indonesian culture.
  
  [Start with Template]
  [Upload Image]
  [Write Prompt]
```

---

### 4.2 VIDEO STUDIO

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ TOP CONTROLS                                         │
│ [Template Selector] [Aspect Ratio] [Duration]        │
├──────────────────────────────────────────────────────┤
│ TIMELINE / STORYBOARD AREA                           │
│ [Scene 1] [Scene 2] [Scene 3] [Scene 4] [+]          │
├──────────────────────────────────────────────────────┤
│                                                      │
│ PREVIEW PLAYER (Center)                              │
│ [Video Preview dengan controls]                      │
│                                                      │
├──────────────────────────────────────────────────────┤
│ RIGHT PANEL                                          │
│ - Scene editor                                       │
│ - Music selector                                     │
│ - Transition options                                 │
│ - Text overlays                                      │
│ - Export settings                                    │
└──────────────────────────────────────────────────────┘
```

#### Top Controls Bar

**Template Selector:**
```
Template: [Tourism 10s ▼]

Dropdown:
- Tourism Promo (10s)
- Documentary Style (60s)
- Social Media Short (15s)
- Festival Highlight (30s)
- Cultural Story (45s)
- Custom (user-defined)
```

**Aspect Ratio:**
```
[16:9] [9:16] [1:1] [4:5]
```
- 16:9 untuk YouTube/web
- 9:16 untuk TikTok/Stories
- 1:1 untuk Instagram Feed
- 4:5 untuk Instagram optimal

**Duration Slider:**
```
Duration: [10s ────●──── 90s]
```
- Adjustable dari 5s sampai 120s
- Preset buttons: [10s] [15s] [30s] [60s]

#### Timeline / Storyboard Area

**Visual:**
```
┌──────────────────────────────────────────────────┐
│ [Scene 1]  [Scene 2]  [Scene 3]  [Scene 4]  [+] │
│  0-2.5s     2.5-5s     5-7.5s     7.5-10s        │
│                                                  │
│  [Thumb]   [Thumb]    [Thumb]    [Thumb]        │
│  "Intro"   "Main"     "Action"   "Outro"        │
│                                                  │
│  [Duration: 2.5s ▼]  [Transition: Fade ▼]       │
└──────────────────────────────────────────────────┘
```

**Scene Card:**
- Thumbnail preview (placeholder)
- Scene label (editable)
- Duration indicator
- Drag handles untuk reorder
- Transition dropdown di antara scenes

**Timeline Scrubber:**
- Visual timeline di bawah scenes
- Playhead yang bisa di-drag
- Time markers (0s, 5s, 10s, ...)

**Add Scene Button [+]:**
- Click → dropdown:
  - Add from Library
  - Generate Image
  - Record Video (UI placeholder)
  - Upload New

#### Preview Player (Center)

**Player Controls:**
```
┌─────────────────────────────────┐
│                                 │
│      [Video Preview Area]       │
│         (Placeholder)           │
│                                 │
├─────────────────────────────────┤
│ [◀◀] [▶️ / ⏸] [▶▶]             │
│ 0:00 ═════●══════════ 0:10      │
│ [🔇] [⚙️] [⛶]                   │
└─────────────────────────────────┘
```

**Controls:**
- Play / Pause (spacebar)
- Previous / Next scene
- Timeline scrubber (seekable)
- Volume control
- Settings (quality, playback speed)
- Fullscreen toggle

**Preview States:**
- **Empty:** "Tambahkan scene untuk mulai preview"
- **Loading:** "Rendering preview…" + progress
- **Playing:** Video plays dengan preview
- **Error:** "Preview tidak tersedia. Coba refresh"

#### Right Panel (Scene Editor)

**Current Scene Edit:**
```
┌─────────────────────────────────┐
│ EDIT SCENE 1                    │
├─────────────────────────────────┤
│ Media:                          │
│ [Thumbnail] Change              │
│                                 │
│ Duration: [2.5s] ─●─ [5s]       │
│                                 │
│ Text Overlay:                   │
│ [Input: "Selamat Datang"]       │
│ Font: [Montserrat ▼]            │
│ Size: ─────●──── 24px           │
│ Position: [Center ▼]            │
│ Animation: [Fade In ▼]          │
│                                 │
│ Filters:                        │
│ Brightness: ───●─── 100%        │
│ Contrast: ───●─── 100%          │
│ Saturation: ───●─── 100%        │
│                                 │
│ [Apply] [Reset]                 │
└─────────────────────────────────┘
```

**Music & Audio:**
```
┌─────────────────────────────────┐
│ MUSIC                           │
├─────────────────────────────────┤
│ Preset:                         │
│ [Traditional ▼]                 │
│ - Traditional Gamelan           │
│ - Modern Upbeat                 │
│ - Cinematic Epic                │
│ - No Music                      │
│                                 │
│ Volume: ═════●════ 80%          │
│                                 │
│ [Upload Custom Music]           │
│                                 │
│ Voiceover (optional):           │
│ [Record] [Upload]               │
└─────────────────────────────────┘
```

**Transitions:**
```
┌─────────────────────────────────┐
│ TRANSITIONS                     │
├─────────────────────────────────┤
│ Between Scene 1 → 2:            │
│ [Fade ▼]                        │
│ - None                          │
│ - Fade                          │
│ - Dissolve                      │
│ - Slide                         │
│ - Zoom                          │
│                                 │
│ Duration: [0.5s ▼]              │
└─────────────────────────────────┘
```

**Export Settings:**
```
┌─────────────────────────────────┐
│ EXPORT                          │
├─────────────────────────────────┤
│ Quality:                        │
│ ◉ High (1080p)                  │
│ ○ Medium (720p)                 │
│ ○ Draft (480p)                  │
│                                 │
│ Format:                         │
│ [MP4 ▼]                         │
│                                 │
│ Estimated Size: ~25 MB          │
│ Render Time: ~2 min             │
│                                 │
│ [⚡ Render & Export]            │
│ [💾 Save Project]               │
└─────────────────────────────────┘
```

#### Template Presets (Auto-fill Behavior)

**Tourism 10s Template:**
Memilih template ini akan auto-populate:
```
Scene 1 (2s): Hero shot destinasi + title overlay
Scene 2 (3s): Aktivitas / atraksi utama
Scene 3 (3s): Budaya / kuliner
Scene 4 (2s): CTA + logo

Music: Upbeat traditional blend
Transitions: Smooth fades
Text: Pre-styled with brand colors
```

**UI Behavior saat pilih template:**
- Loading animation ~1s
- Storyboard auto-fill dengan placeholder images
- Toast: "Template 'Tourism 10s' diterapkan"
- User bisa customize tiap scene

#### Mock Music Presets

```
1. Traditional Gamelan
   - Calm, cultural
   - Best for: documentaries, heritage

2. Modern Upbeat
   - Energetic, contemporary fusion
   - Best for: tourism, ads

3. Cinematic Epic
   - Dramatic, emotional
   - Best for: storytelling, trailers

4. Ambient Chill
   - Relaxed, background
   - Best for: tutorials, showcases
```

#### Loading States (Video Studio)

**Rendering Preview:**
```
🎬 Rendering preview…
●●●●●●●●●●░░░░░ 65%

Rendering Scene 3 of 4
Estimated: 15 seconds remaining
```

**Export/Render:**
```
⚡ Exporting video…
●●●●●●●●░░░░░░░ 60%

Encoding: H.264 • 1080p
Size: 18.5 MB / ~25 MB
Time: 1min 20s / ~2min

[Cancel Export]
```

#### Empty State (Video Studio)

**Visual:**
```
      🎬 (Icon 80px)
      
  Create Engaging Videos
  
  Start with a template or build
  your storyboard from scratch.
  
  [Choose Template]
  [Start Blank Project]
```

#### Error States

**Render Failed:**
```
⚠️ Render Gagal

Video tidak dapat di-render. Coba:
• Kurangi durasi atau kualitas
• Periksa semua scene memiliki media valid
• Refresh dan coba lagi

[Retry Render] [Save Draft]
```

---

### 4.3 AUDIO STUDIO

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ TOP CONTROLS                                         │
│ [Mode: Record / TTS / Upload] [Voice Preset]         │
├──────────────────────────────────────────────────────┤
│                                                      │
│ WAVEFORM DISPLAY (Center)                            │
│ [Audio Waveform Visualization]                       │
│                                                      │
├──────────────────────────────────────────────────────┤
│ AUDIO CONTROLS                                       │
│ [◀◀] [▶️] [⏸] [⏹] [Recording ●]                     │
│ 0:00 ═══●════════════ 0:45 • 48 kHz • Stereo        │
├──────────────────────────────────────────────────────┤
│ RIGHT PANEL                                          │
│ - TTS Input (if TTS mode)                            │
│ - Voice selection                                    │
│ - Audio effects                                      │
│ - Export options                                     │
└──────────────────────────────────────────────────────┘
```

#### Top Controls Bar

**Mode Selector:**
```
[🎤 Record] [🗣️ Text-to-Speech] [⬆️ Upload]
```
- Active: emas background
- Toggle changes input panel

**Voice Preset (for TTS mode):**
```
Voice: [Formal Male ▼]

Dropdown:
- Formal Male (Announcer style)
- Formal Female (Narrator style)
- Casual Male (Friendly)
- Casual Female (Warm)
- Child Voice
- Elder Voice
```

#### Waveform Display (Center)

**Visual:**
```
┌────────────────────────────────────────┐
│                                        │
│    [Waveform Visualization]            │
│    ▁▂▃▅▆▇█▇▆▅▃▂▁▁▂▃▅▆▇█▇▆▅▃▂▁          │
│                                        │
│    ├─●───────────────────────┤         │
│    0:00                      0:45      │
└────────────────────────────────────────┘
```

**Features:**
- Real-time waveform saat record/play
- Seekable playhead (drag untuk navigate)
- Zoom in/out controls: [−] [100%] [+]
- Selection tool: select portion untuk edit/cut
- Markers: add markers untuk timestamps

**Empty State:**
```
      🎙️ (Icon)
      
  No audio loaded
  
  Record, generate with TTS, or
  upload an audio file
```

#### Audio Controls (Bottom of Waveform)

**Playback Controls:**
- Skip back 5s: [◀◀]
- Play / Pause: [▶️ / ⏸]
- Stop: [⏹]
- Skip forward 5s: [▶▶]

**Recording Controls (jika mode Record):**
- Record button: [● REC]
  - Not recording: abu
  - Recording: merah pulsing
  - Click to start, click again to stop
- Input level meter: ▓▓▓▓▓▓░░░░

**Timeline:**
- Current time: 0:00
- Scrubber: seekable
- Total duration: 0:45
- Metadata: 48 kHz, Stereo, MP3

#### Right Panel (Mode-specific)

**FOR RECORD MODE:**
```
┌─────────────────────────────────┐
│ RECORD                          │
├─────────────────────────────────┤
│ Input Device:                   │
│ [Default Microphone ▼]          │
│                                 │
│ Input Level:                    │
│ ▓▓▓▓▓▓░░░░ (Auto-adjust)        │
│                                 │
│ Quality:                        │
│ ◉ High (48 kHz)                 │
│ ○ Standard (44.1 kHz)           │
│                                 │
│ [● Start Recording]             │
│                                 │
│ Recorded Duration: 0:00         │
│                                 │
│ [⏹ Stop] [🗑️ Discard]           │
└─────────────────────────────────┘
```

**FOR TTS MODE:**
```
┌─────────────────────────────────┐
│ TEXT-TO-SPEECH                  │
├─────────────────────────────────┤
│ Voice:                          │
│ [Formal Male ▼]                 │
│                                 │
│ Language:                       │
│ [Bahasa Indonesia ▼]            │
│                                 │
│ Text Input:                     │
│ ┌─────────────────────────────┐ │
│ │ Ketik atau paste teks untuk │ │
│ │ diubah menjadi audio…        │ │
│ │                             │ │
│ │ Contoh:                     │ │
│ │ "Selamat datang di Museum   │ │
│ │  Nasional Indonesia..."     │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Character count: 0 / 500        │
│                                 │
│ Speed: ──●── 1.0x               │
│ Pitch: ──●── 0 (normal)         │
│                                 │
│ [Preview] [Generate]            │
│                                 │
│ Estimated length: ~0:30         │
└─────────────────────────────────┘
```

**FOR UPLOAD MODE:**
```
┌─────────────────────────────────┐
│ UPLOAD AUDIO                    │
├─────────────────────────────────┤
│ [Drag & Drop Area]              │
│                                 │
│ or                              │
│                                 │
│ [Choose File]                   │
│                                 │
│ Supported: MP3, WAV, M4A        │
│ Max size: 50 MB                 │
│                                 │
│ [📁 From Library]               │
└─────────────────────────────────┘
```

**AUDIO EFFECTS (untuk semua mode):**
```
┌─────────────────────────────────┐
│ EFFECTS                         │
├─────────────────────────────────┤
│ Volume: ═════●════ 100%         │
│                                 │
│ Fade In: [None ▼]               │
│ Fade Out: [2s ▼]                │
│                                 │
│ Noise Reduction:                │
│ ░░░░░●░░░░ Low                  │
│                                 │
│ Background Music (optional):    │
│ [None ▼]                        │
│ - Soft Gamelan                  │
│ - Ambient Soundscape            │
│ - None                          │
│                                 │
│ Mix Volume: ═══●══ 30%          │
│                                 │
│ [Apply Effects]                 │
└─────────────────────────────────┘
```

**EXPORT OPTIONS:**
```
┌─────────────────────────────────┐
│ EXPORT                          │
├─────────────────────────────────┤
│ Format:                         │
│ [MP3 ▼]                         │
│ - MP3 (recommended)             │
│ - WAV (lossless)                │
│ - M4A (Apple)                   │
│                                 │
│ Quality:                        │
│ ◉ High (320 kbps)               │
│ ○ Standard (192 kbps)           │
│ ○ Low (128 kbps)                │
│                                 │
│ Title:                          │
│ [Input]                         │
│                                 │
│ [💾 Save to Library]            │
│ [⬇️ Download]                   │
└─────────────────────────────────┘
```

#### TTS Generate Behavior

**Click "Generate":**
1. Button disabled, spinner
2. Text: "Generating audio… 0%"
3. Progress: 0% → 100% (~5-15s depending on length)
4. Waveform muncul setelah selesai
5. Auto-play preview
6. Toast: "Audio berhasil dibuat"

**Preview vs Generate:**
- Preview: quick low-quality generation untuk testing (~2s)
- Generate: full quality production (~10s)

#### Voice Preset Examples (Mock)

```
1. Formal Male
   - Deep, authoritative
   - Best for: documentaries, announcements

2. Formal Female
   - Clear, professional narrator
   - Best for: educational, tours

3. Casual Male
   - Friendly, approachable
   - Best for: promos, social content

4. Casual Female
   - Warm, inviting
   - Best for: tourism, hospitality

5. Child Voice
   - Young, energetic
   - Best for: kids content

6. Elder Voice
   - Wise, traditional storyteller
   - Best for: legends, cultural stories
```

#### Mock TTS Text Examples (Placeholder)

```
"Selamat datang di Museum Nasional Indonesia. Di sini Anda akan menemukan koleksi artefak budaya dari seluruh Nusantara, mulai dari prasasti kuno hingga perhiasan kerajaan."

"Candi Borobudur adalah candi Buddha terbesar di dunia. Dibangun pada abad ke-8, candi ini memiliki 504 arca Buddha dan 2.672 panel relief yang menceritakan perjalanan menuju pencerahan."

"Batik adalah warisan budaya Indonesia yang diakui UNESCO. Setiap motif memiliki makna filosofis yang dalam, mencerminkan nilai-nilai kehidupan dan alam semesta."
```

#### Empty State (Audio Studio)

**Visual:**
```
      🎙️ (Icon 80px)
      
  Create Voice & Sound
  
  Record narration, generate text-to-speech,
  or upload audio for your projects.
  
  [Start Recording]
  [Generate from Text]
  [Upload Audio]
```

---

### 4.4 SCRIPT WRITER

**Purpose:** Tool untuk menulis naskah/script untuk video, narasi audio, atau artikel budaya.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ TOP BAR                                              │
│ [Template] [AI Assist] [Word Count] [Export]         │
├────────────┬─────────────────────────────────────────┤
│ OUTLINE    │ EDITOR AREA (Main)                      │
│ (Sidebar)  │                                         │
│            │ [Rich text editor]                      │
│ • Act 1    │ [Script content]                        │
│   - Scene1 │                                         │
│   - Scene2 │                                         │
│ • Act 2    │                                         │
│   - Scene3 │                                         │
│            │                                         │
│ [+ Add]    │                                         │
└────────────┴─────────────────────────────────────────┘
```

**Templates:**
- Tourism Narration (2 min)
- Documentary Script (5 min)
- Social Media Caption
- Museum Audio Guide
- Cultural Story Article

**AI Assist Features:**
- "Continue writing" button
- "Improve grammar" button
- "Make more engaging" button
- "Translate to English" button

**Mock Output:**
```
[SCENE 1: AERIAL SHOT]
Narrator: "Di jantung Jawa Tengah, berdiri sebuah keajaiban arsitektur..."

[SCENE 2: CLOSE-UP RELIEF]
Narrator: "Setiap relief menceritakan kisah perjalanan spiritual..."
```

---

### 4.5 TOURISM KIT

**Purpose:** Generate paket marketing lengkap untuk destinasi wisata (dari Culture analysis atau manual).

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ INPUT                                                │
│ [Select from Culture Results / Upload / Manual]      │
├──────────────────────────────────────────────────────┤
│ GENERATED ASSETS PREVIEW                             │
│                                                      │
│ ┌───────────────┐  ┌───────────────┐                │
│ │ Slogan Card   │  │ Banner 1      │                │
│ │ "Jelajahi     │  │ [Visual Mock] │                │
│ │  Keindahan"   │  │               │                │
│ └───────────────┘  └───────────────┘                │
│                                                      │
│ ┌───────────────┐  ┌───────────────┐                │
│ │ Banner 2      │  │ Social Posts  │                │
│ │ [Visual Mock] │  │ [4 variants]  │                │
│ └───────────────┘  └───────────────┘                │
│                                                      │
│ ┌─────────────────────────────────┐                 │
│ │ Promo Video (10s)               │                 │
│ │ [Video Player Placeholder]      │                 │
│ └─────────────────────────────────┘                 │
│                                                      │
│ ┌─────────────────────────────────┐                 │
│ │ Itinerary (3 days / 2 nights)   │                 │
│ │ Day 1: Arrival & City Tour      │                 │
│ │ Day 2: Cultural Immersion       │                 │
│ │ Day 3: Departure                │                 │
│ └─────────────────────────────────┘                 │
│                                                      │
│ [Edit Individual] [Regenerate All] [Export Package] │
└──────────────────────────────────────────────────────┘
```

**Generated Assets (Mock):**
1. **Slogan Card:**
   - Headline yang catchy
   - Subheadline
   - Visual with destination image

2. **Banner 1 (Web Header):**
   - 1920×600px
   - Hero image + text overlay

3. **Banner 2 (Print Poster):**
   - A3 size
   - Detailed info + QR code

4. **Social Media Posts (4 variants):**
   - Instagram square
   - Instagram story
   - Facebook post
   - Twitter card

5. **Promo Video (10s):**
   - Auto-generated dari template Video Studio
   - 3-4 scenes highlight

6. **Itinerary Suggestion:**
   - Day-by-day plan
   - Activities, meals, accommodation notes
   - Estimated costs (mock)

**Edit Flow:**
- Klik "Edit Individual" pada asset → buka editor untuk asset tsb
- Klik "Regenerate All" → generate ulang semua assets dengan AI
- Klik "Export Package" → download semua assets sebagai ZIP

**Empty State:**
```
      ✈️ (Icon 80px)
      
  Create Tourism Marketing Kit
  
  Generate complete marketing materials
  for any Indonesian destination.
  
  [Start from Culture Result]
  [Manual Input]
```

---

### 4.6 COMMERCIAL MAKER

**Purpose:** Buat iklan video/audio untuk produk atau jasa budaya.

**Flow:**
```
Step 1: Choose Template
  → Tourism Ad (15s)
  → Product Showcase (30s)
  → Event Promo (20s)
  → Brand Story (60s)

Step 2: Select Assets
  → Choose images/videos from Library
  → Or generate new with Image/Video Studio

Step 3: Storyboard Auto-filled
  → Scenes populated based on template
  → User dapat edit tiap scene

Step 4: Quick Preview
  → Preview modal dengan generated video

Step 5: Export
  → Download atau save to projects
```

**Layout (Step 3 - Storyboard):**
```
┌──────────────────────────────────────────────────────┐
│ COMMERCIAL MAKER: Tourism Ad (15s)                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ [Scene 1: Hook]      [Scene 2: Show]                 │
│ "Pernahkah Anda...   [Product/Destination Visual]    │
│  bermimpi..."                                        │
│                                                      │
│ [Scene 3: Benefit]   [Scene 4: CTA]                  │
│ "Dapatkan experience "Pesan sekarang di..."         │
│  yang tak terlupakan"                                │
│                                                      │
│ Music: [Upbeat ▼]    Voiceover: [Yes / No]           │
│                                                      │
│ [Preview] [Edit Scenes] [Export]                     │
└──────────────────────────────────────────────────────┘
```

---

### 4.7 MY CREATIVE PROJECTS

**Purpose:** Daftar semua projects yang disave dari Creative studios.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ MY CREATIVE PROJECTS                                 │
│ [Search] [Filter: All / Images / Videos / Audio]     │
├──────────────────────────────────────────────────────┤
│                                                      │
│ [Project Card] [Project Card] [Project Card]         │
│ [Project Card] [Project Card] [Project Card]         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Project Card:**
```
┌──────────────────┐
│  [Thumbnail]     │
│                  │
│ Project Title    │
│ Image • 5 hours  │
│ [Open] [⋮]       │
└──────────────────┘
```

**Overflow menu [⋮]:**
- Rename
- Duplicate
- Export
- Delete

**Empty State:**
```
      📂 (Icon 80px)
      
  No Projects Yet
  
  Projects you save from Creative studios
  will appear here.
  
  [Go to Image Studio]
```

---

### Empty State (All Creative Studios)

**Consistent Pattern:**
```
[Relevant Icon 80px]

[Title]

[Description 2 lines]

[Primary CTA Button]
[Secondary CTA Button (optional)]
```

---

### Loading States (Creative)

**Image Generation:**
```
✨ Generating images…
●●●●●●●●░░░░░░ 60%

Creating variations...
~15 seconds remaining

[Cancel]
```

**Video Rendering:**
```
🎬 Rendering video…
●●●●●●░░░░░░░░ 40%

Encoding Scene 2 of 4
~1 minute 30 seconds remaining

[Cancel Render]
```

**TTS Generation:**
```
🗣️ Generating speech…
●●●●●●●●●●●●●░ 90%

Processing audio...
~5 seconds remaining
```

---

### Error States (Creative)

**Generation Failed:**
```
⚠️ Generation Gagal

Tidak dapat membuat [asset type]. Kemungkinan:
• Prompt terlalu kompleks
• Server sedang sibuk
• File terlalu besar

[Try Again] [Simplify Prompt] [Contact Support]
```

**Quota Exceeded (if applicable):**
```
⚠️ Limit Tercapai

Anda telah mencapai batas generate untuk hari ini.

Upgrade ke Premium untuk unlimited generation.

[View Plans] [Try Tomorrow]
```

---

### Accessibility (Creative)

- All studios keyboard navigable
- Focus states jelas pada semua controls
- Screen reader labels untuk semua buttons
- Alt text untuk generated previews
- Keyboard shortcuts:
  - Ctrl/Cmd + S: Save project
  - Space: Play/Pause (video/audio)
  - Ctrl/Cmd + Z: Undo
  - Ctrl/Cmd + Y: Redo

---

### Microcopy (Creative - Bahasa Indonesia)

**Image Studio:**
- Generate: "Sedang membuat varian…"
- Success: "4 varian berhasil dibuat"
- Save: "Disimpan ke Library"
- Download: "Mengunduh gambar…"
- Error: "Generate gagal. Coba lagi"

**Video Studio:**
- Render: "Rendering video… 45%"
- Add scene: "Scene ditambahkan"
- Export: "Exporting video… Estimasi 2 menit"
- Success: "Video berhasil di-export"
- Error: "Render gagal. Coba kurangi durasi"

**Audio Studio:**
- Recording: "Recording… 0:15"
- Generate TTS: "Generating audio… 80%"
- Success: "Audio berhasil dibuat"
- Save: "Disimpan ke Library"
- Error: "Gagal generate audio. Coba lagi"

**Tourism Kit:**
- Generate: "Membuat paket marketing…"
- Success: "Tourism kit siap!"
- Export: "Mengunduh package… 8.5 MB"

**General Creative:**
- Template applied: "Template '[name]' diterapkan"
- Save project: "Project disimpan"
- Delete confirm: "Hapus project ini?"
- Duplicate: "Project diduplikasi"

---

## 5️⃣ UX RULES & IMPLEMENTATION DETAILS

### Global Navigation Behavior

**Section Switching:**
- User klik menu utama: Chat / Library / Culture / Creative
- Sidebar content berganti sesuai section
- Main content area berganti sesuai section
- Smooth transition (fade 200ms)
- Breadcrumb update (jika ada)
- Active state di navigation terpelihara

**Deep Linking (Optional Enhancement):**
- URL update saat navigasi: `/culture/identify`, `/library/images`
- Back button browser berfungsi
- Shareable URLs

### State Management Principles

**Loading States:**
- Show skeleton/placeholder ASAP
- Progressive loading (load critical first)
- Loading text deskriptif: "Menganalisis motif…" bukan "Loading…"
- Progress indicators kalau process > 3 detik
- Cancel option kalau process > 5 detik

**Empty States:**
- NEVER show "No data" saja
- ALWAYS berikan konteks dan CTA
- Illustrative icon atau image
- Clear next action
- Helpful suggestion

**Error States:**
- User-friendly message (bukan error code)
- Suggest concrete action
- Offer alternative (retry, contact support)
- Don't blame user
- Log error di background (untuk debugging)

**Success States:**
- Clear confirmation (toast, modal, visual change)
- Brief duration (3-4s for toasts)
- Don't interrupt workflow unless critical
- Visual feedback (checkmarks, color change)

### Form & Input Behavior

**Real-time Validation:**
- Validate on blur (saat user pindah field)
- Show error inline di bawah field
- Red border untuk error field
- Green border untuk valid field
- Character count untuk textarea (jika ada limit)

**Search:**
- Debounce input 300ms (tunggu user berhenti ketik)
- Show "Searching…" state
- Clear button (X) muncul saat ada input
- Show result count: "5 hasil ditemukan"
- Highlight matched terms

**Autocomplete/Suggestions:**
- Show after 2+ karakter diketik
- Max 5-8 suggestions
- Keyboard navigable (↑↓ arrow keys)
- Enter untuk select
- ESC untuk dismiss

### Modal & Overlay Patterns

**Opening:**
- Fade backdrop (200ms)
- Modal scale + fade in (180ms from 0.95 to 1.0)
- Focus trap activated
- Body scroll locked
- ESC handler attached

**Closing:**
- Reverse animation
- Focus return ke trigger element
- Remove event listeners
- Unlock body scroll

**Stacking:**
- Jika multiple modals, track z-index
- Backdrop darkness increase per layer
- ESC closes topmost modal only

### Responsive Breakpoints Detailed

**Mobile (< 768px):**
- Sidebar becomes drawer (hamburger menu)
- Cards: 1 column, full width minus padding
- Topbar: compact (logo + hamburger + profile only)
- Modals: full-screen (slide up from bottom)
- Font sizes: slightly smaller (-1 to -2px)
- Touch targets: MUST be 44×44px minimum
- Hover states: replaced with active/pressed states

**Tablet (768px - 1024px):**
- Sidebar: can be toggled (overlay or pinned)
- Cards: 2 columns
- Modals: centered, 80% width
- Hybrid interactions (touch + mouse)

**Desktop (> 1024px):**
- Sidebar: always visible, pinned
- Cards: 3-4 columns
- Hover states active
- Keyboard shortcuts enabled
- Tooltips on hover
- Context menus on right-click

**Large Desktop (> 1400px):**
- Max content width: 1400px (centered)
- Extra whitespace on sides
- Larger images/previews
- Optional: show more info per card

### Animation Performance

**What to Animate:**
- opacity (fade)
- transform (translate, scale)
- background-color (transitions)

**What NOT to Animate (performance killers):**
- width/height (causes reflow)
- top/left/right/bottom (use transform)
- box-shadow (use opacity on shadow element)

**Easing Functions:**
- Entrance: ease-out atau cubic-bezier(0.2, 0, 0.2, 1)
- Exit: ease-in atau cubic-bezier(0.4, 0, 1, 1)
- Transition: ease-in-out atau cubic-bezier(0.4, 0, 0.2, 1)

**Duration Guidelines:**
- Micro-interactions: 80-120ms (button hover, checkbox)
- Small components: 150-200ms (tooltip, dropdown)
- Medium components: 200-300ms (modal, drawer)
- Large components: 300-400ms (page transition)
- NEVER > 500ms (feels sluggish)

### Keyboard Navigation

**Tab Order:**
- Logical, left-to-right, top-to-bottom
- Skip repeated navigation dengan "Skip to content" link
- Focus visible dengan outline (emas, 2px)

**Shortcuts (Global):**
- `/` : Focus search
- `ESC` : Close modal/dropdown/drawer
- `Ctrl/Cmd + K` : Command palette (opsional)
- `?` : Show keyboard shortcuts help

**In Grids:**
- Arrow keys: navigate between cards
- Enter: open item
- Space: select item (if selectable)

**In Forms:**
- Tab: next field
- Shift+Tab: previous field
- Enter: submit (if appropriate)

### Touch Gestures (Mobile)

**Common Gestures:**
- **Tap:** Select, activate
- **Long Press:** Context menu, select mode
- **Swipe Left/Right:** Navigate, reveal actions
- **Swipe Down:** Refresh (pull-to-refresh)
- **Pinch:** Zoom (images, maps)
- **Two-finger swipe:** Scroll within container

**Implementation Notes:**
- Provide visual feedback immediately on touch
- Ripple effect dari touch point
- Prevent double-tap zoom (jika not desired)
- Handle accidental touches (debounce)

### Accessibility (A11y) Requirements

**WCAG AA Compliance Minimum:**

1. **Color Contrast:**
   - Normal text: 4.5:1
   - Large text (18px+): 3:1
   - Interactive elements: 3:1 against background

2. **Focus Indicators:**
   - Visible focus ring (emas, 2px solid)
   - NEVER remove focus outlines
   - Custom focus states must be clear

3. **Alt Text:**
   - All images: meaningful alt text
   - Decorative images: empty alt=""
   - Icons: aria-label or sr-only text

4. **Semantic HTML:**
   - Use semantic tags (header, nav, main, aside, footer)
   - Headings hierarchical (h1 → h2 → h3, no skipping)
   - Lists untuk repeated items
   - Buttons untuk actions, links untuk navigation

5. **ARIA Labels:**
   - aria-label untuk icons tanpa text
   - aria-describedby untuk additional context
   - aria-live untuk dynamic updates (toasts, loading states)
   - role attributes where necessary

6. **Keyboard Operability:**
   - All interactive elements keyboard accessible
   - Logical tab order
   - No keyboard traps (except modals with ESC escape)

7. **Screen Reader Support:**
   - Test dengan screen reader
   - Announce state changes
   - Loading states announced
   - Error messages announced

---

## 6️⃣ COMPLETE COPY & MICROCOPY REFERENCE

### Bahasa Indonesia - Tone & Voice

**Tone:**
- Ramah tapi profesional
- Informatif tapi tidak terlalu formal
- Menggunakan "Anda" (bukan "kamu" untuk consistency)
- Hindari slang atau bahasa gaul
- Jelas dan langsung to the point

**Voice Characteristics:**
- Helpful: guide user dengan jelas
- Respectful: hormati budaya dan user
- Encouraging: motivasi user untuk explore
- Informative: edukasi tanpa menggurui
- Celebratory: apresiasi hasil dan achievement

---

### Microcopy by Context

#### Upload / Input

**Initial State:**
- "Tarik file ke sini atau klik untuk memilih"
- "Unggah gambar motif, kain, atau objek budaya"
- "Format: JPG, PNG (Max 10MB)"
- "Pilih gambar" (button text)
- "Gunakan kamera" (button text)

**Drag Over:**
- "Lepaskan untuk unggah"
- "Siap untuk diproses"

**Uploading:**
- "Mengunggah… 45%"
- "Menyimpan file…"
- "Hampir selesai…"

**Success:**
- "Berhasil diunggah!"
- "File disimpan di Library"
- "Siap untuk dianalisis"

**Error:**
- "Gagal mengunggah. Coba lagi"
- "File terlalu besar. Maksimal 10MB"
- "Format tidak didukung. Gunakan JPG atau PNG"

#### Loading / Processing

**Quick (<3s):**
- "Memproses…"
- "Sebentar…"

**Medium (3-10s):**
- "Menganalisis motif…"
- "Sedang membuat varian…"
- "Rendering preview…"

**Long (>10s):**
- "Butuh waktu sedikit — terima kasih sabar menunggu"
- "Proses ini mungkin memakan waktu 1-2 menit"
- "Hampir selesai, mohon tunggu sebentar"

**With Progress:**
- "Menganalisis… 25%"
- "Membuat video… 60% • Scene 3 of 4"
- "Exporting… 1 menit 30 detik tersisa"

#### Success Messages

**Save Actions:**
- "Berhasil disimpan di Library"
- "Project disimpan"
- "Perubahan tersimpan"

**Create Actions:**
- "4 varian berhasil dibuat"
- "Video berhasil di-export"
- "Audio berhasil dibuat"
- "Tourism kit siap!"

**Delete Actions:**
- "File dipindahkan ke Trash"
- "Project dihapus"
- "Berhasil dihapus"

**Other Success:**
- "Link disalin"
- "File dipulihkan ke Library"
- "Nama file diperbarui"
- "Ditambahkan ke Favorit"

#### Error Messages

**Generic Errors:**
- "Terjadi kesalahan. Coba lagi"
- "Tidak dapat memproses. Refresh halaman"
- "Koneksi terputus. Periksa internet Anda"

**Specific Errors:**
- "Preview tidak tersedia"
- "File tidak dapat dibuka"
- "Generate gagal. Coba prompt lebih sederhana"
- "Render gagal. Coba kurangi durasi atau kualitas"
- "Analisis tidak berhasil. Coba gambar lebih jelas"

**Quota/Limit Errors:**
- "Limit tercapai untuk hari ini"
- "Maksimal 6 file dapat dipilih"
- "File terlalu besar. Maksimal 100MB"

#### Confirmation Prompts

**Delete Confirmations:**
- "Hapus file ini? File akan dipindah ke Trash"
- "Kosongkan Trash? X file akan dihapus permanen. Tindakan ini tidak dapat dibatalkan"
- "Hapus project ini? Tindakan tidak dapat dibatalkan"

**Discard Confirmations:**
- "Buang perubahan? Perubahan yang belum disimpan akan hilang"
- "Keluar tanpa menyimpan?"

**Overwrite Confirmations:**
- "File dengan nama yang sama sudah ada. Timpa?"

#### Empty States

**Chat:**
- "Belum ada saved chat. Tekan tombol Simpan pada pesan untuk menyimpan."

**Library:**
- "Belum ada file. Unggah file pertamamu untuk memulai."
- "Belum ada gambar. Unggah foto atau hasil generate dari Creative."
- "Trash kosong. File yang dihapus akan muncul di sini."

**Culture:**
- "Tarik atau pilih gambar — hasil terbaik bila motif diambil dekat."

**Creative:**
- "Belum ada project. Projects yang disimpan akan muncul di sini."

#### Call-to-Action (CTA) Buttons

**Primary Actions:**
- "Unggah" / "Upload File"
- "Generate"
- "Render & Export"
- "Simpan ke Library"
- "Mulai Chat Baru"
- "Analisis Sekarang"

**Secondary Actions:**
- "Batal" / "Cancel"
- "Coba Lagi" / "Retry"
- "Pelajari Lebih Lanjut"
- "Lihat Detail"
- "Kembali"

**Tertiary Actions:**
- "Lewati"
- "Nanti Saja"
- "Tutup"

#### Tooltips (Hover Help)

**Navigation:**
- "Mulai chat baru"
- "Chat yang baru dibuka"
- "Chat yang kamu simpan"
- "Lihat semua percakapan"
- "Kenali budaya dari gambar"

**Actions:**
- "Tambahkan ke Favorit"
- "Download file"
- "Bagikan"
- "Hapus"
- "Edit nama"
- "Lihat preview"

**Info:**
- "Format didukung: JPG, PNG, MP4"
- "Klik untuk detail"
- "Drag untuk mengatur ulang"

#### Progress & Status

**File Upload:**
- "Mengunggah… 3 dari 5 file"
- "Berhasil: 3 • Gagal: 1"

**Batch Operations:**
- "5 file dipilih"
- "Memproses 3 dari 5 file…"
- "Mengunduh 5 file…"

**Queue Status:**
- "Dalam antrian… Posisi 3"
- "Diproses… Estimasi 2 menit"

#### Helper Text / Hints

**Input Helpers:**
- "Contoh: Batik Megamendung, Tari Saman, Wayang Kulit"
- "Tip: Foto dengan lighting baik akan hasil lebih akurat"
- "Maksimal 500 karakter"
- "Gunakan kata kunci deskriptif untuk hasil terbaik"

**Placeholder Text:**
- "Cari file, nama, tag…"
- "Ketik prompt untuk generate gambar…"
- "Masukkan judul video…"
- "Deskripsikan audio yang ingin dibuat…"

#### Feedback Prompts

**Rating:**
- "Hasil akurat?" (dengan 👍 👎)
- "Apakah ini membantu?"
- "Beri rating pengalaman Anda"

**Correction:**
- "Sampaikan koreksi singkat"
- "Laporkan masalah"
- "Berikan feedback"

**Survey:**
- "Bagikan pendapat Anda (opsional)"
- "Apa yang bisa kami tingkatkan?"

#### Settings & Preferences

**Options:**
- "Aktifkan notifikasi"
- "Mode gelap"
- "Bahasa interface"
- "Kualitas preview"

**Toggles:**
- "Aktif" / "Nonaktif"
- "Ya" / "Tidak"
- "Izinkan" / "Blokir"

#### Time & Dates

**Relative Time:**
- "Baru saja"
- "5 menit lalu"
- "1 jam lalu"
- "2 hari lalu"
- "1 minggu lalu"
- "3 bulan lalu"

**Absolute Dates:**
- "3 Nov 2024"
- "Senin, 3 November 2024"
- "15:30 WIB"

#### Counts & Metrics

**File Counts:**
- "24 files"
- "8 gambar"
- "3 video"
- "Tidak ada file"

**Stats:**
- "85% confidence"
- "Durasi: 0:45"
- "Ukuran: 2.4 MB"
- "Dimensi: 1920 × 1080"

---

### Special Copy for Culture Results

**Ringkasan (Summary):**
- "Kemungkinan: [Nama Budaya]"
- "Wilayah: [Lokasi]"
- "Confidence: 85%"

**What is this:**
- Lead dengan definisi singkat, 1-2 kalimat
- Hindari bahasa terlalu akademis
- Fokus pada essence dan karakteristik unik

**Where from:**
- Nama lokasi spesifik + konteks geografis
- "Pekalongan, Jawa Tengah"
- "Wilayah pesisir utara Jawa"

**How it's made:**
- Langkah bernomor, jelas
- Gunakan present tense
- Sertakan detail sensorik (warna, tekstur)

**Meaning & Context:**
- Jelaskan simbolisme dengan respect
- Historical context singkat
- Penggunaan praktis/ritual
- Hindari generalisasi berlebihan

**Mock Example - Batik Pekalongan:**
```
RINGKASAN:
Batik Tulis Pekalongan
Jawa Tengah, Indonesia
Confidence: 85%

APA INI:
Batik Tulis adalah teknik membuat motif kain dengan cara mencanting malam pada kain mori. Batik Pekalongan terkenal dengan motif pesisir yang penuh warna cerah dan pengaruh multikultural.

DARI MANA:
Pekalongan, Jawa Tengah
Wilayah pesisir utara Jawa, terkenal sebagai "Kota Batik" dengan tradisi tekstil berusia ratusan tahun.

CARA PEMBUATAN:
1. Persiapan Kain - Kain mori dicuci dan dikeringkan untuk menghilangkan kanji
2. Membuat Pola - Pola digambar dengan pensil halus sebagai panduan
3. Mencanting - Malam panas dicanting mengikuti pola dengan hati-hati
4. Pewarnaan - Kain dicelup dalam larutan warna alami atau sintetis
5. Melorod - Malam dihilangkan dengan air mendidih
6. Finishing - Kain dijemur, dicuci, dan disetrika

MAKNA & KONTEKS:
Symbolism: Motif megamendung melambangkan kesabaran, keteduhan, dan pembawa keberuntungan. Pengaruh budaya Tionghoa terlihat dari bentuk awan yang bergulir, mencerminkan akulturasi budaya di kota pelabuhan.

Usage: Dipakai dalam acara formal, pernikahan, upacara adat, dan sebagai warisan budaya yang diwariskan turun-temurun. Kini juga digunakan dalam fashion modern.

Historical Context: Batik Pekalongan berkembang sejak abad 16-17 dengan pengaruh Arab, Tionghoa, dan Eropa karena posisi Pekalongan sebagai kota pelabuhan penting.
```

---

## 7️⃣ ACCEPTANCE CHECKLIST & QUALITY ASSURANCE

### Visual QA Checklist

**Layout & Structure:**
- [ ] Topbar konsisten di semua halaman (logo, search, profile, settings)
- [ ] Sidebar berganti konten sesuai section aktif
- [ ] Main content area padding konsisten (24-32px desktop, 16px mobile)
- [ ] Grid responsive: 3-4 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile)
- [ ] Spacing konsisten (8px, 16px, 24px system)
- [ ] Alignment rapi (left, center, right sesuai konteks)

**Color & Theme:**
- [ ] Warna emas (#C9A04F) digunakan untuk: active states, highlights, primary buttons, accents
- [ ] Background hitam/abu gelap (#0A0A0A, #1A1A1A, #2A2A2A)
- [ ] Text putih/krem untuk readability
- [ ] Contrast ratio minimum 4.5:1 untuk body text
- [ ] Contrast ratio minimum 3:1 untuk interactive elements

**Typography:**
- [ ] Sans-serif untuk UI (buttons, labels, menus)
- [ ] Serif untuk long-form content (Culture stories - opsional)
- [ ] Font sizes readable: minimum 14px body, 12px untuk meta
- [ ] Line height 1.5-1.6 untuk paragraphs
- [ ] Headings hierarchy jelas (size + weight)

**Interaction & Animation:**
- [ ] Hover states ada untuk semua interactive elements
- [ ] Active states visual jelas saat klik
- [ ] Transitions smooth 120-240ms
- [ ] No janky animations (test pada 60fps)
- [ ] Loading states tidak blocking UI (skeleton/progress)

**Accessibility:**
- [ ] Tab navigation works logically
- [ ] Focus indicators visible (emas, 2px)
- [ ] All images have alt text
- [ ] All icons have aria-label atau text
- [ ] Modals trap focus
- [ ] ESC closes all modals/dropdowns
- [ ] Touch targets minimum 44×44px (mobile)
- [ ] Color not sole means of communication

---

### Functionality QA Checklist

#### Sidebar Chat
- [ ] Settings DIHAPUS dari sidebar Chat
- [ ] Urutan items benar: New Chat, Recent Chats, Saved Chats, My Prompts, History
- [ ] Item aktif highlighted dengan emas + border kiri
- [ ] Hover tooltips muncul
- [ ] Saved Chats empty state tampil dengan CTA
- [ ] Recent chats menampilkan preview text + timestamp
- [ ] Klik item navigates correctly

#### Library
- [ ] Sidebar items: All Files, Images, Videos, Audio, Documents, Favorites, Trash
- [ ] Upload button membuka drag-drop overlay
- [ ] Drag-drop area responsive terhadap file drag
- [ ] Search bar filters mock data (client-side)
- [ ] Filter dropdown works (Tipe, Tanggal, Favorit)
- [ ] Sort dropdown changes order (mock)
- [ ] Grid view menampilkan cards dengan thumbnail
- [ ] Card hover shows lift effect
- [ ] Klik card opens preview modal
- [ ] Preview modal:
  - [ ] Closable via [X], backdrop, ESC
  - [ ] Shows image/video/audio player (mock)
  - [ ] Metadata panel shows file info
  - [ ] Tags editable
  - [ ] Actions buttons functional (toast feedback)
  - [ ] Navigation arrows untuk prev/next file
- [ ] Favorite toggle works (visual change + toast)
- [ ] Overflow menu shows options
- [ ] Selection mode (desktop: checkbox, mobile: long-press)
- [ ] Bulk actions bar muncul saat items selected
- [ ] Trash view shows deleted items
- [ ] Restore dari Trash works (toast feedback)
- [ ] Empty states tampil saat tidak ada data
- [ ] Loading skeletons tampil saat "loading"
- [ ] Mock data (minimal 6 files) displayed

#### Culture
- [ ] Sidebar items: Identify Culture, Cultural Story, Craft & Origins, Rituals, Map, Sources
- [ ] Upload area accepts drag-drop
- [ ] Upload triggers loading state dengan progress
- [ ] Loading text berubah sesuai durasi (0-3s, 3-6s, 6s+)
- [ ] Result layout appears: image left + cards right (desktop)
- [ ] Result layout stacked/accordion (mobile)
- [ ] Image zoom controls work
- [ ] Interactive markers pada image:
  - [ ] Visible as circles dengan emas border
  - [ ] Hover shows tooltip
  - [ ] Click scrolls ke detail atau expands info
  - [ ] Keyboard accessible (Tab + Enter)
- [ ] Result cards ditampilkan dalam order:
  - [ ] Ringkasan dengan confidence bar
  - [ ] What is this (dengan expand option)
  - [ ] Where from (dengan mini map + "Lihat di Peta" button)
  - [ ] How it's made (steps dengan thumbnails)
  - [ ] Meaning & Context (paragraphs)
  - [ ] Related images (horizontal carousel)
  - [ ] Actions (4 buttons)
- [ ] Map modal opens saat "Lihat di Peta" clicked
- [ ] Map modal closable via ESC, backdrop, [X]
- [ ] Feedback thumbs (up/down) works
- [ ] Thumbs down shows correction textarea
- [ ] Action buttons:
  - [ ] Simpan ke Library → toast "Disimpan"
  - [ ] Buat Cerita Panjang → navigate to Cultural Story
  - [ ] Buat Tourism Kit → navigate to Creative Tourism Kit
  - [ ] Bagikan → modal dengan share options
- [ ] Share modal:
  - [ ] Salin Link → toast "Link disalin"
  - [ ] Other options → placeholder toast
- [ ] Tabs/navigation ke deeper pages works
- [ ] Empty upload state displayed initially
- [ ] Error state shown jika analysis fails
- [ ] Mock Culture result displayed (Batik Pekalongan example)

#### Creative - Image Studio
- [ ] Mode selector: Template / From Image / From Prompt
- [ ] Aspect ratio selector works
- [ ] Style preset dropdown works
- [ ] Advanced options collapsible
- [ ] Canvas area shows placeholder saat empty
- [ ] Right panel changes based on mode selected
- [ ] Template mode:
  - [ ] Template grid displayed
  - [ ] Select template fills inputs
  - [ ] Customize options work
- [ ] From Image mode:
  - [ ] Upload reference image area
  - [ ] Style transfer options
  - [ ] Strength slider
- [ ] From Prompt mode:
  - [ ] Textarea untuk prompt
  - [ ] Negative prompt field
  - [ ] Enhance Prompt button
- [ ] Generate button:
  - [ ] Shows loading state
  - [ ] Progress updates
  - [ ] Success displays variants
  - [ ] Error shows retry option
- [ ] Variant thumbnails:
  - [ ] Displayed as horizontal strip
  - [ ] Clickable to set as main
  - [ ] Favorite icon toggle
  - [ ] Download icon works
- [ ] Main canvas shows selected variant
- [ ] Zoom controls work
- [ ] Save to Library button → modal → toast
- [ ] Download button triggers download (mock)
- [ ] Empty state displayed initially
- [ ] Mock templates (6 examples) displayed
- [ ] Loading skeletons saat generating

#### Creative - Video Studio
- [ ] Template selector dropdown
- [ ] Aspect ratio selector
- [ ] Duration slider
- [ ] Timeline/storyboard area dengan scenes
- [ ] Scene cards:
  - [ ] Draggable untuk reorder
  - [ ] Editable duration
  - [ ] Transition dropdown
- [ ] Add scene [+] button opens options
- [ ] Preview player dengan controls:
  - [ ] Play/Pause
  - [ ] Timeline scrubber
  - [ ] Previous/Next scene
  - [ ] Volume
  - [ ] Fullscreen
- [ ] Right panel scene editor:
  - [ ] Edit current scene
  - [ ] Text overlay options
  - [ ] Filters sliders
- [ ] Music selector dengan presets
- [ ] Transitions dropdown
- [ ] Export settings
- [ ] Render & Export button:
  - [ ] Loading state dengan progress
  - [ ] Success toast
  - [ ] Error handling
- [ ] Template preset auto-fills storyboard
- [ ] Empty state displayed initially
- [ ] Mock templates (Tourism 10s, etc) available

#### Creative - Audio Studio
- [ ] Mode selector: Record / TTS / Upload
- [ ] Waveform display area
- [ ] Audio controls: Play, Pause, Stop, Record
- [ ] Record mode:
  - [ ] Input device selector
  - [ ] Input level meter
  - [ ] Start/Stop recording
  - [ ] Recorded duration display
- [ ] TTS mode:
  - [ ] Voice preset dropdown
  - [ ] Textarea untuk text input
  - [ ] Character count
  - [ ] Speed slider
  - [ ] Pitch slider
  - [ ] Preview button (quick, low-quality)
  - [ ] Generate button (full quality)
  - [ ] Loading state dengan progress
- [ ] Upload mode:
  - [ ] Drag-drop area
  - [ ] Choose file button
  - [ ] From Library option
- [ ] Audio effects:
  - [ ] Volume slider
  - [ ] Fade in/out dropdowns
  - [ ] Noise reduction slider
  - [ ] Background music selector
- [ ] Export options dengan format/quality
- [ ] Save to Library button
- [ ] Download button
- [ ] Empty state displayed
- [ ] Mock voice presets available
- [ ] Mock TTS text examples as placeholders

#### Creative - Other Studios
- [ ] Script Writer: Template selection + editor area + AI assist buttons
- [ ] Tourism Kit: Input selection → Generated assets preview → Edit options
- [ ] Commercial Maker: Step flow → Template → Assets → Storyboard → Export
- [ ] My Creative Projects: Grid of saved projects + actions

---

### Content QA Checklist

**Copy & Microcopy:**
- [ ] Semua UI text dalam Bahasa Indonesia
- [ ] Tone ramah dan profesional
- [ ] No typos or grammar errors
- [ ] Consistent terminology (e.g., "Unggah" bukan mix dengan "Upload")
- [ ] CTAs clear dan actionable
- [ ] Error messages helpful, bukan blame user
- [ ] Success messages celebratory
- [ ] Empty states encouraging dengan clear CTA

**Mock Data:**
- [ ] Library: minimal 6 files ditampilkan (varied types)
- [ ] Culture: 1 full result example (Batik Pekalongan)
- [ ] Creative Image: 6 template examples
- [ ] Creative Video: 3-4 template examples
- [ ] Creative Audio: 4-6 voice presets
- [ ] Chat: 3 recent chats + 3 saved chats (examples)
- [ ] Collections: 3 collection examples

---

### Performance QA Checklist

**Load Times (Mock):**
- [ ] Initial page load < 2s (skeleton appears immediately)
- [ ] Image thumbnails load progressively
- [ ] No blank screens (always show skeleton/placeholder)

**Animations:**
- [ ] All animations smooth at 60fps
- [ ] No janky scroll
- [ ] Transitions don't block interaction

**Responsive:**
- [ ] Test pada 3 breakpoints: mobile (375px), tablet (768px), desktop (1440px)
- [ ] No horizontal scroll pada any breakpoint
- [ ] Touch targets 44×44px minimum (mobile)
- [ ] Font sizes readable pada all devices

---

### Cross-browser QA (If Applicable)

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

### Final Sign-off

**Developer Checklist:**
- [ ] All components implemented as specified
- [ ] All mock data populated
- [ ] All states handled (loading, empty, success, error)
- [ ] All interactions functional (clicks, hovers, keyboard)
- [ ] Responsive breakpoints implemented
- [ ] Accessibility requirements met
- [ ] No console errors
- [ ] Code commented untuk clarity

**Reviewer Checklist:**
- [ ] Visual design matches specifications
- [ ] All features navigable
- [ ] All mock flows completable
- [ ] User experience smooth and intuitive
- [ ] Copy clear and helpful
- [ ] No major bugs or blockers
- [ ] Ready for stakeholder demo

---

## 📝 CATATAN PENTING UNTUK AI AGENT (CURSOR / COPILOT)

### YANG HARUS DILAKUKAN:

1. **Implementasi UI-Only:**
   - Buat semua komponen visual sesuai spec
   - JANGAN buat backend, API, atau endpoint
   - Gunakan MOCK DATA statis untuk semua konten
   - Sediakan STATE HANDLING untuk: loading, empty, success, error

2. **Mock Data & Placeholders:**
   - Sertakan mock data yang cukup untuk demo
   - Library: minimal 6 files dengan varied types
   - Culture: 1 full result example (detailed)
   - Creative: template examples untuk semua studios
   - Chat: examples untuk recent/saved chats
   - Gunakan placeholder images (use placeholder services atau simple colored boxes dengan labels)

3. **State Management:**
   - Implement visual states, bukan data states
   - Loading: skeleton screens atau spinners
   - Empty: encouraging empty states dengan CTAs
   - Success: toast notifications atau visual confirmations
   - Error: helpful error messages dengan retry options
   - Semua state changes visual dan immediate (client-side)

4. **Interactions:**
   - All buttons clickable dengan visual feedback
   - Hover states untuk desktop
   - Active/pressed states untuk mobile
   - Modals closable via ESC, backdrop, [X]
   - Toasts auto-dismiss setelah 3-4 detik
   - Animations smooth (120-240ms)

5. **Comments:**
   - Add comments yang jelas di code
   - Tandai placeholder sections: "// MOCK DATA - Replace dengan real API call"
   - Tandai state handling: "// LOADING STATE - Show skeleton"
   - Untuk complex logic: explain WHY, bukan hanya WHAT

6. **Deliverable:**
   - Working UI yang dapat di-navigate
   - Semua pages accessible
   - All mock flows completable
   - Responsive untuk mobile/tablet/desktop
   - No backend dependencies
   - Siap untuk stakeholder demo

### YANG TIDAK BOLEH DILAKUKAN:

1. **JANGAN Buat Backend:**
   - ❌ No API endpoints
   - ❌ No server-side code
   - ❌ No database setup
   - ❌ No authentication logic (kecuali UI-only)

2. **JANGAN Mention Tech Stack:**
   - ❌ Jangan spesifik "gunakan React hooks useState"
   - ❌ Jangan mention library spesifik kecuali diminta
   - ✅ Fokus pada behavior dan visual result

3. **JANGAN Skip States:**
   - ❌ Jangan hanya implement "happy path"
   - ✅ Always implement: loading, empty, error states
   - ✅ Think about edge cases (no data, slow load, error)

4. **JANGAN Hardcode Everything:**
   - ❌ Jangan inline semua data di component
   - ✅ Separate mock data ke file/object tersendiri
   - ✅ Make it easy untuk replace dengan real data later

5. **JANGAN Ignore Accessibility:**
   - ❌ Jangan skip keyboard navigation
   - ❌ Jangan remove focus outlines
   - ❌ Jangan lupa alt text untuk images
   - ✅ Implement semantic HTML
   - ✅ Implement ARIA labels where needed

6. **JANGAN Lupa Responsive:**
   - ❌ Jangan hanya design untuk desktop
   - ✅ Test pada mobile/tablet/desktop breakpoints
   - ✅ Touch targets 44×44px untuk mobile
   - ✅ Sidebar jadi drawer di mobile

### PRIORITAS IMPLEMENTASI (Urutan):

**Phase 1 - Core Structure:**
1. Layout: Topbar + Sidebar + Main Content
2. Sidebar Chat update (ganti isi, hapus Settings)
3. Navigation antar sections (Chat/Library/Culture/Creative)
4. Basic styling: colors, fonts, spacing

**Phase 2 - Library:**
1. Sidebar Library items
2. Main grid dengan file cards
3. Upload drag-drop area
4. Preview modal (image/video/audio)
5. Selection mode + bulk actions
6. Trash view
7. Empty/loading/error states
8. Mock data (6 files)

**Phase 3 - Culture:**
1. Sidebar Culture items
2. Upload area (Identify Culture)
3. Loading state dengan progress
4. Result layout (image + cards)
5. Interactive markers pada image
6. All result cards (Ringkasan, What/Where/How, Meaning, Related, Actions)
7. Map modal
8. Share modal
9. Empty/error states
10. Mock Culture result (Batik Pekalongan)

**Phase 4 - Creative:**
1. Sidebar Creative items
2. Image Studio (mode selector, canvas, variants, right panel)
3. Video Studio (timeline, player, scene editor)
4. Audio Studio (waveform, TTS, record)
5. Script Writer, Tourism Kit, Commercial Maker (basic layouts)
6. My Creative Projects grid
7. All empty/loading/error states
8. Mock templates dan presets

**Phase 5 - Polish:**
1. Animations dan transitions
2. Hover states
3. Keyboard navigation
4. Accessibility (ARIA, alt text, focus)
5. Responsive refinement
6. Microcopy review
7. QA testing semua flows

### TESTING GUIDE UNTUK DEVELOPER:

**Manual Testing Checklist:**
1. Navigate semua sections via sidebar
2. Klik semua buttons → verify visual feedback
3. Open/close all modals → verify ESC/backdrop works
4. Test drag-drop areas → verify visual states
5. Test selection mode → verify bulk actions
6. Test all empty states → verify CTAs work
7. Test all loading states → verify skeleton/progress
8. Test all error states → verify retry works
9. Test responsive:
   - Resize browser dari 375px to 1440px
   - Verify sidebar collapsible
   - Verify grid columns change
   - Verify touch targets pada mobile size
10. Test keyboard:
    - Tab through all interactive elements
    - Verify focus visible
    - Verify Enter/Space activates
    - Verify ESC closes modals

**Final Demo Checklist:**
1. Buka halaman → Topbar + Sidebar + Chat tampil
2. Klik Library → Grid files tampil dengan mock data
3. Klik file → Preview modal opens
4. Klik Culture → Upload area tampil
5. Mock upload → Loading → Result tampil dengan markers
6. Klik markers → Tooltips/scrolls work
7. Klik Creative → Image Studio tampil
8. Mock generate → Variants tampil
9. All sections navigable tanpa errors
10. Responsive pada mobile (sidebar jadi drawer)

---

## 🎯 SUCCESS CRITERIA

Project dinyatakan **SELESAI** dan **SIAP DEMO** jika:

✅ **Visual:**
- Semua halaman tampil sesuai design spec
- Tema emas budaya konsisten
- Spacing dan typography rapi
- Responsive di 3 breakpoints

✅ **Functional:**
- Sidebar Chat updated (Settings dihapus)
- Library full functional (grid, preview, actions)
- Culture full functional (upload, analyze, results)
- Creative semua studios implemented (Image, Video, Audio + others)
- All modals/dropdowns/toasts working
- All states handled (loading, empty, error)

✅ **Content:**
- Semua text dalam Bahasa Indonesia
- Mock data sufficient untuk demo
- Microcopy helpful dan clear
- Empty states encouraging

✅ **UX:**
- Navigation smooth antar sections
- Interactions responsive
- Feedback immediate dan clear
- Keyboard navigation works
- Accessibility requirements met

✅ **Polish:**
- Animations smooth
- No janky performance
- No console errors
- Ready untuk stakeholder review

---

## 📞 JIKA ADA PERTANYAAN

Jika ada spec yang unclear atau ambiguous:

1. **Refer ke examples** di spec ini (ada banyak mock examples)
2. **Follow established patterns** dari section lain yang sudah jelas
3. **Make reasonable assumptions** yang align dengan design theme
4. **Document assumptions** di code comments
5. **Keep it simple** - jangan over-complicate

**Prinsip Umum:**
- "When in doubt, keep it simple"
- "User experience > feature completeness"
- "Working demo > perfect code"
- "Clear feedback > silent failures"

---

## ✨ PENUTUP

Prompt ini adalah **panduan lengkap** untuk implementasi frontend aplikasi budaya Indonesia. Semua spec dirancang untuk:

- ✅ **Jelas** - tidak ambigu, spesifik
- ✅ **Lengkap** - semua details ada
- ✅ **Actionable** - AI agent bisa langsung execute
- ✅ **Visual** - banyak contoh layout dan structure
- ✅ **User-focused** - UX jadi prioritas

Agent AI yang execute prompt ini harus **fokus pada deliverable**: working UI demo yang navigable, interactive, dan visually appealing, dengan semua mock data necessary untuk stakeholder review.

**Target output:** Production-ready frontend UI (UI-only) yang siap untuk:
1. Stakeholder demo dan feedback
2. Backend integration (kemudian)
3. User testing
4. Iterasi dan improvement

**Ingat:** Ini adalah **frontend-only project**. No backend, no API, no database. Semua functionality adalah UI-only dengan mock data dan visual state management.

🚀 **Good luck dan selamat coding!**
export const primaryNavigation = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Gambaran umum produk, prinsip UI, dan struktur utama.',
  },
  {
    id: 'screens',
    label: 'Screens',
    description: 'Wireframe untuk login, dashboard, silsilah, profil, form, pencarian, dan lainnya.',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    description: 'Baseline teks besar, kontras, ukuran sentuh, dan aksi berisiko.',
  },
  {
    id: 'docs',
    label: 'Docs',
    description: 'Ringkasan komponen, pola interaksi, dan keputusan desain.',
  },
];

export const screens = [
  {
    id: 'login',
    title: 'Login',
    subtitle: 'Akses cepat dengan bahasa yang mudah dipahami lintas usia.',
    purpose: 'Masuk dengan email/nomor keluarga atau akun yang sudah terdaftar.',
    primaryActions: ['Masuk', 'Lupa kata sandi'],
    keyElements: ['Logo dan pesan sambutan', 'Form sederhana', 'Tautan bantuan yang jelas'],
    variant: 'split',
    accent: 'apricot',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Ringkasan keluarga, aktivitas terbaru, dan pintasan tugas penting.',
    purpose: 'Membuka kondisi keluarga, notifikasi, dan kerja lanjutan dengan cepat.',
    primaryActions: ['Tambah anggota', 'Lihat pohon'],
    keyElements: ['Kartu ringkasan', 'Aktivitas terbaru', 'Pintasan cepat'],
    variant: 'dashboard',
    accent: 'sage',
  },
  {
    id: 'tree',
    title: 'Pohon Silsilah',
    subtitle: 'Fokus pada struktur keluarga dengan navigasi yang tidak berlapis-lapis.',
    purpose: 'Menelusuri hubungan keluarga tanpa lebih dari dua level navigasi.',
    primaryActions: ['Cari anggota', 'Perbesar tampilan'],
    keyElements: ['Node pusat', 'Cabang generasi', 'Legenda warna relasi'],
    variant: 'tree',
    accent: 'amber',
  },
  {
    id: 'profile',
    title: 'Profil Anggota',
    subtitle: 'Halaman data inti, relasi, dan riwayat keluarga.',
    purpose: 'Membaca identitas, kontak, relasi, dan status anggota keluarga.',
    primaryActions: ['Edit profil', 'Nonaktifkan'],
    keyElements: ['Foto/monogram', 'Tab informasi', 'Riwayat hubungan'],
    variant: 'profile',
    accent: 'clay',
  },
  {
    id: 'form',
    title: 'Form Anggota',
    subtitle: 'Form bertahap, label jelas, dan validasi yang ramah.',
    purpose: 'Menambah atau mengubah data anggota dengan langkah yang mudah diikuti.',
    primaryActions: ['Simpan data', 'Batal'],
    keyElements: ['Field berurutan', 'Bantuan inline', 'Status simpan'],
    variant: 'form',
    accent: 'rose',
  },
  {
    id: 'search',
    title: 'Pencarian',
    subtitle: 'Pencarian cepat untuk nama, hubungan, dan catatan keluarga.',
    purpose: 'Menemukan anggota dan hubungan tanpa membuka banyak layar.',
    primaryActions: ['Filter', 'Hapus filter'],
    keyElements: ['Bar pencarian', 'Filter chip', 'Hasil berlapis'],
    variant: 'search',
    accent: 'river',
  },
  {
    id: 'settings',
    title: 'Pengaturan',
    subtitle: 'Preferensi tampilan, aksesibilitas, dan data akun.',
    purpose: 'Mengubah tema, bahasa, ukuran teks, dan pengelolaan akun.',
    primaryActions: ['Simpan preferensi', 'Reset'],
    keyElements: ['Toggle sederhana', 'Pengaturan aksesibilitas', 'Akun dan keamanan'],
    variant: 'settings',
    accent: 'plum',
  },
  {
    id: 'help',
    title: 'Bantuan',
    subtitle: 'Panduan penggunaan yang singkat, jelas, dan mudah dicari.',
    purpose: 'Membantu pengguna keluarga memahami istilah, alur, dan kontak bantuan.',
    primaryActions: ['Hubungi bantuan', 'Baca panduan'],
    keyElements: ['FAQ ringkas', 'Kontak bantuan', 'Langkah pemulihan akun'],
    variant: 'help',
    accent: 'stone',
  },
];

export const designTokens = [
  {
    group: 'Warna',
    items: [
      { name: 'Warm Sand', value: '#F7F1E8' },
      { name: 'Clay Text', value: '#1F2933' },
      { name: 'Sage', value: '#5A7D6A' },
      { name: 'Amber', value: '#D08A2D' },
      { name: 'Rose', value: '#B96A6A' },
    ],
  },
  {
    group: 'Tipografi',
    items: [
      { name: 'Base text', value: '16px minimum' },
      { name: 'Heading scale', value: 'clamp(2rem, 4vw, 3.6rem)' },
      { name: 'Line height', value: '1.5 - 1.7' },
      { name: 'Large text', value: '18px - 20px mode' },
    ],
  },
  {
    group: 'Spacing',
    items: [
      { name: 'Touch target', value: '44px minimum' },
      { name: 'Card padding', value: '20px - 32px' },
      { name: 'Section gap', value: '24px - 40px' },
      { name: 'Radius', value: '16px - 28px' },
    ],
  },
  {
    group: 'State',
    items: [
      { name: 'Success', value: 'Pemberitahuan berhasil tersimpan' },
      { name: 'Warning', value: 'Ada data yang perlu dicek' },
      { name: 'Danger', value: 'Aksi permanen butuh konfirmasi' },
      { name: 'Info', value: 'Penjelasan singkat dan non-teknis' },
    ],
  },
];

export const accessibilityChecklist = [
  'Semua tombol dan input minimal 44px untuk area sentuh.',
  'Teks dasar dimulai dari 16px dan bisa dinaikkan ke mode teks besar.',
  'Kontras teks dipilih untuk memenuhi baseline WCAG 2.1 AA.',
  'Aksi permanen selalu memakai dialog konfirmasi dengan opsi batal yang jelas.',
  'Navigasi utama dibatasi ke dua level agar mudah dipahami pengguna keluarga.',
  'Label form memakai bahasa sederhana dan bantuan inline saat perlu.',
];

export const confirmationPattern = {
  title: 'Pola Konfirmasi Aksi Permanen',
  summary:
    'Gunakan dialog kecil yang menjelaskan dampak, menyebut objek yang terpengaruh, dan memberi jalan keluar yang aman.',
  dangerousAction: 'Hapus profil anggota',
  safeAction: 'Batal',
  confirmAction: 'Hapus data',
  notes: [
    'Jangan sembunyikan alasan atau akibat hapus/nonaktifkan.',
    'Pisahkan aksi berisiko dengan warna dan posisi tombol yang jelas.',
    'Gunakan frasa yang spesifik, misalnya nama anggota yang terdampak.',
  ],
};

export const docsSummary = [
  {
    title: 'Komponen utama',
    items: ['App shell', 'Primary navigation', 'Screen preview cards', 'Token swatches'],
  },
  {
    title: 'Pola interaksi',
    items: ['Tab section satu tingkat', 'Screen selector satu tingkat', 'Aksi penting dengan konfirmasi'],
  },
  {
    title: 'Kontrol aksesibilitas',
    items: ['Large text mode', 'Kontras baseline', 'Target sentuh besar', 'Label jelas'],
  },
];


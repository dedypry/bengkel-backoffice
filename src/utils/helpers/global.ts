export function getInitials(name: string): string {
  if (!name) return "";

  return name
    .trim() // Hapus spasi di awal/akhir
    .split(/\s+/) // Pecah berdasarkan spasi
    .slice(0, 2) // Ambil maksimal 2 kata pertama
    .map((word) => word[0]) // Ambil karakter pertama tiap kata
    .join("") // Gabungkan
    .toUpperCase(); // Ubah jadi huruf kapital
}

export const DEFAULT_NEXT_SERVICE_NOTES = [
  "Ganti oli mesin dan filter oli pada servis berikutnya",
  "Periksa dan sesuaikan tekanan angin ban",
  "Periksa kondisi kampas rem depan dan belakang",
  "Rotasi ban dan cek keausan profil ban",
  "Servis berkala sesuai interval KM kendaraan",
  "Periksa kondisi aki dan terminal kabel",
  "Ganti filter udara / filter AC bila diperlukan",
  "Periksa busi dan sistem pengapian",
  "Cek sistem rem dan level minyak rem",
  "Spooring dan balancing roda",
  "Periksa sistem pendingin dan selang radiator",
  "Periksa kondisi wiper dan air wiper",
];

export function parseNextServiceNotes(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(String).filter(Boolean);
  }

  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(Boolean);
      }
    } catch {
      return raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }
  }

  return [];
}

export function noteTextToHtml(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<p>${escaped}</p>`;
}

import type { IWo } from "@/stores/features/work-order/wo-slice";

import { http } from "../libs/axios";

import { notifyError } from "./notify";

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

export const getAvatarByName = (name: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
};

export const calculateTotalEstimation = (services: IWo[]) => {
  // 1. Hitung total dalam satuan MENIT sebagai base unit
  const totalMinutes = services.reduce((acc, item) => {
    const duration = Number(item.estimated_duration) || 0;
    const qty = item.qty || 1;
    let minutesPerItem = 0;

    switch (item.estimated_type?.toLowerCase()) {
      case "days":
      case "day":
        minutesPerItem = duration * 24 * 60;
        break;
      case "hours":
      case "hour":
        minutesPerItem = duration * 60;
        break;
      case "minutes":
      case "minute":
      default:
        minutesPerItem = duration;
        break;
    }

    return acc + minutesPerItem * qty;
  }, 0);

  // 2. Konversi kembali ke format yang bisa dibaca (Days, Hours, Minutes)
  const d = Math.floor(totalMinutes / (24 * 60));
  const h = Math.floor((totalMinutes % (24 * 60)) / 60);
  const m = totalMinutes % 60;

  // 3. Buat string output
  const result = [];

  if (d > 0) result.push(`${d} Hari`);
  if (h > 0) result.push(`${h} Jam`);
  if (m > 0) result.push(`${m} Menit`);

  return {
    total_minutes: totalMinutes,
    readable_format: result.length > 0 ? result.join(" ") : "0 Menit",
    details: { days: d, hours: h, minutes: m },
  };
};

export async function handleDownload(
  linkUrl: string,
  fileName: string = "",
  isRedirect: boolean = false,
  setLoading?: (val: boolean) => void,
) {
  try {
    if (setLoading) {
      setLoading(true);
    }
    // 1. Lakukan request dengan responseType 'blob'
    const response = await http.get(linkUrl, {
      responseType: "blob",
    });

    // 2. Buat URL sementara dari blob tersebut
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    if (isRedirect) {
      window.open(url, "_blank");
    } else {
      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Download gagal:", error);
    notifyError("Gagal mendownload PDF");
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
}

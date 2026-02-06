import type { IWo } from "@/stores/features/work-order/wo-slice";

import dayjs from "dayjs";

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

export async function handleDownloadExcel(
  url: string,
  params?: any,
  fileName: string = "export-data",
) {
  try {
    const response = await http.get(url, {
      responseType: "blob",
      params,
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = fileName + ".xlsx";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Gagal mendownload Excel:", error);
  }
}

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

export const calculatePerformance = (rating: any, totalWork: any) => {
  // 1. Kualitas (Rating): Bobot 70%
  // Kita asumsikan rating maksimal adalah 5
  const ratingScore = (Number(rating) || 0) * 20; // 5 * 20 = 100
  const weightedRating = ratingScore * 0.7;

  // 2. Kuantitas (Jam Terbang): Bobot 30%
  // Kita asumsikan "Target Senior" adalah 50 pekerjaan selesai untuk skor penuh
  const targetWork = 50;
  const workScore = Math.min((Number(totalWork) || 0) / targetWork, 1) * 100;
  const weightedWork = workScore * 0.3;

  // Total Skor
  return Math.round(weightedRating + weightedWork);
};

export const getJoinDuration = (joinDate: string) => {
  if (!joinDate) return "Tanggal tidak tersedia";

  const join = dayjs(joinDate);
  const now = dayjs();

  // 2. Format detail (Tahun, Bulan, Hari)
  const years = now.diff(join, "year");
  const months = now.diff(join.add(years, "year"), "month");

  return `${years} Tahun, ${months} Bulan`;
};

export function formatTime(data: string) {
  return data.slice(0, 5);
}

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

interface PropsWO {
  estimated: number;
  type: string;
}
export function calculateTotalEstimation(workOrder: PropsWO[]): string {
  let totalMinutes = 0;

  workOrder.forEach((item) => {
    if (item.estimated) {
      const duration = Number(item.estimated);
      const unit = item.type?.toLowerCase(); // 'minute', 'hours', 'day'

      switch (unit) {
        case "day":
          // 1 hari diasumsikan 8 jam kerja (sesuaikan dengan operasional bengkel Anda)
          // Atau jika 24 jam: duration * 24 * 60
          totalMinutes += duration * 8 * 60;
          break;
        case "hours":
          totalMinutes += duration * 60;
          break;
        case "minute":
        default:
          totalMinutes += duration;
          break;
      }
    }
  });

  return formatEstimationResult(totalMinutes);
}

export function formatEstimationResult(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0 Menit";

  const minutesInDay = 24 * 60; // 1440 menit
  const minutesInHour = 60;

  // 1. Hitung Hari
  const days = Math.floor(totalMinutes / minutesInDay);
  let remainingMinutes = totalMinutes % minutesInDay;

  // 2. Hitung Jam
  const hours = Math.floor(remainingMinutes / minutesInHour);

  remainingMinutes = remainingMinutes % minutesInHour;

  // 3. Susun String Hasil
  const result: string[] = [];

  if (days > 0) {
    result.push(`${days} Hari`);
  }

  if (hours > 0) {
    result.push(`${hours} Jam`);
  }

  if (remainingMinutes > 0 || result.length === 0) {
    result.push(`${remainingMinutes} Menit`);
  }

  return result.join(" ");
}

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

      link.setAttribute("download", `${fileName}.pdf`);
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

export const getJoinDuration = (joinDate: string, showMonth?: boolean) => {
  if (!joinDate) return "Tanggal tidak tersedia";

  const join = dayjs(joinDate);
  const now = dayjs();

  // 2. Format detail (Tahun, Bulan, Hari)
  const years = now.diff(join, "year");
  const months = now.diff(join.add(years, "year"), "month");

  let month = "";

  if (showMonth) {
    month = `, ${months} Bulan`;
  }

  return `${years} Tahun${month}`;
};

export function formatTime(data: string) {
  return data.slice(0, 5);
}

export function generateDataWo(serviceData: any[], sparepartData: any[]) {
  return {
    services: serviceData.map((e) => ({
      id: e.id,
      qty: e.qty,
      price: e.price,
      supplier_id: e?.supplier_id,
    })),
    sparepart: sparepartData.map((e) => ({
      id: e.id,
      qty: e.qty,
      price: e.sell_price,
      supplier_id: e?.supplier_id,
    })),
  };
}

export const formatIDR = (price: number, type: "full" | "short" = "full") => {
  if (type === "short") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      notation: "compact",
      maximumFractionDigits: 1, // Menampilkan 1 desimal, misal 1.5 Jt
    })
      .format(price)
      .replace("jt", "Jt")
      .replace("rb", "Rb");
    // .replace di atas untuk memastikan kapitalisasi sesuai selera UI
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatNumber = (value: number | string): string => {
  if (value === null || value === undefined) return "0";

  // Konversi ke number jika input berupa string
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) return "0";

  return new Intl.NumberFormat("id-ID").format(numberValue);
};

export function switchCommasToDots(input: string | number) {
  const string = String(input);

  return Number(string.split(",").join(".")) || 0;
}

type IConfig = { thousandSeparator: boolean };
export function switchDotsToCommas(input: string | number, config?: IConfig) {
  const string = String(input);
  let result = String(string.split(".").join(","));

  if (config?.thousandSeparator) {
    result = new Intl.NumberFormat(["ban", "id"]).format(Number(input));
  }

  return result;
}

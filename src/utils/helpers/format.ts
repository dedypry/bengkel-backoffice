export const formatIDR = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
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

import dayjs from "dayjs";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

  return `${size} ${sizes[i]}`;
}

export function dateFormat(date = "", format = "DD MMMM YYYY") {
  if (!date) return "-";

  return dayjs(date).format(format);
}
export function dateTimeFormat(date = "", format = "DD MMMM YYYY | HH:mm WIB") {
  if (!date) return "-";

  return dayjs(date).format(format);
}

export function dateSchedule(date?: string) {
  const formater = "YYYY-MM-DD HH:mm";

  if (!date) return dayjs().format(formater);

  return dayjs(date).format(formater);
}

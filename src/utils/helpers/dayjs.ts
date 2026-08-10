import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Default timezone Indonesia (WIB)
dayjs.tz.setDefault("Asia/Jakarta");

export function formatWorkOrderDateTime(value: string) {
  const utcDate = dayjs.utc(value);

  if (utcDate.isValid() && utcDate.format("HH:mm:ss") === "00:00:00") {
    return dayjs
      .tz(utcDate.format("YYYY-MM-DD"), "Asia/Jakarta")
      .format("DD MMM YY | HH:mm");
  }

  return dayjs(value).tz("Asia/Jakarta").format("DD MMM YY | HH:mm");
}

export default dayjs;

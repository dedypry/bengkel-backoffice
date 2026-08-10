import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

// Default timezone Indonesia (WIB)
dayjs.tz.setDefault("Asia/Jakarta");

const DATETIME_VALUE_FORMAT = "YYYY-MM-DD HH:mm:ss";

function isLegacyUtcMidnight(value: string) {
  const utcDate = dayjs.utc(value);

  return utcDate.isValid() && utcDate.format("HH:mm:ss") === "00:00:00";
}

export function toWorkOrderDateTimeInput(value: string) {
  if (isLegacyUtcMidnight(value)) {
    return dayjs
      .tz(dayjs.utc(value).format("YYYY-MM-DD"), "Asia/Jakarta")
      .format(DATETIME_VALUE_FORMAT);
  }

  return dayjs(value).tz("Asia/Jakarta").format(DATETIME_VALUE_FORMAT);
}

export function formatWorkOrderDateTimeFull(value: string) {
  if (isLegacyUtcMidnight(value)) {
    return dayjs
      .tz(dayjs.utc(value).format("YYYY-MM-DD"), "Asia/Jakarta")
      .format("dddd, D MMMM YYYY | HH:mm");
  }

  return dayjs(value).tz("Asia/Jakarta").format("dddd, D MMMM YYYY | HH:mm");
}

export function formatWorkOrderDateTime(value: string) {
  if (isLegacyUtcMidnight(value)) {
    return dayjs
      .tz(dayjs.utc(value).format("YYYY-MM-DD"), "Asia/Jakarta")
      .format("DD MMM YY | HH:mm");
  }

  return dayjs(value).tz("Asia/Jakarta").format("DD MMM YY | HH:mm");
}

export default dayjs;

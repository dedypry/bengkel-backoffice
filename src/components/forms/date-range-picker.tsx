/* eslint-disable import/order */
import {
  Button,
  Input,
  InputProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TimeInput,
} from "@heroui/react";
import { forwardRef, useEffect, useState } from "react";
import {
  createStaticRanges,
  DateRangePicker,
  RangeKeyDict,
} from "react-date-range";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar1Icon, X } from "lucide-react";

import id from "date-fns/locale/id";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subYears,
} from "date-fns";
import dayjs from "dayjs";
import { dateFormat } from "@/utils/helpers/formater";

const DATETIME_RANGE_FORMAT = "YYYY-MM-DD HH:mm:ss";

function isValidDate(date: Date | null | undefined) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function toTimeInputValue(date: Date | null | undefined) {
  if (!isValidDate(date)) {
    return null;
  }

  return parseAbsoluteToLocal(dayjs(date).toISOString());
}

/** Preset kiri + Tahun ini / Tahun lalu (label bahasa Indonesia) */
const idStaticRanges = createStaticRanges([
  {
    label: "Hari ini",
    range: () => {
      const d = new Date();

      return {
        startDate: startOfDay(d),
        endDate: endOfDay(d),
      };
    },
  },
  {
    label: "Kemarin",
    range: () => {
      const d = addDays(new Date(), -1);

      return {
        startDate: startOfDay(d),
        endDate: endOfDay(d),
      };
    },
  },
  {
    label: "Minggu ini",
    range: () => {
      const d = new Date();

      return {
        startDate: startOfWeek(d, { locale: id }),
        endDate: endOfWeek(d, { locale: id }),
      };
    },
  },
  {
    label: "Minggu lalu",
    range: () => {
      const d = addDays(new Date(), -7);

      return {
        startDate: startOfWeek(d, { locale: id }),
        endDate: endOfWeek(d, { locale: id }),
      };
    },
  },
  {
    label: "Bulan ini",
    range: () => {
      const d = new Date();

      return {
        startDate: startOfMonth(d),
        endDate: endOfMonth(d),
      };
    },
  },
  {
    label: "Bulan lalu",
    range: () => {
      const d = addMonths(new Date(), -1);

      return {
        startDate: startOfMonth(d),
        endDate: endOfMonth(d),
      };
    },
  },
  {
    label: "Tahun ini",
    range: () => {
      const d = new Date();

      return {
        startDate: startOfYear(d),
        endDate: endOfYear(d),
      };
    },
  },
  {
    label: "Tahun lalu",
    range: () => {
      const d = subYears(new Date(), 1);

      return {
        startDate: startOfYear(d),
        endDate: endOfYear(d),
      };
    },
  },
]);

const idInputRanges = [
  {
    label: "hari hingga hari ini",
    range(value: string, _props?: unknown) {
      const startOfToday = startOfDay(new Date());
      const endOfToday = endOfDay(new Date());

      return {
        startDate: addDays(startOfToday, (Math.max(Number(value), 1) - 1) * -1),
        endDate: endOfToday,
      };
    },
    getCurrentValue(range: { startDate?: Date; endDate?: Date }) {
      const endToday = endOfDay(new Date());

      if (!range.endDate || !isSameDay(range.endDate, endToday)) return "-";
      if (!range.startDate) return "∞";

      return String(differenceInCalendarDays(endToday, range.startDate) + 1);
    },
  },
  {
    label: "hari mulai hari ini",
    range(value: string, _props?: unknown) {
      const today = new Date();

      return {
        startDate: today,
        endDate: addDays(today, Math.max(Number(value), 1) - 1),
      };
    },
    getCurrentValue(range: { startDate?: Date; endDate?: Date }) {
      const startToday = startOfDay(new Date());

      if (!range.startDate || !isSameDay(range.startDate, startToday))
        return "-";
      if (!range.endDate) return "∞";

      return String(differenceInCalendarDays(range.endDate, startToday) + 1);
    },
  },
];

interface DateRangeValue {
  start?: Date;
  end?: Date;
}

interface Props
  extends Omit<InputProps, "value" | "onChange" | "defaultValue"> {
  value: DateRangeValue;
  format?: string;
  showTime?: boolean;
  onChange?: (range: { start?: string; end?: string }) => void;
}
function CustomDateRangePicker(
  { value: dates, format = "DD MMM YY", showTime, onChange, ...props }: Props,
  ref: React.Ref<HTMLInputElement>,
) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const now = new Date();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    key: "target",
  });

  const displayFormat = showTime ? "DD MMM YYYY HH:mm" : format;

  function formatRangeOutput(startDate: Date, endDate: Date) {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return { start: "", end: "" };
    }

    if (showTime) {
      return {
        start: dayjs(startDate).format(DATETIME_RANGE_FORMAT),
        end: dayjs(endDate).format(DATETIME_RANGE_FORMAT),
      };
    }

    return {
      start: dayjs(startDate).format("YYYY-MM-DD"),
      end: dayjs(endDate).format("YYYY-MM-DD"),
    };
  }

  function handleChooseDateRange(event: RangeKeyDict) {
    const startDate = event.target.startDate;
    const endDate = event.target.endDate;

    setDateRange((prev) => ({
      ...prev,
      startDate: isValidDate(startDate) ? startDate! : prev.startDate,
      endDate: isValidDate(endDate) ? endDate! : prev.endDate,
    }));

    if (onChange && isValidDate(startDate) && isValidDate(endDate)) {
      onChange(formatRangeOutput(startDate!, endDate!));
    }
  }

  useEffect(() => {
    if (dates.start || dates.end) {
      setDateRange({
        startDate: dates.start
          ? dayjs(dates.start).toDate()
          : dateRange.startDate,
        endDate: dates.end ? dayjs(dates.end).toDate() : dateRange.endDate,
        key: "target",
      });

      return;
    }

    setDateRange({
      startDate: null,
      endDate: null,
      key: "target",
    } as any);
    setValue("");
  }, [dates]);

  useEffect(() => {
    if (!dateRange.startDate && !dateRange.endDate) {
      setValue("");

      return;
    }

    const value = `${dateFormat(dateRange.startDate as any, displayFormat)} - ${dateFormat(dateRange.endDate as any, displayFormat)}`;

    setValue(value);
  }, [dateRange, displayFormat]);

  function handleTimeInput(
    key: "startDate" | "endDate",
    val?: ZonedDateTime | null,
  ) {
    if (!val) {
      return;
    }

    setDateRange((state) => {
      const current = isValidDate(state[key]) ? state[key]! : new Date();
      const dateR = {
        ...state,
        [key]: dayjs(val.toDate()).isValid()
          ? dayjs(val.toDate()).toDate()
          : current,
      };

      if (
        onChange &&
        isValidDate(dateR.startDate) &&
        isValidDate(dateR.endDate)
      ) {
        onChange(formatRangeOutput(dateR.startDate, dateR.endDate));
      }

      return dateR;
    });
  }

  const hasValidRange =
    isValidDate(dateRange.startDate) && isValidDate(dateRange.endDate);

  const pickerRange = hasValidRange
    ? dateRange
    : {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        key: "target",
      };

  return (
    <Input
      ref={ref}
      {...props}
      endContent={
        <div className="flex items-center">
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={() => {
              setDateRange({
                startDate: null,
                endDate: null,
                key: "target",
              } as any);
              if (onChange) {
                onChange({
                  start: "",
                  end: "",
                });
              }
            }}
          >
            <X className="text-gray-600" size={18} />
          </Button>
          <Popover
            isOpen={open}
            placement="bottom"
            onOpenChange={(open) => setOpen(open)}
          >
            <PopoverTrigger>
              <Calendar1Icon className="text-secondary-600 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="mt-3">
              <div className="px-1 py-2">
                <DateRangePicker
                  color="#077fb6"
                  editableDateInputs={true}
                  inputRanges={idInputRanges as any}
                  locale={id}
                  moveRangeOnFirstSelection={false}
                  rangeColors={["#077fb6"]}
                  ranges={[pickerRange]}
                  retainEndDateOnFirstSelection={false}
                  staticRanges={idStaticRanges}
                  onChange={handleChooseDateRange}
                />
                {showTime && hasValidRange && (
                  <div className="flex gap-2">
                    <TimeInput
                      hourCycle={24}
                      label="Waktu Mulai"
                      value={toTimeInputValue(dateRange.startDate)}
                      onChange={(val) => handleTimeInput("startDate", val)}
                    />
                    <TimeInput
                      hourCycle={24}
                      label="Waktu Berakhir"
                      value={toTimeInputValue(dateRange.endDate)}
                      onChange={(val) => handleTimeInput("endDate", val)}
                    />
                  </div>
                )}

                <div className="text-right py-5">
                  <Button
                    color="primary"
                    variant="shadow"
                    onPress={() => setOpen(false)}
                  >
                    Simpan/Tutup
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      }
      value={value}
      onClick={() => setOpen(true)}
    />
  );
}

export default forwardRef(CustomDateRangePicker);

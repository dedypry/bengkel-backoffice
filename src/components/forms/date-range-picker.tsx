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

interface Props {
  value: {
    start?: Date;
    end?: Date;
  };
  format?: string;
  showTime?: boolean;
}
function CustomDateRangePicker(
  {
    value: dates,
    format = "DD MMM YY",
    showTime,
    ...props
  }: Props & InputProps,
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

  function handleChooseDateRange(event: RangeKeyDict) {
    const dateR = {
      startDate: event.target.startDate!,
      endDate: event.target.endDate!,
    };

    setDateRange({
      ...dateRange,
      ...dateR,
    });
    if (props.onChange) {
      props.onChange({
        start: dayjs(dateR.startDate).format("YYYY-MM-DD"),
        end: dayjs(dateR.endDate).format("YYYY-MM-DD"),
      } as any);
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
    }
  }, [dates]);

  useEffect(() => {
    const value = `${dateFormat(dateRange.startDate as any, format)} - ${dateFormat(dateRange.endDate as any, format)}`;

    setValue(value);
  }, [dateRange]);

  function handleTimeInput(
    key: "startDate" | "endDate",
    val?: ZonedDateTime | null,
  ) {
    setDateRange((state) => {
      const dateR = {
        ...state,
        [key]: dayjs(val?.toDate()).toDate(),
      };

      if (props.onChange) {
        props.onChange(dateR as any);
      }

      return dateR;
    });
  }

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
              if (props.onChange) {
                props.onChange({
                  start: "",
                  end: "",
                } as any);
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
                  ranges={[dateRange]}
                  retainEndDateOnFirstSelection={false}
                  staticRanges={idStaticRanges}
                  onChange={handleChooseDateRange}
                />
                {showTime && (
                  <div className="flex gap-2">
                    <TimeInput
                      hourCycle={24}
                      label="Waktu Mulai"
                      value={parseAbsoluteToLocal(
                        dayjs(dateRange.startDate).toISOString(),
                      )}
                      onChange={(val) => handleTimeInput("startDate", val)}
                    />
                    <TimeInput
                      hourCycle={24}
                      label="Waktu Berakhir"
                      value={parseAbsoluteToLocal(
                        dayjs(dateRange.endDate).toISOString(),
                      )}
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

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
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { forwardRef, useMemo, useState } from "react";
import { Calendar } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar1Icon, X } from "lucide-react";

import id from "date-fns/locale/id";
import dayjs from "dayjs";

export const DATETIME_VALUE_FORMAT = "YYYY-MM-DD HH:mm:ss";

interface Props {
  maxDate?: Date;
  minDate?: Date;
}

function toStoredValue(date: dayjs.Dayjs) {
  return date.format(DATETIME_VALUE_FORMAT);
}

function parseValue(value?: string | null) {
  if (!value) return dayjs();

  const parsed = dayjs(value, DATETIME_VALUE_FORMAT, true);

  return parsed.isValid() ? parsed : dayjs(value);
}

function CustomDateTimePicker(
  { maxDate, minDate, ...props }: Props & InputProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const [open, setOpen] = useState(false);
  const current = useMemo(
    () => parseValue(props.value as string),
    [props.value],
  );

  function emitChange(next: dayjs.Dayjs) {
    const now = dayjs();
    let capped = next;

    if (next.isSame(now, "day") && next.isAfter(now)) {
      capped = now;
    }

    if (maxDate) {
      const max = dayjs(maxDate).endOf("day");

      if (capped.isAfter(max)) {
        capped = max;
      }
    }

    props.onChange?.(toStoredValue(capped) as any);
  }

  function handleDateChange(date: Date) {
    emitChange(
      current
        .year(dayjs(date).year())
        .month(dayjs(date).month())
        .date(dayjs(date).date()),
    );
  }

  function handleTimeChange(val?: ZonedDateTime | null) {
    if (!val) return;

    emitChange(dayjs(val.toDate()));
  }

  return (
    <Input
      ref={ref}
      {...props}
      readOnly
      endContent={
        <div className="flex items-center">
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={() => {
              props.onChange?.("" as any);
            }}
          >
            <X className="text-gray-600" size={18} />
          </Button>
          <Popover
            isOpen={open}
            placement="bottom"
            onOpenChange={(isOpen) => setOpen(isOpen)}
          >
            <PopoverTrigger>
              <Calendar1Icon className="text-secondary-600 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="mt-3">
              <div className="px-1 py-2 space-y-3">
                <Calendar
                  color="#077fb6"
                  date={current.toDate()}
                  locale={id}
                  maxDate={maxDate}
                  minDate={minDate}
                  onChange={handleDateChange}
                />
                <TimeInput
                  hourCycle={24}
                  label="Jam"
                  size="sm"
                  value={parseAbsoluteToLocal(current.toISOString())}
                  onChange={handleTimeChange}
                />
                <div className="text-right">
                  <Button
                    color="primary"
                    size="sm"
                    variant="shadow"
                    onPress={() => setOpen(false)}
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      }
      value={props.value ? current.format("DD MMMM YYYY | HH:mm") : ""}
      onClick={() => setOpen(true)}
    />
  );
}

export default forwardRef(CustomDateTimePicker);

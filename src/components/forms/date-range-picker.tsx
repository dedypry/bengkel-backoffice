import { Button, DateRangePicker, DateRangePickerProps } from "@heroui/react";
import { useEffect, useState } from "react";
import { parseDate, CalendarDate } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";
import { X } from "lucide-react";

interface CustomDateRangePickerProps
  extends Omit<DateRangePickerProps, "onChange" | "value"> {
  value?: { start: string | Date; end: string | Date } | null;
  onChange?: (value: { start: string; end: string } | null) => void;
}

export default function CustomDateRangePicker({
  value: propsValue,
  onChange,
  ...props
}: CustomDateRangePickerProps) {
  // Helper untuk konversi input ke CalendarDate (format HeroUI/Internationalized)
  const toCalendarDate = (dateInput: any): CalendarDate | null => {
    if (!dateInput) return null;
    if (dateInput instanceof Date) {
      return new CalendarDate(
        dateInput.getFullYear(),
        dateInput.getMonth() + 1,
        dateInput.getDate(),
      );
    }
    if (typeof dateInput === "string") {
      return parseDate(dateInput.split("T")[0]);
    }

    return dateInput;
  };

  // State internal untuk RangeValue
  const [innerValue, setInnerValue] = useState<RangeValue<CalendarDate> | null>(
    () => {
      if (propsValue?.start && propsValue?.end) {
        return {
          start: toCalendarDate(propsValue.start) as CalendarDate,
          end: toCalendarDate(propsValue.end) as CalendarDate,
        };
      }

      return null;
    },
  );

  // Sync state jika prop value dari parent berubah
  useEffect(() => {
    if (propsValue?.start && propsValue?.end) {
      setInnerValue({
        start: toCalendarDate(propsValue.start) as CalendarDate,
        end: toCalendarDate(propsValue.end) as CalendarDate,
      });
    } else {
      setInnerValue(null);
    }
  }, [propsValue]);

  function handleClear() {
    setInnerValue(null);
    if (onChange) {
      onChange({
        start: "",
        end: "",
      });
    }
  }

  return (
    <DateRangePicker
      startContent={
        <Button isIconOnly radius="full" size="sm" onPress={handleClear}>
          <X size={12} />
        </Button>
      }
      {...props}
      labelPlacement="outside"
      radius="sm"
      value={innerValue as any}
      variant="bordered"
      visibleMonths={3}
      onChange={(val: any) => {
        setInnerValue(val);
        if (onChange) {
          if (val) {
            // Mengirim balik string ISO ke parent
            onChange({
              start: val.start.toString(),
              end: val.end.toString(),
            });
          } else {
            onChange(null);
          }
        }
      }}
    />
  );
}

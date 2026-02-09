import { DatePicker, DatePickerProps } from "@heroui/react";
import { useEffect, useState, forwardRef } from "react";
import { parseDate, CalendarDate } from "@internationalized/date";

const CustomDatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (props, ref) => {
    const convertToCalendarDate = (dateInput: any): CalendarDate | null => {
      if (!dateInput) return null;

      if (dateInput instanceof Date) {
        return new CalendarDate(
          dateInput.getFullYear(),
          dateInput.getMonth() + 1,
          dateInput.getDate(),
        );
      }

      if (typeof dateInput === "string" && dateInput.includes("-")) {
        // Pastikan format string yyyy-mm-dd
        return parseDate(dateInput.split("T")[0]);
      }

      return dateInput;
    };

    const [value, setValue] = useState<CalendarDate | null>(
      convertToCalendarDate(props.value),
    );

    useEffect(() => {
      setValue(convertToCalendarDate(props.value));
    }, [props.value]);

    return (
      <DatePicker
        {...(props as any)}
        ref={ref} // 3. Teruskan ref ke HeroUI DatePicker
        showMonthAndYearPickers
        placeholderValue={undefined}
        value={value as any}
        onChange={(val: any) => {
          setValue(val);
          // Teruskan nilai string ke Hook Form / parent agar konsisten dengan DTO Backend
          if (props.onChange) {
            props.onChange(val ? val.toString() : null);
          }
        }}
      />
    );
  },
);

// 4. Set display name
CustomDatePicker.displayName = "CustomDatePicker";

export default CustomDatePicker;

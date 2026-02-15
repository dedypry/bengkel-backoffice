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
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar1Icon } from "lucide-react";

import id from "date-fns/locale/id";
import dayjs from "dayjs";
import { dateFormat } from "@/utils/helpers/formater";

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
                locale={id}
                moveRangeOnFirstSelection={false}
                rangeColors={["#077fb6"]}
                ranges={[dateRange]}
                retainEndDateOnFirstSelection={false}
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
      }
      value={value}
      onClick={() => setOpen(true)}
    />
  );
}

export default forwardRef(CustomDateRangePicker);

/* eslint-disable import/order */
import {
  Input,
  InputProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { forwardRef, useState } from "react";
import { Calendar } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar1Icon } from "lucide-react";

import dayjs from "dayjs";
import id from "date-fns/locale/id";

interface Props {
  maxDate?: Date;
  minDate?: Date;
}
function CustomDatePicker(
  { maxDate, minDate, ...props }: Props & InputProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const [open, setOpen] = useState(false);

  return (
    <Input
      ref={ref}
      {...props}
      readOnly
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
              <Calendar
                color="#077fb6"
                date={dayjs(props.value || new Date()).toDate()}
                locale={id}
                maxDate={maxDate}
                minDate={minDate}
                onChange={(e) => {
                  if (props.onChange) {
                    props.onChange(dayjs(e).format("YYYY-MM-DD") as any);
                  }
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      }
      value={dayjs(props.value || new Date()).format("DD MMMM YYYY")}
      onClick={() => setOpen(true)}
    />
  );
}

export default forwardRef(CustomDatePicker);

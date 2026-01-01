import { Calendar as CalendarIcon } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  value?: Date;
  setValue: (date: string) => void;
}
export function DatePicker({ value, setValue }: Props) {
  //   console.log("VAL", value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
          data-empty={!value}
          variant="outline"
        >
          <CalendarIcon />
          {value ? (
            dayjs(value).format("ddd, DD MMM YYYY")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          mode="single"
          required={true}
          selected={value}
          onSelect={(date) => {
            setValue(date.toISOString());
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

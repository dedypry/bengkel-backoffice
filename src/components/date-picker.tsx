import { Calendar as CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Box, Dropdown, Input, Menu, MenuButton } from "@mui/joy";

import { Calendar } from "@/components/ui/calendar";

interface Props {
  value?: Date;
  setValue: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
export function DatePicker({ value, setValue, placeholder, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (disabled) {
    return (
      <Input
        readOnly
        placeholder={placeholder || "Pilih tanggal"}
        startDecorator={<CalendarIcon size={18} />}
        sx={{ pointerEvents: "none" }}
        value={value ? dayjs(value).format("DD MMM YYYY") : ""}
      />
    );
  }

  return (
    <Dropdown open={open} onOpenChange={(_, isOpen) => setOpen(isOpen)}>
      <MenuButton
        slots={{ root: Box }}
        sx={{ width: "100%", cursor: "pointer" }}
      >
        <Input
          readOnly
          placeholder={placeholder || "Pilih tanggal"}
          startDecorator={<CalendarIcon size={18} />}
          sx={{ pointerEvents: "none" }}
          value={value ? dayjs(value).format("DD MMM YYYY") : ""}
        />
      </MenuButton>

      <Menu
        ref={containerRef}
        placement="bottom-start"
        sx={{
          p: 2,
          zIndex: 1300,
          boxShadow: "lg",
          borderRadius: "md",
          minWidth: "auto",
        }}
      >
        <Box
          sx={{
            "& .rdp": { "--rdp-accent-color": "#168BAB", margin: 0 },
            "& .rdp-day_selected": { backgroundColor: "#168BAB !important" },
          }}
        >
          <Calendar
            captionLayout="dropdown"
            mode="single"
            required={true}
            selected={value}
            onSelect={(date) => {
              date.setHours(12, 0, 0, 0);
              setValue(date.toISOString());
              setOpen(false);
            }}
          />
        </Box>
      </Menu>
    </Dropdown>
  );
}

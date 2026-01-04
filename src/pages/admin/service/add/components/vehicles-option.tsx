/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { IVehicle } from "@/utils/interfaces/IUser";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Props {
  onSelect: (data: IVehicle) => void;
  items: IVehicle[];
}
export default function VehiclesOption({
  items,
  onSelect,
  ...props
}: Props & ComponentProps<"input">) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        {...props}
        autoComplete="off"
        className="uppercase font-bold text-lg pr-10"
        placeholder="B 1234 ABC"
        onFocus={() => setOpen(true)}
      />
      <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
      {open && items.length > 0 && (
        <div className="absolute w-full mt-2">
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-1 flex flex-col gap-1">
            {items.map((item, i) => (
              <div
                key={i}
                className="cursor-pointer  hover:bg-gray-100 px-3 py-1"
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                {item.plate_number}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

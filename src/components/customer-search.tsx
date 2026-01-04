/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { ICustomer } from "@/utils/interfaces/IUser";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "./ui/input";
import { Avatar, AvatarImage } from "./ui/avatar";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import debounce from "@/utils/helpers/debounce";
import { getCustomer } from "@/stores/features/customer/customer-action";
import { getAvatarByName } from "@/utils/helpers/global";

interface Props {
  value: any;
  onChange: (val: any) => void;
  onCustomer: (cus: ICustomer) => void;
  placeholder?: string;
}
export default function CustomerSearch({
  value,
  onChange,
  onCustomer,
  placeholder,
}: Props) {
  const { customers, query } = useAppSelector((state) => state.customer);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
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

  const handleSearch = debounce((q) => {
    dispatch(
      getCustomer({
        ...query,
        q,
        noStats: true,
        pageSize: 100,
        isVehicle: true,
      }),
    );
  }, 1000);

  return (
    <div ref={containerRef} className="relative">
      <Input
        autoComplete="off"
        className="pr-10"
        id="customer"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const val = e.target.value;

          handleSearch(val);
          onChange(val);
        }}
        onFocus={() => setOpen(true)}
      />
      <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
      {customers?.data?.length! > 0 && open && (
        <div className="absolute w-full mt-2">
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-1 flex flex-col gap-1">
            {customers?.data?.map((cs) => (
              <div
                key={cs.id}
                className="cursor-pointer flex gap-2 items-center hover:bg-gray-100 px-3 py-1"
                onClick={() => {
                  onCustomer(cs);
                  setOpen(false);
                }}
              >
                <Avatar>
                  <AvatarImage
                    src={cs.profile?.photo_url || getAvatarByName(cs.name)}
                  />
                </Avatar>
                <div className="flex flex-col">
                  <span>{cs.name}</span>
                  <span className="text-xs text-gray-400">{cs.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

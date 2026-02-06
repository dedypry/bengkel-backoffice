/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { IGroupedPermissions } from "@/utils/interfaces/IRole";

import { Checkbox, Divider } from "@heroui/react";
import { ShieldCheck, Lock, ChevronRight } from "lucide-react";

interface Props {
  data: IGroupedPermissions;
  selectedIds: number[];
  setSelectedIds: (val: number[]) => void;
}

export default function PermissionTable({
  data,
  selectedIds,
  setSelectedIds,
}: Props) {
  const handleToggle = (id: number) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id],
    );
  };

  const handleToggleGroup = (ids: number[], isAllSelected: boolean) => {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter((id) => !ids.includes(id)));
    } else {
      const newIds = [...new Set([...selectedIds, ...ids])];

      setSelectedIds(newIds);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {Object.entries(data).map(([groupName, items]) => {
        const groupIds = items.map((i) => i.id);
        const isAllGroupSelected = groupIds.every((id) =>
          selectedIds.includes(id),
        );
        const isSomeGroupSelected =
          groupIds.some((id) => selectedIds.includes(id)) &&
          !isAllGroupSelected;

        return (
          <div key={groupName} className="group transition-all">
            {/* Group Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-gray-900 flex items-center justify-center text-white shadow-lg">
                  <Lock size={14} />
                </div>
                <h3 className="text-sm font-black uppercase italic tracking-[0.15em] text-gray-800">
                  Modul {groupName}
                </h3>
              </div>

              <Checkbox
                classNames={{
                  label:
                    "text-[10px] font-black uppercase italic text-gray-400",
                }}
                color="danger"
                isIndeterminate={isSomeGroupSelected}
                isSelected={isAllGroupSelected}
                size="sm"
                onValueChange={() =>
                  handleToggleGroup(groupIds, isAllGroupSelected)
                }
              >
                Pilih Semua
              </Checkbox>
            </div>

            {/* Permission Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`
                      cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-4
                      ${
                        isSelected
                          ? "border-gray-900 bg-gray-900 text-white shadow-md shadow-gray-200"
                          : "border-gray-100 bg-white hover:border-gray-300"
                      }
                    `}
                    onClick={() => handleToggle(item.id)}
                  >
                    <Checkbox
                      className="mt-1"
                      color="danger"
                      isSelected={isSelected}
                      onValueChange={() => handleToggle(item.id)}
                    />
                    <div className="space-y-1">
                      <p
                        className={`text-xs font-black uppercase italic tracking-tight ${isSelected ? "text-white" : "text-gray-800"}`}
                      >
                        {item.name}
                      </p>
                      <p
                        className={`text-[10px] leading-relaxed font-medium ${isSelected ? "text-gray-400" : "text-gray-400"}`}
                      >
                        {item.description}
                      </p>
                    </div>
                    {isSelected && (
                      <ShieldCheck
                        className="ml-auto text-rose-500 shrink-0"
                        size={16}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <Divider className="mt-8 bg-gray-100" />
          </div>
        );
      })}

      {/* Footer Summary */}
      <div className="mt-10 p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <ShieldCheck className="text-rose-500" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Status Konfigurasi
            </p>
            <p className="text-sm font-black italic text-gray-700">
              {selectedIds.length} Hak Akses Diberikan
            </p>
          </div>
        </div>
        <ChevronRight className="text-gray-300" />
      </div>
    </div>
  );
}

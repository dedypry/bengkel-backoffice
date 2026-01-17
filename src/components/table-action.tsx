import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { confirmSweat } from "@/utils/helpers/notify";

interface Props {
  onEdit?: () => void;
  onDetail?: () => void;
  onDelete?: () => void;
  viewDetail?: boolean;
  viewHeader?: boolean;
  isDeleteSeparator?: boolean;
  titleHeader?: string;
}

export default function TableAction({
  onDelete,
  onDetail,
  onEdit,
  viewDetail = true,
  viewHeader,
  titleHeader,
  isDeleteSeparator = true,
}: Props) {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-full hover:bg-white hover:shadow-md text-slate-400 hover:text-blue-600 data-[state=open]:bg-white data-[state=open]:shadow-sm"
            size="icon"
            variant="ghost"
          >
            <MoreVertical size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {viewHeader && (
            <>
              <DropdownMenuLabel>{titleHeader || "Aksi"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}

          {viewDetail && (
            <DropdownMenuItem onClick={onDetail}>
              <Eye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Data
          </DropdownMenuItem>
          {isDeleteSeparator && <DropdownMenuSeparator />}

          {/* Gunakan onSelect dan preventDefault agar dropdown tidak menutup dialog */}
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onSelect={(e) => {
              e.preventDefault();
              confirmSweat(onDelete!);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

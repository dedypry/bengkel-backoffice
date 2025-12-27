import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Props {
  onEdit?: () => void;
  onDetail?: () => void;
  onDelete?: () => void;
}

export default function TableAction({ onDelete, onDetail, onEdit }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDetail}>
            <Eye className="mr-2 h-4 w-4" />
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Data
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Gunakan onSelect dan preventDefault agar dropdown tidak menutup dialog */}
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onSelect={(e) => {
              e.preventDefault();
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AlertDialog diletakkan di luar DropdownMenu */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data akan terhapus secara
              permanen dari server kami.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete?.();
                setShowDeleteDialog(false);
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

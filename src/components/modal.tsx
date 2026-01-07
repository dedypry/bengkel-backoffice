import type { ReactNode } from "react";

import { cn } from "@/lib/utils"; // Pastikan utilitas cn shadcn tersedia
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Definisi tipe untuk ukuran modal
type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

interface ModalProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCancel?: boolean;
  size?: ModalSize; // Tambahkan prop size
  onSave?: () => void;
  isLoading?: boolean;
}

export function Modal({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  showCancel = true,
  size = "md", // Default size ke md
  onSave,
  isLoading,
}: ModalProps) {
  // Mapping ukuran ke class Tailwind
  const sizeClasses: Record<ModalSize, string> = {
    xs: "sm:max-w-xs",
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
    full: "sm:max-w-[95vw]", // Hampir layar penuh
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={cn(
          sizeClasses[size],
          "max-h-[calc(100vh-10px)] overflow-y-auto scrollbar-modern",
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        <DialogFooter>
          {footer ? (
            footer
          ) : (
            <>
              {showCancel && (
                <DialogClose asChild>
                  <Button disabled={isLoading} type="button" variant="outline">
                    Batal
                  </Button>
                </DialogClose>
              )}
              <Button disabled={isLoading} onClick={onSave}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

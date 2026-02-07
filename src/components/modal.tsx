import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { type ReactNode } from "react";
import { Save } from "lucide-react";

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
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCancel?: boolean;
  size?: ModalSize;
  onSave?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  disable?: boolean;
  scrollBehavior?: "inside" | "outside";
}

export default function Modal({
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  showCancel = true,
  size = "md",
  onSave,
  isLoading,
  disable,
  onClose,
  scrollBehavior = "inside",
}: ModalProps) {
  // Custom close handler untuk memastikan onClose terpanggil
  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
  };

  return (
    <HeroModal
      backdrop="blur"
      classNames={{
        base: "rounded-[2.5rem] border border-gray-100 shadow-2xl",
        header: "border-b border-gray-50 px-8 py-6",
        body: "p-8",
        footer: "border-t border-gray-50 px-8 py-4 bg-gray-50/50",
        closeButton:
          "hover:bg-gray-100 active:scale-95 transition-transform top-6 right-6",
      }}
      isOpen={open}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        },
      }}
      scrollBehavior={scrollBehavior}
      size={size}
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-800 leading-none">
                {title}
              </h3>
              {description && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {description}
                </p>
              )}
            </ModalHeader>

            <ModalBody>
              <div className="py-2">{children}</div>
            </ModalBody>

            <ModalFooter>
              {footer ? (
                footer
              ) : (
                <div className="flex gap-3 w-full sm:w-auto">
                  {showCancel && (
                    <Button
                      className="font-black uppercase italic text-xs tracking-widest h-12 px-8 rounded-2xl"
                      isDisabled={isLoading}
                      variant="flat"
                      onPress={handleClose}
                    >
                      Batal
                    </Button>
                  )}
                  <Button
                    className="bg-gray-900 text-white font-black uppercase italic text-xs tracking-widest h-12 px-8 rounded-2xl shadow-lg shadow-gray-200"
                    color="primary"
                    isDisabled={disable}
                    isLoading={isLoading}
                    startContent={!isLoading && <Save size={18} />}
                    onPress={onSave}
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </HeroModal>
  );
}

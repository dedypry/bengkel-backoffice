import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  ModalClose,
  ModalDialog,
  Modal as ModalJoi,
  Typography,
} from "@mui/joy";
import { useRef, type ReactNode } from "react";
import { Transition } from "react-transition-group";

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

export default function Modal({
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
  const sizeConfig: Record<ModalSize, any> = {
    xs: 320,
    sm: 400,
    md: 500,
    lg: 600,
    xl: 800,
    "2xl": 1000,
    "3xl": 1200,
    "4xl": 1400,
    "5xl": 1600,
    full: "95vw",
  };
  const nodeRef = useRef(null);

  return (
    <Transition in={open} nodeRef={nodeRef} timeout={400}>
      {(state: string) => {
        return (
          <ModalJoi
            ref={nodeRef}
            keepMounted
            open={!["exited", "exiting"].includes(state)}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: "none",
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: "blur(8px)" },
                    entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  }[state],
                },
              },
            }}
            sx={[
              state === "exited"
                ? { visibility: "hidden" }
                : { visibility: "visible" },
              size != "full" && {
                "& .MuiModalDialog-root": {
                  width: "100%",
                  maxWidth: sizeConfig[size],
                },
              },
            ]}
            onClose={() => onOpenChange!(false)}
          >
            <ModalDialog
              layout={size === "full" ? "fullscreen" : "center"}
              sx={{
                opacity: 0,
                transition: `opacity 300ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
            >
              <ModalClose />
              <DialogTitle sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography color="neutral" fontSize={18} fontWeight={700}>
                    {title}
                  </Typography>
                  <Typography color="neutral" fontSize={12}>
                    {description}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent>{children}</DialogContent>

              <DialogActions>
                {footer ? (
                  footer
                ) : (
                  <>
                    <Box sx={{ gap: 2, display: "flex" }}>
                      {showCancel && (
                        <Button color="neutral" variant="outlined">
                          Batal
                        </Button>
                      )}

                      <Button disabled={isLoading} onClick={onSave}>
                        Simpan
                      </Button>
                    </Box>
                  </>
                )}
              </DialogActions>
            </ModalDialog>
          </ModalJoi>
        );
      }}
    </Transition>
  );

  // return (
  //   <Dialog open={open} onOpenChange={onOpenChange}>
  //     {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

  //     <DialogContent
  //       className={cn(
  //         sizeClasses[size],
  //         "max-h-[calc(100vh-10px)] overflow-y-auto scrollbar-modern",
  //       )}
  //     >
  //       <DialogHeader>
  //         <DialogTitle>{title}</DialogTitle>
  //         {description && <DialogDescription>{description}</DialogDescription>}
  //       </DialogHeader>

  //       <div className="py-4">{children}</div>

  //       <DialogFooter>
  //         {footer ? (
  //           footer
  //         ) : (
  //           <>
  //             {showCancel && (
  //               <DialogClose asChild>
  //                 <Button disabled={isLoading} type="button" variant="outline">
  //                   Batal
  //                 </Button>
  //               </DialogClose>
  //             )}
  //             <Button disabled={isLoading} onClick={onSave}>
  //               {isLoading ? "Menyimpan..." : "Simpan"}
  //             </Button>
  //           </>
  //         )}
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // );
}

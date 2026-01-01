import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";

import ModalAddCompany from "./modal-add-company";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers/global";
import { setStoreCompany } from "@/stores/features/auth/auth-action";

export function BrandSwitcher() {
  const { user, company } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const { isMobile } = useSidebar();
  const dispatch = useAppDispatch();

  return (
    <>
      <ModalAddCompany open={modalOpen} setOpen={setModalOpen} />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                size="lg"
              >
                {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              </div> */}
                <Avatar className="rounded-md">
                  <AvatarImage src={company?.logo_url!} />
                  <AvatarFallback>{getInitials(company?.name!)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{company?.name}</span>
                  <span className="truncate text-xs">{company?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Cabang
              </DropdownMenuLabel>
              {user?.companies.map((brand) => (
                <DropdownMenuItem
                  key={brand.name}
                  className="gap-2 p-2"
                  onClick={() => dispatch(setStoreCompany(brand.id))}
                >
                  <Avatar className="rounded-md size-6" color="primary">
                    <AvatarImage src={brand?.logo_url!} />
                    <AvatarFallback>{getInitials(brand?.name)}</AvatarFallback>
                  </Avatar>
                  {brand.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setModalOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Tambah Cabang
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

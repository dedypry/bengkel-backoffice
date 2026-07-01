import { useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import { ChevronsUpDown, Plus } from "lucide-react";

import ModalAddCompany from "../modal-add-company";

import { SidebarLabel } from "./sidebar-label";

import { useSidebar } from "@/context/sidebar-context";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setStoreCompany } from "@/stores/features/auth/auth-action";
import { getInitials } from "@/utils/helpers/global";

export function SidebarHeader() {
  const { collapsed } = useSidebar();
  const { user, company } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <>
      <ModalAddCompany open={modalOpen} setOpen={setModalOpen} />
      <div className="shrink-0 border-b border-white/20 py-3">
        <Dropdown backdrop="blur" placement="bottom-start">
          <DropdownTrigger>
            <Button
              disableRipple
              className="h-auto min-h-12 w-full justify-start bg-transparent px-0 py-2"
              variant="light"
            >
              <div className="flex w-full min-w-0 items-center gap-2.5 py-2 pl-2.5 pr-3">
                <Avatar
                  isBordered
                  className="shrink-0 rounded-md"
                  name={getInitials(company?.name ?? "B")}
                  size="sm"
                  src={company?.logo_url ?? undefined}
                />
                <SidebarLabel className="min-w-0 flex-1" collapsed={collapsed}>
                  <div className="overflow-hidden pl-1 text-left leading-tight">
                    <p className="truncate text-sm font-semibold text-white">
                      {company?.name}
                    </p>
                    <p className="truncate text-xs text-white/70">
                      {company?.email}
                    </p>
                  </div>
                </SidebarLabel>
                {!collapsed && (
                  <ChevronsUpDown className="size-4 shrink-0 text-white/60" />
                )}
              </div>
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Daftar cabang"
            selectionMode="single"
            variant="flat"
            onAction={(key) => {
              if (key === "add_branch") {
                setModalOpen(true);
              } else {
                dispatch(setStoreCompany(Number(key)));
              }
            }}
          >
            <DropdownSection showDivider title="Cabang">
              {user?.companies?.map((brand) => (
                <DropdownItem
                  key={brand.id}
                  startContent={
                    <Avatar
                      className="size-6 rounded-md"
                      name={getInitials(brand?.name)}
                      src={brand?.logo_url ?? undefined}
                    />
                  }
                  textValue={brand.name}
                >
                  {brand.name}
                </DropdownItem>
              )) ?? []}
            </DropdownSection>

            <DropdownSection>
              <DropdownItem
                key="add_branch"
                className="text-primary"
                color="primary"
                startContent={
                  <div className="flex size-6 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                    <Plus className="size-4" />
                  </div>
                }
              >
                Tambah Cabang
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import * as LucideIcons from "lucide-react";
import { ChevronsUpDown, Plus, SquareTerminal } from "lucide-react";

import ModalAddCompany from "../modal-add-company";

import MenuItem from "./menu-item";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setStoreCompany } from "@/stores/features/auth/auth-action";
import { getInitials } from "@/utils/helpers/global";

export default function SidebarMenu() {
  const { navigations, user, company } = useAppSelector((state) => state.auth);
  const [selected, setSelected] = useState<string>(window.location.pathname);
  const [modalOpen, setModalOpen] = useState(false);
  const { pathname } = useLocation();

  const dispatch = useAppDispatch();

  useEffect(() => {
    setSelected(pathname);
  }, [pathname]);

  return (
    <div className="flex max-h-screen flex-col">
      <ModalAddCompany open={modalOpen} setOpen={setModalOpen} />
      <div className="pr-2">
        <Dropdown backdrop="blur" placement="bottom-end">
          <DropdownTrigger>
            <Button
              disableRipple
              className="w-full h-14 p-2 justify-start bg-transparent  transition-bg my-5"
              variant="bordered"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar
                  isBordered
                  className="rounded-sm"
                  name={getInitials(company?.name!)}
                  size="sm"
                  src={company?.logo_url!}
                />
                <div className="flex flex-col items-start flex-1 overflow-hidden leading-tight">
                  <span className="truncate font-semibold text-small text-white w-full text-left">
                    {company?.name}
                  </span>
                  <span className="truncate text-tiny text-default-500 w-full text-left">
                    {company?.email}
                  </span>
                </div>
                <ChevronsUpDown className="text-default-400" size={16} />
              </div>
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Daftar Cabang"
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
                  key={brand.id} // Gunakan ID sebagai key untuk mempermudah dispatch
                  startContent={
                    <Avatar
                      className="w-6 h-6 rounded-md"
                      name={getInitials(brand?.name)}
                      src={brand?.logo_url!}
                    />
                  }
                  textValue={brand.name}
                >
                  {brand.name}
                </DropdownItem>
              )) || []}
            </DropdownSection>

            <DropdownSection>
              <DropdownItem
                key="add_branch"
                className="text-primary"
                color="primary"
                startContent={
                  <div className="flex size-6 items-center justify-center rounded-md border-1 border-primary/30 bg-primary/10">
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

      <ul className="flex-1 overflow-y-auto pb-10 pr-1 scrollbar-modern">
        {navigations.map((item, i) => {
          const IconParent =
            item.icon && (LucideIcons as any)[item.icon]
              ? (LucideIcons as any)[item.icon]
              : SquareTerminal;

          return (
            <div key={i}>
              {item.header ? (
                <MenuItem
                  item={
                    { ...item, icon: IconParent, urlParent: item.href } as any
                  }
                  selected={selected}
                />
              ) : (
                <Link
                  className={`sidebar-item ${selected === item.href ? "bg-white text-gray-800" : "text-white"}`}
                  to={item.href || ""}
                >
                  <IconParent size={20} /> {item.title}
                </Link>
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

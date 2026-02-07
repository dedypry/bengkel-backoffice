import { User, LogOut, Wrench, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  User as UserHero,
  Avatar,
} from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { getInitials } from "@/utils/helpers/global";
import { confirmSweat } from "@/utils/helpers/notify";

export default function UserMenu() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <Dropdown
      classNames={{
        content:
          "p-0 border border-divider bg-background rounded-sm shadow-xl min-w-[240px]",
      }}
      placement="bottom-end"
    >
      <DropdownTrigger>
        <Avatar
          as="button"
          className="transition-transform size-11 font-bold text-gray-500 bg-white border border-gray-200"
          color="default"
          name={getInitials(user?.name!)}
          src={user?.profile?.photo_url!}
        />
      </DropdownTrigger>

      <DropdownMenu
        aria-label="User Actions"
        className="p-1"
        itemClasses={{
          base: [
            "rounded-sm",
            "text-default-600",
            "data-[hover=true]:text-gray-950",
            "data-[hover=true]:bg-gray-50",
            "py-3",
            "px-4",
          ],
          title: "font-bold uppercase text-[10px] tracking-wider",
        }}
        variant="flat"
      >
        <DropdownSection showDivider>
          <DropdownItem
            key="profile_info"
            isReadOnly
            className="h-16 gap-2 opacity-100"
          >
            <UserHero
              avatarProps={{
                size: "sm",
                src: user?.profile?.photo_url!,
                className: "hidden md:flex",
              }}
              classNames={{
                name: "font-bold uppercase text-gray-500 tracking-tight",
                description: "text-[10px] font-medium text-gray-500",
              }}
              description={user?.email}
              name={user?.name}
            />
          </DropdownItem>
        </DropdownSection>

        <DropdownSection
          classNames={{
            heading:
              "px-4 pt-2 text-[9px] font-bold uppercase text-gray-400 tracking-[0.2em]",
          }}
          title="Akses Cepat"
        >
          <DropdownItem
            key="my-profile"
            startContent={<User className="text-blue-600" size={16} />}
            onPress={() => navigate("/my-profile")}
          >
            Profil Saya
          </DropdownItem>
          <DropdownItem
            key="vehicles"
            startContent={<Car className="text-orange-600" size={16} />}
            onPress={() => navigate("/master/vehicles")}
          >
            Daftar Kendaraan
          </DropdownItem>
          <DropdownItem
            key="settings"
            startContent={<Wrench className="text-gray-500" size={16} />}
            onPress={() => navigate("/settings/profile")}
          >
            Konfigurasi Bengkel
          </DropdownItem>
        </DropdownSection>

        <DropdownSection>
          <DropdownItem
            key="logout"
            className="text-red-600"
            color="danger"
            startContent={<LogOut size={16} />}
            variant="light"
            onPress={() =>
              confirmSweat(handleLogout, {
                title: "Akhiri Sesi?",
                text: "Anda akan keluar dari sistem manajemen bengkel.",
                icon: "question",
                confirmButtonText: "Ya, Keluar",
                cancelButtonText: "Batal",
              })
            }
          >
            Keluar Aplikasi
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

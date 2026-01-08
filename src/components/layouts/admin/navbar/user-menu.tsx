import { User, LogOut, Wrench, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/stores/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers/global";
import { confirmSweat } from "@/utils/helpers/notify";

export default function UserMenu() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    Cookies.remove("token");
    navigate("/login");
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="size-12 rounded-full border">
          <AvatarImage src={user?.profile?.photo_url!} />
          <AvatarFallback>{getInitials(user?.name!)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-bold">{user?.name}</span>
          <span className="text-xs text-muted-foreground font-normal">
            {user?.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/my-profile")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profil Saya</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/settings/profile")}
        >
          <Wrench className="mr-2 h-4 w-4" />
          <span>Pengaturan Bengkel</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Car className="mr-2 h-4 w-4" />
          <span>Daftar Kendaraan</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
          onClick={() =>
            confirmSweat(handleLogout, {
              title: "Keluar dari Aplikasi?",
              text: "Anda harus login kembali untuk mengakses data bengkel.",
              icon: "question",
              confirmButtonText: "Ya, Keluar",
              cancelButtonText: "Batal",
            })
          }
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar Aplikasi</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

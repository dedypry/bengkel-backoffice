import { Bell, CheckCircle2, Package, Clock } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  Badge,
} from "@heroui/react";

export default function NotificationDropdown() {
  // Data dummy
  const notifications = [
    {
      id: 1,
      title: "SERVIS SELESAI",
      desc: "Toyota Avanza B 1234 GHO siap diambil.",
      time: "5 MENIT LALU",
      icon: <CheckCircle2 className="size-4 text-emerald-500" />,
      unread: true,
    },
    {
      id: 2,
      title: "STOK MENIPIS",
      desc: "Oli Shell Helix sisa 2 botol lagi.",
      time: "2 JAM LALU",
      icon: <Package className="size-4 text-amber-500" />,
      unread: true,
    },
    {
      id: 3,
      title: "BOOKING BARU",
      desc: "Pelanggan baru melakukan pendaftaran.",
      time: "1 HARI LALU",
      icon: <Clock className="size-4 text-blue-500" />,
      unread: false,
    },
  ];

  return (
    <Dropdown
      classNames={{
        content:
          "p-0 border border-divider bg-background rounded-sm shadow-xl min-w-[320px]",
      }}
      placement="bottom-end"
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          className="relative transition-transform size-10 bg-gray-50 border border-gray-100"
          radius="sm"
          variant="light"
        >
          <Badge
            className="absolute top-1 right-1 border-2 border-white"
            color="danger"
            content=""
            shape="circle"
            size="sm"
          >
            <Bell className="size-5 text-gray-600" />
          </Badge>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Notifications"
        className="p-0"
        itemClasses={{
          base: [
            "rounded-none",
            "py-4",
            "px-5",
            "border-b",
            "border-divider",
            "data-[hover=true]:bg-gray-50",
          ],
        }}
      >
        <DropdownSection
          classNames={{
            heading:
              "px-5 py-3 text-md font-black uppercase text-gray-400 tracking-[0.2em] border-b border-divider bg-gray-50/50 w-full rounded-t-sm",
          }}
          title="NOTIFIKASI SISTEM"
        >
          {notifications.map((item) => (
            <DropdownItem
              key={item.id}
              className={item.unread ? "bg-blue-50/30" : ""}
              description={
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 leading-normal uppercase tracking-tight">
                    {item.desc}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 tracking-widest">
                    {item.time}
                  </p>
                </div>
              }
              endContent={
                item.unread && (
                  <div className="size-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                )
              }
              startContent={<div className="mt-1">{item.icon}</div>}
            >
              <span className="font-black text-[11px] tracking-wider text-gray-800 uppercase">
                {item.title}
              </span>
            </DropdownItem>
          ))}
        </DropdownSection>

        <DropdownSection className="p-2">
          <DropdownItem
            key="view_all"
            className="text-center rounded-sm data-[hover=true]:bg-gray-900 data-[hover=true]:text-white transition-all"
            textValue="Lihat Semua"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Lihat Semua Aktivitas
            </span>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

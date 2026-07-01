import type { LucideIcon } from "lucide-react";

import { Bell } from "lucide-react";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@heroui/react";

import {
  useNotifications,
  type NotificationViewItem,
} from "./use-notifications";

type NotificationMenuEntry =
  | { key: "header"; kind: "header" }
  | { key: string; kind: "notification"; item: NotificationViewItem }
  | { key: "empty"; kind: "empty" }
  | { key: "view_all"; kind: "footer" };

export default function NotificationDropdown() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const notificationEntries: NotificationMenuEntry[] = notifications.map(
    (item) => ({
      key: String(item.id),
      kind: "notification" as const,
      item,
    }),
  );

  const emptyEntries: NotificationMenuEntry[] = [
    { key: "empty", kind: "empty" },
  ];

  const menuEntries: NotificationMenuEntry[] = [
    { key: "header", kind: "header" },
    ...(notifications.length === 0 ? emptyEntries : notificationEntries),
    { key: "view_all", kind: "footer" },
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
          className="relative size-10 border border-default-200 bg-default-50"
          radius="sm"
          variant="light"
        >
          <Badge
            color="primary"
            content={unreadCount > 0 ? unreadCount : undefined}
            isInvisible={unreadCount === 0}
            shape="circle"
            size="sm"
          >
            <Bell className="size-5 text-default-600" />
          </Badge>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Notifikasi"
        className="p-0"
        itemClasses={{
          base: [
            "rounded-none",
            "gap-3",
            "py-3",
            "px-4",
            "border-b",
            "border-divider",
            "data-[hover=true]:bg-primary-50",
            "data-[hover=true]:text-primary",
          ],
        }}
        items={menuEntries}
        variant="flat"
      >
        {(entry) => {
          if (entry.kind === "header") {
            return (
              <DropdownItem
                key={entry.key}
                isReadOnly
                className="h-auto min-h-0 cursor-default rounded-none border-b border-divider bg-default-50/80 px-5 py-4 opacity-100 data-[hover=true]:bg-default-50/80"
                textValue="Notifikasi"
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-default-700">
                    Notifikasi
                  </p>
                  {unreadCount > 0 && (
                    <button
                      className="text-xs font-medium text-primary hover:underline"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void markAllAsRead();
                      }}
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
              </DropdownItem>
            );
          }

          if (entry.kind === "empty") {
            return (
              <DropdownItem
                key={entry.key}
                isReadOnly
                className="cursor-default py-8 opacity-100 data-[hover=true]:bg-background"
                textValue="Belum ada notifikasi"
              >
                <div className="flex w-full flex-col items-center gap-2 text-default-500">
                  {loading ? (
                    <Spinner color="primary" size="sm" />
                  ) : (
                    <>
                      <Bell className="size-5" />
                      <p className="text-sm">Belum ada notifikasi</p>
                    </>
                  )}
                </div>
              </DropdownItem>
            );
          }

          if (entry.kind === "footer") {
            return (
              <DropdownItem
                key={entry.key}
                className="justify-center rounded-sm border-t border-divider p-2 text-primary data-[hover=true]:bg-primary data-[hover=true]:text-primary-foreground"
                textValue="Lihat semua"
              >
                <span className="text-sm font-medium">
                  Lihat semua aktivitas
                </span>
              </DropdownItem>
            );
          }

          const { item } = entry;
          const Icon: LucideIcon = item.icon;

          return (
            <DropdownItem
              key={entry.key}
              className={item.unread ? "bg-primary-50/40" : ""}
              description={
                <div className="space-y-1">
                  <p className="text-xs leading-normal text-default-500">
                    {item.desc}
                  </p>
                  <p className="text-xs text-default-400">{item.time}</p>
                </div>
              }
              endContent={
                item.unread ? (
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                ) : null
              }
              startContent={
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary-50 text-primary">
                  <Icon className="size-4" />
                </div>
              }
              textValue={item.title}
              onPress={() => {
                if (item.unread) {
                  void markAsRead(item.id);
                }
              }}
            >
              <span className="text-sm font-medium text-default-800">
                {item.title}
              </span>
            </DropdownItem>
          );
        }}
      </DropdownMenu>
    </Dropdown>
  );
}

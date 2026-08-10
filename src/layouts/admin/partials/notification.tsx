import type { LucideIcon } from "lucide-react";

import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@heroui/react";

import { useNotifications } from "./use-notifications";

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  function handleNotificationPress(id: number, unread: boolean, href?: string) {
    if (unread) {
      void markAsRead(id);
    }

    if (href) {
      navigate(href);
    }
  }

  return (
    <Popover
      classNames={{
        content: "p-0 border border-divider bg-background rounded-sm shadow-xl",
      }}
      offset={12}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          className="relative size-10 border border-default-200 bg-default-50"
          radius="sm"
          variant="light"
        >
          <Badge
            color="danger"
            content={unreadCount > 0 ? unreadCount : undefined}
            isInvisible={unreadCount === 0}
            shape="circle"
            size="sm"
          >
            <Bell className="size-5 text-default-600" />
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] max-w-[calc(100vw-2rem)]">
        <div className="flex w-full items-center justify-between gap-3 border-b border-divider bg-default-50/80 px-5 py-4">
          <p className="text-sm font-semibold text-default-700">Notifikasi</p>
          {unreadCount > 0 ? (
            <button
              className="text-xs font-medium text-primary hover:underline"
              type="button"
              onClick={() => void markAllAsRead()}
            >
              Tandai semua dibaca
            </button>
          ) : null}
        </div>

        <div className="scrollbar-primary max-h-[360px] w-full overflow-y-auto bg-transparent">
          {loading ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-default-500">
              <Spinner color="primary" size="sm" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-default-500">
              <Bell className="size-5" />
              <p className="text-sm">Belum ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-divider">
              {notifications.map((item) => {
                const Icon: LucideIcon = item.icon;

                return (
                  <button
                    key={item.id}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-primary-50/60 ${
                      item.unread ? "bg-primary-50/25" : "bg-transparent"
                    }`}
                    type="button"
                    onClick={() =>
                      handleNotificationPress(item.id, item.unread, item.href)
                    }
                  >
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary-50 text-primary">
                      <Icon className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium text-default-800">
                        {item.title}
                      </p>
                      {item.desc ? (
                        <p className="text-xs leading-normal text-default-500">
                          {item.desc}
                        </p>
                      ) : null}
                      <p className="text-xs text-default-400">{item.time}</p>
                    </div>

                    {item.unread ? (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-divider p-2">
          <button
            className="flex w-full items-center justify-center rounded-sm px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            type="button"
          >
            Lihat semua aktivitas
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

import type { INotification } from "@/utils/interfaces/INotification";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Bell,
  CheckCircle2,
  Clock,
  Package,
  type LucideIcon,
} from "lucide-react";

import { useAppSelector } from "@/stores/hooks";
import {
  disconnectPusher,
  subscribeUserNotifications,
} from "@/utils/libs/pusher";
import { http } from "@/utils/libs/axios";

dayjs.extend(relativeTime);

export type NotificationViewItem = {
  id: number;
  title: string;
  desc: string;
  time: string;
  icon: LucideIcon;
  unread: boolean;
};

const iconByType: Record<string, LucideIcon> = {
  service_done: CheckCircle2,
  low_stock: Package,
  booking: Clock,
  info: Bell,
};

function toViewItem(notification: INotification): NotificationViewItem {
  return {
    id: notification.id,
    title: notification.title,
    desc: notification.body ?? "",
    time: dayjs(notification.created_at).fromNow(),
    icon: iconByType[notification.type] ?? Bell,
    unread: !notification.read_at,
  };
}

export function useNotifications() {
  const user = useAppSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState<NotificationViewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      const { data } = await http.get("/notifications", {
        params: { page: 1, pageSize: 10 },
      });

      const items = (data.data ?? []) as INotification[];

      setNotifications(items.map(toViewItem));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await http.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, unread: false } : item,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await http.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    void fetchNotifications();

    const unsubscribe = subscribeUserNotifications(user.id, (payload) => {
      const notification = payload as INotification;

      setNotifications((prev) => {
        const exists = prev.some((item) => item.id === notification.id);

        if (exists) {
          return prev;
        }

        return [toViewItem(notification), ...prev].slice(0, 10);
      });
    });

    return () => {
      unsubscribe?.();
      disconnectPusher();
    };
  }, [fetchNotifications, user?.id]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}

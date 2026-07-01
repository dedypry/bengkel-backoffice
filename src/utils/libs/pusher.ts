import Cookies from "js-cookie";
import Pusher, { type Channel } from "pusher-js";

import config from "@/config/api";

let pusherClient: Pusher | null = null;

export function getPusherClient() {
  const token = Cookies.get("token");

  if (!token) {
    return null;
  }

  if (!pusherClient) {
    pusherClient = new Pusher(config.pusher.key, {
      cluster: config.pusher.cluster,
      authEndpoint: `${config.api}/notifications/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }

  return pusherClient;
}

export function subscribeUserNotifications(
  userId: number,
  onCreated: (notification: unknown) => void,
) {
  const client = getPusherClient();

  if (!client) {
    return null;
  }

  const channelName = `private-user-${userId}`;
  const channel: Channel = client.subscribe(channelName);

  channel.bind("notification.created", onCreated);

  return () => {
    channel.unbind("notification.created", onCreated);
    client.unsubscribe(channelName);
  };
}

export function disconnectPusher() {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
}

import Cookies from "js-cookie";
import Pusher, { type Channel } from "pusher-js";

import config from "@/config/api";
import { http } from "@/utils/libs/axios";

let pusherClient: Pusher | null = null;
let cachedToken: string | null = null;
const userChannels = new Map<number, Channel>();

function authorizeChannel(socketId: string, channelName: string) {
  return http
    .post("/notifications/pusher/auth", {
      socket_id: socketId,
      channel_name: channelName,
    })
    .then(({ data }) => data);
}

export function getPusherClient() {
  const token = Cookies.get("token");

  if (!token) {
    return null;
  }

  if (pusherClient && cachedToken !== token) {
    disconnectPusher();
  }

  if (!pusherClient) {
    cachedToken = token;
    pusherClient = new Pusher(config.pusher.key, {
      cluster: config.pusher.cluster,
      authorizer: (channel) => ({
        authorize: (socketId, callback) => {
          authorizeChannel(socketId, channel.name)
            .then((authData) => callback(null, authData))
            .catch((error) => callback(error as Error, null));
        },
      }),
    });
  }

  if (pusherClient.connection.state === "disconnected") {
    pusherClient.connect();
  }

  return pusherClient;
}

export function getUserChannel(userId: number): Channel | null {
  const client = getPusherClient();

  if (!client) {
    return null;
  }

  const existing = userChannels.get(userId);

  if (existing) {
    return existing;
  }

  const channelName = `private-user-${userId}`;
  const channel = client.subscribe(channelName);

  userChannels.set(userId, channel);

  return channel;
}

export function bindUserChannelEvent<T>(
  userId: number,
  event: string,
  handler: (payload: T) => void,
) {
  const channel = getUserChannel(userId);

  if (!channel) {
    return null;
  }

  channel.bind(event, handler);

  return () => {
    channel.unbind(event, handler);
  };
}

export function subscribeUserNotifications(
  userId: number,
  onCreated: (notification: unknown) => void,
) {
  return bindUserChannelEvent(userId, "notification.created", onCreated);
}

export function subscribeSessionRevoke(
  userId: number,
  onRevoked: (
    payload: import("@/utils/interfaces/ILoginSession").SessionRevokedPayload,
  ) => void,
) {
  return bindUserChannelEvent(userId, "session.revoked", onRevoked);
}

export function disconnectPusher() {
  userChannels.clear();
  cachedToken = null;

  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
}

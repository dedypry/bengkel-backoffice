import { useEffect, useRef } from "react";
import Pusher, { type Channel } from "pusher-js";

import config from "@/config/api";

export type QueueRealtimePayload = {
  action: "generated" | "called" | "status_updated" | string;
  company_id: number;
  updated_at: string;
  queue_number?: string;
  counter_number?: string | null;
  category_name?: string;
};

let publicPusherClient: Pusher | null = null;

export function getPublicPusherClient() {
  if (!publicPusherClient) {
    publicPusherClient = new Pusher(config.pusher.key, {
      cluster: config.pusher.cluster,
    });
  }

  return publicPusherClient;
}

export function subscribeCompanyQueue(
  companyId: number,
  onUpdate: (payload: QueueRealtimePayload) => void,
) {
  const client = getPublicPusherClient();
  const channelName = `queue-company-${companyId}`;
  const channel: Channel = client.subscribe(channelName);

  channel.bind("queue.updated", onUpdate);

  return () => {
    channel.unbind("queue.updated", onUpdate);
    client.unsubscribe(channelName);
  };
}

export function useCompanyQueueRealtime(
  companyId: number | undefined,
  onUpdate: (payload: QueueRealtimePayload) => void,
) {
  const onUpdateRef = useRef(onUpdate);

  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (!companyId) {
      return;
    }

    const unsubscribe = subscribeCompanyQueue(companyId, (payload) => {
      onUpdateRef.current(payload);
    });

    return unsubscribe;
  }, [companyId]);
}

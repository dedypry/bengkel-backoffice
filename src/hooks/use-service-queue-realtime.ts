import { useEffect, useRef } from "react";
import type { Channel } from "pusher-js";

import { getPublicPusherClient } from "@/hooks/use-company-queue-realtime";

export type ServiceUpdatedPayload = {
  action: string;
  company_id: number;
  work_order_id?: number;
  progress?: string;
  updated_at: string;
};

export type CashierCallPayload = {
  action: "called" | string;
  company_id: number;
  work_order_id?: number;
  plate_number?: string;
  queue_no?: string;
  trx_no?: string;
  customer_name?: string;
  updated_at: string;
};

type ServiceQueueRealtimeHandlers = {
  onServiceUpdate?: (payload: ServiceUpdatedPayload) => void;
  onCashierCall?: (payload: CashierCallPayload) => void;
};

export function subscribeCompanyService(
  companyId: number,
  handlers: ServiceQueueRealtimeHandlers,
) {
  const client = getPublicPusherClient();
  const channelName = `service-company-${companyId}`;
  const channel: Channel = client.subscribe(channelName);

  if (handlers.onServiceUpdate) {
    channel.bind("service.updated", handlers.onServiceUpdate);
  }

  if (handlers.onCashierCall) {
    channel.bind("cashier.call", handlers.onCashierCall);
  }

  return () => {
    if (handlers.onServiceUpdate) {
      channel.unbind("service.updated", handlers.onServiceUpdate);
    }

    if (handlers.onCashierCall) {
      channel.unbind("cashier.call", handlers.onCashierCall);
    }

    client.unsubscribe(channelName);
  };
}

export function useServiceQueueRealtime(
  companyId: number | undefined,
  handlers: ServiceQueueRealtimeHandlers,
) {
  const handlersRef = useRef(handlers);

  handlersRef.current = handlers;

  useEffect(() => {
    if (!companyId) {
      return;
    }

    const unsubscribe = subscribeCompanyService(companyId, {
      onServiceUpdate: (payload) => {
        handlersRef.current.onServiceUpdate?.(payload);
      },
      onCashierCall: (payload) => {
        handlersRef.current.onCashierCall?.(payload);
      },
    });

    return unsubscribe;
  }, [companyId]);
}

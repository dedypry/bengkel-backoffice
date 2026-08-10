import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import ListOrder from "./components/list-order";
import PanelCustomer from "./components/panel-customer";
import PanelProduct from "./components/panel-product";
import { buildCashierWoQuery, type CashierTab } from "./cashier-query";

import { useSidebar, SIDEBAR_COLLAPSED_KEY } from "@/context/sidebar-context";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";
import {
  setTabCashier,
  setWoQuery,
} from "@/stores/features/work-order/wo-slice";
import { useServiceQueueRealtime } from "@/hooks/use-service-queue-realtime";
import { announceCashierCall } from "@/utils/helpers/queue-announcement";
import { notify } from "@/utils/helpers/notify";

export default function CashierPage() {
  const { t } = useTranslation();
  const { woQuery, tabCashier } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);
  const { setCollapsed } = useSidebar();
  const dispatch = useAppDispatch();
  const activeTab = tabCashier as CashierTab;

  const fetchCashierOrders = useCallback(() => {
    const params = buildCashierWoQuery(activeTab, woQuery);

    if (params) {
      dispatch(getWo(params as any));
    }
  }, [activeTab, dispatch, woQuery]);

  useServiceQueueRealtime(company?.id, {
    onServiceUpdate: fetchCashierOrders,
    onCashierCall: (payload) => {
      if (activeTab === "customer") {
        fetchCashierOrders();
      }

      if (payload.plate_number) {
        announceCashierCall({
          plateNumber: payload.plate_number,
          trxNo: payload.trx_no,
        });

        notify(
          t("cashier.notify.cashier_call", {
            plate: payload.plate_number,
            trx: payload.trx_no ? ` (${payload.trx_no})` : "",
          }),
          "info",
        );
      }
    },
  });

  useEffect(() => {
    const previousCollapsed =
      localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";

    setCollapsed(true);

    return () => setCollapsed(previousCollapsed);
  }, [setCollapsed]);

  useEffect(() => {
    if (!company || activeTab === "product") return;

    fetchCashierOrders();
  }, [company, woQuery, activeTab, fetchCashierOrders]);

  useEffect(() => {
    if (tabCashier !== "finish") return;

    dispatch(setTabCashier("customer"));
    dispatch(
      setWoQuery({
        status: "finish",
        page: 1,
        date_from: "",
        date_to: "",
      }),
    );
  }, [tabCashier, dispatch]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4 antialiased">
      <ListOrder />

      {activeTab === "product" ? <PanelProduct /> : <PanelCustomer />}
    </div>
  );
}

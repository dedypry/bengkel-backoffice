import { useEffect, useRef } from "react";

import ListOrder from "./components/list-order";
import PanelCustomer from "./components/panel-customer";
import PanelProduct from "./components/panel-product";

import { useSidebar, SIDEBAR_COLLAPSED_KEY } from "@/context/sidebar-context";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";

export default function CashierPage() {
  const { woQuery, tabCashier } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);
  const { setCollapsed } = useSidebar();
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const previousCollapsed =
      localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";

    setCollapsed(true);

    return () => setCollapsed(previousCollapsed);
  }, [setCollapsed]);

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getWo({ ...woQuery, pageSize: 100, date: "" } as any));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, woQuery]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4 antialiased">
      {/* --- BAGIAN KIRI: DAFTAR ANTREAN --- */}
      <ListOrder />

      {/* --- BAGIAN KANAN: RINCIAN & PEMBAYARAN --- */}
      {tabCashier === "customer" ? <PanelCustomer /> : <PanelProduct />}
    </div>
  );
}

import { useEffect } from "react";

import ListOrder from "./components/list-order";
import PanelCustomer from "./components/panel-customer";
import PanelProduct from "./components/panel-product";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";

export default function CashierPage() {
  const { woQuery, tabCashier } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getWo({ ...woQuery, pageSize: 100 }));
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

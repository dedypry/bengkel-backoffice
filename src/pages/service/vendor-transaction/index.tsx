import { Handshake, Plus } from "lucide-react";
import { Button, Tab, Tabs } from "@heroui/react";
import { Key, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import TabPayment from "./tab-payment";
import TabList from "./tab-list";
import DetailTrx from "./detail";

import HeaderAction from "@/components/header-action";
import DefaultSettingService from "@/components/default-setting-service";
import { useAppDispatch } from "@/stores/hooks";
import { getSupplierList } from "@/stores/features/supplier/supplier-action";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { setTrxDetail } from "@/stores/features/vendor/vendor-slice";

export default function VendorTrxPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [openDetail, setOpenDetail] = useState(false);
  const [tab, setTab] = useState<Key>("list");
  const hasFetch = useRef(false);

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;

      dispatch(getSupplierList());

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, []);

  function handleInvNo() {
    http
      .get("/vendor-transaction/purchase-no")
      .then(({ data }) => {
        dispatch(
          setTrxDetail({
            ...data,
            supplier: null,
            items: [],
          }),
        );
        setOpenDetail(true);
      })
      .catch(notifyError);
  }

  return (
    <>
      <DetailTrx
        open={openDetail}
        setOpen={setOpenDetail}
        onSuccess={() => setTab("payment")}
      />
      <HeaderAction
        actionContent={
          <div className="flex gap-2 items-center">
            <DefaultSettingService />
            <Button
              color="primary"
              size="sm"
              startContent={<Plus size={18} />}
              onPress={handleInvNo}
            >
              {t("service.vendor.manual_input")}
            </Button>
          </div>
        }
        leadIcon={Handshake}
        subtitle={t("service.vendor.subtitle")}
        title={t("service.vendor.title")}
      />
      <Tabs
        fullWidth
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent:
            "group-data-[selected=true]:text-primary text-secondary-700 font-bold",
        }}
        color="primary"
        selectedKey={String(tab)}
        variant="underlined"
        onSelectionChange={setTab}
      >
        <Tab key="list" title={t("service.vendor.tab_unpaid")}>
          <TabList />
        </Tab>
        <Tab key="payment" title={t("service.vendor.tab_paid")}>
          <TabPayment />
        </Tab>
      </Tabs>
    </>
  );
}

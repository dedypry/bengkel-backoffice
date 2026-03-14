import { Handshake } from "lucide-react";
import { Tab, Tabs } from "@heroui/react";

import TabList from "./tab-list";
import TabPayment from "./tab-payment";

import HeaderAction from "@/components/header-action";
import DefaultSettingService from "@/components/default-setting-service";

export default function VendorTrxPage() {
  return (
    <>
      <HeaderAction
        actionContent={
          <>
            <DefaultSettingService />
          </>
        }
        leadIcon={Handshake}
        subtitle="Layanan Pihak Ketiga"
        title="Daftar jasa yang dikelola oleh vendor."
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
        variant="underlined"
      >
        <Tab key="list" title="List Yang belum di bayar">
          <TabList />
        </Tab>
        <Tab key="payment" title="List Yang Sudah di bayar">
          <TabPayment />
        </Tab>
      </Tabs>
    </>
  );
}

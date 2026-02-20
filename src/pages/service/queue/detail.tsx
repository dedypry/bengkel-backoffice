import {
  CalendarDays,
  Car,
  User,
  AlertCircle,
  Info,
  History,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Chip, Card, CardBody, Tabs, Tab } from "@heroui/react";

import AddMechanich from "../components/add-mekanik";

import StatusQueue from "./components/status-queue";
import WODetailSkeleton from "./components/detail-skeleton";
import DetailInfoTab from "./components/detail-tab";
import { InfoBlock, SectionHeader } from "./components/helper";
import HistoryTab from "./components/history-tab";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { formatIDR } from "@/utils/helpers/format";
import Detail404 from "@/pages/hr/employees/components/detail-404";

export default function WorkOrderDetail() {
  const [openModal, setOpenModal] = useState(false);

  const { detail: data, isLoadingDetail } = useAppSelector((state) => state.wo);

  const dispatch = useAppDispatch();
  const { id } = useParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getWoDetail(id));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [id, dispatch]);

  if (isLoadingDetail) return <WODetailSkeleton />;
  if (!data) return <Detail404 />;

  return (
    <div className="space-y-6">
      <AddMechanich
        id={id as any}
        open={openModal}
        setOpen={setOpenModal}
        onRefresh={() => dispatch(getWoDetail(id as any))}
      />

      {/* 1. HEADER & GRAND TOTAL */}
      <Card>
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-lg font-black tracking-tighter text-gray-500 uppercase">
                  {data.trx_no}
                </h1>
                <StatusQueue wo={data} />
              </div>
              <div className="flex items-center gap-4 text-gray-500 font-bold text-[11px] uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <CalendarDays className="text-gray-400" size={14} />
                  {new Date(data.created_at).toLocaleDateString("id-ID", {
                    dateStyle: "full",
                  })}
                </div>
              </div>
            </div>
            <div className="bg-primary p-8 flex flex-col justify-center items-end min-w-[300px]">
              <span className="text-gray-200 font-black text-[12px] uppercase mb-1">
                Total Biaya Estimasi
              </span>
              <span className="text-2xl font-black text-white tracking-[0.1em]">
                {formatIDR(Number(data.sub_total || 0))}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CUSTOMER & VEHICLE */}
        <div className="lg:col-span-4 space-y-6">
          {/* CUSTOMER CARD */}
          <Card>
            <CardBody className="p-6 space-y-6">
              <SectionHeader
                icon={<User size={18} />}
                subtitle={data.company?.name}
                title="Customer"
              />
              <div className="p-4 bg-gray-50 border-l-4 border-primary-500 rounded-sm">
                <p className="font-black uppercase text-sm text-gray-500">
                  {data.customer.name}
                </p>
                <p className="text-[11px] font-bold text-gray-500 mt-1">
                  {data.customer.phone}
                </p>
                <Chip
                  className="mt-3 bg-gray-200 font-black text-[9px] uppercase tracking-widest"
                  radius="sm"
                  size="sm"
                >
                  {data.customer.customer_type}
                </Chip>
              </div>
            </CardBody>
          </Card>

          {/* VEHICLE CARD */}
          <Card>
            <CardBody className="p-6  space-y-6">
              <SectionHeader icon={<Car size={18} />} title="Unit Info" />
              <div className="space-y-4">
                <div className="text-center py-4 bg-gray-400 text-white rounded-sm">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1">
                    Plate Number
                  </p>
                  <p className="text-2xl font-black tracking-widest">
                    {data.vehicle.plate_number}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoBlock
                    label="Brand/Model"
                    value={`${data.vehicle.brand} ${data.vehicle.model}`}
                  />
                  <InfoBlock label="Year" value={data.vehicle.year} />
                  <InfoBlock
                    label="Current KM"
                    value={`${data.current_km?.toLocaleString()} KM`}
                  />
                  <InfoBlock label="Fuel" value={data.vehicle.fuel_type} />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* COMPLAINTS */}
          <Card>
            <CardBody className="p-6 space-y-4">
              <SectionHeader icon={<AlertCircle size={18} />} title="Keluhan" />
              <p className="text-xs font-bold text-gray-700 leading-relaxed uppercase">
                {data.complaints || "TIDAK ADA KELUHAN TERKATEGORI"}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT COLUMN: WORK ITEMS & MECHANICS */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs
            aria-label="Customer Tabs"
            classNames={{
              base: "w-full",
              tabList:
                "gap-8 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-gray-400 h-1",
              tab: "max-w-fit px-0 h-12 font-black uppercase text-xs ",
              tabContent:
                "group-data-[selected=true]:text-gray-500 text-gray-400",
            }}
            variant="underlined"
          >
            <Tab
              key="info"
              title={
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  <span>Detail Informasi</span>
                </div>
              }
            >
              <DetailInfoTab data={data} id={id} setOpenModal={setOpenModal} />
            </Tab>

            <Tab
              key="history"
              title={
                <div className="flex items-center gap-2">
                  <History size={16} />
                  <span>Riwayat Servis</span>
                </div>
              }
            >
              <HistoryTab id={data.customer_id as any} isNoDate={true} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

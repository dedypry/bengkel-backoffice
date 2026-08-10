import {
  Car,
  User,
  AlertCircle,
  Info,
  History,
  Users,
  NotebookPen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Chip, Card, CardBody, Tabs, Tab, Input } from "@heroui/react";

import AddMechanich from "../components/add-mekanik";

import StatusQueue from "./components/status-queue";
import WODetailSkeleton from "./components/detail-skeleton";
import DetailInfoTab from "./components/detail-tab";
import { InfoBlock, SectionHeader } from "./components/helper";
import HistoryTab from "./components/history-tab";
import EditUnitInfo from "./components/edit-unit-info";
import WoComplaint from "./components/wo-complaint";
import EditOrderDate from "./components/edit-order-date";
import EditSupervisorInfo from "./components/edit-supervisor-info";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { formatIDR } from "@/utils/helpers/format";
import { calculateTotalEstimation } from "@/utils/helpers/global";
import HeaderAction from "@/components/header-action";

export default function WorkOrderDetail() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  const { detail: data } = useAppSelector((state) => state.wo);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  if (!data) return <WODetailSkeleton />;

  return (
    <div className="space-y-6">
      <AddMechanich
        id={id as any}
        open={openModal}
        setOpen={setOpenModal}
        onRefresh={() => dispatch(getWoDetail(id as any))}
      />

      <HeaderAction
        actionContent={<StatusQueue wo={data} />}
        subtitle={t("service.queue.subtitle")}
        title={data.trx_no}
        onBack={() => navigate("/service/queue")}
      />

      {/* 1. HEADER & GRAND TOTAL */}
      <Card>
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-1 items-center p-8">
              <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                <EditOrderDate />
              </div>
            </div>
            <div className="bg-primary px-8 flex flex-col justify-center items-end min-w-[300px]">
              <span className="text-gray-100 font-black text-[12px] uppercase mb-1">
                {t("service.detail.estimation_total")}
              </span>
              <span className="text-2xl font-black text-white tracking-[0.1em]">
                {formatIDR(Number(data.grand_total || 0))}
              </span>

              <span className="text-sm font-black text-white tracking-[0.1em]">
                {t("service.detail.estimation_time")}{" "}
                {calculateTotalEstimation(
                  data.services.map((item) => ({
                    estimated: item.data.estimated_duration,
                    type: item.data.estimated_type,
                  })),
                )}
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
                title={t("service.detail.customer")}
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
              <div className="flex justify-between items-center">
                <SectionHeader
                  icon={<Car size={18} />}
                  title={t("service.detail.unit_info")}
                />
                <EditUnitInfo />
              </div>
              <div className="space-y-4">
                <div className="text-center py-4 bg-gray-400 text-white rounded-sm">
                  <p className="text-[10px] font-bold  uppercase mb-1">
                    {t("service.detail.plate_number")}
                  </p>
                  <p className="text-2xl font-black tracking-widest">
                    {data.vehicle.plate_number}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoBlock
                    label={t("service.detail.brand_model")}
                    value={`${data.vehicle.brand} ${data.vehicle.model}`}
                  />
                  <InfoBlock
                    label={t("service.detail.year")}
                    value={data.vehicle.year}
                  />
                  <InfoBlock
                    label={t("service.detail.km_in")}
                    value={`${data.current_km?.toLocaleString()} KM`}
                  />
                  <InfoBlock
                    label={t("service.detail.km_out")}
                    value={`${data.next_km?.toLocaleString()} KM`}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* COMPLAINTS */}
          <Card>
            <CardBody className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <SectionHeader
                  icon={<AlertCircle size={18} />}
                  title={t("service.detail.complaints")}
                />
                <WoComplaint />
              </div>
              <p className="text-xs font-bold text-gray-700 leading-relaxed uppercase">
                {data.complaints || t("service.detail.no_complaints")}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <SectionHeader
                  icon={<Users size={18} />}
                  title={t("service.detail.supervisor")}
                />
                <EditSupervisorInfo />
              </div>
              <Input
                isDisabled
                classNames={{ label: "!text-gray-800" }}
                label={t("service.detail.pic_service")}
                value={data?.pic?.name}
              />
              <Input
                isDisabled
                classNames={{ label: "!text-gray-800" }}
                label={t("service.detail.service_advisor")}
                value={data?.sa?.name}
              />
            </CardBody>
          </Card>
          {data.cancel_note && (
            <Card>
              <CardBody className="p-6 space-y-4">
                <SectionHeader
                  icon={<NotebookPen size={18} />}
                  title={t("service.detail.cancel_note")}
                />
                <p className="text-xs font-bold text-gray-700 leading-relaxed uppercase">
                  {data.cancel_note}
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: WORK ITEMS & MECHANICS */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs
            aria-label={t("service.detail.customer_tabs_aria")}
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
                  <span>{t("service.detail.tab_info")}</span>
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
                  <span>{t("service.detail.tab_history")}</span>
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

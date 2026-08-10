import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Edit,
  Trash2,
  Phone,
  Mail,
  History,
  Info,
  ArrowLeft,
} from "lucide-react";
import { Button, Card, CardBody, Tabs, Tab, Avatar, Chip } from "@heroui/react";

import DetailCustomerTab from "./components/detail-customer";
import DetailServiceTab from "./components/detail-service";
import CustomerDetailSkeleton from "./components/customer-detail-skeleton";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getDetailCustomer } from "@/stores/features/customer/customer-action";
import { getInitials } from "@/utils/helpers/global";
import Detail404 from "@/pages/hr/employees/components/detail-404";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";

export default function CustomerDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail: data, detailLoading } = useAppSelector(
    (state) => state.customer,
  );
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getDetailCustomer(id));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [id, dispatch]);

  if (detailLoading) return <CustomerDetailSkeleton />;
  if (!data) return <Detail404 id={id} />;

  function handleDelete() {
    http
      .delete(`/customers/${id}`)
      .then(({ data }) => {
        notify(data.message);
        navigate("/master/customers");
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Profile Industrial */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardBody>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4 shrink-0">
              <Button
                isIconOnly
                aria-label={t("common.back")}
                className="rounded-full bg-white shadow-sm shrink-0"
                variant="flat"
                onPress={() => navigate("/master/customers")}
              >
                <ArrowLeft size={20} />
              </Button>
              <Avatar
                className="w-24 h-24 border-4 border-gray-50 shadow-md font-black italic text-gray-400 text-2xl"
                fallback={getInitials(data?.name)}
                src={
                  data?.profile?.photo_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${data?.name}`
                }
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-black uppercase  text-gray-500 leading-none">
                  {data.name}
                </h1>
                <Chip
                  className="font-black uppercase italic text-[10px] rounded-sm"
                  color={data.status === "active" ? "success" : "danger"}
                  variant="flat"
                >
                  {data.status}
                </Chip>
              </div>
              <div className="flex flex-col justify-center md:justify-start gap-1 text-gray-400">
                <div className="flex items-center gap-2 text-xs font-bold uppercase">
                  <Phone className="text-primary" size={14} /> {data?.phone}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase">
                  <Mail className="text-primary" size={14} /> {data?.email}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                color="danger"
                startContent={<Trash2 size={18} />}
                variant="flat"
                onPress={() => confirmSweat(handleDelete)}
              >
                {t("common.delete")}
              </Button>
              <Button
                color="primary"
                startContent={<Edit size={18} />}
                onPress={() => navigate(`/master/customers/${id}/edit`)}
              >
                {t("master.customers.edit_customer")}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs Navigation */}
      <Tabs
        aria-label="Customer Tabs"
        classNames={{
          base: "w-full",
          tabList:
            "gap-8 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-gray-400 h-1",
          tab: "max-w-fit px-0 h-12 font-black uppercase text-xs ",
          tabContent: "group-data-[selected=true]:text-gray-500 text-gray-400",
        }}
        variant="underlined"
      >
        <Tab
          key="info"
          title={
            <div className="flex items-center gap-2">
              <Info size={16} />
              <span>{t("master.customers.detail_tab")}</span>
            </div>
          }
        >
          <DetailCustomerTab data={data} />
        </Tab>

        <Tab
          key="history"
          title={
            <div className="flex items-center gap-2">
              <History size={16} />
              <span>{t("master.customers.service_tab")}</span>
            </div>
          }
        >
          <DetailServiceTab id={id as any} />
        </Tab>
      </Tabs>
    </div>
  );
}

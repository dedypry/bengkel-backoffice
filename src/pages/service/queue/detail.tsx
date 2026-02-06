import {
  CalendarDays,
  Car,
  User,
  Wrench,
  Receipt,
  UserCircleIcon,
  Printer,
  AlertCircle,
  ClipboardCheck,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

import ModalAddService from "../add/components/modal-add-service";
import AddMechanich from "../components/add-mekanik";

import ButtonStatus from "./components/button-status";
import StatusQueue from "./components/status-queue";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { formatIDR } from "@/utils/helpers/format";
import {
  formWoClear,
  setWoService,
  setWoSparepart,
} from "@/stores/features/work-order/wo-slice";
import { http } from "@/utils/libs/axios";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import { handleDownload } from "@/utils/helpers/global";
import BlogEditor from "@/components/text-editor";
import Detail404 from "@/pages/hr/employees/components/detail-404";
import DetailSkeleton from "@/pages/hr/employees/components/detail-skeleton";

export default function WorkOrderDetail() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextSugestion, setNextSugestion] = useState("");

  const {
    detail: data,
    isLoadingDetail,
    sparepart,
    services,
  } = useAppSelector((state) => state.wo);

  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) dispatch(getWoDetail(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (data) {
      const dataServices = data.services?.map((e: any) => ({
        ...e.data,
        qty: e.qty,
        price: e.price,
      }));
      const dataSparepart = data.spareparts?.map((e: any) => ({
        ...e.data,
        qty: e.qty,
        price: e.price,
      }));

      dispatch(setWoSparepart(dataSparepart));
      dispatch(setWoService(dataServices));
      setNextSugestion(data.next_sugestion || "");
    }
  }, [data, dispatch]);

  if (isLoadingDetail) return <DetailSkeleton />;
  if (!data) return <Detail404 />;

  function generateData(serviceData: any[], sparepartData: any[]) {
    return {
      services: serviceData.map((e) => ({
        id: e.id,
        qty: e.qty,
        price: e.price,
      })),
      sparepart: sparepartData.map((e) => ({
        id: e.id,
        qty: e.qty,
        price: e.sell_price,
      })),
    };
  }

  const handleSave = async (payload: any) => {
    http
      .patch(`/work-order/service/${id}`, payload)
      .then(({ data }) => {
        notify(data.message);
        dispatch(formWoClear());
        dispatch(getWoDetail(id as any));
      })
      .catch((err) => notifyError(err));
  };

  const handleDelete = (item: any, type: string) => {
    let serviceData = [...services];
    let sparepartData = [...sparepart];

    if (type === "pr") {
      sparepartData = sparepartData.filter((e) => e.id != item.id);
    } else {
      serviceData = serviceData.filter((e) => e.id != item.id);
    }

    handleSave(generateData(serviceData, sparepartData));
  };

  const saveNextSugestion = () => {
    http
      .patch(`/work-order/${id}/sugestion`, { next_sugestion: nextSugestion })
      .then(({ data }) => notify(data.message))
      .catch((err) => notifyError(err));
  };

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 max-w-7xl">
      <AddMechanich
        id={id as any}
        open={openModal}
        setOpen={setOpenModal}
        onRefresh={() => dispatch(getWoDetail(id as any))}
      />

      {/* 1. HEADER & GRAND TOTAL */}
      <Card
        className="border border-gray-200 shadow-sm bg-white overflow-hidden"
        radius="sm"
      >
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
            <div className="bg-gray-500 p-8 flex flex-col justify-center items-end min-w-[300px]">
              <span className="text-gray-200 font-black text-[10px] tracking-[0.3em] uppercase mb-1">
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
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-6 space-y-6">
              <SectionHeader icon={<User size={18} />} title="Customer" />
              <div className="p-4 bg-gray-50 border-l-4 border-primary-500 rounded-sm">
                <p className="font-black uppercase text-sm text-gray-500 leading-tight">
                  {data.customer.name}
                </p>
                <p className="text-[11px] font-bold text-gray-500 tracking-wider mt-1">
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
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-6 space-y-6">
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
          <Card className="shadow-sm border-none bg-amber-50/30" radius="sm">
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
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-6">
                <SectionHeader
                  icon={<Receipt size={18} />}
                  title="Rincian Pekerjaan & Part"
                />
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    radius="sm"
                    variant="bordered"
                    onPress={() =>
                      handleDownload(
                        `/invoices/${id}`,
                        data.trx_no,
                        true,
                        setLoading,
                      )
                    }
                  >
                    {loading ? (
                      <CircularProgress color="success" size="sm" />
                    ) : (
                      <Printer size={18} />
                    )}
                  </Button>
                  {!["closed", "cancel"].includes(data.status) && (
                    <ModalAddService
                      isSave
                      onClose={() => dispatch(formWoClear())}
                      onSave={() =>
                        handleSave(generateData(services, sparepart))
                      }
                    />
                  )}
                </div>
              </div>

              <Table
                removeWrapper
                aria-label="Work Items"
                className="mt-4"
                classNames={{
                  th: "bg-gray-500 text-white font-black text-[12px] tracking-widest uppercase rounded-none h-12",
                  td: "py-4 text-[12px] font-bold uppercase border-b border-gray-200",
                }}
              >
                <TableHeader>
                  <TableColumn width={80}>QTY</TableColumn>
                  <TableColumn>ITEM / DESC</TableColumn>
                  <TableColumn align="end">HARGA</TableColumn>
                  <TableColumn align="end">SUBTOTAL</TableColumn>
                  <TableColumn align="end"> </TableColumn>
                </TableHeader>
                <TableBody>
                  {[
                    ...(data.spareparts || []).map((e) => ({
                      ...e,
                      type: "pr",
                    })),
                    ...data.services.map((e) => ({ ...e, type: "srv" })),
                  ].map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Chip
                          className="font-black"
                          radius="sm"
                          size="sm"
                          variant="flat"
                        >
                          {item.qty}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-gray-500">
                            {item.data.name}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono tracking-tighter">
                            {item.data.code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {formatIDR(item.price)}
                      </TableCell>
                      <TableCell className="text-gray-500 text-right">
                        {formatIDR(item.total_price)}
                      </TableCell>
                      <TableCell>
                        {!["cancel", "closed"].includes(data.status) && (
                          <Button
                            isIconOnly
                            color="danger"
                            size="sm"
                            variant="flat"
                            onPress={() =>
                              confirmSweat(() =>
                                handleDelete(item.data, item.type),
                              )
                            }
                          >
                            <Trash2 size={18} />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-6 space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <SectionHeader
                  icon={<Wrench size={18} />}
                  title="Mekanik Bertugas"
                />
                <div className="flex gap-2">
                  {!["cancel", "closed"].includes(data.status) && (
                    <>
                      <Button
                        className="font-black uppercase text-[10px] tracking-widest"
                        radius="sm"
                        size="sm"
                        startContent={<UserCircleIcon size={16} />}
                        variant="flat"
                        onPress={() => {
                          dispatch(
                            setMechanic(data.mechanics?.map((item) => item.id)),
                          );
                          setOpenModal(true);
                        }}
                      >
                        Pilih Mekanik
                      </Button>
                      <ButtonStatus
                        item={data}
                        onSuccess={() => dispatch(getWoDetail(id!))}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.mechanics?.map((mech: any) => (
                  <div
                    key={mech.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-sm border border-gray-100"
                  >
                    <Avatar
                      className="h-12 w-12 border-2 border-white shadow-sm font-black"
                      name={mech.name.substring(0, 2).toUpperCase()}
                      radius="sm"
                      src={mech.profile.photo_url}
                    />
                    <div className="flex-1">
                      <p className="text-[11px] font-black uppercase text-gray-500 tracking-tight">
                        {mech.profile.full_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`h-2 w-2 rounded-full ${mech.work_status === "busy" ? "bg-red-500" : "bg-emerald-500"}`}
                        />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          {mech.work_status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-8 space-y-6">
              <div className="space-y-2">
                <SectionHeader
                  icon={<ClipboardCheck size={18} />}
                  title="Rekomendasi Servis Selanjutnya"
                />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Catat komponen yang perlu diperhatikan atau diganti pada
                  kunjungan berikutnya.
                </p>
                <Chip
                  className="font-black text-[9px] uppercase tracking-widest"
                  color="warning"
                  radius="sm"
                  size="sm"
                  startContent={<AlertCircle size={12} />}
                  variant="flat"
                >
                  Tampil di Invoice Customer
                </Chip>
              </div>

              <div className="border border-gray-100 rounded-sm overflow-hidden">
                <BlogEditor
                  disabled={["cancel", "closed"].includes(data.status)}
                  value={nextSugestion}
                  onChange={setNextSugestion}
                />
              </div>

              {!["cancel", "closed"].includes(data.status) && (
                <div className="flex justify-end pt-4">
                  <Button
                    className="uppercase"
                    color="primary"
                    radius="sm"
                    startContent={<Save size={18} />}
                    onPress={saveNextSugestion}
                  >
                    Simpan Rekomendasi
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

// HELPERS
function SectionHeader({
  icon,
  title,
  className = "",
}: {
  icon: any;
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-2 bg-gray-500 rounded-sm text-white">{icon}</div>
      <h2 className="text-sm font-black uppercase text-gray-800">{title}</h2>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: any }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
        {label}
      </p>
      <p className="text-[11px] font-bold text-gray-700 uppercase">
        {value || "-"}
      </p>
    </div>
  );
}

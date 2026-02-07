import {
  Card,
  CardBody,
  Button,
  CircularProgress,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Table,
} from "@heroui/react";
import {
  Receipt,
  Printer,
  Trash2,
  Wrench,
  UserCircleIcon,
  ClipboardCheck,
  AlertCircle,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";

import ModalAddService from "../../add/components/modal-add-service";

import ButtonStatus from "./button-status";
import { SectionHeader } from "./helper";

import BlogEditor from "@/components/text-editor";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import {
  formWoClear,
  setWoService,
  setWoSparepart,
} from "@/stores/features/work-order/wo-slice";
import { formatIDR } from "@/utils/helpers/format";
import { handleDownload } from "@/utils/helpers/global";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { IWorkOrder } from "@/utils/interfaces/IUser";

interface Props {
  id: any;
  data: IWorkOrder;
  setOpenModal: (val: boolean) => void;
}
export default function DetailInfoTab({ data, setOpenModal, id }: Props) {
  const { sparepart, services } = useAppSelector((state) => state.wo);
  const [loading, setLoading] = useState(false);
  const [nextSugestion, setNextSugestion] = useState("");

  const dispatch = useAppDispatch();

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
    <>
      <Card className="shadow-sm border border-gray-200" radius="sm">
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
                  onSave={() => handleSave(generateData(services, sparepart))}
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
                      <span className="text-gray-500">{item.data.name}</span>
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
                          confirmSweat(() => handleDelete(item.data, item.type))
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
              Catat komponen yang perlu diperhatikan atau diganti pada kunjungan
              berikutnya.
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
    </>
  );
}

import {
  CalendarDays,
  Car,
  User,
  Wrench,
  Receipt,
  UserCircleIcon,
  Printer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, CircularProgress, IconButton } from "@mui/joy";

import ButtonStatus from "../components/button-status";
import StatusQueue from "../components/status-queue";
import ModalAddService from "../../add/components/modal-add-service";
import AddMechanich from "../../components/add-mekanik";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import DetailSkeleton from "@/pages/admin/hr/employees/components/detail-skeleton";
import Detail404 from "@/pages/admin/hr/employees/components/detail-404";
import { formatIDR } from "@/utils/helpers/format";
import {
  formWoClear,
  setWoService,
  setWoSparepart,
} from "@/stores/features/work-order/wo-slice";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import { handleDownload } from "@/utils/helpers/global";

export default function WorkOrderDetail() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    detail: data,
    isLoadingDetail,
    sparepart,
    services,
  } = useAppSelector((state) => state.wo);

  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getWoDetail(id));
    }
  }, [id]);

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
    }
  }, [data]);

  if (isLoadingDetail) return <DetailSkeleton />;
  if (!data) return <Detail404 />;

  function handleSave() {
    http
      .patch(`/work-order/service/${id}`, {
        services: services.map((e) => ({
          id: e.id,
          qty: e.qty,
          price: e.price,
        })),
        sparepart: sparepart.map((e) => ({
          id: e.id,
          qty: e.qty,
          price: e.sell_price,
        })),
      })
      .then(({ data }) => {
        notify(data.message);
        dispatch(formWoClear());
        dispatch(getWoDetail(id as any));
      })
      .catch((err) => notifyError(err));
  }

  function onClose() {
    dispatch(formWoClear());
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <AddMechanich
        id={id as any}
        open={openModal}
        setOpen={setOpenModal}
        onRefresh={() => dispatch(getWoDetail(id as any))}
      />
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{data.trx_no}</h1>
            <StatusQueue wo={data} />
          </div>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <CalendarDays className="w-4 h-4" />
            Dibuat pada{" "}
            {new Date(data.created_at).toLocaleDateString("id-ID", {
              dateStyle: "full",
            })}
          </p>
        </div>
        <Card className="bg-primary text-primary-foreground">
          <CardContent>
            <div className="text-right">
              <p className="text-xs uppercase opacity-80">Grand Total</p>
              <p className="text-xl font-semibold">
                {formatIDR(Number(data.sub_total || 0))}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Customer & Vehicle Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Informasi Pelanggan</CardTitle>
                <CardDescription>Detail pemilik kendaraan</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold">{data.customer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {data.customer.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.customer.email || "-"}
                </p>
              </div>
              <Badge className="capitalize" variant="outline">
                {data.customer.customer_type}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Detail Kendaraan</CardTitle>
                <CardDescription>
                  {data.vehicle.brand} {data.vehicle.model}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Plat Nomor</p>
                <p className="font-mono font-bold text-lg">
                  {data.vehicle.plate_number}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Tahun</p>
                <p className="font-medium">{data.vehicle.year}</p>
              </div>
              <Separator className="col-span-2" />
              <div>
                <p className="text-muted-foreground">KM Sekarang</p>
                <p className="font-medium">
                  {data.current_km?.toLocaleString()} KM
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Bahan Bakar</p>
                <p className="font-medium capitalize">
                  {data.vehicle.fuel_type}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Services & Mechanics */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Daftar Pekerjaan & Part
                  </CardTitle>
                  <CardDescription>
                    Rincian jasa dan suku cadang
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <IconButton
                  disabled={loading}
                  variant="outlined"
                  onClick={() =>
                    handleDownload(
                      `/invoices/${id}`,
                      data.trx_no,
                      true,
                      setLoading,
                    )
                  }
                >
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Printer className="size-5" />
                  )}
                </IconButton>
                {!["closed", "cancel"].includes(data.status) && (
                  <ModalAddService
                    isSave
                    onClose={onClose}
                    onSave={handleSave}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Qty</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.spareparts?.length! > 0 && (
                    <TableRow className="bg-gray-200">
                      <TableCell colSpan={4}>Sparepart</TableCell>
                    </TableRow>
                  )}

                  {data.spareparts?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.qty}</TableCell>
                      <TableCell>
                        <div className="font-medium capitalize">
                          {item.data.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {item.data.code}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIDR(item.price)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatIDR(item.total_price)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {data.services?.length! > 0 && (
                    <TableRow className="bg-gray-200">
                      <TableCell colSpan={4}>Jasa</TableCell>
                    </TableRow>
                  )}
                  {data.services?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.qty}</TableCell>
                      <TableCell>
                        <div className="font-medium capitalize">
                          {item.data.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {item.data.code}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIDR(item.price)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatIDR(item.total_price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Mekanik Bertugas</CardTitle>
                <CardDescription>
                  Personel yang menangani unit ini
                </CardDescription>
              </div>
              <div className="flex-1" />
              {data.status !== "cancel" && (
                <>
                  <Button
                    size="sm"
                    startDecorator={<UserCircleIcon size={18} />}
                    onClick={() => {
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.mechanics?.map((mech: any) => (
                  <div
                    key={mech.id}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-card"
                  >
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage
                        alt={mech.name}
                        src={mech.profile.photo_url}
                      />
                      <AvatarFallback>
                        {mech.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-bold leading-none">
                        {mech.profile.full_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`h-2 w-2 rounded-full ${mech.work_status === "busy" ? "bg-destructive" : "bg-emerald-500"}`}
                        />
                        <p className="text-xs text-muted-foreground capitalize">
                          {mech.work_status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Tooltip,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  EyeIcon,
  MoreVertical,
  Trash2,
  UserCircleIcon,
  CalendarDays,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import StatusQueue from "./status-queue";
import ButtonStatus from "./button-status";
import ChipPriority from "./chip-priority";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";
import { getWo } from "@/stores/features/work-order/wo-action";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import { CustomPagination } from "@/components/custom-pagination";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";
import { hasRoles } from "@/utils/helpers/roles";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import debounce from "@/utils/helpers/debounce";
import PageSize from "@/components/page-size";

interface Props {
  setOpenModal: (val: boolean) => void;
  setWoId: (id: number) => void;
}

export default function ListTable({ setOpenModal, setWoId }: Props) {
  const { orders, woQuery } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const restriction = hasRoles(["foreman", "super-admin"]);
  const { t } = useTranslation();

  function handleCancel(id: number) {
    http
      .patch(`/work-order/cancel/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getWo(woQuery));
      })
      .catch((err) => notifyError(err));
  }

  const debounceSearch = debounce((q) => dispatch(getWo({ q })), 500);
  const statusOptions = [
    { key: "all", label: t("all") },
    { key: "queue", label: t("queue") },
    { key: "on_progress", label: t("on_progress") },
    { key: "ready", label: t("ready") },
    { key: "finish", label: t("finish") },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex justify-between gap-2">
          <PageSize
            label="Page Size"
            selectedKeys={[woQuery.pageSize.toString()]}
            onSelectionChange={(key) => {
              const val = Array.from(key)[0];

              dispatch(setWoQuery({ pageSize: val }));
            }}
          />
          <div className="flex justify-end gap-2">
            <Input
              isClearable
              className="w-[400px]"
              label="Search"
              placeholder="Cari No. Polisi atau Nama..."
              startContent={<Search size={18} />}
              onChange={(e) => debounceSearch(e.target.value)}
              onClear={() => dispatch(getWo({ q: "" }))}
            />

            <Select
              className="max-w-[200px]"
              label="Status"
              placeholder="Filter Status"
              selectedKeys={woQuery.status ? [woQuery.status] : ["all"]}
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys)[0] as string;

                dispatch(setWoQuery({ status: selectedValue }));
              }}
            >
              {statusOptions.map((status) => (
                <SelectItem key={status.key} textValue={status.label}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper aria-label="Tabel Antrean Bengkel">
            <TableHeader>
              <TableColumn width={160}>ESTIMASI/ANTREAN</TableColumn>
              <TableColumn>PELANGGAN & UNIT</TableColumn>
              <TableColumn align="center">PRIORITAS</TableColumn>
              <TableColumn>TANGGAL MASUK</TableColumn>
              <TableColumn>DIKERJAKAN OLEH</TableColumn>
              <TableColumn align="center">STATUS</TableColumn>
              <TableColumn align="center">AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak ada antrean saat ini">
              {(orders?.data || []).map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-default-50 last:border-none"
                >
                  <TableCell>
                    <div className="flex flex-col items-center bg-default-100 rounded-lg py-1 px-2 border border-default-200">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {item.estimation}
                      </span>
                      <span className="text-sm font-black text-primary tracking-tight">
                        {item.trx_no || item.queue_no}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-default-800 uppercase tracking-wide">
                        {item.vehicle.plate_number}
                      </span>
                      <span className="text-tiny text-gray-500 truncate max-w-[150px]">
                        {item.customer.name} • {item.vehicle.brand}{" "}
                        {item.vehicle.model}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <ChipPriority wo={item} />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-default-600">
                      <CalendarDays className="text-gray-400" size={14} />
                      <span className="text-tiny font-medium">
                        {dayjs(item.created_at).format("DD MMM YY | HH:mm")}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {item.mechanics && item.mechanics.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.mechanics.map((mc) => (
                          <Tooltip
                            key={mc.id}
                            content={mc.name}
                            placement="top"
                          >
                            <Chip
                              avatar={
                                <Avatar
                                  className="uppercase"
                                  name={mc.name}
                                  src={
                                    mc.profile?.photo_url ||
                                    getAvatarByName(mc.name)
                                  }
                                />
                              }
                              color="success"
                              variant="flat"
                            >
                              {mc.name.split(" ")[0]}
                            </Chip>
                          </Tooltip>
                        ))}
                      </div>
                    ) : (
                      <Chip
                        className="text-danger border-danger text-xs italic"
                        color="danger"
                        variant="dot"
                      >
                        Belum ada mekanik
                      </Chip>
                    )}
                  </TableCell>

                  <TableCell>
                    <StatusQueue wo={item} />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      <ButtonStatus
                        item={item}
                        onSuccess={() => dispatch(getWo(woQuery))}
                      />

                      {item.progress !== "cancel" && (
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              className="text-gray-400"
                              size="sm"
                              variant="light"
                            >
                              <MoreVertical size={20} />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Aksi Antrean">
                            <DropdownItem
                              key="detail"
                              startContent={<EyeIcon size={18} />}
                              onPress={() =>
                                navigate(`/service/queue/${item.id}`)
                              }
                            >
                              Detail Order
                            </DropdownItem>

                            {restriction ? (
                              <DropdownItem
                                key="mech"
                                startContent={<UserCircleIcon size={18} />}
                                onPress={() => {
                                  dispatch(
                                    setMechanic(
                                      item.mechanics?.map((m) => m.id),
                                    ),
                                  );
                                  setOpenModal(true);
                                  setWoId(item.id);
                                }}
                              >
                                Pilih Mekanik
                              </DropdownItem>
                            ) : (
                              <DropdownItem key="spacer" className="hidden" />
                            )}

                            {item.progress === "queue" && restriction ? (
                              <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                startContent={<Trash2 size={18} />}
                                onPress={() =>
                                  confirmSweat(() => handleCancel(item.id))
                                }
                              >
                                Batalkan Antrean
                              </DropdownItem>
                            ) : (
                              <DropdownItem key="spacer-2" className="hidden" />
                            )}
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter>
          <CustomPagination
            className="w-full"
            meta={orders?.meta!}
            onPageChange={(page) => dispatch(setWoQuery({ page }))}
          />
        </CardFooter>
      </Card>
    </div>
  );
}

import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Dropdown,
  IconButton,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Table,
} from "@mui/joy";
import {
  EyeIcon,
  MoreVertical,
  Timer,
  Trash2,
  UserCircleIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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

interface Props {
  setOpenModal: (val: boolean) => void;
  setWoId: (id: number) => void;
}
export default function ListTable({ setOpenModal, setWoId }: Props) {
  const { orders, woQuery } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const restriction = hasRoles(["foreman", "super-admin"]);

  function handleCancel(id: number) {
    http
      .patch(`/work-order/cancel/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getWo(woQuery));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <Card>
      <Sheet>
        <Table borderAxis="xBetween" noWrap={true}>
          <thead>
            <tr>
              <th style={{ width: 140 }}>Estimasi/Antrean</th>
              <th style={{ width: 150 }}>Pelanggan & Unit</th>
              <th style={{ width: 80 }}>Prioritas</th>
              <th style={{ width: 180 }}>Tanggal Masuk</th>
              <th>dikerjakan Oleh</th>
              <th style={{ width: 180 }}>Status</th>
              <th style={{ width: 180 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders?.data.map((item) => (
              <tr key={item.id}>
                <td>
                  <Card color="neutral" size="sm" variant="soft">
                    <CardContent sx={{ textAlign: "center" }}>
                      <span className="text-[10px] font-bold text-slate-500 leading-none mb-1">
                        {item.estimation}
                      </span>
                      <span className="text-xs font-black text-primary leading-none">
                        {item.trx_no || item.queue_no}
                      </span>
                    </CardContent>
                  </Card>
                </td>

                <td>
                  <div>
                    <p className="font-bold text-slate-800">
                      {item.vehicle.plate_number}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.customer.name} • {item.vehicle.brand}{" "}
                      {item.vehicle.model}
                    </p>
                  </div>
                </td>
                <td>
                  <ChipPriority wo={item} />
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <span>
                      {dayjs(item.created_at).format("DD MMM YY | HH:mm")}
                    </span>
                  </div>
                </td>
                <td>
                  {item.mechanics?.length! > 0
                    ? item.mechanics?.map((mc) => (
                        <div key={mc.id} className="flex gap-2 items-center">
                          <Avatar
                            src={
                              mc.profile?.photo_url || getAvatarByName(mc.name)
                            }
                          />
                          <Chip
                            size="md"
                            startDecorator={<Timer />}
                            variant="solid"
                          >
                            {mc.name}
                          </Chip>
                        </div>
                      ))
                    : "-"}
                </td>
                <td>
                  <StatusQueue wo={item} />
                </td>
                <td>
                  <div className="flex items-center gap-2 justify-end">
                    <ButtonStatus
                      item={item}
                      onSuccess={() => dispatch(getWo(woQuery))}
                    />
                    {item.progress !== "cancel" && (
                      <Dropdown>
                        <MenuButton
                          slotProps={{
                            root: {
                              variant: "plain",
                              color: "neutral",
                              size: "sm",
                            },
                          }}
                          slots={{ root: IconButton }}
                        >
                          <MoreVertical />
                        </MenuButton>
                        <Menu placement="bottom-start">
                          <MenuItem
                            key="detail"
                            onClick={() =>
                              navigate(`/service/queue/${item.id}`)
                            }
                          >
                            <EyeIcon size={18} />
                            Detail Order
                          </MenuItem>
                          {restriction && (
                            <MenuItem
                              key="mech"
                              onClick={() => {
                                dispatch(
                                  setMechanic(
                                    item.mechanics?.map((item) => item.id),
                                  ),
                                );
                                setOpenModal(true);
                                setWoId(item.id);
                              }}
                            >
                              <UserCircleIcon size={18} /> Pilih Mekanik
                            </MenuItem>
                          )}

                          {item.progress === "queue" && restriction && (
                            <>
                              <ListDivider />
                              <MenuItem
                                key="dele"
                                sx={{ color: "red" }}
                                onClick={() =>
                                  confirmSweat(() => handleCancel(item.id))
                                }
                              >
                                <Trash2 size={18} />
                                Batalkan Antrean
                              </MenuItem>
                            </>
                          )}
                        </Menu>
                      </Dropdown>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <CustomPagination
        meta={orders?.meta!}
        onPageChange={(page) => dispatch(setWoQuery({ page }))}
      />
    </Card>
  );
}

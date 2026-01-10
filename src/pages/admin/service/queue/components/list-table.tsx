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

import StatusQueue from "./status-queue";
import ButtonStatus from "./button-status";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";
import { getWo } from "@/stores/features/work-order/wo-action";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";

interface Props {
  setOpenModal: (val: boolean) => void;
  setWoId: (id: number) => void;
}
export default function ListTable({ setOpenModal, setWoId }: Props) {
  const { orders, woQuery } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Card>
      <Sheet>
        <Table
          borderAxis="xBetween" // Garis pemisah antar kolom agar lebih jelas
        >
          <thead>
            <tr>
              <th style={{ width: 140 }}>Estimasi/Antrean</th>
              <th style={{ width: 200 }}>Pelanggan & Unit</th>
              <th style={{ minWidth: 400 }}>Layanan</th>
              <th style={{ width: 200 }}>dikerjakan Oleh</th>
              <th style={{ width: 200 }}>Status</th>
              <th style={{ width: 100 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders?.data.map((item) => (
              <tr key={item.id}>
                <td>
                  <Card color="neutral" size="sm" variant="soft">
                    <CardContent>
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
                  <div className="flex flex-wrap items-center gap-2">
                    {item?.services?.map((srv, j) => (
                      <Chip key={j} variant="outlined">
                        {srv.name}
                      </Chip>
                    ))}
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
                  <div className="flex items-center gap-2">
                    <ButtonStatus
                      item={item}
                      onSuccess={() => dispatch(getWo(woQuery))}
                    />
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
                          onClick={() => navigate(`/service/queue/${item.id}`)}
                        >
                          <EyeIcon size={18} />
                          Detail Order
                        </MenuItem>
                        <MenuItem
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
                        {item.progress === "queue" && (
                          <>
                            <ListDivider />
                            <MenuItem sx={{ color: "red" }}>
                              <Trash2 size={18} />
                              Batalkan Antrean
                            </MenuItem>
                          </>
                        )}
                      </Menu>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Card>
  );
}

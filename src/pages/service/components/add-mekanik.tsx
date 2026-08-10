import { useEffect, useMemo, useState } from "react";
import {
  CircleXIcon,
  PhoneCallIcon,
  Play,
  Search,
  UserPlus2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Input,
} from "@heroui/react";

import { getMechanic } from "@/stores/features/mechanic/mechanic-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";
import { MECHANIC_STATUS_CONFIG } from "@/utils/interfaces/global";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { getWo } from "@/stores/features/work-order/wo-action";

interface Props {
  open: boolean;
  id?: number;
  setOpen: (val: boolean) => void;
  onRefresh?: () => void;
  onSave?: (ids: number[]) => void;
  startWorkOnSave?: boolean;
  onStartWorkModeReset?: () => void;
}

type MechanicStatusFilter = "all" | "ready" | "busy";

const STATUS_FILTERS: MechanicStatusFilter[] = ["all", "ready", "busy"];

export default function AddMechanich({
  open,
  setOpen,
  id,
  onRefresh,
  onSave,
  startWorkOnSave = false,
  onStartWorkModeReset,
}: Props) {
  const { mechanics, mechanicIds, mechanicQuery } = useAppSelector(
    (state) => state.mechanic,
  );
  const { company } = useAppSelector((state) => state.auth);
  const { woQuery } = useAppSelector((state) => state.wo);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MechanicStatusFilter>("all");

  const mechanicList = useMemo(() => {
    return (
      Array.isArray(mechanics)
        ? mechanics
        : Array.isArray((mechanics as any)?.data)
          ? (mechanics as any).data
          : []
    ) as typeof mechanics;
  }, [mechanics]);

  const filteredMechanics = useMemo(() => {
    const term = searchQuery.toLowerCase();

    return mechanicList.filter((m) => {
      const matchesSearch =
        m.name?.toLowerCase().includes(term) ||
        m.nik?.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" || m.work_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, mechanicList, statusFilter]);

  useEffect(() => {
    if (company && open) {
      dispatch(getMechanic(mechanicQuery));
    }
  }, [company, open, dispatch, mechanicQuery]);

  const handleClose = () => {
    dispatch(setMechanic([]));
    setSearchQuery("");
    setStatusFilter("all");
    onStartWorkModeReset?.();
    setOpen(false);
  };

  const refreshAfterSave = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      dispatch(getWo(woQuery));
    }
  };

  const handleSubmit = () => {
    setLoading(true);

    if (onSave) {
      onSave(mechanicIds);
      dispatch(setMechanic([]));
      setLoading(false);
      handleClose();

      return;
    }

    if (id) {
      http
        .patch(`/work-order/mechanic/${id}`, {
          ids: mechanicIds,
        })
        .then(({ data }) => {
          notify(data.message);
          dispatch(setMechanic([]));
          refreshAfterSave();
          handleClose();
        })
        .catch((err) => notifyError(err))
        .finally(() => setLoading(false));
    }
  };

  const handleStartWork = () => {
    if (!id || mechanicIds.length < 1) return;

    setLoading(true);
    http
      .patch(`/work-order/mechanic/${id}`, {
        ids: mechanicIds,
      })
      .then(() =>
        http.patch(`/work-order/${id}`, {
          progress: "on_progress",
        }),
      )
      .then(({ data }) => {
        notify(data.message);
        dispatch(setMechanic([]));
        refreshAfterSave();
        handleClose();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={open}
      scrollBehavior="outside"
      size="3xl"
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <UserPlus2 className="text-primary" />
                <div className="flex flex-col">
                  <span>{t("service.mechanic_modal.title")}</span>
                  <span className="text-tiny font-normal text-gray-400">
                    {t("service.mechanic_modal.subtitle")}
                  </span>
                </div>
              </div>
              <Input
                endContent={
                  <CircleXIcon
                    className="cursor-pointer text-gray-600"
                    size={18}
                    onClick={() => setSearchQuery("")}
                  />
                }
                placeholder={t("service.mechanic_modal.search_placeholder")}
                startContent={<Search className=" text-gray-600" />}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => (
                  <Chip
                    key={filter}
                    className="cursor-pointer"
                    color={statusFilter === filter ? "primary" : "default"}
                    variant={statusFilter === filter ? "solid" : "flat"}
                    onClick={() => setStatusFilter(filter)}
                  >
                    {t(`service.mechanic_modal.filter_${filter}`)}
                  </Chip>
                ))}
              </div>
            </ModalHeader>
            <ModalBody className="pb-6">
              <Table
                isHeaderSticky
                removeWrapper
                aria-label={t("service.mechanic_modal.table_aria")}
                classNames={{
                  th: "bg-default-50 text-gray-600 font-bold",
                  td: "py-3 border-b border-default-100 last:border-none",
                }}
                selectedKeys={new Set(mechanicIds.map(String))}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  // Jika "all", kita ambil semua ID mekanik
                  if (keys === "all") {
                    dispatch(setMechanic(filteredMechanics.map((m) => m.id)));
                  } else {
                    // Jika parsial, konversi Set ke array of numbers
                    const selectedArray = Array.from(keys).map(Number);

                    dispatch(setMechanic(selectedArray));
                  }
                }}
              >
                <TableHeader>
                  <TableColumn>
                    {t("service.mechanic_modal.mechanic_col")}
                  </TableColumn>
                  <TableColumn>
                    {t("service.mechanic_modal.contact_col")}
                  </TableColumn>
                  <TableColumn align="center">
                    {t("service.mechanic_modal.status_col")}
                  </TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={t("common.no_data")}
                  items={filteredMechanics}
                >
                  {(item) => {
                    const status =
                      item.work_status as keyof typeof MECHANIC_STATUS_CONFIG;
                    const config =
                      MECHANIC_STATUS_CONFIG[status] ||
                      MECHANIC_STATUS_CONFIG.leave;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              isBordered
                              className="size-10"
                              name={item.name}
                              src={
                                item?.profile?.photo_url ||
                                getAvatarByName(item.name)
                              }
                            />
                            <div className="flex flex-col">
                              <span className="text-small font-semibold">
                                {item.name}
                              </span>
                              <span className="text-tiny text-gray-400 font-mono">
                                {item.nik}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center text-gray-500">
                            <PhoneCallIcon size={14} />
                            <span className="text-small">
                              {item?.profile?.phone_number || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            classNames={{
                              base: config.bg,
                              content: `${config.text} font-bold`,
                            }}
                            size="sm"
                            startContent={
                              <span
                                className={`h-1.5 w-1.5 rounded-full ml-1 ${config.dot}`}
                              />
                            }
                            variant="flat"
                          >
                            {t(`mechanic.status.${status}`)}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    );
                  }}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter className="border-t border-default-100">
              <Button color="danger" variant="light" onPress={handleClose}>
                {t("common.cancel")}
              </Button>
              {!onSave && (
                <Button
                  className="font-bold"
                  color="primary"
                  isLoading={loading}
                  variant="flat"
                  onPress={handleSubmit}
                >
                  {t("service.mechanic_modal.save")}
                </Button>
              )}
              {startWorkOnSave && !onSave && (
                <Button
                  className="font-bold"
                  color="primary"
                  isDisabled={mechanicIds.length < 1}
                  isLoading={loading}
                  startContent={<Play fill="currentColor" size={16} />}
                  variant="shadow"
                  onPress={handleStartWork}
                >
                  {t("service.queue.start_work_btn")}
                </Button>
              )}
              {onSave && (
                <Button
                  className="font-bold"
                  color="primary"
                  isLoading={loading}
                  onPress={handleSubmit}
                >
                  {t("service.mechanic_modal.save")}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

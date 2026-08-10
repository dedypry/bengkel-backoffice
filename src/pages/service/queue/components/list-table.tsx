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
  Tabs,
  Tab,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  EyeIcon,
  MoreVertical,
  UserCircleIcon,
  CalendarDays,
  Search,
  Trash2,
  PencilIcon,
  BellRing,
  LayoutGrid,
  Clock,
  Wrench,
  CheckCircle2,
  Flag,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, type Key } from "react";
import { useTranslation } from "react-i18next";

import StatusQueue from "./status-queue";
import ButtonStatus from "./button-status";
import ChipPriority from "./chip-priority";
import CancelConfirm from "./cancel-confirm";
import ManualStatusModal from "./manual-status-modal";
import {
  createQueueSkeletonItems,
  QueueCellSkeleton,
} from "./list-table-skeleton";
import QueueEmptyState from "./queue-empty-state";

import { formatWorkOrderDateTime } from "@/utils/helpers/dayjs";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  calculateTotalEstimation,
  getAvatarByName,
} from "@/utils/helpers/global";
import { getWo } from "@/stores/features/work-order/wo-action";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import { CustomPagination } from "@/components/custom-pagination";
import { setWoQuery } from "@/stores/features/work-order/wo-slice";
import debounce from "@/utils/helpers/debounce";
import PageSize from "@/components/page-size";
import CustomDateRangePicker from "@/components/forms/date-range-picker";
import { usePermission } from "@/components/use-permission";
import { useSidebar } from "@/context/sidebar-context";
import { IWorkOrder } from "@/utils/interfaces/IUser";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

interface Props {
  setOpenModal: (val: boolean) => void;
  setWoId: (id: number) => void;
  setStartWorkOnSave: (val: boolean) => void;
}

interface MechanicOption {
  id: number;
  name: string;
}

function QueueTabLabel({
  icon: Icon,
  label,
  count,
}: {
  icon: LucideIcon;
  label: string;
  count?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={15} strokeWidth={2.2} />
      <span>{label}</span>
      {typeof count === "number" ? (
        <span className="tabular-nums opacity-75">({count})</span>
      ) : null}
    </span>
  );
}

function MechanicCell({ item }: { item: IWorkOrder }) {
  const { t } = useTranslation();

  if (item.mechanics && item.mechanics.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {item.mechanics.map((mc) => (
          <Tooltip key={mc.id} content={mc.name} placement="top">
            <Chip
              avatar={
                <Avatar
                  className="uppercase"
                  name={mc.name}
                  src={mc.profile?.photo_url || getAvatarByName(mc.name)}
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
    );
  }

  return (
    <Chip
      className="text-danger border-danger text-xs italic"
      color="danger"
      variant="dot"
    >
      {t("service.queue.no_mechanic")}
    </Chip>
  );
}

export default function ListTable({
  setOpenModal,
  setWoId,
  setStartWorkOnSave,
}: Props) {
  const { t } = useTranslation();
  const { orders, woQuery, isLoadingOrder } = useAppSelector(
    (state) => state.wo,
  );
  const { collapsed } = useSidebar();
  const [openCancel, setOpenCancel] = useState(false);
  const [openManual, setOpenManual] = useState(false);
  const [woItem, setWoItem] = useState<IWorkOrder>();
  const [callingCashierId, setCallingCashierId] = useState<number | null>(null);
  const [mechanicOptions, setMechanicOptions] = useState<MechanicOption[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { hasPermission } = usePermission();
  const resUpdate = hasPermission("wo.update");
  const resDelete = hasPermission("wo.delete");
  // Sidebar expanded → kolom digabung; collapsed → dipisah
  const mergePriorityMechanic = !collapsed;

  const debounceSearch = debounce(
    (q) => dispatch(setWoQuery({ q, page: 1 })),
    500,
  );

  useEffect(() => {
    http
      .get<MechanicOption[]>("/work-order/mechanic-options")
      .then(({ data }) => setMechanicOptions(Array.isArray(data) ? data : []))
      .catch(() => setMechanicOptions([]));
  }, []);

  const selectedMechanicIds = woQuery.mechanic_ids || [];

  const handleCallCashier = (item: IWorkOrder) => {
    setCallingCashierId(item.id);
    http
      .post(`/work-order/call-cashier/${item.id}`)
      .then(({ data }) => notify(data.message))
      .catch((err) => notifyError(err))
      .finally(() => setCallingCashierId(null));
  };

  const queueTabs = [
    "active",
    "queue",
    "on_progress",
    "ready",
    "finish",
    "cancel",
  ] as const;

  const activeTab = queueTabs.includes(
    woQuery.status as (typeof queueTabs)[number],
  )
    ? woQuery.status
    : "active";

  const skeletonItems = useMemo(
    () => createQueueSkeletonItems(woQuery.pageSize),
    [woQuery.pageSize],
  );

  const tableItems: Array<IWorkOrder | { id: string }> = isLoadingOrder
    ? skeletonItems
    : orders?.data || [];

  const queueTabItems = useMemo(() => {
    const stats = orders?.stats;

    const activeCount =
      (stats?.waiting || 0) + (stats?.processing || 0) + (stats?.ready || 0);

    return [
      {
        key: "active",
        label: t("service.queue.tabs.active"),
        icon: LayoutGrid,
        count: activeCount,
      },
      {
        key: "queue",
        label: t("service.queue.stats.waiting"),
        icon: Clock,
        count: stats?.waiting || 0,
      },
      {
        key: "on_progress",
        label: t("service.queue.stats.processing"),
        icon: Wrench,
        count: stats?.processing || 0,
      },
      {
        key: "ready",
        label: t("service.queue.stats.ready"),
        icon: CheckCircle2,
        count: stats?.ready || 0,
      },
      {
        key: "finish",
        label: t("service.queue.tabs.finish"),
        icon: Flag,
        count: stats?.completed || 0,
      },
      {
        key: "cancel",
        label: t("service.queue.tabs.cancel"),
        icon: XCircle,
        count: stats?.cancelled || 0,
      },
    ];
  }, [orders?.stats, t]);

  const columns = mergePriorityMechanic
    ? [
        {
          key: "estimasi",
          label: t("service.queue.columns.estimation_queue"),
        },
        {
          key: "pelanggan",
          label: t("service.queue.columns.customer_unit"),
        },
        {
          key: "priority_mech",
          label: t("service.queue.columns.priority_mechanic"),
        },
        { key: "tanggal", label: t("service.queue.columns.date_in") },
        { key: "status", label: t("service.queue.columns.status") },
        { key: "aksi", label: t("service.queue.columns.action") },
      ]
    : [
        {
          key: "estimasi",
          label: t("service.queue.columns.estimation_queue"),
        },
        {
          key: "pelanggan",
          label: t("service.queue.columns.customer_unit"),
        },
        { key: "priority", label: t("service.queue.columns.priority") },
        { key: "tanggal", label: t("service.queue.columns.date_in") },
        { key: "mechanic", label: t("service.queue.columns.worked_by") },
        { key: "status", label: t("service.queue.columns.status") },
        { key: "aksi", label: t("service.queue.columns.action") },
      ];

  const renderCell = (item: IWorkOrder, columnKey: Key) => {
    switch (columnKey) {
      case "estimasi":
        return (
          <button
            className="flex w-full flex-col items-center bg-default-100 rounded-lg py-1 px-2 border border-default-200"
            type="button"
            onClick={() => navigate(`/service/queue/${item.id}`)}
          >
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              {calculateTotalEstimation(
                item.services.map((svc) => ({
                  estimated: svc.data.estimated_duration,
                  type: svc.data.estimated_type,
                })),
              )}
            </span>
            <span className="text-sm font-black text-primary tracking-tight">
              {item.trx_no || item.queue_no}
            </span>
          </button>
        );
      case "pelanggan":
        return (
          <div className="flex flex-col">
            <span className="font-bold text-default-800 uppercase tracking-wide">
              {item.vehicle.plate_number}
            </span>
            <span className="text-tiny text-gray-500 truncate max-w-[150px]">
              {item.customer.name} • {item.vehicle.brand} {item.vehicle.model}
            </span>
          </div>
        );
      case "priority":
        return <ChipPriority wo={item} />;
      case "priority_mech":
        return (
          <div className="flex flex-col gap-2">
            <ChipPriority wo={item} />
            <MechanicCell item={item} />
          </div>
        );
      case "tanggal":
        return (
          <div className="flex items-center gap-2 text-default-600">
            <CalendarDays className="text-gray-400" size={14} />
            <span className="text-tiny font-medium">
              {formatWorkOrderDateTime(item.created_at)}
            </span>
          </div>
        );
      case "mechanic":
        return <MechanicCell item={item} />;
      case "status":
        return <StatusQueue wo={item} />;
      case "aksi":
        return (
          <div className="flex items-center gap-2 justify-end">
            {resUpdate && item.progress === "ready" && (
              <Tooltip content={t("service.queue.call_cashier_tooltip")}>
                <Button
                  isIconOnly
                  color="warning"
                  isLoading={callingCashierId === item.id}
                  size="sm"
                  variant="flat"
                  onPress={() => handleCallCashier(item)}
                >
                  <BellRing size={18} />
                </Button>
              </Tooltip>
            )}
            {resUpdate && (
              <ButtonStatus
                item={item}
                onSelectMechanic={() => {
                  dispatch(setMechanic(item.mechanics?.map((m) => m.id)));
                  setWoId(item.id);
                  setStartWorkOnSave(true);
                  setOpenModal(true);
                }}
                onSuccess={() => dispatch(getWo(woQuery))}
              />
            )}
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
              <DropdownMenu aria-label={t("service.queue.dropdown_aria")}>
                <DropdownItem
                  key="detail"
                  startContent={<EyeIcon size={18} />}
                  onPress={() => navigate(`/service/queue/${item.id}`)}
                >
                  {t("service.queue.detail_order")}
                </DropdownItem>

                {resUpdate ? (
                  <DropdownItem
                    key="mech"
                    startContent={<UserCircleIcon size={18} />}
                    onPress={() => {
                      dispatch(setMechanic(item.mechanics?.map((m) => m.id)));
                      setWoId(item.id);
                      setStartWorkOnSave(false);
                      setOpenModal(true);
                    }}
                  >
                    {t("service.queue.select_mechanic")}
                  </DropdownItem>
                ) : (
                  <DropdownItem key="spacer" className="hidden" />
                )}

                {resUpdate ? (
                  <DropdownItem
                    key="manual-change-status"
                    startContent={<PencilIcon size={18} />}
                    onPress={() => {
                      setWoItem(item);
                      setOpenManual(true);
                    }}
                  >
                    {t("service.manual_status.title")}
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="manual-change-status-spacer"
                    className="hidden"
                  />
                )}

                {resUpdate && item.progress === "ready" ? (
                  <DropdownItem
                    key="call-cashier"
                    startContent={<BellRing size={18} />}
                    onPress={() => handleCallCashier(item)}
                  >
                    {t("service.queue.call_cashier")}
                  </DropdownItem>
                ) : (
                  <DropdownItem key="call-cashier-spacer" className="hidden" />
                )}

                {!["finish", "cancel", "rejected"].includes(
                  item.progress || "",
                ) &&
                !["closed", "cancel"].includes(item.status || "") &&
                resDelete ? (
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<Trash2 size={18} />}
                    onPress={() => {
                      setWoItem(item);
                      setOpenCancel(true);
                    }}
                  >
                    {t("service.queue.cancel_service")}
                  </DropdownItem>
                ) : (
                  <DropdownItem key="spacer-2" className="hidden" />
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {woItem && (
        <>
          <CancelConfirm
            item={woItem}
            open={openCancel}
            setOpen={setOpenCancel}
          />
          <ManualStatusModal
            item={woItem}
            open={openManual}
            setOpen={setOpenManual}
          />
        </>
      )}

      <Tabs
        aria-label={t("service.queue.filter_aria")}
        classNames={{
          base: "w-full overflow-x-auto",
          tabList: "gap-1 p-1 bg-default-100 rounded-xl w-max min-w-full",
          tab: "h-10 px-3",
          cursor: "rounded-lg shadow-sm bg-white",
          tabContent:
            "text-gray-600 group-data-[selected=true]:text-primary font-semibold",
          panel: "hidden",
        }}
        color="primary"
        selectedKey={activeTab}
        size="lg"
        variant="light"
        onSelectionChange={(key) =>
          dispatch(setWoQuery({ status: String(key), page: 1 }))
        }
      >
        {queueTabItems.map((tab) => (
          <Tab
            key={tab.key}
            title={
              <QueueTabLabel
                count={tab.count}
                icon={tab.icon}
                label={tab.label}
              />
            }
          />
        ))}
      </Tabs>

      <Card>
        <CardHeader className="flex justify-between gap-2">
          <PageSize
            label={t("service.queue.page_size")}
            selectedKeys={[woQuery.pageSize.toString()]}
            onSelectionChange={(key) => {
              const val = Array.from(key)[0];

              dispatch(setWoQuery({ pageSize: val, page: 1 }));
            }}
          />
          <div className="flex flex-wrap items-end justify-end gap-2">
            <Select
              aria-label={t("service.queue.filter_mechanic")}
              className="w-[280px]"
              label={t("service.queue.filter_mechanic")}
              placeholder={t("service.queue.filter_mechanic_placeholder")}
              selectedKeys={new Set(selectedMechanicIds.map(String))}
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                if (keys === "all") {
                  dispatch(
                    setWoQuery({
                      mechanic_ids: mechanicOptions.map((item) => item.id),
                      page: 1,
                    }),
                  );

                  return;
                }

                dispatch(
                  setWoQuery({
                    mechanic_ids: Array.from(keys).map(Number),
                    page: 1,
                  }),
                );
              }}
            >
              {mechanicOptions.map((item) => (
                <SelectItem key={String(item.id)} textValue={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>
            <Input
              isClearable
              className="w-[400px]"
              label={t("common.search")}
              placeholder={t("service.queue.search_placeholder")}
              startContent={<Search size={18} />}
              onChange={(e) => debounceSearch(e.target.value)}
              onClear={() => dispatch(setWoQuery({ q: "", page: 1 }))}
            />
            <CustomDateRangePicker
              className="w-[300px]"
              label={t("common.date")}
              value={
                {
                  start: woQuery.date_from,
                  end: woQuery.date_to,
                } as any
              }
              onChange={(val: any) => {
                dispatch(
                  setWoQuery({
                    date: "",
                    date_from: val?.start || "",
                    date_to: val?.end || "",
                    page: 1,
                  }),
                );
              }}
            />
          </div>
        </CardHeader>
        <CardBody>
          <Table
            key={mergePriorityMechanic ? "merged" : "split"}
            removeWrapper
            aria-label={t("service.queue.table_aria")}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  align={
                    column.key === "status" || column.key === "aksi"
                      ? "center"
                      : column.key === "priority"
                        ? "center"
                        : "start"
                  }
                  width={column.key === "estimasi" ? 160 : undefined}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={!isLoadingOrder ? <QueueEmptyState /> : null}
              items={tableItems}
            >
              {(item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-default-50 last:border-none"
                >
                  {(columnKey) => (
                    <TableCell>
                      {isLoadingOrder ? (
                        <QueueCellSkeleton columnKey={String(columnKey)} />
                      ) : (
                        renderCell(item as IWorkOrder, columnKey)
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
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

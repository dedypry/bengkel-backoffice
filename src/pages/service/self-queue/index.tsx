import type { IQueue, QueueStatus } from "@/utils/interfaces/IQueue";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  CheckCircle2,
  Monitor,
  Play,
  RefreshCcw,
  Search,
  SkipForward,
  Ticket,
  Wrench,
} from "lucide-react";

import HeaderAction from "@/components/header-action";
import { CustomPagination } from "@/components/custom-pagination";
import { useCompanyQueueRealtime } from "@/hooks/use-company-queue-realtime";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getQueueCategories,
  getQueues,
} from "@/stores/features/self-queue/queue-action";
import { setQueueQuery } from "@/stores/features/self-queue/queue-slice";
import { http } from "@/utils/libs/axios";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import debounce from "@/utils/helpers/debounce";
import { dateTimeFormat } from "@/utils/helpers/formater";

const STATUS_CONFIG: Record<
  QueueStatus,
  { labelKey: string; color: "default" | "warning" | "primary" | "danger" | "success" }
> = {
  WAITING: { labelKey: "service.self_queue.status_waiting", color: "default" },
  CALLING: { labelKey: "service.self_queue.status_calling", color: "warning" },
  PROCESSING: {
    labelKey: "service.self_queue.status_processing",
    color: "primary",
  },
  SKIP: { labelKey: "service.self_queue.status_skip", color: "danger" },
  DONE: { labelKey: "service.self_queue.status_done", color: "success" },
};

export default function SelfQueuePanelPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { company } = useAppSelector((state) => state.auth);
  const { queues, query } = useAppSelector((state) => state.selfQueue);
  const [counterNumber, setCounterNumber] = useState("1");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (company?.id && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getQueueCategories(company.id));
    }
  }, [company?.id, dispatch]);

  useEffect(() => {
    if (company?.id) {
      dispatch(getQueues(query));
    }
  }, [query, company?.id, dispatch]);

  const refresh = useCallback(
    () => dispatch(getQueues(query)),
    [dispatch, query],
  );

  useCompanyQueueRealtime(company?.id, () => {
    dispatch(getQueues(query));
  });

  const searchDebounce = debounce((q: string) => {
    dispatch(setQueueQuery({ q, page: 1 }));
  }, 800);

  const statusOptions = [
    { key: "all", label: t("service.self_queue.all") },
    ...Object.entries(STATUS_CONFIG).map(([key, value]) => ({
      key,
      label: t(value.labelKey),
    })),
  ];

  const callNext = () => {
    http
      .post("/queue/next", { counter_number: counterNumber })
      .then(({ data }) => {
        notify(
          t("service.self_queue.call_notify", {
            number: data.queue_number || data.data?.queue_number,
          }),
        );
        refresh();
      })
      .catch((err) => notifyError(err));
  };

  const updateStatus = (item: IQueue, status: QueueStatus) => {
    http
      .patch("/queue/status", {
        id: item.id,
        status,
        counter_number: item.counter_number || counterNumber,
      })
      .then(({ data }) => {
        notify(data.message);
        refresh();
      })
      .catch((err) => notifyError(err));
  };

  const todayQueues = queues?.data || [];
  const waiting = todayQueues.filter((q) => q.status === "WAITING").length;
  const calling = todayQueues.filter((q) => q.status === "CALLING").length;
  const processing = todayQueues.filter(
    (q) => q.status === "PROCESSING",
  ).length;

  return (
    <div className="space-y-6 pb-20">
      <HeaderAction
        actionContent={
          <div className="flex flex-wrap gap-2">
            <Input
              className="w-28"
              label={t("service.self_queue.counter")}
              labelPlacement="inside"
              size="sm"
              value={counterNumber}
              onValueChange={setCounterNumber}
            />
            <Button
              color="primary"
              startContent={<Ticket size={18} />}
              onPress={callNext}
            >
              {t("service.self_queue.call_next")}
            </Button>
          </div>
        }
        leadIcon={Monitor}
        subtitle={t("service.self_queue.subtitle")}
        title={t("service.self_queue.title")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            label: t("service.self_queue.waiting"),
            value: waiting,
            color: "bg-gray-100 text-gray-700",
          },
          {
            label: t("service.self_queue.calling"),
            value: calling,
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: t("service.self_queue.processing"),
            value: processing,
            color: "bg-primary/10 text-primary",
          },
        ].map((card) => (
          <Card key={card.label} className="shadow-none border border-gray-100">
            <CardBody className="flex flex-row items-center gap-3 p-4">
              <div
                className={`size-10 rounded-sm flex items-center justify-center ${card.color}`}
              >
                <Ticket size={20} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-700">
                  {card.value}
                </p>
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  {card.label}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
        <Input
          isClearable
          className="md:max-w-xs"
          defaultValue={query.q}
          placeholder={t("service.self_queue.search_placeholder")}
          startContent={<Search className="text-gray-400" size={20} />}
          onValueChange={searchDebounce}
        />
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            className="md:w-44"
            label={t("service.self_queue.date")}
            labelPlacement="outside-left"
            type="date"
            value={query.date}
            onValueChange={(date) => dispatch(setQueueQuery({ date, page: 1 }))}
          />
          <Select
            className="md:w-44"
            label={t("service.self_queue.status")}
            labelPlacement="outside-left"
            selectedKeys={[query.status || "all"]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0]?.toString() || "all";

              dispatch(
                setQueueQuery({
                  status: selected === "all" ? "" : selected,
                  page: 1,
                }),
              );
            }}
          >
            {statusOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
          <Button isIconOnly variant="flat" onPress={refresh}>
            <RefreshCcw size={18} />
          </Button>
        </div>
      </div>

      <Table
        isStriped
        aria-label={t("service.self_queue.table_aria")}
        classNames={{ td: "py-4 px-6 border-b border-gray-200" }}
      >
        <TableHeader>
          <TableColumn>{t("service.self_queue.columns.number")}</TableColumn>
          <TableColumn>{t("service.self_queue.columns.category")}</TableColumn>
          <TableColumn>{t("service.self_queue.columns.time")}</TableColumn>
          <TableColumn>{t("service.self_queue.columns.counter")}</TableColumn>
          <TableColumn>{t("service.self_queue.columns.status")}</TableColumn>
          <TableColumn align="center">
            {t("service.self_queue.columns.action")}
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={t("service.self_queue.empty")}>
          {todayQueues.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span className="text-xl font-black text-primary">
                  {item.queue_number}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-700 uppercase">
                    {item.category?.name || "-"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {t("service.self_queue.est_minutes", {
                      minutes: item.category?.estimated_minutes || 0,
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-gray-500">
                  {dateTimeFormat(item.created_at)}
                </span>
              </TableCell>
              <TableCell>{item.counter_number || "-"}</TableCell>
              <TableCell>
                <Chip
                  color={STATUS_CONFIG[item.status]?.color || "default"}
                  size="sm"
                  variant="dot"
                >
                  {t(STATUS_CONFIG[item.status]?.labelKey || item.status)}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  {item.status === "CALLING" && (
                    <Button
                      isIconOnly
                      color="primary"
                      size="sm"
                      variant="flat"
                      onPress={() => updateStatus(item, "PROCESSING")}
                    >
                      <Wrench size={15} />
                    </Button>
                  )}
                  {["WAITING", "CALLING"].includes(item.status) && (
                    <Button
                      isIconOnly
                      color="warning"
                      size="sm"
                      variant="flat"
                      onPress={() => updateStatus(item, "CALLING")}
                    >
                      <Play size={15} />
                    </Button>
                  )}
                  {["WAITING", "CALLING"].includes(item.status) && (
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="flat"
                      onPress={() =>
                        confirmSweat(() => updateStatus(item, "SKIP"), {
                          title: t("service.self_queue.skip_title"),
                          text: t("service.self_queue.skip_text"),
                          confirmButtonText: t("service.self_queue.skip_confirm"),
                        })
                      }
                    >
                      <SkipForward size={15} />
                    </Button>
                  )}
                  {item.status === "PROCESSING" && (
                    <Button
                      isIconOnly
                      color="success"
                      size="sm"
                      variant="flat"
                      onPress={() => updateStatus(item, "DONE")}
                    >
                      <CheckCircle2 size={15} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        meta={queues?.meta!}
        onPageChange={(page) => dispatch(setQueueQuery({ page }))}
      />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  useDisclosure,
} from "@heroui/react";
import { Plus, Package, Wrench } from "lucide-react";

import TabService from "./tab-service";
import TabSparepart from "./tab-sparepart";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";
import { setServiceQuery } from "@/stores/features/service/service-slice";
import { getProduct } from "@/stores/features/product/product-action";
import { setProductQuery } from "@/stores/features/product/product-slice";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import { CustomPagination } from "@/components/custom-pagination";
import { getWo, getWoDetail } from "@/stores/features/work-order/wo-action";
import { formWoClear } from "@/stores/features/work-order/wo-slice";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { generateDataWo } from "@/utils/helpers/global";

interface Props {
  isSave?: boolean;
  onSave?: () => void;
  onClose?: () => void;
}

export default function ModalAddService({ isSave, onSave, onClose }: Props) {
  const { t } = useTranslation();
  const { company } = useAppSelector((state) => state.auth);
  const {
    workOrder,
    services: serviceWo,
    sparepart,
    woQuery,
  } = useAppSelector((state) => state.wo);
  const { query, services } = useAppSelector((state) => state.service);
  const { productQuery, products } = useAppSelector((state) => state.product);
  const [selectedKey, setSelectedKey] = useState("service");
  const [isLoading, setIsLoading] = useState(false);
  // HeroUI hook untuk kontrol modal yang lebih clean
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const dispatch = useAppDispatch();
  const hasFetch = useRef(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;
      dispatch(getSupplier({ noPaginate: 1 }));

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current;

    prevOpenRef.current = isOpen;

    if (justOpened) {
      dispatch(setServiceQuery({ q: "", page: 1 }));
      dispatch(setProductQuery({ q: "", page: 1 }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dispatch(getService(query));
  }, [company, isOpen, query, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dispatch(getProduct(productQuery));
  }, [company, isOpen, productQuery, dispatch]);

  const handleSave = async () => {
    if (!workOrder) return;
    setIsLoading(true);
    const payload = generateDataWo(serviceWo, sparepart);

    http
      .patch(`/work-order/service/${workOrder.id}`, payload)
      .then(({ data }) => {
        notify(data.message);
        dispatch(formWoClear());
        dispatch(getWoDetail(workOrder.id as any));
        dispatch(getWo({ ...woQuery, pageSize: 100, date: "" } as any));
      })
      .catch((err) => notifyError(err))
      .finally(() => {
        setIsLoading(false);
        dispatch(formWoClear());
      });
  };

  return (
    <>
      <Button
        className="font-bold"
        color="primary"
        size="sm"
        startContent={<Plus size={18} />}
        variant="flat"
        onPress={onOpen}
      >
        {t("service.add.add_item")}
      </Button>

      <Modal
        backdrop="blur"
        classNames={{
          header: "border-b-[1px] border-default-100",
          footer: "border-t-[1px] border-default-100",
        }}
        isOpen={isOpen}
        scrollBehavior="outside"
        size="4xl" // Setara xl di Joy UI
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">
                  {t("service.add.modal_title")}
                </h3>
                <p className="text-tiny text-gray-500 font-normal">
                  {t("service.add.modal_subtitle")}
                </p>
              </ModalHeader>

              <ModalBody className="py-6">
                <Tabs
                  fullWidth
                  aria-label={t("service.add.modal_tab_aria")}
                  classNames={{
                    tabList:
                      "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-0 h-12",
                    tabContent:
                      "group-data-[selected=true]:text-primary text-secondary-500 font-bold",
                  }}
                  color="primary"
                  selectedKey={selectedKey}
                  variant="underlined"
                  onSelectionChange={(key) => setSelectedKey(key as string)}
                >
                  <Tab
                    key="service"
                    title={
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Wrench size={18} />
                        <span>{t("service.add.tab_service")}</span>
                      </div>
                    }
                  >
                    <div className="mt-4">
                      <TabService />
                    </div>
                  </Tab>
                  <Tab
                    key="sparepart"
                    title={
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Package size={18} />
                        <span>{t("service.add.tab_sparepart")}</span>
                      </div>
                    }
                  >
                    <div className="mt-4">
                      <TabSparepart />
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>

              <ModalFooter>
                <div className="flex w-full justify-between gap-8 items-center">
                  <div className="w-full">
                    {selectedKey === "service" ? (
                      <CustomPagination
                        meta={services?.meta!}
                        onPageChange={(page) =>
                          dispatch(setServiceQuery({ page }))
                        }
                      />
                    ) : (
                      <CustomPagination
                        meta={products?.meta!}
                        onPageChange={(page) =>
                          dispatch(setProductQuery({ page }))
                        }
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      color="danger"
                      isDisabled={isLoading}
                      size="sm"
                      variant="bordered"
                      onPress={() => {
                        if (onClose) {
                          onClose();
                        }
                        onCloseModal();
                      }}
                    >
                      {t("service.add.close")}
                    </Button>
                    {isSave && (
                      <Button
                        color="primary"
                        isLoading={isLoading}
                        size="sm"
                        onPress={() => {
                          if (onSave) {
                            onSave();
                          } else {
                            handleSave();
                          }
                        }}
                      >
                        {t("service.add.save_changes")}
                      </Button>
                    )}
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

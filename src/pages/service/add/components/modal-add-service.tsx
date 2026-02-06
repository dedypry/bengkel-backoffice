import { useEffect } from "react";
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
import { getProduct } from "@/stores/features/product/product-action";

interface Props {
  isSave?: boolean;
  onSave?: () => void;
  onClose?: () => void;
}

export default function ModalAddService({ isSave, onSave, onClose }: Props) {
  const { company } = useAppSelector((state) => state.auth);
  const { query } = useAppSelector((state) => state.service);
  const { productQuery } = useAppSelector((state) => state.product);

  // HeroUI hook untuk kontrol modal yang lebih clean
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      dispatch(getService(query));
      dispatch(getProduct(productQuery));
    }
  }, [company, isOpen, dispatch]);

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
        Tambah Barang/Jasa
      </Button>

      <Modal
        backdrop="blur"
        classNames={{
          base: "max-h-[90vh]",
          header: "border-b-[1px] border-default-100",
          footer: "border-t-[1px] border-default-100",
        }}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="4xl" // Setara xl di Joy UI
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">Tambah Barang dan Jasa</h3>
                <p className="text-tiny text-gray-500 font-normal">
                  Pilih layanan servis atau suku cadang untuk ditambahkan ke
                  Work Order.
                </p>
              </ModalHeader>

              <ModalBody className="py-6">
                <Tabs
                  fullWidth
                  aria-label="Opsi Layanan"
                  classNames={{
                    tabList:
                      "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-0 h-12",
                    tabContent:
                      "group-data-[selected=true]:text-primary text-secondary-500 font-bold",
                  }}
                  color="primary"
                  variant="underlined"
                >
                  <Tab
                    key="service"
                    title={
                      <div className="flex items-center gap-2">
                        <Wrench size={18} />
                        <span>Jasa / Servis</span>
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
                      <div className="flex items-center gap-2">
                        <Package size={18} />
                        <span>Suku Cadang (Sparepart)</span>
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
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    if (onClose) {
                      onClose();
                    }
                    onCloseModal();
                  }}
                >
                  Tutup
                </Button>
                {isSave && (
                  <Button color="primary" onPress={onSave}>
                    Simpan Perubahan
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

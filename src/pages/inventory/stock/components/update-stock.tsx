import { Edit, PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tooltip,
} from "@heroui/react";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProduct } from "@/stores/features/product/product-action";

interface Props {
  id: number;
  name: string;
  currentStock: number;
  defaultOpen?: boolean;
  hideTrigger?: boolean;
  onClosed?: () => void;
}

export default function UpdateStock({
  id,
  name,
  currentStock,
  defaultOpen = false,
  hideTrigger = false,
  onClosed,
}: Props) {
  const { t } = useTranslation();
  const { productQuery } = useAppSelector((state) => state.product);

  const [open, setOpen] = useState(defaultOpen);
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
    }
  }, [defaultOpen]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      onClosed?.();
    }
  }

  function onSubmit() {
    setLoading(true);
    http
      .patch(`/products/update-stock/${id}`, { stock })
      .then(({ data }) => {
        notify(data.message);
        handleOpenChange(false);
        setStock(0);
        dispatch(getProduct(productQuery));
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <>
      {!hideTrigger ? (
        <Tooltip
          closeDelay={0}
          content={t("inventory.stock.update_stock.tooltip")}
        >
          <Button
            isIconOnly
            className="bg-amber-50 text-amber-600 hover:bg-amber-100 min-w-unit-8 w-8 h-8"
            size="sm"
            variant="flat"
            onPress={() => handleOpenChange(true)}
          >
            <Edit size={14} />
          </Button>
        </Tooltip>
      ) : null}

      <Modal
        backdrop="blur"
        classNames={{
          base: "border border-gray-100 shadow-2xl",
          header: "border-b border-gray-50",
          footer: "border-t border-gray-50",
        }}
        isOpen={open}
        placement="center"
        scrollBehavior="outside"
        onOpenChange={handleOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center text-gray-800">
                <PackagePlus className="text-amber-500" size={20} />
                <div className="flex flex-col">
                  <span className="text-small font-black uppercase italic tracking-tight">
                    {t("inventory.stock.update_stock.title")}
                  </span>
                  <span className="text-tiny font-normal text-gray-400 normal-case tracking-normal">
                    {name}
                  </span>
                </div>
              </ModalHeader>

              <ModalBody className="py-6">
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-tiny font-bold text-gray-500 uppercase">
                      {t("inventory.stock.update_stock.current")}
                    </span>
                    <span className="text-large font-black text-gray-800">
                      {Number(currentStock)}
                    </span>
                  </div>

                  <Input
                    classNames={{
                      label:
                        "text-tiny font-bold text-gray-500 uppercase tracking-wider",
                      inputWrapper:
                        "border-gray-200 group-data-[focus=true]:border-gray-800",
                    }}
                    label={t("inventory.stock.update_stock.new")}
                    labelPlacement="outside"
                    placeholder={t("inventory.stock.update_stock.placeholder")}
                    type="number"
                    value={stock.toString()}
                    variant="bordered"
                    onValueChange={(val) => setStock(Number(val))}
                  />
                  <p className="text-[11px] text-gray-400 italic">
                    {t("inventory.stock.update_stock.hint")}
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="font-bold"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  {t("common.cancel")}
                </Button>
                <Button color="primary" isLoading={loading} onPress={onSubmit}>
                  {t("inventory.stock.update_stock.save_changes")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

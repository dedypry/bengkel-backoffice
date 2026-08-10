import type { IProduct } from "@/utils/interfaces/IProduct";

import { PackagePlus } from "lucide-react";
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
} from "@heroui/react";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { formatNumber } from "@/utils/helpers/format";

interface TopPartRestockModalProps {
  product: IProduct | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TopPartRestockModal({
  product,
  open,
  onClose,
  onSuccess,
}: TopPartRestockModalProps) {
  const { t } = useTranslation();
  const [stock, setStock] = useState(0);
  const [productId, setProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product?.id) {
      setProductId(product.id);
      setStock(Number(product.stock ?? 0));
    }
  }, [open, product]);

  function handleClose() {
    setStock(0);
    setProductId(null);
    onClose();
  }

  function onSubmit() {
    if (!productId) return;

    setLoading(true);
    http
      .patch(`/products/update-stock/${productId}`, { stock })
      .then(({ data }) => {
        notify(data.message);
        handleClose();
        onSuccess();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
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
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 text-gray-800">
              <PackagePlus className="text-amber-500" size={20} />
              <div className="flex flex-col">
                <span className="text-small font-black uppercase italic tracking-tight">
                  {t("reports.top_parts.restock_modal_title")}
                </span>
                <span className="text-tiny font-normal normal-case tracking-normal text-gray-400">
                  {product?.name}
                </span>
              </div>
            </ModalHeader>

            <ModalBody className="py-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <span className="text-tiny font-bold uppercase text-gray-500">
                    {t("inventory.stock.update_stock.current")}
                  </span>
                  <span className="text-large font-black text-gray-800">
                    {formatNumber(Number(product?.stock ?? 0))}{" "}
                    <span className="text-xs font-bold uppercase text-gray-400">
                      {product?.uom?.code || product?.unit}
                    </span>
                  </span>
                </div>

                <Input
                  classNames={{
                    label:
                      "text-tiny font-bold uppercase tracking-wider text-gray-500",
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
                <p className="text-[11px] italic text-gray-400">
                  {t("inventory.stock.update_stock.hint")}
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                className="font-bold"
                color="danger"
                variant="light"
                onPress={handleClose}
              >
                {t("common.cancel")}
              </Button>
              <Button
                color="primary"
                isDisabled={!productId}
                isLoading={loading}
                onPress={onSubmit}
              >
                {t("inventory.stock.update_stock.save_changes")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

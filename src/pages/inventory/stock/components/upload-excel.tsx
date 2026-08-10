import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { Download, Info, UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";

import FileUploader from "@/components/drop-zone";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProduct } from "@/stores/features/product/product-action";
import { handleDownloadExcel } from "@/utils/helpers/global";

export default function UploadExcel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { productQuery } = useAppSelector((state) => state.product);

  const dispatch = useAppDispatch();

  function onSubmit() {
    if (!files[0]) {
      notify(t("inventory.stock.select_file_first"), "warning");

      return;
    }

    setIsLoading(true);
    const form = new FormData();

    form.append("file", files[0]);
    http
      .post("/products/import", form)
      .then(({ data }) => {
        notify(data.message);
        setFiles([]);
        setOpen(false);
        dispatch(getProduct(productQuery));
      })
      .catch(notifyError)
      .finally(() => setIsLoading(false));
  }

  function onDownloadTemplate() {
    handleDownloadExcel(
      "/products/import/template",
      undefined,
      "template-produk",
      setIsDownloading,
    );
  }

  return (
    <>
      <Modal isOpen={open} scrollBehavior="outside" onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col">
            <h3 className="text-lg font-black uppercase text-gray-500">
              {t("inventory.stock.upload_title")}
            </h3>
            <p className="text-xs font-semibold text-gray-400">
              {t("inventory.stock.upload_subtitle")}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="flex items-start gap-2 rounded-md bg-warning-50 border border-warning-200 p-3 text-warning-700">
              <Info className="mt-0.5 shrink-0" size={16} />
              <div className="flex-1 text-xs space-y-1">
                <p className="font-semibold">
                  {t("inventory.stock.upload_no_template")}
                </p>
                <p>
                  {t("common.download")}.{" "}
                  {t("inventory.stock.upload_column_format")}.{" "}
                  {t("inventory.stock.upload_sheet_name")}{" "}
                  <span className="font-medium">
                    {t("inventory.stock.upload_sheet_value")}
                  </span>
                  .
                </p>
                <Button
                  className="mt-2"
                  color="warning"
                  isLoading={isDownloading}
                  size="sm"
                  startContent={!isDownloading && <Download size={14} />}
                  variant="flat"
                  onPress={onDownloadTemplate}
                >
                  {t("common.download")} Template
                </Button>
              </div>
            </div>

            <FileUploader
              accept={{
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx", ".xls"],
              }}
              maxFiles={1}
              value={files}
              onFileSelect={(selected) => setFiles(selected)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={isLoading}
              variant="light"
              onPress={() => setOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              color="primary"
              isDisabled={files.length === 0}
              isLoading={isLoading}
              onPress={onSubmit}
            >
              {t("inventory.stock.send_product")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        className="text-white"
        color="success"
        startContent={<UploadCloud className="size-4" />}
        onPress={() => setOpen(true)}
      >
        {t("common.upload_excel")}
      </Button>
    </>
  );
}

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Info, UploadCloud } from "lucide-react";

import FileUploader from "@/components/drop-zone";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { handleDownloadExcel } from "@/utils/helpers/global";

export default function UploadExcelCustomer() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  function onSubmit() {
    setOpen(false);
    setIsLoading(true);
    const form = new FormData();

    form.append("file", files[0]);
    http
      .post("/customers/import-excel", form)
      .then(({ data }) => {
        notify(data.message);
        setFiles([]);
        setOpen(false);
      })
      .catch(notifyError)
      .finally(() => setIsLoading(false));
    setIsLoading(false);
  }

  function onDownloadTemplate() {
    handleDownloadExcel(
      "/customers/import/template",
      undefined,
      "template-customer",
      setIsDownloading,
    );
  }

  return (
    <>
      <Modal isOpen={open} scrollBehavior="outside" onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col">
            <h3 className="text-lg font-black uppercase text-gray-500">
              {t("master.customers.upload_title")}
            </h3>
            <p className="text-xs font-semibold text-gray-400">
              {t("master.customers.upload_subtitle")}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="flex items-start gap-2 rounded-md bg-warning-50 border border-warning-200 p-3 text-warning-700">
              <Info className="mt-0.5 shrink-0" size={16} />
              <div className="flex-1 text-xs">
                <p className="font-semibold">
                  {t("master.customers.upload_no_template")}
                </p>
                <p>{t("master.customers.upload_template_hint")}</p>
                <Button
                  className="mt-2"
                  color="warning"
                  isLoading={isDownloading}
                  size="sm"
                  startContent={!isDownloading && <Download size={14} />}
                  variant="flat"
                  onPress={onDownloadTemplate}
                >
                  {t("master.customers.download_template")}
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
              onFileSelect={setFiles}
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
              {t("common.upload")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        className="text-white"
        color="warning"
        size="sm"
        startContent={<UploadCloud size={15} />}
        onPress={() => setOpen(true)}
      >
        {t("common.upload_excel")}
      </Button>
    </>
  );
}

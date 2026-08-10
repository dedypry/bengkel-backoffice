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
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";
import { handleDownloadExcel } from "@/utils/helpers/global";

export default function UploadExcelService() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { query } = useAppSelector((state) => state.service);
  const dispatch = useAppDispatch();

  function onSubmit() {
    if (!files[0]) {
      notify(t("master.services.select_file_first"), "warning");

      return;
    }

    setIsLoading(true);
    const form = new FormData();

    form.append("file", files[0]);

    http
      .post("/services/import", form)
      .then(({ data }) => {
        notify(data.message);
        setFiles([]);
        setOpen(false);
        dispatch(getService(query));
      })
      .catch(notifyError)
      .finally(() => setIsLoading(false));
  }

  function onDownloadTemplate() {
    handleDownloadExcel(
      "/services/import/template",
      undefined,
      "template-jasa-servis",
      setIsDownloading,
    );
  }

  return (
    <>
      <Modal isOpen={open} scrollBehavior="outside" onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col">
            <h3 className="text-lg font-black uppercase text-gray-500">
              {t("master.services.upload_title")}
            </h3>
            <p className="text-xs font-semibold text-gray-400">
              {t("master.services.upload_subtitle")}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="flex items-start gap-2 rounded-md bg-warning-50 border border-warning-200 p-3 text-warning-700">
              <Info className="mt-0.5 shrink-0" size={16} />
              <div className="flex-1 text-xs space-y-1">
                <p className="font-semibold">
                  {t("master.services.upload_no_template")}
                </p>
                <p>
                  {t("master.services.upload_column_format")}.{" "}
                  {t("master.services.upload_sheet_name")}{" "}
                  <span className="font-medium">
                    {t("master.services.upload_sheet_value")}
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
              {t("common.upload")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        className="text-white"
        color="warning"
        startContent={<UploadCloud size={16} />}
        onPress={() => setOpen(true)}
      >
        {t("common.upload_excel")}
      </Button>
    </>
  );
}

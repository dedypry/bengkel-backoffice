import { Import } from "lucide-react";
import { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

import Modal from "@/components/modal";
import FileUploader from "@/components/drop-zone";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProduct } from "@/stores/features/product/product-action";

export default function ImportProduct() {
  const { t } = useTranslation();
  const { productQuery } = useAppSelector((state) => state.product);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  async function onSubmit() {
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
      .catch((err) => notifyError(err));
  }

  return (
    <>
      <Modal
        footer={
          <Button color="success" onPress={onSubmit}>
            {t("inventory.stock.send_product")}
          </Button>
        }
        open={open}
        title={t("inventory.stock.import_excel")}
        onOpenChange={setOpen}
      >
        <FileUploader
          accept={{
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"],
          }}
          maxFiles={1}
          value={files}
          onFileSelect={(file) => setFiles(file)}
        />
      </Modal>
      <Button
        className="gap-2 bg-green-700 text-white"
        startContent={<Import className="size-4" />}
        variant="bordered"
        onPress={() => setOpen(true)}
      >
        {t("inventory.stock.import_excel")}
      </Button>
    </>
  );
}

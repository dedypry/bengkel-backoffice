import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { UploadCloud } from "lucide-react";

import FileUploader from "@/components/drop-zone";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getProduct } from "@/stores/features/product/product-action";

export default function UploadExcel() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { productQuery } = useAppSelector((state) => state.product);

  const dispatch = useAppDispatch();

  function onSubmit() {
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

  return (
    <>
      <Modal isOpen={open} title="Upload Excel" onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col">
            <h3 className="text-lg font-black uppercase text-gray-500">
              Upload Excel
            </h3>
            <p className="text-xs font-semibold text-gray-400">
              Upload file Excel untuk mengimport data produk.
            </p>
          </ModalHeader>
          <ModalBody>
            <FileUploader
              accept={{
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx", ".xls"],
              }}
              maxFiles={1}
              value={files}
              onFileSelect={function (files: any[]): void {
                console.log(files);
                setFiles(files);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={isLoading}
              variant="light"
              onPress={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button color="primary" isLoading={isLoading} onPress={onSubmit}>
              Kirim Produk
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
        Upload Excel
      </Button>
    </>
  );
}

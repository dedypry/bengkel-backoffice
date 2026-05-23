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

export default function UploadExcelCustomer() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit() {
    setOpen(false);
    setIsLoading(true);
    console.log(files);
    setIsLoading(false);
  }

  return (
    <>
      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Upload Excel Customer</ModalHeader>
          <ModalBody>
            <FileUploader value={files} onFileSelect={setFiles} />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={isLoading}
              onPress={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button color="primary" isLoading={isLoading} onPress={onSubmit}>
              Upload
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
        Upload Excel
      </Button>
    </>
  );
}

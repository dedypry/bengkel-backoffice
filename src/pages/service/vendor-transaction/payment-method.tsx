import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { BanknoteArrowUp } from "lucide-react";
import { useState } from "react";

import { apps } from "@/config/app";

interface Props {
  onSave: (form: any) => void;
}
export default function PaymentMethod({ onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    payment_method: "Cash",
    note: "",
    bank: "",
    bank_Account: "",
  });

  function handleForm(key: string, val: string) {
    setForm((cur: any) => ({ ...cur, [key]: val }));
  }

  return (
    <>
      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Detail Pembayaran</ModalHeader>
          <ModalBody>
            <Select
              label="Cara Pembayaran"
              placeholder="Pilih Metode pembayaran"
              selectedKeys={[form.payment_method]}
              size="sm"
              onChange={(e) => handleForm("payment_method", e.target.value)}
            >
              {apps.payment_methods.map((item) => (
                <SelectItem key={item}>{item}</SelectItem>
              ))}
            </Select>

            {["Transfer", "Cek/BG"].includes(form.payment_method) && (
              <>
                <Autocomplete
                  items={apps.banks}
                  label={
                    form.payment_method == "Transfer"
                      ? "Bank Tujuan"
                      : "Bank Penerbit"
                  }
                  placeholder="Pilih Bank"
                  selectedKey={form.bank}
                  size="sm"
                  onSelectionChange={(val) => handleForm("bank", String(val))}
                >
                  {(item) => (
                    <AutocompleteItem key={item.name}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Input
                  label={
                    form.payment_method == "Transfer" ? "No. Rek" : "No. Cek"
                  }
                  placeholder="Masukan No. Tujuan"
                />
              </>
            )}

            <Textarea
              label="Catatan"
              value={form.note}
              onValueChange={(val) => handleForm("note", val)}
            />
          </ModalBody>
          <ModalFooter>
            <Button size="sm">Batal</Button>
            <Button
              color="primary"
              size="sm"
              onPress={() => {
                onSave(form);
                setOpen(false);
              }}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() => setOpen(true)}
      >
        <BanknoteArrowUp size={18} />
      </Button>
    </>
  );
}

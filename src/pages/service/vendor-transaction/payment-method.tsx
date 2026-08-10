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
import { useTranslation } from "react-i18next";

import { apps } from "@/config/app";

interface Props {
  onSave: (form: any) => void;
}
export default function PaymentMethod({ onSave }: Props) {
  const { t } = useTranslation();
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
      <Modal isOpen={open} scrollBehavior="outside" onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>{t("service.vendor.payment_detail")}</ModalHeader>
          <ModalBody>
            <Select
              label={t("service.vendor.payment_method")}
              placeholder={t("service.vendor.select_payment_method")}
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
                      ? t("service.vendor.target_bank")
                      : t("service.vendor.issuer_bank")
                  }
                  placeholder={t("service.vendor.select_bank")}
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
                    form.payment_method == "Transfer"
                      ? t("service.vendor.account_no")
                      : t("service.vendor.check_no")
                  }
                  placeholder={t("service.vendor.enter_target_no")}
                />
              </>
            )}

            <Textarea
              label={t("service.vendor.notes")}
              value={form.note}
              onValueChange={(val) => handleForm("note", val)}
            />
          </ModalBody>
          <ModalFooter>
            <Button size="sm">{t("common.cancel")}</Button>
            <Button
              color="primary"
              size="sm"
              onPress={() => {
                onSave(form);
                setOpen(false);
              }}
            >
              {t("common.save")}
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

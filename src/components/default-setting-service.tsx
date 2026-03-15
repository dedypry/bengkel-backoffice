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
  useDisclosure,
} from "@heroui/react";
import { Settings, Search } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";

import InputNumber from "./input-number";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { setWoSetting } from "@/stores/features/work-order/wo-slice";
import { getRole } from "@/stores/features/role/role-action";

// Schema Validasi menggunakan Zod
const settingsSchema = z.object({
  mechanic_roles: z.array(z.string()).optional().nullable(),
  service_reg_prefix: z.string().optional(),
  service_pay_prefix: z.string().optional(),
  job_order_prefix: z.string().optional(),
  sales_order_prefix: z.string().optional(),
  sales_inv_prefix: z.string().optional(),
  sales_ret_prefix: z.string().optional(),
  ar_pay_prefix: z.string().optional(),
  default_km_increment: z.coerce.number().min(0),
  default_cash_account_id: z.string().optional().nullable(),
  default_warehouse_id: z.string().optional().nullable(),
  pit_count: z.coerce.number().optional().nullable(),
  default_pic_id: z.coerce.number().optional().nullable(),
  default_advisor_id: z.coerce.number().optional().nullable(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function DefaultSettingService() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { list } = useAppSelector((state) => state.employe);
  const { roles } = useAppSelector((state) => state.role);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  const { control, handleSubmit, reset, setValue } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {},
  });

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getData();
      dispatch(getEmploye({ page: 1, pageSize: 500 }));
      dispatch(getRole());
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, []);

  function getData() {
    http
      .get("/settings")
      .then(({ data }) => {
        reset(data);
        setValue("mechanic_roles", data.mechanic_roles.split(","));
        dispatch(setWoSetting(data));
      })
      .catch(notifyError);
  }

  const onSubmit: SubmitHandler<SettingsForm> = (data: SettingsForm) => {
    setLoading(true);
    http
      .post("/settings", data)
      .then(({ data }) => {
        getData();
        notify(data.message);
        onClose();
      })
      .catch(notifyError)
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="4xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onCloseModal) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-200">
                <h3 className="text-xl font-bold">Pengaturan</h3>
                <p className="text-tiny text-gray-500 font-normal">
                  Servis & Penjualan
                </p>
              </ModalHeader>

              <ModalBody className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* KOLOM KIRI */}
                  <div className="flex flex-col gap-6">
                    <section>
                      <h4 className="text-sm font-bold underline mb-3">
                        Inisial Penomoran Servis
                      </h4>
                      <div className="flex flex-col gap-3">
                        <InputControl
                          control={control}
                          label="Pendaftaran Servis"
                          name="service_reg_prefix"
                        />
                        <InputControl
                          control={control}
                          label="Pembayaran Servis"
                          name="service_pay_prefix"
                        />
                        <InputControl
                          control={control}
                          label="Pembelian Jasa"
                          name="job_order_prefix"
                        />
                      </div>
                    </section>

                    <section>
                      <h4 className="text-sm font-bold underline mb-3">
                        Inisial Penomoran Penj. Direct
                      </h4>
                      <div className="flex flex-col gap-3">
                        <InputControl
                          control={control}
                          label="Order Penjualan"
                          name="sales_order_prefix"
                        />
                        <InputControl
                          control={control}
                          label="Faktur Penjualan"
                          name="sales_inv_prefix"
                        />
                        <InputControl
                          control={control}
                          label="Retur Penjualan"
                          name="sales_ret_prefix"
                        />
                        <InputControl
                          control={control}
                          label="Pembayaran Piutang"
                          name="ar_pay_prefix"
                        />
                      </div>
                    </section>
                  </div>

                  {/* KOLOM KANAN */}
                  <div className="flex flex-col gap-6">
                    <section>
                      <h4 className="text-sm font-bold underline mb-3">
                        Default Value
                      </h4>
                      <div className="flex flex-col gap-3">
                        <InputControl
                          control={control}
                          label="Penambahan Km"
                          name="default_km_increment"
                          type="number"
                        />

                        <div className="flex items-end gap-2">
                          <SelectControl
                            control={control}
                            label="Kas Pembayaran"
                            name="default_cash_account_id"
                            options={[{ id: "1", label: "Kas Bengkel" }]}
                          />
                          <Button isIconOnly size="sm" variant="flat">
                            <Search size={16} />
                          </Button>
                        </div>

                        <div className="flex items-end gap-2">
                          <SelectControl
                            control={control}
                            label="Gudang Stock"
                            name="default_warehouse_id"
                            options={[{ id: "1", label: "GUD. UTAMA" }]}
                          />
                          <Button isIconOnly size="sm" variant="flat">
                            <Search size={16} />
                          </Button>
                        </div>
                        <UserControl
                          control={control}
                          label="PIC Service"
                          name="default_pic_id"
                          options={list?.data}
                        />
                        <UserControl
                          control={control}
                          label="Service Advisor"
                          name="default_advisor_id"
                          options={list?.data}
                        />
                      </div>
                    </section>

                    <section className="mt-4 flex flex-col gap-2">
                      <Controller
                        control={control}
                        name="mechanic_roles"
                        render={({ field }) => (
                          <Select
                            items={roles || []}
                            label="Mekanik Role"
                            labelPlacement="outside-top"
                            selectedKeys={field.value || []}
                            selectionMode="multiple"
                            size="sm"
                            onSelectionChange={(key) => {
                              const val = Array.from(key);

                              field.onChange(val);
                            }}
                          >
                            {(item) => (
                              <SelectItem key={item.slug}>
                                {item.name}
                              </SelectItem>
                            )}
                          </Select>
                        )}
                      />
                      {/* <Button
                        className="w-full justify-start text-xs font-semibold"
                        size="sm"
                        variant="bordered"
                      >
                        Set Target Bengkel
                      </Button>
                      <Button
                        className="w-full justify-start text-xs font-semibold"
                        size="sm"
                        variant="bordered"
                      >
                        Set Diskon Promo
                      </Button> */}
                    </section>

                    <section className="mt-auto">
                      <InputControl
                        control={control}
                        label="Jumlah Pit"
                        name="pit_count"
                        type="number"
                      />
                    </section>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onCloseModal}>
                  Batal
                </Button>
                <Button
                  className="font-bold"
                  color="primary"
                  isLoading={loading}
                  type="submit"
                >
                  Simpan
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      <Button isIconOnly className="min-w-0" variant="light" onPress={onOpen}>
        <Settings size={20} />
      </Button>
    </>
  );
}

/** * Sub-Component Input agar kode lebih bersih
 */
function InputControl({ name, label, control, type = "text" }: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) =>
        type === "text" ? (
          <Input
            {...field}
            className="items-center"
            classNames={{ label: "w-40 text-xs shrink-0", inputWrapper: "h-8" }}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            label={label}
            labelPlacement="outside-left"
            placeholder=" "
            size="sm"
            variant="bordered"
          />
        ) : (
          <InputNumber
            className="items-center"
            classNames={{ label: "w-40 text-xs shrink-0", inputWrapper: "h-8" }}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            label={label}
            labelPlacement="outside-left"
            placeholder=" "
            size="sm"
            value={field.value}
            variant="bordered"
            onInput={field.onChange}
          />
        )
      }
    />
  );
}

/** * Sub-Component Select
 */
function SelectControl({ name, label, control, options }: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          {...field}
          className="items-center"
          classNames={{ label: "w-40 pl-2 text-xs shrink-0" }}
          errorMessage={fieldState.error?.message}
          isInvalid={!!fieldState.error}
          label={label}
          labelPlacement="outside-left"
          size="sm"
          variant="bordered"
        >
          {options.map((opt: any) => (
            <SelectItem key={opt.id} textValue={opt.label}>
              {opt.label}
            </SelectItem>
          ))}
        </Select>
      )}
    />
  );
}
function UserControl({ name, label, control, options }: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Autocomplete
          className="items-center"
          errorMessage={fieldState.error?.message}
          inputProps={{
            classNames: {
              label: "w-40 text-xs shrink-0",
            },
          }}
          isInvalid={!!fieldState.error}
          items={options || []}
          label={label}
          labelPlacement="outside-left"
          selectedKey={String(field.value)}
          size="sm"
          variant="bordered"
          onSelectionChange={field.onChange}
        >
          {(item: any) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}

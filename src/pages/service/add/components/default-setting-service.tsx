import {
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

// Schema Validasi menggunakan Zod
const settingsSchema = z.object({
  pendaftaran_servis: z.string().min(1, "Wajib diisi"),
  pembayaran_servis: z.string().min(1, "Wajib diisi"),
  pembelian_jasa: z.string().min(1, "Wajib diisi"),
  order_penjualan: z.string().min(1, "Wajib diisi"),
  faktur_penjualan: z.string().min(1, "Wajib diisi"),
  retur_penjualan: z.string().min(1, "Wajib diisi"),
  pembayaran_piutang: z.string().min(1, "Wajib diisi"),
  penambahan_km: z.coerce.number().min(0),
  kas_pembayaran: z.string().min(1, "Pilih kas"),
  gudang_stock: z.string().min(1, "Pilih gudang"),
  jumlah_pit: z.coerce.number().min(1, "Minimal 1 pit"),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function DefaultSettingService() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { control, handleSubmit } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      pendaftaran_servis: "PKB.",
      pembayaran_servis: "SRV.",
      pembelian_jasa: "OPL.",
      order_penjualan: "SO.",
      faktur_penjualan: "SI.",
      retur_penjualan: "SR.",
      pembayaran_piutang: "AR.",
      penambahan_km: 7000 as number,
      jumlah_pit: 10 as number,
      kas_pembayaran: "",
      gudang_stock: "",
    },
  });

  const onSubmit: SubmitHandler<SettingsForm> = (data: SettingsForm) => {
    console.log("Saved Data:", data);
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
                          name="pendaftaran_servis"
                        />
                        <InputControl
                          control={control}
                          label="Pembayaran Servis"
                          name="pembayaran_servis"
                        />
                        <InputControl
                          control={control}
                          label="Pembelian Jasa"
                          name="pembelian_jasa"
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
                          name="order_penjualan"
                        />
                        <InputControl
                          control={control}
                          label="Faktur Penjualan"
                          name="faktur_penjualan"
                        />
                        <InputControl
                          control={control}
                          label="Retur Penjualan"
                          name="retur_penjualan"
                        />
                        <InputControl
                          control={control}
                          label="Pembayaran Piutang"
                          name="pembayaran_piutang"
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
                          name="penambahan_km"
                          type="number"
                        />

                        <div className="flex items-end gap-2">
                          <SelectControl
                            control={control}
                            label="Kas Pembayaran"
                            name="kas_pembayaran"
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
                            name="gudang_stock"
                            options={[{ id: "1", label: "GUD. UTAMA" }]}
                          />
                          <Button isIconOnly size="sm" variant="flat">
                            <Search size={16} />
                          </Button>
                        </div>
                      </div>
                    </section>

                    <section className="mt-4 flex flex-col gap-2">
                      <Button
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
                      </Button>
                    </section>

                    <section className="mt-auto">
                      <InputControl
                        control={control}
                        label="Jumlah Pit"
                        name="jumlah_pit"
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
                <Button className="font-bold" color="primary" type="submit">
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
      render={({ field, fieldState }) => (
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
          type={type}
          variant="bordered"
        />
      )}
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
          classNames={{ label: "w-40 text-xs shrink-0", trigger: "h-8" }}
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

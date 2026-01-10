import type { IPromo } from "@/utils/interfaces/IPromo";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@mui/joy";
import { TicketPercent } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/modal";
import InputNumber from "@/components/ui/input-number";
import { DatePicker } from "@/components/date-picker";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export const promoSchema = z.object({
  name: z.string().min(3, "Nama promo minimal 3 karakter"),
  code: z.string().min(3, "Kode promo minimal 3 karakter").toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().min(1, "Nilai diskon harus diisi"),
  max_discount: z.number().optional(),
  start_date: z.string().min(1, "Tanggal mulai harus diisi"),
  end_date: z.string().min(1, "Tanggal selesai harus diisi"),
  min_purchase: z.number().optional(),
  quota: z.number().optional(),
  description: z.string().optional(),
});

export type PromoFormValues = z.infer<typeof promoSchema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  data?: IPromo;
}
export default function ModalAddPromo({ open, setOpen, data }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PromoFormValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      type: "percentage",
      value: 0,
      name: "",
      code: "",
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset(data as any);
    }
  }, [data]);

  const typeDiscount = watch("type");

  const onSubmit = (data: PromoFormValues) => {
    setLoading(true);
    http
      .post("/promos", data)
      .then(({ data }) => {
        notify(data.message);
        reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => {
        setOpen(false);
        setLoading(false);
      });
  };

  return (
    <>
      <Modal
        description="ini description"
        isLoading={loading}
        open={open}
        size="xl"
        title="Buat Promo Baru"
        onOpenChange={setOpen}
        onSave={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              {/* Nama Promo */}
              <Grid md={8} xs={12}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormControl error={!!errors.name}>
                      <FormLabel>Nama Promo</FormLabel>
                      <Input
                        {...field}
                        placeholder="Contoh: Diskon Member Baru"
                      />
                      {errors.name && (
                        <FormHelperText>{errors.name.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Kode Promo */}
              <Grid md={4} xs={12}>
                <Controller
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <FormControl error={!!errors.code}>
                      <FormLabel>Kode Promo</FormLabel>
                      <Input
                        {...field}
                        placeholder="Masukan Kode Promo"
                        slotProps={{ input: { className: "uppercase" } }}
                        startDecorator={<TicketPercent size={18} />}
                      />
                      {errors.code && (
                        <FormHelperText>{errors.code.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Tipe Diskon */}
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Tipe Diskon</FormLabel>
                      <RadioGroup
                        {...field}
                        orientation="horizontal"
                        sx={{ gap: 3 }}
                      >
                        <Radio label="Persentase (%)" value="percentage" />
                        <Radio label="Nominal (Rp)" value="fixed" />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Nilai Diskon */}
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="value"
                  render={({ field }) => (
                    <FormControl error={!!errors.value}>
                      <FormLabel>Nilai Diskon</FormLabel>
                      <InputNumber
                        {...field}
                        endDecorator={typeDiscount == "fixed" ? "IDR" : "%"}
                        onInput={field.onChange}
                      />
                      {errors.value && (
                        <FormHelperText>{errors.value.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={4} xs={12}>
                <Controller
                  control={control}
                  name="max_discount"
                  render={({ field }) => (
                    <FormControl error={!!errors.value}>
                      <FormLabel>Maksimal Diskon</FormLabel>
                      <InputNumber
                        {...field}
                        placeholder="Masukan Max Diskon"
                        startDecorator="Rp"
                        onInput={field.onChange}
                      />
                      {errors.value && (
                        <FormHelperText>{errors.value.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={4} xs={12}>
                <Controller
                  control={control}
                  name="min_purchase"
                  render={({ field }) => (
                    <FormControl error={!!errors.value}>
                      <FormLabel>Minimal Pembelian</FormLabel>
                      <InputNumber
                        placeholder="Masukan Minimal Pembalian"
                        startDecorator="Rp"
                        {...field}
                        onInput={field.onChange}
                      />
                      {errors.value && (
                        <FormHelperText>{errors.value.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={4} xs={12}>
                <Controller
                  control={control}
                  name="quota"
                  render={({ field }) => (
                    <FormControl error={!!errors.value}>
                      <FormLabel>Kuota</FormLabel>
                      <InputNumber
                        endDecorator="PROMO"
                        placeholder="Masukan Kuota"
                        startDecorator="MAX"
                        {...field}
                        onInput={field.onChange}
                      />
                      {errors.value && (
                        <FormHelperText>{errors.value.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Periode Tanggal */}
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="start_date"
                  render={({ field }) => (
                    <FormControl error={!!errors.start_date}>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <DatePicker
                        setValue={field.onChange}
                        value={new Date(field.value)}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="end_date"
                  render={({ field }) => (
                    <FormControl error={!!errors.end_date}>
                      <FormLabel>Tanggal Berakhir</FormLabel>
                      <DatePicker
                        setValue={field.onChange}
                        value={new Date(field.value)}
                      />
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Deskripsi */}
              <Grid xs={12}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Deskripsi & Ketentuan</FormLabel>
                      <Textarea
                        {...field}
                        minRows={3}
                        placeholder="Masukkan syarat penggunaan promo..."
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

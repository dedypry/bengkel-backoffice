import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Stack,
  Textarea,
  Switch,
  Typography,
} from "@mui/joy";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { supplierSchema, type SupplierFormValues } from "./form-schema";

import Modal from "@/components/modal";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: (data: SupplierFormValues) => void;
}

export default function AddModal({ open, setOpen, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
      address: "",
      npwp: "",
      website: "",
      is_active: true,
    },
  });

  const handleFormSubmit = (data: SupplierFormValues) => {
    onSubmit(data);
    reset();
    setOpen(false);
  };

  return (
    <Modal open={open} title="Tambah Supplier" onOpenChange={setOpen}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            {/* Nama Supplier */}
            <FormControl error={!!errors.name} sx={{ flex: 2 }}>
              <FormLabel>Nama Supplier</FormLabel>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input {...field} placeholder="Contoh: PT. Maju Jaya" />
                )}
              />
              {errors.name && (
                <FormHelperText>{errors.name.message}</FormHelperText>
              )}
            </FormControl>

            {/* Kode Supplier */}
            <FormControl error={!!errors.code} sx={{ flex: 1 }}>
              <FormLabel>Kode</FormLabel>
              <Controller
                control={control}
                name="code"
                render={({ field }) => (
                  <Input {...field} placeholder="SUP-001" />
                )}
              />
              {errors.code && (
                <FormHelperText>{errors.code.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            {/* Phone */}
            <FormControl error={!!errors.phone} sx={{ flex: 1 }}>
              <FormLabel>Telepon</FormLabel>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input {...field} placeholder="0812..." />
                )}
              />
              {errors.phone && (
                <FormHelperText>{errors.phone.message}</FormHelperText>
              )}
            </FormControl>

            {/* Email */}
            <FormControl error={!!errors.email} sx={{ flex: 1 }}>
              <FormLabel>Email</FormLabel>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="vendor@mail.com"
                    type="email"
                  />
                )}
              />
              {errors.email && (
                <FormHelperText>{errors.email.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>

          {/* Alamat */}
          <FormControl error={!!errors.address}>
            <FormLabel>Alamat Lengkap</FormLabel>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Textarea
                  {...field}
                  minRows={2}
                  placeholder="Jl. Industri No. 5..."
                />
              )}
            />
          </FormControl>

          <Stack direction="row" spacing={2}>
            {/* NPWP */}
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>NPWP</FormLabel>
              <Controller
                control={control}
                name="npwp"
                render={({ field }) => (
                  <Input {...field} placeholder="00.000.000.0-000.000" />
                )}
              />
            </FormControl>

            {/* Website */}
            <FormControl error={!!errors.website} sx={{ flex: 1 }}>
              <FormLabel>Website</FormLabel>
              <Controller
                control={control}
                name="website"
                render={({ field }) => (
                  <Input {...field} placeholder="https://..." />
                )}
              />
              {errors.website && (
                <FormHelperText>{errors.website.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>

          {/* Status Switch */}
          <FormControl
            orientation="horizontal"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <FormLabel>Status Aktif</FormLabel>
              <Typography level="body-xs">
                Supplier dapat digunakan dalam transaksi
              </Typography>
            </div>
            <Controller
              control={control}
              name="is_active"
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  color={value ? "success" : "neutral"}
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
            />
          </FormControl>

          {/* Action Buttons */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{ mt: 2 }}
          >
            <Button
              color="neutral"
              variant="plain"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button loading={isSubmitting} type="submit">
              Simpan Supplier
            </Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}

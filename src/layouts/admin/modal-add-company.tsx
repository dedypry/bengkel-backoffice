/* eslint-disable import/order */
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import HeroUI Components
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";

import { uploadFile } from "@/utils/helpers/upload-file";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getProfile } from "@/stores/features/auth/auth-action";
import UploadAvatar from "@/components/upload-avatar";

const companySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nama cabang wajib diisi"),
  logo_url: z.any().optional(),
  email: z.string().email("Format email tidak valid"),
  phone_number: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^[0-9]+$/, "Hanya boleh berisi angka"),
  fax: z.string().optional().or(z.literal("")),
  npwp: z.string().optional().or(z.literal("")),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  initialData?: Partial<CompanyFormValues>;
}

export default function ModalAddCompany({ open, setOpen, initialData }: Props) {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      logo_url: "",
      email: "",
      phone_number: "",
      fax: "",
      npwp: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          name: "",
          logo_url: "",
          email: "",
          phone_number: "",
          fax: "",
          npwp: "",
        },
      );
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: CompanyFormValues) => {
    setLoading(true);
    try {
      if (data.logo_url instanceof File) {
        const logo = await uploadFile(data.logo_url);

        data.logo_url = logo;
      }

      const response = await http.post("/companies", data);

      notify(response.data.message);
      setOpen(false);
      dispatch(getProfile());
      reset();
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      scrollBehavior="outside"
      size="lg"
      onOpenChange={setOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {initialData?.id ? "Ubah Cabang" : "Tambah Cabang Baru"}
            </ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-4"
                id="company-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Logo Upload */}
                <Controller
                  control={control}
                  name="logo_url"
                  render={({ field: { value, onChange, ...field } }) => (
                    <div className="flex flex-col gap-2">
                      <UploadAvatar
                        buttonTitle="Upload Logo"
                        field={field}
                        isInvalid={!!errors.logo_url}
                        value={value}
                        onChange={onChange}
                      />
                      {errors.logo_url && (
                        <span className="text-tiny text-danger">
                          {String(errors.logo_url.message)}
                        </span>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label="Nama Cabang"
                      labelPlacement="outside"
                      placeholder="Contoh: Cabang Jakarta Pusat"
                      variant="bordered"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.email?.message}
                      isInvalid={!!errors.email}
                      label="Email"
                      labelPlacement="outside"
                      placeholder="admin@cabang.com"
                      variant="bordered"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.phone_number?.message}
                      isInvalid={!!errors.phone_number}
                      label="Telepon"
                      labelPlacement="outside"
                      placeholder="0888..."
                      variant="bordered"
                    />
                  )}
                />

                <div className="flex gap-4">
                  <Controller
                    control={control}
                    name="npwp"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.npwp?.message}
                        isInvalid={!!errors.npwp}
                        label="NPWP"
                        labelPlacement="outside"
                        placeholder="NPWP Perusahaan"
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="fax"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.fax?.message}
                        isInvalid={!!errors.fax}
                        label="Fax"
                        labelPlacement="outside"
                        placeholder="Nomor Fax"
                        variant="bordered"
                      />
                    )}
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Batal
              </Button>
              <Button
                color="primary"
                form="company-form"
                isLoading={isLoading}
                type="submit"
              >
                {initialData?.id ? "Simpan Perubahan" : "Simpan Cabang"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Stack,
  Typography,
  Grid,
  Textarea,
  Select,
  Option,
} from "@mui/joy";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocationEdit, Save, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { formSchema } from "./schemas/create-schema"; // Import schema Zod yang tadi kita buat

import UploadAvatar from "@/components/upload-avatar";
import Province from "@/components/regions/province";
import { DatePicker } from "@/components/date-picker";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { uploadFile } from "@/utils/helpers/upload-file";
import { PhoneMask } from "@/utils/mask/mask";
import { getProfile } from "@/stores/features/auth/auth-action";

export default function EditProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      place_birth: "",
      birth_date: "",
      address: "",
      province_id: 0,
      city_id: 0,
      district_id: 0,
      emergency_name: "",
      emergency_contact: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.profile?.phone_number || "");
      setValue("gender", user.profile?.gender || "");
      setValue("place_birth", user.profile?.place_birth || "");
      setValue("birth_date", user.profile?.birth_date || "");
      setValue("province_id", user.profile?.province_id!);
      setValue("city_id", user.profile?.city_id!);
      setValue("district_id", user.profile?.district_id!);
      setValue("address", user.profile?.address!);
      setValue("emergency_name", user.profile?.emergency_name!);
      setValue("emergency_contact", user.profile?.emergency_contact!);
      setValue("photo", user.profile?.photo_url!);
    }
  }, [user]);

  const onSubmit = async (data: any) => {
    setLoading(true);

    if (data.photo && data.photo instanceof File) {
      const photo = await uploadFile(data.photo);

      setValue("photo", photo);
      data.photo = photo;
    }
    http
      .post("/user/profile", data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getProfile());
        navigate("/my-profile/");
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          {/* Section 1: Avatar & Basic Info */}
          <Card sx={{ p: 4 }}>
            <Typography level="title-lg" startDecorator={<User2 />}>
              Informasi Pribadi
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Controller
              control={control}
              name="photo"
              render={({ field }) => (
                <UploadAvatar value={field.value} onChange={field.onChange} />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FormControl error={!!errors.name}>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <Input {...field} placeholder="Masukkan nama sesuai KTP" />
                    {errors.name && (
                      <FormHelperText>{errors.name.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormControl error={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      {...field}
                      placeholder="email@contoh.com"
                      type="email"
                    />
                    {errors.email?.message && (
                      <FormHelperText>{errors.email?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormControl error={!!errors.phone}>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <Input
                      slotProps={{ input: { component: PhoneMask } }}
                      {...field}
                      placeholder="0812..."
                    />
                    {errors.phone?.message && (
                      <FormHelperText>{errors.phone?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <FormControl error={!!errors.gender}>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      placeholder="Masukan Jenis Kelamin"
                      value={field.value}
                      onChange={(_, val) => field.onChange(val)}
                    >
                      <Option value="male">Laki-laki</Option>
                      <Option value="female">Perempuan</Option>
                    </Select>
                    {errors.gender?.message && (
                      <FormHelperText>{errors.gender?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="place_birth"
                render={({ field }) => (
                  <FormControl error={!!errors.place_birth}>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <Input {...field} placeholder="Masukan Tempat lahir" />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="birth_date"
                render={({ field }) => (
                  <FormControl error={!!errors.birth_date}>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <DatePicker
                      setValue={field.onChange}
                      value={new Date(field.value)}
                    />
                  </FormControl>
                )}
              />
            </div>
          </Card>

          <Card sx={{ p: 4 }}>
            <Typography level="title-lg" startDecorator={<LocationEdit />}>
              Alamat & Kontak Darurat
            </Typography>
            <Divider sx={{ my: 2 }} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                control={control}
                name="province_id"
                render={({ field }) => (
                  <FormControl error={!!errors.province_id}>
                    <FormLabel>Provinsi</FormLabel>
                    <Province value={field.value} onChange={field.onChange} />
                    {errors.province_id?.message && (
                      <FormHelperText>
                        {errors.province_id?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="city_id"
                render={({ field }) => (
                  <FormControl error={!!errors.city_id}>
                    <FormLabel>Kota</FormLabel>
                    <Province value={field.value} onChange={field.onChange} />
                    {errors.city_id?.message && (
                      <FormHelperText>{errors.city_id?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="district_id"
                render={({ field }) => (
                  <FormControl error={!!errors.district_id}>
                    <FormLabel>Kecamatan</FormLabel>
                    <Province value={field.value} onChange={field.onChange} />
                    {errors.district_id?.message && (
                      <FormHelperText>
                        {errors.district_id?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <FormControl error={!!errors.address}>
                    <FormLabel>Alamat Lengkap</FormLabel>
                    <Textarea
                      {...field}
                      minRows={3}
                      placeholder="Nama jalan, nomor rumah, RT/RW..."
                    />
                    {errors.address?.message && (
                      <FormHelperText>{errors.address?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Grid container spacing={2}>
                <Grid sm={6} xs={12}>
                  <Controller
                    control={control}
                    name="emergency_name"
                    render={({ field: { value, ...rest } }) => (
                      <FormControl error={!!errors.emergency_name}>
                        <FormLabel>Nama Kontak Darurat</FormLabel>
                        <Input
                          {...rest}
                          placeholder="Nama kerabat"
                          value={value ?? ""}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid sm={6} xs={12}>
                  <Controller
                    control={control}
                    name="emergency_contact"
                    render={({ field: { value, ...rest } }) => (
                      <FormControl error={!!errors.emergency_contact}>
                        <FormLabel>Nomor Kontak Darurat</FormLabel>
                        <Input
                          {...rest}
                          placeholder="08..."
                          slotProps={{ input: { component: PhoneMask } }}
                          value={value ?? ""}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Card>

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pb: 5 }}
          >
            <Button color="neutral" variant="plain">
              Batal
            </Button>
            <Button
              loading={loading}
              startDecorator={<Save />}
              onClick={handleSubmit(onSubmit)}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}

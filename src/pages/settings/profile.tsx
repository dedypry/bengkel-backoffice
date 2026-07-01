import {
  Store,
  Tag,
  Save,
  Percent,
  Settings,
  Mail,
  MapPin,
  Wrench,
  Building2,
  Phone,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Switch,
  Card,
  CardBody,
  Divider,
  Select,
  SelectItem,
  Textarea,
  Tab,
  Tabs,
  Chip,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import ProfileOperationsFields from "./components/profile-operations-fields";
import {
  parseNextServiceNotes,
} from "@/utils/helpers/next-service-notes";
import {
  companySchema,
  type CompanyFormValues,
} from "./schemas/profile-schema";
import {
  operationsDefaults,
  operationsSchema,
  type OperationsFormValues,
} from "./schemas/operations-schema";

import HeaderAction from "@/components/header-action";
import UploadAvatar from "@/components/upload-avatar";
import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import { http } from "@/utils/libs/axios";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { notify, notifyError } from "@/utils/helpers/notify";
import { uploadFile } from "@/utils/helpers/upload-file";
import { getCity, getDistrict } from "@/stores/features/region/region-action";
import { getProfile } from "@/stores/features/auth/auth-action";
import { getSettings } from "@/stores/features/setting/setting-slice";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { getRole } from "@/stores/features/role/role-action";
import { getWarehouse } from "@/stores/features/warehouse/warehouse-action";
import PhoneInput from "@/components/forms/phone-input";
import NpwpInput from "@/components/forms/npwp-input";
import InputNumber from "@/components/input-number";

function mapSettingsToForm(settings: Record<string, unknown>): OperationsFormValues {
  return {
    ...operationsDefaults,
    service_reg_prefix: String(settings.service_reg_prefix ?? operationsDefaults.service_reg_prefix),
    service_pay_prefix: String(settings.service_pay_prefix ?? operationsDefaults.service_pay_prefix),
    job_order_prefix: String(settings.job_order_prefix ?? operationsDefaults.job_order_prefix),
    sales_order_prefix: String(settings.sales_order_prefix ?? operationsDefaults.sales_order_prefix),
    sales_inv_prefix: String(settings.sales_inv_prefix ?? operationsDefaults.sales_inv_prefix),
    sales_ret_prefix: String(settings.sales_ret_prefix ?? operationsDefaults.sales_ret_prefix),
    ar_pay_prefix: String(settings.ar_pay_prefix ?? operationsDefaults.ar_pay_prefix),
    default_km_increment: Number(settings.default_km_increment ?? operationsDefaults.default_km_increment),
    default_cash_account_id: settings.default_cash_account_id
      ? Number(settings.default_cash_account_id)
      : null,
    default_warehouse_id: settings.default_warehouse_id
      ? Number(settings.default_warehouse_id)
      : null,
    pit_count: Number(settings.pit_count ?? operationsDefaults.pit_count),
    default_pic_id: settings.default_pic_id ? Number(settings.default_pic_id) : null,
    default_advisor_id: settings.default_advisor_id
      ? Number(settings.default_advisor_id)
      : null,
    mechanic_roles: settings.mechanic_roles
      ? String(settings.mechanic_roles).split(",").filter(Boolean)
      : [],
    notes_service: String(settings.notes_service ?? ""),
    notes_sales: String(settings.notes_sales ?? ""),
    next_service_notes: parseNextServiceNotes(settings.next_service_notes),
  };
}

export default function ProfileSettingsPage() {
  const { company } = useAppSelector((state) => state.auth);
  const { settings } = useAppSelector((state) => state.setting);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      logo_url: "",
      email: "",
      phone_number: "",
      fax: "",
      npwp: "",
      is_ppn: false,
      is_discount_birth_day: false,
      type_discount_birth_day: "percentage",
      max_discount_birth_day: 0,
      address: {},
    },
  });

  const operationsForm = useForm<OperationsFormValues>({
    resolver: zodResolver(operationsSchema),
    defaultValues: operationsDefaults,
  });

  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = companyForm;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getSettings());
      dispatch(getEmploye({ page: 1, pageSize: 500 }));
      dispatch(getRole());
      dispatch(getWarehouse({ page: 1, pageSize: 100 }));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      setValue("id", company.id);
      setValue("name", company.name);
      setValue("logo_url", company.logo_url);
      setValue("email", company.email!);
      setValue("phone_number", company.phone_number?.replace(/-/g, "") || "");
      setValue("fax", company.fax || "");
      setValue("npwp", company.npwp!);
      setValue("is_ppn", company.is_ppn!);
      setValue("ppn", Number(company.ppn || 0));
      setValue("is_discount_birth_day", company.is_discount_birth_day!);
      setValue(
        "type_discount_birth_day",
        company.type_discount_birth_day || "percentage",
      );
      setValue(
        "max_discount_birth_day",
        Number(company.max_discount_birth_day || 0),
      );
      setValue(
        "total_discount_birth_day",
        Number(company.total_discount_birth_day || 0),
      );
      if (company.address) {
        setValue("address.title", company.address?.title || "");
        setValue(
          "address.province_id",
          company.address?.province_id || undefined,
        );
        setValue("address.city_id", company.address?.city_id || undefined);
        setValue(
          "address.district_id",
          company.address?.district_id || undefined,
        );
        if (company.address.province_id)
          dispatch(getCity(company.address.province_id));
        if (company.address.city_id)
          dispatch(getDistrict(company.address.city_id));
      }
    }
  }, [company, dispatch, setValue]);

  useEffect(() => {
    if (settings) {
      operationsForm.reset(mapSettingsToForm(settings as Record<string, unknown>));
    }
  }, [settings, operationsForm]);

  const handleSaveAll = async () => {
    const [companyValid, operationsValid] = await Promise.all([
      companyForm.trigger(),
      operationsForm.trigger(),
    ]);

    if (!companyValid || !operationsValid) {
      notifyError("Lengkapi data yang wajib diisi sebelum menyimpan.");
      return;
    }

    setLoading(true);
    try {
      const companyData = companyForm.getValues();
      const operationsData = operationsForm.getValues();

      if (companyData.logo_url instanceof File) {
        companyData.logo_url = await uploadFile(companyData.logo_url);
      }

      await Promise.all([
        http.patch("/companies", companyData),
        http.post("/settings", {
          ...operationsData,
          mechanic_roles: operationsData.mechanic_roles || [],
          next_service_notes: operationsData.next_service_notes || [],
        }),
      ]);

      notify("Pengaturan bengkel berhasil disimpan");
      dispatch(getProfile());
      dispatch(getSettings());
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <HeaderAction
        actionContent={
          <Button
            color="primary"
            isLoading={loading}
            startContent={<Save size={18} />}
            onPress={() => void handleSaveAll()}
          >
            Simpan Semua Pengaturan
          </Button>
        }
        leadIcon={Settings}
        subtitle="Kelola identitas bengkel, kebijakan keuangan, dan konfigurasi operasional."
        title="Pengaturan Bengkel"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border border-sky-100 bg-sky-50/60 shadow-sm" shadow="none">
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <Building2 className="text-sky-600" size={20} />
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500">
                Bengkel
              </p>
              <p className="text-sm font-black text-gray-700 truncate">
                {company?.name || "-"}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="border border-emerald-100 bg-emerald-50/60 shadow-sm" shadow="none">
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <Percent className="text-emerald-600" size={20} />
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500">
                PPN
              </p>
              <p className="text-sm font-black text-gray-700">
                {watch("is_ppn") ? `${watch("ppn") || 0}%` : "Nonaktif"}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="border border-violet-100 bg-violet-50/60 shadow-sm" shadow="none">
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <Wrench className="text-violet-600" size={20} />
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-500">
                Pit Servis
              </p>
              <p className="text-sm font-black text-gray-700">
                {operationsForm.watch("pit_count") || 0} unit
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm" shadow="none">
        <CardBody className="p-4 md:p-6">
          <Tabs
            aria-label="Pengaturan bengkel"
            selectedKey={activeTab}
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full border-b border-gray-100",
              tab: "h-11 font-bold uppercase text-xs",
              panel: "pt-6",
            }}
            onSelectionChange={(key) => setActiveTab(String(key))}
          >
            <Tab
              key="profile"
              title={
                <div className="flex items-center gap-2">
                  <Store size={16} />
                  <span>Profil & Kontak</span>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="rounded-xl bg-white p-3 text-gray-600 shadow-sm">
                      <Store size={20} />
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-gray-600 text-sm">
                        Identitas Bengkel
                      </h3>
                      <p className="text-xs text-gray-500">
                        Informasi ini tercetak pada invoice dan dokumen resmi.
                      </p>
                    </div>
                  </div>

                  <Controller
                    control={control}
                    name="logo_url"
                    render={({ field }) => (
                      <UploadAvatar
                        buttonTitle="Ganti Logo Bengkel"
                        field={field}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          errorMessage={errors.name?.message}
                          isInvalid={!!errors.name}
                          label="Nama Cabang / Bengkel"
                          placeholder="Bengkel Maju Jaya"
                          variant="bordered"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="phone_number"
                      render={({ field }) => (
                        <PhoneInput
                          errorMessage={errors.phone_number?.message}
                          isInvalid={!!errors.phone_number}
                          label="Nomor Telepon"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="fax"
                      render={({ field }) => (
                        <PhoneInput
                          errorMessage={errors.fax?.message}
                          isInvalid={!!errors.fax}
                          label="Nomor Fax"
                          placeholder="021xxxxxxx"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Email Operasional"
                          placeholder="admin@bengkel.com"
                          startContent={
                            <Mail className="text-gray-400" size={16} />
                          }
                          type="email"
                          variant="bordered"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="npwp"
                      render={({ field }) => (
                        <NpwpInput {...field} label="NPWP Perusahaan" />
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-500" size={18} />
                    <span className="text-sm font-black uppercase text-gray-600">
                      Lokasi & Alamat
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      control={control}
                      name="address.province_id"
                      render={({ field }) => (
                        <Province
                          value={field.value!}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="address.city_id"
                      render={({ field }) => (
                        <City value={field.value!} onChange={field.onChange} />
                      )}
                    />
                    <Controller
                      control={control}
                      name="address.district_id"
                      render={({ field }) => (
                        <District
                          value={field.value!}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="address.title"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label="Alamat Lengkap"
                        minRows={3}
                        placeholder="Jl. Raya Otomotif No. 10..."
                        variant="bordered"
                      />
                    )}
                  />
                </div>
              </div>
            </Tab>

            <Tab
              key="finance"
              title={
                <div className="flex items-center gap-2">
                  <Percent size={16} />
                  <span>Keuangan & Promo</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-2 text-emerald-600">
                        <Percent size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-gray-600">
                          Pajak PPN
                        </p>
                        <p className="text-xs text-gray-500">
                          Otomatis dihitung pada transaksi
                        </p>
                      </div>
                    </div>
                    <Controller
                      control={control}
                      name="is_ppn"
                      render={({ field }) => (
                        <Switch
                          color="success"
                          isSelected={field.value}
                          onValueChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="ppn"
                    render={({ field }) => (
                      <InputNumber
                        {...(field as any)}
                        disabled={!watch("is_ppn")}
                        endContent={
                          <span className="text-gray-400 text-xs">%</span>
                        }
                        label="Besaran PPN"
                        placeholder="11"
                      />
                    )}
                  />
                </div>

                <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-2 text-rose-500">
                        <Tag size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-gray-600">
                          Promo Ultah
                        </p>
                        <p className="text-xs text-gray-500">
                          Diskon otomatis di kasir
                        </p>
                      </div>
                    </div>
                    <Controller
                      control={control}
                      name="is_discount_birth_day"
                      render={({ field }) => (
                        <Switch
                          color="danger"
                          isSelected={field.value}
                          onValueChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex gap-2 items-end">
                    <Controller
                      control={control}
                      name="total_discount_birth_day"
                      render={({ field }) => (
                        <InputNumber
                          className="flex-1"
                          isDisabled={!watch("is_discount_birth_day")}
                          label="Nilai Promo"
                          placeholder="0"
                          value={field.value as number}
                          onInput={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="type_discount_birth_day"
                      render={({ field }) => (
                        <Select
                          aria-label="Tipe Diskon"
                          className="w-24"
                          isDisabled={!watch("is_discount_birth_day")}
                          selectedKeys={field.value ? [field.value] : []}
                          onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as string;
                            field.onChange(value);
                          }}
                        >
                          <SelectItem key="percentage">%</SelectItem>
                          <SelectItem key="fixed">Rp</SelectItem>
                        </Select>
                      )}
                    />
                  </div>

                  {watch("type_discount_birth_day") === "percentage" && (
                    <Controller
                      control={control}
                      name="max_discount_birth_day"
                      render={({ field }) => (
                        <InputNumber
                          isDisabled={!watch("is_discount_birth_day")}
                          label="Maksimal Potongan"
                          placeholder="50000"
                          startContent={
                            <span className="text-gray-400 text-xs">Rp</span>
                          }
                          value={field.value as number}
                          onInput={field.onChange}
                        />
                      )}
                    />
                  )}

                  <Chip className="text-[10px]" color="warning" variant="flat">
                    Otomatis muncul di kasir saat pelanggan berulang tahun
                  </Chip>
                </div>
              </div>
            </Tab>

            <Tab
              key="operations"
              title={
                <div className="flex items-center gap-2">
                  <Wrench size={16} />
                  <span>Operasional</span>
                </div>
              }
            >
              <ProfileOperationsFields control={operationsForm.control} />
            </Tab>
          </Tabs>

          <Divider className="my-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <Phone size={14} />
              Perubahan profil dan operasional disimpan sekaligus
            </p>
            <Button
              color="primary"
              isLoading={loading}
              startContent={<Save size={18} />}
              onPress={() => void handleSaveAll()}
            >
              Simpan Semua Pengaturan
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

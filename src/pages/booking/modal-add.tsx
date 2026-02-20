import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { CalendarDays, Building, Clock, Toolbox, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BookingFormValues, bookingSchema } from "./schema";

import { http } from "@/utils/libs/axios";
import CustomDatePicker from "@/components/forms/date-picker";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatTime, getAvatarByName } from "@/utils/helpers/global";
import { getCustomer } from "@/stores/features/customer/customer-action";
import { ICustomer, IVehicle } from "@/utils/interfaces/IUser";
import { getBooking } from "@/stores/features/booking/booking-action";
import { IBooking } from "@/utils/interfaces/IBooking";

interface BookingModalProps {
  data?: IBooking;
  isOpen: boolean;
  setOpen: (val: boolean) => void;
}
export default function ModalAdd({ isOpen, setOpen, data }: BookingModalProps) {
  const { bookingQuery } = useAppSelector((state) => state.booking);
  const { user, company } = useAppSelector((state) => state.auth);
  const { customers: cust } = useAppSelector((state) => state.customer);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const customers = (cust || []) as ICustomer[];

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(
        getCustomer({
          noStats: true,
          noPagination: true,
          isVehicle: true,
        }),
      );
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      booking_time: "08:00",
      booking_date: dayjs().add(1, "day").toISOString(),
    },
  });

  useEffect(() => {
    if (data) {
      const customerSelect = customers.find((e) => e.id === data.customer_id);

      if (customerSelect) {
        setVehicles(customerSelect.vehicles || []);
      }
      setValue("id", data.id);
      setValue("customer_id", data.customer_id.toString());
      setValue("vehicle_id", data.vehicle_id.toString());
      setValue("branch_id", data.branch_id?.toString() || "");
      setValue("booking_date", data.booking_date);
      setValue("booking_time", formatTime(data.booking_time));
      setValue("service_type", data.service_type);
      setValue("complaint", data.complaint || "");
      console.log(watch(), data);
    }
  }, [data]);

  const onSubmit = async (data: BookingFormValues) => {
    setLoading(true);
    http
      .post("/bookings", data)
      .then(({ data }) => {
        notify(data.message);
        reset();
        setOpen(false);
        dispatch(getBooking(bookingQuery));
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      scrollBehavior="outside"
      size="2xl"
      onOpenChange={setOpen}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-danger/10 text-danger rounded-lg">
                  <CalendarDays size={20} />
                </div>
                <span>Buat Janji Temu Servis</span>
              </div>
            </ModalHeader>

            <ModalBody>
              <div className="space-y-6 py-2">
                {/* Pilih Kendaraan */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="customer_id"
                    render={({ field }) => (
                      <Autocomplete
                        allowsCustomValue
                        defaultItems={customers || []}
                        label="Nama Pelanggan"
                        labelPlacement="outside"
                        placeholder="Cari nama pelanggan..."
                        selectedKey={field.value}
                        startContent={<Users />}
                        variant="bordered"
                        onClear={() => {
                          setValue("vehicle_id", "");
                        }}
                        onInputChange={(val) => {
                          if (!val) {
                            setValue("vehicle_id", "");
                            setVehicles([]);
                          }
                        }}
                        onSelectionChange={(key) => {
                          field.onChange(key);

                          const selectedCustomer = customers.find(
                            (c) => String(c.id) === String(key),
                          );

                          if (selectedCustomer) {
                            setVehicles(selectedCustomer.vehicles || []);
                            if (
                              selectedCustomer.vehicles &&
                              selectedCustomer.vehicles.length > 0
                            ) {
                              setValue(
                                "vehicle_id",
                                String(selectedCustomer.vehicles[0].id),
                              );
                            }
                          }
                        }}
                      >
                        {(item) => (
                          <AutocompleteItem
                            key={item.id}
                            className="capitalize"
                            textValue={item.name}
                          >
                            <div className="flex gap-3 items-center">
                              <Avatar
                                alt={item.name}
                                className="flex-shrink-0"
                                size="sm"
                                src={
                                  item.profile?.photo_url ||
                                  `https://ui-avatars.com/api/?name=${item.name}&background=random`
                                }
                              />
                              <div className="flex flex-col">
                                <span className="text-small font-bold">
                                  {item.name}
                                </span>
                                <span className="text-tiny text-gray-500">
                                  {item.phone || "Tidak ada nomor"}
                                </span>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                  <Controller
                    control={control}
                    name="vehicle_id"
                    render={({ field }) => (
                      <Autocomplete
                        allowsCustomValue
                        defaultItems={vehicles || []}
                        label="No. Polisi (Nopol)"
                        labelPlacement="outside"
                        placeholder="Cari Kendaraan..."
                        selectedKey={field.value}
                        startContent={<Users />}
                        variant="bordered"
                        onSelectionChange={field.onChange}
                      >
                        {(item) => (
                          <AutocompleteItem
                            key={item.id}
                            textValue={item.plate_number}
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-small uppercase">
                                {item.plate_number}
                              </span>
                              <span className="text-tiny">
                                {item.brand} {item.model} ({item.year})
                              </span>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                  <Controller
                    control={control}
                    name="branch_id"
                    render={({ field }) => (
                      <Select
                        {...field}
                        errorMessage={errors.branch_id?.message}
                        isInvalid={!!errors.branch_id}
                        label="Cabang"
                        labelPlacement="outside"
                        placeholder="Pilih Cabang Terdekat"
                        selectedKeys={[field.value]}
                        startContent={
                          <Building className="text-default-400" size={18} />
                        }
                        variant="bordered"
                      >
                        {(user?.companies || []).map((v) => (
                          <SelectItem key={v.id.toString()} textValue={v.name}>
                            <div className="flex gap-2 items-center">
                              <Avatar
                                alt={v.name}
                                className="shrink-0"
                                size="sm"
                                src={v.logo_url || getAvatarByName(v.name)}
                              />
                              <div className="flex flex-col">
                                <span className="text-small">{v.name}</span>
                                <span className="text-tiny text-gray-400">
                                  {v.address?.title || v.phone_number}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name="booking_date"
                    render={({ field }) => (
                      <CustomDatePicker
                        errorMessage={errors.booking_date?.message}
                        isInvalid={!!errors.booking_date}
                        label="Tanggal Kedatangan"
                        labelPlacement="outside"
                        // minDate={
                        //   today(getLocalTimeZone()).add({ days: 1 }) as any
                        // }
                        value={field?.value as any}
                        variant="bordered"
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="booking_time"
                    render={({ field }) => (
                      <Select
                        {...field}
                        errorMessage={errors.booking_time?.message}
                        isInvalid={!!errors.booking_time}
                        label="Jam"
                        labelPlacement="outside"
                        placeholder="Pilih Slot"
                        selectedKeys={[field.value]}
                        startContent={
                          <Clock className="text-default-400" size={18} />
                        }
                        variant="bordered"
                      >
                        <SelectItem key="08:00">08:00 WIB</SelectItem>
                        <SelectItem key="10:00">10:00 WIB</SelectItem>
                        <SelectItem key="13:00">13:00 WIB</SelectItem>
                        <SelectItem key="15:00">15:00 WIB</SelectItem>
                      </Select>
                    )}
                  />
                </div>

                <Divider className="mb-10" />

                <Controller
                  control={control}
                  name="service_type"
                  render={({ field }) => (
                    <Select
                      {...field}
                      errorMessage={errors.service_type?.message}
                      isInvalid={!!errors.service_type}
                      label="Kategori Servis"
                      labelPlacement="outside"
                      placeholder="Pilih tipe servis"
                      selectedKeys={[field.value]}
                      startContent={
                        <Toolbox className="text-default-400" size={18} />
                      }
                      variant="bordered"
                    >
                      <SelectItem key="Ganti Oli">Ganti Oli</SelectItem>
                      <SelectItem key="Service Berkala">
                        Service Berkala
                      </SelectItem>
                      <SelectItem key="General Repair">
                        Perbaikan Umum
                      </SelectItem>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="complaint"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      errorMessage={errors.complaint?.message}
                      isInvalid={!!errors.complaint}
                      label="Keluhan / Catatan"
                      labelPlacement="outside"
                      placeholder="Ceritakan keluhan kendaraan Anda..."
                      variant="bordered"
                    />
                  )}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button isLoading={loading} variant="flat" onPress={onClose}>
                Batal
              </Button>
              <Button
                className="font-bold px-6"
                color="primary"
                isLoading={loading}
                type="submit"
              >
                Konfirmasi Booking
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

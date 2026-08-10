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
import { CalendarDays, Clock, Toolbox, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import CustomerFormPage from "../master/customers/create";

import { BookingFormValues } from "./schema";

import { http } from "@/utils/libs/axios";
import CustomDatePicker from "@/components/forms/date-picker";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatTime } from "@/utils/helpers/global";
import { getCustomer } from "@/stores/features/customer/customer-action";
import { ICustomer } from "@/utils/interfaces/IUser";
import { getBooking } from "@/stores/features/booking/booking-action";
import { IBooking } from "@/utils/interfaces/IBooking";
import { getVehicle } from "@/stores/features/vehicle/vehicle-action";

interface BookingModalProps {
  data?: IBooking;
  isOpen: boolean;
  setOpen: (val: boolean) => void;
}

const SERVICE_TYPE_KEYS = [
  { key: "Ganti Oli", labelKey: "booking.modal.service_types.oil_change" },
  { key: "Service Berkala", labelKey: "booking.modal.service_types.periodic" },
  { key: "General Repair", labelKey: "booking.modal.service_types.general" },
  { key: "Body Repair", labelKey: "booking.modal.service_types.body" },
] as const;

const TIME_SLOTS = ["08:00", "10:00", "13:00", "15:00"] as const;

export default function ModalAdd({ isOpen, setOpen, data }: BookingModalProps) {
  const { t } = useTranslation();
  const { bookingQuery } = useAppSelector((state) => state.booking);
  const { vehicles: dataVehicles } = useAppSelector((state) => state.vehicle);
  const { company } = useAppSelector((state) => state.auth);
  const { customers: cust } = useAppSelector((state) => state.customer);
  const [loading, setLoading] = useState(false);
  const [isAddCustomer, setIsAddCustomer] = useState(false);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const customers = (cust || []) as ICustomer[];

  const bookingSchema = useMemo(
    () =>
      z.object({
        id: z.number().optional(),
        customer_id: z
          .string({ message: t("booking.validation.customer_required") })
          .min(1, { message: t("booking.validation.customer_required") }),
        vehicle_id: z
          .string({ message: t("booking.validation.vehicle_required") })
          .min(1, { message: t("booking.validation.vehicle_required") }),
        branch_id: z
          .string({ message: t("booking.validation.branch_required") })
          .min(1, { message: t("booking.validation.branch_required") }),
        booking_date: z
          .string({ message: t("booking.validation.date_required") })
          .min(1, { message: t("booking.validation.date_required") }),
        booking_time: z
          .string({ message: t("booking.validation.time_required") })
          .min(1, { message: t("booking.validation.time_required") }),
        service_type: z
          .string({ message: t("booking.validation.service_required") })
          .min(1, { message: t("booking.validation.service_required") }),
        complaint: z.string().optional(),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      booking_time: "08:00",
      booking_date: dayjs().add(1, "day").toISOString(),
    },
  });

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(
        getCustomer({
          noStats: 1,
          noPagination: 1,
          isVehicle: 1,
        }),
      );
      dispatch(getVehicle({ page: 1, pageSize: 500 }));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }

    setValue("branch_id", company?.id.toString() || "");
  }, [company]);

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("customer_id", data.customer_id.toString());
      setValue("vehicle_id", data.vehicle_id.toString());
      setValue("branch_id", data.branch_id?.toString() || "");
      setValue("booking_date", data.booking_date);
      setValue("booking_time", formatTime(data.booking_time));
      setValue("service_type", data.service_type);
      setValue("complaint", data.complaint || "");
    }
  }, [data]);

  const onSubmit = async (data: BookingFormValues) => {
    setLoading(true);
    http
      .post("/bookings", data)
      .then(({ data }) => {
        notify(data.message);
        setValue("id", undefined);
        setValue("customer_id", "");
        setValue("vehicle_id", "");
        setValue("branch_id", "");
        setValue("service_type", "");
        setValue("complaint", "");
        setValue("booking_time", "08:00");
        setValue("booking_date", dayjs().add(1, "day").toISOString());
        setOpen(false);
        dispatch(getBooking(bookingQuery));
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isAddCustomer}
        scrollBehavior="outside"
        size="4xl"
        onOpenChange={setIsAddCustomer}
      >
        <ModalContent>
          <ModalBody className="py-6">
            <CustomerFormPage
              onAction={(val) => {
                dispatch(
                  getCustomer({
                    noStats: 1,
                    noPagination: 1,
                    isVehicle: 1,
                  }),
                );
                setIsAddCustomer(false);
                setValue("customer_id", val?.id.toString());
                if (val?.vehicles && val?.vehicles.length > 0) {
                  setValue("vehicle_id", String(val?.vehicles[0].id));
                }
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

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
                  <span>{t("booking.modal.create_title")}</span>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="space-y-6 py-2">
                  <div className="flex justify-end">
                    <Button
                      color="primary"
                      size="sm"
                      variant="flat"
                      onPress={() => setIsAddCustomer(true)}
                    >
                      {t("booking.modal.add_customer")}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      control={control}
                      name="customer_id"
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          allowsCustomValue
                          defaultItems={customers || []}
                          errorMessage={fieldState.error?.message}
                          isInvalid={!!fieldState.error}
                          label={t("booking.modal.customer_label")}
                          labelPlacement="outside"
                          placeholder={t("booking.modal.customer_placeholder")}
                          selectedKey={String(field.value)}
                          startContent={<Users />}
                          variant="bordered"
                          onClear={() => {
                            setValue("vehicle_id", "");
                          }}
                          onInputChange={(val) => {
                            if (!val) {
                              setValue("vehicle_id", "");
                            }
                          }}
                          onSelectionChange={(key) => {
                            field.onChange(key);

                            const selectedCustomer = customers.find(
                              (c) => String(c.id) === String(key),
                            );

                            if (selectedCustomer) {
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
                                    {item.phone || t("booking.modal.no_phone")}
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
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          allowsCustomValue
                          defaultItems={dataVehicles?.data || []}
                          errorMessage={fieldState.error?.message}
                          isInvalid={!!fieldState.error}
                          label={t("booking.modal.plate_label")}
                          labelPlacement="outside"
                          placeholder={t("booking.modal.vehicle_placeholder")}
                          selectedKey={field.value}
                          startContent={<Users />}
                          variant="bordered"
                          onSelectionChange={(val) => {
                            field.onChange(val);

                            const selectedVehicle = dataVehicles?.data.find(
                              (v) => String(v.id) === String(val),
                            );

                            if (
                              selectedVehicle &&
                              selectedVehicle.customers &&
                              selectedVehicle.customers.length > 0
                            ) {
                              setValue(
                                "customer_id",
                                String(selectedVehicle.customers[0].id),
                              );
                            }
                          }}
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
                      name="booking_date"
                      render={({ field, fieldState }) => (
                        <CustomDatePicker
                          errorMessage={fieldState.error?.message}
                          isInvalid={!!fieldState.error}
                          label={t("booking.modal.arrival_date")}
                          labelPlacement="outside"
                          minDate={dayjs().add(1, "day").toDate()}
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
                          label={t("booking.modal.time_label")}
                          labelPlacement="outside"
                          placeholder={t("booking.modal.time_placeholder")}
                          selectedKeys={[field.value]}
                          startContent={
                            <Clock className="text-default-400" size={18} />
                          }
                          variant="bordered"
                        >
                          {TIME_SLOTS.map((slot) => (
                            <SelectItem key={slot}>
                              {slot} {t("booking.timezone")}
                            </SelectItem>
                          ))}
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
                        label={t("booking.modal.service_category")}
                        labelPlacement="outside"
                        placeholder={t("booking.modal.service_placeholder")}
                        selectedKeys={[field.value]}
                        startContent={
                          <Toolbox className="text-default-400" size={18} />
                        }
                        variant="bordered"
                      >
                        {SERVICE_TYPE_KEYS.map(({ key, labelKey }) => (
                          <SelectItem key={key}>{t(labelKey)}</SelectItem>
                        ))}
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
                        label={t("booking.modal.complaint_label")}
                        labelPlacement="outside"
                        placeholder={t("booking.modal.complaint_placeholder")}
                        variant="bordered"
                      />
                    )}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button isLoading={loading} variant="flat" onPress={onClose}>
                  {t("common.cancel")}
                </Button>
                <Button
                  className="font-bold px-6"
                  color="primary"
                  isLoading={loading}
                  type="submit"
                >
                  {t("booking.modal.confirm_button")}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

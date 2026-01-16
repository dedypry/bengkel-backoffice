import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Sheet,
  Table,
  Typography,
  Stack,
  IconButton,
  Card,
  Textarea,
} from "@mui/joy";
import { Plus, Trash2, Package, Truck, Save, FileText } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { receiptSchema, type ReceiptFormValues } from "./schemas/add-schema";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import { DatePicker } from "@/components/date-picker";
import InputNumber from "@/components/ui/input-number";
import SearchProduct from "@/components/search-product";

export default function GoodsReceiptForm() {
  const { suppliers } = useAppSelector((state) => state.supplier);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSupplier({ pageSize: 100 }));
  }, []);

  const addRow = () => {
    append({
      productId: 0,
      purchasePrice: 0,
      qtyPo: 0,
      qtyRec: 0,
      condition: "Baik",
    });
  };

  const removeRow = (index: number) => {
    remove(index);
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      poNumber: "",
      supplierId: undefined,
      receiptDate: new Date().toISOString().split("T")[0],
      items: [{ productId: undefined, qtyPo: 0, qtyRec: 0, condition: "Baik" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data: ReceiptFormValues) => {
    console.log("Valid Form Data:", data);
    // Kirim ke API via InvoicesService/GoodsReceiptService
  };

  return (
    <Box>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        mb={2}
      >
        <Typography level="h3" startDecorator={<Package size={24} />}>
          Penerimaan Barang Masuk
        </Typography>
        <Typography level="body-xs">ID: GR-20260116-001</Typography>
      </Stack>

      <Card sx={{ borderRadius: "md", boxShadow: "sm" }} variant="outlined">
        {/* Section 1: Header Information */}
        <Typography
          level="title-md"
          mb={2}
          startDecorator={<FileText size={18} />}
        >
          Informasi Pengiriman
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 2,
            mb: 3,
          }}
        >
          <Controller
            control={control}
            name="poNumber"
            render={({ field }) => (
              <FormControl required error={!!errors.poNumber}>
                <FormLabel>No. Purchase Order (PO)</FormLabel>
                <Input
                  {...field}
                  placeholder="PO-XXXXX"
                  startDecorator={<FileText size={16} />}
                />
                {errors.poNumber && (
                  <Typography color="danger" level="body-xs">
                    {errors.poNumber.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <FormControl required error={!!errors.supplierId}>
            <FormLabel>Nama Supplier</FormLabel>
            <Controller
              control={control}
              name="supplierId"
              render={({ field }) => (
                <Select
                  placeholder="Pilih Supplier"
                  value={field.value}
                  onChange={(_, val) => field.onChange(val)}
                >
                  {suppliers?.data.map((supplier) => (
                    <Option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.supplierId && (
              <Typography color="danger" level="body-xs">
                {errors.supplierId.message}
              </Typography>
            )}
          </FormControl>

          <FormControl required error={!!errors.receiptDate}>
            <FormLabel>Tanggal Terima</FormLabel>
            <Controller
              control={control}
              name="receiptDate"
              render={({ field }) => (
                <DatePicker
                  setValue={field.onChange}
                  value={new Date(field.value)}
                />
              )}
            />
            {errors.receiptDate && (
              <Typography color="danger" level="body-xs">
                {errors.receiptDate.message}
              </Typography>
            )}
          </FormControl>

          <Controller
            control={control}
            name="suratJalanNumber"
            render={({ field }) => (
              <FormControl>
                <FormLabel>No. Surat Jalan Supplier</FormLabel>
                <Input {...field} placeholder="SJ-XXXXX" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="expedition"
            render={({ field }) => (
              <FormControl>
                <FormLabel>Ekspedisi / Kurir</FormLabel>
                <Input
                  {...field}
                  placeholder="JNE / Nama Driver"
                  startDecorator={<Truck size={16} />}
                />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="policeNumber"
            render={({ field }) => (
              <FormControl>
                <FormLabel>No. Polisi Kendaraan</FormLabel>
                <Input {...field} placeholder="B 1234 ABC" />
              </FormControl>
            )}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Section 2: Items Table */}
        <Typography
          level="title-md"
          mb={2}
          startDecorator={<Package size={18} />}
        >
          Daftar Item Barang
        </Typography>

        <Sheet sx={{ borderRadius: "sm", overflow: "auto" }} variant="outlined">
          <Table stickyHeader borderAxis="bothBetween">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Nama Barang / Kode</th>
                <th>Qty di PO</th>
                <th>Qty Diterima</th>
                <th>Harga Beli Satuan</th>
                <th>Kondisi</th>
                <th style={{ width: "50px" }} />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td>
                    <Controller
                      control={control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <SearchProduct
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      control={control}
                      name={`items.${index}.qtyPo`}
                      render={({ field }) => (
                        <InputNumber
                          value={field.value || ""}
                          variant="plain"
                          onInput={field.onChange}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      control={control}
                      name={`items.${index}.qtyRec`}
                      render={({ field }) => (
                        <InputNumber
                          value={field.value || ""}
                          variant="plain"
                          onInput={field.onChange}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      control={control}
                      name={`items.${index}.purchasePrice`}
                      render={({ field }) => (
                        <InputNumber
                          startDecorator="Rp"
                          value={field.value || ""}
                          variant="plain"
                          onInput={field.onChange}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Controller
                      control={control}
                      name={`items.${index}.condition`}
                      render={({ field }) => (
                        <Select {...field} variant="plain">
                          <Option value="Baik">Baik</Option>
                          <Option value="Rusak">Rusak / Reject</Option>
                          <Option value="Kurang">Kurang</Option>
                        </Select>
                      )}
                    />
                  </td>
                  <td>
                    {watch("items").length > 1 && (
                      <IconButton
                        color="danger"
                        size="sm"
                        variant="soft"
                        onClick={() => removeRow(index)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>

        <Button
          startDecorator={<Plus size={18} />}
          sx={{ mt: 1, alignSelf: "flex-end" }}
          onClick={addRow}
        >
          Tambah Baris
        </Button>

        <Divider sx={{ my: 3 }} />

        {/* Section 3: Notes and Action */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 4,
          }}
        >
          <FormControl error={!!errors.notes}>
            <FormLabel>Catatan Penerimaan</FormLabel>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Textarea
                  {...field}
                  minRows={3}
                  placeholder="Tulis catatan terkait kondisi fisik barang atau selisih..."
                />
              )}
            />
            {errors.notes && (
              <Typography color="danger" level="body-xs">
                {errors.notes.message}
              </Typography>
            )}
          </FormControl>

          <Stack justifyContent="flex-end" spacing={1}>
            <Button
              color="primary"
              startDecorator={<Save size={20} />}
              onClick={handleSubmit(onSubmit)}
            >
              Simpan Penerimaan
            </Button>
            <Button color="neutral" variant="outlined">
              Batal
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}

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
import {
  Plus,
  Trash2,
  Package,
  Truck,
  Calendar,
  Save,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import { useFieldArray, useForm } from "react-hook-form";
import { receiptSchema, type ReceiptFormValues } from "./schemas/add-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function GoodsReceiptForm() {
  const { suppliers } = useAppSelector((state) => state.supplier);
  const [items, setItems] = useState([
    { id: 1, name: "", qtyPo: 0, qtyRec: 0, status: "Baik" },
  ]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSupplier({ pageSize: 100 }));
  }, []);

  const addRow = () => {
    setItems([
      ...items,
      { id: Date.now(), name: "", qtyPo: 0, qtyRec: 0, status: "Baik" },
    ]);
  };

  const removeRow = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      poNumber: "",
      supplierId: "",
      receiptDate: new Date().toISOString().split("T")[0],
      items: [{ productId: "", qtyPo: 0, qtyRec: 0, condition: "Baik" }],
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
          <FormControl required>
            <FormLabel>No. Purchase Order (PO)</FormLabel>
            <Input
              placeholder="PO-XXXXX"
              startDecorator={<FileText size={16} />}
            />
          </FormControl>

          <FormControl required>
            <FormLabel>Nama Supplier</FormLabel>
            <Select placeholder="Pilih Supplier">
              <Option value="supp1">PT. Abadi Motor</Option>
              <Option value="supp2">CV. Maju Jaya</Option>
            </Select>
          </FormControl>

          <FormControl required>
            <FormLabel>Tanggal Terima</FormLabel>
            <Input startDecorator={<Calendar size={16} />} type="date" />
          </FormControl>

          <FormControl>
            <FormLabel>No. Surat Jalan Supplier</FormLabel>
            <Input placeholder="SJ-XXXXX" />
          </FormControl>

          <FormControl>
            <FormLabel>Ekspedisi / Kurir</FormLabel>
            <Input
              placeholder="JNE / Nama Driver"
              startDecorator={<Truck size={16} />}
            />
          </FormControl>

          <FormControl>
            <FormLabel>No. Polisi Kendaraan</FormLabel>
            <Input placeholder="B 1234 ABC" />
          </FormControl>
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
                <th>Kondisi</th>
                <th style={{ width: "50px" }} />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Input
                      fullWidth
                      placeholder="Cari barang..."
                      variant="plain"
                    />
                  </td>
                  <td>
                    <Input defaultValue={0} type="number" variant="plain" />
                  </td>
                  <td>
                    <Input
                      color="primary"
                      defaultValue={0}
                      type="number"
                      variant="plain"
                    />
                  </td>
                  <td>
                    <Select defaultValue="Baik" variant="plain">
                      <Option value="Baik">Baik</Option>
                      <Option value="Rusak">Rusak / Reject</Option>
                      <Option value="Kurang">Kurang</Option>
                    </Select>
                  </td>
                  <td>
                    <IconButton
                      color="danger"
                      size="sm"
                      variant="soft"
                      onClick={() => removeRow(item.id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>

        <Button
          startDecorator={<Plus size={18} />}
          sx={{ mt: 1, alignSelf: "flex-start" }}
          variant="plain"
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
          <FormControl>
            <FormLabel>Catatan Penerimaan</FormLabel>
            <Textarea
              minRows={3}
              placeholder="Tulis catatan terkait kondisi fisik barang atau selisih..."
            />
          </FormControl>

          <Stack justifyContent="flex-end" spacing={2}>
            <Button
              color="primary"
              size="lg"
              startDecorator={<Save size={20} />}
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

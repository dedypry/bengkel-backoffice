import {
  Search,
  Download,
  Eye,
  Filter,
  Calendar as CalendarIcon,
  FileText,
  Printer,
  History,
} from "lucide-react";
import {
  Button,
  Input,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Tooltip,
} from "@heroui/react";

const historyData = [
  {
    id: "INV-2025-001",
    date: "24 Des 2025",
    customer: "Budi Santoso",
    vehicle: "Toyota Avanza",
    plate: "B 1234 GHO",
    service: "Ganti Oli + Filter",
    total: 450000,
    mechanic: "Agus",
    status: "Completed",
  },
  {
    id: "INV-2025-002",
    date: "22 Des 2025",
    customer: "Lani Wijaya",
    vehicle: "Honda HR-V",
    plate: "D 9999 RS",
    service: "Tune Up & Rem",
    total: 1250000,
    mechanic: "Budi",
    status: "Completed",
  },
  {
    id: "INV-2025-003",
    date: "20 Des 2025",
    customer: "Rian Hidayat",
    vehicle: "Mitsubishi Xpander",
    plate: "F 4567 JK",
    service: "Ganti Aki",
    total: 850000,
    mechanic: "Agus",
    status: "Cancelled",
  },
];

export default function HistoryPage() {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-lg">
              <History className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-default-900 tracking-tight">
                Riwayat Servis
              </h1>
              <p className="text-small text-default-500 font-medium">
                Arsip seluruh pengerjaan unit dan transaksi selesai.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            color="default"
            startContent={<Download className="size-4" />}
            variant="flat"
          >
            Export Excel
          </Button>
          <Button
            className="font-bold shadow-lg shadow-primary/20"
            color="primary"
            startContent={<Printer className="size-4" />}
          >
            Cetak Laporan
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border border-default-100" shadow="sm">
        <CardBody className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div className="md:col-span-2">
            <Input
              isClearable
              placeholder="Cari No. Invoice, Plat, atau Nama Pelanggan..."
              startContent={<Search className="size-4 text-default-400" />}
              variant="bordered"
            />
          </div>
          <Input
            startContent={<CalendarIcon className="size-4 text-default-400" />}
            type="date"
            variant="bordered"
          />
          <Button
            className="font-bold"
            color="secondary"
            startContent={<Filter className="size-4" />}
            variant="flat"
          >
            Filter Lanjut
          </Button>
        </CardBody>
      </Card>

      {/* History Table */}
      <Table
        aria-label="Tabel Riwayat Servis"
        classNames={{
          wrapper: "border border-default-100 p-0 overflow-hidden",
          th: "bg-default-50 text-default-600 font-bold h-12 uppercase text-tiny",
          td: "py-4 border-b border-default-50 last:border-none",
        }}
        shadow="none"
      >
        <TableHeader>
          <TableColumn>TANGGAL & ID</TableColumn>
          <TableColumn>KENDARAAN</TableColumn>
          <TableColumn>DETAIL LAYANAN</TableColumn>
          <TableColumn align="end">TOTAL BIAYA</TableColumn>
          <TableColumn align="center">STATUS</TableColumn>
          <TableColumn align="center">AKSI</TableColumn>
        </TableHeader>
        <TableBody>
          {historyData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-default-700">
                    {item.date}
                  </span>
                  <span className="text-tiny text-default-400 font-mono tracking-tighter">
                    {item.id}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-default-800 uppercase tracking-wide">
                    {item.plate}
                  </span>
                  <span className="text-tiny text-default-500">
                    {item.vehicle} • {item.customer}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-small text-default-700 font-medium">
                    {item.service}
                  </span>
                  <Chip
                    className="h-5 text-[10px] font-bold uppercase"
                    color="primary"
                    size="sm"
                    variant="flat"
                  >
                    Mekanik: {item.mechanic}
                  </Chip>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-black text-default-900">
                  {formatIDR(item.total)}
                </span>
              </TableCell>
              <TableCell>
                <Chip
                  className="font-bold"
                  color={item.status === "Completed" ? "success" : "danger"}
                  variant="dot"
                >
                  {item.status === "Completed" ? "Sukses" : "Batal"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  <Tooltip content="Lihat Detail">
                    <Button
                      isIconOnly
                      color="primary"
                      size="sm"
                      variant="light"
                    >
                      <Eye className="size-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="File Invoice">
                    <Button
                      isIconOnly
                      color="default"
                      size="sm"
                      variant="light"
                    >
                      <FileText className="size-4" />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer / Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <p className="text-small text-default-500 font-medium">
          Menampilkan <span className="text-default-900 font-bold">3</span> dari{" "}
          <span className="text-default-900 font-bold">1,240</span> riwayat
        </p>
        <div className="flex gap-2">
          <Button isDisabled size="sm" variant="bordered">
            Sebelumnya
          </Button>
          <Button
            className="font-bold"
            color="primary"
            size="sm"
            variant="bordered"
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}

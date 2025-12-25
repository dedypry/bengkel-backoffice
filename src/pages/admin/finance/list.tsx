import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InvoiceStatus = "paid" | "unpaid" | "cancelled";

type Invoice = {
  id: number;
  invoiceNumber: string;
  customerName: string;
  serviceName: string;
  total: number;
  date: string;
  status: InvoiceStatus;
};

const INVOICES: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    customerName: "Budi Santoso",
    serviceName: "Servis Berkala Mobil",
    total: 350000,
    date: "2024-12-20",
    status: "paid",
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002",
    customerName: "Andi Wijaya",
    serviceName: "Ganti Oli Mobil",
    total: 250000,
    date: "2024-12-21",
    status: "unpaid",
  },
  {
    id: 3,
    invoiceNumber: "INV-2024-003",
    customerName: "Siti Rahma",
    serviceName: "Servis Rem Mobil",
    total: 300000,
    date: "2024-12-22",
    status: "cancelled",
  },
];

export default function InvoiceListPage() {
  const [search, setSearch] = useState("");

  const filteredInvoices = INVOICES.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  const statusVariant = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "default";
      case "unpaid":
        return "outline";
      case "cancelled":
        return "secondary";
    }
  };

  const statusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "Lunas";
      case "unpaid":
        return "Belum Bayar";
      case "cancelled":
        return "Dibatalkan";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Daftar Invoice</h1>
        <p className="text-sm text-muted-foreground">
          Riwayat invoice servis mobil
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          className="sm:max-w-xs"
          placeholder="Cari invoice / customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {invoice.invoiceNumber}
              </span>
              <span className="text-xs text-muted-foreground">
                {invoice.customerName} • {invoice.serviceName}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(invoice.date).toLocaleDateString("id-ID")}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">
                  Rp {invoice.total.toLocaleString("id-ID")}
                </p>
                <Badge variant={statusVariant(invoice.status)}>
                  {statusLabel(invoice.status)}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Detail
                </Button>

                {invoice.status === "unpaid" && (
                  <Button size="sm">Bayar</Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredInvoices.length === 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Invoice tidak ditemukan
          </div>
        )}
      </div>
    </div>
  );
}

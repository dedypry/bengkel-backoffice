import {
  SearchIcon,
  FilterIcon,
  MoreVertical,
  Plus,
  PackageCheck,
} from "lucide-react";

import { PackageWarning } from "./components/package-warning";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import HeaderAction from "@/components/header-action";

export default function SparepartPage() {
  return (
    <div className="p-6 space-y-6">
      <HeaderAction
        isUploadExcel
        actionIcon={Plus}
        actionTitle="Tambah Sparepart"
        leadIcon={PackageCheck}
        subtitle="Kelola stok dan informasi suku cadang bengkel."
        title="Master Data Sparepart"
        onAction={() => {}}
      />

      {/* 2. FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Cari kode atau nama sparepart..."
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="flex gap-2" variant="outline">
            <FilterIcon className="size-4" /> Filter
          </Button>
          <Button variant="outline">Export Excel</Button>
        </div>
      </div>

      {/* 3. TABEL DATA */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Nama Sparepart</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Stok</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Contoh Baris Data */}
            <TableRow>
              <TableCell className="font-medium">PART-001</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>Kampas Rem Depan</span>
                  <span className="text-xs text-muted-foreground">
                    Honda Genuine Part
                  </span>
                </div>
              </TableCell>
              <TableCell>Braking System</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-destructive font-bold">5</span>
                  <PackageWarning minStock={20} stock={20} />
                </div>
              </TableCell>
              <TableCell>Rp 150.000</TableCell>
              <TableCell>
                <Badge
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  variant="outline"
                >
                  Aktif
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* 4. PAGINATION (Placeholder) */}
      <div className="flex justify-end gap-2 text-sm text-muted-foreground">
        Menampilkan 1 - 10 dari 150 data
      </div>
    </div>
  );
}

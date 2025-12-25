import {
  Printer,
  Download,
  Car,
  User,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  ChevronLeft,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const invoiceData = {
  invoiceNumber: "INV-2025-1225",
  date: "25 Desember 2025",
  dueDate: "25 Desember 2025",
  status: "Lunas",
  customer: {
    name: "Budi Santoso",
    phone: "0812-3456-7890",
    address: "Jl. Merdeka No. 10, Bekasi",
  },
  vehicle: {
    model: "Toyota Avanza G",
    plate: "B 1234 GHO",
    km: "45.230 km",
    mechanic: "Agus Supriatna",
  },
  items: [
    {
      id: 1,
      desc: "Servis Berkala 10.000 KM",
      qty: 1,
      price: 750000,
      type: "Jasa",
    },
    {
      id: 2,
      desc: "Oli Mesin Synthetic 4L",
      qty: 1,
      price: 450000,
      type: "Barang",
    },
    { id: 3, desc: "Filter Oli Toyota", qty: 1, price: 85000, type: "Barang" },
    { id: 4, desc: "Ganti Lampu Senja", qty: 2, price: 25000, type: "Jasa" },
  ],
  taxRate: 0.11, // PPN 11%
};

export default function InvoicePage() {
  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const tax = subtotal * invoiceData.taxRate;
  const total = subtotal + tax;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Tombol Aksi - Tidak ikut terprint */}
      <div className="flex justify-between items-center mb-8 no-print">
        <Button className="text-slate-500 font-bold gap-2" variant="ghost">
          <ChevronLeft size={18} /> Kembali
        </Button>
        <div className="flex gap-3">
          <Button
            className="rounded-xl font-bold gap-2 border-slate-200"
            variant="outline"
          >
            <Download size={18} /> Simpan PDF
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold gap-2 shadow-lg shadow-blue-200"
            onClick={() => window.print()}
          >
            <Printer size={18} /> Cetak Invoice
          </Button>
        </div>
      </div>

      {/* Kertas Invoice */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Header Invoice */}
        <div className="bg-blue-600 p-10 text-white flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-xl">
                <Wrench className="text-blue-600 size-6" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                Gemini Auto Service
              </h1>
            </div>
            <p className="text-blue-100 text-sm font-medium">
              Jl. Raya Industri No. 123, Bekasi
              <br />
              Telp: (021) 8888-9999
            </p>
          </div>
          <div className="relative z-10 text-right">
            <h2 className="text-5xl font-black opacity-30 mb-2">INVOICE</h2>
            <p className="text-xl font-bold">#{invoiceData.invoiceNumber}</p>
            <Badge className="bg-emerald-400 text-emerald-950 font-black mt-2">
              <CheckCircle2 className="mr-1" size={14} />{" "}
              {invoiceData.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="p-10">
          {/* Info Pelanggan & Kendaraan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <User size={18} strokeWidth={3} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Tagihan Untuk:
                </span>
              </div>
              <div>
                <p className="text-xl font-black text-slate-800">
                  {invoiceData.customer.name}
                </p>
                <p className="text-slate-500 font-medium">
                  {invoiceData.customer.phone}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">
                  {invoiceData.customer.address}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <Car size={18} strokeWidth={3} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Detail Kendaraan:
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Unit
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {invoiceData.vehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Plat Nomor
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {invoiceData.vehicle.plate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Kilometer
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {invoiceData.vehicle.km}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Mekanik
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {invoiceData.vehicle.mechanic}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Item Jasa & Barang */}
          <div className="mb-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Deskripsi Layanan / Part
                  </th>
                  <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                    Qty
                  </th>
                  <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Harga
                  </th>
                  <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="group">
                    <td className="py-5">
                      <p className="font-bold text-slate-800">{item.desc}</p>
                      <Badge
                        className="text-[9px] font-black text-blue-500 bg-blue-50 border-none px-2 mt-1 uppercase"
                        variant="outline"
                      >
                        {item.type}
                      </Badge>
                    </td>
                    <td className="py-5 text-center font-bold text-slate-600">
                      {item.qty}
                    </td>
                    <td className="py-5 text-right font-bold text-slate-600">
                      {formatIDR(item.price)}
                    </td>
                    <td className="py-5 text-right font-black text-slate-800">
                      {formatIDR(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bagian Total Akhir */}
          <div className="flex flex-col md:flex-row justify-between gap-10 pt-10 border-t-2 border-slate-100">
            <div className="max-w-xs space-y-4">
              <div className="flex gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <Info className="text-blue-500 shrink-0" size={20} />
                <p className="text-xs text-blue-700 font-medium">
                  Pembayaran dapat dilakukan melalui transfer Bank BCA{" "}
                  <strong>123-456-789</strong> a/n Gemini Auto.
                </p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 w-fit">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase">
                  Garansi Servis 7 Hari
                </span>
              </div>
            </div>

            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold">
                <span>PPN (11%)</span>
                <span>{formatIDR(tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="text-xl font-black text-slate-800 uppercase">
                  Total Akhir
                </span>
                <span className="text-3xl font-black text-blue-600 tracking-tighter">
                  {formatIDR(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-20 flex justify-between items-end">
            <div className="text-center">
              <p className="text-xs font-black text-slate-400 uppercase mb-16 italic">
                Hormat Kami,
              </p>
              <div className="w-40 border-b-2 border-slate-200" />
              <p className="text-xs font-bold text-slate-800 mt-2">
                Gemini Auto Staff
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-400 uppercase mb-16 italic">
                Pelanggan,
              </p>
              <div className="w-40 border-b-2 border-slate-200" />
              <p className="text-xs font-bold text-slate-800 mt-2">
                {invoiceData.customer.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .bg-white { shadow: none !important; border: none !important; }
        }
      `}</style>
    </div>
  );
}

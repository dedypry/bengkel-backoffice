import { useParams, Link as RouterLink } from "react-router-dom";
import { useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Image,
  Divider,
} from "@heroui/react";
import {
  Tag,
  Database,
  DollarSign,
  MapPin,
  AlertTriangle,
  ChevronRight,
  Edit,
  Package,
  ArrowLeft,
} from "lucide-react";

import { formatIDR } from "@/utils/helpers/format";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { getProductDetail } from "@/stores/features/product/product-action";

export default function ProductDetail() {
  const { product } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id));
    }
  }, [id, dispatch]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="text-gray-300 mb-4" size={48} />
        <p className="font-black uppercase tracking-widest text-gray-400">
          Produk Tidak Ditemukan
        </p>
      </div>
    );
  }

  const getStockStatus = (current: number, min: number) => {
    if (current === 0)
      return { label: "OUT OF STOCK", color: "danger" as const };
    if (current <= (min || 5))
      return { label: "LOW STOCK", color: "warning" as const };

    return { label: "IN STOCK", color: "success" as const };
  };

  const status = getStockStatus(product.stock, product.min_stock);

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* HEADER NAVIGATION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Breadcrumbs separator={<ChevronRight size={14} />}>
          <BreadcrumbItem href="/inventory/stock">Inventory</BreadcrumbItem>
          <BreadcrumbItem>Spareparts</BreadcrumbItem>
          <BreadcrumbItem isCurrent>{product.code}</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex gap-2">
          <Button
            as={RouterLink}
            className="font-black uppercase text-[10px] tracking-widest"
            radius="sm"
            size="sm"
            startContent={<ArrowLeft size={16} />}
            to="/inventory/stock"
            variant="flat"
          >
            Kembali
          </Button>
          <Button
            as={RouterLink}
            className="font-black uppercase text-[10px] tracking-widest text-white shadow-sm"
            color="warning"
            radius="sm"
            size="sm"
            startContent={<Edit size={16} />}
            to={`/inventory/stock/${product.id}/edit`}
          >
            Edit Produk
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR: IMAGE & STATUS */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm border-none overflow-hidden" radius="sm">
            <CardBody className="p-0">
              <div className="aspect-square bg-gray-50 flex items-center justify-center border-b border-gray-100">
                {product.image ? (
                  <Image
                    alt={product.name}
                    className="object-cover w-full h-full"
                    radius="none"
                    src={product.image}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Package className="text-gray-200" size={64} />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                      No Preview
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 bg-white">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  System Code
                </span>
                <p className="text-2xl font-black text-gray-900 tracking-tighter mb-4">
                  {product.code}
                </p>
                <Chip
                  className="font-black text-[10px] uppercase tracking-[0.15em] px-3 h-8"
                  color={status.color}
                  radius="sm"
                  variant="flat"
                >
                  {status.label}
                </Chip>
              </div>
            </CardBody>
          </Card>

          {/* LOKASI RAK */}
          <Card className="shadow-sm border-none bg-gray-900" radius="sm">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 text-white/50 mb-4">
                <MapPin size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Storage Location
                </span>
              </div>
              <p className="text-xl font-black text-white uppercase tracking-wider">
                {product.location || "UNASSIGNED"}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* MAIN CONTENT: INFO & PRICE */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-8 space-y-8">
              {/* NAMA & DESKRIPSI */}
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                  {product.name}
                </h1>
                <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase max-w-2xl">
                  {product.description ||
                    "TIDAK ADA DESKRIPSI TEKNIS UNTUK PRODUK INI."}
                </p>
              </div>

              <Divider className="opacity-50" />

              {/* GRID INVENTORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Database className="text-gray-400" size={16} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Inventory Management
                    </span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                      {product.stock}
                    </span>
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest pb-1">
                      {product.uom?.name || product.unit || "PCS"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-sm inline-flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Safety Stock (Min)
                    </span>
                    <span className="text-sm font-black text-red-600">
                      {product.min_stock || 0} ITEMS
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="text-gray-400" size={16} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Classification
                    </span>
                  </div>
                  <div className="p-4 border-2 border-gray-100 rounded-sm">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                      Primary Category
                    </p>
                    <p className="text-lg font-black text-gray-800 uppercase tracking-tight">
                      {product.category?.name || "UNSET"}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* FINANCIAL SECTION */}
          <Card
            className="shadow-sm border-none bg-emerald-50/50 border border-emerald-100/50"
            radius="sm"
          >
            <CardBody className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="text-emerald-600" size={18} />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
                  Financial Details
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <InfoBlock
                  label="Purchase Price"
                  subValue="Before Tax"
                  value={formatIDR(Number(product.purchase_price))}
                />
                <InfoBlock
                  color="text-emerald-700"
                  label="Retail Price"
                  subValue="Final POS Price"
                  value={formatIDR(Number(product.sell_price))}
                />
                <InfoBlock
                  label="Tax (PPN)"
                  subValue="Government Value"
                  value={`${product.ppn || 0}%`}
                />
              </div>
            </CardBody>
          </Card>

          {/* ALERT NON-AKTIF */}
          {!product.is_active && (
            <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-sm">
              <div className="p-2 bg-red-600 text-white rounded-sm">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black text-red-700 uppercase tracking-widest">
                  Product Inactive
                </p>
                <p className="text-[10px] font-bold text-red-500 uppercase mt-0.5">
                  Produk ini dalam status non-aktif dan tidak akan muncul di POS
                  (Kasir).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// HELPERS
function InfoBlock({ label, value, color = "text-gray-900", subValue }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
        {label}
      </span>
      <span className={`text-xl font-black tracking-tight ${color}`}>
        {value}
      </span>
      {subValue && (
        <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">
          {subValue}
        </span>
      )}
    </div>
  );
}

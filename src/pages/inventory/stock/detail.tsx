import { useParams, Link as RouterLink } from "react-router-dom";
import { useEffect, useRef } from "react";
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
  Boxes,
  ArrowBigRightDash,
} from "lucide-react";

import { formatIDR } from "@/utils/helpers/format";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { getProductDetail } from "@/stores/features/product/product-action";
import Carousel from "@/components/Carousel";

export default function ProductDetail() {
  const { product } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getProductDetail(id));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [id, dispatch]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="text-gray-300 mb-4" size={48} />
        <p className="font-black uppercase text-gray-400">
          Produk Tidak Ditemukan
        </p>
      </div>
    );
  }

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { label: "STOK HABIS", color: "danger" as const };
    if (current <= (min || 5))
      return { label: "STOK MENIPIS", color: "warning" as const };

    return { label: "STOK TERSEDIA", color: "success" as const };
  };

  const status = getStockStatus(product.stock, product.min_stock);

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* HEADER NAVIGASI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Breadcrumbs
          itemClasses={{ item: "text-gray-500 font-medium" }}
          separator={<ChevronRight size={14} />}
        >
          <BreadcrumbItem
            href="/inventory/stock"
            startContent={<Package size={14} />}
          >
            Inventaris
          </BreadcrumbItem>
          <BreadcrumbItem startContent={<Boxes size={14} />}>
            Suku Cadang
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent>{product.code}</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex gap-2">
          <Button
            as={RouterLink}
            size="sm"
            startContent={<ArrowLeft size={16} />}
            to="/inventory/stock"
            variant="flat"
          >
            Kembali
          </Button>
          <Button
            as={RouterLink}
            className="text-white"
            color="warning"
            size="sm"
            startContent={<Edit size={16} />}
            to={`/inventory/stock/${product.id}/edit`}
          >
            Edit Produk
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR: GAMBAR & STATUS */}
        <div className="lg:col-span-4 space-y-6 ">
          <Card>
            <CardBody className="p-0">
              <div>
                {product.images?.length! > 0 ? (
                  <Carousel autoPlay={product.images?.length! > 1}>
                    {product.images?.map((img) => (
                      <div key={img.id}>
                        <Image
                          alt={img.filename}
                          className="object-contain w-full h-full max-h-[300px]"
                          radius="none"
                          src={img.path}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="flex flex-col items-center gap-2 h-[250px]">
                    <Package className="text-gray-200" size={64} />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                      Tanpa Pratinjau
                    </span>
                  </div>
                )}
              </div>

              {/* <div className="aspect-square bg-gray-50 flex items-center justify-center border-b border-gray-100 max-w-md">
                {product.images?.length! > 0 ? (
                  <Carousel autoPlay={true}>
                    {product.images?.map((img) => (
                      <div key={img.id}>
                        <Image
                          alt={img.filename}
                          className="object-contain w-full h-full max-h-[500px]"
                          radius="none"
                          src={img.path}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Package className="text-gray-200" size={64} />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                      Tanpa Pratinjau
                    </span>
                  </div>
                )}
              </div> */}
              <div className="p-6 bg-white">
                <span className="text-sm font-black text-gray-400 uppercase">
                  Kode Sistem
                </span>
                <p className="text-2xl font-black text-gray-500 tracking-tighter mb-4">
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
          <Card className="bg-gray-700">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 text-white mb-4">
                <MapPin size={18} />
                <span className="text-sm font-black uppercase">
                  Lokasi Penyimpanan
                </span>
              </div>
              <p className="text-xl font-black text-white uppercase tracking-wider">
                {product.location || "BELUM DIATUR"}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* KONTEN UTAMA: INFO & HARGA */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardBody className="p-8 space-y-8">
              {/* NAMA & DESKRIPSI */}
              <div className="space-y-2">
                <h1 className="text-xl font-black text-gray-500 tracking-tighter uppercase">
                  {product.name}
                </h1>
                <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase max-w-2xl">
                  {product.description ||
                    "TIDAK ADA DESKRIPSI TEKNIS UNTUK PRODUK INI."}
                </p>
              </div>

              <Divider className="opacity-50" />

              {/* GRID INVENTARIS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Database className="text-gray-400" size={16} />
                    <span className="text-xs font-black text-gray-500 uppercase">
                      Manajemen Stok
                    </span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-black text-gray-600">
                      {product.stock}
                    </span>
                    <span className="text-sm font-black text-gray-400 uppercase pb-1">
                      {product.uom?.name || product.unit || "PCS"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-sm inline-flex flex-col">
                    <span className="text-xs font-black text-gray-500 uppercase mb-1">
                      Stok Pengaman (Min)
                    </span>
                    <span className="text-sm font-black text-red-600">
                      {product.min_stock || 0} ITEM
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="text-gray-400" size={16} />
                    <span className="text-xs font-black text-gray-500 uppercase">
                      Klasifikasi Produk
                    </span>
                  </div>
                  <div className="p-4 border-2 border-gray-100 rounded-sm">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-1">
                      Kategori Utama
                    </p>
                    <div className="flex items-center gap-2">
                      {product.category?.parent && (
                        <>
                          <p className="text-lg font-black text-gray-600 uppercase">
                            {product.category?.parent.name}
                          </p>
                          <ArrowBigRightDash className="text-gray-600" />
                        </>
                      )}
                      <p className="text-lg font-black text-gray-600 uppercase">
                        {product.category?.name || "TIDAK ADA KATEGORI"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* BAGIAN KEUANGAN */}
          <Card className="bg-emerald-50/50 border border-emerald-100/50">
            <CardBody className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="text-emerald-600" size={18} />
                <span className="text-md font-black text-emerald-700 uppercase ">
                  Rincian Keuangan
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <InfoBlock
                  label="Harga Beli"
                  subValue="Sebelum Pajak"
                  value={formatIDR(Number(product.purchase_price))}
                />
                <InfoBlock
                  color="text-emerald-700"
                  label="Harga Jual"
                  subValue="Harga Akhir POS"
                  value={formatIDR(Number(product.sell_price))}
                />
                <InfoBlock
                  label="Pajak (PPN)"
                  subValue="Nilai Pemerintah"
                  value={`${product.ppn || 0}%`}
                />
              </div>
            </CardBody>
          </Card>

          {/* PERINGATAN NON-AKTIF */}
          {!product.is_active && (
            <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-sm">
              <div className="p-2 bg-red-600 text-white rounded-sm">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black text-red-700 uppercase">
                  Produk Non-Aktif
                </p>
                <p className="text-[10px] font-bold text-red-500 uppercase mt-0.5">
                  Produk ini dalam status non-aktif dan tidak akan muncul di
                  sistem Kasir (POS).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// PEMBANTU (HELPERS)
function InfoBlock({ label, value, color = "text-gray-900", subValue }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-gray-500 uppercase">
        {label}
      </span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
      {subValue && (
        <span className="text-[10px] font-bold text-gray-500 uppercase">
          {subValue}
        </span>
      )}
    </div>
  );
}

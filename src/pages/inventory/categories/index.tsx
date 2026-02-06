import type { IProductCategory } from "@/utils/interfaces/IProduct";

import {
  Plus,
  Search,
  Layers,
  Package,
  ChevronRight,
  Tags,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardFooter,
  Divider,
} from "@heroui/react";

import ModalAddCategory from "./components/add-category";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/product/product-action";
import { formatNumber } from "@/utils/helpers/format";
import debounce from "@/utils/helpers/debounce";
import { setCategoryQuery } from "@/stores/features/product/product-slice";
import TableAction from "@/components/table-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function InventoryCategoryPage() {
  const { categories, categoryQuery } = useAppSelector(
    (state) => state.product,
  );
  const { company } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<IProductCategory>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories(categoryQuery));
  }, [categoryQuery, company, dispatch]);

  const searchBounce = debounce((q) => dispatch(setCategoryQuery({ q })), 800);

  async function handleDelete(id: number) {
    http
      .delete(`/products/categories/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getCategories(categoryQuery));
      })
      .catch((err) => notifyError(err));
  }

  async function handleEditData(data: IProductCategory) {
    setDetail(data);
    setModalOpen(true);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <ModalAddCategory
        initialData={detail}
        open={modalOpen}
        setOpen={setModalOpen}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-100 rounded-xl">
            <Tags className="size-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-500 tracking-tight uppercase italic">
              Kategori Produk
            </h1>
            <p className="text-small text-gray-500 font-medium">
              Kelola pengelompokan produk bengkel Anda.
            </p>
          </div>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="size-4" />}
          onPress={() => {
            setDetail(undefined);
            setModalOpen(true);
          }}
        >
          Tambah Kategori
        </Button>
      </div>

      {/* Toolbar - Minimalist Gray */}
      <Card className="border border-gray-200 bg-gray-50/50" shadow="none">
        <CardBody className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex-1">
            <Input
              isClearable
              classNames={{
                inputWrapper: "bg-white border-gray-200",
              }}
              placeholder="Cari nama kategori..."
              startContent={<Search className="size-4 text-gray-400" />}
              variant="bordered"
              onChange={(e) => searchBounce(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-3 bg-white border border-gray-200 rounded-xl text-gray-500">
            <Layers className="size-4 text-gray-400" />
            <span className="text-tiny font-bold uppercase tracking-wider">
              Total: <span className="text-gray-900">{categories.length}</span>
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            className="group border border-gray-200 hover:border-gray-400 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            shadow="none"
          >
            <CardBody className="p-5 flex flex-row items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-gray-100 rounded-sm text-gray-700 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
                  <Package size={24} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-tight leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium line-clamp-2 italic mt-1">
                    {cat.description || "Tidak ada deskripsi"}
                  </p>
                </div>
              </div>
              <TableAction
                isDeleteSeparator={false}
                viewDetail={false}
                onDelete={() => handleDelete(cat.id)}
                onEdit={() => handleEditData(cat)}
              />
            </CardBody>
            <Divider className="bg-gray-100 mx-5 w-auto" />
            <CardFooter className="px-5 py-4 justify-between items-center bg-gray-50/30">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-black text-gray-400 tracking-widest">
                  Total Produk
                </span>
                <span className="text-sm font-black text-gray-800 leading-none">
                  {formatNumber(cat.total_product)}
                  <span className="text-tiny font-medium text-gray-400 ml-1 italic">
                    Items
                  </span>
                </span>
              </div>
              <Button
                isIconOnly
                className="text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-200"
                radius="full"
                variant="light"
              >
                <ChevronRight size={20} />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Add New Category Card */}
        <button
          className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-gray-800 hover:text-gray-800 hover:bg-gray-50 transition-all gap-2 group min-h-[160px]"
          onClick={() => {
            setDetail(undefined);
            setModalOpen(true);
          }}
        >
          <div className="p-3 bg-gray-50 rounded-full group-hover:bg-gray-800 group-hover:text-white transition-colors">
            <Plus size={24} />
          </div>
          <span className="font-black text-tiny uppercase tracking-widest">
            Tambah Kategori Baru
          </span>
        </button>
      </div>

      {/* Info Note - Subtle Gray Alert */}
      <Card className="bg-gray-50 border border-gray-200" shadow="none">
        <CardBody className="flex flex-row gap-3 p-4">
          <AlertCircle className="size-5 text-gray-500 shrink-0" />
          <p className="text-tiny text-gray-600 leading-relaxed font-medium">
            <strong className="text-gray-900 uppercase tracking-tighter mr-1">
              Catatan Pengelola:
            </strong>
            Menghapus kategori yang masih memiliki produk aktif akan menyebabkan
            produk tersebut masuk ke kategori
            <i className="text-gray-900 font-bold ml-1">
              &quot;Tanpa Kategori&quot;
            </i>
            . Mohon pastikan kategori sudah kosong sebelum dihapus.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

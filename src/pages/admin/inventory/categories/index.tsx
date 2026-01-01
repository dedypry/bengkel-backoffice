import {
  Plus,
  Search,
  Layers,
  Package,
  ChevronRight,
  Tags,
} from "lucide-react";
import { useEffect, useState } from "react";

import ModalAddCategory from "./components/add-category";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/product/product-action";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/utils/helpers/format";
import debounce from "@/utils/helpers/debounce";
import { setCategoryQuery } from "@/stores/features/product/product-slice";
import TableAction from "@/components/table-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export default function CategoryProduk() {
  const { categories, categoryQuery } = useAppSelector(
    (state) => state.product,
  );
  const { company } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories(categoryQuery));
  }, [categoryQuery, company]);

  const searchBounce = debounce(
    (q) =>
      dispatch(
        setCategoryQuery({
          q,
        }),
      ),
    1000,
  );

  async function handleDelete(id: number) {
    http
      .delete(`/products/categories/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getCategories(categoryQuery));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <ModalAddCategory open={modalOpen} setOpen={setModalOpen} />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tags className="size-6 text-primary" />
            Kategori Produk
          </h1>
          <p className="text-sm text-slate-500">
            Kelola pengelompokan produk untuk mempermudah pencarian stok.
          </p>
        </div>
        <Button
          className="gap-2 shadow-lg shadow-primary/20"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="size-4" /> Tambah Kategori
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Cari nama kategori..."
            onChange={(e) => searchBounce(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 px-2">
          <Layers className="size-4" />
          <span>
            Total: <strong>{categories.length}</strong> Kategori
          </span>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group bg-white rounded-2xl border hover:border-primary/50 hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Dekorasi Aksen Warna */}
            <div
              className={`absolute top-0 right-0 w-2 h-full bg-primary opacity-20`}
            />
            <Item>
              <ItemMedia>
                <div
                  className={`p-3 rounded-lg bg-primary text-white shadow-lg`}
                >
                  <Package size={20} />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg font-semibold">
                  {cat.name}
                </ItemTitle>
                <ItemDescription className="text-xs italic">
                  {cat.description}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <TableAction onDelete={() => handleDelete(cat.id)} />
              </ItemActions>
            </Item>

            <div className="px-5">
              <Separator />
            </div>
            <div className="pt-4 flex justify-between items-center p-5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Total Produk
                </span>
                <span className="text-lg font-black text-slate-700">
                  {formatNumber(cat.total_product)}
                </span>
              </div>
              <Button
                className="group-hover:bg-primary group-hover:text-white hover:bg-primary/70 transition-colors"
                size="sm"
                variant="secondary"
              >
                Detail <ChevronRight className="ml-1" size={14} />
              </Button>
            </div>
          </div>
        ))}

        {/* Empty / Add New Card State */}
        <button
          className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-primary/50 hover:text-primary transition-all gap-2 min-h-45"
          onClick={() => setModalOpen(true)}
        >
          <div className="p-3 bg-slate-50 rounded-full">
            <Plus size={24} />
          </div>
          <span className="font-bold text-sm">Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Info Note */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
        <div className="text-amber-600">
          <Layers size={20} />
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Catatan Pengelola:</strong> Menghapus kategori yang masih
          memiliki produk aktif akan menyebabkan produk tersebut masuk ke
          kategori <i>&quot;Tanpa Kategori&quot;</i>. Pastikan kategori kosong
          sebelum dihapus.
        </p>
      </div>
    </div>
  );
}

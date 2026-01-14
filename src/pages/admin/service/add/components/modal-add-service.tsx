import { useEffect, useState } from "react";
import { Button } from "@mui/joy";
import { Plus } from "lucide-react";

import TabService from "./tab-service";
import TabSparepart from "./tab-sparepart";

import Modal from "@/components/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";
import { getProduct } from "@/stores/features/product/product-action";

interface Props {
  isSave?: boolean;
  onSave?: () => void;
  onClose?: () => void;
}
export default function ModalAddService({ isSave, onSave, onClose }: Props) {
  const { company } = useAppSelector((state) => state.auth);
  const { query } = useAppSelector((state) => state.service);
  const { productQuery } = useAppSelector((state) => state.product);
  const [category, setCategory] = useState("service");
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getService(query));
    dispatch(getProduct(productQuery));
  }, [company]);

  return (
    <>
      <Modal
        footer={
          !isSave ? (
            <div>
              <Button type="button" onClick={() => setOpen(false)}>
                Tutup
              </Button>
            </div>
          ) : undefined
        }
        open={open}
        size="xl"
        title="Tambah Barang dan Jasa"
        onClose={onClose}
        onOpenChange={setOpen}
        onSave={onSave}
      >
        <Tabs defaultValue={category}>
          <TabsList>
            <TabsTrigger value="service" onClick={() => setCategory("jasa")}>
              Jasa
            </TabsTrigger>
            <TabsTrigger
              value="sparepart"
              onClick={() => setCategory("sparepart")}
            >
              Sparepart
            </TabsTrigger>
          </TabsList>
          <TabsContent value="service">
            <TabService />
          </TabsContent>
          <TabsContent value="sparepart">
            <TabSparepart />
          </TabsContent>
        </Tabs>
      </Modal>

      <Button
        size="sm"
        startDecorator={<Plus />}
        type="button"
        onClick={() => setOpen(true)}
      >
        Tambah Barang/Jasa
      </Button>
    </>
  );
}

import { useEffect, useState } from "react";

import TabService from "./tab-service";
import TabSparepart from "./tab-sparepart";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";
import { getProduct } from "@/stores/features/product/product-action";

export default function ModalAddService() {
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
          <>
            <Button type="button" onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </>
        }
        open={open}
        size="5xl"
        title="Tambah Barang dan Jasa"
        onOpenChange={setOpen}
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

      <Button type="button" onClick={() => setOpen(true)}>
        Tambah Barang/Jasa
      </Button>
    </>
  );
}

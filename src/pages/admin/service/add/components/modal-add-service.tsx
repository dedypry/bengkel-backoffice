import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";

export default function ModalAddService() {
  const { company } = useAppSelector((state) => state.auth);
  const { services, query } = useAppSelector((state) => state.service);
  const [category, setCategory] = useState("jasa");
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getService(query));
  }, [company]);

  return (
    <>
      <Modal
        open={open}
        size="5xl"
        title="Tambah Barang dan Jasa"
        onOpenChange={setOpen}
      >
        <Tabs defaultValue={category}>
          <TabsList>
            <TabsTrigger value="jasa" onClick={() => setCategory("jasa")}>
              Jasa
            </TabsTrigger>
            <TabsTrigger
              value="sparepart"
              onClick={() => setCategory("sparepart")}
            >
              Sparepart
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="my-5">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <X />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pilih</TableHead>
              <TableHead>Barang/Jasa</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody />
        </Table>
      </Modal>

      <Button type="button" onClick={() => setOpen(true)}>
        Tambah Barang/Jasa
      </Button>
    </>
  );
}

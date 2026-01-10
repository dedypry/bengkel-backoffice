import { useState } from "react";
import { Button } from "@mui/joy";
import { Plus } from "lucide-react";

import Modal from "@/components/modal";

export default function AddPromo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal
        open={open}
        size="5xl"
        title="Buat Promo Baru"
        description="ini description"
        onOpenChange={setOpen}
      >
        <p>test</p>
      </Modal>
      <Button
        color="primary"
        startDecorator={<Plus />}
        onClick={() => setOpen(true)}
      >
        Tambah Promo
      </Button>
    </>
  );
}

import type { IPromo } from "@/utils/interfaces/IPromo";

import { Search, TicketPercent, Plus } from "lucide-react";
import { Button, Input, Card, Divider, Box } from "@mui/joy";
import { useEffect, useState } from "react";

import ModalAddPromo from "./components/add-promo";
import PromoCard from "./components/promo-card";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getPromo } from "@/stores/features/promo/promo-action";
import debounce from "@/utils/helpers/debounce";
import { setQueryPromo } from "@/stores/features/promo/promo-slice";

export default function PromoPage() {
  const [open, setOpen] = useState(false);
  const { promos, queryPromo } = useAppSelector((state) => state.promo);
  const { company } = useAppSelector((state) => state.auth);
  const [promo, setPromo] = useState<IPromo>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getPromo(queryPromo));
    }
  }, [company, queryPromo]);

  const searchDebounce = debounce((q) => dispatch(setQueryPromo({ q })), 500);

  return (
    <Box className="space-y-6 p-1">
      <ModalAddPromo data={promo} open={open} setOpen={setOpen} />
      <HeaderAction
        actionContent={
          <Button
            color="primary"
            startDecorator={<Plus />}
            onClick={() => setOpen(true)}
          >
            Tambah Promo
          </Button>
        }
        leadIcon={TicketPercent}
        subtitle="Kelola kode voucher dan diskon layanan bengkel Anda."
        title="Daftar Promo"
      />

      {/* Filter Bar */}
      <Card sx={{ py: 1.5, px: 2, borderRadius: "md" }} variant="outlined">
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Input
            placeholder="Cari nama atau kode promo..."
            startDecorator={<Search size={18} />}
            sx={{ flex: 1 }}
            onChange={(e) => searchDebounce(e.target.value)}
          />
          <Divider orientation="vertical" />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="neutral" size="sm" variant="soft">
              Semua
            </Button>
            <Button color="neutral" size="sm" variant="plain">
              Aktif
            </Button>
            <Button color="neutral" size="sm" variant="plain">
              Berakhir
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Grid List Promo */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 3,
        }}
      >
        {promos.map((promo) => (
          <PromoCard
            key={promo.id}
            promo={promo}
            setOpen={setOpen}
            setPromo={setPromo}
          />
        ))}
      </Box>
    </Box>
  );
}

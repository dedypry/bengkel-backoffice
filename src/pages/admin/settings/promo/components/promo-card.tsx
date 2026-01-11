import type { IPromo } from "@/utils/interfaces/IPromo";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  Tag,
  XCircle,
} from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import { http } from "@/utils/libs/axios";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { getPromo } from "@/stores/features/promo/promo-action";
import { useAppDispatch } from "@/stores/hooks";

interface Props {
  promo: IPromo;
  setPromo: (val: IPromo) => void;
  setOpen: (val: boolean) => void;
}
export default function PromoCard({ promo, setOpen, setPromo }: Props) {
  const [isActive, setIsActive] = useState(promo.is_active);

  const dispatch = useAppDispatch();

  function handleUpdateStatus(val: boolean) {
    setIsActive(val);
    http
      .patch(`/promos/${promo.id}`, { is_active: val })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => notifyError(err));
  }
  function handleDelete() {
    http
      .delete(`/promos/${promo.id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPromo({}));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <Card sx={{ "--Card-radius": "16px", boxShadow: "sm" }} variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexDirection: "row", display: "flex", gap: 2 }}>
            <Switch
              checked={isActive}
              onCheckedChange={(val) => handleUpdateStatus(val)}
            />
            <Chip
              color={isActive ? "success" : "danger"}
              size="sm"
              startDecorator={
                isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />
              }
              variant="soft"
            >
              {isActive ? "Aktif" : "Tidak Aktif"}
            </Chip>
          </Box>
          <Dropdown>
            <MenuButton
              slotProps={{
                root: { variant: "plain", color: "neutral" },
              }}
              slots={{ root: IconButton }}
            >
              <MoreVertical size={18} />
            </MenuButton>
            <Menu placement="bottom-end" size="sm">
              <MenuItem
                onClick={() => {
                  setPromo(promo);
                  setOpen(true);
                }}
              >
                Edit Promo
              </MenuItem>
              <MenuItem>Lihat Performa</MenuItem>
              <Divider />
              <MenuItem
                color="danger"
                variant="soft"
                onClick={() => confirmSweat(handleDelete)}
              >
                Hapus
              </MenuItem>
            </Menu>
          </Dropdown>
        </Box>

        <Typography level="title-lg">{promo.name}</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 0.5,
            mb: 1,
          }}
        >
          <Tag className="text-slate-400" size={14} />
          <Typography
            fontWeight="bold"
            level="body-xs"
            sx={{ color: "#168BAB", letterSpacing: "0.5px" }}
          >
            {promo.code}
          </Typography>
        </Box>

        <Divider inset="none" />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Clock className="text-slate-400" size={16} />
              <Typography level="body-xs">Besar Diskon</Typography>
            </Box>
            <Typography color="primary" level="title-sm">
              {promo.type === "fixed" && "Rp"} {Number(promo.value)}{" "}
              {promo.type === "percentage" && "%"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar className="text-slate-400" size={16} />
              <Typography level="body-xs">Periode</Typography>
            </Box>
            <Typography fontWeight="md" level="body-xs">
              {dayjs(promo.start_date).format("DD MMM YY")} -{" "}
              {dayjs(promo.end_date).format("DD MMM YY")}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

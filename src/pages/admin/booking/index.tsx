import {
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Table,
  Sheet,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  ListItemDecorator,
  Divider,
} from "@mui/joy";
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Home,
  Calendar,
  Filter,
  CheckCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getBooking } from "@/stores/features/booking/booking-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setBookingQuery } from "@/stores/features/booking/booking-slice";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "completed":
      return "primary";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
};

export default function BookingPage() {
  const { bookingQuery, bookings } = useAppSelector((state) => state.booking);
  const { company } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      dispatch(getBooking(bookingQuery));
    }
  }, [company, bookingQuery]);

  return (
    <Box sx={{ flex: 1, width: "100%", p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<ChevronRight size={16} />} sx={{ pl: 0, mb: 2 }}>
        <Link color="neutral" href="/" underline="hover">
          <Home size={18} />
        </Link>
        <Typography fontSize="sm" fontWeight="medium">
          Booking
        </Typography>
      </Breadcrumbs>

      {/* Header Halaman */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography component="h1" level="h2">
            Data Booking
          </Typography>
          <Typography level="body-sm">
            Kelola antrean dan jadwal servis bengkel Anda.
          </Typography>
        </Box>
        <Button color="primary" startDecorator={<Plus />}>
          Tambah Booking
        </Button>
      </Box>

      {/* Filter & Search Bar */}
      <Sheet
        sx={{
          borderRadius: "sm",
          p: 2,
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
        variant="outlined"
      >
        <FormControl sx={{ flex: 1, minWidth: "200px" }}>
          <FormLabel>Cari Customer / Kendaraan</FormLabel>
          <Input
            placeholder="Ketik nama atau plat nomor..."
            startDecorator={<Search />}
          />
        </FormControl>

        <FormControl sx={{ width: "160px" }}>
          <FormLabel>Status</FormLabel>
          <Select defaultValue="all">
            <Option value="all">Semua Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
          </Select>
        </FormControl>

        <FormControl sx={{ width: "160px" }}>
          <FormLabel>Tanggal</FormLabel>
          <Input startDecorator={<Calendar size={18} />} type="date" />
        </FormControl>

        <Button
          color="neutral"
          startDecorator={<Filter />}
          sx={{ alignSelf: "flex-end" }}
          variant="outlined"
        >
          Filter
        </Button>
      </Sheet>

      {/* Tabel Data */}
      <Sheet
        sx={{
          borderRadius: "sm",
          overflow: "auto",
          minHeight: 0,
        }}
        variant="outlined"
      >
        <Table hoverRow stickyHeader sx={{ "--TableCell-paddingX": "16px" }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Kendaraan</th>
              <th>Layanan</th>
              <th>Jadwal</th>
              <th>Status</th>
              <th style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody>
            {bookings?.data.map((row) => (
              <tr key={row.id}>
                <td>{row.customer.name}</td>
                <td>
                  <Typography level="body-xs">
                    {row.vehicle.brand} {row.vehicle.model}{" "}
                  </Typography>
                  <Typography fontWeight="bold" level="body-sm">
                    {row.vehicle.plate_number}
                  </Typography>
                </td>
                <td>{row.service_type}</td>
                <td>
                  <Typography level="body-xs">
                    {dayjs(row.booking_date).format("DD MMM YYYY")}
                  </Typography>
                  <Typography fontWeight="bold" level="body-sm">
                    {row.booking_time}
                  </Typography>
                </td>
                <td>
                  <Chip
                    color={getStatusColor(row.status!) as any}
                    size="sm"
                    variant="soft"
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Dropdown>
                    {/* MenuButton akan menggantikan IconButton sebagai trigger */}
                    <MenuButton
                      slotProps={{
                        root: {
                          variant: "plain",
                          color: "neutral",
                          size: "sm",
                        },
                      }}
                      slots={{ root: IconButton }}
                    >
                      <MoreHorizontal size={18} />
                    </MenuButton>
                    <Menu
                      placement="bottom-end"
                      size="sm"
                      sx={{
                        minWidth: 140,
                        borderRadius: "md",
                        boxShadow: "md",
                      }}
                    >
                      <MenuItem>
                        <ListItemDecorator>
                          <Edit2 size={16} />
                        </ListItemDecorator>
                        Edit Booking
                      </MenuItem>
                      <MenuItem
                        color="success"
                        onClick={() =>
                          navigate(`/service/add?booking=${row.id}`)
                        }
                      >
                        <ListItemDecorator>
                          <CheckCircle size={16} />
                        </ListItemDecorator>
                        Konfirmasi
                      </MenuItem>
                      <Divider /> {/* Garis pemisah antar aksi */}
                      <MenuItem color="danger">
                        <ListItemDecorator>
                          <Trash2 size={16} />
                        </ListItemDecorator>
                        Batalkan
                      </MenuItem>
                    </Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <CustomPagination
        className="mt-2"
        meta={bookings?.meta!}
        onPageChange={(page) => dispatch(setBookingQuery({ page }))}
      />
    </Box>
  );
}

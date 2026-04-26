import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

import ModalAdd from "./components/add-modal";

import HeaderAction from "@/components/header-action";
import { getMasterVehicle } from "@/stores/features/vehicle/vehicle-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { confirmSweat } from "@/utils/helpers/notify";
import { IVehicleItem } from "@/utils/interfaces/IMaster";

export default function VehiclePage() {
  const { master: vehicles } = useAppSelector((state) => state.vehicle);
  const { company } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<IVehicleItem>();
  const [open, setOpen] = useState(false);
  const hasFetched = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getMasterVehicle());

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, dispatch]);

  return (
    <>
      {data && <ModalAdd data={data} open={open} setOpen={setOpen} />}

      <HeaderAction
        actionTitle="Tambah Merk dan Type"
        subtitle="Daftar Merk dan Type Kendaraan"
        title="Daftar Kendaraan"
      />

      <Table>
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>Merk</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>CC</TableColumn>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          {(vehicles || [])
            .flatMap((item) => item.children)
            .map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.type || "Tidak Ada Nama"}</TableCell>
                <TableCell>{row.merk}</TableCell>
                <TableCell>{row.cc}</TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    onPress={() => {
                      setData(row);
                      setOpen(true);
                    }}
                  >
                    <Edit className="text-warning" size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    onPress={() => confirmSweat(() => {})}
                  >
                    <Trash2 className="text-danger" size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}

import type { IGroupedPermissions } from "@/utils/interfaces/IRole";

import React from "react";
import {
  Card,
  CardContent,
  Checkbox,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";

interface Props {
  data: IGroupedPermissions;
  selectedIds: number[];
  setSelectedIds: (val: number[]) => void;
}

export default function PermissionTable({
  data,
  selectedIds,
  setSelectedIds,
}: Props) {
  const handleToggle = (id: number) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id],
    );
  };

  return (
    <Card>
      <CardContent>
        <Sheet sx={{ overflow: "auto", height: "calc(100vh - 250px)" }}>
          <Table
            hoverRow
            stickyHeader
            sx={{
              "--TableCell-paddingX": "1.5rem",
              "--TableCell-paddingY": "1rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ width: 60 }} />
                <th style={{ width: 250 }}>Nama Akses</th>
                <th>Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([groupName, items]) => {
                return (
                  <React.Fragment key={groupName}>
                    <tr key={groupName}>
                      <td> </td>
                      <td colSpan={2}>
                        <Typography fontSize={16} fontWeight={700}>
                          {groupName}
                        </Typography>
                      </td>
                    </tr>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <Checkbox
                            checked={selectedIds.includes(item.id)}
                            onChange={() => handleToggle(item.id)}
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </Sheet>
      </CardContent>
    </Card>
  );
}

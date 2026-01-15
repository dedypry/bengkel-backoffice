import { Avatar } from "@mui/joy";

import StatusQueue from "@/pages/admin/service/queue/components/status-queue";
import { useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";

export function ServiceQueue() {
  const { dashboard } = useAppSelector((state) => state.dashboard);
  const queue = [
    {
      id: "WO-001",
      vehicle: "Toyota Avanza",
      plate: "B 1234 GHO",
      status: "Proses",
      mechanic: "Budi",
      progress: 65,
    },
    {
      id: "WO-002",
      vehicle: "Honda Civic",
      plate: "D 9999 RS",
      status: "Menunggu Part",
      mechanic: "Andi",
      progress: 30,
    },
    {
      id: "WO-003",
      vehicle: "Yamaha NMAX",
      plate: "F 4567 JK",
      status: "Selesai",
      mechanic: "Siti",
      progress: 100,
    },
  ];

  return (
    <div className="bg-white rounded-xl border shadow-sm mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4">Kendaraan</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Mekanik</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboard?.wo.map((item, i) => (
              <tr
                key={i}
                className="border-t hover:bg-slate-50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium">{item.vehicle.brand}</div>
                  <div className="text-xs text-slate-400">
                    {item.vehicle.plate_number}
                  </div>
                </td>
                <td>
                  <div className="flex gap-2 items-center">
                    <Avatar
                      size="sm"
                      src={
                        item.customer?.profile?.photo_url ||
                        getAvatarByName(item.customer.name)
                      }
                    />
                    <div>
                      <p>{item.customer.name}</p>
                      <p className="text-xs text-gray-500">{item.customer.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600">
                  {item.mechanics?.map((item) => (
                    <p key={item.id}>{item.name}</p>
                  ))}
                </td>

                <td className="p-4">
                  <StatusQueue wo={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

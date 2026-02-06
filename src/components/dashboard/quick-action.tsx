import { PlusCircle, FileText, UserPlus, ClipboardList } from "lucide-react";
import { cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/react";

export function QuickActions() {
  const actions = [
    {
      label: "Work Order Baru",
      icon: <PlusCircle />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      to: "/service/add",
    },
    {
      label: "Tambah Pelanggan",
      icon: <UserPlus />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      to: "/master/customers/create",
    },
    {
      label: "Kasir",
      icon: <FileText />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      to: "/cashier",
    },
    {
      label: "Laporan Harian",
      icon: <ClipboardList />,
      color: "text-default-600",
      bg: "bg-default-100",
      to: "/reports/revenue",
    },
  ];

  const navigate = useNavigate();

  return (
    <Card className="border-none bg-content1" shadow="sm">
      <CardHeader className="pb-0 pt-5 px-5 flex-col items-start">
        <h3 className="font-bold text-default-800">Aksi Cepat</h3>
      </CardHeader>
      <CardBody className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, i) => (
            <Card
              key={i}
              isPressable
              className="border border-default-100 hover:border-primary-200 bg-transparent shadow-none"
              onPress={() => navigate(action.to)}
            >
              <CardBody className="flex flex-col items-center justify-center p-4 group">
                <div
                  className={`${action.bg} ${action.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}
                >
                  {cloneElement(
                    action.icon as React.ReactElement,
                    { size: 22 } as any,
                  )}
                </div>
                <span className="text-[10px] font-bold text-default-600 text-center uppercase tracking-wider">
                  {action.label}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

import { PlusCircle, FileText, UserPlus, ClipboardList } from "lucide-react";
import { cloneElement } from "react";
import { useNavigate } from "react-router-dom";

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
      color: "text-slate-600",
      bg: "bg-slate-50",
      to: "/reports/revenue",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h3 className="font-bold text-slate-800 mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            className="flex cursor-pointer flex-col items-center justify-center p-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all group"
            onClick={() => navigate(action.to)}
          >
            <div
              className={`${action.bg} ${action.color} p-3 rounded-lg mb-2 group-hover:scale-110 transition-transform`}
            >
              {cloneElement(
                action.icon as React.ReactElement,
                { size: 20 } as any,
              )}
            </div>
            <span className="text-[11px] font-semibold text-slate-600 text-center uppercase tracking-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Note: Tambahkan import { cloneElement } from "react"; di bagian atas

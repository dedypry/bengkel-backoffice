export function ServiceQueue() {
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
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold text-slate-700">Antrean Workshop</h2>
        <button className="text-sm text-primary font-medium">
          Lihat Semua
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-4">Kendaraan</th>
              <th className="p-4">Mekanik</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item, i) => (
              <tr
                key={i}
                className="border-t hover:bg-slate-50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium">{item.vehicle}</div>
                  <div className="text-xs text-slate-400">{item.plate}</div>
                </td>
                <td className="p-4 text-slate-600">{item.mechanic}</td>
                <td className="p-4 w-48">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.status === "Selesai"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

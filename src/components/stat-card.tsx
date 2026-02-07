import type { ElementType } from "react";

import { Card, CardBody } from "@heroui/react";

interface Props {
  label: string;
  val: string;
  icon: ElementType;
  color: string;
  bg: string;
}
export default function StatCard(stat: Props) {
  return (
    <Card className="shadow-md shadow-gray-100 border border-gray-200">
      <CardBody className="flex flex-row gap-5 items-center">
        <div className={`${stat.bg} ${stat.color} p-4 rounded-sm`}>
          <stat.icon size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase">
            {stat.label}
          </p>
          <p className="text-lg font-semibold text-slate-600">{stat.val}</p>
        </div>
      </CardBody>
    </Card>
  );
}

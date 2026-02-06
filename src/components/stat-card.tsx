import type { ElementType } from "react";

import { Card, CardBody, CardFooter } from "@heroui/react";

interface Props {
  label: string;
  val: string;
  icon: ElementType;
  color: string;
  bg: string;
}
export default function StatCard(stat: Props) {
  return (
    <Card className=" shadow-lg shadow-gray-100">
      <CardBody className="flex gap-5 items-center">
        <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
          <stat.icon size={24} />
        </div>
        <CardFooter>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {stat.label}
          </p>
          <p className="text-xl font-semibold text-slate-600">{stat.val}</p>
        </CardFooter>
      </CardBody>
    </Card>
  );
}

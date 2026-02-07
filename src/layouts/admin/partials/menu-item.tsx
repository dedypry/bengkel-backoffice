import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function MenuItem({ item, selected }: any) {
  const Icon = item.icon;

  return (
    <>
      <div className="flex gap-2 items-center mt-5 pb-1 text-gray-300">
        <Icon size={15} />
        <p className="text-xs uppercase ">{item.header}</p>
      </div>
      <ul className="flex flex-col pl-1 ml-2 border-l-1 border-white/30">
        {item.items.map(({ title, icon, href }: any, j: number) => {
          const url = `${item.urlParent}/${href}`;
          const Icon =
            icon && (LucideIcons as any)[icon]
              ? (LucideIcons as any)[icon]
              : LucideIcons.SquareTerminal;

          return (
            <Link
              key={j}
              className={`sidebar-item text-md pl-2 ${selected === url ? "bg-white text-gray-800" : "text-white"}`}
              to={url}
            >
              <div className="flex gap-2 items-center">
                <Icon size={18} /> <p>{title}</p>
              </div>
            </Link>
          );
        })}
      </ul>
    </>
  );
}

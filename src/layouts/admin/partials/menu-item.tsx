import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { ChevronDown } from "lucide-react";

export default function MenuItem({ item, selected }: any) {
  const Icon = item.icon;
  const { t } = useTranslation();

  const isChildSelected = item.items?.some(
    ({ href, external }: any) =>
      !external && selected === `${item.urlParent}/${href}`,
  );

  const [open, setOpen] = useState<boolean>(isChildSelected);

  useEffect(() => {
    if (isChildSelected) setOpen(true);
  }, [isChildSelected]);

  return (
    <>
      <button
        className="flex w-full gap-2 items-center mt-5 pb-1 text-gray-300 hover:text-white transition-colors"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon size={15} />
        <p className="text-xs uppercase flex-1 text-left">
          {item.i18nKey ? t(item.i18nKey) : item.header}
        </p>
        <ChevronDown
          className={`transition-transform mr-2 ${open ? "rotate-180" : ""}`}
          size={14}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col pl-1 ml-2 border-l-1 border-white/30">
            {item.items.map(
              ({ title, icon, href, external, i18nKey }: any, j: number) => {
                const Icon =
                  icon && (LucideIcons as any)[icon]
                    ? (LucideIcons as any)[icon]
                    : LucideIcons.SquareTerminal;

                if (external) {
                  const url = item.companyId
                    ? `${href}?company_id=${item.companyId}`
                    : href;

                  return (
                    <a
                      key={j}
                      className="sidebar-item text-md pl-2 text-white"
                      href={url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div className="flex gap-2 items-center">
                        <Icon size={18} /> <p>{i18nKey ? t(i18nKey) : title}</p>
                      </div>
                    </a>
                  );
                }

                const url = `${item.urlParent}/${href}`;

                return (
                  <Link
                    key={j}
                    className={`sidebar-item text-md pl-2 ${selected === url ? "bg-white text-gray-800" : "text-white"}`}
                    to={url}
                  >
                    <div className="flex gap-2 items-center">
                      <Icon size={18} /> <p>{i18nKey ? t(i18nKey) : title}</p>
                    </div>
                  </Link>
                );
              },
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings2,
  SquareTerminal,
  CarFront,
  Package,
  ClipboardList,
  FileBarChart,
  Receipt,
  Users,
  ShoppingCart,
  Book,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { hasRoles } from "@/utils/helpers/roles";
import { useAppSelector } from "@/stores/hooks";

const iconMap: Record<string, React.ElementType> = {
  Settings2: Settings2,
  SquareTerminal: SquareTerminal,
  CarFront: CarFront,
  Package: Package,
  ClipboardList: ClipboardList,
  FileBarChart: FileBarChart,
  Receipt: Receipt,
  Users: Users,
  ShoppingCart: ShoppingCart,
  Book,
};

export function NavMain({ header }: { header?: string }) {
  const { navigations } = useAppSelector((state) => state.auth);
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      {header && (
        <SidebarGroupLabel className="font-bold text-[10px] uppercase tracking-widest text-slate-400">
          {header}
        </SidebarGroupLabel>
      )}

      <SidebarMenu>
        {navigations.map((item) => {
          const isParentActive = pathname.startsWith(item.url);
          const hasSubItems = item.items && item.items.length > 0;
          const Icon = item.icon ? iconMap[item.icon] : SquareTerminal;

          if (item.roles && item.roles.length > 0 && !hasRoles(item.roles)) {
            return;
          }

          return hasSubItems ? (
            <Collapsible
              key={item.title}
              asChild
              className="group/collapsible"
              defaultOpen={isParentActive}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className="data-[active=true]:bg-primary/70 hover:text-gray-300"
                    isActive={isParentActive}
                    tooltip={item.title}
                  >
                    {Icon && (
                      <Icon className={isParentActive ? "text-gray-100" : ""} />
                    )}
                    <span
                      className={
                        isParentActive ? "text-gray-100 font-light" : ""
                      }
                    >
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent transition-all duration-300 ease-in-out">
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const url = `${item.url}/${subItem.url}`;
                      const isSubActive = pathname === url;

                      if (
                        subItem.roles &&
                        subItem.roles.length > 0 &&
                        !hasRoles(subItem.roles)
                      ) {
                        return;
                      }

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="data-[active=true]:text-white py-4 hover:text-gray-300"
                            isActive={isSubActive}
                            title={subItem.title}
                          >
                            <Link to={url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="data-[active=true]:bg-primary data-[active=true]:text-white hover:text-gray-300"
                isActive={pathname === item.url}
              >
                <Link to={item.url}>
                  {Icon && <Icon />}
                  <span
                    className={pathname === item.url ? "font-semibold" : ""}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

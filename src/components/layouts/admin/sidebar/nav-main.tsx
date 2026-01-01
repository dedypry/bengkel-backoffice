import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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

export function NavMain({
  header,
  items,
}: {
  header?: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup>
      {header && (
        <SidebarGroupLabel className="font-bold text-[10px] uppercase tracking-widest text-slate-400">
          {header}
        </SidebarGroupLabel>
      )}

      <SidebarMenu>
        {items.map((item) => {
          const isParentActive = pathname.startsWith(item.url);
          const hasSubItems = item.items && item.items.length > 0;

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
                    className="data-[active=true]:bg-violet-50   hover:text-gray-300"
                    isActive={isParentActive}
                    tooltip={item.title}
                  >
                    {item.icon && (
                      <item.icon
                        className={isParentActive ? "text-primary" : ""}
                      />
                    )}
                    <span
                      className={isParentActive ? "font-bold text-white" : ""}
                    >
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent transition-all duration-300 ease-in-out">
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubActive = pathname === subItem.url;

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="data-[active=true]:text-white data-[active=true]:font-semibold py-4 hover:text-gray-300"
                            isActive={isSubActive}
                          >
                            <Link to={subItem.url}>
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
                  {item.icon && <item.icon />}
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

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
import { hasRoles } from "@/utils/helpers/roles";

export function NavMain({
  header,
  items,
}: {
  header?: string;
  items: {
    roles?: string[];
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      roles?: string[];
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
                    {item.icon && (
                      <item.icon
                        className={isParentActive ? "text-gray-100" : ""}
                      />
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

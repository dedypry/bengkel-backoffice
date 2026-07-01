import { cn } from "@/lib/utils";

export function sidebarItemRowClass(active?: boolean) {
  return cn(
    "group relative flex w-full min-w-0 items-center gap-2.5 rounded-sm py-2.5 pl-2.5 pr-3 text-sm font-medium",
    "transition-colors duration-200 ease-out",
    "text-white hover:bg-white/10 hover:text-white",
    active && "bg-white text-gray-800 shadow-sm",
  );
}

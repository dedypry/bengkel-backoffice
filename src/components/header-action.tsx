import type { ElementType } from "react";

import { Button } from "./ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

interface Props {
  leadIcon: ElementType;
  actionIcon: ElementType;
  title: string;
  subtitle: string;
  actionTitle: string;
  onAction: () => void;
}
export default function HeaderAction({
  leadIcon: LeadIcon,
  actionIcon: ActionIcon,
  title,
  subtitle,
  actionTitle,
  onAction,
}: Props) {
  return (
    <Item className="shadow-md shadow-gray-100" variant="outline">
      <ItemMedia className="size-10" variant="icon">
        <LeadIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-xl font-semibold text-slate-900">
          {title}
        </ItemTitle>
        <ItemDescription>{subtitle}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button onClick={onAction}>
          <ActionIcon className="size-4" /> {actionTitle}
        </Button>
      </ItemActions>
    </Item>
  );
}

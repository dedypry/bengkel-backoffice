import type { ElementType, ReactElement } from "react";

import { UploadIcon } from "lucide-react";

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
  leadIcon?: ElementType;
  actionIcon?: ElementType;
  title: string;
  subtitle: string;
  actionTitle?: string;
  onAction?: () => void;
  isUploadExcel?: boolean;
  onUpload?: () => void;
  actionContent?: ReactElement;
}
export default function HeaderAction({
  leadIcon: LeadIcon,
  actionIcon: ActionIcon,
  title,
  subtitle,
  actionTitle,
  onAction,
  isUploadExcel,
  onUpload,
  actionContent,
}: Props) {
  return (
    <Item className="shadow-md shadow-gray-100" variant="outline">
      {LeadIcon && (
        <ItemMedia className="size-12 rounded-lg" variant="icon">
          <LeadIcon className="size-7 text-primary" />
        </ItemMedia>
      )}

      <ItemContent>
        <ItemTitle className="text-xl font-semibold text-slate-900">
          {title}
        </ItemTitle>
        <ItemDescription>{subtitle}</ItemDescription>
      </ItemContent>
      <ItemActions>
        {actionContent ? (
          actionContent
        ) : (
          <>
            {isUploadExcel && (
              <Button
                className="bg-green-700"
                color="success"
                onClick={onUpload}
              >
                <UploadIcon className="size-4" /> Upload Excel
              </Button>
            )}
            <Button onClick={onAction}>
              {ActionIcon && <ActionIcon className="size-4" />} {actionTitle}
            </Button>
          </>
        )}
      </ItemActions>
    </Item>
  );
}

import type { ElementType, ReactElement } from "react";

import { UploadIcon } from "lucide-react";
import { Button, Card, CardBody } from "@heroui/react";

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
  title,
  subtitle,
  actionTitle,
  actionIcon: ActionIcon,
  onAction,
  isUploadExcel,
  onUpload,
  actionContent,
}: Props) {
  return (
    <Card className="border-none shadow-none">
      <CardBody className="flex flex-col md:flex-row items-center justify-between gap-5 p-5">
        <div className="flex items-center gap-5 w-full">
          {LeadIcon && (
            <div className="flex items-center justify-center size-14 rounded-2xl bg-gray-50 text-gray-700 border border-gray-100 shrink-0">
              <LeadIcon className="size-8" strokeWidth={1.5} />
            </div>
          )}

          <div className="flex flex-col">
            <h1 className="text-md font-black text-gray-500 tracking-tight leading-tight uppercase">
              {title}
            </h1>
            <p className="text-xs text-gray-500 font-medium max-w-md">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          {actionContent ? (
            actionContent
          ) : (
            <>
              {isUploadExcel && (
                <Button
                  className="bg-emerald-50 text-emerald-700 font-bold"
                  startContent={<UploadIcon size={18} />}
                  variant="flat"
                  onPress={onUpload}
                >
                  Upload Excel
                </Button>
              )}
              {actionTitle && (
                <Button
                  color="primary"
                  startContent={ActionIcon && <ActionIcon size={18} />}
                  onPress={onAction}
                >
                  {actionTitle}
                </Button>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

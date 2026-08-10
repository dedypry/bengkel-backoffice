import type { ElementType, ReactElement } from "react";

import { ArrowLeft, UploadIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "@heroui/react";

interface Props {
  leadIcon?: ElementType;
  actionIcon?: ElementType;
  title: string;
  subtitle: string;
  actionTitle?: string;
  onAction?: () => void;
  onBack?: () => void;
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
  onBack,
  isUploadExcel,
  onUpload,
  actionContent,
}: Props) {
  const { t } = useTranslation();

  return (
    <Card className="border-none shadow-none">
      <CardBody className="flex flex-col items-center justify-between gap-5 p-5 md:flex-row">
        <div className="flex w-full items-center gap-5">
          {onBack ? (
            <Button
              isIconOnly
              aria-label={t("common.back")}
              className="shrink-0 rounded-full bg-white shadow-sm"
              variant="flat"
              onPress={onBack}
            >
              <ArrowLeft size={20} />
            </Button>
          ) : null}

          {LeadIcon ? (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-sm border border-gray-100 bg-gray-50 text-gray-700">
              <LeadIcon className="size-8" strokeWidth={1.5} />
            </div>
          ) : null}

          <div className="flex flex-col">
            <h1 className="text-md font-black uppercase leading-tight tracking-tight text-gray-500">
              {title}
            </h1>
            <p className="max-w-md text-xs font-medium text-gray-500">
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
                  {t("common.upload_excel")}
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

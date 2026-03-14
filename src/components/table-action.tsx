import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  DropdownSection,
} from "@heroui/react";

import { confirmSweat } from "@/utils/helpers/notify";

interface Item {
  title: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  onPress: () => void;
}
interface Props {
  onEdit?: () => void;
  onDetail?: () => void;
  onDelete?: () => void;
  viewDetail?: boolean;
  viewHeader?: boolean;
  viewEdit?: boolean;
  isDeleteSeparator?: boolean;
  titleHeader?: string;
  items?: Item[];
}

export default function TableAction({
  onDelete,
  onDetail,
  onEdit,
  viewDetail = true,
  viewHeader,
  viewEdit = true,
  titleHeader,
  items,
}: Props) {
  return (
    <Dropdown backdrop="transparent" placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          className="text-gray-400 hover:text-gray-900 transition-colors"
          radius="full"
          variant="light"
        >
          <MoreVertical size={20} />
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Aksi Tabel"
        disabledKeys={onDelete ? [] : ["delete"]}
        variant="flat"
      >
        <DropdownSection
          showDivider={viewHeader}
          title={viewHeader ? titleHeader || "Aksi" : undefined}
        >
          <>
            {(items || []).map(({ title, icon: Icon, onPress }, idx) => (
              <DropdownItem
                key={`custom-${idx}`}
                startContent={
                  Icon ? <Icon className="text-gray-500" size={18} /> : null
                }
                onPress={onPress}
              >
                {title}
              </DropdownItem>
            ))}
          </>

          {viewDetail ? (
            <DropdownItem
              key="detail"
              startContent={<Eye className="text-gray-500" size={18} />}
              onPress={onDetail}
            >
              Lihat Detail
            </DropdownItem>
          ) : (
            <DropdownItem key="spacer-detail" className="hidden" />
          )}

          {viewEdit ? (
            <DropdownItem
              key="edit"
              startContent={<Edit className="text-gray-500" size={18} />}
              onPress={onEdit}
            >
              Edit Data
            </DropdownItem>
          ) : (
            <DropdownItem key="spacer-edit" className="hidden" />
          )}
        </DropdownSection>

        <DropdownSection showDivider={false}>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            description="Tindakan ini tidak dapat dibatalkan"
            startContent={<Trash2 size={18} />}
            onPress={() => confirmSweat(onDelete!)}
          >
            Hapus
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}

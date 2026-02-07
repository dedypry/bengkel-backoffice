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

interface Props {
  onEdit?: () => void;
  onDetail?: () => void;
  onDelete?: () => void;
  viewDetail?: boolean;
  viewHeader?: boolean;
  isDeleteSeparator?: boolean;
  titleHeader?: string;
}

export default function TableAction({
  onDelete,
  onDetail,
  onEdit,
  viewDetail = true,
  viewHeader,
  titleHeader,
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

          <DropdownItem
            key="edit"
            startContent={<Edit className="text-gray-500" size={18} />}
            onPress={onEdit}
          >
            Edit Data
          </DropdownItem>
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

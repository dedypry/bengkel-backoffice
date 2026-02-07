import { Upload } from "lucide-react";
import { Avatar, Button } from "@heroui/react";

import { getAvatarByName } from "@/utils/helpers/global";

interface Props {
  value: any;
  onChange: (val: any) => void;
  field?: any;
  buttonTitle?: string;
  isInvalid?: boolean;
}

export default function UploadAvatar({
  value,
  onChange,
  buttonTitle,
  isInvalid,
}: Props) {
  // Logic preview tetap sama
  const photoPreview =
    value && typeof value === "string"
      ? value
      : value instanceof File || value instanceof Blob
        ? URL.createObjectURL(value)
        : getAvatarByName("kar");

  return (
    <div
      className={`flex flex-col items-center gap-4 p-6 border-2 border-dashed transition-colors rounded-sm ${
        isInvalid
          ? "border-danger bg-danger-50/20"
          : "border-default-200 bg-default-50/50 hover:border-primary-300"
      }`}
    >
      {/* Avatar HeroUI dengan shadow dan border putih */}
      <Avatar
        isBordered
        className="w-24 h-24 text-large shadow-md bg-white"
        color={isInvalid ? "danger" : "primary"}
        src={photoPreview}
      />

      <div className="flex flex-col items-center gap-2">
        {/* Menggunakan Button HeroUI sebagai label trigger */}
        <Button
          as="label"
          className="cursor-pointer"
          color={isInvalid ? "danger" : "primary"}
          htmlFor="avatar-upload"
          radius="full"
          size="sm"
          startContent={<Upload size={18} />}
          variant="flat"
        >
          {buttonTitle ?? "Upload Foto"}
          <input
            accept="image/*"
            className="hidden"
            id="avatar-upload"
            type="file"
            onChange={(e) => onChange(e.target.files?.[0])}
          />
        </Button>

        <p
          className={`text-tiny text-center ${
            isInvalid ? "text-danger" : "text-gray-500"
          }`}
        >
          Format: JPG, PNG. Maksimal 5MB.
        </p>
      </div>
    </div>
  );
}

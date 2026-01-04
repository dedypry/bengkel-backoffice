import { Upload } from "lucide-react";

import { Avatar, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";

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
  field,
  buttonTitle,
  isInvalid,
}: Props) {
  const photoPreview =
    value && typeof value === "string"
      ? value
      : value instanceof File || value instanceof Blob
        ? URL.createObjectURL(value)
        : getAvatarByName("kar");

  return (
    <div
      className={`flex flex-col items-center gap-4 p-6 border-2 border-dashed ${isInvalid ? "border-red-200 bg-red-50/50" : "border-slate-200 bg-slate-50/50"} rounded-2xl `}
    >
      <Avatar className="size-24 border-4 border-white shadow-lg">
        <AvatarImage src={photoPreview} />
      </Avatar>
      <label
        className="flex gap-2 bg-primary py-1 px-4 rounded-md text-white items-center cursor-pointer"
        htmlFor="avatar-upload"
      >
        <Upload size={18} />
        <span className="text-sm">{buttonTitle ?? "Upload Foto"}</span>
      </label>
      <Input
        accept="image/*"
        className="hidden"
        id="avatar-upload"
        type="file"
        onChange={(e) => onChange(e.target.files?.[0])}
        {...field}
      />
      <p
        className={`text-xs ${isInvalid ? "text-red-500" : "text-slate-500"} mt-2`}
      >
        Format: JPG, PNG. Maksimal 5MB.
      </p>
    </div>
  );
}

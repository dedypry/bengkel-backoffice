import { useCallback, useEffect } from "react";
import Dropzone from "react-dropzone";
import { UploadCloud, X, Plus } from "lucide-react";

import Excel from "@/assets/images/excel.png";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  value?: any[];
  onFileSelect: (files: any[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  label?: string;
  placeholder?: string;
}

type PreviewItem = {
  src: string | null;
  name: string;
};

function getFileName(item: unknown): string {
  if (!item) return "";

  if (item instanceof File) {
    return item.name;
  }

  if (item instanceof Blob) {
    return ((item as File).name as string) || "";
  }

  if (typeof item === "string") {
    const path = item.split("?")[0];

    return path.split("/").pop() || item;
  }

  if (typeof item === "object") {
    const file = item as Record<string, string>;

    return (
      file.original_name ||
      file.originalName ||
      file.name ||
      file.filename ||
      ""
    );
  }

  return "";
}

function getPreviewSrc(item: unknown): string | null {
  if (!item) return null;

  if (typeof item === "string") {
    const isExcel = item.endsWith("xlsx") || item.endsWith("xls");

    if (isExcel) {
      return Excel;
    }

    return item;
  }

  if (item instanceof File || item instanceof Blob) {
    const name = ((item as File).name as string) || "";
    const isExcel = name.endsWith("xlsx") || name.endsWith("xls");

    if (isExcel) {
      return Excel;
    }

    return URL.createObjectURL(item);
  }

  if (typeof item === "object") {
    const file = item as Record<string, string>;
    const path = file.path || file.url || "";

    if (!path) return null;

    const isExcel = path.endsWith("xlsx") || path.endsWith("xls");

    if (isExcel) {
      return Excel;
    }

    return path;
  }

  return null;
}

export default function FileUploader({
  value = [],
  onFileSelect,
  accept = { "image/*": [".jpeg", ".png", ".jpg"] },
  maxFiles = 5, // Default ditingkatkan untuk multiple
  maxSize = 5000000,
  className,
  label = "",
  placeholder = "Unggah berkas Anda di sini",
}: FileUploaderProps) {
  const safeValue = Array.isArray(value) ? value : [];

  const previews: PreviewItem[] = safeValue.map((item) => ({
    src: getPreviewSrc(item),
    name: getFileName(item),
  }));

  useEffect(() => {
    return () => {
      previews.forEach(({ src }) => {
        if (src?.startsWith("blob:")) {
          URL.revokeObjectURL(src);
        }
      });
    };
  }, [previews]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const availableSlots = maxFiles - value.length;
      const filesToAdd = acceptedFiles.slice(0, availableSlots);

      if (filesToAdd.length === 0) return;

      const newFiles = [...safeValue, ...filesToAdd];

      onFileSelect(newFiles);
    },
    [maxFiles, safeValue, onFileSelect],
  );

  const removeFile = (index: number) => {
    const newFiles = safeValue.filter((_, i) => i !== index);

    onFileSelect(newFiles);
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <p className="m-0 text-sm font-medium text-slate-700">{label}</p>
      <div
        className={cn(
          "grid grid-cols-2 md:grid-cols-4 gap-4  p-2 items-center",
          previews.length > 0
            ? "border border-gray-300 border-dashed rounded-sm"
            : "",
          "transition-all",
        )}
      >
        {/* Tampilkan Berkas yang Sudah Dipilih */}
        {previews?.map((preview, index) => (
          <div key={index} className="space-y-1 min-w-0">
            <div className="relative group aspect-square rounded-sm overflow-hidden border border-gray-200 hover:border-primary bg-slate-50">
              {preview.src ? (
                <img
                  alt={preview.name || `photo-${index}`}
                  className="object-cover w-full h-full"
                  src={preview.src}
                />
              ) : (
                <div className="flex items-center justify-center h-full p-2 text-center text-[10px] break-all">
                  {`photo-${index}`}
                </div>
              )}
              <button
                className="absolute top-2 right-2 p-1 cursor-pointer bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                type="button"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            {preview.name ? (
              <p
                className="m-0 px-1 text-[10px] text-slate-600 text-center truncate"
                title={preview.name}
              >
                {preview.name}
              </p>
            ) : null}
          </div>
        ))}
        {/* Tombol Add File (Muncul jika belum mencapai limit) */}
        {value.length < maxFiles && (
          <Dropzone
            accept={accept}
            maxSize={maxSize}
            multiple={maxFiles > 1}
            onDrop={onDrop}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer",
                  "hover:bg-slate-50 hover:border-primary/50 text-slate-400 hover:text-primary h-50 w-full",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-slate-200",
                  value.length > 0 ? "p-2" : "col-span-full py-10", // Lebar penuh jika belum ada file
                )}
              >
                <input {...getInputProps()} />
                {value.length > 0 ? (
                  <>
                    <Plus className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-medium text-center">
                      Tambah
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-white rounded-full shadow-sm border group-hover:border-primary/50">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        {placeholder}
                      </p>
                      <p className="text-xs text-slate-500">
                        Maksimal {maxFiles} berkas
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}

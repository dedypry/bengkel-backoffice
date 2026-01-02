import { useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { UploadCloud, X, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface FileUploaderProps {
  value?: any[];
  onFileSelect: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  label?: string;
  placeholder?: string;
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const safeValue = Array.isArray(value) ? value : [];

  useEffect(() => {
    const files = safeValue.filter((v) => v instanceof File) as File[];

    if (files.length !== selectedFiles.length) {
      setSelectedFiles(files);
    }
  }, [safeValue]);

  const previews = safeValue.map((e) => {
    if (!e) return null;
    if (typeof e === "string") return e; // URL string (dari database/hosting)
    if (e instanceof File || e instanceof Blob) {
      return URL.createObjectURL(e); // File mentah (baru dipilih)
    }

    return null;
  });

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Menghitung sisa slot yang tersedia
      const availableSlots = maxFiles - value.length;
      const filesToAdd = acceptedFiles.slice(0, availableSlots);

      if (filesToAdd.length === 0) return;

      const newFiles = [...selectedFiles, ...filesToAdd];

      setSelectedFiles(newFiles);
      onFileSelect(newFiles);
    },
    [onFileSelect, selectedFiles, maxFiles],
  );

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <p className="m-0 text-sm font-medium text-slate-700">{label}</p>
      <div
        className={cn(
          "grid grid-cols-2 md:grid-cols-4 gap-4  p-2 items-center",
          selectedFiles.length > 0 ? "border-2 border-dashed rounded-xl" : "",
          "transition-all",
        )}
      >
        {/* Tampilkan Berkas yang Sudah Dipilih */}
        {previews?.map((file, index) => (
          <div
            key={index}
            className="relative group aspect-square rounded-xl overflow-hidden border bg-slate-50"
          >
            {file ? (
              <img
                alt={`photo-${index}`}
                className="object-cover w-full h-full"
                src={file}
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

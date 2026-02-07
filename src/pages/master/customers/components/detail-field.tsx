export default function DetailField({
  label,
  value,
  isFullWidth = false,
}: {
  label: string;
  value?: string | null | undefined;
  isFullWidth?: boolean;
}) {
  return (
    <div className={`space-y-1 ${isFullWidth ? "md:col-span-2" : ""}`}>
      <p className="text-[10px] font-black text-gray-400 uppercase">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-black uppercase text-gray-500 ">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

// HELPERS
export function SectionHeader({
  icon,
  title,
  subtitle,
  className = "",
}: {
  icon: any;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-2 bg-gray-500 rounded-sm text-white">{icon}</div>
      <div className="flex flex-col">
        <h2 className="text-sm font-black uppercase text-gray-500">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export function InfoBlock({ label, value }: { label: string; value: any }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
        {label}
      </p>
      <p className="text-[11px] font-bold text-gray-700 uppercase">
        {value || "-"}
      </p>
    </div>
  );
}

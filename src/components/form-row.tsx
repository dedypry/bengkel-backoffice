export default function FormRow({
  label,
  value,
  extra,
}: {
  label: string;
  value: any;
  extra?: any;
}) {
  return (
    <div className="flex text-sm leading-6 items-center">
      <p className="w-24 shrink-0">{label}</p>
      <p className="mr-2">:</p>
      <div className="flex-1 font-medium border-b border-dotted border-gray-300">
        {value}{" "}
        {extra && <span className="ml-2 text-gray-400 text-xs">{extra}</span>}
      </div>
    </div>
  );
}

import { Building2 } from "lucide-react";
import { Image } from "@heroui/react";

type Props = {
  logoUrl?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  variant?: "default" | "on-primary";
};

export default function AuthLogo({
  logoUrl,
  name,
  size = 56,
  className = "",
  variant = "default",
}: Props) {
  const boxClass =
    variant === "on-primary"
      ? "border border-white/20 bg-white"
      : "border border-slate-100 bg-white shadow-md";

  if (logoUrl) {
    return (
      <div className={`inline-flex rounded-2xl p-2 ${boxClass} ${className}`}>
        <Image
          alt={name ?? "Logo"}
          className="object-contain"
          height={size}
          src={logoUrl}
          width={size}
        />
      </div>
    );
  }

  const fallbackBoxClass =
    variant === "on-primary"
      ? "border border-white/20 bg-white/15"
      : "border border-slate-100 bg-primary/10";

  const iconClass = variant === "on-primary" ? "text-white" : "text-primary";

  return (
    <div
      className={`inline-flex rounded-2xl p-3 ${fallbackBoxClass} ${className}`}
    >
      <Building2 className={iconClass} size={Math.round(size * 0.45)} />
    </div>
  );
}

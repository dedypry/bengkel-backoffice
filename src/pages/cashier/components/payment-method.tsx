import { RadioGroup, Radio, cn } from "@heroui/react";
import { Banknote, CreditCard, CheckCircle2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function PaymentMethod({ value, onChange }: Props) {
  const methods = [
    {
      id: "CASH",
      label: "Tunai",
      icon: <Banknote size={22} />,
      description: "Bayar di kasir",
    },
    {
      id: "TRANSFER",
      label: "Transfer",
      icon: <CreditCard size={22} />,
      description: "Bank / E-Wallet",
    },
  ];

  return (
    <RadioGroup
      classNames={{
        wrapper: "gap-3",
      }}
      orientation="horizontal"
      value={value}
      onValueChange={onChange}
    >
      {methods.map((method) => (
        <CustomRadio
          key={method.id}
          description={method.description}
          icon={method.icon}
          isSelected={value === method.id}
          label={method.label}
          value={method.id}
        />
      ))}
    </RadioGroup>
  );
}

// Komponen Internal untuk Custom Radio Card
function CustomRadio({ value, label, description, icon, isSelected }: any) {
  return (
    <Radio
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-1 cursor-pointer rounded-xl gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary border-gray-200 data-[selected=true]:bg-primary-50/20",
        ),
        wrapper: "hidden", // Sembunyikan lingkaran radio standar
        labelWrapper: "ml-0 w-full",
      }}
      value={value}
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-center w-full">
          <div
            className={cn(
              "p-2 rounded-lg transition-colors",
              isSelected
                ? "text-primary bg-primary-100/50"
                : "text-default-400 bg-default-100",
            )}
          >
            {icon}
          </div>
          {isSelected && (
            <CheckCircle2
              className="text-primary animate-in zoom-in duration-300"
              size={18}
            />
          )}
        </div>

        <div className="mt-2">
          <p
            className={cn(
              "text-sm font-bold transition-colors",
              isSelected ? "text-primary" : "text-gray-700",
            )}
          >
            {label}
          </p>
          <p className="text-tiny text-gray-400 font-medium">{description}</p>
        </div>
      </div>
    </Radio>
  );
}

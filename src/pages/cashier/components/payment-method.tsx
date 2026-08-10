import { RadioGroup, Radio, cn } from "@heroui/react";
import { Banknote, CreditCard, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function PaymentMethod({ value, onChange }: Props) {
  const { t } = useTranslation();

  const methods = [
    {
      id: "CASH",
      label: t("cashier.payment.cash"),
      icon: <Banknote size={22} />,
      description: t("cashier.payment.cash_desc"),
    },
    {
      id: "TRANSFER",
      label: t("cashier.payment.transfer"),
      icon: <CreditCard size={22} />,
      description: t("cashier.payment.transfer_desc"),
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
          isSelected={value === method.id}
          label={method.label}
          value={method.id}
        />
      ))}
    </RadioGroup>
  );
}

function CustomRadio({ value, label, description, isSelected }: any) {
  return (
    <Radio
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-1 cursor-pointer rounded-md gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary border-gray-200 data-[selected=true]:bg-primary-50/20",
        ),
        wrapper: "hidden",
        labelWrapper: "ml-0 w-full",
      }}
      value={value}
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-center w-full">
          {isSelected && (
            <CheckCircle2
              className="text-primary animate-in zoom-in duration-300"
              size={18}
            />
          )}
          <div className="ml-5">
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
      </div>
    </Radio>
  );
}

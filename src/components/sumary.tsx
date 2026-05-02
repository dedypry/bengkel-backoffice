import { Controller } from "react-hook-form";

import InputNumber from "./input-number";

interface Props {
  control: any;
  watch: any;
  isDisable?: boolean;
  showTotal?: boolean;
  setValue: any;
  onAction?: () => void;
}
export default function SumaryTable({
  control,
  watch,
  isDisable,
  setValue,
  showTotal,
  onAction,
}: Props) {
  return (
    <div className="space-y-1">
      <InputNumber
        isDisabled
        classNames={{
          input: "text-xs text-right",
          label: "w-20",
          mainWrapper: "w-full",
        }}
        label="Sub Total"
        labelPlacement="outside-left"
        size="sm"
        startContent={<p className="text-xs">Rp</p>}
        value={watch("sub_total") as any}
      />

      <div className="flex gap-1">
        <Controller
          control={control}
          name="disc_percentage"
          render={({ field }) => (
            <InputNumber
              classNames={{
                input: "text-[11px] text-center w-8",
                label: "w-20",
              }}
              endContent={<p className="text-[11px]">%</p>}
              isDisabled={isDisable}
              label="Disc Final"
              labelPlacement="outside-left"
              maxInput={100}
              size="sm"
              value={Number(field.value) as any}
              onInput={(val) => {
                field.onChange(val);
                const subTotal = watch("sub_total") ?? 0;
                const nominal = (val / 100) * subTotal;

                setValue("disc_value", nominal);
                if (onAction) {
                  onAction();
                }
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="disc_value"
          render={({ field }) => (
            <InputNumber
              classNames={{
                input: "text-[11px] text-right",
              }}
              isDisabled={isDisable}
              maxInput={watch("sub_total") ?? 0}
              size="sm"
              startContent={<p className="text-[11px]">Rp</p>}
              value={field.value as any}
              onInput={(val) => {
                field.onChange(val);
                const subTotal = watch("sub_total") ?? 0;

                const percent = (val / subTotal) * 100;

                setValue("disc_percentage", Number(percent.toFixed(2)));
                if (onAction) {
                  onAction();
                }
              }}
            />
          )}
        />
      </div>
      <InputNumber
        isDisabled
        classNames={{
          input: "text-xs text-right",
          label: "w-20",
          mainWrapper: "w-full",
        }}
        label="Pajak"
        labelPlacement="outside-left"
        size="sm"
        startContent={<p className="text-xs">Rp</p>}
        value={watch("tax") as any}
      />
      <Controller
        control={control}
        name="other_fee"
        render={({ field }) => (
          <InputNumber
            classNames={{
              input: "text-xs text-right",
              label: "w-20",
              mainWrapper: "w-full",
            }}
            isDisabled={isDisable}
            label="Biaya Lain"
            labelPlacement="outside-left"
            size="sm"
            startContent={<p className="text-xs">Rp</p>}
            value={Number(field.value) as any}
            onInput={(val) => {
              field.onChange(val);
              if (onAction) {
                onAction();
              }
            }}
          />
        )}
      />
      {(isDisable || showTotal) && (
        <InputNumber
          isDisabled
          classNames={{
            input: "text-sm !font-bold text-right",
            label: "w-20 text-sm",
            mainWrapper: "w-full",
          }}
          label="Total"
          labelPlacement="outside-left"
          size="sm"
          startContent={<p className="text-xs">Rp</p>}
          value={watch("total") as any}
        />
      )}
    </div>
  );
}

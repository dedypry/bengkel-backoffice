import React from "react";
import { IMaskInput } from "react-imask";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const NpwpMask = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <IMaskInput
        {...other}
        overwrite
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        mask="00.000.000.0-000.000"
        onAccept={(value: any) =>
          onChange({
            target: { name: props.name, value: value?.replace(/\D/g, "") },
          })
        }
      />
    );
  },
);

export const PhoneMask = React.forwardRef<HTMLInputElement, any>(
  function PhoneMaskAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <IMaskInput
        {...other}
        overwrite
        definitions={{
          "0": /[0-9]/,
        }}
        inputRef={ref}
        mask="0000-0000-00000"
        onAccept={(value: any) => {
          onChange({
            target: { name: props.name, value: value?.replace(/\D/g, "") },
          });
        }}
      />
    );
  },
);

export const FaxMask = React.forwardRef<HTMLInputElement, any>(
  function FaxMaskAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <IMaskInput
        {...other}
        overwrite
        definitions={{
          "0": /[0-9]/,
        }}
        inputRef={ref}
        mask="(000) 000-00000"
        onAccept={(value: any) =>
          onChange({
            target: { name: props.name, value: value.replace(/\D/g, "") },
          })
        }
      />
    );
  },
);

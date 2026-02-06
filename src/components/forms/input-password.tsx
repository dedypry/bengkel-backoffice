import { Input, Button, InputProps } from "@heroui/react";
import { LockKeyhole, Eye, EyeClosed } from "lucide-react";
import { forwardRef, useState } from "react";

function InputPassword(
  { ...props }: InputProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const [isPassword, setIsPassword] = useState(false);

  return (
    <Input
      ref={ref}
      classNames={{
        label: "text-gray-800",
      }}
      color="primary"
      endContent={
        <Button
          isIconOnly
          radius="full"
          size="sm"
          variant="light"
          onPress={() => setIsPassword(!isPassword)}
        >
          {isPassword ? (
            <Eye className={props.isInvalid ? "text-danger" : ""} />
          ) : (
            <EyeClosed className={props.isInvalid ? "text-danger" : ""} />
          )}
        </Button>
      }
      label="Password"
      labelPlacement="outside"
      placeholder="Masukan password"
      startContent={
        <LockKeyhole
          className={props.isInvalid ? "text-danger" : "text-secondary-600"}
          size={20}
        />
      }
      type={!isPassword ? "password" : "text"}
      variant="bordered"
      {...props}
    />
  );
}

export default forwardRef(InputPassword);

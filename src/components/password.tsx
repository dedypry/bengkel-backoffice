import { IconButton, Input, type InputProps } from "@mui/joy";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export default function Password({ ...props }: InputProps) {
  const [isPassword, setPassword] = useState(false);

  return (
    <Input
      endDecorator={
        <IconButton onClick={() => setPassword(!isPassword)}>
          {isPassword ? <EyeClosed /> : <Eye />}
        </IconButton>
      }
      placeholder="****"
      type={isPassword ? "password" : "text"}
      {...props}
    />
  );
}

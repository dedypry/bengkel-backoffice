import { Input, type InputProps } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState, forwardRef } from "react";

const Password = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      {...props}
      ref={ref}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeOff className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <Eye className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      placeholder={props.placeholder || "****"}
      type={isVisible ? "text" : "password"}
    />
  );
});

Password.displayName = "Password";

export default Password;

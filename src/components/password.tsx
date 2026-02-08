import { Input, type InputProps } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Password({ ...props }: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      placeholder="****"
      {...props}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeOff className="text-2xl text-gray-400 cursor-pointer" />
          ) : (
            <Eye className="text-2xl text-gray-400 cursor-pointer" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
    />
  );
}

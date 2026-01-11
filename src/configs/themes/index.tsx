import { extendTheme } from "@mui/joy";

import { colorSchema } from "./colors";
import { componentStyle } from "./components";

export const theme = extendTheme({
  radius: {
    sm: "5px",
    md: "7px",
    lg: "10px",
  },
  typography: {
    "body-sm": { fontSize: "12px" },
    "body-md": { fontSize: "14px" },
  },
  colorSchemes: colorSchema,
  fontFamily: {
    body: "Poppins, var(--joy-fontFamily-fallback)",
    display: "Poppins, var(--joy-fontFamily-fallback)",
  },
  components: componentStyle,
});

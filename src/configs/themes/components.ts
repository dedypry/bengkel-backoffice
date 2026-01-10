import type { Components, Theme } from "@mui/joy";

import { forms } from "./forms";
import { button } from "./button";

export const componentStyle: Components<Theme> | undefined = {
  ...forms,
  ...button,
  JoySheet: {
    styleOverrides: {
      root: () => ({
        overflow: "auto",
      }),
    },
  },
  JoyChip: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        ...(ownerState.size == "sm" && {
          height: "10px",
          fontSize: 10,
          "--Chip-decoratorChildSize": "15px",
          "& .MuiChip-startDecorator, & .MuiChip-endDecorator": {
            "& svg": {
              fontSize: "15px",
              width: "15px",
              height: "15px",
            },
          },
        }),
        ...(ownerState.size == "md" && {
          height: "14px",
          fontSize: 12,
          "--Chip-decoratorChildSize": "17px",
          "& .MuiChip-startDecorator, & .MuiChip-endDecorator": {
            "& svg": {
              fontSize: "17px",
              width: "17px",
              height: "17px",
            },
          },
        }),
        ...(ownerState.size == "lg" && {
          "--Chip-decoratorChildSize": "18px",
          "& .MuiChip-startDecorator, & .MuiChip-endDecorator": {
            "& svg": {
              fontSize: "18px",
              width: "18px",
              height: "18px",
            },
          },
          height: "18px",
          fontSize: 14,
        }),
      }),
    },
  },
  JoyTable: {
    styleOverrides: {
      root: () => ({
        "& thead th:not([colspan])": {
          borderBottom: "2px solid var(--TableCell-borderColor)",
          whiteSpace: "nowrap",
        },
        "& th": {
          whiteSpace: "nowrap",
          fontSize: "12px",
          textTransform: "uppercase",
          color: "neutral.600",
        },
        "& td": {
          whiteSpace: "nowrap",
          verticalAlign: "middle",
        },
      }),
    },
  },
  JoyCard: {
    defaultProps: {
      size: "lg",
    },
    styleOverrides: {
      root: ({ ownerState }) => ({
        ...(ownerState.variant == "outlined" && {
          backgroundColor: "white",
        }),
      }),
    },
  },
  JoyFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: 14,
        color: theme.palette.neutral[700],
      }),
    },
  },
};

import type { Components, Theme } from "@mui/joy";

export const button: Components<Theme> | undefined = {
  JoyButton: {
    styleOverrides: {
      root: ({ ownerState, theme }) => {
        const colorSelector = ownerState.color || "primary";
        const shadowColor = ownerState.disabled
          ? theme.vars.palette.neutral.mainChannel
          : theme.vars.palette[colorSelector].mainChannel;

        return {
          fontWeight: 500,
          transition: "all 0.2s",
          boxShadow: `0 4px 12px 0 rgba(${shadowColor} / 0.25), 0 2px 4px -1px rgba(${shadowColor} / 0.25)`,
          "&:hover": {
            transform: "translateY(-2px)",
          },

          // Shadow khusus saat ditekan (active)
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "none",
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.neutral[200], // Jadi abu-abu
            color: theme.palette.neutral[500],
            cursor: "not-allowed",
            border: "none",
          },
          ...(ownerState.size === "sm" && {
            minHeight: "28px",
            maxHeight: "28px",
            paddingInline: "12px",
            fontSize: 12,
          }),
        };
      },
    },
  },
};

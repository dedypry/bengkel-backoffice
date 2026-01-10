import type { Components, Theme } from "@mui/joy";

export const forms: Components<Theme> | undefined = {
  JoyInput: {
    styleOverrides: {
      root: ({ ownerState, theme }) => {
        return {
          "--Input-focusedThickness": "1.3px",
          ...(ownerState.size === "sm" && {
            "& .MuiInput-startDecorator, & .MuiInput-endDecorator": {
              "--Icon-fontSize": "16px",
              "& svg": {
                fontSize: "16px",
                width: "16px",
                height: "16px",
              },
            },
          }),
          ...(ownerState.size === "md" && {
            "& .MuiInput-startDecorator, & .MuiInput-endDecorator": {
              "--Icon-fontSize": "18px",
              "& svg": {
                fontSize: "18px",
                width: "18px",
                height: "18px",
              },
            },
          }),
          ...(ownerState.variant != "solid" && {
            "&::before": {
              border: "1.5px solid var(--Input-focusedHighlight)",
              transform: "scaleX(0)",
              left: "2.5px",
              right: "2.5px",
              bottom: 0,
              top: "unset",
              transition: "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
              borderRadius: 0,
              borderBottomLeftRadius: "64px 20px",
              borderBottomRightRadius: "64px 20px",
              lineHeight: "normal",
            },
            "&:focus-within::before": {
              transform: "scaleX(1)",
            },
            ...(ownerState.error && {
              "--Input-decoratorColor": theme.vars.palette.danger[500],
              "& [class*='JoyInput-decorator']": {
                color: theme.vars.palette.danger[500],
              },
              "& svg": {
                color: theme.vars.palette.danger[500],
              },
              borderColor: theme.vars.palette.danger[500],
            }),
          }),
        };
      },
    },
  },
  JoyTextarea: {
    defaultProps: {
      minRows: 3,
      maxRows: 5,
    },
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        "--Textarea-focusedThickness": "1.3px",
        borderRadius: "4px",
        // Samakan ukuran icon dekorator
        ...(ownerState.size === "sm" && {
          "& .MuiTextarea-startDecorator, & .MuiTextarea-endDecorator": {
            "--Icon-fontSize": "16px",
            "& svg": { fontSize: "16px", width: "16px", height: "16px" },
          },
        }),
        // Samakan efek garis bawah & error
        ...(ownerState.variant !== "solid" && {
          "&::before": {
            border: "1.5px solid var(--Textarea-focusedHighlight)",
            transform: "scaleX(0)",
            left: "2.5px",
            right: "2.5px",
            bottom: 0,
            top: "unset",
            transition: "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
            borderRadius: 0,
            borderBottomLeftRadius: "64px 20px",
            borderBottomRightRadius: "64px 20px",
          },
          "&:focus-within::before": { transform: "scaleX(1)" },
          ...(ownerState.error && {
            "& [class*='JoyTextarea-decorator'], & svg": {
              color: theme.vars.palette.danger[500],
            },
            borderColor: theme.vars.palette.danger[500],
          }),
        }),
      }),
    },
  },
  JoyAutocomplete: {
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        "--Autocomplete-focusedThickness": "1.3px",
        borderRadius: "4px",

        // Samakan ukuran icon dekorator berdasarkan size
        ...((ownerState.size === "sm" || !ownerState.size) && {
          "& .MuiAutocomplete-startDecorator, & .MuiAutocomplete-endDecorator, & .MuiAutocomplete-popupIndicator":
            {
              "--Icon-fontSize": "16px",
              "& svg": { fontSize: "16px", width: "16px", height: "16px" },
            },
        }),
        ...(ownerState.size === "md" && {
          "& .MuiAutocomplete-startDecorator, & .MuiAutocomplete-endDecorator, & .MuiAutocomplete-popupIndicator":
            {
              "--Icon-fontSize": "18px",
              "& svg": { fontSize: "18px", width: "18px", height: "18px" },
            },
        }),

        // Samakan efek garis bawah (animasi) & error
        ...(ownerState.variant !== "solid" && {
          "&::before": {
            border: "1.5px solid var(--Autocomplete-focusedHighlight)",
            transform: "scaleX(0)",
            left: "2.5px",
            right: "2.5px",
            bottom: 0,
            top: "unset",
            transition: "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
            borderRadius: 0,
            borderBottomLeftRadius: "64px 20px",
            borderBottomRightRadius: "64px 20px",
          },
          "&:focus-within::before": {
            transform: "scaleX(1)",
          },
          ...(ownerState.error && {
            "--Autocomplete-decoratorColor": theme.vars.palette.danger[500],
            "& [class*='JoyAutocomplete-decorator'], & svg": {
              color: theme.vars.palette.danger[500],
            },
            borderColor: theme.vars.palette.danger[500],
          }),
        }),
      }),
      listbox: ({ theme }) => ({
        // Terapkan limit tinggi agar scrollbar muncul
        maxHeight: "300px",
        overflow: "auto",

        // 1. Ukuran Scrollbar
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        // 2. Track (Jalur)
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        // 3. Thumb (Batang)
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0, 0, 0, 0.05)",
          borderRadius: "20px",
          transition: "background 0.2s ease",
        },
        // 4. Hover State
        "&:hover::-webkit-scrollbar-thumb": {
          background: "rgba(0, 0, 0, 0.15)",
        },
        // 5. Thumb Hover (Saat kursor tepat di atas batang)
        "&::-webkit-scrollbar-thumb:hover": {
          background: theme.vars.palette.primary[400], // Menggunakan #168BAB
        },

        // Dark Mode Support
        [theme.getColorSchemeSelector("dark")]: {
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.1)",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.2)",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: theme.vars.palette.primary[500],
          },
        },
      }),
      // Opsional: Menyesuaikan ukuran teks di dalam list opsi agar serasi (12px)
      option: {
        fontSize: "14px",
        paddingBlock: "2px",
      },
    },
  },
};

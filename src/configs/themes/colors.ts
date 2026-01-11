import type { ColorSystemOptions } from "@mui/joy/styles/extendTheme";
import type { DefaultColorScheme } from "@mui/joy/styles/types";

export const colorSchema:
  | Partial<Record<DefaultColorScheme, ColorSystemOptions>>
  | undefined = {
  light: {
    palette: {
      warning: {
        50: "#fff8e1", // Sangat krem
        100: "#ffecb3",
        200: "#ffe082",
        300: "#ffd54f",
        400: "#ffca28",
        500: "#fb8c00", // Warna dasar yang lebih solid (Deep Amber)
        600: "#f57c00", // Mulai masuk ke dark orange
        700: "#ef6c00",
        800: "#e65100", // Coklat oranye tua
        900: "#e65100", // Sangat gelap (Deep Burnt Orange)

        // Untuk Joy UI (RGB main channel)
        mainChannel: "255 179 0",
      },
      primary: {
        50: "#f1f9fb",
        100: "#e1f2f6",
        200: "#bae2ed",
        300: "#7dc8dc",
        400: "#168BAB",
        500: "#13748f",
        600: "#155e74",
        700: "#174e5f",
        800: "#184251",
        900: "#0f2b35",
        solidBg: "var(--joy-palette-primary-400)",
        solidActiveBg: "var(--joy-palette-primary-500)",
        outlinedBorder: "var(--joy-palette-primary-500)",
        outlinedColor: "var(--joy-palette-primary-700)",
        outlinedActiveBg: "var(--joy-palette-primary-100)",
        softColor: "var(--joy-palette-primary-800)",
        softBg: "var(--joy-palette-primary-200)",
        softActiveBg: "var(--joy-palette-primary-300)",
        plainColor: "var(--joy-palette-primary-700)",
        plainActiveBg: "var(--joy-palette-primary-100)",
      },
      secondary: {
        // Credit:
        // https://github.com/tailwindlabs/tailwindcss/blob/master/src/public/colors.js
        50: "#f8fafc", // Sangat terang (background)
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b", // Warna abu-abu standar (Cool Gray)
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
        // Adjust the global variant tokens as you'd like.
        // The tokens should be the same for all color schemes.
        solidBg: "var(--joy-palette-secondary-400)",
        solidActiveBg: "var(--joy-palette-secondary-500)",
        outlinedBorder: "var(--joy-palette-secondary-500)",
        outlinedColor: "var(--joy-palette-secondary-700)",
        outlinedActiveBg: "var(--joy-palette-secondary-100)",
        softColor: "var(--joy-palette-secondary-800)",
        softBg: "var(--joy-palette-secondary-200)",
        softActiveBg: "var(--joy-palette-secondary-300)",
        plainColor: "var(--joy-palette-secondary-700)",
        plainActiveBg: "var(--joy-palette-secondary-100)",
      },
    },
  },
};

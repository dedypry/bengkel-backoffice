import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Pages from "vite-plugin-pages";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Pages({
      exclude: ["**/components/*.tsx", "**/schemas/*.ts"],
      dirs: [
        { dir: "src/pages/admin", baseRoute: "" },
        { dir: "src/pages/auth", baseRoute: "" },
      ],
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

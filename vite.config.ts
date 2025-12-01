import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/prize-wheel/", // <- много важно за GitHub Pages
});

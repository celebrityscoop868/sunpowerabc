import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/sunpowerabc/", // <-- el nombre EXACTO del repo
});

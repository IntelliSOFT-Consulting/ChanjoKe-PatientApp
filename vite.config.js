import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react()],
    // base: "/client",
    define: {
      "process.env": process.env,
    },
    server: {
      port: 3000,
    },
  };

  return config;
});

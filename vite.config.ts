/// <reference types="vitest" /> // ✅ Enables Vitest IntelliSense

import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "/climatic",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true, // Allows using "describe", "it" without imports
        environment: "jsdom", // Needed for React component testing
        setupFiles: "./src/setupTests.ts", // Jest-dom setup
    },
});

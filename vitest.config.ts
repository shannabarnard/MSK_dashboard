import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.spec.ts"],
  },
  resolve: {
    alias: {
      "~": path.resolve(root, "app"),
      "@": path.resolve(root, "app"),
    },
  },
});

/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      include: ["src/**/*.spec.ts"],
      tsconfig: "./tsconfig.test.json",
      checker: "tsc",
    },
  },
});

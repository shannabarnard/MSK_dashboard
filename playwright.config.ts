import { defineConfig, devices } from "@playwright/test";

/**
 * Dedicated port so E2E does not clash with a local `npm run dev` on 3000.
 * Override with PLAYWRIGHT_BASE_URL (e.g. point at dev: http://localhost:3000).
 */
const PORT = Number(process.env.PLAYWRIGHT_PORT) || 4173;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx nuxt preview --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});

import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 60000,
  testDir: "./tests",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3107",
    viewport: { width: 1440, height: 1024 },
  },
  webServer: {
    command: "npm run dev -- --port 3107",
    url: "http://localhost:3107",
    reuseExistingServer: !process.env.CI,
  },
  reporter: "list",
});

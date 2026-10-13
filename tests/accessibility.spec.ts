import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop and mobile surfaces have no automatic WCAG AA violations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Room for your next big idea." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Review & approve", exact: true }),
  ).toBeVisible({ timeout: 15000 });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1024 });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    ).toEqual([]);
  }
});

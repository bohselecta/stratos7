import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Room for your next big idea." }),
  ).toBeVisible();
});

test("canonical approval, pinned navigation, preview, and durable receipt", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page
    .getByRole("button", { name: "Orion Release", exact: true })
    .click();
  await expect(page.locator(".breadcrumb")).toContainText("Orion Release");
  await expect(page.locator(".project-summary")).toContainText("Atlas Console");
  await page
    .getByRole("button", { name: "Review & approve", exact: true })
    .click({ timeout: 15000 });
  await expect(
    page.getByText("Grant: publish this candidate to preview only."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Approve preview publication" })
    .click();
  await page
    .getByRole("button", { name: "Open preview", exact: true })
    .click({ timeout: 40000 });
  await expect(page.getByRole("dialog")).toContainText("Everything in view.");
  await page.getByRole("button", { name: "View publication receipt" }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Preview publication approved",
  );
  await page.reload();
  await expect(page.getByRole("tabpanel")).toContainText("Preview is ready");
  expect(errors).toEqual([]);
});

test("pause and resume freeze and advance progress", async ({ page }) => {
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const progress = await page
    .getByRole("progressbar")
    .getAttribute("aria-valuenow");
  await page.waitForTimeout(2400);
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    progress!,
  );
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(page.getByRole("progressbar")).not.toHaveAttribute(
    "aria-valuenow",
    progress!,
  );
});

test("changes require text and create a receipt", async ({ page }) => {
  await page
    .getByRole("button", { name: "Ask for changes", exact: true })
    .click({ timeout: 15000 });
  await expect(
    page.getByRole("button", { name: "Send changes", exact: true }),
  ).toBeDisabled();
  await page
    .getByLabel("What should the agent change?")
    .fill("Increase keyboard focus contrast.");
  await page.getByRole("button", { name: "Send changes", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "More panel tabs" }).click();
  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Increase keyboard focus contrast.",
  );
});

test("panel modes and unpinned project state persist", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle wide inspector" }).click();
  await page.reload();
  await expect(page.locator(".shell")).toHaveClass(/panel-wide/);
  await page.getByRole("button", { name: "Full screen project" }).click();
  await expect(page.locator(".shell")).toHaveClass(/panel-full/);
  await page.getByRole("button", { name: "Exit full screen" }).click();
  await page.getByRole("button", { name: "Unpin panel" }).click();
  await page
    .getByRole("button", { name: "Orion Release", exact: true })
    .click();
  await expect(page.locator(".project-summary")).toContainText("Orion Release");
  await page.getByRole("button", { name: "Close panel", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("complementary", { name: "Project panel" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Expand project panel" }).click();
  await expect(page.locator(".project-summary")).toContainText("Orion Release");
});

test("file inspection, queue edits, context and modal keyboard behavior", async ({
  page,
}) => {
  await page.getByRole("tab", { name: "Files", exact: true }).click();
  await page
    .getByRole("button", { name: /components\/metric-card.tsx/ })
    .click();
  await expect(page.locator(".file-inspector")).toContainText("aria-pressed");
  await page.keyboard.press("Escape");
  await expect(page.locator(".file-inspector")).toHaveCount(0);
  await expect(
    page.getByRole("complementary", { name: "Project panel" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Tasks", exact: true }).click();
  await page.getByRole("button", { name: "Add a task", exact: true }).click();
  await page.getByLabel("Task title").fill("Review fixture release");
  await page.getByRole("button", { name: "Save task" }).click();
  await page
    .getByRole("checkbox", { name: "Complete Review fixture release" })
    .check();
  await expect(
    page.getByRole("button", { name: "Review fixture release", exact: true }),
  ).toHaveClass("completed-task");
  await page.getByRole("button", { name: "More panel tabs" }).click();
  await page.getByRole("button", { name: "Context", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Context capsule");
  await page.getByRole("button", { name: "Search workspace" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Search workspace" }),
  ).toBeFocused();
});

for (const width of [1440, 1180, 768, 390, 320]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("tab", { name: "Files", exact: true }).click();
    await page
      .getByRole("button", { name: /components\/metric-card.tsx/ })
      .click();
    expect(
      await page.evaluate(
        () =>
          document.querySelector(".project-panel")!.scrollWidth <=
          document.querySelector(".project-panel")!.clientWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Close panel", exact: true })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("keyboard tabs and offline approval work without a backend", async ({
  page,
  context,
}) => {
  await context.setOffline(true);
  const tab = page.getByRole("tab", { name: "Overview", exact: true });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Needs you/ })).toBeFocused();
  await page
    .getByRole("button", { name: "Review & approve", exact: true })
    .click({ timeout: 15000 });
  await page
    .getByRole("button", { name: "Approve preview publication" })
    .click();
  await page.getByRole("button", { name: "More panel tabs" }).click();
  await page.getByRole("button", { name: "History", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Preview publication approved",
  );
});

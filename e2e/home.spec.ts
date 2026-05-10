import { expect, test } from "@playwright/test";

test.describe("Suggestions board", () => {
  test("home page shows the board title and table section", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "MSK Suggestions Board" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Suggestions Table" }),
    ).toBeVisible();
  });
});

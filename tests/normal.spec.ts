import { test, expect } from "@playwright/test";
import { resetDb } from "./helpers/db";

test.beforeEach(async () => {
  await resetDb([
    { title: "서울 경비직", region: "서울", job_type: "경비", required_career: 3 },
  ]);
});

test("시니어 등록 → 성공 배너 + 100점 매칭 카드 표시", async ({ page }) => {
  await page.goto("/register");

  await page.fill("#name", "테스트시니어");
  await page.selectOption("#region", "서울");
  await page.selectOption("#desired_job", "경비");
  await page.fill("#career_years", "5");

  await page.click('button[type="submit"]');

  await page.waitForURL(/\/recommendations/);

  await expect(page.getByRole("status")).toContainText("등록이 완료되었습니다");

  const firstCard = page.locator(".space-y-4 > div").first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard).toContainText("100점");
  await expect(firstCard).toContainText("테스트시니어");
});

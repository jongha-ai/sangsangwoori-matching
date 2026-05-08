import { test, expect } from "@playwright/test";
import { resetDb } from "./helpers/db";

test.beforeEach(async () => {
  await resetDb([
    { title: "기타직", region: "기타", job_type: "기타", required_career: 0 },
  ]);
});

test("조건 불일치 시 '현재 매칭되는 일자리가 없습니다' 표시", async ({ page }) => {
  await page.goto("/register");

  await page.fill("#name", "미매칭시니어");
  await page.selectOption("#region", "서울");
  await page.selectOption("#desired_job", "경비");
  await page.fill("#career_years", "3");

  await page.click('button[type="submit"]');

  await page.waitForURL(/\/recommendations/);

  await expect(page.getByText("현재 매칭되는 일자리가 없습니다")).toBeVisible();
});

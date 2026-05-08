import { test, expect } from "@playwright/test";
import { resetDb, countSeniors } from "./helpers/db";

test.beforeEach(async () => {
  await resetDb([
    { title: "서울 경비직", region: "서울", job_type: "경비", required_career: 3 },
  ]);
});

test("이름 비움 제출 → 이름 필드 위 빨간 안내 박스 / DB에 레코드 없음", async ({ page }) => {
  await page.goto("/register");

  await page.fill("#name", "");
  await page.selectOption("#region", "서울");
  await page.selectOption("#desired_job", "경비");
  await page.fill("#career_years", "3");

  await page.click('button[type="submit"]');

  const nameAlert = page.getByRole("alert").filter({ hasText: "이름을 입력해 주세요" });
  await expect(nameAlert).toBeVisible();

  expect(await countSeniors()).toBe(0);
});

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { calculateScore } from "./matching";
import type { Job, Senior } from "./types";

export async function registerSenior(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const region = (formData.get("region") as string).trim();
  const desired_job = (formData.get("desired_job") as string).trim();
  const career_years = parseInt(formData.get("career_years") as string, 10);

  if (!name || !region || !desired_job || isNaN(career_years)) {
    throw new Error("모든 항목을 입력해주세요.");
  }

  // 1. seniors 테이블에 등록
  const { data: senior, error: seniorError } = await supabase
    .from("seniors")
    .insert({ name, region, desired_job, career_years })
    .select()
    .single();

  if (seniorError) throw new Error(seniorError.message);

  // 2. 전체 일자리 조회
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("*");

  if (jobsError) throw new Error(jobsError.message);

  // 3. 점수 계산 후 score >= 50(지역 일치 이상)인 매칭만 저장
  //    경력 조건만 충족(+20)하는 약한 매칭은 제외해 미매칭 판별을 정확히 함
  if (jobs && jobs.length > 0) {
    const toInsert = (jobs as Job[])
      .map((job) => ({
        senior_id: (senior as Senior).id,
        job_id: job.id,
        score: calculateScore(senior as Senior, job),
        status: "pending" as const,
      }))
      .filter((m) => m.score >= 50);

    if (toInsert.length > 0) {
      await supabase.from("matches").insert(toInsert);
    }
  }

  redirect("/recommendations");
}

export async function assignMatch(formData: FormData) {
  const matchId = formData.get("matchId") as string;
  await supabase
    .from("matches")
    .update({ status: "assigned" })
    .eq("id", matchId);
  revalidatePath("/admin");
  revalidatePath("/recommendations");
}

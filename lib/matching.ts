import type { Senior, Job } from "./types";

/**
 * 규칙 기반 매칭 점수 계산 (최대 100점)
 *
 * 지역 일치 : +50
 * 직종 일치 : +30
 * 경력 충족 : +20
 */
export function calculateScore(senior: Senior, job: Job): number {
  let score = 0;

  const sr = senior.region.trim();
  const jr = job.region.trim();
  if (sr === jr || sr.includes(jr) || jr.includes(sr)) {
    score += 50;
  }

  const sd = senior.desired_job.trim();
  const jt = job.job_type.trim();
  if (sd === jt || sd.includes(jt) || jt.includes(sd)) {
    score += 30;
  }

  if (senior.career_years >= job.required_career) {
    score += 20;
  }

  return score;
}

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { MatchWithRelations } from "@/lib/types";

function scoreStyle(score: number) {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 50) return "bg-yellow-100 text-yellow-700";
  return "bg-orange-100 text-orange-700";
}

function MatchBadges({ match }: { match: MatchWithRelations }) {
  const { seniors: s, jobs: j } = match;
  const regionMatch =
    s.region === j.region || s.region.includes(j.region) || j.region.includes(s.region);
  const jobMatch =
    s.desired_job === j.job_type ||
    s.desired_job.includes(j.job_type) ||
    j.job_type.includes(s.desired_job);
  const careerOk = s.career_years >= j.required_career;

  return (
    <div className="flex gap-2 flex-wrap mt-1">
      {regionMatch && (
        <span className="text-sm px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">지역 일치</span>
      )}
      {jobMatch && (
        <span className="text-sm px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">직종 일치</span>
      )}
      {careerOk && (
        <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">경력 충족</span>
      )}
    </div>
  );
}

export default async function RecommendationsPage() {
  const { data, error } = await supabase
    .from("matches")
    .select("*, seniors(*), jobs(*)")
    .order("score", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <p className="text-red-500 text-center">데이터를 불러오지 못했습니다: {error.message}</p>
      </main>
    );
  }

  const matches = (data ?? []) as MatchWithRelations[];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">자동 매칭 추천 목록</h1>
            <p className="text-lg text-gray-500">적합도 점수가 높은 순서로 표시됩니다.</p>
          </div>
          <span className="text-gray-400 text-base">{matches.length}건</span>
        </div>

        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-16 text-center space-y-4">
            <p className="text-6xl">🔍</p>
            <p className="text-2xl font-semibold text-gray-700">추천 결과가 없습니다.</p>
            <p className="text-lg text-gray-400">
              시니어 프로필을 등록하면 자동으로 매칭됩니다.
            </p>
            <Link
              href="/register"
              className="mt-2 inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-xl transition-colors"
            >
              프로필 등록하러 가기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xl font-bold text-gray-900 truncate">
                    {match.seniors.name}
                    <span className="text-gray-400 font-normal text-base ml-2">
                      {match.seniors.region}
                    </span>
                  </p>
                  <p className="text-lg text-gray-700 truncate">
                    → {match.jobs.title}
                  </p>
                  <MatchBadges match={match} />
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span
                    className={`text-2xl font-bold px-4 py-2 rounded-xl ${scoreStyle(match.score)}`}
                  >
                    {match.score}점
                  </span>
                  {match.status === "assigned" && (
                    <span className="text-sm text-green-600 font-semibold">배정 완료</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

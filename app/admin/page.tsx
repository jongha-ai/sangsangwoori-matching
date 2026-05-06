import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { assignMatch } from "@/lib/actions";
import type { MatchWithRelations, Senior } from "@/lib/types";

type StatusParam = "unmatched" | "pending" | "assigned";

const TABS: { label: string; value: StatusParam; badge: string }[] = [
  { label: "미매칭",   value: "unmatched", badge: "bg-red-100 text-red-700" },
  { label: "매칭 대기", value: "pending",   badge: "bg-yellow-100 text-yellow-700" },
  { label: "배정 완료", value: "assigned",  badge: "bg-green-100 text-green-700" },
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus = "pending" } = await searchParams;
  const status = (["unmatched", "pending", "assigned"].includes(rawStatus)
    ? rawStatus
    : "pending") as StatusParam;

  // ── 통계 계산 ──────────────────────────────────────────────
  const [
    { data: allSeniors },
    { data: matchedRows },
    { count: pendingCount },
    { count: assignedCount },
  ] = await Promise.all([
    supabase.from("seniors").select("id, name, region, desired_job, career_years, created_at"),
    supabase.from("matches").select("senior_id"),
    supabase.from("matches").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("matches").select("*", { count: "exact", head: true }).eq("status", "assigned"),
  ]);

  const matchedSet = new Set(
    (matchedRows ?? []).map((r: { senior_id: string }) => r.senior_id)
  );
  const unmatchedSeniors = (allSeniors ?? []).filter(
    (s) => !matchedSet.has(s.id)
  ) as Senior[];

  const counts: Record<StatusParam, number> = {
    unmatched: unmatchedSeniors.length,
    pending: pendingCount ?? 0,
    assigned: assignedCount ?? 0,
  };

  // ── 탭별 목록 조회 ──────────────────────────────────────────
  let matchList: MatchWithRelations[] = [];

  if (status !== "unmatched") {
    const { data } = await supabase
      .from("matches")
      .select("*, seniors(*), jobs(*)")
      .eq("status", status)
      .order("score", { ascending: false });
    matchList = (data ?? []) as MatchWithRelations[];
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">담당자 대시보드</h1>
          <p className="text-lg text-gray-500">매칭 현황을 한눈에 관리하세요.</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4">
          {TABS.map(({ label, value, badge }) => (
            <Link
              key={value}
              href={`/admin?status=${value}`}
              className={`bg-white rounded-2xl shadow-md p-6 text-center space-y-2 transition-shadow hover:shadow-lg ${
                status === value ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <span className={`inline-block px-3 py-1 rounded-full text-base font-semibold ${badge}`}>
                {label}
              </span>
              <p className="text-5xl font-bold text-gray-800">{counts[value]}</p>
              <p className="text-sm text-gray-400">건</p>
            </Link>
          ))}
        </div>

        {/* 탭 */}
        <div className="flex gap-2 border-b border-gray-200">
          {TABS.map(({ label, value }) => (
            <Link
              key={value}
              href={`/admin?status=${value}`}
              className={`px-5 py-3 text-lg font-semibold rounded-t-xl transition-colors ${
                status === value
                  ? "bg-white text-blue-600 border border-b-white border-gray-200 -mb-px"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 목록 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {status === "unmatched" && (
            unmatchedSeniors.length === 0 ? (
              <EmptyMsg text="미매칭 시니어가 없습니다." />
            ) : (
              <ul className="divide-y divide-gray-100">
                {unmatchedSeniors.map((s) => (
                  <li key={s.id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{s.name}</p>
                      <p className="text-base text-gray-500">
                        {s.region} · 희망직종: {s.desired_job} · 경력 {s.career_years}년
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                      미매칭
                    </span>
                  </li>
                ))}
              </ul>
            )
          )}

          {status !== "unmatched" && (
            matchList.length === 0 ? (
              <EmptyMsg text={`${status === "pending" ? "매칭 대기" : "배정 완료"} 항목이 없습니다.`} />
            ) : (
              <ul className="divide-y divide-gray-100">
                {matchList.map((match) => (
                  <li key={match.id} className="p-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xl font-bold text-gray-900">
                        {match.seniors.name}
                        <span className="text-gray-400 font-normal text-base ml-2">
                          {match.seniors.region}
                        </span>
                      </p>
                      <p className="text-base text-gray-600 truncate">
                        → {match.jobs.title} · {match.score}점
                      </p>
                    </div>

                    {status === "pending" ? (
                      <form action={assignMatch}>
                        <input type="hidden" name="matchId" value={match.id} />
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-base transition-colors"
                        >
                          배정 완료
                        </button>
                      </form>
                    ) : (
                      <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                        배정 완료
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </main>
  );
}

function EmptyMsg({ text }: { text: string }) {
  return (
    <div className="p-16 text-center text-gray-400 text-lg">{text}</div>
  );
}

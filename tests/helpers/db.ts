import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type SeedJob = {
  title: string;
  region: string;
  job_type: string;
  required_career: number;
};

export async function resetDb(jobs: SeedJob[] = []) {
  await supabase.from("matches").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("seniors").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("jobs").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (jobs.length > 0) {
    const { error } = await supabase.from("jobs").insert(jobs);
    if (error) throw new Error(`job 시드 실패: ${error.message}`);
  }
}

export async function countSeniors(): Promise<number> {
  const { count, error } = await supabase
    .from("seniors")
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

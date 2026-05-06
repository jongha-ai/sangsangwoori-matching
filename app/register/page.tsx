"use client";

import { useFormStatus } from "react-dom";
import { registerSenior } from "@/lib/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-16 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-2xl font-bold transition-colors"
    >
      {pending ? "등록 중…" : "등록하기"}
    </button>
  );
}

const FIELD_CLASS =
  "w-full h-14 rounded-xl border-2 border-gray-300 px-4 text-xl focus:outline-none focus:border-blue-500";
const LABEL_CLASS = "block text-xl font-semibold text-gray-800";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">시니어 프로필 등록</h1>
          <p className="text-lg text-gray-500">
            정보를 입력하시면 알맞은 일자리를 찾아드립니다.
          </p>
        </div>

        <form action={registerSenior} className="space-y-6">
          <div className="space-y-2">
            <label className={LABEL_CLASS} htmlFor="name">이름</label>
            <input id="name" name="name" type="text" required placeholder="홍길동" className={FIELD_CLASS} />
          </div>

          <div className="space-y-2">
            <label className={LABEL_CLASS} htmlFor="region">지역</label>
            <input id="region" name="region" type="text" required placeholder="서울 강남구" className={FIELD_CLASS} />
          </div>

          <div className="space-y-2">
            <label className={LABEL_CLASS} htmlFor="desired_job">희망 직종</label>
            <input id="desired_job" name="desired_job" type="text" required placeholder="경비, 청소, 사무보조 등" className={FIELD_CLASS} />
          </div>

          <div className="space-y-2">
            <label className={LABEL_CLASS} htmlFor="career_years">경력 (년)</label>
            <input id="career_years" name="career_years" type="number" required min={0} placeholder="10" className={FIELD_CLASS} />
          </div>

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}

"use client";

import { useFormStatus } from "react-dom";
import { registerSenior } from "@/lib/actions";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-16 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-2xl font-bold transition-colors"
    >
      {pending ? "등록 중…" : "프로필 등록하기"}
    </button>
  );
}

const FIELD_CLASS =
  "w-full h-14 rounded-xl border-2 border-gray-300 px-4 text-xl focus:outline-none focus:border-blue-500";
const LABEL_CLASS = "block text-xl font-semibold text-gray-800";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    try {
      await registerSenior(formData);
    } catch (e: unknown) {
      const { isRedirectError } = await import("next/dist/client/components/redirect-error");
      if (isRedirectError(e)) throw e;
      setError("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">시니어 프로필 등록</h1>
          <p className="text-lg text-gray-500">
            기본 정보를 입력하시면 맞춤 일자리를 추천해 드립니다.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border-2 border-blue-300 bg-blue-50 px-4 py-3 text-lg text-blue-700">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className={LABEL_CLASS} htmlFor="name">이름 *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="홍길동"
              className={FIELD_CLASS}
            />
          </div>

          <div className="space-y-2">
            <label className={LABEL_CLASS} htmlFor="region">지역 *</label>
            <select id="region" name="region" required className={FIELD_CLASS}>
              <option value="">선택해 주세요</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={LABEL_CLASS} htmlFor="desired_job">희망 직종 *</label>
            <select id="desired_job" name="desired_job" required className={FIELD_CLASS}>
              <option value="">선택해 주세요</option>
              <option value="경비">경비</option>
              <option value="청소">청소</option>
              <option value="조리">조리</option>
              <option value="돌봄">돌봄</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={LABEL_CLASS} htmlFor="career_years">경력 (년)</label>
            <input
              id="career_years"
              name="career_years"
              type="number"
              required
              min={0}
              placeholder="5"
              className={FIELD_CLASS}
            />
          </div>

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}

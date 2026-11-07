"use client";

import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  body?: string;
}

/** Reusable empty / no-results state with an icon slot (pass a react-icon). */
export function EmptyState({ icon, title, body }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-[#e4e7f2] bg-white py-14 px-6 text-center shadow-[0_1px_2px_rgba(11,16,32,0.04)]">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f0f2f9] text-[#5b5bf0] text-2xl">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-bold text-[#0b1020]">{title}</h3>
      {body && <p className="max-w-sm text-xs sm:text-sm text-[#687089]">{body}</p>}
    </div>
  );
}

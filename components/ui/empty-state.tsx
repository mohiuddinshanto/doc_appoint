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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-5xl text-gray-300">{icon}</div>
      <h3 className="mb-1 font-semibold text-gray-800">{title}</h3>
      {body && <p className="max-w-xs text-sm text-gray-400">{body}</p>}
    </div>
  );
}

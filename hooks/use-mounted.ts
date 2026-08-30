"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true after the first client render.
 * Used to gate persisted-store reads (localStorage via zustand/persist)
 * so SSR markup and the first client render match — avoids hydration errors.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

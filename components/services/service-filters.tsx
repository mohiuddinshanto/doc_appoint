"use client";

import { Input, Select, SelectItem } from "@heroui/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import type { ServiceFilters } from "@/types";

interface ServiceFiltersBarProps {
  filters: ServiceFilters;
  categories: string[];
  onChange: (patch: Partial<ServiceFilters>) => void;
}

const SORT_OPTIONS = [
  { key: "rating", label: "Rating" },
  { key: "price", label: "Price" },
  { key: "name", label: "Name" },
  { key: "duration", label: "Duration" },
] as const;

/** Reusable search + category + sort bar for the service catalogue. */
export function ServiceFiltersBar({
  filters,
  categories,
  onChange,
}: ServiceFiltersBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <Input
        type="search"
        value={filters.query}
        onValueChange={(v) => onChange({ query: v })}
        placeholder="Search services…"
        radius="lg"
        startContent={<FaMagnifyingGlass className="text-gray-400" />}
        classNames={{ inputWrapper: "bg-gray-50 border border-gray-200" }}
      />

      <Select
        aria-label="Filter by category"
        selectedKeys={filters.category ? [filters.category] : ["__all__"]}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          onChange({ category: key === "__all__" ? null : (key as string) });
        }}
        radius="lg"
        className="max-w-44"
        classNames={{ trigger: "bg-gray-50 border border-gray-200" }}
      >
        {["__all__", ...categories].map((c) => (
          <SelectItem key={c}>{c === "__all__" ? "All categories" : c}</SelectItem>
        ))}
      </Select>

      <Select
        aria-label="Sort services"
        selectedKeys={[filters.sortBy]}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          if (key) {
            onChange({ sortBy: key as ServiceFilters["sortBy"] });
          }
        }}
        radius="lg"
        className="max-w-44"
        classNames={{ trigger: "bg-gray-50 border border-gray-200" }}
      >
        {SORT_OPTIONS.map(({ key, label }) => (
          <SelectItem key={key}>Sort: {label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}

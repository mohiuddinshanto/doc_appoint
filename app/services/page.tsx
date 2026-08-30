import { Suspense } from "react";
import { ServicesPage } from "@/components/services/services-page";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading services...</div>}>
      <ServicesPage />
    </Suspense>
  );
}

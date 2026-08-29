import { Suspense } from "react";
import { HomePage } from "@/components/home/home-page";



    // Suspense ব্যবহার করা হয়েছে HomePage component প্রস্তুত হতে সময় লাগলে, সেই সময়টুকুতে Loading... দেখানো যাবে। Suspense-এর fallback prop ব্যবহার করে আমরা একটি loading indicator দেখাচ্ছি।
export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}

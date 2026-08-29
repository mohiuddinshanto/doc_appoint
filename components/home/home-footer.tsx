import { LuStethoscope } from "react-icons/lu";

export function HomeFooter() {
  return (
    <footer className="mt-16 border-t bg-white py-8 text-center text-sm text-slate-500">
      <p className="flex items-center justify-center gap-2">
        <LuStethoscope className="text-indigo-600" />
        DocAppoint © {new Date().getFullYear()}
      </p>
    </footer>
  );
}

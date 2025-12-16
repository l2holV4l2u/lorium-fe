import { LoaderCircle } from "lucide-react";

export function LoadPage() {
  return (
    <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center mx-auto my-auto">
      <LoaderCircle
        size={48}
        strokeWidth={2}
        className="animate-spin text-primary-500"
      />
    </div>
  );
}

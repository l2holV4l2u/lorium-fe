import { CircleX } from "lucide-react";

export function ErrorBanner({ error }: { error?: string }) {
  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex items-center gap-2">
            <CircleX size={16} color="red" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}
    </>
  );
}

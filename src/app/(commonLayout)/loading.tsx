import { Loader2 } from "lucide-react";

export default function CommonLoading() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <Loader2 className="animate-spin size-8 text-red-500" />
    </div>
  );
}

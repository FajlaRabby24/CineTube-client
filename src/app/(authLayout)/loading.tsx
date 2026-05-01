import { Loader2 } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-in fade-in duration-300">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-sm font-medium text-muted-foreground">Securing your session...</p>
    </div>
  );
}

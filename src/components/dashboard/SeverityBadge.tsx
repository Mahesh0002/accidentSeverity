import { cn } from "@/lib/utils";
import { severityTokens, type Severity } from "@/lib/classify";

export function SeverityBadge({ severity }: { severity: Severity | null }) {
  if (!severity) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
        Awaiting input
      </div>
    );
  }
  const t = severityTokens[severity];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-base font-semibold ring-1",
        t.bg,
        t.text,
        t.ring,
      )}
    >
      <span className={cn("h-2.5 w-2.5 animate-pulse rounded-full", t.dot)} />
      {severity}
    </div>
  );
}
import { ScrollArea } from "@/components/ui/scroll-area";
import { severityTokens, type ClassificationResult } from "@/lib/classify";
import { cn } from "@/lib/utils";

export function FrameTimeline({ history }: { history: ClassificationResult[] }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>Frame history</span>
        <span>{history.length}</span>
      </div>
      <ScrollArea className="h-64 rounded-lg border border-white/5 bg-white/[0.02]">
        {history.length === 0 ? (
          <div className="flex h-64 items-center justify-center font-mono text-xs text-muted-foreground">
            No frames analyzed yet
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {history.map((r) => {
              const t = severityTokens[r.severity];
              return (
                <li key={r.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <span className={cn("h-2 w-2 rounded-full", t.dot)} />
                    <span className={cn("font-medium", t.text)}>{r.severity}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                    <span>{Math.round(r.confidence * 100)}%</span>
                    <span>{new Date(r.timestamp).toLocaleTimeString()}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
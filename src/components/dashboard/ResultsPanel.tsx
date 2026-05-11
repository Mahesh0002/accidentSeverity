import { Loader2 } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { ConfidenceBar } from "./ConfidenceBar";
import { FrameTimeline } from "./FrameTimeline";
import type { ClassificationResult } from "@/lib/classify";

interface Props {
  current: ClassificationResult | null;
  history: ClassificationResult[];
  isLoading: boolean;
  hasMedia: boolean;
}

export function ResultsPanel({ current, history, isLoading, hasMedia }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Current severity
          </p>
          <div className="mt-3">
            <SeverityBadge severity={current?.severity ?? null} />
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            classifying
          </div>
        )}
      </div>

      <div className="mb-6">
        <ConfidenceBar value={current?.confidence ?? null} />
      </div>

      {!hasMedia ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-white/10 font-mono text-xs text-muted-foreground">
          Upload media to begin classification
        </div>
      ) : (
        <FrameTimeline history={history} />
      )}
    </div>
  );
}
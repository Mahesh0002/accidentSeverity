export function ConfidenceBar({ value }: { value: number | null }) {
  const pct = value == null ? 0 : Math.round(value * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>Confidence</span>
        <span className="text-foreground">{value == null ? "—" : `${pct}%`}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-white/40 to-white transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
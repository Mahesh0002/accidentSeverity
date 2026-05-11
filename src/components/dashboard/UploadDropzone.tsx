import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileVideo, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "video/mp4"];

interface Props {
  file: File | null;
  onFile: (file: File | null) => void;
}

export function UploadDropzone({ file, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handle = useCallback(
    (f: File | null) => {
      if (!f) return;
      if (!ACCEPT.includes(f.type)) {
        setErr("Unsupported file type. Use JPG, PNG, or MP4.");
        return;
      }
      setErr(null);
      onFile(f);
    },
    [onFile],
  );

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-3 text-sm">
          {file.type.startsWith("video") ? (
            <FileVideo className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-mono text-xs text-muted-foreground">{file.name}</span>
          <span className="font-mono text-xs text-muted-foreground/60">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
        <button
          onClick={() => onFile(null)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(e.dataTransfer.files?.[0] ?? null);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative cursor-pointer rounded-xl border border-dashed transition-colors",
          "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
          over && "border-white/30 bg-white/[0.06]",
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Drop a file or click to upload</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              .jpg &middot; .png &middot; .mp4
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.mp4,image/jpeg,image/png,video/mp4"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0] ?? null)}
        />
      </div>
      {err && <p className="mt-2 text-xs text-[color:var(--severity-severe)]">{err}</p>}
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadDropzone } from "@/components/dashboard/UploadDropzone";
import { MediaPreview } from "@/components/dashboard/MediaPreview";
import { ResultsPanel } from "@/components/dashboard/ResultsPanel";
import { useMediaClassifier } from "@/hooks/useMediaClassifier";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Traffic Severity AI — Dashboard" },
      {
        name: "description",
        content:
          "Upload an image or video and classify traffic incident severity in real time using a hybrid YOLOv11 + EfficientNet pipeline.",
      },
      { property: "og:title", content: "Traffic Severity AI — Dashboard" },
      {
        property: "og:description",
        content: "Real-time traffic incident severity classification.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [file, setFile] = useState<File | null>(null);
  const { kind, url, videoRef, canvasRef, current, history, isLoading } =
    useMediaClassifier(file);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Real-time inference
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Classification Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Drop an image or short video clip. Frames are extracted client-side every second
          and streamed to the severity model.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <UploadDropzone file={file} onFile={setFile} />
          {url && kind && <MediaPreview ref={videoRef} url={url} kind={kind} />}
        </div>
        <div className="lg:col-span-2">
          <ResultsPanel
            current={current}
            history={history}
            isLoading={isLoading}
            hasMedia={!!file}
          />
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

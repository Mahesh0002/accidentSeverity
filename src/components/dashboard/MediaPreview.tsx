import { forwardRef } from "react";

interface Props {
  url: string;
  kind: "image" | "video";
}

export const MediaPreview = forwardRef<HTMLVideoElement, Props>(({ url, kind }, ref) => {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
      {kind === "image" ? (
        <img src={url} alt="Uploaded frame" className="h-auto w-full object-contain" />
      ) : (
        <video
          ref={ref}
          src={url}
          autoPlay
          muted
          loop
          playsInline
          controls
          className="h-auto w-full"
        />
      )}
    </div>
  );
});
MediaPreview.displayName = "MediaPreview";
import { useCallback, useEffect, useRef, useState } from "react";
import { classifyFrame, type ClassificationResult } from "@/lib/classify";

export type MediaKind = "image" | "video" | null;

export function useMediaClassifier(file: File | null) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [history, setHistory] = useState<ClassificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kind: MediaKind = file
    ? file.type.startsWith("video")
      ? "video"
      : "image"
    : null;

  const previewUrl = useRef<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  // create object url
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(file);
    previewUrl.current = u;
    setUrl(u);
    setHistory([]);
    setError(null);
    return () => {
      URL.revokeObjectURL(u);
    };
  }, [file]);

  const pushResult = useCallback((r: ClassificationResult) => {
    setHistory((prev) => [r, ...prev].slice(0, 50));
  }, []);

  // image: classify once when file ready
  useEffect(() => {
    if (!file || kind !== "image") return;
    let cancelled = false;
    setIsLoading(true);
    classifyFrame(file)
      .then((r) => {
        if (!cancelled) pushResult(r);
      })
      .catch((e) => !cancelled && setError(String(e)))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [file, kind, pushResult]);

  // video: extract frame every 1s while playing
  const startSampling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.paused || video.ended || video.readyState < 2) return;
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      const blob: Blob | null = await new Promise((res) =>
        canvas.toBlob((b) => res(b), "image/jpeg", 0.85),
      );
      if (!blob) return;
      const frameFile = new File([blob], `frame-${Date.now()}.jpg`, { type: "image/jpeg" });
      setIsLoading(true);
      try {
        const r = await classifyFrame(frameFile);
        pushResult(r);
      } catch (e) {
        setError(String(e));
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }, [pushResult]);

  const stopSampling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (kind !== "video") {
      stopSampling();
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => startSampling();
    const onPause = () => stopSampling();
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onPause);
    if (!v.paused) startSampling();
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onPause);
      stopSampling();
    };
  }, [kind, url, startSampling, stopSampling]);

  useEffect(() => () => stopSampling(), [stopSampling]);

  return {
    kind,
    url,
    videoRef,
    canvasRef,
    history,
    current: history[0] ?? null,
    isLoading,
    error,
  };
}
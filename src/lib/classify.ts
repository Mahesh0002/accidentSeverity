export type Severity = "Minor" | "Moderate" | "Severe";

export interface ClassificationResult {
  id: string;
  severity: Severity;
  confidence: number;
  timestamp: number;
}

// Your live Hugging Face Space DevOps URL
const ENDPOINT = "https://lord731095-accidentseverity-api.hf.space/classify-frame/";

export async function classifyFrame(file: File): Promise<ClassificationResult> {
  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch(ENDPOINT, { 
      method: "POST", 
      body: fd 
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();

    // If YOLO doesn't detect a car/crash in the frame, we default to 0 confidence
    if (data.status === "no_crash" || !data.severity) {
      return {
        id: crypto.randomUUID(),
        severity: "Minor", // Default fallback for the UI
        confidence: 0,
        timestamp: Date.now(),
      };
    }

    // Map the real data from your EfficientNet-B0 model
    return {
      id: crypto.randomUUID(),
      severity: data.severity as Severity,
      confidence: data.confidence,
      timestamp: Date.now(),
    };
    
  } catch (error) {
    console.error("Failed to classify frame:", error);
    throw error;
  }
}

export const severityTokens: Record<Severity, { bg: string; text: string; ring: string; dot: string }> = {
  Minor: {
    bg: "bg-[color:var(--severity-minor)]/15",
    text: "text-[color:var(--severity-minor)]",
    ring: "ring-[color:var(--severity-minor)]/40",
    dot: "bg-[color:var(--severity-minor)]",
  },
  Moderate: {
    bg: "bg-[color:var(--severity-moderate)]/15",
    text: "text-[color:var(--severity-moderate)]",
    ring: "ring-[color:var(--severity-moderate)]/40",
    dot: "bg-[color:var(--severity-moderate)]",
  },
  Severe: {
    bg: "bg-[color:var(--severity-severe)]/15",
    text: "text-[color:var(--severity-severe)]",
    ring: "ring-[color:var(--severity-severe)]/40",
    dot: "bg-[color:var(--severity-severe)]",
  },
};
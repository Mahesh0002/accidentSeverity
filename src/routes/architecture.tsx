import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Boxes, Cpu, MonitorSmartphone } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Under the Hood — Accident Severity." },
      {
        name: "description",
        content:
          "A decoupled pipeline for real-time video analysis: YOLOv11 + EfficientNet-B0 served via FastAPI on Hugging Face Spaces.",
      },
      { property: "og:title", content: "Under the Hood — Accident Severity." },
      {
        property: "og:description",
        content: "A decoupled AI pipeline for real-time video analysis.",
      },
    ],
  }),
  component: ArchitecturePage,
});

const cards = [
  {
    eyebrow: "01 — The Models",
    title: "Hybrid vision pipeline",
    icon: Cpu,
    body: "YOLOv11 isolates the crash zone via bounding boxes. The cropped region is then passed to an EfficientNet-B0 classifier that grades the incident as Minor, Moderate, or Severe.",
  },
  {
    eyebrow: "02 — The Frontend",
    title: "Client-side extraction",
    icon: MonitorSmartphone,
    body: "Rather than streaming raw video to the GPU, React uses the HTML5 Canvas API to silently grab one frame per second and POST it as a JPEG. This bypasses server payload limits.",
  },
  {
    eyebrow: "03 — The Infrastructure",
    title: "Serverless inference",
    icon: Boxes,
    body: "The model server is containerized via Docker and exposed through FastAPI for asynchronous routing. Deployed on Hugging Face Spaces for cost-efficient hosting.",
  },
];

function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero Section */}
      <section className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Engineering notes
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Under the Hood
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          A decoupled AI pipeline for real-time video analysis.
        </p>
      </section>

      {/* Quick Summary Cards */}
      <section className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <article
              key={c.eyebrow}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {c.eyebrow}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </article>
          );
        })}
      </section>

      {/* Detailed Technical Article */}
      <section className="mt-20 mx-auto max-w-3xl space-y-12 border-t border-white/10 pt-16">
        
        {/* Intro */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">The Core Engineering Challenge</h2>
          <p className="leading-relaxed text-muted-foreground">
            The ultimate goal of this project was to build a traffic accident severity classification model capable of running on <strong className="text-white/90 font-medium">end-device edge hardware</strong>. Because edge devices are severely limited by computational bottlenecks, optimizing for both real-time processing speed and high accuracy required a strict, phased engineering approach.
          </p>
        </div>

        {/* Phase 0 */}
        <div>
          <h3 className="text-xl font-semibold tracking-tight mb-4 text-white/90">Phase 0: The Image Baseline & Trade-Off Analysis</h3>
          <p className="leading-relaxed text-muted-foreground mb-4">
            Before tackling video, we needed to establish a lightweight, high-accuracy baseline using static images. We tested several independent architectures, including YOLOv8, YOLOv11, EfficientNet-B0, and Vision Transformers (ViT).
          </p>
          <ul className="space-y-3 text-muted-foreground leading-relaxed pl-4 border-l-2 border-white/10">
            <li>
              <strong className="text-white/90 font-medium">The ViT Rejection:</strong> While the Vision Transformer model provided a 2% increase in raw accuracy, its heavy computational load violated our edge-deployment constraints.
            </li>
            <li>
              <strong className="text-white/90 font-medium">The Ensemble Solution:</strong> Instead, we engineered a lightweight ensemble model combining YOLOv11 and EfficientNet-B0. EfficientNet-B0 achieved ~70% alone, while YOLOv11 achieved ~71%.
            </li>
            <li>
              <strong className="text-white/90 font-medium">Result:</strong> By combining them, our ensemble model pushed the image baseline accuracy to <strong className="text-white/90 font-medium">~73%</strong> while remaining well within strict compute budgets.
            </li>
          </ul>
        </div>

        {/* Phase 1 */}
        <div>
          <h3 className="text-xl font-semibold tracking-tight mb-4 text-white/90">Phase 1: Data Engineering & The Overfitting Battle</h3>
          <p className="leading-relaxed text-muted-foreground mb-4">
            With a target of roughly 2,500 training images, we initially considered implementing a Generative Adversarial Network (GAN) to synthesize data. Ultimately, we opted for aggressive algorithmic data augmentation. By heavily tweaking dropout rates and applying geometric and color transformations, we forced the model to learn actual crash features rather than memorizing the test set.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            During training, the threshold between underfitting and overfitting was incredibly narrow. By rigorously tracking validation versus training accuracy, we successfully identified "silent" overfitting early on, aggressively scraping and retraining models until generalization was stable.
          </p>
        </div>

        {/* Phase 2 */}
        <div>
          <h3 className="text-xl font-semibold tracking-tight mb-4 text-white/90">Phase 2: Temporal Video Processing & The BiLSTM</h3>
          <p className="leading-relaxed text-muted-foreground mb-4">
            With a stable spatial baseline, we transitioned to processing full video feeds to understand the temporal sequence of a crash. We built a 4-step pipeline: Uniform Frame Sampling <span className="mx-2 text-white/20">→</span> Spatial Localization (YOLOv11) <span className="mx-2 text-white/20">→</span> Severity Categorization (EfficientNet-B0) <span className="mx-2 text-white/20">→</span> Temporal Analysis (BiLSTM).
          </p>
          <p className="leading-relaxed text-muted-foreground mb-4">
            To feed data into the recurrent network, we ran thousands of video frames through EfficientNet to extract spatial feature vectors, saving them perfectly aligned as <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-white/80">.npy</code> arrays.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We chose a Bidirectional Long Short-Term Memory (BiLSTM) network because it processes the video sequence both forwards and backwards. This allows the model to essentially "look ahead" at the future state of the crash to better contextualize the severity. In a 3-class system where random guessing yields ~33%, our pipeline successfully raised real-world video prediction accuracy to <strong className="text-white/90 font-medium">~56%</strong>.
          </p>
        </div>

      </section>

      {/* Navigation */}
      <section className="mt-16 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium transition-colors hover:border-white/20 hover:bg-white/[0.06]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </section>
    </div>
  );
}
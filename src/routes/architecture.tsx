import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { Camera, Layers, Box, Database, Brain, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Architecture · Carrier AI" }] }),
  component: Architecture,
});

const stages = [
  { i: Camera, t: "Edge ingestion", d: "Per-station capture, calibration, sub-frame normalization." },
  { i: Layers, t: "Segmentation", d: "Region of interest extraction with mask quality scoring." },
  { i: Box, t: "Feature extraction", d: "256-d patch embeddings via PatchCore backbone." },
  { i: Database, t: "FAISS recall", d: "kNN against versioned memory bank · sub-2ms." },
  { i: Brain, t: "Vision LLM", d: "Multi-modal reasoning over heatmap + recall context." },
  { i: FileText, t: "Report & action", d: "Signed inspection report routed to ops console." },
];

function Architecture() {
  return (
    <PlatformShell title="Architecture" breadcrumb={["Carrier AI", "System", "Architecture"]}>
      <SectionHeader eyebrow="System" title="Inference architecture" description="The end-to-end pipeline from edge ingestion to signed inspection reports." />

      <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative grid grid-cols-1 gap-3 md:grid-cols-6">
          {stages.map((s, i) => (
            <div key={s.t} className="relative">
              <div className="rounded-lg border border-border bg-background/60 p-4 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary/60 text-primary">
                  <s.i className="h-4 w-4" />
                </div>
                <div className="mt-3 text-[10px] font-mono text-muted-foreground">STAGE {i + 1}</div>
                <div className="text-[13px] font-semibold tracking-tight">{s.t}</div>
                <div className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{s.d}</div>
              </div>
              {i < stages.length - 1 && (
                <ArrowRight className="absolute -right-2 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-primary/60 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[
          { t: "Memory bank", d: "Versioned per product family. Hot reload without redeploy.", v: "14,238 vectors" },
          { t: "FAISS index", d: "IVF-PQ index with product-quantized codebook.", v: "k=5 · recall 0.991" },
          { t: "Vision LLM", d: "Multi-modal reasoning grounded in heatmap + retrieved exemplars.", v: "412 tokens avg" },
        ].map((c) => (
          <div key={c.t} className="rounded-lg border border-border bg-card p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.t}</div>
            <div className="mt-1 text-[15px] font-semibold">{c.v}</div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Pipeline log · live</div>
        <div className="mt-3 space-y-1 font-mono text-[11.5px]">
          {[
            "[14:02:11] ingest line-A/station-04 · frame #00482",
            "[14:02:11] segment mask_quality=0.974",
            "[14:02:11] features patchcore-v4.2 · 256d · 4.8ms",
            "[14:02:11] faiss recall k=5 · score=0.94",
            "[14:02:11] anomaly classified: solder_bridge",
            "[14:02:12] vision-llm narrative · 312 tokens · 412ms",
            "[14:02:12] report RPT-2419-00482 generated · signed",
          ].map((l, i) => (
            <div key={i} className="flex gap-3 text-muted-foreground">
              <span className="w-8 text-right text-muted-foreground/40">{String(i + 1).padStart(2, "0")}</span>
              <span><span className="text-primary">{l.split("]")[0]}]</span>{l.split("]")[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </PlatformShell>
  );
}

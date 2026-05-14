import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { Camera, Layers, Box, Database, Brain, FileText, ArrowRight, Server, Cpu, Network, ShieldCheck, Sparkles, Workflow } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Architecture · Carrier AI" }] }),
  component: Architecture,
});

const stages = [
  { i: Camera, t: "Edge Ingestion", d: "Per-station image capture, Lanczos calibration, sub-frame RGB normalization.", color: "from-[#3b82f6] to-[#1d4ed8]", bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  { i: Layers, t: "Segmentation", d: "Region of interest extraction & automated background noise masking.", color: "from-[#10b981] to-[#047857]", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  { i: Box, t: "Feature Extraction", d: "PyTorch ResNet-50 backbone extracting mid-level hierarchical patch embeddings.", color: "from-[#8b5cf6] to-[#6d28d9]", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
  { i: Database, t: "FAISS Recall", d: "Sub-2ms nearest-neighbor distance calculation against coreset memory banks.", color: "from-[#f59e0b] to-[#b45309]", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  { i: Brain, t: "Vision LLM Audit", d: "Multi-modal specification comparison against manufacturer datasheets.", color: "from-[#ec4899] to-[#be185d]", bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
  { i: FileText, t: "Signed Action", d: "Cryptographically signed compliance audit routed to operations dashboard.", color: "from-[#14b8a6] to-[#0f766e]", bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400" },
];

function Architecture() {
  return (
    <PlatformShell title="Architecture" breadcrumb={["Carrier AI", "System", "Architecture"]}>
      <SectionHeader 
        eyebrow="System Blueprint" 
        title="Industrial MLOps & Inference Pipeline" 
        description="Comprehensive technical overview of the real-time anomaly detection pipeline, hybrid model architecture, and hardware acceleration layers." 
      />

      {/* Colorful Stages Grid */}
      <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-6">
          {stages.map((s, i) => (
            <div key={s.t} className="relative group">
              <div className={`rounded-xl border ${s.border} bg-background/80 p-5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:border-primary/50 h-full flex flex-col justify-between`}>
                <div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${s.color} text-white shadow-md mb-3`}>
                    <s.i className="h-5 w-5" />
                  </div>
                  <div className={`text-[10.5px] font-mono font-semibold tracking-wider ${s.text}`}>STAGE 0{i + 1}</div>
                  <div className="text-[14px] font-bold tracking-tight text-foreground mt-1">{s.t}</div>
                  <div className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">{s.d}</div>
                </div>
                <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${s.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>
              {i < stages.length - 1 && (
                <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-primary/60 md:block z-10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Architecture Diagram */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Workflow className="w-64 h-64 text-primary" />
        </div>
        <div className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-1">System Topology</div>
        <div className="text-[18px] font-bold text-foreground mb-6">Full-Stack Component Interaction Diagram</div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <div className="rounded-lg border border-border bg-background/50 p-5 border-l-4 border-l-[#3b82f6]">
            <div className="flex items-center gap-2 text-[14px] font-bold text-foreground mb-2">
              <Server className="w-4 h-4 text-[#3b82f6]" /> React TanStack Client
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
              Vite-powered SPA running on port 5173. Manages dynamic UI state, image uploads via FormData, and real-time dashboard visualizations.
            </p>
            <div className="text-[10px] font-mono bg-blue-500/10 text-blue-400 p-1.5 rounded border border-blue-500/20">
              @tanstack/react-router · Recharts
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-5 border-l-4 border-l-[#10b981]">
            <div className="flex items-center gap-2 text-[14px] font-bold text-foreground mb-2">
              <Network className="w-4 h-4 text-[#10b981]" /> FastAPI Gateway
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
              High-performance ASGI server on port 8000 handling CORS middleware, image pre-processing, and asynchronous inference orchestration.
            </p>
            <div className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 p-1.5 rounded border border-emerald-500/20">
              uvicorn · Pydantic · multipart
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-5 border-l-4 border-l-[#8b5cf6]">
            <div className="flex items-center gap-2 text-[14px] font-bold text-foreground mb-2">
              <Cpu className="w-4 h-4 text-[#8b5cf6]" /> AI Engine & FAISS
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
              PyTorch PatchCore model registry. Extracts 256-d patch embeddings and indexes coreset vectors via Facebook AI Similarity Search.
            </p>
            <div className="text-[10px] font-mono bg-purple-500/10 text-purple-400 p-1.5 rounded border border-purple-500/20">
              torchvision.models.resnet50 · faiss
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-5 border-l-4 border-l-[#ec4899]">
            <div className="flex items-center gap-2 text-[14px] font-bold text-foreground mb-2">
              <Sparkles className="w-4 h-4 text-[#ec4899]" /> Vision LLM Spec Analyzer
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
              Multi-modal LLM agent verifying physical component dimensions and pad layout against manufacturer datasheet specifications.
            </p>
            <div className="text-[10px] font-mono bg-pink-500/10 text-pink-400 p-1.5 rounded border border-pink-500/20">
              Llama-3-Vision · GPT-4o
            </div>
          </div>
        </div>
      </div>

      {/* Highlighted Stat Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-card to-purple-500/5 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold">Memory Bank Coresets</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-[22px] font-bold text-foreground font-mono">14,238 Vectors</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Versioned per product family with greedy coreset subsampling. Enables instant hot-reloading without redeploying containers.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-card to-emerald-500/5 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">FAISS Vector Index</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-[22px] font-bold text-foreground font-mono">k=9 · Recall@1 99.1%</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Inverted File with Product Quantization (IVF-PQ) codebook indexing. Ensures lightning-fast sub-2 millisecond search latency.
          </p>
        </div>

        <div className="rounded-xl border border-pink-500/30 bg-gradient-to-br from-card to-pink-500/5 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-pink-400 font-semibold">Vision LLM Reasoning</span>
            <Brain className="w-4 h-4 text-pink-400" />
          </div>
          <div className="mt-2 text-[22px] font-bold text-foreground font-mono">412 Tokens / Sec</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Grounds visual anomalies in expert engineering domain knowledge, generating plain-text audit summaries for quality compliance.
          </p>
        </div>
      </div>

      {/* Live Pipeline Log */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3 border-b border-border pb-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Pipeline Execution Telemetry · Live
          </div>
          <div className="text-[10.5px] font-mono text-muted-foreground">100% SLA Hit Rate</div>
        </div>
        <div className="space-y-2 font-mono text-[11.5px]">
          {[
            { t: "[14:02:11]", act: "ingest line-A/station-04", msg: "frame #00482 captured · 2048x1536 TIFF", color: "text-blue-400" },
            { t: "[14:02:11]", act: "segment mask_quality", msg: "score=0.974 · bounding noise suppressed", color: "text-emerald-400" },
            { t: "[14:02:11]", act: "features patchcore-v4.2", msg: "256d embedding tensor extracted · 4.8ms", color: "text-purple-400" },
            { t: "[14:02:11]", act: "faiss recall k=9", msg: "nearest neighbor dist=0.49 · threshold=0.33", color: "text-amber-400" },
            { t: "[14:02:11]", act: "anomaly classified", msg: "solder_bridge detected on pad J4-J5", color: "text-red-400 font-semibold" },
            { t: "[14:02:12]", act: "vision-llm spec audit", msg: "specification analysis complete · 312 tokens · 412ms", color: "text-pink-400" },
            { t: "[14:02:12]", act: "report RPT-2419-00482", msg: "cryptographically signed · routed to ops console", color: "text-teal-400 font-semibold" },
          ].map((l, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded bg-background/50 px-3 py-1.5 border border-border/50">
              <span className="text-muted-foreground/60 w-6 text-right">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-muted-foreground">{l.t}</span>
              <span className={`font-semibold ${l.color}`}>{l.act}</span>
              <span className="text-foreground/80 ml-auto">{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </PlatformShell>
  );
}

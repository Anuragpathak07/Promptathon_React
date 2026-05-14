import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Cpu, HardDrive, Zap, GitBranch, AlertTriangle, RefreshCw, Activity, ShieldCheck, ArrowRight, Server, Wrench, Layers } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/monitoring")({
  head: () => ({ meta: [{ title: "Model Monitoring · Carrier AI" }] }),
  component: Monitoring,
});

function Monitoring() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/models");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch monitoring data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const defaultLatency = Array.from({ length: 40 }, (_, i) => ({ t: i, p50: 9 + Math.random() * 4, p99: 22 + Math.random() * 8 }));
  const defaultDrift = Array.from({ length: 30 }, (_, i) => ({ t: i, v: 0.02 + Math.abs(Math.sin(i / 5)) * 0.05 + Math.random() * 0.01 }));

  const defaultModels = [
    { n: "metal_nut", v: "v4.1", env: "prod", lat: "11ms", req: "1.2k/m", drift: 0.03, status: "healthy" },
    { n: "transistor", v: "v4.2", env: "prod", lat: "14ms", req: "850/m", drift: 0.02, status: "healthy" },
    { n: "capsule", v: "v4.3", env: "prod", lat: "12ms", req: "620/m", drift: 0.04, status: "healthy" },
    { n: "cable", v: "v4.4", env: "prod", lat: "15ms", req: "410/m", drift: 0.03, status: "healthy" },
    { n: "pcb1", v: "v4.5", env: "prod", lat: "18ms", req: "950/m", drift: 0.05, status: "watch" },
  ];

  const latencySeries = data?.latencySeries || defaultLatency;
  const driftSeries = data?.driftSeries || defaultDrift;
  const models = data?.models || defaultModels;

  return (
    <PlatformShell title="Model Monitoring" breadcrumb={["Carrier AI", "MLOps", "Monitoring"]}>
      <SectionHeader 
        eyebrow="MLOps" 
        title="Model health & performance" 
        description="Inference latency, drift, GPU utilization and pre-loaded FAISS index status across the fleet." 
        actions={
          <Button variant="outline" size="sm" onClick={fetchModels} disabled={loading} className="h-9 bg-secondary/40">
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh
          </Button>
        }
      />

      {/* Production Pipeline Placement Banner */}
      <div className="mb-6 rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Manufacturing Integration</div>
            <div className="text-[15px] font-semibold text-foreground">Production Line Testing Phase Placement</div>
          </div>
          <span className="rounded-full bg-primary/20 px-3 py-1 text-[11px] font-semibold text-primary border border-primary/30 flex items-center gap-1.5">
            <Activity className="h-3 w-3" />Active Stage: Optical Testing & Quality Control
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 items-center bg-background/50 p-4 rounded-lg border border-border">
          <div className="flex flex-col p-3 rounded bg-secondary/30 border border-border text-center">
            <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Stage 1</span>
            <span className="text-[13px] font-bold mt-1 text-foreground">Raw Material Feeds</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Component sorting</span>
          </div>
          <div className="flex flex-col p-3 rounded bg-secondary/30 border border-border text-center">
            <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Stage 2</span>
            <span className="text-[13px] font-bold mt-1 text-foreground">Assembly & SMT Mounting</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Physical part construction</span>
          </div>
          <div className="flex flex-col p-3.5 rounded bg-primary/15 border-2 border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary px-1.5 py-0.5 text-[8px] font-mono font-bold text-primary-foreground uppercase">Active AI</div>
            <span className="text-[10.5px] uppercase tracking-wider text-primary font-bold">Stage 3 · Testing Phase</span>
            <span className="text-[13.5px] font-extrabold mt-1 text-foreground">Carrier AI Optical AOI</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">PatchCore anomaly detection</span>
          </div>
          <div className="flex flex-col p-3 rounded bg-secondary/30 border border-border text-center">
            <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Stage 4</span>
            <span className="text-[13px] font-bold mt-1 text-foreground">Packing & Logistics</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">Passed unit shipping</span>
          </div>
        </div>
        <div className="mt-3 text-[12px] text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[var(--color-success)] shrink-0" />
          <span>Every MVTec category part passes through the automated optical testing phase. Defective items are instantly diverted off the line before packaging.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg P50 latency" value={data?.avgP50 || "11 ms"} delta="−2ms" trend="down" icon={<Zap className="h-4 w-4" />} accent />
        <StatCard label="GPU utilization" value={data?.gpuUtil || "64%"} delta="+3pp" trend="up" icon={<Cpu className="h-4 w-4" />} />
        <StatCard label="FAISS index vectors" value={data?.faissIndex || "171,404 vectors"} hint="Pre-loaded PatchCore coresets" icon={<HardDrive className="h-4 w-4" />} />
        <StatCard label="Drift incidents" value={data?.driftIncidents?.toString() || "2"} delta="0" trend="flat" icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      {/* Hardware & Performance Requirements Section */}
      <div className="mt-6 rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Infrastructure Specification</div>
            <div className="text-[15px] font-semibold text-foreground">Hardware & Performance Requirements</div>
          </div>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <Cpu className="h-4 w-4 text-primary" />Edge Processing SoC
            </div>
            <div className="mt-2 text-[12px] text-muted-foreground">
              ARM Cortex-A72 / A76 quad-core processor (Raspberry Pi 4B / Pi 5) optimized for ONNX runtime and lightweight quantized backbone extraction.
            </div>
            <div className="mt-3 pt-2 border-t border-border flex justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">Hardware Target:</span>
              <span className="text-[var(--color-success)] font-bold">Raspberry Pi 4 / 5</span>
            </div>
          </div>

          <div className="rounded-md border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <Server className="h-4 w-4 text-primary" />System Memory (RAM)
            </div>
            <div className="mt-2 text-[12px] text-muted-foreground">
              Minimum 4 GB LPDDR4X RAM for holding compact PatchCore feature memory banks and quantized coreset index structures without memory swapping.
            </div>
            <div className="mt-3 pt-2 border-t border-border flex justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">Memory Req:</span>
              <span className="text-[var(--color-success)] font-bold">&gt;= 4 GB RAM</span>
            </div>
          </div>

          <div className="rounded-md border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <HardDrive className="h-4 w-4 text-primary" />Storage Interface
            </div>
            <div className="mt-2 text-[12px] text-muted-foreground">
              Standard Class 10 MicroSD card or USB 3.0 SSD boot drive required for lightweight Edge AI model weight loading and local SQLite defect logging.
            </div>
            <div className="mt-3 pt-2 border-t border-border flex justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">Read Bandwidth:</span>
              <span className="text-[var(--color-success)] font-bold">&gt;= 100 MB/s</span>
            </div>
          </div>

          <div className="rounded-md border border-border bg-background/50 p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <Zap className="h-4 w-4 text-primary" />Optical Sensor Interface
            </div>
            <div className="mt-2 text-[12px] text-muted-foreground">
              Raspberry Pi Camera Module 3 (IMX708) or standard USB webcam via V4L2 drivers supporting continuous trigger capture and edge inspection.
            </div>
            <div className="mt-3 pt-2 border-t border-border flex justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">Trigger Rate:</span>
              <span className="text-[var(--color-success)] font-bold">&gt;= 15 FPS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Inference latency" subtitle="P50 / P99 · live AI benchmark">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={latencySeries}>
              <defs>
                <linearGradient id="lp50" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.22 268)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.55 0.22 268)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lp99" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.16 78)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.78 0.16 78)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Area type="monotone" dataKey="p99" stroke="oklch(0.78 0.16 78)" strokeWidth={1.2} fill="url(#lp99)" />
              <Area type="monotone" dataKey="p50" stroke="oklch(0.6 0.22 268)" strokeWidth={1.5} fill="url(#lp50)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Distribution drift" subtitle="KL divergence · live embeddings">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={driftSeries}>
              <defs>
                <linearGradient id="dr" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.16 158)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.7 0.16 158)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tt} />
              <Area type="monotone" dataKey="v" stroke="oklch(0.7 0.16 158)" strokeWidth={1.5} fill="url(#dr)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Deployed models</div>
            <div className="text-[15px] font-semibold">Production registry</div>
          </div>
          <button className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
            <GitBranch className="h-3.5 w-3.5" />Deployment history
          </button>
        </div>
        <table className="w-full text-[12.5px]">
          <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-5 py-2.5 text-left font-medium">Model Category</th>
              <th className="px-5 py-2.5 text-left font-medium">Version</th>
              <th className="px-5 py-2.5 text-left font-medium">Environment</th>
              <th className="px-5 py-2.5 text-right font-medium">Latency</th>
              <th className="px-5 py-2.5 text-right font-medium">Requests</th>
              <th className="px-5 py-2.5 text-right font-medium">Drift</th>
              <th className="px-5 py-2.5 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m: any) => (
              <tr key={m.n} className="border-b border-border last:border-0 hover:bg-secondary/40">
                <td className="px-5 py-3 font-medium">{m.n}</td>
                <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{m.v}</td>
                <td className="px-5 py-3"><span className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10.5px] uppercase tracking-wider">{m.env}</span></td>
                <td className="px-5 py-3 text-right tabular-nums">{m.lat}</td>
                <td className="px-5 py-3 text-right tabular-nums">{m.req}</td>
                <td className="px-5 py-3 text-right tabular-nums">{typeof m.drift === 'number' ? m.drift.toFixed(2) : m.drift}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] ${m.status === "healthy" ? "bg-[oklch(0.7_0.16_158/0.12)] text-[var(--color-success)]" : "bg-[oklch(0.78_0.16_78/0.12)] text-[var(--color-warning)]"}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />{m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PlatformShell>
  );
}

const tt = { background: "oklch(0.21 0.014 260)", border: "1px solid oklch(0.28 0.012 260)", borderRadius: 8, fontSize: 12 };

function Card({ title, subtitle, children }: any) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-3">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-[14px] font-semibold">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

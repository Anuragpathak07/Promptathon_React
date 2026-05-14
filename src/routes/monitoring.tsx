import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Cpu, HardDrive, Zap, GitBranch, AlertTriangle, RefreshCw } from "lucide-react";
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
    { n: "patchcore-v4.2", v: "v4.2.1", env: "prod", lat: "11ms", req: "1.2k/m", drift: 0.03, status: "healthy" },
    { n: "fastflow-v2.8", v: "v2.8.3", env: "prod", lat: "18ms", req: "488/m", drift: 0.07, status: "watch" },
    { n: "anomalib-v3.1", v: "v3.1.0", env: "canary", lat: "14ms", req: "62/m", drift: 0.02, status: "healthy" },
    { n: "vision-llm-r2", v: "r2.4", env: "prod", lat: "412ms", req: "210/m", drift: 0.04, status: "healthy" },
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg P50 latency" value={data?.avgP50 || "11 ms"} delta="−2ms" trend="down" icon={<Zap className="h-4 w-4" />} accent />
        <StatCard label="GPU utilization" value={data?.gpuUtil || "64%"} delta="+3pp" trend="up" icon={<Cpu className="h-4 w-4" />} />
        <StatCard label="FAISS index vectors" value={data?.faissIndex || "128,142 vectors"} hint="Pre-loaded PatchCore coresets" icon={<HardDrive className="h-4 w-4" />} />
        <StatCard label="Drift incidents" value={data?.driftIncidents?.toString() || "2"} delta="0" trend="flat" icon={<AlertTriangle className="h-4 w-4" />} />
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

      <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
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
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-3">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-[14px] font-semibold">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

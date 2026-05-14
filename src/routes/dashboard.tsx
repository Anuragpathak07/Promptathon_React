import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, Cpu, Gauge, ScanSearch, Download, Filter, RefreshCw } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Overview · Carrier AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/status");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const defaultSeries = Array.from({ length: 32 }, (_, i) => ({
    t: i,
    anomaly: Math.round(8 + Math.sin(i / 3) * 6 + Math.random() * 4),
    throughput: Math.round(1100 + Math.cos(i / 4) * 80 + Math.random() * 30),
  }));

  const defaultDefects = [
    { name: "Solder", v: 82 }, { name: "Missing", v: 64 }, { name: "Misalign", v: 41 },
    { name: "Scratch", v: 22 }, { name: "Crack", v: 18 }, { name: "Other", v: 9 },
  ];

  const series = data?.series || defaultSeries;
  const defects = data?.defects || defaultDefects;
  const alerts = data?.alerts || [
    { sev: "high", t: "Solder bridge spike · Line A", time: "2m" },
    { sev: "med", t: "Drift detected · Model v4.2", time: "14m" },
    { sev: "low", t: "Camera calibration overdue · Stn 12", time: "1h" },
  ];
  const lines = data?.lines || [
    { l: "Line A · PCB", m: "patchcore-v4.2", t: "1,284", d: "0.42", s: "ok" },
    { l: "Line B · Casting", m: "anomalib-v3.1", t: "612", d: "0.18", s: "ok" },
    { l: "Line C · Welds", m: "fastflow-v2.8", t: "488", d: "0.91", s: "warn" },
    { l: "Line D · Surface", m: "patchcore-v4.2", t: "2,104", d: "0.12", s: "ok" },
  ];

  return (
    <PlatformShell title="Overview" breadcrumb={["Carrier AI", "Operations", "Overview"]}>
      <SectionHeader
        eyebrow="Operations · East Region"
        title="Plant overview"
        description="Live status across all production lines and inspection stations connected to PatchCore AI."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchStatus} disabled={loading} className="h-9 bg-secondary/40">
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-9 bg-secondary/40"><Filter className="mr-1.5 h-3.5 w-3.5" />Filter</Button>
            <Button size="sm" className="h-9"><Download className="mr-1.5 h-3.5 w-3.5" />Export</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Throughput" value={data?.throughput || "1,284/hr"} delta="+4.2%" trend="up" hint="vs prev shift" icon={<Activity className="h-4 w-4" />} accent />
        <StatCard label="Defect rate" value={data?.defectRate || "0.31%"} delta="−12%" trend="down" hint="Live AI inspections" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Active models" value={data?.activeModels?.toString() || "9"} delta="0" trend="flat" hint="Pre-loaded FAISS coresets" icon={<Cpu className="h-4 w-4" />} />
        <StatCard label="P50 latency" value={data?.p50Latency || "11 ms"} delta="−2ms" trend="down" hint="P99 28ms" icon={<Gauge className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Anomaly score</div>
              <div className="text-[15px] font-semibold">Last 6 hours · 1m bins</div>
            </div>
            <div className="flex gap-1.5">
              {["1H", "6H", "24H", "7D"].map((r, i) => (
                <button key={r} className={`rounded px-2 py-1 text-[11px] ${i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.22 268)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.55 0.22 268)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
                <XAxis dataKey="t" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.014 260)", border: "1px solid oklch(0.28 0.012 260)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="anomaly" stroke="oklch(0.6 0.22 268)" strokeWidth={1.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Top defect classes</div>
            <div className="text-[15px] font-semibold">By frequency</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={defects} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "oklch(0.85 0.005 250)", fontSize: 11 }} axisLine={false} tickLine={false} width={85} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.014 260)", border: "1px solid oklch(0.28 0.012 260)", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "oklch(0.27 0.018 260)" }} />
                <Bar dataKey="v" fill="oklch(0.55 0.22 268)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Active alerts</div>
          <div className="mt-3 space-y-2.5">
            {alerts.map((a: any) => (
              <div key={a.t} className="flex items-start gap-2.5 rounded-md border border-border bg-background/40 p-2.5">
                <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${a.sev === "high" ? "bg-[var(--color-destructive)]" : a.sev === "med" ? "bg-[var(--color-warning)]" : "bg-muted-foreground"}`} />
                <div className="flex-1 text-[12.5px]">
                  <div>{a.t}</div>
                  <div className="text-[10.5px] text-muted-foreground">{a.time} ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Production lines</div>
              <div className="text-[15px] font-semibold">Live status</div>
            </div>
            <ScanSearch className="h-4 w-4 text-muted-foreground" />
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-2 text-left font-medium">Line</th>
                <th className="px-5 py-2 text-left font-medium">Model</th>
                <th className="px-5 py-2 text-right font-medium">Throughput</th>
                <th className="px-5 py-2 text-right font-medium">Defect%</th>
                <th className="px-5 py-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((r: any) => (
                <tr key={r.l} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-5 py-2.5 font-medium">{r.l}</td>
                  <td className="px-5 py-2.5 font-mono text-[11px] text-muted-foreground">{r.m}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{r.t}/hr</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{r.d}%</td>
                  <td className="px-5 py-2.5 text-right">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] ${r.s === "ok" ? "bg-[oklch(0.7_0.16_158/0.12)] text-[var(--color-success)]" : "bg-[oklch(0.78_0.16_78/0.12)] text-[var(--color-warning)]"}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />{r.s === "ok" ? "Healthy" : "Watch"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PlatformShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Download, Activity, Target, TrendingUp, AlertCircle, Award } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, LineChart, Line, Legend, ScatterChart, Scatter } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Carrier AI" }] }),
  component: Analytics,
});

const modelMetrics = [
  { category: "metal_nut", auroc: 0.9804, f1: 0.9838, avg_prec: 0.9958, threshold: 0.5574, normal: 22, anomaly: 93 },
  { category: "transistor", auroc: 0.9975, f1: 0.9744, avg_prec: 0.9965, threshold: 0.5238, normal: 60, anomaly: 40 },
  { category: "capsule", auroc: 0.5237, f1: 0.9046, avg_prec: 0.8391, threshold: 0.8793, normal: 23, anomaly: 109 },
  { category: "cable", auroc: 0.9895, f1: 0.9674, avg_prec: 0.9937, threshold: 0.5623, normal: 58, anomaly: 92 },
  { category: "pill", auroc: 0.9209, f1: 0.9433, avg_prec: 0.9849, threshold: 0.5034, normal: 26, anomaly: 141 },
  { category: "pcb1", auroc: 0.9602, f1: 0.8557, avg_prec: 0.9373, threshold: 0.3323, normal: 201, anomaly: 100 },
  { category: "pcb2", auroc: 0.9068, f1: 0.7772, avg_prec: 0.8474, threshold: 0.3333, normal: 201, anomaly: 100 },
  { category: "pcb3", auroc: 0.8716, f1: 0.7187, avg_prec: 0.8218, threshold: 0.3472, normal: 202, anomaly: 100 },
  { category: "pcb4", auroc: 0.9900, f1: 0.9307, avg_prec: 0.9827, threshold: 0.4054, normal: 201, anomaly: 100 },
];

function Analytics() {
  const avgAuroc = (modelMetrics.reduce((acc, m) => acc + m.auroc, 0) / modelMetrics.length * 100).toFixed(1);
  const avgF1 = (modelMetrics.reduce((acc, m) => acc + m.f1, 0) / modelMetrics.length * 100).toFixed(1);
  const avgPrec = (modelMetrics.reduce((acc, m) => acc + m.avg_prec, 0) / modelMetrics.length * 100).toFixed(1);

  return (
    <PlatformShell title="Analytics" breadcrumb={["Carrier AI", "Analytics"]}>
      <SectionHeader
        eyebrow="System Evaluation Benchmark"
        title="Model Performance Metrics"
        description="Comprehensive evaluation scores (AUROC, F1-Score, Average Precision) and dataset composition across all 9 MVTec anomaly detection categories."
        actions={
          <Button size="sm" className="h-9"><Download className="mr-1.5 h-3.5 w-3.5" />Export Report</Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Average AUROC" value={`${avgAuroc}%`} delta="+1.2pp" trend="up" icon={<Target className="h-4 w-4" />} accent />
        <StatCard label="Average F1-Score" value={`${avgF1}%`} delta="+2.4pp" trend="up" icon={<Award className="h-4 w-4" />} />
        <StatCard label="Average Precision" value={`${avgPrec}%`} delta="+0.8pp" trend="up" icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Total Benchmark Samples" value="1,869" hint="994 Normal · 875 Anomaly" icon={<AlertCircle className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="System Performance Metrics Trend" subtitle="AUROC, F1-Score, and Avg Precision">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={modelMetrics} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 11 }} angle={-25} textAnchor="end" axisLine={false} tickLine={false} height={40} />
              <YAxis domain={[0.5, 1.0]} tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Line type="monotone" dataKey="auroc" name="AUROC" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="f1" name="F1-Score" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="avg_prec" name="Avg Precision" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Dataset Composition" subtitle="Normal vs Anomaly Samples">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={modelMetrics} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 11 }} angle={-25} textAnchor="end" axisLine={false} tickLine={false} height={40} />
              <YAxis tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.27 0.018 260)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="normal" name="Normal Samples" stackId="a" fill="#14b8a6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="anomaly" name="Anomaly Samples" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Evaluation Results Table</div>
            <div className="text-[15px] font-semibold">Detailed Benchmark Scores by Category</div>
          </div>
        </div>
        <table className="w-full text-[12.5px]">
          <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left font-medium">Category</th>
              <th className="px-5 py-3 text-right font-medium">AUROC</th>
              <th className="px-5 py-3 text-right font-medium">F1-Score</th>
              <th className="px-5 py-3 text-right font-medium">Avg Precision</th>
              <th className="px-5 py-3 text-right font-medium">Optimal Threshold</th>
              <th className="px-5 py-3 text-right font-medium">Normal Count</th>
              <th className="px-5 py-3 text-right font-medium">Anomaly Count</th>
            </tr>
          </thead>
          <tbody>
            {modelMetrics.map((m) => (
              <tr key={m.category} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="px-5 py-3 font-medium text-foreground">{m.category}</td>
                <td className="px-5 py-3 text-right tabular-nums font-mono text-[#8b5cf6] font-semibold">{m.auroc.toFixed(4)}</td>
                <td className="px-5 py-3 text-right tabular-nums font-mono text-[#f97316] font-semibold">{m.f1.toFixed(4)}</td>
                <td className="px-5 py-3 text-right tabular-nums font-mono text-[#14b8a6] font-semibold">{m.avg_prec.toFixed(4)}</td>
                <td className="px-5 py-3 text-right tabular-nums font-mono">{m.threshold.toFixed(4)}</td>
                <td className="px-5 py-3 text-right tabular-nums font-mono">{m.normal}</td>
                <td className="px-5 py-3 text-right tabular-nums font-mono">{m.anomaly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PlatformShell>
  );
}

const tooltipStyle = { background: "oklch(0.21 0.014 260)", border: "1px solid oklch(0.28 0.012 260)", borderRadius: 8, fontSize: 12 };

function ChartCard({ title, subtitle, children, className = "" }: any) {
  return (
    <div className={`rounded-lg border border-border bg-card p-5 ${className}`}>
      <div className="mb-3">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-[14px] font-semibold">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

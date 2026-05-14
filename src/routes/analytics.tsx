import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Activity, Target, TrendingUp, AlertCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, LineChart, Line, Legend } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Carrier AI" }] }),
  component: Analytics,
});

const trend = Array.from({ length: 30 }, (_, i) => ({
  d: `D${i + 1}`,
  defects: Math.round(20 + Math.sin(i / 4) * 10 + Math.random() * 8),
  inspections: Math.round(8000 + Math.cos(i / 5) * 800 + Math.random() * 300),
}));

const byLine = [
  { name: "Line A", v: 1.2 }, { name: "Line B", v: 0.4 }, { name: "Line C", v: 2.1 },
  { name: "Line D", v: 0.3 }, { name: "Line E", v: 0.9 }, { name: "Line F", v: 0.7 },
];

const accuracy = Array.from({ length: 14 }, (_, i) => ({
  d: `W${i + 1}`,
  precision: 0.96 + Math.sin(i / 2) * 0.02,
  recall: 0.94 + Math.cos(i / 2) * 0.025,
}));

function Analytics() {
  return (
    <PlatformShell title="Analytics" breadcrumb={["Carrier AI", "Analytics"]}>
      <SectionHeader
        eyebrow="Manufacturing intelligence"
        title="Quality analytics"
        description="Statistical process control, defect trends and model accuracy across the fleet."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 bg-secondary/40"><Calendar className="mr-1.5 h-3.5 w-3.5" />Last 30 days</Button>
            <Button size="sm" className="h-9"><Download className="mr-1.5 h-3.5 w-3.5" />Export</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total inspections" value="248,394" delta="+8.4%" trend="up" icon={<Activity className="h-4 w-4" />} accent />
        <StatCard label="Defects caught" value="781" delta="+3.1%" trend="up" icon={<AlertCircle className="h-4 w-4" />} />
        <StatCard label="Model precision" value="98.2%" delta="+0.4pp" trend="up" icon={<Target className="h-4 w-4" />} />
        <StatCard label="False positive rate" value="0.18%" delta="−0.06pp" trend="down" icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Defect frequency · 30 days" subtitle="Daily count">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="d1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.22 268)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.55 0.22 268)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="defects" stroke="oklch(0.6 0.22 268)" strokeWidth={1.5} fill="url(#d1)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Defect rate by line" subtitle="%">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byLine}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.27 0.018 260)" }} />
              <Bar dataKey="v" fill="oklch(0.55 0.22 268)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Model precision & recall · 14 weeks" subtitle="Weekly aggregates">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={accuracy}>
              <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0.9, 1]} tick={{ fill: "oklch(0.68 0.015 255)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "oklch(0.68 0.015 255)" }} />
              <Line type="monotone" dataKey="precision" stroke="oklch(0.6 0.22 268)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="recall" stroke="oklch(0.7 0.16 158)" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk heatmap" subtitle="Lines × shifts">
          <div className="mt-2 grid grid-cols-9 gap-1 text-[9.5px]">
            <div />
            {["S1","S2","S3","S4","S5","S6","S7","S8"].map(s=><div key={s} className="text-center text-muted-foreground">{s}</div>)}
            {["A","B","C","D","E","F"].map((row, ri) => (
              <div key={row} className="contents">
                <div className="text-muted-foreground self-center">{row}</div>
                {Array.from({ length: 8 }).map((_, ci) => {
                  const intensity = (Math.sin(ri + ci) + 1) / 2 * 0.8 + 0.1;
                  return <div key={ci} className="aspect-square rounded-sm" style={{ background: `oklch(0.55 0.22 268 / ${intensity * 0.9 + 0.05})` }} />;
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Low</span>
            <div className="h-1.5 flex-1 mx-3 rounded-full bg-gradient-to-r from-[oklch(0.55_0.22_268/0.05)] to-[oklch(0.55_0.22_268/0.95)]" />
            <span>High</span>
          </div>
        </ChartCard>
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

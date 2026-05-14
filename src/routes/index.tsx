import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  ScanSearch,
  BarChart3,
  Network,
  Database,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carrier AI — Industrial Intelligence Platform" },
      { name: "description", content: "Enterprise AI infrastructure for industrial quality control, anomaly detection and intelligent manufacturing." },
      { property: "og:title", content: "Carrier AI — Industrial Intelligence Platform" },
      { property: "og:description", content: "Vision inspection, anomaly detection and manufacturing intelligence for Fortune 500 industrial operations." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />
      <Hero />
      <LogoStrip />
      <CapabilityGrid />
      <DashboardPreview />
      <ArchitectureBand />
      <SecurityBand />
      <CTA />
      <Footer />
    </div>
  );
}

function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[oklch(0.4_0.2_268)] ring-1 ring-primary/40">
            <Cpu className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-[14px] font-semibold tracking-tight">Carrier AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[13px] text-muted-foreground md:flex">
          <a href="#platform" className="hover:text-foreground transition">Platform</a>
          <a href="#architecture" className="hover:text-foreground transition">Architecture</a>
          <a href="#security" className="hover:text-foreground transition">Security</a>
          <a href="#" className="hover:text-foreground transition">Docs</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[13px]">Sign in</Button>
          <Button asChild size="sm" className="text-[13px]">
            <Link to="/dashboard">Open Console <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-24 pt-20 lg:grid-cols-12 lg:pt-28">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
            Industrial AI Platform · v4.2
          </div>
          <h1 className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-gradient lg:text-[60px]">
            Enterprise AI infrastructure for industrial quality control.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Vision inspection, PCB analysis and real-time anomaly detection — unified into a single
            operations platform deployed across the world's most demanding manufacturing lines.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 px-5">
              <Link to="/dashboard">Launch Console <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="h-11 px-5 bg-secondary/40">
              Request enterprise demo
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-6 max-w-lg">
            {[
              { v: "99.94%", l: "Detection accuracy" },
              { v: "12 ms", l: "P50 inference" },
              { v: "240+", l: "Production lines" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-[22px] font-semibold tabular-nums tracking-tight">{s.v}</div>
                <div className="text-[11.5px] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <FloatingDashboard />
        </div>
      </div>
    </section>
  );
}

function FloatingDashboard() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-2xl" />
      <div className="relative rounded-xl border border-border bg-card/80 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse-dot" />
            <span className="text-[11.5px] font-medium">Line A · Station 04</span>
          </div>
          <span className="font-mono text-[10.5px] text-muted-foreground">PCB-X4 · 14:02:11Z</span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-[oklch(0.13_0.01_260)]">
          <div className="absolute inset-0 bg-grid-sm opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,oklch(0.55_0.22_268/0.35),transparent_40%),radial-gradient(circle_at_70%_60%,oklch(0.65_0.22_25/0.3),transparent_35%)]" />
          <div className="absolute left-[24%] top-[28%] h-16 w-20 rounded border-2 border-primary/80 shadow-[0_0_20px_oklch(0.55_0.22_268/0.5)]">
            <span className="absolute -top-5 left-0 rounded-sm bg-primary px-1.5 text-[9px] font-medium text-primary-foreground">DEFECT 0.94</span>
          </div>
          <div className="absolute left-[62%] top-[55%] h-10 w-12 rounded border border-[var(--color-warning)]/80">
            <span className="absolute -top-5 left-0 rounded-sm bg-[var(--color-warning)]/90 px-1.5 text-[9px] font-medium text-background">0.61</span>
          </div>
          <div className="absolute inset-x-0 top-0 h-[1px] bg-primary/60 animate-scan" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { l: "Anomaly", v: "0.94", t: "high" },
            { l: "Confidence", v: "98.2%" },
            { l: "Latency", v: "11ms" },
          ].map((m) => (
            <div key={m.l} className="rounded-md border border-border bg-secondary/40 px-2.5 py-2">
              <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
              <div className={`mt-0.5 text-[14px] font-semibold tabular-nums ${m.t === "high" ? "text-[var(--color-destructive)]" : ""}`}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -left-8 top-32 hidden w-56 rounded-lg border border-border bg-card/90 p-3 shadow-xl backdrop-blur-xl lg:block">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Vision LLM Report</div>
        <div className="mt-1.5 text-[11.5px] leading-snug">
          Solder bridge detected on pad J4. Recommend rework — class A defect, frequency rising on line A.
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 hidden w-48 rounded-lg border border-border bg-card/90 p-3 shadow-xl backdrop-blur-xl lg:block">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Throughput</span>
          <Activity className="h-3 w-3 text-primary" />
        </div>
        <div className="mt-1 text-[18px] font-semibold tabular-nums">1,284<span className="text-[11px] text-muted-foreground"> /hr</span></div>
        <Sparkline />
      </div>
    </div>
  );
}

function Sparkline() {
  const points = [12, 18, 14, 22, 20, 28, 24, 30, 26, 34, 32, 38];
  const max = Math.max(...points);
  const w = 160, h = 28;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i * w) / (points.length - 1)} ${h - (p / max) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-1.5 w-full">
      <path d={path} stroke="oklch(0.55 0.22 268)" strokeWidth="1.5" fill="none" />
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="oklch(0.55 0.22 268 / 0.15)" />
    </svg>
  );
}

function LogoStrip() {
  return (
    <section className="border-b border-border/60 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by global manufacturing operations
        </p>
        <div className="mt-6 grid grid-cols-2 items-center gap-8 opacity-60 sm:grid-cols-3 md:grid-cols-6">
          {["NORDIC IND", "AXIS MFG", "HELION", "VOLTRA", "MERIDIAN", "ATLAS-K"].map((n) => (
            <div key={n} className="text-center font-mono text-[12px] tracking-[0.2em] text-muted-foreground">{n}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityGrid() {
  const items = [
    { i: ScanSearch, t: "Vision Inspection", d: "Sub-pixel defect detection on PCBs, castings, welds and surface finishes." },
    { i: Activity, t: "Real-time Monitoring", d: "Stream inference results and operational telemetry across every production line." },
    { i: BarChart3, t: "Manufacturing Analytics", d: "SPC-grade dashboards, drift analysis and statistical quality control." },
    { i: Cpu, t: "Anomaly Detection", d: "PatchCore + FAISS memory banks tuned per product family and station." },
    { i: Network, t: "Vision LLM Reports", d: "Auto-generated inspection narratives, root cause hints and remediation steps." },
    { i: Database, t: "Dataset Lifecycle", d: "Versioned datasets with annotation review, splits and lineage tracking." },
  ];
  return (
    <section id="platform" className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-primary/80">Platform</div>
          <h2 className="text-[32px] font-semibold tracking-tight">A unified control plane for industrial AI.</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Every module is built around the same memory-bank architecture, the same observability stack
            and the same governance model — so your team works on one platform, not seven.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.t} className="group relative bg-card p-6 transition-colors hover:bg-secondary/40">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary/60 text-primary">
                <it.i className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{it.t}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-primary/80">Operations Console</div>
            <h2 className="text-[32px] font-semibold tracking-tight">Built for the line, not the lab.</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Operators triage anomalies in seconds. Engineers tune thresholds without redeploys.
              Quality teams export audit-ready reports straight from the console.
            </p>
            <ul className="mt-6 space-y-3 text-[13px]">
              {[
                "Sub-15ms inference at the edge",
                "Per-station threshold calibration",
                "Vision LLM root-cause narratives",
                "Full audit trail and role-based access",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2.5">
                <div className="flex items-center gap-2 text-[11.5px]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse-dot" />
                  <span className="font-medium">Plant Overview · East Region</span>
                </div>
                <span className="font-mono text-[10.5px] text-muted-foreground">live · 14:02:11Z</span>
              </div>
              <div className="grid grid-cols-12 gap-4 p-5">
                <div className="col-span-12 grid grid-cols-4 gap-3">
                  {[
                    { l: "Throughput", v: "1.28k/hr", d: "+4.2%" },
                    { l: "Defect rate", v: "0.31%", d: "−12%" },
                    { l: "Active models", v: "12", d: "0" },
                    { l: "Open alerts", v: "3", d: "+1" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-md border border-border bg-background/40 px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-[16px] font-semibold tabular-nums">{s.v}</span>
                        <span className="text-[10px] text-muted-foreground">{s.d}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-span-8 rounded-md border border-border bg-background/40 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11.5px] font-medium">Anomaly score · last 6h</span>
                    <span className="text-[10px] text-muted-foreground">window 6h · 1m</span>
                  </div>
                  <FakeAreaChart />
                </div>
                <div className="col-span-4 rounded-md border border-border bg-background/40 p-4">
                  <div className="mb-2 text-[11.5px] font-medium">Top defect classes</div>
                  <div className="space-y-2.5">
                    {[
                      { n: "Solder bridge", p: 82, c: "oklch(0.55 0.22 268)" },
                      { n: "Missing component", p: 64, c: "oklch(0.7 0.16 158)" },
                      { n: "Misalignment", p: 41, c: "oklch(0.78 0.16 78)" },
                      { n: "Surface scratch", p: 22, c: "oklch(0.65 0.2 25)" },
                    ].map((d) => (
                      <div key={d.n}>
                        <div className="mb-1 flex justify-between text-[11px]"><span>{d.n}</span><span className="text-muted-foreground tabular-nums">{d.p}</span></div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-border">
                          <div className="h-full rounded-full" style={{ width: `${d.p}%`, background: d.c }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FakeAreaChart() {
  const data = [4, 6, 5, 8, 7, 9, 12, 9, 14, 11, 18, 15, 12, 17, 22, 19, 16, 24, 28, 23, 19, 26, 30, 22, 18];
  const max = Math.max(...data);
  const w = 600, h = 160;
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${(i * w) / (data.length - 1)} ${h - (v / max) * h * 0.9 - 5}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.22 268)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.55 0.22 268)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2={w} y1={(h / 4) * i + 10} y2={(h / 4) * i + 10} stroke="oklch(1 0 0 / 0.04)" />
      ))}
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#ag)" />
      <path d={path} stroke="oklch(0.6 0.22 268)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function ArchitectureBand() {
  return (
    <section id="architecture" className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-primary/80">Architecture</div>
            <h2 className="text-[32px] font-semibold tracking-tight">Memory-bank inference, end to end.</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              From edge ingestion to FAISS-indexed feature recall and Vision LLM reasoning, every step
              of the pipeline is observable, versioned and rollback-safe.
            </p>
            <Button asChild variant="outline" className="mt-6 bg-secondary/40">
              <Link to="/architecture">Explore the architecture <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="grid grid-cols-5 items-center gap-3 text-center text-[11px]">
                {["Ingest", "Segment", "Features", "FAISS", "Report"].map((s, i) => (
                  <div key={s} className="relative">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-border bg-secondary/60 font-semibold text-primary">
                      {i + 1}
                    </div>
                    <div className="mt-2 font-medium">{s}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 font-mono text-[11px]">
                {[
                  "[ingest] line-A/station-04 → 1284 frames/s",
                  "[segment] mask quality 0.974 · drift 0.012",
                  "[features] patchcore embeddings 256d · 8.2ms",
                  "[faiss] knn k=5 · recall@1 0.991",
                  "[report] vision-llm narrative generated · 312 tokens",
                ].map((l, i) => (
                  <div key={i} className="flex gap-3 text-muted-foreground">
                    <span className="w-6 text-right text-muted-foreground/50">{String(i + 1).padStart(2, "0")}</span>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityBand() {
  const items = [
    { t: "SOC 2 Type II", d: "Audited annually with continuous control monitoring." },
    { t: "ISO 27001", d: "Certified information security management system." },
    { t: "On-prem & Air-gapped", d: "Deploy fully isolated for sensitive industrial environments." },
    { t: "Role-based Access", d: "Granular permissions, SSO, SCIM and full audit trails." },
  ];
  return (
    <section id="security" className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary/80">Security & Compliance</div>
        </div>
        <h2 className="mt-2 max-w-2xl text-[32px] font-semibold tracking-tight">Engineered for the strictest enterprise environments.</h2>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.t} className="bg-card p-6">
              <div className="text-[14px] font-semibold tracking-tight">{it.t}</div>
              <div className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{it.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-radial-glow opacity-70" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-primary" />
        <h2 className="mt-4 text-[36px] font-semibold tracking-tight text-gradient">
          Bring industrial AI to every line.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[14px] text-muted-foreground">
          Deploy the Carrier AI platform across your operations in weeks, not quarters.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="h-11 px-5">
            <Link to="/dashboard">Open the console <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" size="lg" className="h-11 px-5 bg-secondary/40">Talk to sales</Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 text-[12px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-primary to-[oklch(0.4_0.2_268)]">
            <Cpu className="h-3 w-3 text-primary-foreground" />
          </div>
          <span>© 2026 Carrier AI Industrial Systems</span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground transition">Privacy</a>
          <a href="#" className="hover:text-foreground transition">Security</a>
          <a href="#" className="hover:text-foreground transition">Status</a>
          <a href="#" className="hover:text-foreground transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}

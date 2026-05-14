import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { FileText, Download, Sparkles, ChevronRight, ShieldCheck, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports · Carrier AI" }] }),
  component: Reports,
});

function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("RPT-2419");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/reports");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const defaultReports = [
    { id: "RPT-2419", t: "Line A · weekly inspection summary", d: "May 11 — May 17", risk: "low", op: "E. Marlow", st: "signed", summary: "Defect rate decreased 12% week-over-week. Solder bridge frequency increased in shifts S3–S4 — recommend reflow oven recalibration.", details: "Reviewed all 12 critical events. Two confirmed false positives reclassified.", defects: 42, rate: "0.31%" },
    { id: "RPT-2418", t: "Casting block · compliance audit", d: "Apr 2026", risk: "med", op: "K. Ito", st: "review", summary: "Minor surface porosity observed in Batch #402. Structural integrity verified via ultrasound.", details: "Inspected 8,420 cast blocks. Recommended die polishing cycle advance.", defects: 68, rate: "0.81%" },
    { id: "RPT-2417", t: "Solder bridge incident · Line A", d: "May 10", risk: "high", op: "E. Marlow", st: "signed", summary: "Class-A solder bridge spike triggered automated line pause.", details: "All affected boards routed to rework station. Paste dispensing nozzle cleaned.", defects: 19, rate: "4.20%" },
  ];

  const reportsList = data?.reports || defaultReports;
  const activeReport = reportsList.find((r: any) => r.id === selectedId) || reportsList[0];

  return (
    <PlatformShell title="Reports" breadcrumb={["Carrier AI", "Reports"]}>
      <SectionHeader 
        eyebrow="Audit & compliance" 
        title="Inspection reports" 
        description="AI-generated inspection summaries, compliance audits and signed operator notes powered by Vision LLMs." 
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading} className="h-9 bg-secondary/40">
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh
            </Button>
            <Button size="sm" className="h-9"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Generate report</Button>
          </>
        } 
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-3 text-[12px] font-medium">Recent reports</div>
          <ul>
            {reportsList.map((r: any) => (
              <li key={r.id} onClick={() => setSelectedId(r.id)} className={`group flex cursor-pointer items-center gap-4 border-b border-border px-5 py-3.5 last:border-0 hover:bg-secondary/40 ${r.id === activeReport?.id ? "bg-secondary/20" : ""}`}>
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${r.risk === "high" ? "bg-[oklch(0.62_0.22_25/0.15)] text-[var(--color-destructive)]" : r.risk === "med" ? "bg-[oklch(0.78_0.16_78/0.15)] text-[var(--color-warning)]" : "bg-[oklch(0.7_0.16_158/0.15)] text-[var(--color-success)]"}`}>{r.risk}</span>
                    {r.st === "signed" && <ShieldCheck className="h-3 w-3 text-[var(--color-success)]" />}
                  </div>
                  <div className="mt-0.5 text-[13px] truncate">{r.t}</div>
                  <div className="text-[11px] text-muted-foreground">{r.d} · {r.op}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="text-[12px] font-medium">{activeReport?.id} · preview</div>
              <Button variant="outline" size="sm" className="h-8 bg-secondary/40 text-[11px]"><Download className="mr-1 h-3 w-3" />PDF</Button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Carrier AI Inspection Report</div>
                <div className="text-[15px] font-semibold">{activeReport?.t}</div>
                <div className="text-[11px] text-muted-foreground">{activeReport?.d}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: "Defects", v: activeReport?.defects?.toString() || "42" },
                  { l: "Rate", v: activeReport?.rate || "0.31%" },
                  { l: "Risk", v: activeReport?.risk?.toUpperCase() || "LOW" },
                ].map((s) => (
                  <div key={s.l} className="rounded-md border border-border bg-background/40 p-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                    <div className="text-[14px] font-semibold tabular-nums">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-border bg-background/40 p-3 text-[12px] leading-relaxed">
                <div className="mb-1.5 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-primary"><Sparkles className="h-3 w-3" />AI summary</div>
                <p>{activeReport?.summary}</p>
              </div>
              <div className="rounded-md border border-border bg-background/40 p-3 text-[12px]">
                <div className="mb-1.5 text-[10.5px] uppercase tracking-wider text-muted-foreground">Operator notes</div>
                <p>{activeReport?.details}</p>
                <div className="mt-2 text-[10.5px] text-muted-foreground">Signed · {activeReport?.op} · 2026-05-17 16:41Z</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}

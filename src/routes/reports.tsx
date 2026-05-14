import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { FileText, Download, Sparkles, ChevronRight, ShieldCheck, RefreshCw, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports · Carrier AI" }] }),
  component: Reports,
});

function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("RPT-2419");
  const [deleting, setDeleting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/reports");
      const json = await res.json();
      setData(json);
      if (json?.reports?.length > 0 && (!selectedId || !json.reports.some((r: any) => r.id === selectedId))) {
        setSelectedId(json.reports[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const deleteReport = async (id: string) => {
    if (!confirm(`Are you sure you want to delete report ${id}?`)) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:8000/api/reports/${id}`, { method: "DELETE" });
      await fetchReports();
    } catch (err) {
      console.error("Failed to delete report", err);
      alert("Failed to delete report.");
    } finally {
      setDeleting(false);
    }
  };

  const defaultReports = [
    { id: "RPT-2419", t: "Line A · Weekly Inspection Summary", d: "May 11 — May 17", risk: "low", op: "E. Marlow", st: "signed", summary: "Defect rate decreased 12% week-over-week. Solder bridge frequency increased in shifts S3–S4 — recommend reflow oven recalibration.", details: "Reviewed all 12 critical events across 13,482 inspections. Two confirmed false positives reclassified.", defects: 42, rate: "0.31%" },
    { id: "RPT-2418", t: "Casting Block · Compliance Audit", d: "Apr 2026", risk: "med", op: "K. Ito", st: "review", summary: "Minor surface porosity observed in Batch #402. Structural integrity verified via ultrasound.", details: "Inspected 8,420 cast blocks. Recommended die polishing cycle advance.", defects: 68, rate: "0.81%" },
    { id: "RPT-2417", t: "Solder Bridge Incident Investigation", d: "May 10", risk: "high", op: "E. Marlow", st: "signed", summary: "Class-A solder bridge spike triggered automated line pause.", details: "All affected boards routed to rework station. Paste dispensing nozzle cleaned.", defects: 19, rate: "4.20%" },
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
          {reportsList.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-[13px]">No reports found. Generate one from the Inspection workspace!</div>
          ) : (
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
                    <div className="mt-0.5 text-[13px] truncate font-semibold">{r.t}</div>
                    <div className="text-[11px] text-muted-foreground">{r.d} · {r.op}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          {activeReport ? (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="text-[12px] font-medium">{activeReport.id} · preview</div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteReport(activeReport.id)} 
                    disabled={deleting} 
                    className="h-8 border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-[11px]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-secondary/40 text-[11px]"><Download className="mr-1 h-3 w-3" />PDF</Button>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Carrier AI Quality Compliance Audit</div>
                  <div className="text-[16px] font-bold mt-0.5">{activeReport.t}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{activeReport.d}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Defects", v: activeReport.defects?.toString() || "0" },
                    { l: "Rate / Distance", v: activeReport.rate || "0.31%" },
                    { l: "Risk Level", v: activeReport.risk?.toUpperCase() || "LOW" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-md border border-border bg-background/40 p-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                      <div className="text-[15px] font-mono font-bold tabular-nums mt-0.5">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-md border border-border bg-background/40 p-3.5 text-[12px] leading-relaxed">
                  <div className="mb-2 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-primary font-semibold"><Sparkles className="h-3 w-3" />Executive Summary</div>
                  <p className="text-foreground/90 font-medium">{activeReport.summary}</p>
                </div>
                <div className="rounded-md border border-border bg-background/40 p-3.5 text-[12px] leading-relaxed">
                  <div className="mb-2 text-[10.5px] uppercase tracking-wider text-muted-foreground font-semibold">Detailed Specification Audit</div>
                  <p className="whitespace-pre-line font-mono text-[11px] text-muted-foreground">{activeReport.details}</p>
                  <div className="mt-4 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Cryptographically Signed</span>
                    <span>{activeReport.op}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground text-[13px]">
              Select a report to view details.
            </div>
          )}
        </div>
      </div>
    </PlatformShell>
  );
}

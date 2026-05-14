import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Upload, Search, Folder, ImageIcon, Tag, GitBranch, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/datasets")({
  head: () => ({ meta: [{ title: "Datasets · Carrier AI" }] }),
  component: Datasets,
});

function Datasets() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/datasets");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch datasets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const defaultDomains = [
    { l: "All", c: 53, a: true },
    { l: "PCB", c: 18 },
    { l: "Castings", c: 12 },
    { l: "Welds", c: 9 },
    { l: "Surfaces", c: 14 },
  ];

  const defaultStats = { totalImages: "248k", annotated: "97.4%", storage: "1.84 TB" };

  const defaultDatasets = [
    { n: "pcb-x4-master", c: 14238, v: "v12", split: "70/15/15", lbl: "12 classes", upd: "2h ago" },
    { n: "casting-block-2024", c: 8421, v: "v7", split: "80/10/10", lbl: "5 classes", upd: "1d ago" },
    { n: "weld-joints-q3", c: 3921, v: "v3", split: "70/20/10", lbl: "4 classes", upd: "4d ago" },
    { n: "surface-finish-A", c: 21082, v: "v15", split: "75/15/10", lbl: "8 classes", upd: "9d ago" },
    { n: "connector-J-series", c: 5612, v: "v4", split: "70/15/15", lbl: "6 classes", upd: "2w ago" },
  ];

  const domains = data?.domains || defaultDomains;
  const stats = data?.stats || defaultStats;
  const datasetsList = data?.datasets || defaultDatasets;
  const preview = data?.preview || {
    name: "pcb-x4-master",
    version: "v12",
    updated: "2h ago",
    total: "14,238",
    samples: Array.from({ length: 24 }, (_, i) => ({
      id: `#${(i+1).toString().padStart(4,"0")}`,
      cx: 20 + (i*7)%60,
      cy: 30 + (i*11)%50,
      hue: 250 + i*3,
      anom: i % 5 === 0
    }))
  };

  return (
    <PlatformShell title="Datasets" breadcrumb={["Carrier AI", "Data", "Datasets"]}>
      <SectionHeader
        eyebrow="Data lifecycle"
        title="Dataset management"
        description="Versioned industrial datasets, PatchCore feature coresets, and train/val splits."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchDatasets} disabled={loading} className="h-9 bg-secondary/40">
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh
            </Button>
            <Button size="sm" className="h-9"><Upload className="mr-1.5 h-3.5 w-3.5" />Upload</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input className="w-full rounded-md border border-border bg-background/60 pl-8 pr-2 py-1.5 text-[12px] outline-none focus:border-primary/50" placeholder="Search datasets…" />
            </div>
            <div className="mt-4">
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground mb-2">Domains</div>
              <div className="space-y-1 text-[12.5px]">
                {domains.map((f: any) => (
                  <button key={f.l} className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 ${f.a ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40"}`}>
                    <span className="flex items-center gap-2"><Folder className="h-3.5 w-3.5" />{f.l}</span>
                    <span className="font-mono text-[10.5px]">{f.c}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground mb-3">Health</div>
            {[
              { l: "Total images", v: stats.totalImages },
              { l: "Annotated", v: stats.annotated },
              { l: "Storage", v: stats.storage },
            ].map((s) => (
              <div key={s.l} className="flex items-center justify-between py-1.5 text-[12px]">
                <span className="text-muted-foreground">{s.l}</span>
                <span className="font-mono">{s.v}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="lg:col-span-9 space-y-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left font-medium">Dataset</th>
                  <th className="px-5 py-3 text-right font-medium">Images</th>
                  <th className="px-5 py-3 text-left font-medium">Version</th>
                  <th className="px-5 py-3 text-left font-medium">Split</th>
                  <th className="px-5 py-3 text-left font-medium">Labels</th>
                  <th className="px-5 py-3 text-right font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {datasetsList.map((d: any) => (
                  <tr key={d.n} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-5 py-3 font-medium flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5 text-primary" />{d.n}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{d.c.toLocaleString()}</td>
                    <td className="px-5 py-3"><span className="font-mono text-[11px] text-muted-foreground inline-flex items-center gap-1"><GitBranch className="h-3 w-3" />{d.v}</span></td>
                    <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{d.split}</td>
                    <td className="px-5 py-3 text-muted-foreground inline-flex items-center gap-1.5"><Tag className="h-3 w-3" />{d.lbl}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{d.upd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Preview · {preview.name}</div>
                <div className="text-[14px] font-semibold">Sample images · {preview.samples.length} of {preview.total}</div>
              </div>
              <div className="text-[11px] text-muted-foreground">{preview.version} · {preview.updated}</div>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
              {preview.samples.map((s: any, i: number) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-md border border-border bg-[oklch(0.13_0.01_260)]">
                  <div className="absolute inset-0 bg-grid-sm opacity-50" />
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${s.cx}% ${s.cy}%, oklch(0.5 0.18 ${s.hue}/0.5), transparent 60%)` }} />
                  {s.anom && <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-sm border-2 border-[var(--color-destructive)]" />}
                  <div className="absolute bottom-0.5 right-1 font-mono text-[8.5px] text-muted-foreground">{s.id}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PlatformShell>
  );
}

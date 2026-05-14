import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Upload, Search, Folder, ImageIcon, Tag, GitBranch, RefreshCw, CheckCircle2, X } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/datasets")({
  head: () => ({ meta: [{ title: "Datasets · Carrier AI" }] }),
  component: Datasets,
});

function Datasets() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDatasetName, setSelectedDatasetName] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fetchDatasets = async (dsName?: string | null) => {
    setLoading(true);
    try {
      const url = dsName ? `http://localhost:8000/api/datasets?dataset=${dsName}` : "http://localhost:8000/api/datasets";
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
      if (json?.datasets?.length > 0 && !selectedDatasetName) {
        setSelectedDatasetName(json.datasets[0].n);
      }
    } catch (err) {
      console.error("Failed to fetch datasets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets(selectedDatasetName);
  }, [selectedDatasetName]);

  const defaultDomains = [
    { l: "All Domains", c: 5, a: true },
    { l: "PCB & SMT", c: 2, a: false },
    { l: "Industrial Parts", c: 3, a: false },
  ];

  const defaultStats = { totalImages: "14,238", annotated: "100.0%", storage: "6.0 GB" };

  const defaultDatasets = [
    { n: "metal_nut_coreset_dataset", c: 14238, v: "v4.1", split: "80/10/10", lbl: "metal_nut features", upd: "Live coreset" },
    { n: "transistor_coreset_dataset", c: 8421, v: "v4.2", split: "80/10/10", lbl: "transistor features", upd: "Live coreset" },
    { n: "capsule_coreset_dataset", c: 3921, v: "v4.3", split: "80/10/10", lbl: "capsule features", upd: "Live coreset" },
  ];

  const domains = data?.domains || defaultDomains;
  const stats = data?.stats || defaultStats;
  const datasetsList = data?.datasets || defaultDatasets;

  const activeDataset = datasetsList.find((d: any) => d.n === selectedDatasetName) || datasetsList[0] || defaultDatasets[0];

  const filteredDatasets = datasetsList.filter((d: any) =>
    d.n.toLowerCase().includes(searchQuery.toLowerCase()) || d.lbl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const previewSamples = data?.preview?.samples || Array.from({ length: 24 }, (_, i) => {
    const seed = activeDataset ? activeDataset.n.length : 1;
    return {
      id: `#${(i + 1).toString().padStart(4, "0")}`,
      cx: 20 + ((i * 7 + seed * 3) % 60),
      cy: 30 + ((i * 11 + seed * 5) % 50),
      hue: (200 + seed * 45 + i * 5) % 360,
      anom: i % 6 === 0,
    };
  });

  return (
    <PlatformShell title="Datasets" breadcrumb={["Carrier AI", "Data", "Datasets"]}>
      <SectionHeader
        eyebrow="Data lifecycle"
        title="Dataset management"
        description="Versioned industrial datasets, PatchCore feature coresets, and train/val splits."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => fetchDatasets(selectedDatasetName)} disabled={loading} className="h-9 bg-secondary/40">
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
              <input 
                className="w-full rounded-md border border-border bg-background/60 pl-8 pr-2 py-1.5 text-[12px] outline-none focus:border-primary/50 text-foreground" 
                placeholder="Search datasets…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground mb-2">Domains</div>
              <div className="space-y-1 text-[12.5px]">
                {domains.map((f: any) => (
                  <button key={f.l} className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 ${f.a ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary/40"}`}>
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
              { l: "Total feature vectors", v: stats.totalImages },
              { l: "Annotated split", v: stats.annotated },
              { l: "Coreset storage", v: stats.storage },
            ].map((s) => (
              <div key={s.l} className="flex items-center justify-between py-1.5 text-[12px]">
                <span className="text-muted-foreground">{s.l}</span>
                <span className="font-mono tabular-nums font-semibold">{s.v}</span>
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
                  <th className="px-5 py-3 text-right font-medium">Feature Vectors</th>
                  <th className="px-5 py-3 text-left font-medium">Version</th>
                  <th className="px-5 py-3 text-left font-medium">Split</th>
                  <th className="px-5 py-3 text-left font-medium">Labels</th>
                  <th className="px-5 py-3 text-right font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredDatasets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground text-[13px]">
                      No matching datasets found.
                    </td>
                  </tr>
                ) : (
                  filteredDatasets.map((d: any) => {
                    const isSelected = d.n === activeDataset?.n;
                    return (
                      <tr 
                        key={d.n} 
                        onClick={() => setSelectedDatasetName(d.n)}
                        className={`border-b border-border last:border-0 cursor-pointer transition hover:bg-secondary/40 ${isSelected ? "bg-secondary/25" : ""}`}
                      >
                        <td className="px-5 py-3 font-medium flex items-center gap-2.5 text-foreground">
                          <ImageIcon className={`h-3.5 w-3.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          {d.n}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums font-mono">{d.c.toLocaleString()}</td>
                        <td className="px-5 py-3"><span className="font-mono text-[11px] text-muted-foreground inline-flex items-center gap-1"><GitBranch className="h-3 w-3" />{d.v}</span></td>
                        <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{d.split}</td>
                        <td className="px-5 py-3 text-muted-foreground inline-flex items-center gap-1.5"><Tag className="h-3 w-3" />{d.lbl}</td>
                        <td className="px-5 py-3 text-right text-muted-foreground flex items-center justify-end gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-[var(--color-success)]" />{d.upd}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Preview · {activeDataset?.n}</div>
                <div className="text-[14px] font-semibold">Coreset Feature Distribution · {previewSamples.length} of {activeDataset?.c?.toLocaleString() || "14,238"}</div>
              </div>
              <div className="text-[11px] text-muted-foreground">{activeDataset?.v || "v4.1"} · Live sync</div>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
              {previewSamples.map((s: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => s.url && setLightboxImage(s.url)}
                  className="relative aspect-square overflow-hidden rounded-md border border-border bg-[oklch(0.13_0.01_260)] shadow-sm group cursor-pointer"
                >
                  {s.url ? (
                    <img src={s.url} alt="Dataset Sample" className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-110 z-10" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-grid-sm opacity-50" />
                      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${s.cx}% ${s.cy}%, oklch(0.5 0.18 ${s.hue}/0.5), transparent 60%)` }} />
                    </>
                  )}
                  {s.anom && <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-sm border-2 border-[var(--color-destructive)] shadow-[0_0_8px_var(--color-destructive)] z-20" />}
                  <div className="absolute bottom-0.5 right-1 font-mono text-[8.5px] bg-background/80 px-1 rounded text-muted-foreground z-20">{s.id}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-20">
              <button 
                onClick={() => setLightboxImage(null)}
                className="rounded-full bg-black/60 p-2 text-white hover:bg-destructive hover:text-destructive-foreground transition shadow-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-2 overflow-hidden flex-1 flex items-center justify-center bg-black/40">
              <img 
                src={lightboxImage} 
                alt="Enlarged Component" 
                className="w-full h-full object-contain max-h-[80vh] rounded"
              />
            </div>
            <div className="bg-background/90 backdrop-blur px-5 py-3 text-[12px] flex items-center justify-between border-t border-border">
              <span className="font-mono text-muted-foreground">{lightboxImage.split("/").pop()}</span>
              <span className="text-primary font-semibold">High-Resolution MVTec Industrial Spec</span>
            </div>
          </div>
        </div>
      )}
    </PlatformShell>
  );
}

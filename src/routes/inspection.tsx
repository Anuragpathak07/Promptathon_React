import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { Button } from "@/components/ui/button";
import { Upload, Play, ZoomIn, ZoomOut, Layers, GitCompare, FileText, ChevronRight, Sparkles, X, Bot, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/inspection")({
  head: () => ({ meta: [{ title: "Inspection · Carrier AI" }] }),
  component: Inspection,
});

function Inspection() {
  const [modelsList, setModelsList] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>("pcb1");
  const [showHeatmap, setShowHeatmap] = useState(true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [aiReportText, setAiReportText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Fetch available models
    fetch("http://localhost:8000/api/models")
      .then((res) => res.json())
      .then((data) => {
        if (data.models && data.models.length > 0) {
          setModelsList(data.models);
          setSelectedCat(data.models[0].n);
        }
      })
      .catch((err) => console.error("Failed to fetch models", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setResult(null); // Clear previous result when new image is uploaded
      setAiReportText(null);
      setReportSaved(false);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    setAiReportText(null);
    setReportSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const runInference = async () => {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setAiReportText(null);
    setReportSaved(false);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("category", selectedCat);

    try {
      const res = await fetch("http://localhost:8000/api/infer", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      if (data.specReport) {
        setAiReportText(data.specReport);
      }
    } catch (err) {
      console.error("Inference failed", err);
      alert("Inference failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const runAiAnalysis = async () => {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    setAiLoading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("category", selectedCat);
    formData.append("score", result?.anomalyScore ? result.anomalyScore.toString() : "0.94");
    formData.append("verdict", result?.isAnomaly ? "ANOMALY (DEFECTIVE)" : "NORMAL");

    try {
      const res = await fetch("http://localhost:8000/api/analyze-spec", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.specReport) {
        setAiReportText(data.specReport);
      }
    } catch (err) {
      console.error("AI Spec Analysis failed", err);
      alert("AI Spec Analysis failed. Check console for details.");
    } finally {
      setAiLoading(false);
    }
  };

  const saveReport = async () => {
    setSaveLoading(true);
    const formData = new FormData();
    formData.append("category", selectedCat);
    formData.append("score", result?.anomalyScore ? result.anomalyScore.toString() : "0.94");
    formData.append("verdict", result?.isAnomaly ? "ANOMALY (DEFECTIVE)" : "NORMAL");
    formData.append("reportText", displayReport);

    try {
      const res = await fetch("http://localhost:8000/api/generate-report", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        setReportSaved(true);
        alert(`Success! Inspection Report ${data.report.id} generated and added to the Reports dashboard.`);
      }
    } catch (err) {
      console.error("Failed to generate report", err);
      alert("Failed to generate report. Check console for details.");
    } finally {
      setSaveLoading(false);
    }
  };

  const metrics = result?.metrics || {
    memoryBankSize: 14238,
    recall1: 0.991,
    embeddingDim: 256,
    knnK: 9,
  };

  const anomScore = result?.anomalyScore ?? 0.94;
  const isAnom = result ? result.isAnomaly : true;
  const riskLabel = isAnom ? "High" : "Low";
  
  const defaultReason = "A class-A solder bridge is detected between pads J4 and J5, with a secondary low-confidence misalignment near connector U7.\n\nFrequency of solder bridges on Line A is up 18% over 24h. Recommend rework and inspect reflow oven profile.";
  const displayReport = aiReportText || result?.verdictReason || defaultReason;

  return (
    <PlatformShell title="Inspection" breadcrumb={["Carrier AI", "Inspection", "Workspace"]}>
      <div className="grid grid-cols-12 gap-4 -mx-2">
        {/* LEFT Controls */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <Panel title="Source" subtitle="Upload or stream">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="relative">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex w-full flex-col items-center gap-2 rounded-md border border-dashed border-border bg-background/40 p-5 text-center transition hover:border-primary/40 hover:bg-secondary/30"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <div className="text-[12px] font-medium truncate max-w-[180px]">
                  {imageFile ? imageFile.name : "Upload image"}
                </div>
                <div className="text-[10.5px] text-muted-foreground">PNG · JPG · TIFF · max 64MB</div>
              </button>
              {imageFile && (
                <button 
                  onClick={clearImage}
                  title="Remove image"
                  className="absolute top-2 right-2 rounded-full bg-secondary p-1 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Field label="Component class">
              <select 
                value={selectedCat} 
                onChange={(e) => {
                  setSelectedCat(e.target.value);
                  // Output perfectly persists! No setResult(null) or setAiReportText(null) here.
                }} 
                className="w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-[12px]"
              >
                {modelsList.length > 0 ? (
                  modelsList.map((m) => (
                    <option key={m.n} value={m.n}>{m.n.toUpperCase()} · Trained PatchCore</option>
                  ))
                ) : (
                  <>
                    <option value="pcb1">PCB1 · Trained PatchCore</option>
                    <option value="cable">CABLE · Trained PatchCore</option>
                    <option value="pill">PILL · Trained PatchCore</option>
                  </>
                )}
                <option value="other">OTHER · Zero-Shot LMM Bounding Box Analysis</option>
              </select>
            </Field>

            <Field label="Model Architecture">
              <select className="w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-[12px]">
                <option>patchcore-v4.2 (memory bank)</option>
                <option>fastflow-v2.8</option>
                <option>anomalib-v3.1</option>
              </select>
            </Field>

            <Button onClick={runInference} disabled={loading || !imageFile} className="w-full">
              <Play className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Running AI..." : "Run inference"}
            </Button>
          </Panel>

          <Panel title="Pipeline" subtitle="patchcore-v4.2">
            <div className="space-y-2 text-[11.5px]">
              {[
                { l: "Pre-process", t: "1.4ms", ok: true },
                { l: "Segmentation", t: "3.1ms", ok: true },
                { l: "Feature extract", t: "4.8ms", ok: true },
                { l: "FAISS recall", t: "1.2ms", ok: true },
                { l: "Vision LLM", t: "412ms", ok: true },
              ].map((s) => (
                <div key={s.l} className="flex items-center justify-between rounded-md bg-background/40 px-2.5 py-1.5 border border-border">
                  <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />{s.l}</span>
                  <span className="font-mono text-muted-foreground">{s.t}</span>
                </div>
              ))}
            </div>
          </Panel>
        </aside>

        {/* CENTER Viewer */}
        <section className="col-span-12 lg:col-span-6 space-y-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-medium">{imageFile ? imageFile.name : "PCB-X4-00482.tif"}</span>
                <span className="text-muted-foreground">· 2048 × 1536 · 24-bit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ToolBtn icon={ZoomOut} /><ToolBtn icon={ZoomIn} />
                <ToolBtn icon={GitCompare} label="A/B" />
                <button onClick={() => setShowHeatmap(!showHeatmap)} className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] ${showHeatmap ? "border-primary/50 bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>
                  <Layers className="h-3 w-3" />Heatmap
                </button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-[oklch(0.13_0.01_260)] flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-sm opacity-50" />
              
              {result && result.overlayBase64 && showHeatmap ? (
                <img 
                  src={`data:image/png;base64,${result.overlayBase64}`} 
                  alt="Anomaly Heatmap Overlay" 
                  className="absolute inset-0 w-full h-full object-contain z-10"
                />
              ) : imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Uploaded preview" 
                  className="absolute inset-0 w-full h-full object-contain z-10"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_38%,oklch(0.5_0.18_260/0.4),transparent_50%)]" />
              )}

              {result && result.defects && result.defects.map((d: any, idx: number) => {
                const box = d.box_2d || [25, 25, 50, 50];
                const top = `${box[0]}%`;
                const left = `${box[1]}%`;
                const height = `${box[2] - box[0]}%`;
                const width = `${box[3] - box[1]}%`;
                return (
                  <div key={idx} className="absolute border-2 border-[var(--color-destructive)] shadow-[0_0_20px_oklch(0.62_0.22_25/0.5)] z-20 pointer-events-none" style={{ top, left, height, width }}>
                    <span className="absolute -top-5 left-0 rounded-sm bg-[var(--color-destructive)] px-1.5 py-0.5 text-[9.5px] font-medium text-destructive-foreground whitespace-nowrap">
                      {d.label} · {d.score ? d.score.toFixed(2) : "0.88"}
                    </span>
                  </div>
                );
              })}

              {!result && !imagePreview && (
                <div className="absolute left-[24%] top-[28%] h-20 w-24 rounded border-2 border-[var(--color-destructive)] shadow-[0_0_20px_oklch(0.62_0.22_25/0.5)] z-20 pointer-events-none">
                  <span className="absolute -top-5 left-0 rounded-sm bg-[var(--color-destructive)] px-1.5 text-[9.5px] font-medium text-destructive-foreground">solder_bridge · 0.94</span>
                </div>
              )}

              <div className="absolute inset-x-0 top-0 h-[1px] bg-primary/60 animate-scan z-30" />
              <div className="absolute bottom-2 left-2 rounded bg-background/60 px-2 py-1 font-mono text-[10px] backdrop-blur z-30">
                x:1284 y:912 · 312% · RGB
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[12px] font-medium">Detection timeline · last 30 min</div>
              <div className="text-[10.5px] text-muted-foreground">82 inspections · 4 anomalies</div>
            </div>
            <div className="flex items-end gap-[2px] h-16">
              {Array.from({ length: 60 }).map((_, i) => {
                const v = 0.2 + Math.abs(Math.sin(i / 4)) * 0.7 + Math.random() * 0.1;
                const anom = i === 18 || i === 41 || i === 52;
                return <div key={i} className={`flex-1 rounded-sm ${anom ? "bg-[var(--color-destructive)]" : "bg-primary/40"}`} style={{ height: `${v * 100}%` }} />;
              })}
            </div>
          </div>
        </section>

        {/* RIGHT Results */}
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Anomaly score</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[34px] font-semibold tabular-nums">{anomScore.toFixed(2)}</span>
              <span className={`text-[11px] rounded px-1.5 py-0.5 ${isAnom ? "bg-[oklch(0.62_0.22_25/0.15)] text-[var(--color-destructive)]" : "bg-[oklch(0.7_0.16_158/0.15)] text-[var(--color-success)]"}`}>
                {riskLabel}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-success)] via-[var(--color-warning)] to-[var(--color-destructive)]" style={{ width: `${Math.min(anomScore * 100, 100)}%` }} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[10.5px] text-muted-foreground">
              <div>Risk<br/><span className="text-foreground font-medium">{isAnom ? "Critical" : "Normal"}</span></div>
              <div>Class<br/><span className="text-foreground font-medium">{selectedCat}</span></div>
              <div>Conf.<br/><span className="text-foreground font-medium">98.2%</span></div>
            </div>
          </div>

          <Panel title="AI Specification Analysis" icon={<Bot className="h-3.5 w-3.5 text-primary" />}>
            <div className="space-y-2 text-[12px] leading-relaxed text-foreground/90 whitespace-pre-line max-h-[280px] overflow-y-auto pr-1">
              {aiLoading ? "Generating AI Datasheet Specification Analysis..." : displayReport}
            </div>
            <Button 
              onClick={runAiAnalysis} 
              disabled={aiLoading || !imageFile} 
              className="mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground text-[11.5px] font-medium"
            >
              <Sparkles className={`mr-1.5 h-3.5 w-3.5 ${aiLoading ? "animate-spin" : ""}`} />
              {aiLoading ? "Analyzing Datasheet..." : "Run AI Spec Analysis"}
            </Button>
            
            <Button 
              onClick={saveReport} 
              disabled={saveLoading || reportSaved} 
              variant="outline" 
              className={`mt-2 w-full text-[11.5px] ${reportSaved ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "bg-secondary/40 hover:bg-secondary/60"}`}
            >
              {reportSaved ? (
                <>
                  <CheckCircle className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />Saved to Reports
                </>
              ) : (
                <>
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  {saveLoading ? "Saving Report..." : "Export & Save to Reports"}
                  <ChevronRight className="ml-auto h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </Panel>

          <Panel title="PatchCore metrics">
            <Stat l="Memory bank" v={metrics.memoryBankSize.toLocaleString()} />
            <Stat l="Recall@1" v={metrics.recall1.toString()} />
            <Stat l="Embedding dim" v={metrics.embeddingDim.toString()} />
            <Stat l="kNN k" v={metrics.knnK.toString()} />
          </Panel>
        </aside>
      </div>
    </PlatformShell>
  );
}

function Panel({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <div className="text-[12.5px] font-semibold">{title}</div>
        </div>
        {subtitle && <span className="text-[10.5px] text-muted-foreground">{subtitle}</span>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Stat({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-muted-foreground">{l}</span>
      <span className="font-mono tabular-nums">{v}</span>
    </div>
  );
}

function ToolBtn({ icon: Icon, label }: { icon: any; label?: string }) {
  return (
    <button className="flex items-center gap-1 rounded-md border border-border bg-background/40 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
      <Icon className="h-3 w-3" />{label}
    </button>
  );
}

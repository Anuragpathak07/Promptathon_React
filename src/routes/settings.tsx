import { createFileRoute } from "@tanstack/react-router";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Users, Key, Bell, Shield, Database, Plus } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Carrier AI" }] }),
  component: Settings,
});

const tabs = [
  { i: Users, l: "Members", a: true },
  { i: Key, l: "API keys" },
  { i: Bell, l: "Notifications" },
  { i: Shield, l: "Security" },
  { i: Database, l: "Environment" },
];

const members = [
  { n: "Elena Marlow", e: "elena@carrier-ai.com", role: "Owner", site: "East Region" },
  { n: "Kenji Ito", e: "k.ito@carrier-ai.com", role: "Engineer", site: "Asia" },
  { n: "Sara Vora", e: "s.vora@carrier-ai.com", role: "Quality Lead", site: "EMEA" },
  { n: "David Chen", e: "d.chen@carrier-ai.com", role: "Operator", site: "East Region" },
];

function Settings() {
  return (
    <PlatformShell title="Settings" breadcrumb={["Carrier AI", "Admin", "Settings"]}>
      <SectionHeader eyebrow="Admin" title="Workspace settings" description="Manage members, security, environments and integrations." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="space-y-1">
            {tabs.map((t) => (
              <button key={t.l} className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[12.5px] ${t.a ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40"}`}>
                <t.i className="h-3.5 w-3.5" />{t.l}
              </button>
            ))}
          </div>
        </aside>

        <section className="lg:col-span-9 space-y-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Workspace members</div>
                <div className="text-[14px] font-semibold">12 active · 3 invited</div>
              </div>
              <Button size="sm" className="h-9"><Plus className="mr-1.5 h-3.5 w-3.5" />Invite</Button>
            </div>
            <table className="w-full text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-5 py-2.5 text-left font-medium">Name</th>
                  <th className="px-5 py-2.5 text-left font-medium">Role</th>
                  <th className="px-5 py-2.5 text-left font-medium">Site</th>
                  <th className="px-5 py-2.5 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.e} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-[oklch(0.45_0.2_268)] text-[10.5px] font-semibold flex items-center justify-center">{m.n.split(" ").map(s=>s[0]).join("")}</div>
                        <div>
                          <div className="font-medium">{m.n}</div>
                          <div className="text-[10.5px] text-muted-foreground">{m.e}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><span className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10.5px]">{m.role}</span></td>
                    <td className="px-5 py-3 text-muted-foreground">{m.site}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground hover:text-foreground">···</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Security</div>
            <div className="text-[14px] font-semibold">Access controls</div>
            <div className="mt-4 divide-y divide-border">
              {[
                { t: "Enforce SSO", d: "Require SAML SSO for all members.", on: true },
                { t: "SCIM provisioning", d: "Sync members and roles from your IdP.", on: true },
                { t: "IP allowlist", d: "Restrict console access to trusted networks.", on: false },
                { t: "Audit log streaming", d: "Stream audit events to your SIEM.", on: true },
              ].map((s) => (
                <div key={s.t} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[13px] font-medium">{s.t}</div>
                    <div className="text-[11.5px] text-muted-foreground">{s.d}</div>
                  </div>
                  <Switch defaultChecked={s.on} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Environment</div>
            <div className="text-[14px] font-semibold">Variables</div>
            <div className="mt-4 space-y-2 font-mono text-[11.5px]">
              {[
                ["INFER_THRESHOLD", "0.72"],
                ["FAISS_INDEX_PATH", "/var/lib/faiss/pcb-x4-v12.idx"],
                ["VISION_LLM_MODEL", "vision-llm-r2.4"],
                ["AUDIT_SINK", "https://siem.internal/api/v1/events"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                  <span className="text-foreground">{k}</span>
                  <span className="text-muted-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PlatformShell>
  );
}

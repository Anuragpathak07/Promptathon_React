import { Bell, Command, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function TopBar({ title, breadcrumb }: { title: string; breadcrumb?: string[] }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="hidden h-5 w-px bg-border md:block" />
      <div className="hidden items-center gap-2 text-[13px] md:flex">
        {breadcrumb?.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className={i === breadcrumb.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}>{c}</span>
            {i < breadcrumb.length - 1 && <span className="text-muted-foreground/40">/</span>}
          </span>
        )) ?? <span className="text-foreground font-medium">{title}</span>}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="hidden h-9 w-72 items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 text-[12.5px] text-muted-foreground transition hover:border-border hover:bg-secondary/70 lg:flex">
          <Search className="h-3.5 w-3.5" />
          <span>Search models, datasets, reports…</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">
            <Command className="h-2.5 w-2.5" />K
          </span>
        </button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex h-9 items-center gap-2.5 rounded-md border border-border bg-secondary/40 px-2.5">
          <div className="h-6 w-6 rounded-sm bg-gradient-to-br from-primary to-[oklch(0.45_0.2_268)] text-[10px] font-semibold flex items-center justify-center">EM</div>
          <div className="hidden text-[11.5px] leading-tight md:block">
            <div className="font-medium">E. Marlow</div>
            <div className="text-muted-foreground">Site Engineer</div>
          </div>
        </div>
      </div>
    </header>
  );
}

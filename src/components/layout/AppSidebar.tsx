import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanSearch,
  BarChart3,
  Activity,
  Database,
  FileText,
  Network,
  Settings,
  Cpu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const platformItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inspection", url: "/inspection", icon: ScanSearch },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Model Monitoring", url: "/monitoring", icon: Activity },
];

const dataItems = [
  { title: "Datasets", url: "/datasets", icon: Database },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Architecture", url: "/architecture", icon: Network },
];

const adminItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  const renderGroup = (label: string, items: typeof platformItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="h-9 rounded-md data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground"
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-[13px]">{item.title}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[oklch(0.4_0.2_268)] ring-1 ring-primary/40">
            <Cpu className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold tracking-tight">Carrier AI</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Industrial Intelligence</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin">
        {renderGroup("Platform", platformItems)}
        {renderGroup("Data", dataItems)}
        {renderGroup("Admin", adminItems)}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/60 px-2.5 py-2">
          <div className="h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse-dot" />
          <div className="flex flex-col text-[11px] leading-tight">
            <span className="font-medium text-foreground">All Systems Operational</span>
            <span className="text-muted-foreground">12 models · 4 sites</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

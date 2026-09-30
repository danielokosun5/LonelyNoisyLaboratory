import type { ReactNode } from 'react';
import {
  Activity,
  Bell,
  BookOpen,
  Box,
  Cloud,
  LayoutDashboard,
  Layers3,
  Network,
  Server,
  Settings2,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import type { InfrastructureView } from '@/data/infrastructure-provider';
import { cn } from '@/lib/utils';

const primaryNavigation = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Applications', href: '/applications', icon: Box },
  { label: 'Infrastructure', href: '/infrastructure', icon: Network },
  { label: 'Load Balancer', href: '/load-balancer', icon: Layers3 },
  { label: 'Auto Scaling', href: '/auto-scaling', icon: Server },
  { label: 'Monitoring', href: '/monitoring', icon: Activity },
  { label: 'Events', href: '/events', icon: Bell },
];

const utilityNavigation = [
  { label: 'Documentation', href: '/documentation', icon: BookOpen },
  { label: 'Settings', href: '/settings', icon: Settings2 },
];

const pageTitles: Record<string, string> = {
  '/': 'Overview',
  '/applications': 'Applications',
  '/infrastructure': 'Infrastructure',
  '/load-balancer': 'Load Balancer',
  '/auto-scaling': 'Auto Scaling',
  '/monitoring': 'Monitoring',
  '/events': 'Events',
  '/documentation': 'Documentation',
  '/settings': 'Settings',
};

type DashboardLayoutProps = {
  telemetry: InfrastructureView;
  children: ReactNode;
};

export function DashboardLayout({ telemetry, children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const statusLabel = telemetry.status === 'healthy'
    ? 'Operational'
    : telemetry.status === 'scaling'
      ? 'Scaling'
      : 'Degraded';
  const currentPage = pageTitles[location] ?? 'Overview';

  const navigation = (
    <>
      <nav aria-label="Main navigation" className="space-y-1">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">Workspace</p>
        {primaryNavigation.map(({ label, href, icon: Icon }) => {
          const active = location === href;
          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              )}
            >
              <Icon className={cn('h-[17px] w-[17px] shrink-0', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Events' && telemetry.events.length > 1 && (
                <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">{telemetry.events.length}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-7 space-y-1">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">Resources</p>
        {utilityNavigation.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            aria-current={location === href ? 'page' : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors',
              location === href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
            )}
          >
            <Icon className="h-[17px] w-[17px] shrink-0 text-muted-foreground group-hover:text-foreground" strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="app-shell">
        <aside className="sidebar hidden md:flex md:flex-col">
          <Link href="/" className="flex h-[68px] shrink-0 items-center gap-3 border-b border-border px-5" aria-label="CloudScale overview">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <Cloud className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-tight text-foreground">CloudScale</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Cloud operations</p>
            </div>
          </Link>
          <div className="flex-1 overflow-y-auto px-3 py-5">{navigation}</div>
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-30" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-foreground">Demo environment</p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{telemetry.dataSource === 'api' ? 'API demo simulator active' : 'Local simulator fallback'}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="topbar">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground md:hidden">
                <Cloud className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">{currentPage}</p>
                <p className="mt-0.5 hidden text-[11px] text-muted-foreground sm:block">CloudScale <span className="px-1 text-muted-foreground/50">/</span> {currentPage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground sm:px-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="hidden sm:inline">Environment</span>
                <span className="text-foreground">Demo Mode</span>
              </div>
              <div className="hidden h-7 w-px bg-border sm:block" />
              <Badge variant={telemetry.status === 'healthy' ? 'healthy' : telemetry.status === 'scaling' ? 'warning' : 'destructive'} className="gap-1.5 px-2.5 py-1.5 text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span className="hidden sm:inline">{statusLabel}</span>
              </Badge>
              <Link href="/events" aria-label={`${telemetry.events.length} recent events`} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Bell className="h-[17px] w-[17px]" />
                <span className="absolute right-[8px] top-[7px] h-1.5 w-1.5 rounded-full border border-background bg-primary" />
              </Link>
              <div className="hidden h-7 w-px bg-border sm:block" />
              <div className="flex items-center gap-2 rounded-lg p-1" aria-label="Operations profile">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[11px] font-semibold text-primary">OP</span>
                <span className="hidden text-left lg:block">
                  <span className="block text-xs font-medium leading-4 text-foreground">Operations</span>
                  <span className="block text-[10px] leading-4 text-muted-foreground">Demo workspace</span>
                </span>
              </div>
            </div>
          </header>

          <div className="mobile-navigation md:hidden">
            <div className="mobile-nav-scroll">{navigation}</div>
          </div>

          <main className="dashboard-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

import { Activity, Cloud, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeading } from '@/components/dashboard-widgets';
import type { InfrastructureData } from '@/data/infrastructure';

export function SettingsPage({ telemetry }: { telemetry: InfrastructureData }) {
  const settings = [
    { icon: Cloud, label: 'Environment', value: telemetry.application.environment },
    { icon: Activity, label: 'Telemetry source', value: 'Frontend simulation' },
    { icon: Server, label: 'Active instances', value: `${telemetry.autoScalingGroup.currentCapacity} instances` },
    { icon: Cloud, label: 'Cloud connection', value: 'Not connected' },
  ];

  return (
    <>
      <PageHeading eyebrow="Workspace" title="Settings" description="Current demo environment and data-source configuration." />
      <Card>
        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold">Environment settings</h2>
            <p className="mt-1 text-xs text-muted-foreground">Read-only configuration for this frontend demo.</p>
          </div>
          <Badge variant="outline" className="border-primary/20 bg-primary/[0.05] text-primary">Demo</Badge>
        </div>
        <CardContent className="divide-y divide-border border-t border-border px-5 sm:px-6">
          {settings.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Icon className="h-4 w-4" /></span>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
              </div>
              <span className="text-right text-xs font-medium text-foreground">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <p className="mt-3 text-[11px] text-muted-foreground">Cloud connections and external credentials are not configured by this application.</p>
    </>
  );
}

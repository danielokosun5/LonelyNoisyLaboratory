import { Activity, ArrowDown, ArrowRight, Check, Cpu, Gauge, Layers3, Server } from 'lucide-react';

const scalingStages = [
  { title: 'Traffic rises', detail: 'Request load grows', icon: Activity },
  { title: 'CPU increases', detail: 'Capacity is measured', icon: Cpu },
  { title: 'Threshold hit', detail: 'Above 75% utilization', icon: Gauge },
  { title: 'Capacity added', detail: 'Instances join the group', icon: Server },
  { title: 'Load distributed', detail: 'Healthy targets receive traffic', icon: Layers3 },
  { title: 'System stabilizes', detail: 'Load returns to balance', icon: Check },
];

export function ScalingSteps() {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {scalingStages.map(({ title, detail, icon: Icon }, index) => (
        <li key={title} className="relative rounded-lg border border-border bg-background/50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground"><Icon className="h-3.5 w-3.5" /></span>
            <span className="font-mono text-[10px] text-muted-foreground/70">0{index + 1}</span>
          </div>
          <p className="text-[11px] font-semibold leading-4">{title}</p>
          <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{detail}</p>
          {index < scalingStages.length - 1 && <ArrowRight className="absolute -right-[9px] top-5 z-10 hidden h-4 w-4 text-border xl:block" />}
          {index < scalingStages.length - 1 && <ArrowDown className="absolute -bottom-[9px] left-1/2 z-10 h-4 w-4 translate-x-[-50%] bg-card text-border xl:hidden" />}
        </li>
      ))}
    </ol>
  );
}

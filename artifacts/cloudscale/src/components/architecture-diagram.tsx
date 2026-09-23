import React from 'react';
import { cn } from '@/lib/utils';
import { Activity, Server, Users, Shield, ArrowRight, Cloud, Database } from 'lucide-react';

interface ArchitectureDiagramProps {
  activeInstances: number;
  status: 'healthy' | 'scaling' | 'degraded';
  requestsPerMin: number;
}

export function ArchitectureDiagram({ activeInstances, status, requestsPerMin }: ArchitectureDiagramProps) {
  const isHighTraffic = requestsPerMin > 1000;
  const flowClass = isHighTraffic ? 'animate-flow-fast stroke-primary' : 'animate-flow stroke-muted-foreground';

  // We'll show a max of 6 boxes visually for the diagram to keep it tidy
  const displayInstances = 6;

  return (
    <div className="w-full bg-card rounded-xl border border-card-border p-8 overflow-hidden relative">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Activity className={cn("w-4 h-4", status === 'scaling' ? 'text-warning animate-pulse' : status === 'degraded' ? 'text-destructive' : 'text-success')} />
        <span>US-EAST-1</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto mt-6">
        
        {/* User / Internet Layer */}
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border relative">
            <Users className="w-8 h-8 text-foreground" />
            {isHighTraffic && (
               <span className="absolute -top-2 -right-2 flex h-4 w-4">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
               </span>
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">Internet</p>
            <p className="text-xs text-muted-foreground font-mono">{requestsPerMin} r/m</p>
          </div>
        </div>

        {/* WAF / Gateway */}
        <div className="flex-1 h-32 hidden md:block relative">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M 0 64 L 100% 64" fill="none" strokeWidth="2" strokeDasharray="6 6" className={flowClass} />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-xl bg-card border-2 border-primary/20 flex items-center justify-center shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5"></div>
             <Shield className="w-8 h-8 text-primary relative z-10" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">ALB</p>
            <p className="text-xs text-muted-foreground">Load Balancer</p>
          </div>
        </div>

        <div className="flex-1 h-32 hidden md:block relative">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M 0 64 L 50% 64 L 50% 16 L 100% 16" fill="none" strokeWidth="2" strokeDasharray="6 6" className={flowClass} />
            <path d="M 0 64 L 100% 64" fill="none" strokeWidth="2" strokeDasharray="6 6" className={flowClass} />
            <path d="M 0 64 L 50% 64 L 50% 112 L 100% 112" fill="none" strokeWidth="2" strokeDasharray="6 6" className={flowClass} />
          </svg>
        </div>

        {/* ASG Layer */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={cn(
            "p-6 rounded-2xl border-2 border-dashed bg-secondary/30 transition-colors duration-500",
            status === 'scaling' ? 'border-warning/50 bg-warning/5' : 
            status === 'degraded' ? 'border-destructive/50 bg-destructive/5' : 
            'border-primary/30'
          )}>
            <div className="absolute -top-3 left-6 bg-card px-2 text-xs font-mono font-semibold text-muted-foreground border rounded-full">
              Auto Scaling Group
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: displayInstances }).map((_, i) => {
                const isActive = i < activeInstances;
                const isRecentlyScaled = status === 'scaling' && i === activeInstances - 1;
                
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "w-12 h-12 md:w-16 md:h-16 rounded-lg border flex items-center justify-center transition-all duration-500",
                      isActive ? "bg-card border-primary/40 shadow-sm" : "bg-card/50 border-border/50 opacity-40 grayscale",
                      isRecentlyScaled && "animate-node-pulse border-warning shadow-[0_0_15px_rgba(var(--warning),0.4)]"
                    )}
                  >
                    <Server className={cn(
                      "w-6 h-6",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                );
              })}
            </div>
            {activeInstances > displayInstances && (
              <div className="text-center mt-3 text-xs font-mono text-muted-foreground">
                + {activeInstances - displayInstances} more instances
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

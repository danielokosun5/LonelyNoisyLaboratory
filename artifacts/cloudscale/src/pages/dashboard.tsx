import React from 'react';
import { useSimulation } from '@/hooks/use-simulation';
import { ArchitectureDiagram } from '@/components/architecture-diagram';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Zap, Clock, ArrowRight, ShieldCheck, Cpu, LayoutDashboard, Code, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const { state, simulateTraffic, reset } = useSimulation();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <CloudScaleIcon className="w-5 h-5" />
            </div>
            CloudScale
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#overview" className="hover:text-foreground transition-colors">Overview</a>
            <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
            <a href="#monitoring" className="hover:text-foreground transition-colors">Monitoring</a>
            <a href="#docs" className="hover:text-foreground transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-4">
             <Badge variant={
               state.status === 'healthy' ? 'healthy' : 
               state.status === 'scaling' ? 'warning' : 'destructive'
             } className="font-mono uppercase px-3 py-1 hidden sm:inline-flex">
               {state.status === 'healthy' ? 'System Operational' : 
                state.status === 'scaling' ? 'Scaling in Progress' : 'Degraded Performance'}
             </Badge>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 space-y-24">
        
        {/* Hero Section */}
        <section id="overview" className="text-center max-w-3xl mx-auto pt-10 pb-8">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/5">
            Interactive Cloud Simulation v1.0
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Auto-Scaling <br className="hidden md:block"/> Web Application
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience resilient cloud architecture in real-time. Inject traffic spikes and watch the application load balancer and auto-scaling groups dynamically provision resources to maintain performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={simulateTraffic} className="w-full sm:w-auto gap-2 text-base h-12 px-8">
              <Zap className="w-5 h-5" />
              Simulate Traffic Spike
            </Button>
            <Button size="lg" variant="outline" onClick={reset} className="w-full sm:w-auto gap-2 text-base h-12 px-8">
              Reset Baseline
            </Button>
          </div>
        </section>

        {/* Live Monitoring */}
        <section id="monitoring" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Live Telemetry</h2>
              <p className="text-muted-foreground">Real-time metrics from the application cluster.</p>
            </div>
            <div className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Active Instances" 
              value={state.activeInstances} 
              icon={<Server className="w-5 h-5" />}
              trend={state.status === 'scaling' ? 'Scaling...' : 'Stable'}
              trendColor={state.status === 'scaling' ? 'text-warning' : 'text-success'}
            />
            <MetricCard 
              title="Requests / Min" 
              value={`${state.requestsPerMin.toLocaleString()}`} 
              icon={<Activity className="w-5 h-5" />}
              trend="Current load"
              trendColor="text-muted-foreground"
            />
            <MetricCard 
              title="Average CPU" 
              value={`${state.cpuPercent}%`} 
              icon={<Cpu className="w-5 h-5" />}
              trend={state.cpuPercent > 75 ? 'High load' : 'Optimal'}
              trendColor={state.cpuPercent > 75 ? 'text-warning' : 'text-success'}
              alert={state.cpuPercent > 85}
            />
            <MetricCard 
              title="Response Time" 
              value={`${state.responseTimeMs}ms`} 
              icon={<Clock className="w-5 h-5" />}
              trend={state.responseTimeMs > 200 ? 'Degraded' : 'Fast'}
              trendColor={state.responseTimeMs > 200 ? 'text-destructive' : 'text-success'}
              alert={state.responseTimeMs > 500}
            />
          </div>
        </section>

        {/* Architecture Diagram */}
        <section id="architecture" className="scroll-mt-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">System Architecture</h2>
            <p className="text-muted-foreground">How the requests flow through the infrastructure.</p>
          </div>
          <ArchitectureDiagram 
            activeInstances={state.activeInstances}
            status={state.status}
            requestsPerMin={state.requestsPerMin}
          />
        </section>

        {/* Docs / Explanation */}
        <section id="docs" className="scroll-mt-24 max-w-4xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">How Scaling Works</h2>
            <p className="text-muted-foreground">The mechanics behind the resilience.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-none bg-secondary/40">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-card border flex items-center justify-center mb-4 text-primary">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <CardTitle>Load Balancing</CardTitle>
                <CardDescription className="text-base mt-2">
                  An Application Load Balancer (ALB) serves as the single point of contact for clients. It distributes incoming application traffic across multiple targets, such as EC2 instances, in multiple Availability Zones. This increases the availability of your application.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-none bg-secondary/40">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-card border flex items-center justify-center mb-4 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <CardTitle>Auto Scaling Groups</CardTitle>
                <CardDescription className="text-base mt-2">
                  The ASG ensures you have the correct number of EC2 instances available to handle the load for your application. We use CloudWatch alarms to monitor CPU utilization—triggering a scale-out event when average CPU exceeds 75%, and a scale-in event when it drops below 25%.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-24">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center">
              <CloudScaleIcon className="w-4 h-4" />
            </div>
            CloudScale
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            A frontend-only technical simulation. No real AWS resources were harmed.
          </p>
          <div className="flex gap-4">
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
               <Code className="w-5 h-5" />
             </Button>
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
               <BookOpen className="w-5 h-5" />
             </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents

function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendColor, 
  alert 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  trend: string;
  trendColor: string;
  alert?: boolean;
}) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300", alert && "border-destructive shadow-[0_0_15px_rgba(var(--destructive),0.1)]")}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-muted-foreground">{title}</h3>
          <div className={cn("p-2 rounded-md", alert ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono tracking-tight">{value}</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className={cn("font-medium", trendColor)}>{trend}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CloudScaleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M17.5 19a4.5 4.5 0 0 0 2.9-8A5 5 0 1 0 11 6a4 4 0 0 0-4 7.6A4.5 4.5 0 0 0 8.5 19H17.5Z" />
      <path d="m12 16 3-3" />
      <path d="m9 13 3 3" />
      <path d="M12 16V10" />
    </svg>
  );
}

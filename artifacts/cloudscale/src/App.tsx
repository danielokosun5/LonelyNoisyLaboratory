import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useDashboardTelemetry } from '@/hooks/use-dashboard-telemetry';
import { ApplicationsPage } from '@/pages/applications';
import { AutoScalingPage } from '@/pages/auto-scaling';
import { DocumentationPage } from '@/pages/documentation';
import { EventsPage } from '@/pages/events';
import { InfrastructurePage } from '@/pages/infrastructure';
import { LoadBalancerPage } from '@/pages/load-balancer';
import { MonitoringPage } from '@/pages/monitoring';
import { OverviewPage } from '@/pages/dashboard';
import NotFound from '@/pages/not-found';
import { SettingsPage } from '@/pages/settings';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function RoutedPages() {
  const telemetry = useDashboardTelemetry();

  return (
    <DashboardLayout telemetry={telemetry}>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={() => <OverviewPage telemetry={telemetry} />} />
          <Route path="/applications" component={() => <ApplicationsPage telemetry={telemetry} />} />
          <Route path="/infrastructure" component={() => <InfrastructurePage telemetry={telemetry} />} />
          <Route path="/load-balancer" component={() => <LoadBalancerPage telemetry={telemetry} />} />
          <Route path="/auto-scaling" component={() => <AutoScalingPage telemetry={telemetry} />} />
          <Route path="/monitoring" component={() => <MonitoringPage telemetry={telemetry} />} />
          <Route path="/events" component={() => <EventsPage telemetry={telemetry} />} />
          <Route path="/documentation" component={DocumentationPage} />
          <Route path="/settings" component={() => <SettingsPage telemetry={telemetry} />} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </DashboardLayout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RoutedPages />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-4xl font-bold tracking-tight">404 - Not Found</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => setLocation('/')}>Return to Dashboard</Button>
    </div>
  );
}

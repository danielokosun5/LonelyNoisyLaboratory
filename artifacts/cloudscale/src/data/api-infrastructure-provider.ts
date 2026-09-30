import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { InfrastructureProvider, InfrastructureView } from './infrastructure-provider';
import { infrastructureApi } from './infrastructure-api';
import { simulatorInfrastructureProvider } from './simulator-infrastructure-provider';

function useApiInfrastructureData(): InfrastructureView {
  const simulator = simulatorInfrastructureProvider.useInfrastructureData();
  const [forceFallback, setForceFallback] = useState(false);
  const lastLoggedError = useRef<string | null>(null);
  const query = useQuery({
    queryKey: ['cloudscale', 'infrastructure'],
    queryFn: infrastructureApi.getInfrastructure,
    refetchInterval: 1000,
    retry: false,
  });
  const apiError = forceFallback
    ? 'An API action failed; continuing with the local simulator.'
    : query.error instanceof Error ? query.error.message : null;
  const useFallback = forceFallback || query.isError || !query.data;

  useEffect(() => {
    if (apiError && lastLoggedError.current !== apiError) {
      console.error(`CloudScale API unavailable; using the local simulator fallback. ${apiError}`);
      lastLoggedError.current = apiError;
    }
    if (!apiError) lastLoggedError.current = null;
  }, [apiError]);

  const runAction = async (action: 'spike' | 'baseline') => {
    if (useFallback) {
      if (action === 'spike') simulator.simulateTraffic();
      else simulator.reset();
      return;
    }
    try {
      if (action === 'spike') await infrastructureApi.simulateTraffic();
      else await infrastructureApi.returnToBaseline();
      await query.refetch();
    } catch (error) {
      setForceFallback(true);
      if (action === 'spike') simulator.simulateTraffic();
      else simulator.reset();
      console.error('CloudScale API action failed; switched to the local simulator fallback.', error);
    }
  };

  const snapshot = useFallback ? simulator : query.data!;
  return {
    ...snapshot,
    simulateTraffic: () => { void runAction('spike'); },
    reset: () => { void runAction('baseline'); },
    dataSource: useFallback ? 'simulator-fallback' : 'api',
    apiError,
  };
}

export const apiInfrastructureProvider: InfrastructureProvider = {
  useInfrastructureData: useApiInfrastructureData,
};

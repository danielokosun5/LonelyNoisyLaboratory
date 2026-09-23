import { useState, useEffect, useRef } from 'react';

export type SystemStatus = 'healthy' | 'scaling' | 'degraded';

export type SimulationState = {
  requestsPerMin: number;
  cpuPercent: number;
  activeInstances: number;
  responseTimeMs: number;
  status: SystemStatus;
};

const BASE_REQS = 125;
const MAX_INSTANCES = 12;
const MIN_INSTANCES = 2;
const TICK_RATE_MS = 1000;

export function useSimulation() {
  const [targetReqs, setTargetReqs] = useState(BASE_REQS);

  const [state, setState] = useState<SimulationState>({
    requestsPerMin: BASE_REQS,
    cpuPercent: 12,
    activeInstances: MIN_INSTANCES,
    responseTimeMs: 35,
    status: 'healthy'
  });

  const simulateTraffic = () => {
    // Spike traffic heavily
    setTargetReqs(prev => Math.min(prev + 1200, 8000));
  };

  const reset = () => {
    setTargetReqs(BASE_REQS);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        // Natural fluctuation
        const jitter = (Math.random() - 0.5) * (targetReqs * 0.15);
        // Move towards target
        let currentReqs = prev.requestsPerMin + (targetReqs - prev.requestsPerMin) * 0.3 + jitter;
        currentReqs = Math.max(BASE_REQS * 0.8, currentReqs);

        // Theoretical CPU if instances didn't change (approx 350 reqs = 100% CPU on 1 instance)
        const REQS_PER_INSTANCE_CAPACITY = 350;
        let theoreticalCpu = (currentReqs / prev.activeInstances) / REQS_PER_INSTANCE_CAPACITY * 100;
        
        let newInstances = prev.activeInstances;
        let status: SystemStatus = 'healthy';

        // Scaling logic (simulates ASG alarms)
        if (theoreticalCpu > 75 && prev.activeInstances < MAX_INSTANCES) {
          // Scale up by 1 or 2 depending on load
          const scaleAmount = theoreticalCpu > 120 ? 2 : 1;
          newInstances = Math.min(MAX_INSTANCES, prev.activeInstances + scaleAmount);
          status = 'scaling';
        } else if (theoreticalCpu < 25 && prev.activeInstances > MIN_INSTANCES && targetReqs === BASE_REQS) {
          // Scale down slowly
          newInstances = Math.max(MIN_INSTANCES, prev.activeInstances - 1);
          status = 'scaling';
        }

        // Actual CPU with current instances
        let actualCpu = (currentReqs / newInstances) / REQS_PER_INSTANCE_CAPACITY * 100;
        // Add slight jitter to CPU
        actualCpu = actualCpu + (Math.random() * 4 - 2);
        actualCpu = Math.min(100, actualCpu);
        actualCpu = Math.max(2, actualCpu);

        if (actualCpu > 85) {
          status = 'degraded';
        } else if (status !== 'scaling') {
          status = 'healthy';
        }

        // Response time correlation
        let responseTime = 30 + (Math.random() * 10);
        if (actualCpu > 70) {
          // Exponential decay of performance
          responseTime += Math.pow((actualCpu - 70) * 0.3, 2);
        }
        if (actualCpu >= 98) {
          responseTime += 500 + (Math.random() * 1000);
        }

        // Auto decay target traffic if it was spiked, simulates a burst passing
        if (targetReqs > BASE_REQS) {
            setTargetReqs(t => Math.max(BASE_REQS, t - (t * 0.05)));
        }

        return {
          requestsPerMin: Math.round(currentReqs),
          cpuPercent: Math.round(actualCpu),
          activeInstances: newInstances,
          responseTimeMs: Math.round(responseTime),
          status
        };
      });
    }, TICK_RATE_MS);

    return () => clearInterval(interval);
  }, [targetReqs]);

  return { state, simulateTraffic, reset };
}

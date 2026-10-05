import {
  InfrastructureDataSchema,
  InfrastructureEventsSchema,
  TelemetryDataSchema,
} from '@workspace/api-zod';

const apiBase = '/api/infrastructure';

async function requestJson(url: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? `CloudScale API returned HTTP ${response.status}`);
  }
  return response.json();
}

export const infrastructureApi = {
  getInfrastructure: async () => InfrastructureDataSchema.parse(await requestJson(apiBase)),
  getTelemetry: async () => TelemetryDataSchema.parse(await requestJson('/api/telemetry')),
  getEvents: async () => InfrastructureEventsSchema.parse(await requestJson('/api/events')),
  simulateTraffic: () => requestJson(`${apiBase}/actions/traffic-spike`, { method: 'POST' }),
  returnToBaseline: () => requestJson(`${apiBase}/actions/baseline`, { method: 'POST' }),
};

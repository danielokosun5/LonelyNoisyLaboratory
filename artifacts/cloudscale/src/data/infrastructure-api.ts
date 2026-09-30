import type { InfrastructureData } from './infrastructure';

const apiBase = '/api/infrastructure';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error ?? `CloudScale API returned HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const infrastructureApi = {
  getInfrastructure: () => requestJson<InfrastructureData>(apiBase),
  simulateTraffic: () => requestJson<{ accepted: boolean }>(`${apiBase}/actions/traffic-spike`, { method: 'POST' }),
  returnToBaseline: () => requestJson<{ accepted: boolean }>(`${apiBase}/actions/baseline`, { method: 'POST' }),
};

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TelemetryPoint } from '@/data/infrastructure';

type TrafficChartProps = {
  points: TelemetryPoint[];
};

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    minute: '2-digit',
    second: '2-digit',
  });
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  const requests = payload.find((item) => item.dataKey === 'requestsPerMin')?.value;
  const cpu = payload.find((item) => item.dataKey === 'cpuPercent')?.value;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5 shadow-xl">
      <p className="mb-2 text-xs text-muted-foreground">
        {typeof label === 'number' ? formatTime(label) : 'Latest sample'}
      </p>
      <div className="space-y-1.5 text-xs">
        {typeof requests === 'number' && (
          <p className="flex items-center justify-between gap-5 text-foreground">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" />Requests/min</span>
            <span className="font-mono tabular-nums">{requests.toLocaleString()}</span>
          </p>
        )}
        {typeof cpu === 'number' && (
          <p className="flex items-center justify-between gap-5 text-foreground">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-chart-2" />CPU</span>
            <span className="font-mono tabular-nums">{cpu}%</span>
          </p>
        )}
      </div>
    </div>
  );
}

export function TrafficChart({ points }: TrafficChartProps) {
  return (
    <div className="h-[260px] w-full" role="img" aria-label="Live chart of requests per minute and CPU utilization">
      {points.length < 2 ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Collecting live samples…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 8, right: 0, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              tickLine={false}
              axisLine={false}
              minTickGap={36}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <YAxis
              yAxisId="requests"
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(value: number) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`}
            />
            <YAxis
              yAxisId="cpu"
              orientation="right"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              width={34}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '4 4' }} />
            <Area
              yAxisId="requests"
              type="monotone"
              dataKey="requestsPerMin"
              name="Requests/min"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="hsl(var(--primary) / 0.12)"
              activeDot={{ r: 4, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
              isAnimationActive={false}
            />
            <Line
              yAxisId="cpu"
              type="monotone"
              dataKey="cpuPercent"
              name="CPU"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: 'hsl(var(--chart-2))' }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDeviceHistory } from '@/app/hooks/useDevices';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Loader2 } from 'lucide-react';

interface TelemetryChartsProps {
  deviceId?: string;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ deviceId }) => {
  const { history, isLoading } = useDeviceHistory(deviceId || null);

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 h-[400px] flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  // Transform data
  const data = history?.map((h: any) => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: h.temp_supply_1,
    humidity: h.relative_humidity,
    ethylene: h.ethylene || 0,
    co2: h.co2_reading || 0,
  })) || [];

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Telemetría en Tiempo Real</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#ef4444" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: '#ef4444' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'PPM / %', angle: 90, position: 'insideRight', fill: '#10b981' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line yAxisId="left" type="monotone" dataKey="temp" name="Temperatura" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humedad (%)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="ethylene" name="Etileno (PPM)" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="co2" name="CO2 (%)" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

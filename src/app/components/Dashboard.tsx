import React from 'react';
import { Device } from '@/app/data';
import { useDevices } from '@/app/hooks/useDevices';
import { DeviceCard } from './DeviceCard';
import { Card, CardContent } from './ui/Card';
import { Activity, AlertTriangle, CheckCircle, Zap, Loader2 } from 'lucide-react';

interface DashboardProps {
  onSelectDevice: (deviceId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectDevice }) => {
  const { devices, isLoading, isError, mutate } = useDevices();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Error al cargar dispositivos.</div>;
  }

  const activeCount = devices.filter(d => d.status === 'active' || d.status === 'warning').length;
  const alarmCount = devices.filter(d => d.status === 'alarm').length;
  const totalKwh = devices.reduce((acc, d) => acc + d.operational.power_kwh, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Unidades Activas" 
          value={activeCount.toString()} 
          icon={CheckCircle} 
          color="text-green-500" 
          subtext={`De ${devices.length} total`}
        />
        <SummaryCard 
          title="Alarmas Activas" 
          value={alarmCount.toString()} 
          icon={AlertTriangle} 
          color="text-red-500" 
          subtext="Requieren atención"
        />
        <SummaryCard 
          title="Procesos Completados" 
          value="12" 
          icon={Activity} 
          color="text-blue-500" 
          subtext="Esta semana"
        />
        <SummaryCard 
          title="Consumo Total" 
          value={`${Math.round(totalKwh).toLocaleString()} kWh`} 
          icon={Zap} 
          color="text-orange-500" 
          subtext="Acumulado histórico"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Estado de Flota</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {devices.map(device => (
            <DeviceCard 
              key={device.id} 
              device={device} 
              onClick={onSelectDevice} 
              onRefresh={mutate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        </div>
        <div className={`p-3 rounded-full bg-gray-50 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

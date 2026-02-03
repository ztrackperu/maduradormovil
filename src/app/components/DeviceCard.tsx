import React, { useState } from 'react';
import { Device } from '@/app/data';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Thermometer, Droplets, Wind, Zap, Activity, Clock, Edit2, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from './ui/Button';
import { updateDeviceName } from '@/app/lib/api';
import { toast } from 'sonner';

interface DeviceCardProps {
  device: Device;
  onClick: (deviceId: string) => void;
  onRefresh?: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(device.name);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveName = async (e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (!newName.trim() || newName === device.name) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateDeviceName(device.id, newName);
      toast.success('Nombre actualizado');
      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Error al actualizar nombre');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewName(device.name);
    setIsEditing(false);
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'active': return 'border-l-4 border-l-green-500';
      case 'warning': return 'border-l-4 border-l-yellow-500';
      case 'alarm': return 'border-l-4 border-l-red-500';
      case 'offline': return 'border-l-4 border-l-gray-400 bg-gray-50';
      default: return 'border-l-4 border-l-gray-200';
    }
  };

  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case 'active': return <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">OPERATIVO</span>;
      case 'warning': return <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">ADVERTENCIA</span>;
      case 'alarm': return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">ALARMA</span>;
      case 'offline': return <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">OFFLINE</span>;
    }
  };

  const isOffline = device.status === 'offline';

  return (
    <Card 
      className={cn("cursor-pointer hover:shadow-md transition-shadow", getStatusColor(device.status))}
      onClick={() => onClick(device.id)}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
        <div className="flex-1 mr-2" onClick={(e) => isEditing && e.stopPropagation()}>
          {isEditing ? (
            <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-sm font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent px-1 py-0.5"
                placeholder="Nombre del dispositivo"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName(e);
                  if (e.key === 'Escape') handleCancel(e as any);
                }}
              />
              <button onClick={handleSaveName} disabled={isSaving} className="p-1 hover:bg-green-100 rounded text-green-600">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button onClick={handleCancel} disabled={isSaving} className="p-1 hover:bg-red-100 rounded text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="group flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-gray-800 truncate">{device.name}</CardTitle>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setNewName(device.name);
                  setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"
                title="Renombrar dispositivo"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="text-xs text-gray-500 font-mono mt-1">{device.id}</div>
        </div>
        {getStatusBadge(device.status)}
      </CardHeader>
      
      <CardContent>
        {isOffline ? (
           <div className="h-32 flex items-center justify-center text-gray-400 flex-col gap-2">
             <Zap className="h-8 w-8 opacity-20" />
             <span className="text-sm">Dispositivo Desconectado</span>
             <span className="text-xs">Última conexión: hace 4h</span>
           </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <div>
                  <div className="text-xs text-gray-500">Temperatura</div>
                  <div className="font-bold text-gray-900">
                    {device.telemetry.temp_supply_1.toFixed(1)}°C
                    <span className="text-gray-400 font-normal ml-1">/ {device.telemetry.set_point}°C</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500">Humedad</div>
                  <div className="font-bold text-gray-900">{device.telemetry.relative_humidity}%</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-xs text-gray-500">Etileno</div>
                  <div className="font-bold text-gray-900">{device.telemetry.ethylene ?? '-'} PPM</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">CO2</div>
                  <div className="font-bold text-gray-900">{device.telemetry.co2_reading ?? '-'} %</div>
                </div>
              </div>
            </div>

            {device.process && (
              <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-blue-600">{device.process.currentPhase}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {device.process.timeLeft}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: `${device.process.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 p-0 h-auto hover:bg-transparent">
            Ver detalles →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

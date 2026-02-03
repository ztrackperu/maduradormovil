import React, { useState, useEffect } from 'react';
import { Button, buttonVariants } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Switch } from '@/app/components/ui/switch';
import { Slider } from '@/app/components/ui/slider';
import { Label } from '@/app/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { cn } from '@/app/lib/utils';
import { Thermometer, Wind, Droplets, Zap, Play, Snowflake, Fan } from 'lucide-react';
import { toast } from 'sonner';
import { sendControlCommand } from '@/app/lib/api';
import { Device } from '@/app/data';

interface ControlPanelProps {
  mode: string;
  onChangeMode: (mode: string) => void;
  deviceId?: string;
  device?: Device;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ mode, onChangeMode, deviceId, device }) => {
  const modes = [
    { id: 'manual', label: 'Manual', icon: Zap },
    { id: 'homogenization', label: 'Homogen.', icon: Thermometer },
    { id: 'ripening', label: 'Maduración', icon: Play },
    { id: 'ventilation', label: 'Ventilación', icon: Fan },
    { id: 'cooling', label: 'Cooling', icon: Snowflake },
  ];

  return (
    <Card className="h-full">
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto no-scrollbar">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onChangeMode(m.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                mode === m.id
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <m.icon className="h-4 w-4" />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <CardContent className="p-6">
        {mode === 'manual' && <ManualControl deviceId={deviceId} device={device} />}
        {mode === 'homogenization' && <HomogenizationControl deviceId={deviceId} />}
        {mode === 'ripening' && <RipeningControl deviceId={deviceId} />}
        {mode === 'ventilation' && <VentilationControl deviceId={deviceId} />}
        {mode === 'cooling' && <CoolingControl deviceId={deviceId} />}
      </CardContent>
    </Card>
  );
};

const ControlGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-6 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
    <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">{title}</h4>
    {children}
  </div>
);

const RangeControl = ({ label, value, unit, min, max, onChange, step = 1, originalValue }: any) => {
  const isChanged = originalValue !== undefined && value !== originalValue;

  return (
    <div className={cn("mb-4 p-3 rounded-lg transition-colors border", isChanged ? "bg-blue-50 border-blue-200" : "border-transparent")}>
      <div className="flex justify-between mb-2">
        <Label className={cn("text-sm font-medium", isChanged ? "text-blue-700" : "text-gray-600")}>{label}</Label>
        <div className="flex flex-col items-end">
          <span className={cn("text-sm font-bold", isChanged ? "text-blue-700" : "text-gray-900")}>{value} {unit}</span>
          {isChanged && (
            <span className="text-xs text-blue-400 line-through decoration-blue-400/50">
              {originalValue} {unit}
            </span>
          )}
        </div>
      </div>
      <div className="relative flex items-center w-full h-5">
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step}
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors",
            isChanged ? "bg-blue-200 accent-blue-600" : "bg-gray-200 accent-gray-500"
          )}
        />
      </div>
    </div>
  );
};

const ManualControl = ({ deviceId, device }: { deviceId?: string, device?: Device }) => {
  const [temp, setTemp] = useState(device?.telemetry.set_point ?? 19);
  const [humidity, setHumidity] = useState(device?.telemetry.relative_humidity ?? 90);
  const [ethylene, setEthylene] = useState(device?.telemetry.ethylene ?? 0);
  const [fan, setFan] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (device) {
      setTemp(device.telemetry.set_point);
      // setHumidity(device.telemetry.humidity_set_point ?? 90); // If exists in telemetry
    }
  }, [device]);

  const originalTemp = device?.telemetry.set_point ?? 19;
  const originalHumidity = device?.telemetry.relative_humidity ?? 90;
  const originalEthylene = device?.telemetry.ethylene ?? 0;
  const originalFan = 100;

  const changes = [];
  if (temp !== originalTemp) changes.push({ name: 'Temperatura', from: `${originalTemp}°C`, to: `${temp}°C` });
  if (humidity !== originalHumidity) changes.push({ name: 'Humedad', from: `${originalHumidity}%`, to: `${humidity}%` });
  if (ethylene !== originalEthylene) changes.push({ name: 'Etileno', from: `${originalEthylene} PPM`, to: `${ethylene} PPM` });
  if (fan !== originalFan) changes.push({ name: 'Ventilación', from: `${originalFan}%`, to: `${fan}%` });

  const hasChanges = changes.length > 0;

  const handleApply = async () => {
    if (!deviceId) return;
    setIsSubmitting(true);
    try {
      await sendControlCommand(deviceId, 'manual_update', {
        set_point: temp,
        humidity_set_point: humidity,
        ethylene,
        fan_speed: fan
      });
      toast.success("Configuración manual aplicada exitosamente");
      setIsConfirmOpen(false);
    } catch (e) {
      toast.error("Error al aplicar configuración");
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium text-gray-900">Estado del Equipo</div>
            <div className="text-xs text-green-600 font-bold">ENCENDIDO • ONLINE</div>
          </div>
        </div>
        <Switch className="data-[state=checked]:bg-green-500 bg-gray-200 w-11 h-6 rounded-full transition-colors" checked />
      </div>

      <ControlGroup title="Climatización">
        <RangeControl 
          label="Temperatura Objetivo" 
          value={temp} 
          unit="°C" 
          min={-30} 
          max={30} 
          onChange={setTemp} 
          originalValue={originalTemp}
        />
        <RangeControl 
          label="Humedad Relativa" 
          value={humidity} 
          unit="%" 
          min={0} 
          max={100} 
          onChange={setHumidity} 
          originalValue={originalHumidity}
        />
      </ControlGroup>

      <ControlGroup title="Gases y Ventilación">
        <RangeControl 
          label="Inyección Etileno" 
          value={ethylene} 
          unit="PPM" 
          min={0} 
          max={200} 
          onChange={setEthylene} 
          originalValue={originalEthylene}
        />
        <RangeControl 
          label="Ventilación" 
          value={fan} 
          unit="%" 
          min={0} 
          max={100} 
          onChange={setFan} 
          originalValue={originalFan}
        />
      </ControlGroup>

      <div className="flex gap-3 mt-6">
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogTrigger
            className={cn(buttonVariants(), "flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50")}
            disabled={isSubmitting || !hasChanges}
          >
            {isSubmitting ? "Aplicando..." : "Aplicar Cambios"}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Cambios</AlertDialogTitle>
              <AlertDialogDescription>
                Se aplicarán los siguientes cambios en el dispositivo:
              </AlertDialogDescription>
              <div className="mt-4 space-y-2">
                {changes.map((change, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="font-medium text-gray-700">{change.name}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 line-through">{change.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-bold text-blue-600">{change.to}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={() => {
            setTemp(originalTemp);
            setHumidity(originalHumidity);
            setEthylene(originalEthylene);
            setFan(originalFan);
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

const HomogenizationControl = ({ deviceId }: { deviceId?: string }) => {
  const [temp, setTemp] = useState(18);
  const [duration, setDuration] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async () => {
    if (!deviceId) return;
    setIsSubmitting(true);
    try {
      await sendControlCommand(deviceId, 'set_process', {
        type: 'Homogenization',
        name: 'Homogenización Manual',
        setPoint: temp,
        durationHours: duration
      });
      toast.success("Homogenización iniciada");
    } catch (e) {
      toast.error("Error al iniciar proceso");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 flex gap-2">
        <Thermometer className="h-5 w-5 shrink-0" />
        <p>La homogenización eleva gradualmente la temperatura del producto para prepararlo para la maduración. Típico: 8°C a 18°C.</p>
      </div>
      
      <ControlGroup title="Configuración">
        <RangeControl label="Temperatura Final" value={temp} unit="°C" min={10} max={25} onChange={setTemp} />
        <RangeControl label="Duración Estimada" value={duration} unit="Horas" min={1} max={24} onChange={setDuration} />
      </ControlGroup>

      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
        <p className="text-sm text-gray-500 mb-1">Previsualización</p>
        <p className="font-medium text-gray-900">De ~8°C a {temp}°C en {duration} horas</p>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleStart} disabled={isSubmitting}>
        {isSubmitting ? "Iniciando..." : "Iniciar Homogenización"}
      </Button>
    </div>
  );
};

const RipeningControl = ({ deviceId }: { deviceId?: string }) => {
  const [temp, setTemp] = useState(20);
  const [humidity, setHumidity] = useState(95);
  const [ethylene, setEthylene] = useState(100);
  const [co2, setCo2] = useState(3.5);
  const [duration, setDuration] = useState(72);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async () => {
    if (!deviceId) return;
    setIsSubmitting(true);
    try {
      await sendControlCommand(deviceId, 'set_process', {
        type: 'Ripening',
        name: 'Maduración Manual',
        setPoint: temp,
        durationHours: duration,
        ethylene,
        co2
      });
      toast.success("Proceso de Maduración Iniciado");
    } catch (e) {
      toast.error("Error al iniciar proceso");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ControlGroup title="Condiciones Ambientales">
        <RangeControl label="Temperatura" value={temp} unit="°C" min={15} max={25} onChange={setTemp} />
        <RangeControl label="Humedad" value={humidity} unit="%" min={80} max={100} onChange={setHumidity} />
      </ControlGroup>

      <ControlGroup title="Gases">
        <RangeControl label="Etileno Objetivo" value={ethylene} unit="PPM" min={10} max={150} onChange={setEthylene} />
        <RangeControl label="Límite CO2" value={co2} unit="%" min={1} max={10} step={0.1} onChange={setCo2} />
      </ControlGroup>

      <ControlGroup title="Duración">
        <RangeControl label="Tiempo de Proceso" value={duration} unit="Horas" min={24} max={120} onChange={setDuration} />
      </ControlGroup>

      <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleStart} disabled={isSubmitting}>
        {isSubmitting ? "Iniciando..." : "Iniciar Maduración"}
      </Button>
    </div>
  );
};

const VentilationControl = ({ deviceId }: { deviceId?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleStart = async () => {
    if (!deviceId) return;
    setIsSubmitting(true);
    try {
       await sendControlCommand(deviceId, 'set_process', {
         type: 'Ventilation',
         name: 'Ventilación Manual',
         durationHours: 1
       });
       toast.success("Ventilación iniciada");
    } catch (e) { toast.error("Error"); }
    finally { setIsSubmitting(false); }
  };
  return (
  <div className="space-y-6">
    <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 flex gap-2">
      <Fan className="h-5 w-5 shrink-0" />
      <p>Evacuación rápida de gases (Etileno/CO2) post-maduración.</p>
    </div>
    <ControlGroup title="Parámetros">
       <RangeControl label="CO2 Objetivo" value={0.5} unit="%" min={0} max={5} onChange={() => {}} />
       <RangeControl label="Duración Máxima" value={60} unit="min" min={10} max={180} onChange={() => {}} />
    </ControlGroup>
    <Button className="w-full" onClick={handleStart} disabled={isSubmitting}>Activar Ventilación</Button>
  </div>
)};

const CoolingControl = ({ deviceId }: { deviceId?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleStart = async () => {
    if (!deviceId) return;
    setIsSubmitting(true);
    try {
       await sendControlCommand(deviceId, 'set_process', {
         type: 'Cooling',
         name: 'Cooling Manual',
         durationHours: 8,
         setPoint: 10
       });
       toast.success("Cooling iniciado");
    } catch (e) { toast.error("Error"); }
    finally { setIsSubmitting(false); }
  };

  return (
  <div className="space-y-6">
    <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 flex gap-2">
      <Snowflake className="h-5 w-5 shrink-0" />
      <p>Reducción de temperatura para conservación y transporte.</p>
    </div>
    <ControlGroup title="Configuración">
      <RangeControl label="Temperatura Final" value={10} unit="°C" min={5} max={15} onChange={() => {}} />
      <RangeControl label="Rampa de Enfriamiento" value={8} unit="Horas" min={2} max={24} onChange={() => {}} />
    </ControlGroup>
    <Button className="w-full bg-blue-600" onClick={handleStart} disabled={isSubmitting}>Iniciar Enfriado</Button>
  </div>
)};

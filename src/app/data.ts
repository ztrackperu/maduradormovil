export interface TelemetryData {
  temp_supply_1: number;
  return_air: number;
  relative_humidity: number;
  ethylene: number | null;
  co2_reading: number | null;
  set_point: number;
  stateProcess: 'None' | 'Homogenization' | 'Ripening' | 'Ventilation' | 'Cooling' | 'Integral';
  power_state: 0 | 1; // 0=Off, 1=On
  alarm_present: 0 | 1;
}

export interface OperationalData {
  evaporation_coil: number;
  condensation_coil: number;
  ambient_air: number;
  power_consumption: number;
  power_kwh: number;
  battery_voltage: number;
  defrost_interval: number;
  fresh_air_ex_mode: number;
}

export interface Device {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'alarm' | 'offline';
  telemetry: TelemetryData;
  operational: OperationalData;
  process?: {
    name: string;
    progress: number; // 0-100
    startTime: string;
    endTime: string;
    currentPhase?: string;
    timeLeft?: string;
  };
}

export const MOCK_DEVICES: Device[] = [
  {
    id: 'ZGRU5140008',
    name: 'Madurador 01',
    status: 'active',
    telemetry: {
      temp_supply_1: 19,
      return_air: 19.5,
      relative_humidity: 97,
      ethylene: 120,
      co2_reading: 3.5,
      set_point: 19,
      stateProcess: 'Ripening',
      power_state: 1,
      alarm_present: 0
    },
    operational: {
      evaporation_coil: 19.3,
      condensation_coil: 20.5,
      ambient_air: 20,
      power_consumption: 0.01,
      power_kwh: 8062.4,
      battery_voltage: 41.8,
      defrost_interval: 6,
      fresh_air_ex_mode: 0
    },
    process: {
      name: 'Mango Kent - Maduración Estándar',
      progress: 45,
      startTime: '2026-02-01T08:00:00',
      endTime: '2026-02-04T20:00:00',
      currentPhase: 'Maduración',
      timeLeft: '12h 30min'
    }
  },
  {
    id: 'ZGRU5140009',
    name: 'Madurador 02',
    status: 'warning',
    telemetry: {
      temp_supply_1: 14,
      return_air: 14.8,
      relative_humidity: 82, // Low humidity warning
      ethylene: 10,
      co2_reading: 0.5,
      set_point: 14,
      stateProcess: 'Homogenization',
      power_state: 1,
      alarm_present: 0
    },
    operational: {
      evaporation_coil: 14.1,
      condensation_coil: 15.2,
      ambient_air: 16,
      power_consumption: 0.02,
      power_kwh: 4030.1,
      battery_voltage: 41.5,
      defrost_interval: 6,
      fresh_air_ex_mode: 0
    },
    process: {
      name: 'Palta Hass - Pre-maduración',
      progress: 10,
      startTime: '2026-02-02T06:00:00',
      endTime: '2026-02-02T14:00:00',
      currentPhase: 'Homogenización',
      timeLeft: '6h 15min'
    }
  },
  {
    id: 'ZGRU5140010',
    name: 'Madurador 03',
    status: 'offline',
    telemetry: {
      temp_supply_1: 0,
      return_air: 0,
      relative_humidity: 0,
      ethylene: null,
      co2_reading: null,
      set_point: 0,
      stateProcess: 'None',
      power_state: 0,
      alarm_present: 0
    },
    operational: {
      evaporation_coil: 0,
      condensation_coil: 0,
      ambient_air: 24,
      power_consumption: 0,
      power_kwh: 12050.5,
      battery_voltage: 0,
      defrost_interval: 6,
      fresh_air_ex_mode: 0
    }
  },
  {
    id: 'ZGRU5140011',
    name: 'Madurador 04',
    status: 'alarm',
    telemetry: {
      temp_supply_1: 22,
      return_air: 23,
      relative_humidity: 99,
      ethylene: 200,
      co2_reading: 6.0, // High CO2 alarm
      set_point: 18,
      stateProcess: 'Ripening',
      power_state: 1,
      alarm_present: 1
    },
    operational: {
      evaporation_coil: 21.5,
      condensation_coil: 25.0,
      ambient_air: 22,
      power_consumption: 0.05,
      power_kwh: 500.2,
      battery_voltage: 41.2,
      defrost_interval: 4,
      fresh_air_ex_mode: 1
    },
    process: {
      name: 'Banana - Ciclo Rápido',
      progress: 80,
      startTime: '2026-01-31T10:00:00',
      endTime: '2026-02-02T18:00:00',
      currentPhase: 'Maduración',
      timeLeft: '4h 00min'
    }
  }
];

export const RECIPES = [
  { id: 1, name: 'Mango Kent - Maduración Estándar', fruit: 'Mango', duration: '84h', uses: 23, color: 'bg-yellow-500' },
  { id: 2, name: 'Palta Hass - Suave', fruit: 'Palta', duration: '48h', uses: 12, color: 'bg-green-700' },
  { id: 3, name: 'Banana Cavendish - 4 Días', fruit: 'Banana', duration: '96h', uses: 156, color: 'bg-yellow-300' },
  { id: 4, name: 'Papaya - Exportación', fruit: 'Papaya', duration: '72h', uses: 5, color: 'bg-orange-400' },
];

export const CHART_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  temp: 18 + Math.random() * 2 - 1,
  humidity: 90 + Math.random() * 5 - 2.5,
  ethylene: i > 10 ? 100 + Math.random() * 20 : 10,
  co2: i > 15 ? 2 + Math.random() : 0.5,
}));

import { PresetEvaluation } from './types';

export const VOLTAGE_OPTIONS = [
  { value: '13.2', label: '13.2 kV o menor (Media Tensión Estándar)', recommendedTestHV: 2500, recommendedTestLV: 1000 },
  { value: '34.5', label: '34.5 kV (Media Tensión Alta)', recommendedTestHV: 5000, recommendedTestLV: 1000 },
  { value: '4.16', label: '4.16 kV (Distribución Industrial)', recommendedTestHV: 2500, recommendedTestLV: 1000 },
  { value: '23.0', label: '23.0 kV (Media Tensión)', recommendedTestHV: 5000, recommendedTestLV: 1000 },
];

export const COMMON_CAPACITIES = [
  15, 30, 45, 75, 112.5, 150, 225, 300, 500, 750, 1000, 1500, 2000, 2500
];

export const COMMON_SECONDARY_VOLTAGES = [
  '220/127 V',
  '440/254 V',
  '480/277 V',
  '240/120 V',
  '208/120 V',
  '380/220 V',
];

// Temperature correction table for transformer insulation resistance to 20°C (IEEE C57.12.90 / NETA MTS)
export const IEEE_TEMP_CORRECTION_TABLE: Record<number, number> = {
  0: 0.25,
  5: 0.36,
  10: 0.50,
  15: 0.71,
  20: 1.00,
  25: 1.41,
  30: 2.00,
  35: 2.82,
  40: 4.00,
  45: 5.65,
  50: 8.00,
  55: 11.31,
  60: 16.00,
  65: 22.62,
  70: 32.00,
};

export function getTemperatureCorrectionFactor(tempC: number): number {
  if (tempC === 20 || isNaN(tempC)) return 1.0;
  // IEEE standard formula: K_T = 2^((T - 20) / 10)
  const factor = Math.pow(2, (tempC - 20) / 10);
  return Number(factor.toFixed(3));
}

export const PRESETS: PresetEvaluation[] = [
  {
    id: 'preset-112-approved',
    title: 'Transformador 112.5 kVA (13.2 kV) - Óptimo',
    subtitle: 'Valores dieléctricos altos, aislamiento seco y limpio.',
    expectedStatus: 'APROBADO',
    data: {
      transformer: {
        tagNumber: 'TR-101-PLANT',
        capacityKva: 112.5,
        primaryVoltage: '13.2',
        secondaryVoltage: '220/127 V',
        insulationType: 'oil',
        temperatureC: 20,
        substation: 'Subestación Principal Nte.',
        technician: 'Ing. M. Rodríguez',
        notes: 'Mantenimiento preventivo anual en frío.',
      },
      measurements: {
        atbt: 1850,
        atmasa: 1420,
        btmasa: 680,
        unit: 'MOhm',
        testVoltageHV: 2500,
        testVoltageLV: 1000,
        testDurationSeconds: 60,
      }
    }
  },
  {
    id: 'preset-34-approved',
    title: 'Transformador 500 kVA (34.5 kV) - Aprobado',
    subtitle: 'Cumple holgadamente normas NETA/IEEE para 34.5 kV.',
    expectedStatus: 'APROBADO',
    data: {
      transformer: {
        tagNumber: 'TR-345-02',
        capacityKva: 500,
        primaryVoltage: '34.5',
        secondaryVoltage: '480/277 V',
        insulationType: 'oil',
        temperatureC: 22,
        substation: 'Subestación Parque Industrial',
        technician: 'Tec. E. Gómez',
        notes: 'Prueba de recepción en sitio previo a energización.',
      },
      measurements: {
        atbt: 2400,
        atmasa: 1950,
        btmasa: 850,
        unit: 'MOhm',
        testVoltageHV: 5000,
        testVoltageLV: 1000,
        testDurationSeconds: 60,
      }
    }
  },
  {
    id: 'preset-alert-moisture',
    title: 'Transformador 150 kVA (13.2 kV) - En Alerta',
    subtitle: 'Humedad incipiente en devanado BT y aceite.',
    expectedStatus: 'ALERTA',
    data: {
      transformer: {
        tagNumber: 'TR-04-BODEGA',
        capacityKva: 150,
        primaryVoltage: '13.2',
        secondaryVoltage: '220/127 V',
        insulationType: 'oil',
        temperatureC: 25,
        substation: 'Subestación Nave 3',
        technician: 'Ing. R. Morales',
        notes: 'Presencia de condensación en envolvente tras lluvias.',
      },
      measurements: {
        atbt: 320, // Alerta (entre 200 y 500)
        atmasa: 280, // Alerta (entre 200 y 500)
        btmasa: 140, // Alerta (entre 100 y 200)
        unit: 'MOhm',
        testVoltageHV: 2500,
        testVoltageLV: 1000,
        testDurationSeconds: 60,
      }
    }
  },
  {
    id: 'preset-rejected-fault',
    title: 'Transformador 300 kVA (13.2 kV) - Rechazado',
    subtitle: 'Falla dieléctrica crítica en aislamiento AT a Masa.',
    expectedStatus: 'RECHAZADO',
    data: {
      transformer: {
        tagNumber: 'TR-FAIL-09',
        capacityKva: 300,
        primaryVoltage: '13.2',
        secondaryVoltage: '440/254 V',
        insulationType: 'oil',
        temperatureC: 20,
        substation: 'Subestación Metalúrgica',
        technician: 'Ing. C. Vega',
        notes: 'Disparo por relé 50/51. Inspección tras evento de sobretensión.',
      },
      measurements: {
        atbt: 450, // Alerta
        atmasa: 45, // RECHAZADO (< 200 MΩ)
        btmasa: 210, // Aprobado
        unit: 'MOhm',
        testVoltageHV: 2500,
        testVoltageLV: 1000,
        testDurationSeconds: 60,
      }
    }
  }
];

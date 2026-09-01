export type EvaluationStatus = 'APROBADO' | 'ALERTA' | 'RECHAZADO';

export type PrimaryVoltageClass = '13.2' | '34.5' | '4.16' | '23' | 'other';

export type InsulationType = 'oil' | 'dry';

export interface TransformerData {
  tagNumber: string;
  capacityKva: number | '';
  primaryVoltage: string;
  customPrimaryVoltage?: number | '';
  secondaryVoltage: string;
  insulationType: InsulationType;
  temperatureC: number | '';
  substation: string;
  technician: string;
  testDate: string;
  notes: string;
}

export interface MeggerMeasurements {
  atbt: number | '';
  atmasa: number | '';
  btmasa: number | '';
  unit: 'MOhm' | 'GOhm';
  testVoltageHV: number; // e.g. 2500 V
  testVoltageLV: number; // e.g. 1000 V
  testDurationSeconds: number; // 60s
  polarizationIndex?: number | ''; // 10min / 1min (optional)
  absorptionRatio?: number | ''; // 60s / 30s (optional)
}

export interface MeasurementBreakdown {
  key: 'atbt' | 'atmasa' | 'btmasa';
  label: string;
  shortName: string;
  connectionDescription: string;
  measuredValueMOhm: number;
  correctedValueMOhm: number;
  status: EvaluationStatus;
  thresholdAprobado: number;
  thresholdAlerta: number;
  details: string;
  riskFactor: string;
  recommendedAction: string;
}

export interface EvaluationResult {
  id: string;
  timestamp: string;
  transformer: TransformerData;
  measurements: MeggerMeasurements;
  globalStatus: EvaluationStatus;
  globalScorePercentage: number;
  breakdown: MeasurementBreakdown[];
  tempCorrectionFactor: number;
  overallConclusion: string;
  recommendations: string[];
  standardsReferenced: string[];
}

export interface PresetEvaluation {
  id: string;
  title: string;
  subtitle: string;
  expectedStatus: EvaluationStatus;
  data: {
    transformer: Partial<TransformerData>;
    measurements: Partial<MeggerMeasurements>;
  };
}

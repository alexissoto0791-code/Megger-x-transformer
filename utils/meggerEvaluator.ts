import {
  EvaluationResult,
  EvaluationStatus,
  MeggerMeasurements,
  MeasurementBreakdown,
  TransformerData,
} from '../types';
import { getTemperatureCorrectionFactor } from '../constants';

export function evaluateThreshold(
  value: number,
  limiteAprobado: number,
  limiteAlerta: number
): EvaluationStatus {
  if (value >= limiteAprobado) return 'APROBADO';
  if (value >= limiteAlerta) return 'ALERTA';
  return 'RECHAZADO';
}

export function evaluateTransformer(
  transformer: TransformerData,
  measurements: MeggerMeasurements
): EvaluationResult {
  const is34_5kV = transformer.primaryVoltage === '34.5';
  const unitMultiplier = measurements.unit === 'GOhm' ? 1000 : 1;

  const rawATBT = (Number(measurements.atbt) || 0) * unitMultiplier;
  const rawATMasa = (Number(measurements.atmasa) || 0) * unitMultiplier;
  const rawBTMasa = (Number(measurements.btmasa) || 0) * unitMultiplier;

  // Temperature correction
  const temp = transformer.temperatureC !== '' ? Number(transformer.temperatureC) : 20;
  const tempFactor = getTemperatureCorrectionFactor(temp);
  
  // Resistance corrected to 20°C standard (R_20 = R_T * K_T)
  const corrATBT = Number((rawATBT * tempFactor).toFixed(2));
  const corrATMasa = Number((rawATMasa * tempFactor).toFixed(2));
  const corrBTMasa = Number((rawBTMasa * tempFactor).toFixed(2));

  // Determine thresholds based on primary voltage rating
  let thATBT_Aprobado = 500;
  let thATBT_Alerta = 200;
  let thATMasa_Aprobado = 500;
  let thATMasa_Alerta = 200;
  let thBTMasa_Aprobado = 200;
  let thBTMasa_Alerta = 100;

  if (is34_5kV) {
    thATBT_Aprobado = 1000;
    thATBT_Alerta = 500;
    thATMasa_Aprobado = 1000;
    thATMasa_Alerta = 500;
    thBTMasa_Aprobado = 500;
    thBTMasa_Alerta = 200;
  }

  // Individual evaluations
  const statusATBT = evaluateThreshold(rawATBT, thATBT_Aprobado, thATBT_Alerta);
  const statusATMasa = evaluateThreshold(rawATMasa, thATMasa_Aprobado, thATMasa_Alerta);
  const statusBTMasa = evaluateThreshold(rawBTMasa, thBTMasa_Aprobado, thBTMasa_Alerta);

  // Global status calculation
  const statuses = [statusATBT, statusATMasa, statusBTMasa];
  let globalStatus: EvaluationStatus = 'APROBADO';
  if (statuses.includes('RECHAZADO')) {
    globalStatus = 'RECHAZADO';
  } else if (statuses.includes('ALERTA')) {
    globalStatus = 'ALERTA';
  }

  // Diagnostic breakdown
  const breakdown: MeasurementBreakdown[] = [
    {
      key: 'atbt',
      label: 'AT - BT (Alta Tensión a Baja Tensión)',
      shortName: 'AT - BT',
      connectionDescription: 'Mide el aislamiento dieléctrico entre los devanados primario y secundario (barreras aislantes, ductos de refrigeración y papel kraft).',
      measuredValueMOhm: rawATBT,
      correctedValueMOhm: corrATBT,
      status: statusATBT,
      thresholdAprobado: thATBT_Aprobado,
      thresholdAlerta: thATBT_Alerta,
      details:
        statusATBT === 'APROBADO'
          ? 'Resistencia entre devanados en condición óptima. Excelente integridad del aislamiento interlaminar e interbobina.'
          : statusATBT === 'ALERTA'
          ? 'Resistencia entre devanados disminuida. Probable absorción de humedad en barreras de cartón prensado o contaminación de aceite.'
          : 'Aislamiento entre devanados severamente degradado. Alto riesgo de cortocircuito entre primario y secundario.',
      riskFactor:
        statusATBT === 'RECHAZADO'
          ? 'Riesgo crítico de transferencia de sobretensión de AT hacia circuitos de BT.'
          : statusATBT === 'ALERTA'
          ? 'Riesgo moderado de incremento de corrientes de fuga y envejecimiento acelerado.'
          : 'Riesgo nulo; rigidez dieléctrica adecuada.',
      recommendedAction:
        statusATBT === 'RECHAZADO'
          ? 'Desenergizar y prohibir energización inmediata. Realizar prueba de factor de potencia (Doble/Tan Delta) y análisis físico-químico del aceite.'
          : statusATBT === 'ALERTA'
          ? 'Programar secado de devanados y filtrado/termo-vacío de aceite dieléctrico en próximo mantenimiento.'
          : 'Apto para energización. Mantener en cronograma anual.',
    },
    {
      key: 'atmasa',
      label: 'AT - Masa (Alta Tensión a Tierra / Tanque)',
      shortName: 'AT - Masa',
      connectionDescription: 'Mide la resistencia del devanado de alta tensión respecto al tanque aterrado, núcleo magnético y herrajes.',
      measuredValueMOhm: rawATMasa,
      correctedValueMOhm: corrATMasa,
      status: statusATMasa,
      thresholdAprobado: thATMasa_Aprobado,
      thresholdAlerta: thATMasa_Alerta,
      details:
        statusATMasa === 'APROBADO'
          ? 'Aislamiento de alta tensión a tierra seguro y con margen superior a normas internacionales.'
          : statusATMasa === 'ALERTA'
          ? 'Aislamiento de AT a tierra marginal. Revisar limpieza de porcelanas/boquillas de alta tensión y presencia de humedad en el fondo del tanque.'
          : 'Falla a tierra en devanado de alta tensión o perforación de boquillas/bushings.',
      riskFactor:
        statusATMasa === 'RECHAZADO'
          ? 'Peligro inminente de arco eléctrico a tierra (falla fase-tierra destructiva).'
          : statusATMasa === 'ALERTA'
          ? 'Aparición de descargas parciales y degradación térmica del aceite.'
          : 'Rigidez dieléctrica garantizada contra sobretensiones transitorias.',
      recommendedAction:
        statusATMasa === 'RECHAZADO'
          ? 'Inspección interna de devanados, prueba de ruptura dieléctrica de boquillas y cromatografía de gases disueltos (DGA).'
          : statusATMasa === 'ALERTA'
          ? 'Limpieza y desengrase de boquillas de AT con solvente dieléctrico; verificar hermeticidad del tanque.'
          : 'Sin observaciones. Continuar con operación normal.',
    },
    {
      key: 'btmasa',
      label: 'BT - Masa (Baja Tensión a Tierra / Tanque)',
      shortName: 'BT - Masa',
      connectionDescription: 'Mide el aislamiento del devanado secundario respecto al núcleo, tanque y neutro desconectado.',
      measuredValueMOhm: rawBTMasa,
      correctedValueMOhm: corrBTMasa,
      status: statusBTMasa,
      thresholdAprobado: thBTMasa_Aprobado,
      thresholdAlerta: thBTMasa_Alerta,
      details:
        statusBTMasa === 'APROBADO'
          ? 'Aislamiento de baja tensión en excelentes condiciones de sequedad y limpieza.'
          : statusBTMasa === 'ALERTA'
          ? 'Aislamiento de BT por debajo de la norma óptima. Frecuente por polvo acumulado o humedad en borneras de salida.'
          : 'Falla dieléctrica franca entre devanado secundario y masa del transformador.',
      riskFactor:
        statusBTMasa === 'RECHAZADO'
          ? 'Riesgo de fuga a tierra en el secundario, disparos continuos y peligro de electrocución.'
          : statusBTMasa === 'ALERTA'
          ? 'Calentamiento focal en borneras y envejecimiento prematuro del papel aislante en BT.'
          : 'Aislamiento seguro para operación con carga nominal.',
      recommendedAction:
        statusBTMasa === 'RECHAZADO'
          ? 'Desmontar conexiones de BT, revisar empaquetaduras de pasamuros y verificar ausencia de rebabas metálicas.'
          : statusBTMasa === 'ALERTA'
          ? 'Verificar ajuste de tornillería en terminales de BT y limpiar aisladores pasamuros con paño seco antiestático.'
          : 'Cumplimiento total con especificaciones técnicas.',
    },
  ];

  // Calculate score percentage (0-100)
  const scoreATBT = Math.min(100, Math.round((rawATBT / thATBT_Aprobado) * 33.3));
  const scoreATMasa = Math.min(100, Math.round((rawATMasa / thATMasa_Aprobado) * 33.3));
  const scoreBTMasa = Math.min(100, Math.round((rawBTMasa / thBTMasa_Aprobado) * 33.4));
  const globalScore = Math.min(100, scoreATBT + scoreATMasa + scoreBTMasa);

  // Overall conclusions and actions
  const recommendations: string[] = [];
  let overallConclusion = '';

  if (globalStatus === 'APROBADO') {
    overallConclusion =
      'El transformador presenta una resistencia de aislamiento dieléctrico óptima en todos sus devanados y contra masa. Se autoriza su energización o continuidad en servicio bajo régimen de carga nominal.';
    recommendations.push('Registrar los valores en la bitácora histórica de mantenimiento predictivo.');
    recommendations.push('Continuar con el programa de inspección termográfica y muestreo de aceite programado.');
    recommendations.push('Verificar el estado del silica gel en el deshidratador de aire (color azul/naranja activo).');
  } else if (globalStatus === 'ALERTA') {
    overallConclusion =
      'El transformador se encuentra en estado de ALERTA / PRECAUCIÓN. Uno o más devanados presentan valores por debajo del umbral óptimo pero por encima del límite crítico de rechazo. Indica presencia de humedad, suciedad o inicio de degradación del aceite aislante.';
    recommendations.push('NO se recomienda energizar bajo plena carga sin antes investigar la causa de la degradación.');
    recommendations.push('Realizar proceso de desgasificado, termovacío y filtrado del aceite aislante si es transformador sumergido.');
    recommendations.push('Efectuar limpieza profunda de aisladores (bushings) con desengrasante dieléctrico de secado rápido.');
    recommendations.push('Realizar prueba de Índice de Polarización (IP) de 10 min / 1 min para diferenciar suciedad superficial de humedad profunda.');
  } else {
    overallConclusion =
      'TRANSFORMADOR RECHAZADO. Se detectó una falla dieléctrica grave que compromete la seguridad de la instalación y del personal. QUEDA ESTRICTAMENTE PROHIBIDA SU ENERGIZACIÓN.';
    recommendations.push('Mantener el equipo bloqueado con candado y tarjeta de seguridad (LOTO).');
    recommendations.push('Realizar prueba de rigidez dieléctrica de aceite bajo norma ASTM D877 / ASTM D1816.');
    recommendations.push('Ejecutar prueba de Relación de Transformación (TTR) y Resistencia Óhmica de Devanados para descartar espiras en corto.');
    recommendations.push('Evaluar el reacondicionamiento total en taller especializado o reemplazo de bobinas.');
  }

  const standardsReferenced = [
    'IEEE Std C57.12.90™ (Standard Test Code for Liquid-Immersed Distribution, Power, and Regulating Transformers)',
    'ANSI/NETA MTS (Standard for Maintenance Testing Specifications for Electrical Power Equipment)',
    'IEEE Std 43™ (Recommended Practice for Testing Insulation Resistance of Electric Machinery)',
  ];

  return {
    id: `EVAL-${Date.now()}`,
    timestamp: new Date().toISOString(),
    transformer,
    measurements,
    globalStatus,
    globalScorePercentage: globalScore,
    breakdown,
    tempCorrectionFactor: tempFactor,
    overallConclusion,
    recommendations,
    standardsReferenced,
  };
}

export function formatResistance(mohm: number): string {
  if (mohm >= 10000) {
    return `${(mohm / 1000).toFixed(2)} GΩ (${mohm.toLocaleString()} MΩ)`;
  }
  if (mohm >= 1000) {
    return `${(mohm / 1000).toFixed(2)} GΩ (${mohm} MΩ)`;
  }
  return `${mohm.toLocaleString()} MΩ`;
}

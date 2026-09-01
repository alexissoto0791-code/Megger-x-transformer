import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Printer,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Wrench,
  FileCheck,
  Zap,
} from 'lucide-react';
import { EvaluationResult, MeasurementBreakdown } from '../types';
import { formatResistance } from '../utils/meggerEvaluator';

interface EvaluationResultsProps {
  result: EvaluationResult;
  onReset: () => void;
  onOpenReport: () => void;
}

export const EvaluationResults: React.FC<EvaluationResultsProps> = ({
  result,
  onReset,
  onOpenReport,
}) => {
  const [showTemperatureNormalized, setShowTemperatureNormalized] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    atbt: true,
    atmasa: true,
    btmasa: true,
  });

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const {
    globalStatus,
    breakdown,
    transformer,
    overallConclusion,
    recommendations,
    tempCorrectionFactor,
    globalScorePercentage,
  } = result;

  // Header and Status Theme
  const isApproved = globalStatus === 'APROBADO';
  const isAlert = globalStatus === 'ALERTA';
  const isRejected = globalStatus === 'RECHAZADO';

  const headerBgClass = isApproved
    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white'
    : isAlert
    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950'
    : 'bg-gradient-to-r from-rose-600 to-red-700 text-white';

  const statusBadgeText = isApproved
    ? 'AISLAMIENTO ÓPTIMO - APTO PARA SERVICIO'
    : isAlert
    ? 'PRECAUCIÓN - DEGRADACIÓN / HUMEDAD DETECTADA'
    : 'NO APTO - FALLA DIELÉCTRICA CRÍTICA';

  return (
    <div
      id="resultadoCard"
      className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 scroll-mt-20"
    >
      {/* 1. GLOBAL VERDICT HERO HEADER */}
      <div className={`p-6 sm:p-8 text-center transition-colors duration-500 shadow-inner ${headerBgClass}`}>
        <div className="flex justify-center mb-3">
          {isApproved && (
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/30 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          )}
          {isAlert && (
            <div className="w-16 h-16 rounded-2xl bg-black/10 backdrop-blur-md flex items-center justify-center ring-4 ring-black/10 shadow-lg">
              <AlertTriangle className="w-10 h-10 text-slate-900" />
            </div>
          )}
          {isRejected && (
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/30 shadow-lg animate-pulse">
              <XCircle className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        <span className="inline-block text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-black/20 text-current mb-2">
          ESTADO GLOBAL DEL TRANSFORMADOR
        </span>

        <h2
          id="estadoGlobalTexto"
          className="text-3xl sm:text-4xl font-black uppercase tracking-wider leading-none"
        >
          {globalStatus}
        </h2>

        <p className="mt-2 text-sm sm:text-base font-semibold max-w-xl mx-auto opacity-95">
          {statusBadgeText}
        </p>

        {/* Transformer Quick Spec Badge */}
        <div className="mt-4 pt-4 border-t border-white/20 max-w-lg mx-auto flex flex-wrap justify-center items-center gap-3 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-sm">
            Capacidad: <strong>{transformer.capacityKva} kVA</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-sm">
            Tensión: <strong>{transformer.primaryVoltage} kV</strong> / {transformer.secondaryVoltage}
          </span>
          {transformer.tagNumber && (
            <span className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-sm">
              Tag: <strong>{transformer.tagNumber}</strong>
            </span>
          )}
        </div>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Toggle Temperature Normalization */}
        {transformer.temperatureC !== '' && Number(transformer.temperatureC) !== 20 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Thermometer className="w-4 h-4 text-blue-600" />
              <span>
                Temperatura de prueba: <strong>{transformer.temperatureC}°C</strong> (Factor IEEE $K_T$: <strong>{tempCorrectionFactor}</strong>)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowTemperatureNormalized(!showTemperatureNormalized)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-100/70 hover:bg-blue-200/70 px-3 py-1.5 rounded-lg transition"
            >
              {showTemperatureNormalized
                ? 'Ver Valores Medidos Directos'
                : 'Ver Normalizados a 20°C (IEEE C57.12.90)'}
            </button>
          </div>
        )}

        {/* 3. MEASUREMENTS BREAKDOWN */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Desglose de Mediciones Dieléctricas
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {showTemperatureNormalized ? 'Base 20°C' : 'Lectura Directa'}
            </span>
          </div>

          <div className="space-y-4">
            {breakdown.map((item) => {
              const isItemApproved = item.status === 'APROBADO';
              const isItemAlert = item.status === 'ALERTA';
              const isItemRejected = item.status === 'RECHAZADO';
              const isExpanded = !!expandedItems[item.key];

              const displayVal = showTemperatureNormalized
                ? item.correctedValueMOhm
                : item.measuredValueMOhm;

              // Gauge calculation
              const pct = Math.min(100, (displayVal / (item.thresholdAprobado * 1.5)) * 100);
              const alertPct = (item.thresholdAlerta / (item.thresholdAprobado * 1.5)) * 100;
              const approvedPct = (item.thresholdAprobado / (item.thresholdAprobado * 1.5)) * 100;

              return (
                <div
                  key={item.key}
                  className="bg-slate-50/70 rounded-xl border border-slate-200 hover:border-slate-300 transition overflow-hidden shadow-sm"
                >
                  {/* Summary row */}
                  <div
                    onClick={() => toggleExpand(item.key)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-3.5 h-3.5 rounded-full mt-1 sm:mt-0 shrink-0 ${
                          isItemApproved
                            ? 'bg-emerald-500 ring-4 ring-emerald-100'
                            : isItemAlert
                            ? 'bg-amber-500 ring-4 ring-amber-100'
                            : 'bg-rose-500 ring-4 ring-rose-100'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">
                            {item.label}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.connectionDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {/* Value display */}
                      <div className="text-right">
                        <span className="text-xl font-mono font-black text-slate-900 block">
                          {formatResistance(displayVal)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          Mín. Requerido: {item.thresholdAprobado} MΩ
                        </span>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider border shrink-0 ${
                          isItemApproved
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isItemAlert
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {item.status}
                      </span>

                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 p-1"
                        aria-label="Expandir detalles"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Visual Range Gauge Bar */}
                  <div className="px-4 sm:px-5 pb-3">
                    <div className="space-y-1">
                      <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden relative flex">
                        {/* Zone 1: Rejected */}
                        <div
                          style={{ width: `${alertPct}%` }}
                          className="h-full bg-rose-300 border-r border-white/50"
                          title="Zona Rechazada"
                        />
                        {/* Zone 2: Alert */}
                        <div
                          style={{ width: `${approvedPct - alertPct}%` }}
                          className="h-full bg-amber-300 border-r border-white/50"
                          title="Zona Alerta"
                        />
                        {/* Zone 3: Approved */}
                        <div
                          style={{ width: `${100 - approvedPct}%` }}
                          className="h-full bg-emerald-300"
                          title="Zona Aprobada"
                        />

                        {/* Current Value Marker */}
                        <div
                          style={{ left: `${Math.min(98, Math.max(2, pct))}%` }}
                          className="absolute top-0 bottom-0 w-2 -ml-1 bg-slate-900 rounded-full shadow-md z-10"
                          title={`Valor actual: ${displayVal} MΩ`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>0 MΩ (Rechazado)</span>
                        <span>Alerta: {item.thresholdAlerta} MΩ</span>
                        <span>Aprobado: ≥ {item.thresholdAprobado} MΩ</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Technical Diagnosis */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-200/80 bg-white/70 space-y-2.5 text-xs">
                      <div>
                        <span className="font-bold text-slate-700">Diagnóstico:</span>{' '}
                        <span className="text-slate-600">{item.details}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Nivel de Riesgo:</span>{' '}
                        <span className="text-slate-600">{item.riskFactor}</span>
                      </div>
                      <div>
                        <span className="font-bold text-blue-700">Acción Recomendada:</span>{' '}
                        <span className="text-slate-700 font-medium">{item.recommendedAction}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. OVERALL CONCLUSION & FIELD RECOMMENDATIONS */}
        <section className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base sm:text-lg text-white">
              Dictamen Técnico y Recomendaciones de Campo
            </h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {overallConclusion}
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Acciones Inmediatas a Ejecutar:
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. FOOTER ACTIONS */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            id="btnReiniciar"
            onClick={onReset}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Nueva Evaluación</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-blue-600/20 transition duration-200 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Descargar Certificado</span>
          </button>
        </div>
      </div>
    </div>
  );
};

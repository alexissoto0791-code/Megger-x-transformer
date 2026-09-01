import React from 'react';
import { X, Printer, Download, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Zap } from 'lucide-react';
import { EvaluationResult } from '../types';
import { formatResistance } from '../utils/meggerEvaluator';

interface TechnicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EvaluationResult | null;
}

export const TechnicalReportModal: React.FC<TechnicalReportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen || !result) return null;

  const {
    id,
    timestamp,
    transformer,
    globalStatus,
    breakdown,
    overallConclusion,
    recommendations,
    tempCorrectionFactor,
    standardsReferenced,
  } = result;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm sm:text-base">
              Certificado de Protocolo de Pruebas Dieléctricas Megger
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0 print:space-y-4 print:text-black">
          
          {/* Certificate Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-black text-xl tracking-tight">
                <Zap className="w-6 h-6 text-blue-600 fill-blue-600" />
                <span>MEGGER-X DIAGNOSTICS LAB</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                Protocolo de Ensayo de Resistencia de Aislamiento en Transformadores
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Conforme a IEEE Std C57.12.90 y ANSI/NETA MTS
              </p>
            </div>

            <div className="text-right text-xs space-y-0.5 font-mono">
              <p><strong>Certificado N°:</strong> {id}</p>
              <p><strong>Fecha de Ensayo:</strong> {formattedDate}</p>
              <p><strong>Estado:</strong> <span className="font-bold uppercase text-slate-900">{globalStatus}</span></p>
            </div>
          </div>

          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl text-center font-bold text-sm uppercase tracking-wider border ${
              globalStatus === 'APROBADO'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : globalStatus === 'ALERTA'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            DICTAMEN TÉCNICO GLOBAL:{' '}
            <span className="text-lg font-black">{globalStatus}</span> —{' '}
            {globalStatus === 'APROBADO'
              ? 'APTO PARA PUESTA EN SERVICIO / ENERGIZACIÓN'
              : globalStatus === 'ALERTA'
              ? 'CONDICIÓN MARGINAL - REQUIERE MANTENIMIENTO PREVENTIVO'
              : 'RECHAZADO - PROHIBIDA SU ENERGIZACIÓN'}
          </div>

          {/* Section 1: Equipment Nameplate */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              1. Identificación y Datos de Placa del Transformador
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Capacidad Nominal:</span>
                <strong className="text-sm font-mono">{transformer.capacityKva} kVA</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Voltaje Primario (AT):</span>
                <strong className="text-sm font-mono">{transformer.primaryVoltage} kV</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Voltaje Secundario (BT):</span>
                <strong className="text-sm font-mono">{transformer.secondaryVoltage}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tipo Aislamiento:</span>
                <strong className="capitalize">{transformer.insulationType === 'oil' ? 'Aceite Mineral (ONAN)' : 'Tipo Seco'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tag / N° Serie:</span>
                <strong>{transformer.tagNumber || 'N/A'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Temperatura Ensayo:</span>
                <strong>{transformer.temperatureC !== '' ? `${transformer.temperatureC} °C` : '20 °C'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Subestación:</span>
                <strong>{transformer.substation || 'En sitio'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Técnico / Responsable:</span>
                <strong>{transformer.technician || 'Ingeniero de Pruebas'}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Measurements Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              2. Registro de Ensayos Dieléctricos Megger (60 Segundos)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-left font-semibold">
                    <th className="p-2.5">Prueba / Terminales</th>
                    <th className="p-2.5">Lectura Medida (MΩ)</th>
                    <th className="p-2.5">Normalizado 20°C (MΩ)</th>
                    <th className="p-2.5">Mínimo Requerido</th>
                    <th className="p-2.5">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                  {breakdown.map((item) => (
                    <tr key={item.key} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">
                        {item.label}
                      </td>
                      <td className="p-2.5 font-mono font-bold">
                        {formatResistance(item.measuredValueMOhm)}
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">
                        {formatResistance(item.correctedValueMOhm)}
                      </td>
                      <td className="p-2.5 font-mono">
                        ≥ {item.thresholdAprobado} MΩ
                      </td>
                      <td className="p-2.5 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] uppercase ${
                            item.status === 'APROBADO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'ALERTA'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Technical Diagnosis */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              3. Conclusión Técnica y Dictamen de Ingeniería
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {overallConclusion}
            </p>
          </div>

          {/* Section 4: Recommendations */}
          <div className="space-y-1 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              4. Recomendaciones Operativas
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
              {recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold">{transformer.technician || 'Ing. de Pruebas Eléctricas'}</p>
              <p className="text-slate-500 text-[11px]">Especialista en Mantenimiento de Subestaciones</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold">Supervisión / Aprobación Técnica</p>
              <p className="text-slate-500 text-[11px]">Jefatura de Operaciones y Mantenimiento</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

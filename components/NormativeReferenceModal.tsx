import React from 'react';
import { X, BookOpen, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { IEEE_TEMP_CORRECTION_TABLE } from '../constants';

interface NormativeReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NormativeReferenceModal: React.FC<NormativeReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Criterios Normativos y Estándares IEEE / NETA
              </h3>
              <p className="text-xs text-slate-400">Guía técnica para pruebas Megger en transformadores</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          
          {/* 1. Thresholds Summary */}
          <section className="space-y-3">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              1. Tabla de Umbrales de Aislamiento Mínimo (MΩ)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-left">
                    <th className="p-2.5 font-bold">Tensión Primaria</th>
                    <th className="p-2.5 font-bold">Terminal</th>
                    <th className="p-2.5 font-bold text-emerald-700">Aprobado</th>
                    <th className="p-2.5 font-bold text-amber-700">Alerta (Investigar)</th>
                    <th className="p-2.5 font-bold text-rose-700">Rechazado (Crítico)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-900" rowSpan={3}>
                      13.2 kV o menor
                    </td>
                    <td className="p-2.5">AT - BT</td>
                    <td className="p-2.5 font-bold text-emerald-600">≥ 500 MΩ</td>
                    <td className="p-2.5 font-semibold text-amber-600">200 a 499 MΩ</td>
                    <td className="p-2.5 font-bold text-rose-600">&lt; 200 MΩ</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5">AT - Masa</td>
                    <td className="p-2.5 font-bold text-emerald-600">≥ 500 MΩ</td>
                    <td className="p-2.5 font-semibold text-amber-600">200 a 499 MΩ</td>
                    <td className="p-2.5 font-bold text-rose-600">&lt; 200 MΩ</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5">BT - Masa</td>
                    <td className="p-2.5 font-bold text-emerald-600">≥ 200 MΩ</td>
                    <td className="p-2.5 font-semibold text-amber-600">100 a 199 MΩ</td>
                    <td className="p-2.5 font-bold text-rose-600">&lt; 100 MΩ</td>
                  </tr>

                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="p-2.5 font-semibold text-slate-900" rowSpan={3}>
                      34.5 kV
                    </td>
                    <td className="p-2.5">AT - BT</td>
                    <td className="p-2.5 font-bold text-emerald-600">≥ 1000 MΩ (1 GΩ)</td>
                    <td className="p-2.5 font-semibold text-amber-600">500 a 999 MΩ</td>
                    <td className="p-2.5 font-bold text-rose-600">&lt; 500 MΩ</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="p-2.5">AT - Masa</td>
                    <td className="p-2.5 font-bold text-emerald-600">≥ 1000 MΩ (1 GΩ)</td>
                    <td className="p-2.5 font-semibold text-amber-600">500 a 999 MΩ</td>
                    <td className="p-2.5 font-bold text-rose-600">&lt; 500 MΩ</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="p-2.5">BT - Masa</td>
                    <td className="p-2.5 font-bold text-emerald-600">≥ 500 MΩ</td>
                    <td className="p-2.5 font-semibold text-amber-600">200 a 499 MΩ</td>
                    <td className="p-2.5 font-bold text-rose-600">&lt; 200 MΩ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. Temperature Correction */}
          <section className="space-y-3">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              2. Corrección de Resistencia por Temperatura (Base 20°C)
            </h4>
            <p className="text-xs text-slate-600">
              La resistencia de aislamiento dieléctrico es inversamente proporcional a la temperatura. Según la norma <strong>IEEE Std C57.12.90</strong>, la resistencia se reduce aproximadamente a la mitad por cada aumento de 10°C en los devanados o aceite.
            </p>
            <div className="bg-slate-100 p-3 rounded-xl font-mono text-xs text-slate-800">
              Fórmula: <strong>R₂₀ = R_T × 2^((T - 20) / 10)</strong>
            </div>
          </section>

          {/* 3. Safety Recommendations */}
          <section className="space-y-2 bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-xs text-amber-900">
            <h5 className="font-bold flex items-center gap-1.5 text-amber-800">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Reglas de Oro de Seguridad en Pruebas Megger
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>El transformador debe estar <strong>100% desenergizado</strong>, desvinculado de la red y bloqueado (LOTO).</li>
              <li>Aterrar los devanados inmediatamente antes y después de cada inyección de tensión DC durante al menos 4 veces el tiempo de prueba para descargar capacitancia residual.</li>
              <li>Limpiar cuidadosamente la superficie de los bushings/aisladores para evitar corrientes de fuga superficiales.</li>
            </ul>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition"
          >
            Entendido / Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

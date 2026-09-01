import React from 'react';
import { X, History, Trash2, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, FileSpreadsheet } from 'lucide-react';
import { EvaluationResult } from '../types';
import { formatResistance } from '../utils/meggerEvaluator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: EvaluationResult[];
  onLoadEvaluation: (item: EvaluationResult) => void;
  onClearHistory: () => void;
  onDeleteSingle: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onLoadEvaluation,
  onClearHistory,
  onDeleteSingle,
}) => {
  if (!isOpen) return null;

  const exportToCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'ID',
      'Fecha',
      'Tag',
      'Capacidad_kVA',
      'Voltaje_Primario_kV',
      'Voltaje_Secundario',
      'Estado_Global',
      'AT_BT_MOhm',
      'AT_Masa_MOhm',
      'BT_Masa_MOhm',
      'Tecnico',
      'Subestacion',
    ];

    const rows = history.map((h) => [
      h.id,
      h.timestamp,
      `"${h.transformer.tagNumber || ''}"`,
      h.transformer.capacityKva,
      h.transformer.primaryVoltage,
      `"${h.transformer.secondaryVoltage}"`,
      h.globalStatus,
      h.measurements.atbt,
      h.measurements.atmasa,
      h.measurements.btmasa,
      `"${h.transformer.technician || ''}"`,
      `"${h.transformer.substation || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historial_megger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">Historial de Evaluaciones ({history.length})</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <History className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="font-semibold text-sm">No hay evaluaciones guardadas aún</p>
              <p className="text-xs text-slate-400">
                Cada evaluación realizada se guardará automáticamente en este dispositivo.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-blue-400 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {item.transformer.capacityKva} kVA ({item.transformer.primaryVoltage} kV)
                      </span>
                      {item.transformer.tagNumber && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          {item.transformer.tagNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {new Date(item.timestamp).toLocaleString('es-ES', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
                      item.globalStatus === 'APROBADO'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : item.globalStatus === 'ALERTA'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {item.globalStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[11px] font-mono bg-white p-2 rounded-lg border border-slate-100 text-slate-700">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">AT-BT</span>
                    <strong>{item.measurements.atbt} MΩ</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">AT-Masa</span>
                    <strong>{item.measurements.atmasa} MΩ</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">BT-Masa</span>
                    <strong>{item.measurements.btmasa} MΩ</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => onLoadEvaluation(item)}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 text-xs"
                  >
                    <span>Cargar en formulario</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSingle(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition"
                    title="Eliminar de historial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex gap-2">
            <button
              type="button"
              onClick={exportToCSV}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar CSV</span>
            </button>
            <button
              type="button"
              onClick={onClearHistory}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition border border-rose-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Borrar Todo</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

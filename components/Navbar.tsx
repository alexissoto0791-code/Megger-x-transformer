import React from 'react';
import { Zap, BookOpen, History, Printer, Sparkles, ShieldCheck } from 'lucide-react';
import { PRESETS } from '../constants';
import { PresetEvaluation } from '../types';

interface NavbarProps {
  onSelectPreset: (preset: PresetEvaluation) => void;
  onOpenNorms: () => void;
  onOpenHistory: () => void;
  onOpenReport: () => void;
  historyCount: number;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPreset,
  onOpenNorms,
  onOpenHistory,
  onOpenReport,
  historyCount,
  hasResult,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Brand & App Name */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg leading-tight tracking-tight text-white">
                    Megger<span className="text-blue-400 font-black">X</span> Transformer
                  </h1>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    IEEE / NETA
                  </span>
                </div>
                <p className="text-xs text-slate-400">Diagnóstico de Aislamiento Dieléctrico en Frío</p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                type="button"
                onClick={onOpenNorms}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                title="Normas y Criterios"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenHistory}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 relative"
                title="Historial de Pruebas"
              >
                <History className="w-4 h-4" />
                {historyCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                    {historyCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Preset Selector & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            
            {/* Quick Presets Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cargar Ejemplo</span>
              </button>

              <div className="hidden group-hover:block hover:block absolute right-0 top-full pt-1.5 w-72 z-50">
                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1">
                  <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Casos de Prueba Típicos
                  </div>
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onSelectPreset(preset)}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 transition flex items-start gap-2 text-xs"
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                          preset.expectedStatus === 'APROBADO'
                            ? 'bg-emerald-400'
                            : preset.expectedStatus === 'ALERTA'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                      <div>
                        <p className="font-semibold text-slate-200">{preset.title}</p>
                        <p className="text-[11px] text-slate-400 leading-tight">{preset.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Normative Reference Button */}
            <button
              type="button"
              onClick={onOpenNorms}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Criterios IEEE/NETA</span>
            </button>

            {/* History Button */}
            <button
              type="button"
              onClick={onOpenHistory}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all relative"
            >
              <History className="w-3.5 h-3.5 text-purple-400" />
              <span>Historial ({historyCount})</span>
            </button>

            {/* Print / Report Button */}
            {hasResult && (
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generar Certificado</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

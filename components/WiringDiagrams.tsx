import React, { useState } from 'react';
import { Cable, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export const WiringDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'atbt' | 'atmasa' | 'btmasa'>('atbt');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cable className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            Esquemas de Conexión del Megóhmetro (Bornes y Guarda)
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full w-fit">
          Protocolo IEEE Std 43 / C57.12.90
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/50 p-1.5 gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('atbt')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'atbt'
              ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          1. Prueba AT - BT (Entre Devanados)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('atmasa')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'atmasa'
              ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          2. Prueba AT - Masa (Alta a Tierra)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('btmasa')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'btmasa'
              ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          3. Prueba BT - Masa (Baja a Tierra)
        </button>
      </div>

      <div className="p-5">
        {activeTab === 'atbt' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Visual SVG Diagram */}
            <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl text-white font-mono text-xs shadow-inner">
              <div className="text-[11px] text-slate-400 mb-2 font-sans font-semibold flex items-center justify-between">
                <span>Diagrama de Circuito: AT vs BT</span>
                <span className="text-amber-400 font-mono text-[10px]">Tensión: 1000V - 5000V DC</span>
              </div>
              <svg viewBox="0 0 460 220" className="w-full h-auto">
                {/* Transformer Tank outline */}
                <rect x="130" y="40" width="200" height="150" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <text x="230" y="125" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">TANQUE TRANSFORMADOR</text>
                
                {/* HV Bushings */}
                <rect x="150" y="20" width="30" height="20" rx="3" fill="#dc2626" />
                <text x="165" y="34" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">H1,H2,H3</text>
                
                {/* LV Bushings */}
                <rect x="280" y="20" width="30" height="20" rx="3" fill="#2563eb" />
                <text x="295" y="34" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">X1..X4</text>

                {/* Ground terminal on tank */}
                <circle cx="230" cy="190" r="4" fill="#22c55e" />
                <text x="230" y="208" fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold">Tierra/Tanque</text>

                {/* Megger instrument */}
                <rect x="20" y="55" width="80" height="110" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                <text x="60" y="80" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">MEGGER</text>
                
                {/* Megger Terminals */}
                <circle cx="35" cy="100" r="5" fill="#ef4444" />
                <text x="48" y="104" fill="#ef4444" fontSize="8" fontWeight="bold">L (Línea)</text>
                
                <circle cx="35" cy="122" r="5" fill="#3b82f6" />
                <text x="48" y="126" fill="#3b82f6" fontSize="8" fontWeight="bold">E (Tierra)</text>
                
                <circle cx="35" cy="144" r="5" fill="#10b981" />
                <text x="48" y="148" fill="#10b981" fontSize="8" fontWeight="bold">G (Guarda)</text>

                {/* Cable Line (Red) to HV */}
                <path d="M 35 100 Q 90 20 150 25" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 2" />
                
                {/* Cable Earth (Blue) to LV */}
                <path d="M 35 122 Q 180 0 280 25" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                
                {/* Cable Guard (Green) to Tank Ground */}
                <path d="M 35 144 Q 100 190 226 190" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Step-by-step description */}
            <div className="md:col-span-5 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Conexión Devanado Primario a Secundario
              </h4>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">L</span>
                  <span><strong>Terminal Línea (L):</strong> Conectar a bornes de Alta Tensión (H1, H2, H3 puenteados).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">E</span>
                  <span><strong>Terminal Tierra (E):</strong> Conectar a bornes de Baja Tensión (X1, X2, X3, X0 puenteados).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">G</span>
                  <span><strong>Terminal Guarda (G):</strong> Conectar al Tanque/Masa del transformador para derivar corrientes de fuga a tierra y medir exclusivamente el aislamiento entre bobinas.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'atmasa' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Visual SVG Diagram */}
            <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl text-white font-mono text-xs shadow-inner">
              <div className="text-[11px] text-slate-400 mb-2 font-sans font-semibold flex items-center justify-between">
                <span>Diagrama de Circuito: AT vs Masa</span>
                <span className="text-amber-400 font-mono text-[10px]">Tensión: 1000V - 5000V DC</span>
              </div>
              <svg viewBox="0 0 460 220" className="w-full h-auto">
                <rect x="130" y="40" width="200" height="150" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <text x="230" y="125" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">TANQUE TRANSFORMADOR</text>
                
                <rect x="150" y="20" width="30" height="20" rx="3" fill="#dc2626" />
                <text x="165" y="34" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">H1,H2,H3</text>
                
                <rect x="280" y="20" width="30" height="20" rx="3" fill="#2563eb" />
                <text x="295" y="34" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">X1..X4</text>

                <circle cx="230" cy="190" r="4" fill="#22c55e" />
                <text x="230" y="208" fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold">Tierra/Tanque</text>

                <rect x="20" y="55" width="80" height="110" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                <text x="60" y="80" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">MEGGER</text>
                
                <circle cx="35" cy="100" r="5" fill="#ef4444" />
                <text x="48" y="104" fill="#ef4444" fontSize="8" fontWeight="bold">L (Línea)</text>
                
                <circle cx="35" cy="122" r="5" fill="#3b82f6" />
                <text x="48" y="126" fill="#3b82f6" fontSize="8" fontWeight="bold">E (Tierra)</text>
                
                <circle cx="35" cy="144" r="5" fill="#10b981" />
                <text x="48" y="148" fill="#10b981" fontSize="8" fontWeight="bold">G (Guarda)</text>

                {/* Cable Line (Red) to HV */}
                <path d="M 35 100 Q 90 20 150 25" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                
                {/* Cable Earth (Blue) to Tank Ground */}
                <path d="M 35 122 Q 120 190 226 190" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                
                {/* Cable Guard (Green) to LV */}
                <path d="M 35 144 Q 180 5 280 25" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
              </svg>
            </div>

            <div className="md:col-span-5 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Conexión Devanado Primario a Masa (Tierra)
              </h4>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">L</span>
                  <span><strong>Terminal Línea (L):</strong> Conectar a bornes de Alta Tensión (H1, H2, H3 puenteados).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">E</span>
                  <span><strong>Terminal Tierra (E):</strong> Conectar al Tanque metálico y barra de puesta a tierra.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">G</span>
                  <span><strong>Terminal Guarda (G):</strong> Conectar a bornes de Baja Tensión (X) para anular corrientes de fuga que circulen hacia el secundario.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'btmasa' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Visual SVG Diagram */}
            <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl text-white font-mono text-xs shadow-inner">
              <div className="text-[11px] text-slate-400 mb-2 font-sans font-semibold flex items-center justify-between">
                <span>Diagrama de Circuito: BT vs Masa</span>
                <span className="text-amber-400 font-mono text-[10px]">Tensión: 500V - 1000V DC</span>
              </div>
              <svg viewBox="0 0 460 220" className="w-full h-auto">
                <rect x="130" y="40" width="200" height="150" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <text x="230" y="125" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">TANQUE TRANSFORMADOR</text>
                
                <rect x="150" y="20" width="30" height="20" rx="3" fill="#dc2626" />
                <text x="165" y="34" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">H1,H2,H3</text>
                
                <rect x="280" y="20" width="30" height="20" rx="3" fill="#2563eb" />
                <text x="295" y="34" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">X1..X4</text>

                <circle cx="230" cy="190" r="4" fill="#22c55e" />
                <text x="230" y="208" fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="bold">Tierra/Tanque</text>

                <rect x="20" y="55" width="80" height="110" rx="6" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                <text x="60" y="80" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">MEGGER</text>
                
                <circle cx="35" cy="100" r="5" fill="#ef4444" />
                <text x="48" y="104" fill="#ef4444" fontSize="8" fontWeight="bold">L (Línea)</text>
                
                <circle cx="35" cy="122" r="5" fill="#3b82f6" />
                <text x="48" y="126" fill="#3b82f6" fontSize="8" fontWeight="bold">E (Tierra)</text>
                
                <circle cx="35" cy="144" r="5" fill="#10b981" />
                <text x="48" y="148" fill="#10b981" fontSize="8" fontWeight="bold">G (Guarda)</text>

                {/* Cable Line (Red) to LV */}
                <path d="M 35 100 Q 180 5 280 25" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                
                {/* Cable Earth (Blue) to Tank Ground */}
                <path d="M 35 122 Q 120 190 226 190" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                
                {/* Cable Guard (Green) to HV */}
                <path d="M 35 144 Q 90 20 150 25" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
              </svg>
            </div>

            <div className="md:col-span-5 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Conexión Devanado Secundario a Masa (Tierra)
              </h4>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">L</span>
                  <span><strong>Terminal Línea (L):</strong> Conectar a bornes de Baja Tensión (X1, X2, X3, X0 puenteados).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">E</span>
                  <span><strong>Terminal Tierra (E):</strong> Conectar al Tanque metálico aterrado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">G</span>
                  <span><strong>Terminal Guarda (G):</strong> Conectar a bornes de Alta Tensión (H) para aislar corrientes superficiales.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

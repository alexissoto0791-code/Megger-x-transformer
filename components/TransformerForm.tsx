import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Gauge,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Thermometer,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import {
  TransformerData,
  MeggerMeasurements,
} from '../types';
import {
  VOLTAGE_OPTIONS,
  COMMON_CAPACITIES,
  COMMON_SECONDARY_VOLTAGES,
} from '../constants';

interface TransformerFormProps {
  transformer: TransformerData;
  measurements: MeggerMeasurements;
  onTransformerChange: (data: Partial<TransformerData>) => void;
  onMeasurementsChange: (data: Partial<MeggerMeasurements>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const TransformerForm: React.FC<TransformerFormProps> = ({
  transformer,
  measurements,
  onTransformerChange,
  onMeasurementsChange,
  onSubmit,
  onReset,
  isLoading = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick unit toggle (MΩ vs GΩ)
  const isGOhm = measurements.unit === 'GOhm';

  return (
    <form
      id="meggerForm"
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 md:p-8 space-y-8"
    >
      {/* SECTION 1: PLACA DEL EQUIPO */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Placa del Equipo
              </h2>
              <p className="text-xs text-slate-500">Datos nominales del transformador</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Ocultar Opciones Avanzadas' : 'Más Datos de Campo'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Capacidad (kVA) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="capacidad"
                className="block text-sm font-semibold text-slate-800"
              >
                Capacidad (kVA) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Potencia nominal</span>
            </div>
            <div className="relative">
              <input
                type="number"
                id="capacidad"
                required
                min="1"
                step="0.1"
                value={transformer.capacityKva}
                onChange={(e) =>
                  onTransformerChange({
                    capacityKva: e.target.value === '' ? '' : parseFloat(e.target.value),
                  })
                }
                className="w-full bg-slate-50/80 border border-slate-300 rounded-xl p-3.5 text-lg font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ej. 112.5"
              />
              <span className="absolute right-3.5 top-4 text-xs font-bold text-slate-400">
                kVA
              </span>
            </div>
            
            {/* Quick capacity pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[45, 75, 112.5, 150, 300, 500].map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => onTransformerChange({ capacityKva: cap })}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition ${
                    transformer.capacityKva === cap
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          {/* Voltaje Primario */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="voltajePrimario"
                className="block text-sm font-semibold text-slate-800"
              >
                Voltaje Primario (Media Tensión) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Clase de Aislamiento</span>
            </div>
            <select
              id="voltajePrimario"
              required
              value={transformer.primaryVoltage}
              onChange={(e) => onTransformerChange({ primaryVoltage: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-300 rounded-xl p-3.5 text-base font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="13.2">13.2 kV o menor (Umbral: 500 / 200 MΩ)</option>
              <option value="34.5">34.5 kV (Umbral: 1000 / 500 MΩ)</option>
              <option value="4.16">4.16 kV (Media Tensión Industrial)</option>
              <option value="23.0">23.0 kV (Media Tensión)</option>
            </select>

            <p className="text-[11px] text-slate-500 pt-0.5 flex items-center gap-1">
              <span className="font-semibold text-blue-600">
                {transformer.primaryVoltage === '34.5' ? 'Alta Exigencia:' : 'Estándar:'}
              </span>{' '}
              {transformer.primaryVoltage === '34.5'
                ? 'Límites: AT ≥ 1000 MΩ (Aprobado), ≥ 500 MΩ (Alerta)'
                : 'Límites: AT ≥ 500 MΩ (Aprobado), ≥ 200 MΩ (Alerta)'}
            </p>
          </div>

          {/* Voltaje Secundario */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="voltajeSecundario"
                className="block text-sm font-semibold text-slate-800"
              >
                Voltaje Secundario (V) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Tensión de Baja</span>
            </div>
            <input
              type="text"
              id="voltajeSecundario"
              required
              value={transformer.secondaryVoltage}
              onChange={(e) => onTransformerChange({ secondaryVoltage: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-300 rounded-xl p-3.5 text-base font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Ej. 220/127 V, 240/120 V, 480/277 V"
            />
            
            {/* Quick voltage pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_SECONDARY_VOLTAGES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onTransformerChange({ secondaryVoltage: v })}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition ${
                    transformer.secondaryVoltage === v
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ADVANCED OPTIONAL FIELDS */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/60 p-4 rounded-xl space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-500" />
              Condiciones de Prueba y Normalización IEEE C57.12.90
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Tag / Identificador */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag / N° Serie
                </label>
                <input
                  type="text"
                  value={transformer.tagNumber}
                  onChange={(e) => onTransformerChange({ tagNumber: e.target.value })}
                  placeholder="Ej. TR-01"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-mono text-slate-800"
                />
              </div>

              {/* Temperatura Ambiente */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Temperatura Aceite/Ambiente (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={transformer.temperatureC}
                    onChange={(e) =>
                      onTransformerChange({
                        temperatureC: e.target.value === '' ? '' : parseFloat(e.target.value),
                      })
                    }
                    placeholder="20"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-mono text-slate-800"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-slate-400 font-semibold">
                    °C
                  </span>
                </div>
              </div>

              {/* Tipo de Aislamiento */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Aislamiento
                </label>
                <select
                  value={transformer.insulationType}
                  onChange={(e) =>
                    onTransformerChange({
                      insulationType: e.target.value as 'oil' | 'dry',
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-800"
                >
                  <option value="oil">Sumergido en Aceite Mineral (ONAN)</option>
                  <option value="dry">Tipo Seco Encapsulado (Dry-Type)</option>
                </select>
              </div>

              {/* Técnico / Responsable */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Técnico / Ingeniero de Prueba
                </label>
                <input
                  type="text"
                  value={transformer.technician}
                  onChange={(e) => onTransformerChange({ technician: e.target.value })}
                  placeholder="Nombre del técnico"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-800"
                />
              </div>

              {/* Subestación / Ubicación */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subestación / Planta
                </label>
                <input
                  type="text"
                  value={transformer.substation}
                  onChange={(e) => onTransformerChange({ substation: e.target.value })}
                  placeholder="Ej. Subestación Transformación 1"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-800"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: MEDICIONES MEGGER */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Medición Megger (Resistencia de Aislamiento)
              </h2>
              <p className="text-xs text-slate-500">Lecturas a 1 minuto (60 segundos) en frío</p>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600 px-1.5">Unidad:</span>
            <button
              type="button"
              onClick={() => onMeasurementsChange({ unit: 'MOhm' })}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                !isGOhm
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Megaohmios (MΩ)
            </button>
            <button
              type="button"
              onClick={() => onMeasurementsChange({ unit: 'GOhm' })}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                isGOhm
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gigaohmios (GΩ)
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {/* AT - BT */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 hover:border-blue-300 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label
                htmlFor="atbt"
                className="text-sm font-bold text-slate-800 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                AT - BT (Alta Tensión a Baja Tensión) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                Aislamiento entre devanados
              </span>
            </div>
            
            <div className="relative">
              <input
                type="number"
                id="atbt"
                required
                min="0"
                step="0.01"
                value={measurements.atbt}
                onChange={(e) =>
                  onMeasurementsChange({
                    atbt: e.target.value === '' ? '' : parseFloat(e.target.value),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder={isGOhm ? 'Ej. 1.85' : 'Ej. 1850'}
              />
              <span className="absolute right-3.5 top-4 text-xs font-bold text-slate-500">
                {isGOhm ? 'GΩ' : 'MΩ'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Límite mínimo requerido:{' '}
              <strong className="text-slate-700">
                {transformer.primaryVoltage === '34.5' ? '1000 MΩ' : '500 MΩ'}
              </strong>
            </p>
          </div>

          {/* AT - Masa */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 hover:border-blue-300 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label
                htmlFor="atmasa"
                className="text-sm font-bold text-slate-800 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                AT - Masa (Alta Tensión a Tierra / Tanque) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                Aislamiento devanado primario a tierra
              </span>
            </div>
            
            <div className="relative">
              <input
                type="number"
                id="atmasa"
                required
                min="0"
                step="0.01"
                value={measurements.atmasa}
                onChange={(e) =>
                  onMeasurementsChange({
                    atmasa: e.target.value === '' ? '' : parseFloat(e.target.value),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder={isGOhm ? 'Ej. 1.42' : 'Ej. 1420'}
              />
              <span className="absolute right-3.5 top-4 text-xs font-bold text-slate-500">
                {isGOhm ? 'GΩ' : 'MΩ'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Límite mínimo requerido:{' '}
              <strong className="text-slate-700">
                {transformer.primaryVoltage === '34.5' ? '1000 MΩ' : '500 MΩ'}
              </strong>
            </p>
          </div>

          {/* BT - Masa */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 hover:border-blue-300 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label
                htmlFor="btmasa"
                className="text-sm font-bold text-slate-800 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                BT - Masa (Baja Tensión a Tierra / Tanque) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-500">
                Aislamiento devanado secundario a tierra
              </span>
            </div>
            
            <div className="relative">
              <input
                type="number"
                id="btmasa"
                required
                min="0"
                step="0.01"
                value={measurements.btmasa}
                onChange={(e) =>
                  onMeasurementsChange({
                    btmasa: e.target.value === '' ? '' : parseFloat(e.target.value),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder={isGOhm ? 'Ej. 0.68' : 'Ej. 680'}
              />
              <span className="absolute right-3.5 top-4 text-xs font-bold text-slate-500">
                {isGOhm ? 'GΩ' : 'MΩ'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Límite mínimo requerido:{' '}
              <strong className="text-slate-700">
                {transformer.primaryVoltage === '34.5' ? '500 MΩ' : '200 MΩ'}
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-lg py-4 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition duration-200 uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <Activity className="w-5 h-5" />
          <span>Evaluar Aislamiento Dieléctrico</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2"
          title="Limpiar formulario"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Limpiar</span>
        </button>
      </div>
    </form>
  );
};

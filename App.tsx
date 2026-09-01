import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TransformerForm } from './components/TransformerForm';
import { EvaluationResults } from './components/EvaluationResults';
import { WiringDiagrams } from './components/WiringDiagrams';
import { NormativeReferenceModal } from './components/NormativeReferenceModal';
import { TechnicalReportModal } from './components/TechnicalReportModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  TransformerData,
  MeggerMeasurements,
  EvaluationResult,
  PresetEvaluation,
} from './types';
import { evaluateTransformer } from './utils/meggerEvaluator';
import { ShieldCheck, Info } from 'lucide-react';

const INITIAL_TRANSFORMER: TransformerData = {
  tagNumber: '',
  capacityKva: 112.5,
  primaryVoltage: '13.2',
  secondaryVoltage: '220/127 V',
  insulationType: 'oil',
  temperatureC: 20,
  substation: '',
  technician: '',
  testDate: new Date().toISOString().split('T')[0],
  notes: '',
};

const INITIAL_MEASUREMENTS: MeggerMeasurements = {
  atbt: '',
  atmasa: '',
  btmasa: '',
  unit: 'MOhm',
  testVoltageHV: 2500,
  testVoltageLV: 1000,
  testDurationSeconds: 60,
};

const LOCAL_STORAGE_HISTORY_KEY = 'megger_evaluations_history_v1';

export const App: React.FC = () => {
  const [transformer, setTransformer] = useState<TransformerData>(INITIAL_TRANSFORMER);
  const [measurements, setMeasurements] = useState<MeggerMeasurements>(INITIAL_MEASUREMENTS);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);

  // Modals and Drawers
  const [isNormsOpen, setIsNormsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // History State
  const [history, setHistory] = useState<EvaluationResult[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  const handleTransformerChange = (patch: Partial<TransformerData>) => {
    setTransformer((prev) => ({ ...prev, ...patch }));
  };

  const handleMeasurementsChange = (patch: Partial<MeggerMeasurements>) => {
    setMeasurements((prev) => ({ ...prev, ...patch }));
  };

  // Submit & Evaluate
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      transformer.capacityKva === '' ||
      measurements.atbt === '' ||
      measurements.atmasa === '' ||
      measurements.btmasa === ''
    ) {
      return;
    }

    const evaluation = evaluateTransformer(transformer, measurements);
    setCurrentResult(evaluation);

    // Save to history (avoid duplicates at the top)
    setHistory((prev) => [evaluation, ...prev.slice(0, 49)]);

    // Smooth scroll to results
    setTimeout(() => {
      const resultEl = document.getElementById('resultadoCard');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Reset form
  const handleReset = () => {
    setTransformer(INITIAL_TRANSFORMER);
    setMeasurements(INITIAL_MEASUREMENTS);
    setCurrentResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load Preset
  const handleSelectPreset = (preset: PresetEvaluation) => {
    setTransformer((prev) => ({
      ...prev,
      ...preset.data.transformer,
    }));
    setMeasurements((prev) => ({
      ...prev,
      ...preset.data.measurements,
    }));

    // Auto evaluate preset for instant feedback
    const evaluation = evaluateTransformer(
      { ...transformer, ...preset.data.transformer } as TransformerData,
      { ...measurements, ...preset.data.measurements } as MeggerMeasurements
    );
    setCurrentResult(evaluation);

    setTimeout(() => {
      const resultEl = document.getElementById('resultadoCard');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Load from history
  const handleLoadEvaluation = (item: EvaluationResult) => {
    setTransformer(item.transformer);
    setMeasurements(item.measurements);
    setCurrentResult(item);
    setIsHistoryOpen(false);

    setTimeout(() => {
      const resultEl = document.getElementById('resultadoCard');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Está seguro de que desea borrar todo el historial de evaluaciones?')) {
      setHistory([]);
    }
  };

  const handleDeleteSingleHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        onOpenNorms={() => setIsNormsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        historyCount={history.length}
        hasResult={!!currentResult}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Hero Title and Subtitle */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Ingeniería Eléctrica y Subestaciones</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Evaluación de Aislamiento
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Diagnóstico técnico de pruebas Megger en frío para transformadores de distribución y potencia según normas IEEE C57.12.90 y NETA MTS.
          </p>
        </header>

        {/* Transformer Evaluation Form */}
        <TransformerForm
          transformer={transformer}
          measurements={measurements}
          onTransformerChange={handleTransformerChange}
          onMeasurementsChange={handleMeasurementsChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        {/* Evaluation Results (When submitted) */}
        {currentResult && (
          <EvaluationResults
            result={currentResult}
            onReset={handleReset}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

        {/* Wiring & Lead Connection Guide */}
        <WiringDiagrams />

        {/* Technical Footer Notes */}
        <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-200/80 space-y-1">
          <p className="font-semibold text-slate-600">
            MeggerX Transformer Diagnostics • Herramienta de Campo para Ingenieros y Técnicos Electricistas
          </p>
          <p>
            Criterios de evaluación basados en IEEE Std C57.12.90™, ANSI/NETA MTS y prácticas recomendadas de mantenimiento preventivo.
          </p>
        </footer>
      </main>

      {/* Modals & Drawers */}
      <NormativeReferenceModal
        isOpen={isNormsOpen}
        onClose={() => setIsNormsOpen(false)}
      />

      <TechnicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={currentResult}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadEvaluation={handleLoadEvaluation}
        onClearHistory={handleClearHistory}
        onDeleteSingle={handleDeleteSingleHistory}
      />
    </div>
  );
};

export default App;

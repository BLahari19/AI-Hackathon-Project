import React from 'react';
import { SimulationScenario } from '../types';
import { 
  Sliders, 
  Flame, 
  Truck, 
  ThermometerSnowflake, 
  Clock, 
  RotateCcw, 
  Zap,
  Sparkles
} from 'lucide-react';

interface ScenarioSimulatorProps {
  scenario: SimulationScenario;
  onUpdateScenario: (updated: Partial<SimulationScenario>) => void;
  onRunRebalance: () => void;
  isLoading: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  scenario,
  onUpdateScenario,
  onRunRebalance,
  isLoading,
}) => {
  const handleReset = () => {
    onUpdateScenario({
      festiveDemandMultiplier: 1.0,
      fuelPriceMultiplier: 1.0,
      blrColdStorageDisabled: false,
      strict10MinDeliverySla: false,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              Interactive What-If Scenario Lab
            </span>
            <span className="text-xs text-slate-500 font-medium">Real-Time Multi-Agent Adaptation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Stress Test NetworkIQ Agents</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Simulate festive demand surges, fuel price shocks, cold chain outages, or SLA changes to see how agents adapt.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Baseline
        </button>
      </div>

      {/* Control Sliders & Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Festive Demand Surge */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Festive / IPL Demand Surge</h3>
                <p className="text-[11px] text-slate-500">Simulates Diwali/IPL order volume spike</p>
              </div>
            </div>
            <span className="font-extrabold text-indigo-600 text-sm">
              {Math.round((scenario.festiveDemandMultiplier - 1) * 100)}% Surge ({scenario.festiveDemandMultiplier}x)
            </span>
          </div>

          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.1"
            value={scenario.festiveDemandMultiplier}
            onChange={(e) => onUpdateScenario({ festiveDemandMultiplier: parseFloat(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Baseline (1.0x)</span>
            <span>+50% Spike (1.5x)</span>
            <span>+100% Festive Surge (2.0x)</span>
          </div>
        </div>

        {/* Fuel Price / Logistics Hike */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Fuel & Freight Cost Hike</h3>
                <p className="text-[11px] text-slate-500">Increases inter-hub transport costs</p>
              </div>
            </div>
            <span className="font-extrabold text-blue-600 text-sm">
              +{Math.round((scenario.fuelPriceMultiplier - 1) * 100)}% Freight Cost ({scenario.fuelPriceMultiplier}x)
            </span>
          </div>

          <input
            type="range"
            min="1.0"
            max="1.5"
            step="0.05"
            value={scenario.fuelPriceMultiplier}
            onChange={(e) => onUpdateScenario({ fuelPriceMultiplier: parseFloat(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Normal Freight (1.0x)</span>
            <span>+25% Diesel Hike</span>
            <span>+50% Peak Freight</span>
          </div>
        </div>

        {/* Cold Storage Outage Toggle */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
                <ThermometerSnowflake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Bengaluru Cold Storage Outage</h3>
                <p className="text-[11px] text-slate-500">Simulates compressor failure at CFC-BLR</p>
              </div>
            </div>

            <button
              onClick={() => onUpdateScenario({ blrColdStorageDisabled: !scenario.blrColdStorageDisabled })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scenario.blrColdStorageDisabled
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {scenario.blrColdStorageDisabled ? 'CRITICAL OUTAGE ACTIVE' : 'Normal Operation'}
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            When active, agents strictly enforce 0 cold-chain shipments to Bengaluru CFC and divert chilled dairy items to Mumbai or Kolkata.
          </p>
        </div>

        {/* Strict 10-Min Delivery SLA */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Strict 10-Min Delivery Promise</h3>
                <p className="text-[11px] text-slate-500">Prioritizes dark store buffer stocks</p>
              </div>
            </div>

            <button
              onClick={() => onUpdateScenario({ strict10MinDeliverySla: !scenario.strict10MinDeliverySla })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                scenario.strict10MinDeliverySla
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {scenario.strict10MinDeliverySla ? 'STRICT SLA ENABLED' : 'Standard Buffer'}
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Forces agents to maintain higher safety stocks at Mumbai & Chennai quick-commerce dark stores to prevent "not deliverable" impressions.
          </p>
        </div>

      </div>

      {/* Recalculate CTA */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Apply Scenario & Re-run NetworkIQ AI
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Agents will re-negotiate stock transfers taking current scenario parameters into account.
          </p>
        </div>

        <button
          onClick={onRunRebalance}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Execute Scenario Rebalance</span>
        </button>
      </div>

    </div>
  );
};

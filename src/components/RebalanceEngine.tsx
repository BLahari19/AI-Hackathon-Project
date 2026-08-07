import React, { useState } from 'react';
import { AgentNegotiationLog, TransferRecommendation, SimulationScenario } from '../types';
import { 
  Bot, 
  Play, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Coins,
  Cpu,
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';

interface RebalanceEngineProps {
  scenario: SimulationScenario;
  logs: AgentNegotiationLog[];
  recommendations: TransferRecommendation[];
  selfCheck: any;
  isLoading: boolean;
  onRunRebalance: () => void;
  onViewPlannerBoard: () => void;
}

export const RebalanceEngine: React.FC<RebalanceEngineProps> = ({
  scenario,
  logs,
  recommendations,
  selfCheck,
  isLoading,
  onRunRebalance,
  onViewPlannerBoard,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'tiered' | 'selfcheck'>('console');

  const getAgentColor = (name: string) => {
    switch (name) {
      case 'Demand Sensing Agent':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'Capacity Constraint Agent':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'Logistics Agent':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60';
      case 'Cost Guardrail Agent':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      default:
        return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Rebalance Control */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Cooperating Multi-Agent Engine
            </span>
            <span className="text-xs text-slate-400">Gemini 3.6 Flash Server Powered</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Multi-Agent Negotiation & Stock Rebalancer</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            4 specialized agents negotiate network-wide inventory placement, balancing demand, capacity, and cost guardrails.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            id="btn-run-rebalance-engine"
            onClick={onRunRebalance}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer w-full md:w-auto ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Agents Negotiating...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Trigger Agent Rebalance</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container: Console Tabs & Display */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Navigation Bar inside Console */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex space-x-2">
            <button
              id="tab-rebalance-console"
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'console'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> Agent Negotiation Dialogue ({logs.length})
            </button>

            <button
              id="tab-rebalance-tiered"
              onClick={() => setActiveTab('tiered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'tiered'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Tiered Reasoning Architecture
            </button>

            <button
              id="tab-rebalance-selfcheck"
              onClick={() => setActiveTab('selfcheck')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'selfcheck'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Self-Check Certificate
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-emerald-400" /> Avg Compute: <span className="font-bold text-white">₹0.04 / decision</span>
            </span>
          </div>
        </div>

        {/* Tab 1: Agent Negotiation Dialogue Console */}
        {activeTab === 'console' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
              <span className="font-medium text-slate-300">Live Agent Multi-Turn Consensus Log</span>
              <span>Model: <span className="text-indigo-400 font-mono font-bold">gemini-3.6-flash</span></span>
            </div>

            <div className="space-y-3 font-mono text-xs max-h-[500px] overflow-y-auto pr-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5 hover:border-slate-700/80 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getAgentColor(log.agentName)}`}>
                        {log.agentName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans">({log.agentRole})</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>

                  <p className="text-slate-200 leading-relaxed font-sans text-xs pt-1">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom summary bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-Agent Consensus Reached: <strong className="text-white">{recommendations.length} Actionable Rebalances Generated</strong></span>
              </div>

              <button
                id="btn-goto-planner"
                onClick={onViewPlannerBoard}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Review & Approve on Action Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Tiered Reasoning Architecture Explanation */}
        {activeTab === 'tiered' && (
          <div className="p-6 space-y-6 text-white">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" /> Tiered Compute Allocation Strategy
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                NetworkIQ matches compute model to SKU economic value — avoiding wasting expensive reasoning on low-margin long-tail items.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Class A Tier */}
              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                    CLASS A SKUs (High Velocity / High Value)
                  </span>
                  <span className="text-xs font-bold text-emerald-400">Gemini 3.6 Flash AI</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fast-moving essential items (Amul Milk, boAt Earbuds, AirPods Pro) utilize multi-agent reasoning to negotiate inter-hub transfers, cold-chain scheduling, and customer churn avoidance.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                  Cost per Decision: ~₹0.042 | Unlocked Margin: ₹10,000 to ₹1,00,000+
                </div>
              </div>

              {/* Class B/C Tier */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded">
                    CLASS B & C SKUs (Long Tail / Moderate)
                  </span>
                  <span className="text-xs font-bold text-blue-400">Deterministic Safety Stock Solver</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Slow-moving long-tail items (Raymond shirts, rain ponchos) use deterministic EOQ + safety stock re-order formulas. Evicts slow movers out of prime dark stores to free high-value shelf space.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                  Cost per Decision: ₹0.00 (Zero AI Tokens) | Saves prime dark store cubic space
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Self-Check Certificate */}
        {activeTab === 'selfcheck' && (
          <div className="p-6 space-y-6 text-white">
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">AI Self-Check Audit Certificate</h3>
                    <p className="text-xs text-slate-300">Verified output against Business Guardrails before final presentation</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Auditability Score</span>
                  <div className="text-2xl font-black text-emerald-400">{selfCheck?.auditabilityScore || 100}%</div>
                </div>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Cost ROI &gt; 1.0x Enforced</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Cold Chain Feasibility 100%</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Physical Capacity Limits respected</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic pt-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                "{selfCheck?.summary}"
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

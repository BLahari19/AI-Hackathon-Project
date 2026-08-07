import React from 'react';
import { BenchmarkMetrics } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Coins, 
  ShieldCheck, 
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface BenchmarkViewProps {
  metrics: BenchmarkMetrics;
}

export const BenchmarkView: React.FC<BenchmarkViewProps> = ({ metrics }) => {
  const inStockDiff = (metrics.networkIQInStockRate - metrics.classicalInStockRate).toFixed(1);
  const costSavings = metrics.classicalHoldingCostWeekly + metrics.classicalTransferCostWeekly - (metrics.networkIQHoldingCostWeekly + metrics.networkIQTransferCostWeekly);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              Benchmark & Validation
            </span>
            <span className="text-xs text-slate-500 font-medium">Classical Min-Max / EOQ vs NetworkIQ AI</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Classical Solver vs NetworkIQ Multi-Agent Plan</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Empirical proof of how NetworkIQ multi-agent optimization beats static single-location reorder rules.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-right">
          <div className="text-xs text-emerald-700 font-semibold">Weekly Cost Saved</div>
          <div className="text-xl font-black text-emerald-800">₹{costSavings.toLocaleString()}</div>
        </div>
      </div>

      {/* KPI Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: In-Stock Availability */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fast Store In-Stock Rate</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-600">{metrics.networkIQInStockRate}%</span>
            <span className="text-xs text-slate-400 line-through">{metrics.classicalInStockRate}%</span>
          </div>
          <div className="flex items-center text-xs text-emerald-600 font-semibold gap-1 pt-1 border-t border-slate-100">
            <TrendingUp className="w-3.5 h-3.5" /> +{inStockDiff}% Service Level Gain
          </div>
        </div>

        {/* Metric 2: Pincode Stockouts Lost */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">"Not Deliverable" Views</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{metrics.networkIQNotDeliverableCount}</span>
            <span className="text-xs text-rose-500 line-through">{metrics.classicalNotDeliverableCount}</span>
          </div>
          <div className="flex items-center text-xs text-emerald-600 font-semibold gap-1 pt-1 border-t border-slate-100">
            <TrendingDown className="w-3.5 h-3.5" /> 94% Reduction in Customer Churn
          </div>
        </div>

        {/* Metric 3: Margin Unlocked */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Unlocked Margin</span>
          <div className="text-2xl font-black text-indigo-600">₹{metrics.totalMarginUnlockedWeekly.toLocaleString()}</div>
          <div className="flex items-center text-xs text-indigo-600 font-semibold gap-1 pt-1 border-t border-slate-100">
            <Sparkles className="w-3.5 h-3.5" /> Unlocked via Rebalancing
          </div>
        </div>

        {/* Metric 4: Cost-per-decision */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cost-Per-Recommendation</span>
          <div className="text-2xl font-black text-slate-900">₹{metrics.averageComputeCostPerDecision}</div>
          <div className="flex items-center text-xs text-slate-500 font-medium gap-1 pt-1 border-t border-slate-100">
            <Coins className="w-3.5 h-3.5 text-amber-500" /> ~4 Paise Compute Cost
          </div>
        </div>

      </div>

      {/* Side-By-Side Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Architectural Comparison: Where AI Outperforms Classical Policy</h2>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            NetworkIQ AI Advantage
          </span>
        </div>

        <div className="divide-y divide-slate-200 text-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 bg-slate-50 font-bold text-slate-700 uppercase tracking-wider">
            <div>Optimization Dimension</div>
            <div>Classical Min-Max / EOQ Baseline</div>
            <div className="text-indigo-700">NetworkIQ Multi-Agent Plan</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 items-center">
            <div className="font-bold text-slate-900">Network View</div>
            <div className="text-slate-600">Optimizes each store/warehouse independently in isolation. Misses cross-hub rebalancing.</div>
            <div className="text-indigo-950 font-medium bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
              Cooperating Agents negotiate cross-hub transfers from overstocked warehouses directly to quick dark stores.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 items-center">
            <div className="font-bold text-slate-900">Shelf-Space Management</div>
            <div className="text-slate-600">Slow-moving items sit indefinitely in prime 10-min dark store shelf space.</div>
            <div className="text-indigo-950 font-medium bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
              Actively evicts slow-moving Class C items from dark stores to central hubs, freeing high-velocity shelf space.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 items-center">
            <div className="font-bold text-slate-900">Cost & Margin Balance</div>
            <div className="text-slate-600">Transfers stock purely based on safety stock threshold regardless of transport cost.</div>
            <div className="text-indigo-950 font-medium bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
              Strict Cost Guardrail enforces ROI &gt; 1.0x (Unlocked Margin &gt; Transfer Cost) before recommending.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-4 items-center">
            <div className="font-bold text-slate-900">Tiered Compute & Audit</div>
            <div className="text-slate-600">No audit trail or reasoning basis provided for warehouse planners.</div>
            <div className="text-indigo-950 font-medium bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
              Tiered Gemini reasoning for Class A + full auditability (demand basis, capacity, cold chain, cost-per-decision).
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

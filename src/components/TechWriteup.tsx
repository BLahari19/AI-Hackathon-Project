import React from 'react';
import { 
  FileText, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  GitBranch, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Terminal,
  Server,
  Zap
} from 'lucide-react';

export const TechWriteup: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Hackathon Technical Writeup & Business Pitch
          </span>
          <span className="text-xs text-slate-400">NetworkIQ • Student Track</span>
        </div>
        <h1 className="text-2xl font-black text-white">NetworkIQ Technical Architecture & Business Deck</h1>
        <p className="text-xs text-slate-300">
          Multi-Agent Smart Inventory Placement & Stock Rebalancing Network for Modern Indian Retail.
        </p>
      </div>

      {/* 1. Architecture Diagram & Workflow */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Server className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">1. System Architecture & AI Workflow</h2>
        </div>

        {/* Visual Flow diagram */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold block">1. Frontend React App</span>
              <span className="text-[11px] text-slate-400">Topology Map, Action Board & What-If Lab</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-blue-400 font-bold block">2. Express Server</span>
              <span className="text-[11px] text-slate-400">Server-Side Proxy & @google/genai SDK</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">3. Multi-Agent Engine</span>
              <span className="text-[11px] text-slate-400">Gemini 3.6 Flash Multi-Agent Debate</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">4. Guardrails & Audit</span>
              <span className="text-[11px] text-slate-400">ROI &gt; 1.0x, Cold Chain & Planner Approval</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" /> Cooperating Agent Roles
            </h3>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li><strong>Demand Sensing Agent:</strong> Monitors pincode stockouts & delivery SLA breaches.</li>
              <li><strong>Capacity Constraint Agent:</strong> Manages hub physical space & evicts slow Class C items.</li>
              <li><strong>Logistics Agent:</strong> Optimizes inter-location routes, reefer trucks & transit lead times.</li>
              <li><strong>Cost Guardrail Agent:</strong> Verifies ROI &gt; 1.0x (Unlocked Margin &gt; Transport Cost).</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" /> Tiered Compute Allocation
            </h3>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li><strong>Class A High Velocity SKUs:</strong> Gemini 3.6 Flash reasoning (~₹0.042 / decision).</li>
              <li><strong>Class B & C Long Tail SKUs:</strong> Classical deterministic safety stock solver (0 token cost).</li>
              <li><strong>Self-Check Gate:</strong> Validates 100% cold-chain & space feasibility before presentation.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Business Pitch Deck */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">2. Business Pitch & Value Proposition</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 space-y-1">
            <span className="font-bold text-rose-800 uppercase tracking-wider text-[10px]">The Problem</span>
            <h4 className="font-bold text-slate-900 text-sm">Fragmented Network Sub-optimization</h4>
            <p className="text-slate-600 leading-relaxed">
              Fast-moving essentials sit 2 days away in regional warehouses while prime 10-min dark stores hold slow-moving apparel. Isolated teams optimize per-location without network-wide ROI awareness.
            </p>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 space-y-1">
            <span className="font-bold text-indigo-800 uppercase tracking-wider text-[10px]">The Solution</span>
            <h4 className="font-bold text-slate-900 text-sm">NetworkIQ Multi-Agent Rebalancer</h4>
            <p className="text-slate-600 leading-relaxed">
              Cooperating AI agents negotiate stock transfers between Indian hubs, balancing demand signals, dark store capacity, cold chain rules, and transport costs with human planner sign-off.
            </p>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">Business ROI</span>
            <h4 className="font-bold text-slate-900 text-sm">Immediate Financial Impact</h4>
            <p className="text-slate-600 leading-relaxed">
              +18.8% In-Stock Rate at 10-min stores, 94% stockout reduction, ₹1,67,000 weekly holding+transfer savings. AI compute cost is just ₹0.04 per decision!
            </p>
          </div>
        </div>
      </div>

      {/* 3. Setup & Execution Instructions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Terminal className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">3. Repository Setup & Tech Stack</h2>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl text-slate-200 font-mono text-xs space-y-2">
          <p className="text-slate-400"># Clone repo & install dependencies</p>
          <p className="text-emerald-400">npm install</p>
          <p className="text-slate-400"># Configure environment variables in .env</p>
          <p className="text-indigo-300">GEMINI_API_KEY="YOUR_GEMINI_API_KEY"</p>
          <p className="text-slate-400"># Launch full-stack Express + Vite application</p>
          <p className="text-emerald-400">npm run dev</p>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-600">
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Stack: React 19, Express, TypeScript, Tailwind CSS v4, Gemini 3.6 Flash SDK
          </span>
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { TransferRecommendation } from '../types';
import { 
  CheckSquare, 
  Check, 
  X, 
  Edit3, 
  AlertCircle, 
  ShieldAlert, 
  ChevronRight, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Info,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';

interface PlannerBoardProps {
  recommendations: TransferRecommendation[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOverride: (id: string, newQty: number) => void;
  onApproveAll: () => void;
}

export const PlannerBoard: React.FC<PlannerBoardProps> = ({
  recommendations,
  onApprove,
  onReject,
  onOverride,
  onApproveAll,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'signoff'>('pending');
  const [selectedRecForAudit, setSelectedRecForAudit] = useState<TransferRecommendation | null>(null);
  const [overrideInputId, setOverrideInputId] = useState<string | null>(null);
  const [overrideQtyVal, setOverrideQtyVal] = useState<number>(0);

  const pendingCount = recommendations.filter((r) => r.status === 'pending').length;
  const signoffRequiredCount = recommendations.filter((r) => r.requiresPlannerSignoff && r.status === 'pending').length;

  const filtered = recommendations.filter((rec) => {
    if (activeFilter === 'pending') return rec.status === 'pending';
    if (activeFilter === 'approved') return rec.status === 'approved';
    if (activeFilter === 'signoff') return rec.requiresPlannerSignoff && rec.status === 'pending';
    return true;
  });

  const handleStartOverride = (rec: TransferRecommendation) => {
    setOverrideInputId(rec.id);
    setOverrideQtyVal(rec.overrideQuantity || rec.quantity);
  };

  const handleSaveOverride = (id: string) => {
    onOverride(id, overrideQtyVal);
    setOverrideInputId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 rounded-md border border-amber-200 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Human-in-the-Loop Sign-off
            </span>
            <span className="text-xs text-slate-500 font-medium">Bulk Approval Threshold: &gt; ₹10,000 Value</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Planner Approval & Action Board</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Review, audit, or override AI-recommended inter-location stock transfers before warehouse execution.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {pendingCount > 0 && (
            <button
              id="btn-approve-all-planner"
              onClick={onApproveAll}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer w-full md:w-auto justify-center"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve All Pending ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            id="filter-pending"
            onClick={() => setActiveFilter('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'pending'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Review ({pendingCount})
          </button>

          <button
            id="filter-signoff"
            onClick={() => setActiveFilter('signoff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'signoff'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Mandatory Signoff ({signoffRequiredCount})
          </button>

          <button
            id="filter-approved"
            onClick={() => setActiveFilter('approved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Approved Plans
          </button>

          <button
            id="filter-all"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({recommendations.length})
          </button>
        </div>
      </div>

      {/* Recommendation Cards / List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">All Rebalance Recommendations Handled</h3>
            <p className="text-xs text-slate-500 mt-1">No pending stock transfers matching the selected filter.</p>
          </div>
        ) : (
          filtered.map((rec) => {
            const isEditing = overrideInputId === rec.id;
            const currentQty = rec.overrideQuantity || rec.quantity;

            return (
              <div
                key={rec.id}
                id={`rec-card-${rec.id}`}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs ${
                  rec.requiresPlannerSignoff
                    ? 'border-amber-300 ring-1 ring-amber-400/30'
                    : rec.status === 'approved'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  
                  {/* Left Column: SKU & Route */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.velocityClass === 'A' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        Class {rec.velocityClass}
                      </span>

                      <h3 className="text-sm font-bold text-slate-900">{rec.skuName}</h3>

                      {rec.requiresPlannerSignoff && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-600" /> High Value Signoff Required
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        {rec.reasoningType}
                      </span>
                    </div>

                    {/* Route Flow */}
                    <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="font-semibold text-slate-900">{rec.fromNodeName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-slate-900">{rec.toNodeName}</span>
                      <span className="text-slate-400">|</span>
                      <span className="font-bold text-indigo-600">
                        {currentQty} Units {rec.overrideQuantity && <span className="text-amber-600">(Overridden)</span>}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Cost & Margin Metrics */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center text-xs min-w-[280px]">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Transfer Cost</span>
                      <p className="font-bold text-slate-800">₹{rec.transferCostTotal.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Unlocked Margin</span>
                      <p className="font-bold text-emerald-600">₹{rec.marginUnlockedTotal.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">ROI Ratio</span>
                      <p className="font-extrabold text-indigo-600">{rec.roiRatio}x</p>
                    </div>
                  </div>

                  {/* Right Column: Action Controls */}
                  <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
                    
                    {/* Audit Trail Button */}
                    <button
                      id={`btn-audit-${rec.id}`}
                      onClick={() => setSelectedRecForAudit(rec)}
                      className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Audit Trail</span>
                    </button>

                    {rec.status === 'pending' ? (
                      <>
                        {isEditing ? (
                          <div className="flex items-center space-x-1 bg-amber-50 p-1 rounded-lg border border-amber-200">
                            <input
                              type="number"
                              value={overrideQtyVal}
                              onChange={(e) => setOverrideQtyVal(Number(e.target.value))}
                              className="w-16 px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveOverride(rec.id)}
                              className="p-1 bg-amber-600 text-white rounded text-xs font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`btn-override-${rec.id}`}
                            onClick={() => handleStartOverride(rec)}
                            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                            title="Override Quantity"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          id={`btn-reject-${rec.id}`}
                          onClick={() => onReject(rec.id)}
                          className="px-3 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all cursor-pointer"
                        >
                          Reject
                        </button>

                        <button
                          id={`btn-approve-${rec.id}`}
                          onClick={() => onApprove(rec.id)}
                          className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        rec.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rec.status.toUpperCase()}
                      </span>
                    )}

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Audit Trail Modal / Drawer */}
      {selectedRecForAudit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                  Auditability & Cost-Benefit Record
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedRecForAudit.skuName}</h3>
                <p className="text-xs text-slate-500">
                  {selectedRecForAudit.fromNodeName} → {selectedRecForAudit.toNodeName} ({selectedRecForAudit.quantity} Units)
                </p>
              </div>

              <button
                onClick={() => setSelectedRecForAudit(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audit Trail Cards */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. Demand Basis & Pincode Signal</span>
                <p className="text-slate-600 leading-relaxed">{selectedRecForAudit.auditTrail.demandBasis}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">2. Capacity & Shelf Space Feasibility</span>
                <p className="text-slate-600 leading-relaxed">{selectedRecForAudit.auditTrail.capacityFeasibilityCheck}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">3. Cost Tradeoff & Margin Unlocked</span>
                <p className="text-slate-600 leading-relaxed">{selectedRecForAudit.auditTrail.costTradeoffAnalysis}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">4. Cold Chain & Storage Constraints</span>
                <p className="text-slate-600 leading-relaxed">{selectedRecForAudit.auditTrail.coldChainCheck}</p>
              </div>

              <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-200 text-indigo-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Cost-Per-Recommendation</span>
                  <span className="text-[11px] text-indigo-700">AI Compute (Gemini Flash) + Operation</span>
                </div>
                <div className="text-right font-black text-sm text-indigo-700">
                  ₹{selectedRecForAudit.auditTrail.costPerDecision}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecForAudit(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Audit Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { TopologyMap } from './components/TopologyMap';
import { RebalanceEngine } from './components/RebalanceEngine';
import { PlannerBoard } from './components/PlannerBoard';
import { BenchmarkView } from './components/BenchmarkView';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { TechWriteup } from './components/TechWriteup';

import { 
  INITIAL_FULFILLMENT_NODES, 
  SKUS, 
  INITIAL_INVENTORY, 
  INTER_NODE_ROUTES, 
  INITIAL_BENCHMARK_METRICS 
} from './data/indianStoreData';

import { 
  FulfillmentNode, 
  NodeInventory, 
  TransferRecommendation, 
  AgentNegotiationLog, 
  SimulationScenario, 
  BenchmarkMetrics 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('topology');
  const [nodes, setNodes] = useState<FulfillmentNode[]>(INITIAL_FULFILLMENT_NODES);
  const [inventory, setInventory] = useState<NodeInventory[]>(INITIAL_INVENTORY);
  const [recommendations, setRecommendations] = useState<TransferRecommendation[]>([]);
  const [logs, setLogs] = useState<AgentNegotiationLog[]>([]);
  const [selfCheck, setSelfCheck] = useState<any>(null);
  const [benchmarkMetrics, setBenchmarkMetrics] = useState<BenchmarkMetrics>(INITIAL_BENCHMARK_METRICS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [scenario, setScenario] = useState<SimulationScenario>({
    festiveDemandMultiplier: 1.0,
    fuelPriceMultiplier: 1.0,
    blrColdStorageDisabled: false,
    strict10MinDeliverySla: false,
  });

  // Automatically trigger initial AI rebalance on load
  useEffect(() => {
    runRebalance();
  }, []);

  const runRebalance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/rebalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes,
          skus: SKUS,
          inventory,
          routes: INTER_NODE_ROUTES,
          scenario,
        }),
      });

      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
      if (data.logs) {
        setLogs(data.logs);
      }
      if (data.selfCheck) {
        setSelfCheck(data.selfCheck);
      }
    } catch (err) {
      console.error('Error running AI rebalance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateScenario = (updated: Partial<SimulationScenario>) => {
    setScenario((prev) => ({ ...prev, ...updated }));
  };

  const handleApprove = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'approved' } : rec))
    );
  };

  const handleReject = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'rejected' } : rec))
    );
  };

  const handleOverride = (id: string, newQty: number) => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec;
        const unitRatio = newQty / rec.quantity;
        return {
          ...rec,
          overrideQuantity: newQty,
          status: 'overridden',
          transferCostTotal: Math.round(rec.transferCostTotal * unitRatio),
          marginUnlockedTotal: Math.round(rec.marginUnlockedTotal * unitRatio),
          netProfitGain: Math.round((rec.marginUnlockedTotal - rec.transferCostTotal) * unitRatio),
        };
      })
    );
  };

  const handleApproveAll = () => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.status === 'pending' ? { ...rec, status: 'approved' } : rec))
    );
  };

  const pendingApprovalsCount = recommendations.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-16">
      
      {/* Header & Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'topology' && (
          <TopologyMap
            nodes={nodes}
            inventory={inventory}
            skus={SKUS}
            onTriggerRebalance={() => {
              setActiveTab('rebalance');
              runRebalance();
            }}
          />
        )}

        {activeTab === 'rebalance' && (
          <RebalanceEngine
            scenario={scenario}
            logs={logs}
            recommendations={recommendations}
            selfCheck={selfCheck}
            isLoading={isLoading}
            onRunRebalance={runRebalance}
            onViewPlannerBoard={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerBoard
            recommendations={recommendations}
            onApprove={handleApprove}
            onReject={handleReject}
            onOverride={handleOverride}
            onApproveAll={handleApproveAll}
          />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkView metrics={benchmarkMetrics} />
        )}

        {activeTab === 'scenario' && (
          <ScenarioSimulator
            scenario={scenario}
            onUpdateScenario={handleUpdateScenario}
            onRunRebalance={() => {
              runRebalance();
              setActiveTab('rebalance');
            }}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'pitch' && (
          <TechWriteup />
        )}
      </main>

    </div>
  );
}

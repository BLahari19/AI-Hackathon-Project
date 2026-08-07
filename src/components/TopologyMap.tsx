import React, { useState } from 'react';
import { FulfillmentNode, NodeInventory, SKU } from '../types';
import { 
  Building2, 
  Store, 
  Warehouse, 
  Truck, 
  ThermometerSnowflake, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  TrendingUp, 
  Clock, 
  MapPin,
  Search,
  Zap
} from 'lucide-react';

interface TopologyMapProps {
  nodes: FulfillmentNode[];
  inventory: NodeInventory[];
  skus: SKU[];
  onTriggerRebalance: () => void;
}

export const TopologyMap: React.FC<TopologyMapProps> = ({ nodes, inventory, skus, onTriggerRebalance }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('QDS-MUM');
  const [skuFilter, setSkuFilter] = useState<string>('');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Compute total stockout events across network
  const totalStockouts = inventory.reduce((sum, item) => sum + item.recentStockouts, 0);

  // Get inventory items for selected node
  const nodeInventoryItems = inventory.filter((item) => item.nodeId === selectedNode.id);

  const filteredInventoryItems = nodeInventoryItems.filter((item) => {
    const sku = skus.find((s) => s.id === item.skuId);
    if (!sku) return false;
    return (
      sku.name.toLowerCase().includes(skuFilter.toLowerCase()) ||
      sku.category.toLowerCase().includes(skuFilter.toLowerCase()) ||
      sku.velocityClass.toLowerCase().includes(skuFilter.toLowerCase())
    );
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'RWH':
        return Warehouse;
      case 'CFC':
        return Building2;
      case 'QDS':
        return Store;
      case 'SWH':
        return Truck;
      default:
        return Building2;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              India Network Live View
            </span>
            <span className="text-xs text-slate-500 font-medium">5 Active Nodes • 15 SKUs • 3 Velocity Classes</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Fulfillment Network Topology & Stock Health</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time capacity utilization, cold-chain status, and pincode stockout risks across Indian hubs.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-right flex-1 md:flex-none">
            <div className="text-xs text-rose-600 font-medium flex items-center justify-end gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Pincode Stockouts
            </div>
            <div className="text-lg font-bold text-rose-700">{totalStockouts} Views Lost</div>
          </div>

          <button
            id="btn-run-rebalance-banner"
            onClick={onTriggerRebalance}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Run AI Rebalance</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Network Hub Map & Selected Node Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Network Hub Cards & Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Fulfillment Hubs & Dark Stores</h2>
            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Selected</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Critical Stockout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nodes.map((node) => {
              const NodeIcon = getNodeIcon(node.type);
              const isSelected = selectedNodeId === node.id;
              
              // Calculate node stockout count
              const nodeItems = inventory.filter((i) => i.nodeId === node.id);
              const nodeStockouts = nodeItems.reduce((s, i) => s + i.recentStockouts, 0);
              const usedPct = Math.round((node.usedCapacityUnits / node.capacityUnits) * 100);

              return (
                <div
                  key={node.id}
                  id={`node-card-${node.id}`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`bg-white rounded-xl p-4 border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Top Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <NodeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{node.name}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" /> {node.city} • <span className="font-semibold text-slate-700">{node.typeLabel}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery SLA & Holding Cost */}
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> {node.deliverySla}
                    </span>
                    <span className="text-slate-500 font-medium">
                      ₹{node.holdingCostPerUnitDay}/unit/day
                    </span>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Capacity Utilization</span>
                      <span className="font-bold">{usedPct}% ({node.usedCapacityUnits.toLocaleString()} / {node.capacityUnits.toLocaleString()})</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          usedPct > 90 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Badges: Cold Storage & Stockout Alert */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {node.coldStorageAvailable ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
                          <ThermometerSnowflake className="w-3 h-3" /> Cold Chain ({node.usedColdStorageUnits}/{node.coldStorageCapacityUnits})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                          Ambient Storage Only
                        </span>
                      )}
                    </div>

                    {nodeStockouts > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> {nodeStockouts} Stockouts
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Balanced
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* India Regional Network Flow Diagram Visual */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Inter-Hub Connectivity Network</h3>
              <span className="text-[11px] text-slate-400">Reefer Truck & Bike Courier Lanes</span>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <p className="font-bold text-amber-400">Delhi RWH</p>
                <p className="text-[10px] text-slate-400">Hub Buffer</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <p className="font-bold text-blue-400">Mumbai QDS</p>
                <p className="text-[10px] text-slate-400">10-Min Store</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <p className="font-bold text-indigo-400">BLR CFC</p>
                <p className="text-[10px] text-slate-400">Urban Hub</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <p className="font-bold text-teal-400">Chennai QDS</p>
                <p className="text-[10px] text-slate-400">15-Min Store</p>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <p className="font-bold text-purple-400">Kolkata SWH</p>
                <p className="text-[10px] text-slate-400">Seller Hub</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Breakdown for Selected Hub */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Node Inspector
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">{selectedNode.name}</h2>
              <p className="text-xs text-slate-500">{selectedNode.city} • {selectedNode.typeLabel}</p>
            </div>
            
            <div className="text-right">
              <span className="text-xs text-slate-500">Node Stock Health</span>
              <div className="text-sm font-bold text-slate-800">
                {selectedNode.usedCapacityUnits.toLocaleString()} / {selectedNode.capacityUnits.toLocaleString()} Units
              </div>
            </div>
          </div>

          {/* Search SKU input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search SKUs in this node..."
              value={skuFilter}
              onChange={(e) => setSkuFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SKU Inventory List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredInventoryItems.map((inv) => {
              const sku = skus.find((s) => s.id === inv.skuId);
              if (!sku) return null;

              const isCritical = inv.recentStockouts > 0;
              const isOverstocked = inv.currentStock > inv.optimalStock * 2;

              return (
                <div
                  key={inv.skuId}
                  className={`p-3 rounded-xl border transition-all ${
                    isCritical
                      ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-300'
                      : isOverstocked
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          sku.velocityClass === 'A' ? 'bg-indigo-100 text-indigo-700' :
                          sku.velocityClass === 'B' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          Class {sku.velocityClass}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{sku.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{sku.category} • Margin: ₹{sku.margin}</p>
                    </div>

                    {isCritical ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        {inv.recentStockouts} Stockouts
                      </span>
                    ) : isOverstocked ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Overstocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Optimal
                      </span>
                    )}
                  </div>

                  {/* Stock Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">On Hand</span>
                      <p className="text-xs font-bold text-slate-800">{inv.currentStock} Units</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Target Opt</span>
                      <p className="text-xs font-semibold text-slate-600">{inv.optimalStock} Units</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Daily Demand</span>
                      <p className="text-xs font-semibold text-indigo-600">{inv.dailyDemand} Units/day</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

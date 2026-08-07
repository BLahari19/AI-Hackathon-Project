export type VelocityClass = 'A' | 'B' | 'C';
export type NodeType = 'RWH' | 'CFC' | 'QDS' | 'SWH';

export interface FulfillmentNode {
  id: string;
  name: string;
  city: string;
  region: string;
  type: NodeType;
  typeLabel: string;
  capacityUnits: number;
  usedCapacityUnits: number;
  coldStorageAvailable: boolean;
  coldStorageCapacityUnits: number;
  usedColdStorageUnits: number;
  holdingCostPerUnitDay: number; // in ₹
  deliverySla: string; // e.g., "10 mins", "2 hours", "Next day"
  coordinates: { x: number; y: number }; // For map visual
}

export interface SKU {
  id: string;
  name: string;
  category: string;
  velocityClass: VelocityClass;
  price: number; // in ₹
  margin: number; // in ₹
  requiresColdChain: boolean;
  unitVolumeCc: number; // cubic units
  unitWeightKg: number;
  perishabilityDays?: number;
  description: string;
}

export interface NodeInventory {
  nodeId: string;
  skuId: string;
  currentStock: number;
  optimalStock: number;
  dailyDemand: number;
  safetyStock: number;
  recentStockouts: number; // count of "Not Deliverable" customer views
}

export interface InterNodeRoute {
  fromNodeId: string;
  toNodeId: string;
  distanceKm: number;
  leadTimeHours: number;
  costPerUnit: number; // in ₹
  refrigeratedCostPerUnit: number; // in ₹
  transitType: 'Bike Express' | 'Mini-Truck' | 'Cold-Chain Reefer' | 'Heavy Freight';
}

export interface TransferRecommendation {
  id: string;
  skuId: string;
  skuName: string;
  velocityClass: VelocityClass;
  fromNodeId: string;
  fromNodeName: string;
  toNodeId: string;
  toNodeName: string;
  quantity: number;
  transferCostTotal: number; // in ₹
  marginUnlockedTotal: number; // in ₹
  netProfitGain: number; // in ₹
  roiRatio: number;
  requiresPlannerSignoff: boolean; // true if value > ₹10,000 or high impact
  status: 'pending' | 'approved' | 'rejected' | 'overridden';
  overrideQuantity?: number;
  auditTrail: {
    demandBasis: string;
    capacityFeasibilityCheck: string;
    costTradeoffAnalysis: string;
    coldChainCheck: string;
    costPerDecision: number; // in ₹ (AI compute cost ~ ₹0.04 + operational)
  };
  reasoningType: 'Gemini AI Multi-Agent' | 'Deterministic Safety Stock';
}

export interface AgentNegotiationLog {
  timestamp: string;
  agentName: 'Demand Sensing Agent' | 'Capacity Constraint Agent' | 'Logistics Agent' | 'Cost Guardrail Agent' | 'Network Orchestrator';
  agentRole: string;
  skuId?: string;
  message: string;
  type: 'info' | 'proposal' | 'constraint' | 'approval' | 'rejection';
}

export interface BenchmarkMetrics {
  classicalInStockRate: number; // %
  networkIQInStockRate: number; // %
  classicalHoldingCostWeekly: number; // ₹
  networkIQHoldingCostWeekly: number; // ₹
  classicalTransferCostWeekly: number; // ₹
  networkIQTransferCostWeekly: number; // ₹
  classicalNotDeliverableCount: number;
  networkIQNotDeliverableCount: number;
  totalMarginUnlockedWeekly: number; // ₹
  averageComputeCostPerDecision: number; // ₹
}

export interface SimulationScenario {
  festiveDemandMultiplier: number; // e.g. 1.0 to 2.0
  fuelPriceMultiplier: number; // e.g. 1.0 to 1.5
  blrColdStorageDisabled: boolean;
  strict10MinDeliverySla: boolean;
}

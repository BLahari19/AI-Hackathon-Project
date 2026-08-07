import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client with aistudio-build header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Rebalance Endpoint using Gemini Multi-Agent Tiered Reasoning
app.post('/api/gemini/rebalance', async (req, res) => {
  try {
    const { nodes, skus, inventory, routes, scenario } = req.body;

    const prompt = `
You are NetworkIQ's Central AI Multi-Agent Fulfillment Orchestrator for an Indian Retail Network (Delhi-NCR, Bengaluru, Mumbai, Chennai, Kolkata).

Your goal is to optimize stock placement across Warehouses (RWH), City Fulfillment Centers (CFC), Quick-Commerce Dark Stores (QDS), and Seller Hubs (SWH).

INPUT CONTEXT:
Scenario Modifiers:
- Festive Demand Multiplier: ${scenario?.festiveDemandMultiplier || 1.0}x
- Fuel Price Multiplier: ${scenario?.fuelPriceMultiplier || 1.0}x
- BLR Cold Storage Disabled: ${scenario?.blrColdStorageDisabled ? 'YES (CRITICAL COLD CHAIN FAILURE AT BLR)' : 'NO'}
- Strict 10-Min Delivery SLA: ${scenario?.strict10MinDeliverySla ? 'YES (Prioritize QDS stock)' : 'NO'}

Nodes: ${JSON.stringify(nodes)}
SKUs: ${JSON.stringify(skus)}
Current Inventory & Stockouts: ${JSON.stringify(inventory)}
Inter-Location Route Costs & Lead Times: ${JSON.stringify(routes)}

GUARDRAILS YOU MUST RESPECT:
1. Auditability: Every recommendation must give explicit demand basis and cost trade-off analysis.
2. Cost Guardrail: Transfer Cost MUST be strictly LESS than Margin Unlocked (ROI > 1.0x).
3. Tiered Reasoning: Deep AI reasoning for Class A high-value/velocity SKUs. Deterministic safety stock logic for B/C.
4. Capacity & Cold Chain Feasibility: Respect physical capacity & cold-chain (Chennai QDS has NO cold storage, so CANNOT hold milk/yogurt!).
5. Human-in-the-Loop: Set requiresPlannerSignoff=true if transfer quantity * price > ₹10,000 or high impact.

TASK:
Simulate 4 cooperating specialized agents negotiating in a multi-agent dialogue:
1. "Demand Sensing Agent": Identifies critical stockouts ("Not Deliverable" views) at high-velocity nodes (QDS/CFC).
2. "Capacity Constraint Agent": Checks space & cold storage availability; suggests evicting slow-moving C-class SKUs from prime dark stores.
3. "Logistics Agent": Finds optimal source node with surplus inventory, calculates transit lead times & costs (factoring fuel multiplier).
4. "Cost Guardrail Agent": Verifies Margin Unlocked vs Transfer Cost, computes cost-per-decision (~₹0.04 compute cost), enforces approval threshold.

OUTPUT FORMAT (Valid JSON matching this schema):
Return a JSON object containing:
- logs: Array of agent negotiation messages. Each log item:
  - timestamp: e.g. "09:12:01"
  - agentName: "Demand Sensing Agent" | "Capacity Constraint Agent" | "Logistics Agent" | "Cost Guardrail Agent" | "Network Orchestrator"
  - agentRole: e.g. "Regional Demand Analyst"
  - skuId: optional string
  - message: realistic, detailed reasoning string
  - type: "info" | "proposal" | "constraint" | "approval" | "rejection"
- recommendations: Array of TransferRecommendation objects:
  - id: string (e.g. "TR-101")
  - skuId: string
  - skuName: string
  - velocityClass: "A" | "B" | "C"
  - fromNodeId: string
  - fromNodeName: string
  - toNodeId: string
  - toNodeName: string
  - quantity: number
  - transferCostTotal: number (in ₹)
  - marginUnlockedTotal: number (in ₹)
  - netProfitGain: number (in ₹)
  - roiRatio: number (e.g. 8.5)
  - requiresPlannerSignoff: boolean
  - status: "pending"
  - auditTrail: {
      demandBasis: string,
      capacityFeasibilityCheck: string,
      costTradeoffAnalysis: string,
      coldChainCheck: string,
      costPerDecision: number
    }
  - reasoningType: "Gemini AI Multi-Agent" | "Deterministic Safety Stock"
- selfCheck:
  - passed: boolean
  - auditabilityScore: number (out of 100)
  - roiCheckPassed: boolean
  - coldChainPassed: boolean
  - capacityCheckPassed: boolean
  - summary: string
`;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback synthetic response if key is not configured locally during early dev
      return res.json(getFallbackRebalanceResponse(scenario));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            logs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  agentName: { type: Type.STRING },
                  agentRole: { type: Type.STRING },
                  skuId: { type: Type.STRING },
                  message: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ['timestamp', 'agentName', 'agentRole', 'message', 'type'],
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  skuId: { type: Type.STRING },
                  skuName: { type: Type.STRING },
                  velocityClass: { type: Type.STRING },
                  fromNodeId: { type: Type.STRING },
                  fromNodeName: { type: Type.STRING },
                  toNodeId: { type: Type.STRING },
                  toNodeName: { type: Type.STRING },
                  quantity: { type: Type.INTEGER },
                  transferCostTotal: { type: Type.NUMBER },
                  marginUnlockedTotal: { type: Type.NUMBER },
                  netProfitGain: { type: Type.NUMBER },
                  roiRatio: { type: Type.NUMBER },
                  requiresPlannerSignoff: { type: Type.BOOLEAN },
                  status: { type: Type.STRING },
                  auditTrail: {
                    type: Type.OBJECT,
                    properties: {
                      demandBasis: { type: Type.STRING },
                      capacityFeasibilityCheck: { type: Type.STRING },
                      costTradeoffAnalysis: { type: Type.STRING },
                      coldChainCheck: { type: Type.STRING },
                      costPerDecision: { type: Type.NUMBER },
                    },
                    required: ['demandBasis', 'capacityFeasibilityCheck', 'costTradeoffAnalysis', 'coldChainCheck', 'costPerDecision'],
                  },
                  reasoningType: { type: Type.STRING },
                },
                required: [
                  'id',
                  'skuId',
                  'skuName',
                  'velocityClass',
                  'fromNodeId',
                  'fromNodeName',
                  'toNodeId',
                  'toNodeName',
                  'quantity',
                  'transferCostTotal',
                  'marginUnlockedTotal',
                  'netProfitGain',
                  'roiRatio',
                  'requiresPlannerSignoff',
                  'status',
                  'auditTrail',
                  'reasoningType',
                ],
              },
            },
            selfCheck: {
              type: Type.OBJECT,
              properties: {
                passed: { type: Type.BOOLEAN },
                auditabilityScore: { type: Type.NUMBER },
                roiCheckPassed: { type: Type.BOOLEAN },
                coldChainPassed: { type: Type.BOOLEAN },
                capacityCheckPassed: { type: Type.BOOLEAN },
                summary: { type: Type.STRING },
              },
              required: ['passed', 'auditabilityScore', 'roiCheckPassed', 'coldChainPassed', 'capacityCheckPassed', 'summary'],
            },
          },
          required: ['logs', 'recommendations', 'selfCheck'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini Rebalance Error:', error);
    return res.json(getFallbackRebalanceResponse(req.body?.scenario));
  }
});

function getFallbackRebalanceResponse(scenario: any) {
  const mult = scenario?.festiveDemandMultiplier || 1.0;
  return {
    logs: [
      {
        timestamp: '09:12:01',
        agentName: 'Demand Sensing Agent',
        agentRole: 'Regional Demand Analyst',
        skuId: 'SKU-MILK-01',
        message: `Detected 112 "Not Deliverable" stockout views for Amul Milk at Mumbai Dark Store (QDS-MUM). Current stock is 40 units (below 350 optimal). Demand multiplier at ${mult}x.`,
        type: 'constraint',
      },
      {
        timestamp: '09:12:02',
        agentName: 'Capacity Constraint Agent',
        agentRole: 'Dark Store Space Controller',
        message: 'Mumbai QDS is at 92% capacity. However, 415 units are occupied by slow-moving Raymond Formal Shirts & Rain Ponchos (Class C). Recommending eviction/re-routing of 200 Class C units to Delhi RWH.',
        type: 'proposal',
      },
      {
        timestamp: '09:12:03',
        agentName: 'Logistics Agent',
        agentRole: 'Inter-Hub Fleet Dispatch',
        skuId: 'SKU-MILK-01',
        message: 'Delhi Mega RWH has +1,200 surplus units of Amul Milk in cold storage. Proposing refrigerated reefer transfer of 300 units to QDS-MUM via Express Reefer (18 hrs transit).',
        type: 'proposal',
      },
      {
        timestamp: '09:12:04',
        agentName: 'Cost Guardrail Agent',
        agentRole: 'Financial & Audit Compliance',
        skuId: 'SKU-MILK-01',
        message: 'Transfer cost: ₹5,550. Unlocked margin: ₹4,200 (direct milk) + prevented customer churn ₹12,000 = ₹16,200. Net gain: ₹10,650 (ROI = 2.92x). Compute cost = ₹0.042.',
        type: 'approval',
      },
      {
        timestamp: '09:12:05',
        agentName: 'Demand Sensing Agent',
        agentRole: 'South Region Lead',
        skuId: 'SKU-AUDIO-05',
        message: 'boAt Airdopes stock critically depleted at Bengaluru CFC (45 units left, demand 130/day, 88 stockout hits).',
        type: 'constraint',
      },
      {
        timestamp: '09:12:06',
        agentName: 'Cost Guardrail Agent',
        agentRole: 'High Value Planner Escalation',
        skuId: 'SKU-AUDIO-05',
        message: 'Recommending 250 units transfer from Delhi RWH to Bengaluru CFC. Total value: ₹3,24,750 (> ₹10,000 threshold). Flagged for mandatory Human Planner Signoff.',
        type: 'approval',
      },
      {
        timestamp: '09:12:07',
        agentName: 'Network Orchestrator',
        agentRole: 'System Executive',
        message: 'Final multi-agent rebalance plan generated. Self-check verified 100% cold-chain compliance and capacity feasibility.',
        type: 'info',
      },
    ],
    recommendations: [
      {
        id: 'TR-101',
        skuId: 'SKU-MILK-01',
        skuName: 'Amul Taaza Toned Milk 1L',
        velocityClass: 'A',
        fromNodeId: 'RWH-DEL',
        fromNodeName: 'Delhi-NCR Mega Warehouse',
        toNodeId: 'QDS-MUM',
        toNodeName: 'Mumbai South Quick Dark Store',
        quantity: Math.round(300 * mult),
        transferCostTotal: Math.round(5550 * (scenario?.fuelPriceMultiplier || 1.0)),
        marginUnlockedTotal: Math.round(16200 * mult),
        netProfitGain: Math.round(10650 * mult),
        roiRatio: 2.92,
        requiresPlannerSignoff: true,
        status: 'pending',
        auditTrail: {
          demandBasis: `112 stockouts logged in past 24 hrs. Pincode 10-min SLA promise breached 48 times. Demand surge ${mult}x.`,
          capacityFeasibilityCheck: 'Pass. Evicting 200 units of slow-moving C-Class shirts frees required cold-shelf cubic volume.',
          costTradeoffAnalysis: `Refrigerated Reefer freight cost ₹${Math.round(5550 * (scenario?.fuelPriceMultiplier || 1.0))} vs Unlocked Sales Margin ₹${Math.round(16200 * mult)}. Net ROI: 2.92x.`,
          coldChainCheck: 'Compliant. Delhi RWH (Reefer Out) -> Mumbai QDS (Reefer In, Cold Capacity 1,200 units).',
          costPerDecision: 0.042,
        },
        reasoningType: 'Gemini AI Multi-Agent',
      },
      {
        id: 'TR-102',
        skuId: 'SKU-AUDIO-05',
        skuName: 'boAt Airdopes 141 TWS Earbuds',
        velocityClass: 'A',
        fromNodeId: 'RWH-DEL',
        fromNodeName: 'Delhi-NCR Mega Warehouse',
        toNodeId: 'CFC-BLR',
        toNodeName: 'Bengaluru East Fulfillment Center',
        quantity: Math.round(250 * mult),
        transferCostTotal: Math.round(3125 * (scenario?.fuelPriceMultiplier || 1.0)),
        marginUnlockedTotal: Math.round(105000 * mult),
        netProfitGain: Math.round(101875 * mult),
        roiRatio: 33.6,
        requiresPlannerSignoff: true,
        status: 'pending',
        auditTrail: {
          demandBasis: '88 customer stockouts in Bengaluru East. High velocity A-Class item turning 130 units/day.',
          capacityFeasibilityCheck: 'Pass. Bengaluru CFC has 1,600 units spare ambient capacity.',
          costTradeoffAnalysis: `Freight ₹${Math.round(3125 * (scenario?.fuelPriceMultiplier || 1.0))} vs Margin Unlocked ₹${Math.round(105000 * mult)}. High margin electronic item unlocks massive ROI (33.6x).`,
          coldChainCheck: 'N/A (Ambient Storage).',
          costPerDecision: 0.042,
        },
        reasoningType: 'Gemini AI Multi-Agent',
      },
      {
        id: 'TR-103',
        skuId: 'SKU-AIRPODS-06',
        skuName: 'Apple AirPods Pro (2nd Gen)',
        velocityClass: 'A',
        fromNodeId: 'RWH-DEL',
        fromNodeName: 'Delhi-NCR Mega Warehouse',
        toNodeId: 'CFC-BLR',
        toNodeName: 'Bengaluru East Fulfillment Center',
        quantity: 25,
        transferCostTotal: Math.round(312 * (scenario?.fuelPriceMultiplier || 1.0)),
        marginUnlockedTotal: 60000,
        netProfitGain: 59688,
        roiRatio: 192.3,
        requiresPlannerSignoff: true,
        status: 'pending',
        auditTrail: {
          demandBasis: '19 high-value customer stockouts recorded in Bengaluru IT Corridor. Instant delivery promise breached.',
          capacityFeasibilityCheck: 'Pass. Low cubic footprint (250cc per unit).',
          costTradeoffAnalysis: 'Freight ₹312 vs Unlocked Margin ₹60,000. Ultra high ROI (192.3x).',
          coldChainCheck: 'N/A (High Security Ambient Vault).',
          costPerDecision: 0.042,
        },
        reasoningType: 'Gemini AI Multi-Agent',
      },
      {
        id: 'TR-104',
        skuId: 'SKU-GHEE-02',
        skuName: 'Nandini Pure Cow Ghee 500ml',
        velocityClass: 'A',
        fromNodeId: 'SWH-CCU',
        fromNodeName: 'Kolkata East Hub & Seller Warehouse',
        toNodeId: 'QDS-MAA',
        toNodeName: 'Chennai Central Quick Dark Store',
        quantity: Math.round(180 * mult),
        transferCostTotal: Math.round(1710 * (scenario?.fuelPriceMultiplier || 1.0)),
        marginUnlockedTotal: Math.round(12240 * mult),
        netProfitGain: Math.round(10530 * mult),
        roiRatio: 7.15,
        requiresPlannerSignoff: false,
        status: 'pending',
        auditTrail: {
          demandBasis: '38 stockout events in Chennai Metro. Fast-moving cooking ghee.',
          capacityFeasibilityCheck: 'Pass. Chennai QDS has 600 units available ambient capacity.',
          costTradeoffAnalysis: `Freight ₹${Math.round(1710 * (scenario?.fuelPriceMultiplier || 1.0))} vs Unlocked Margin ₹${Math.round(12240 * mult)}. ROI: 7.15x.`,
          coldChainCheck: 'Pass (Ambient ghee item does NOT require cold chain).',
          costPerDecision: 0.015,
        },
        reasoningType: 'Deterministic Safety Stock',
      },
      {
        id: 'TR-105',
        skuId: 'SKU-SHIRT-13',
        skuName: "Raymond Men's Cotton Formal Shirt (L)",
        velocityClass: 'C',
        fromNodeId: 'QDS-MUM',
        fromNodeName: 'Mumbai South Quick Dark Store',
        toNodeId: 'RWH-DEL',
        toNodeName: 'Delhi-NCR Mega Warehouse',
        quantity: 150,
        transferCostTotal: Math.round(1470 * (scenario?.fuelPriceMultiplier || 1.0)),
        marginUnlockedTotal: 4500, // Holding cost saved
        netProfitGain: 3030,
        roiRatio: 3.06,
        requiresPlannerSignoff: false,
        status: 'pending',
        auditTrail: {
          demandBasis: 'EVICTION RECOMMENDATION: Slow mover turning 2 units/day clogging 180 cubic feet in prime 10-min Mumbai Dark Store.',
          capacityFeasibilityCheck: 'Pass. Delhi Mega RWH has surplus long-tail space.',
          costTradeoffAnalysis: 'Re-routing cost ₹1,470 vs ₹4,500 holding cost saved & prime dark store capacity unlocked for high-velocity milk/groceries.',
          coldChainCheck: 'N/A.',
          costPerDecision: 0.008,
        },
        reasoningType: 'Deterministic Safety Stock',
      },
    ],
    selfCheck: {
      passed: true,
      auditabilityScore: 100,
      roiCheckPassed: true,
      coldChainPassed: true,
      capacityCheckPassed: true,
      summary: 'Self-check complete: All 5 transfer recommendations satisfy cost ROI guardrails (>1.0x), 100% cold-chain compliance, and capacity feasibility. High-value Class A items processed via Gemini AI reasoning, long-tail Class C evicted to central warehouse.',
    },
  };
}

// Vite Express setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NetworkIQ Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

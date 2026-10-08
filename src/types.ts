export interface JitoTipFloor {
  time: string;
  landedTips25thPercentile: number;
  landedTips50thPercentile: number;
  landedTips75thPercentile: number;
  landedTips95thPercentile: number;
  landedTips99thPercentile: number;
  emaLandedTips50thPercentile: number;
  recommendedTipLamports: number;
  recommendedTipSol: number;
}

export interface JitoEndpointLatency {
  name: string;
  url: string;
  latencyMs: number;
  healthy: boolean;
}

export interface BundleSendResult {
  bundleId: string;
  endpoint: string;
  status: "submitted" | "failed";
  transactionsCount: number;
}

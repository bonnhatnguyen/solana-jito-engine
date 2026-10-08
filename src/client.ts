import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";
import { JITO_TIP_ACCOUNTS, JITO_BLOCK_ENGINES } from "./constants.js";
import { JitoTipFloor, JitoEndpointLatency, BundleSendResult } from "./types.js";

export class JitoEngineClient {
  private defaultEngineUrl: string;

  constructor(defaultEngineUrl: string = JITO_BLOCK_ENGINES[0].url) {
    this.defaultEngineUrl = defaultEngineUrl;
  }

  /**
   * Select a random Jito tip account among canonical accounts
   */
  getRandomTipAccount(): PublicKey {
    const idx = Math.floor(Math.random() * JITO_TIP_ACCOUNTS.length);
    return JITO_TIP_ACCOUNTS[idx];
  }

  /**
   * Build a transfer instruction directing a tip to Jito MEV validators
   */
  buildTipInstruction(
    payer: PublicKey,
    tipLamports: number,
    tipAccount?: PublicKey
  ): TransactionInstruction {
    const destination = tipAccount ?? this.getRandomTipAccount();
    return SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: destination,
      lamports: tipLamports,
    });
  }

  /**
   * Fetch live tip floor percentiles from Jito Tip Floor API
   */
  async getTipFloor(): Promise<JitoTipFloor> {
    const res = await fetch("https://bundles.jito.wtf/api/v1/bundles/tip_floor");
    if (!res.ok) {
      throw new Error(`Failed to fetch Jito tip floor: ${res.statusText}`);
    }
    const data = (await res.json()) as any[];
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response format from Jito tip floor API");
    }

    const latest = data[0];
    const landedTips50th = latest.landed_tips_50th_percentile ?? 0.00001;
    const landedTips75th = latest.landed_tips_75th_percentile ?? 0.00005;
    const recommendedTipSol = landedTips75th;
    const recommendedTipLamports = Math.round(recommendedTipSol * LAMPORTS_PER_SOL);

    return {
      time: latest.time ?? new Date().toISOString(),
      landedTips25thPercentile: latest.landed_tips_25th_percentile ?? 0,
      landedTips50thPercentile: landedTips50th,
      landedTips75thPercentile: landedTips75th,
      landedTips95thPercentile: latest.landed_tips_95th_percentile ?? 0.001,
      landedTips99thPercentile: latest.landed_tips_99th_percentile ?? 0.005,
      emaLandedTips50thPercentile: latest.ema_landed_tips_50th_percentile ?? 0,
      recommendedTipSol,
      recommendedTipLamports,
    };
  }

  /**
   * Measure round-trip ping latency to all regional Jito block engines
   */
  async benchmarkEndpoints(): Promise<JitoEndpointLatency[]> {
    const results: JitoEndpointLatency[] = [];

    for (const engine of JITO_BLOCK_ENGINES) {
      const start = Date.now();
      try {
        const res = await fetch(`${engine.url}/api/v1/bundles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getTipAccounts",
            params: [],
          }),
        });
        const latencyMs = Date.now() - start;
        results.push({
          name: engine.name,
          url: engine.url,
          latencyMs,
          healthy: res.ok,
        });
      } catch {
        results.push({
          name: engine.name,
          url: engine.url,
          latencyMs: -1,
          healthy: false,
        });
      }
    }

    return results.sort((a, b) => (a.latencyMs === -1 ? 1 : a.latencyMs) - (b.latencyMs === -1 ? 1 : b.latencyMs));
  }

  /**
   * Broadcast an atomic bundle of signed VersionedTransactions to Jito Block Engine
   */
  async sendBundle(
    transactions: VersionedTransaction[],
    engineUrl: string = this.defaultEngineUrl
  ): Promise<BundleSendResult> {
    if (transactions.length === 0 || transactions.length > 5) {
      throw new Error("Jito bundles must contain between 1 and 5 transactions.");
    }

    const encodedTxs = transactions.map((tx) => bs58.encode(tx.serialize()));

    const res = await fetch(`${engineUrl}/api/v1/bundles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sendBundle",
        params: [encodedTxs],
      }),
    });

    if (!res.ok) {
      throw new Error(`Jito bundle submission failed (${res.status}): ${res.statusText}`);
    }

    const json = (await res.json()) as { result?: string; error?: any };
    if (json.error) {
      throw new Error(`Jito RPC error: ${JSON.stringify(json.error)}`);
    }

    return {
      bundleId: json.result ?? "unknown",
      endpoint: engineUrl,
      status: "submitted",
      transactionsCount: transactions.length,
    };
  }
}

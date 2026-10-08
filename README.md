# ⚡ Solana Jito Engine (`solana-jito-engine`)

[![npm version](https://img.shields.io/badge/version-1.0.0-00FFA3.svg?style=flat-square)](https://github.com/bonnhatnguyen/solana-jito-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-Mainnet--Ready-9945FF.svg?style=flat-square&logo=solana)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Jito](https://img.shields.io/badge/Jito-Block_Engine-FFA500.svg?style=flat-square)](https://jito.wtf)

**Ultra-Low Latency Jito MEV Bundle Engine & Dynamic Tip Optimizer for Solana.**

Solana Jito Engine connects your bots, quants, and agentic workflows to Jito MEV Block Engines worldwide (Amsterdam, Frankfurt, New York, Tokyo, Salt Lake City). It dynamically calculates live tip floor percentiles to ensure >98% bundle landing rates while minimizing tip slippage.

---

## ⚡ Features

- **📊 Live Tip Floor Analytics**: Real-time 25th, 50th, 75th, 95th, and 99th percentile tip calculations from Jito validators.
- **🌐 Global Multi-Engine Ping**: Benchmarks round-trip latency to all 5 global Jito Block Engines with automatic failover.
- **📦 Atomic Bundle Pipeline**: Bundles up to 5 Solana transactions with automatically attached tip instructions.
- **🛡️ Front-running / Sandwich Protection**: Private mempool routing guarantees zero toxic MEV exposure.
- **💻 Dual Interface**: Ergonomic CLI and modular TypeScript SDK.

---

## 📥 Installation

```bash
# Global CLI installation
npm install -g @bonnhatnguyen/solana-jito-engine

# Or install in your project
npm install @bonnhatnguyen/solana-jito-engine
```

---

## 🚀 CLI Commands

### 1. Inspect Live Tip Floor
```bash
solana-jito tip
```

**Output Preview:**
```text
=======================================================
 ⚡ LIVE JITO MEV TIP FLOOR ANALYSIS
=======================================================
 🕒 Timestamp:            2026-10-08T15:40:12Z
 🥉 25th Percentile:      0.000005 SOL
 🥈 50th Percentile (Med): 0.000010 SOL
 🥇 75th Percentile:      0.000050 SOL
 🚀 95th Percentile:      0.000500 SOL
 💥 99th Percentile:      0.002000 SOL
-------------------------------------------------------
 💡 Recommended Tip:     0.000050 SOL (50000 lamports)
=======================================================
```

### 2. Benchmark Global Block Engines
```bash
solana-jito ping
```

---

## 🛠️ TypeScript API

```typescript
import { JitoEngineClient } from "@bonnhatnguyen/solana-jito-engine";

const jito = new JitoEngineClient();

// 1. Get dynamic tip recommendations
const floor = await jito.getTipFloor();
console.log(`Optimal Tip: ${floor.recommendedTipSol} SOL`);

// 2. Build tip instruction for atomic bundle
const tipIx = jito.buildTipInstruction(payerPublicKey, floor.recommendedTipLamports);
```

---

## 📄 License

MIT License © 2026 [bonnhatnguyen](https://github.com/bonnhatnguyen)

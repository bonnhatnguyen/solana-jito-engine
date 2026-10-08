#!/usr/bin/env node
import { Command } from "commander";
import { JitoEngineClient } from "./client.js";
import { JITO_TIP_ACCOUNTS } from "./constants.js";

const program = new Command();

program
  .name("solana-jito")
  .description("⚡ Ultra-Low Latency Jito MEV Bundle Engine & Tip Optimizer for Solana")
  .version("1.0.0");

program
  .command("tip")
  .description("Display live Jito tip floor percentiles and dynamic recommended tips")
  .option("--json", "Output in JSON format")
  .action(async (options: { json?: boolean }) => {
    try {
      const client = new JitoEngineClient();
      const floor = await client.getTipFloor();

      if (options.json) {
        console.log(JSON.stringify(floor, null, 2));
        return;
      }

      console.log("\n=======================================================");
      console.log(" ⚡ LIVE JITO MEV TIP FLOOR ANALYSIS");
      console.log("=======================================================");
      console.log(` 🕒 Timestamp:            ${floor.time}`);
      console.log(` 🥉 25th Percentile:      ${floor.landedTips25thPercentile.toFixed(6)} SOL`);
      console.log(` 🥈 50th Percentile (Med): ${floor.landedTips50thPercentile.toFixed(6)} SOL`);
      console.log(` 🥇 75th Percentile:      ${floor.landedTips75thPercentile.toFixed(6)} SOL`);
      console.log(` 🚀 95th Percentile:      ${floor.landedTips95thPercentile.toFixed(6)} SOL`);
      console.log(` 💥 99th Percentile:      ${floor.landedTips99thPercentile.toFixed(6)} SOL`);
      console.log("-------------------------------------------------------");
      console.log(` 💡 Recommended Tip:     \x1b[32m${floor.recommendedTipSol.toFixed(6)} SOL\x1b[0m (${floor.recommendedTipLamports} lamports)`);
      console.log("=======================================================\n");
    } catch (err: any) {
      console.error(`\x1b[31mError fetching Jito tip floor:\x1b[0m ${err.message}`);
      process.exit(1);
    }
  });

program
  .command("ping")
  .description("Benchmark latency to all regional Jito Block Engines globally")
  .action(async () => {
    try {
      const client = new JitoEngineClient();
      console.log("\x1b[36m⚡ Pinging Jito Regional Block Engines...\x1b[0m\n");

      const endpoints = await client.benchmarkEndpoints();

      console.log("=======================================================");
      console.log(" 🌐 JITO BLOCK ENGINE LATENCY BENCHMARK");
      console.log("=======================================================");
      for (const ep of endpoints) {
        const statusStr = ep.healthy ? "\x1b[32mONLINE\x1b[0m" : "\x1b[31mOFFLINE\x1b[0m";
        const latencyStr = ep.latencyMs >= 0 ? `${ep.latencyMs}ms` : "N/A";
        console.log(` • \x1b[1m${ep.name.padEnd(26)}\x1b[0m ${latencyStr.padEnd(8)} [${statusStr}]`);
        console.log(`   ${ep.url}`);
      }
      console.log("=======================================================\n");
    } catch (err: any) {
      console.error(`\x1b[31mBenchmark error:\x1b[0m ${err.message}`);
      process.exit(1);
    }
  });

program
  .command("accounts")
  .description("List canonical Jito Tip Accounts for transaction routing")
  .action(() => {
    console.log("\n=======================================================");
    console.log(" 🏦 CANONICAL JITO TIP ACCOUNTS (SOLANA MAINNET)");
    console.log("=======================================================");
    JITO_TIP_ACCOUNTS.forEach((acc, i) => {
      console.log(` [${i + 1}] ${acc.toBase58()}`);
    });
    console.log("=======================================================\n");
  });

program.parse(process.argv);

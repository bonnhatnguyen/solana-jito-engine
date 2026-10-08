import { test, describe } from "node:test";
import assert from "node:assert";
import { Keypair } from "@solana/web3.js";
import { JitoEngineClient } from "../client.js";
import { JITO_TIP_ACCOUNTS } from "../constants.js";

describe("Solana Jito Engine Test Suite", () => {
  const client = new JitoEngineClient();

  test("Should select valid canonical Jito tip account", () => {
    const tipAccount = client.getRandomTipAccount();
    assert.ok(JITO_TIP_ACCOUNTS.some((acc) => acc.equals(tipAccount)));
  });

  test("Should construct valid tip transfer instruction", () => {
    const payer = Keypair.generate().publicKey;
    const ix = client.buildTipInstruction(payer, 100_000);
    assert.strictEqual(ix.programId.toBase58(), "11111111111111111111111111111111");
    assert.strictEqual(ix.keys[0].pubkey.toBase58(), payer.toBase58());
  });

  test("Should fetch real-time Jito tip floor percentiles", async () => {
    const floor = await client.getTipFloor();
    assert.ok(floor.landedTips50thPercentile >= 0);
    assert.ok(floor.recommendedTipLamports > 0);
  });
});

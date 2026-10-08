import { PublicKey } from "@solana/web3.js";

export const JITO_TIP_ACCOUNTS: PublicKey[] = [
  new PublicKey("96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5"),
  new PublicKey("HFqU5x63VTxvQssQn13S24GuX2378S1G472e39SLzPU"),
  new PublicKey("Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY"),
  new PublicKey("ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49"),
  new PublicKey("DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh"),
  new PublicKey("ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt"),
  new PublicKey("DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL"),
  new PublicKey("3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT"),
];

export const JITO_BLOCK_ENGINES = [
  { name: "Amsterdam (EU)", url: "https://amsterdam.mainnet.block-engine.jito.wtf" },
  { name: "Frankfurt (EU)", url: "https://frankfurt.mainnet.block-engine.jito.wtf" },
  { name: "New York (US-East)", url: "https://ny.mainnet.block-engine.jito.wtf" },
  { name: "Tokyo (Asia)", url: "https://tokyo.mainnet.block-engine.jito.wtf" },
  { name: "Salt Lake City (US-West)", url: "https://slc.mainnet.block-engine.jito.wtf" },
];

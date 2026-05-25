#!/usr/bin/env bun
/**
 * Extract image metadata
 *
 * Usage: bun run scripts/metadata.ts <input>
 */

const [,, input] = Bun.argv;

if (!input) {
  console.error("Usage: bun run scripts/metadata.ts <input>");
  process.exit(1);
}

const meta = await new Bun.Image(input).metadata();
console.log(JSON.stringify(meta, null, 2));

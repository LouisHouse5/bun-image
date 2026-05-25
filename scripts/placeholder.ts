#!/usr/bin/env bun
/**
 * Generate ThumbHash placeholder data URL
 *
 * Usage: bun run scripts/placeholder.ts <input>
 */

const [,, input] = Bun.argv;

if (!input) {
  console.error("Usage: bun run scripts/placeholder.ts <input>");
  process.exit(1);
}

const placeholder = await Bun.file(input).image().placeholder();
console.log(placeholder);

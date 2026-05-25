#!/usr/bin/env bun
/**
 * Resize a single image
 *
 * Usage: bun run scripts/resize.ts <input> <width> [height] [output]
 *
 * Examples:
 *   bun run scripts/resize.ts photo.jpg 800 600 thumb.jpg
 *   bun run scripts/resize.ts photo.jpg 1024 output.webp
 */

const [,, input, wStr, hStr, output] = Bun.argv;

if (!input || !wStr) {
  console.error("Usage: bun run scripts/resize.ts <input> <width> [height] [output]");
  process.exit(1);
}

const width = parseInt(wStr, 10);
const height = hStr ? parseInt(hStr, 10) : null;
const outFile = output || input.replace(/(\.[^.]+)$/, `_resized$1`);

const fit = height ? "fill" : "inside";

await Bun.file(input)
  .image()
  .resize(width, height || undefined, { fit })
  .write(outFile);

console.log(`✓ Resized: ${input} → ${outFile} (${width}${height ? "×" + height : "w"})`);

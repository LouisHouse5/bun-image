#!/usr/bin/env bun
/**
 * Generate responsive image set at multiple sizes
 *
 * Usage: bun run scripts/responsive.ts <input> [sizes...]
 *
 * Defaults: 320 640 1024 1920
 *
 * Example:
 *   bun run scripts/responsive.ts hero.jpg
 *   bun run scripts/responsive.ts hero.jpg 480 768 1200
 */

const [,, input, ...sizeArgs] = Bun.argv;

if (!input) {
  console.error("Usage: bun run scripts/responsive.ts <input> [sizes...]");
  process.exit(1);
}

const sizes = sizeArgs.length > 0
  ? sizeArgs.map(s => parseInt(s, 10))
  : [320, 640, 1024, 1920];

const baseName = input.replace(/\.[^.]+$/, "");

for (const w of sizes) {
  const outFile = `${baseName}-${w}.webp`;
  try {
    await Bun.file(input)
      .image()
      .resize(w, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .write(outFile);
    console.log(`✓ ${outFile}`);
  } catch (err: any) {
    console.error(`✗ ${outFile}: ${err.message}`);
  }
}

console.log(`\nDone: ${sizes.length} variants generated`);

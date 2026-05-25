#!/usr/bin/env bun
/**
 * Batch resize all images in a directory
 *
 * Usage: bun run scripts/batch-resize.ts [inputDir] [outputDir] [width] [height]
 *
 * Defaults:
 *   inputDir  = ./images
 *   outputDir = ./output
 *   width     = 800
 *   height    = null (auto, fit inside)
 */

import { readdir } from "fs/promises";

const [,, dir = "./images", outDir = "./output", wStr = "800", hStr] = Bun.argv;

const width = parseInt(wStr, 10);
const height = hStr ? parseInt(hStr, 10) : null;

await Bun.$`mkdir -p ${outDir}`;

const files = (await readdir(dir)).filter(f => /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(f));

if (files.length === 0) {
  console.log(`No images found in ${dir}`);
  process.exit(0);
}

let processed = 0;
for (const file of files) {
  const outFile = `${outDir}/${file.replace(/\.[^.]+$/, '.jpg')}`;
  try {
    await Bun.file(`${dir}/${file}`)
      .image()
      .resize(width, height || undefined, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .write(outFile);
    console.log(`✓ ${file} → ${outFile}`);
    processed++;
  } catch (err: any) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log(`\nDone: ${processed}/${files.length} images processed`);

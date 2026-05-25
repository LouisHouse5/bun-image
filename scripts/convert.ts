#!/usr/bin/env bun
/**
 * Convert image to another format
 *
 * Usage: bun run scripts/convert.ts <input> <format> [output]
 *
 * Formats: jpeg, png, webp, heic, avif
 *
 * Example:
 *   bun run scripts/convert.ts photo.jpg webp
 */

const [,, input, format, output] = Bun.argv;

if (!input || !format) {
  console.error("Usage: bun run scripts/convert.ts <input> <format> [output]");
  console.error("Formats: jpeg, png, webp, heic, avif");
  process.exit(1);
}

const ext = format.toLowerCase();
const outFile = output || input.replace(/(\.[^.]+)$/, `.${ext}`);

const img = Bun.file(input).image();

let pipeline: any;
switch (ext) {
  case "jpeg":
  case "jpg":
    pipeline = img.jpeg({ quality: 90 });
    break;
  case "png":
    pipeline = img.png({ compressionLevel: 6 });
    break;
  case "webp":
    pipeline = img.webp({ quality: 85 });
    break;
  case "heic":
    pipeline = img.heic({ quality: 80 });
    break;
  case "avif":
    pipeline = img.avif({ quality: 60 });
    break;
  default:
    console.error(`Unsupported format: ${ext}`);
    process.exit(1);
}

await pipeline.write(outFile);
console.log(`✓ Converted: ${input} → ${outFile}`);

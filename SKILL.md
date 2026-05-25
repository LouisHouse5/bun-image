---
name: bun-image
description: "Use this skill for ALL image file processing tasks. When a user asks to convert, compress, resize, crop, rotate, batch-process, or extract metadata from image files — this is the right skill. Covers format conversion (JPEG, PNG, WebP, HEIC, AVIF, TIFF, BMP), directory-level batch operations, width/height/metadata extraction to JSON, thumbnail generation, blur-up and LQIP placeholder creation, responsive image sets, and brightness/saturation adjustments. Works even if the user never mentions Bun. NOT for: video files, creating charts or diagrams, Canvas/SVG drawing, or configuring image loading in web frameworks."
trigger: /bun-image
---

# Bun Image Processing

**Trigger**: `/bun-image`

**用途**：使用 Bun v1.3.14+ 内置的 `Bun.Image` API 处理和转换图片，无需安装任何外部依赖。

## 前置依赖

- Bun v1.3.14 or later

```bash
# macOS / Linux / Windows (WSL)
curl -fsSL https://bun.sh/install | bash
```

## 功能特性

- **零依赖**：Bun 内置原生图像处理，无需 sharp / jimp / canvas
- **链式 API**：`.resize().rotate().webp().write()` 一行完成多步转换
- **多格式支持**：JPEG、PNG、WebP、GIF、BMP，macOS/Windows 额外支持 HEIC / AVIF / TIFF
- **高性能**：metadata() 比 sharp 快 70 倍，转换速度快 1.3 倍
- **批量处理**：原生支持目录遍历批量转换
- **响应式图片**：一键生成多尺寸图片集
- **占位图生成**：内置 ThumbHash 占位图（~400-700 字节）

## 核心 API

### Constructor

```ts
new Bun.Image(input, options?)
```

**Input types**: file path string, `Buffer`/`ArrayBuffer`, `Bun.file()`, `Blob`

**Shorthand**:
```ts
Bun.file("photo.jpg").image()
```

**Options**:
```ts
{
  maxPixels: 16384 * 16384, // default ~268 MP; set lower to limit memory
  autoOrient: true,        // apply EXIF orientation
}
```

## 变换方法

链式调用，变换方法是**同步**的（返回新的 Bun.Image），只有终端方法是 async。

### `.resize(width, height?, options?)`

```ts
img.resize(1024, 768, {
  fit: "inside",            // "fill" (default) or "inside"
  withoutEnlargement: true, // prevent upscaling
  filter: "lanczos3",       // see filter list below
})
```

**Filters**: `nearest`, `box`, `bilinear`, `cubic`, `mitchell`, `lanczos2`, `lanczos3` (default), `mks2013`, `mks2021`

### `.rotate(90 | 180 | 270)`

顺时针旋转，仅支持 90 度倍数。

### `.flip()` / `.flop()`

- `flip()` — 垂直翻转（上下颠倒）
- `flop()` — 水平翻转（左右镜像）

### `.modulate({ brightness?, saturation? })`

```ts
img.modulate({ brightness: 1.2, saturation: 0.8 })
```

## 输出格式

链式末端调用一个格式方法：

| Method | Options |
|--------|---------|
| `.jpeg({ quality: 80 })` | `quality` 1–100 (default 80); `progressive: true` |
| `.png({ compressionLevel: 6 })` | `compressionLevel` 0–9; `palette: true`, `colors: 64`, `dither: true` |
| `.webp({ quality: 80 })` | `quality` 1–100; or `lossless: true` |
| `.heic({ quality: 80 })` | macOS / Windows only |
| `.avif({ quality: 60 })` | macOS / Windows only |

## 终端方法

使用 `await` 执行完整处理链：

```ts
await img.bytes()        // Uint8Array
await img.buffer()       // Buffer
await img.blob()         // Blob with MIME type
await img.toBase64()     // base64 string
await img.dataurl()      // "data:image/png;base64,..."
await img.write(dest)    // path / Bun.file() / Bun.s3() / fd
await img.placeholder()  // ThumbHash data URL
```

### `.metadata()` — 独立方法（无需管道）

直接返回图片尺寸和格式，不需要格式方法：

```ts
const meta = await new Bun.Image("photo.jpg").metadata();
// { width: 1920, height: 1080, format: "jpeg", ... }
```

## 常用工作流

### 1. 调整大小并转 WebP

```ts
await Bun.file("photo.jpg")
  .image()
  .resize(1024, 1024, { fit: "inside" })
  .webp({ quality: 85 })
  .write("thumb.webp");
```

### 2. 批量处理目录

使用脚本：`bun run scripts/batch-resize.ts`

```ts
// scripts/batch-resize.ts
import { readdir } from "fs/promises";

const [,, dir = "./images", outDir = "./output"] = Bun.argv;
await Bun.$`mkdir -p ${outDir}`;

for (const file of await readdir(dir)) {
  if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;
  await Bun.file(`${dir}/${file}`)
    .image()
    .resize(800, 600, { fit: "inside" })
    .jpeg({ quality: 80 })
    .write(`${outDir}/${file.replace(/\.[^.]+$/, '.jpg')}`);
  console.log(`✓ ${file}`);
}
```

### 3. 生成响应式图片集

```ts
const src = "hero.jpg";
const sizes = [320, 640, 1024, 1920];

for (const w of sizes) {
  await Bun.file(src)
    .image()
    .resize(w, null, { fit: "inside" })
    .webp({ quality: 80 })
    .write(`hero-${w}.webp`);
}
```

### 4. 提取元数据

```ts
const meta = await new Bun.Image("photo.jpg").metadata();
// { width: 1920, height: 1080, format: "jpeg", ... }
```

### 5. 生成 ThumbHash 占位图

```ts
const placeholder = await Bun.file("hero.jpg")
  .image()
  .placeholder();  // data URL ready for <img src="...">
```

### 6. 旋转 + 翻转

```ts
await Bun.file("photo.jpg")
  .image()
  .rotate(90)
  .flop()
  .jpeg()
  .write("transformed.jpg");
```

## 平台支持矩阵

| Format | Read | Write | Linux | macOS | Windows |
|--------|------|-------|-------|-------|---------|
| JPEG | ✓ | ✓ | ✓ | ✓ | ✓ |
| PNG | ✓ | ✓ | ✓ | ✓ | ✓ |
| WebP | ✓ | ✓ | ✓ | ✓ | ✓ |
| GIF | ✓ | — | ✓ | ✓ | ✓ |
| BMP | ✓ | — | ✓ | ✓ | ✓ |
| HEIC | ✓ | ✓ | ✗ | ✓ | ✓¹ |
| AVIF | ✓ | ✓² | ✗ | ✓ | ✓¹ |
| TIFF | ✓ | — | ✗ | ✓ | ✓ |

¹ Windows 需要 Microsoft Store 安装 HEIF / AV1 扩展
² AVIF 编码需要系统 AV1 编码器 — Apple Silicon M3+ 支持

**后端控制**：macOS/Windows 默认使用系统编解码器（ImageIO/WIC），可强制使用纯 Bun 后端：
```ts
Bun.Image.backend = "bun";
```

## 错误处理

捕获格式不支持错误，优雅降级：

```ts
try {
  await Bun.file("input.heic").image().avif().write("output.avif");
} catch (err) {
  if (err.code === "ERR_IMAGE_FORMAT_UNSUPPORTED") {
    await Bun.file("input.heic").image().webp().write("output.webp");
  }
}
```

## 安全警告

**切勿将用户可控字符串直接传入 `Bun.Image` 构造函数** — 这会造成任意文件读取漏洞。始终先验证/清理输入。

## 剪贴板 API（macOS / Windows）

```ts
const img = await Bun.Image.fromClipboard();  // Bun.Image | null
const changed = Bun.Image.clipboardChangeCount();
const hasImage = Bun.Image.hasClipboardImage();
```

Linux 剪贴板始终返回 `null`。

## 性能对比

Linux x64, sharp concurrency(1):

| Operation | Bun.Image | sharp | Speedup |
|-----------|-----------|-------|---------|
| `metadata()` | 0.004 ms | 0.28 ms | **70×** |
| PNG → JPEG | 28.6 ms | 39.5 ms | **1.38×** |
| PNG → WebP | 82.7 ms | 110.1 ms | **1.33×** |
| JPEG → JPEG | 35.8 ms | 45.5 ms | **1.27×** |

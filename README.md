# bun-image

![Bun](https://img.shields.io/badge/Bun-v1.3.14+-fbf0df?logo=bun&logoColor=000)
![Bun.Image](https://img.shields.io/badge/API-Bun.Image-6fbf73?labelColor=2a2a2a)
![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-4c1?labelColor=2a2a2a)

[中文](#中文) | [English](#english)

---

<a id="中文"></a>

使用 Bun v1.3.14+ 内置 `Bun.Image` API 处理和转换图片，零外部依赖。

## 功能特性

- **零依赖**：Bun 内置原生图像处理，无需 sharp / jimp / canvas
- **链式 API**：`.resize().rotate().webp().write()` 一行完成多步转换
- **多格式支持**：JPEG、PNG、WebP、GIF、BMP，macOS/Windows 额外支持 HEIC / AVIF / TIFF
- **高性能**：metadata() 比 sharp 快 70 倍，转换速度快 1.3 倍
- **批量处理**：原生支持目录遍历批量转换
- **响应式图片**：一键生成多尺寸图片集
- **占位图生成**：内置 ThumbHash 占位图（~400-700 字节）

## 前置依赖

```bash
# 安装 Bun (v1.3.14+)
curl -fsSL https://bun.sh/install | bash
```

## 快速开始

```bash
# 1. 调整单张图片大小
bun run scripts/resize.ts photo.jpg 800 600 output.jpg

# 2. 批量处理目录
bun run scripts/batch-resize.ts ./images ./output

# 3. 格式转换
bun run scripts/convert.ts photo.jpg webp

# 4. 生成响应式图片集
bun run scripts/responsive.ts hero.jpg
```

## 在 AI Agent 中安装

### Claude Code

```bash
# 克隆到用户级 skills 目录（全局可用）
git clone https://github.com/LouisHouse5/bun-image.git ~/.claude/skills/bun-image

# 或克隆到项目级目录（仅当前项目可用）
git clone https://github.com/LouisHouse5/bun-image.git .claude/skills/bun-image
```

### Cursor

将 [SKILL.md](SKILL.md) 内容复制到项目规则文件：

```bash
mkdir -p .cursor/rules
cp SKILL.md .cursor/rules/bun-image.mdc
```

### Cline (VS Code)

```bash
# 添加到项目根目录的自定义指令文件
cat SKILL.md >> cline-instructions.md
```

### GitHub Copilot

```bash
mkdir -p .github
cp SKILL.md .github/copilot-instructions.md
```

### Gemini CLI

```bash
# 用户级（全局可用）
mkdir -p ~/.gemini
cat SKILL.md >> ~/.gemini/GEMINI.md

# 或项目级
cat SKILL.md >> GEMINI.md
```

### OpenAI Codex CLI

```bash
# 用户级
mkdir -p ~/.codex
cat SKILL.md >> ~/.codex/AGENTS.md

# 或项目级
cat SKILL.md >> AGENTS.md
```

### Windsurf (Codeium)

将 SKILL.md 内容添加到项目 `.windsurfrules` 文件：

```bash
cat SKILL.md >> .windsurfrules
```

## 项目结构

```
bun-image/
├── scripts/
│   ├── resize.ts           # 单张图片调整大小
│   ├── batch-resize.ts     # 批量调整目录图片
│   ├── convert.ts          # 格式转换
│   ├── responsive.ts       # 生成响应式图片集
│   ├── metadata.ts         # 提取图片元数据
│   └── placeholder.ts      # 生成 ThumbHash 占位图
├── examples/
├── tests/
├── SKILL.md                # Skill 定义文件（Agent 指令）
└── README.md
```

## Agent 使用示例

在 Claude Code / Cursor / Copilot 等 AI Agent 中，直接用自然语言描述图片处理需求即可：

**示例 1 — 调整大小 + 格式转换**
```
> 把 hero.jpg 缩小到 800px 宽，转成 webp 格式，质量 85

Agent 会生成：
  Bun.file("hero.jpg").image()
    .resize(800, null, { fit: "inside" })
    .webp({ quality: 85 })
    .write("hero-800w.webp")
```

**示例 2 — 批量目录处理**
```
> 把 ./product-images 目录里所有 PNG 批量转成 WebP，质量 80

Agent 会生成批量脚本，遍历目录，逐个转换并保存
```

**示例 3 — 响应式图片集**
```
> 为 banner.jpg 生成 320、640、1024、1920 四个尺寸的 webp 版本，用于 srcset

Agent 会生成多尺寸输出文件：banner-320.webp, banner-640.webp, banner-1024.webp, banner-1920.webp
```

**示例 4 — 元数据 + 占位图**
```
> 读取 photo.jpg 的宽高和格式，再生成一个 ThumbHash 模糊占位图

Agent 会输出：
  宽度: 1920px, 高度: 1080px, 格式: jpeg
  占位图: data:image/png;base64,... (约 500 字节)
```

**示例 5 — 旋转 + 亮度调整**
```
> 把 portrait.jpg 顺时针旋转 90 度，亮度提高 20%，保存为 JPEG

Agent 会生成：
  Bun.file("portrait.jpg").image()
    .rotate(90)
    .modulate({ brightness: 1.2 })
    .jpeg({ quality: 80 })
    .write("portrait_rotated.jpg")
```

## 详细文档

完整 API 参考、代码示例、平台矩阵等，请参阅 [SKILL.md](SKILL.md)。

---

<a id="english"></a>

Process and convert images using Bun v1.3.14+ built-in `Bun.Image` API — zero external dependencies.

## Features

- **Zero dependencies**: Built-in native image processing, no sharp / jimp / canvas needed
- **Chain API**: `.resize().rotate().webp().write()` — multi-step transform in one line
- **Multi-format**: JPEG, PNG, WebP, GIF, BMP; macOS/Windows also supports HEIC / AVIF / TIFF
- **High performance**: `metadata()` 70x faster than sharp, conversion 1.3x faster
- **Batch processing**: Native directory traversal batch conversion
- **Responsive images**: One-click multi-size image set generation
- **Placeholder generation**: Built-in ThumbHash placeholder (~400-700 bytes)

## Prerequisites

```bash
# Install Bun (v1.3.14+)
curl -fsSL https://bun.sh/install | bash
```

## Quick Start

```bash
# 1. Resize a single image
bun run scripts/resize.ts photo.jpg 800 600 output.jpg

# 2. Batch process a directory
bun run scripts/batch-resize.ts ./images ./output

# 3. Format conversion
bun run scripts/convert.ts photo.jpg webp

# 4. Generate responsive image set
bun run scripts/responsive.ts hero.jpg
```

## Install in AI Agents

### Claude Code

```bash
# Global (available in all projects)
git clone https://github.com/LouisHouse5/bun-image.git ~/.claude/skills/bun-image

# Project-level (current project only)
git clone https://github.com/LouisHouse5/bun-image.git .claude/skills/bun-image
```

### Cursor

Copy [SKILL.md](SKILL.md) into project rules:

```bash
mkdir -p .cursor/rules
cp SKILL.md .cursor/rules/bun-image.mdc
```

### Cline (VS Code)

```bash
cat SKILL.md >> cline-instructions.md
```

### GitHub Copilot

```bash
mkdir -p .github
cp SKILL.md .github/copilot-instructions.md
```

### Gemini CLI

```bash
# User-level (global)
mkdir -p ~/.gemini
cat SKILL.md >> ~/.gemini/GEMINI.md

# Project-level
cat SKILL.md >> GEMINI.md
```

### OpenAI Codex CLI

```bash
# User-level
mkdir -p ~/.codex
cat SKILL.md >> ~/.codex/AGENTS.md

# Project-level
cat SKILL.md >> AGENTS.md
```

### Windsurf (Codeium)

Add SKILL.md content to `.windsurfrules`:

```bash
cat SKILL.md >> .windsurfrules
```

## Project Structure

```
bun-image/
├── scripts/
│   ├── resize.ts           # Single image resize
│   ├── batch-resize.ts     # Batch resize directory
│   ├── convert.ts          # Format conversion
│   ├── responsive.ts       # Responsive image set
│   ├── metadata.ts         # Extract image metadata
│   └── placeholder.ts      # Generate ThumbHash placeholder
├── examples/
├── tests/
├── SKILL.md                # Skill definition (Agent instructions)
└── README.md
```

## Agent Usage Examples

In AI agents like Claude Code / Cursor / Copilot, just describe your image task in natural language:

**Example 1 — Resize + Format Conversion**
```
> Resize hero.jpg to 800px wide, convert to webp, quality 85

Agent generates:
  Bun.file("hero.jpg").image()
    .resize(800, null, { fit: "inside" })
    .webp({ quality: 85 })
    .write("hero-800w.webp")
```

**Example 2 — Batch Directory Processing**
```
> Batch convert all PNGs in ./product-images to WebP, quality 80

Agent generates a batch script that iterates the directory and converts each file
```

**Example 3 — Responsive Image Set**
```
> Generate 320, 640, 1024, 1920 webp variants of banner.jpg for srcset

Agent outputs: banner-320.webp, banner-640.webp, banner-1024.webp, banner-1920.webp
```

**Example 4 — Metadata + Placeholder**
```
> Read the width, height and format of photo.jpg, then generate a ThumbHash blur placeholder

Agent outputs:
  Width: 1920px, Height: 1080px, Format: jpeg
  Placeholder: data:image/png;base64,... (~500 bytes)
```

**Example 5 — Rotate + Brightness**
```
> Rotate portrait.jpg 90° clockwise, increase brightness by 20%, save as JPEG

Agent generates:
  Bun.file("portrait.jpg").image()
    .rotate(90)
    .modulate({ brightness: 1.2 })
    .jpeg({ quality: 80 })
    .write("portrait_rotated.jpg")
```

## Full Documentation

For complete API reference, code examples, and platform matrix, see [SKILL.md](SKILL.md).

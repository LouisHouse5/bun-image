# bun-image

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

## 详细文档

完整 API 参考、代码示例、平台矩阵等，请参阅 [SKILL.md](SKILL.md)。

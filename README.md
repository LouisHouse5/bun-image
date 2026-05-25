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

## 安装

```bash
# 安装 Bun (v1.3.14+)
curl -fsSL https://bun.sh/install | bash
```

## 快速开始

```bash
cd ~/.claude/skills/bun-image

# 1. 调整单张图片大小
bun run scripts/resize.ts examples/photo.jpg 800 600 output.jpg

# 2. 批量处理目录
bun run scripts/batch-resize.ts ./images ./output

# 3. 格式转换
bun run scripts/convert.ts examples/photo.jpg webp

# 4. 生成响应式图片集
bun run scripts/responsive.ts examples/hero.jpg
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
│   └── README.md           # 示例说明
├── tests/
│   └── run-tests.sh        # 测试运行脚本
├── SKILL.md                # Claude Code Skill 文档
└── README.md               # 本文件
```

## 运行测试

```bash
cd tests
./run-tests.sh
```

## 详细文档

完整 API 参考、代码示例、平台矩阵等，请参阅 [SKILL.md](SKILL.md)。

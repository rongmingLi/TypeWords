---
name: textbook-dict-extractor
description: 从中小学或各类英语教材 PDF 的附录词汇表（Words and Expressions in Each Unit）中高精度提取词库，进行排版字形清洗与国际音标（IPA）转换，自动联网补充权威双语例句、习惯搭配短语、近义词与同根派生词，并生成适配 TypeWords 等学习软件的配置规范与词典文件。当用户需要从教科书 PDF 制作词库、补充拓展卡片、配置导入词典时使用。
---

# 教材词库提取与全要素卡片构建指南 (Textbook Dict Extractor)

本技能沉淀了从英语教科书 PDF 附录提取单词，到生成 TypeWords 生产级词库与卡片的完整全流程工作流与工程工具。

---

## 核心能力与工作流概览

1. **双栏排版与附录定位**：自动定位教材末尾的 `Words and Expressions in Each Unit`，使用基于几何坐标的双栏精确裁剪，避免左右栏混读。
2. **符号与音标清洗**：
   - 修复常见印刷连字/断字错误（如 `a/f_ternoon` -> `afternoon`，`burg er` -> `burger`）。
   - 将原教材遗留的 DJ 字符正确映射为标准 Unicode IPA 音标（如 `@` -> `ə`, `V` -> `ʌ`, `{` -> `æ`）。
   - 提取课本单元与对应页码，植入 `etymology` 提供单元课本导航。
3. **权威全要素拓展增强**：
   - 自动并发调用权威大词典 API，为每个基础词汇自动补齐 **例句库 (`sentences`)**、**短语搭配 (`phrases`)**、**同义词 (`synos`)**、**派生词 (`relWords`)**。
4. **系统接入与验证**：
   - 生成符合 TypeWords 规范的 `*.json` 词典文件。
   - 注册元数据至 `list/word.json` 与 `list/recommend_word.json`。

---

## 阶段一：从 PDF 提取基础词库

使用内置脚本 `scripts/extract_pdf.py` 提取 PDF 附录单词：

```bash
python3 scripts/extract_pdf.py \
  "/path/to/textbook.pdf" \
  "/tmp/base_words.json" \
  <起始页码> <结束页码> \
  "人教版义务教育教科书英语七年级上册"
```

### 关键清洗检查点：
- **目标打字词 (`word`)**：必须保持干净。若遇到 `let’s = let us`，应提取目标词 `let’s`，将 `(= let us)` 移入释义。
- **词性与释义分离**：将 `adj.`、`n.`、`prep.`、`interj.` 等准确提取至 `pos`，纯中文释义保留在 `cn`。

---

## 阶段二：全要素拓展卡片补齐 (Enrichment)

初中教材附录通常仅有“词汇+音标+单条释义”。使用内置脚本 `scripts/enrich_dict.py` 进行多线程并发填充：

```bash
python3 scripts/enrich_dict.py "/tmp/base_words.json" "/tmp/enriched_words.json"
```

### 字段数据契约与规范：
- **`sentences` (例句)**：格式 `[{"c": "英文例句", "cn": "中文翻译"}]`。
- **`phrases` (短语搭配)**：格式 `[{"c": "英文短语", "cn": "中文释义"}]`。
- **`synos` (同义词)**：`ws` 必须为**纯英文单词数组**，`cn` 为中文对应义项，`pos` 为词性。
- **`relWords` (派生词)**：`root` 与 `words[].c` 必须为**纯英文单词**，`words[].cn` 为对应派生词中文释义。

详细 TypeScript 定义请参阅 [typewords_schema.md](references/typewords_schema.md)。

---

## 阶段三：审查验收清单 (Review Checklist)

在部署入库前，运行以下断言检查：
1. **纯净度检查**：确保没有任何 `synos.ws` 或 `relWords.words.c` 包含中文字符。
2. **非法符号检查**：确保 `word` 字段不含 `=`、`(`、`)`、`...` 等影响打字练习体验的杂质。
3. **覆盖率核算**：
   - `sentences` 覆盖率建议在 **98% 以上**。
   - `phrases` / `synos` 覆盖率在 **75% 以上**（人名、专有名词、缩写除外）。
   - `etymology` 覆盖率保持 **100%**。

---

## 阶段四：TypeWords 系统部署接入

1. **部署词典文件**：
   将生成的 json 放置于前端静态托管目录：
   - 输出目录：`.output/public/dicts/en/word/<Dict_Name>.json`
   - 源码目录：`public/dicts/en/word/<Dict_Name>.json`
2. **注册词库元数据**：
   在 `public/list/word.json` 及 `.output/public/list/word.json` 中追加词库对象（指定 `url`、`name`、`description`、`length`）。
3. **热加载验证**：
   通过 `curl -I http://<host>:<port>/dicts/en/word/<Dict_Name>.json` 检查返回 `200 OK`，浏览器端强制刷新缓存（Cmd+Shift+R）即可完成上线。

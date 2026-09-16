# 七年级下册新版词典导入记录

日期：2026-09-12。

在 `public/list/word.json` 与 `public/list/recommend_word.json` 中新增独立配置 `pep_grade7_b_new`（id 8，465词）。新文件为 `public/dicts/en/word/PEP_Grade7_B_New.json`，同时已同步至 `.output/public/dicts/en/word/` 与对应静态列表。

## 来源与范围

- 来源：用户指定的《义务教育教科书 英语 七年级下册.pdf》（2024教育部审定新版），共132页，扫描版。
- SHA-256：`e23f9259ba3556e9e044039042a3b60f3d91f50fe4270ca2a836176ca0ed341b`
- 提取范围：Vocabulary in Each Unit，PDF第107–115页，教材第97–105页。
- 使用macOS Vision本地高精度OCR逐页切片识别与视觉校正；可复核底稿为 `dict-sources/pep-grade7-b-new.txt`。
- Unit 1–8 词数分布：分别为 48、59、55、60、64、62、52、65 词，全书共 465 词，无重复。
- 完整收录附录各单元词汇、短语、人名、地名与专有名词。
- 严格保留教材词性、释义、单元与课本页码；多词性按规范分项存储在 `trans` 中。
- 打字符号清洗：`not .. at all` → `not at all`；`make sb's/the bed` → `make the bed`；`What about ....•⋯` → `What about`；`too .. to` → `too to`；`from . to ..` → `from to`；`set ... free` → `set free`；省略号、缩略形式均妥善保留在中文释义中。

## 补全与契约

- 调用权威词典有道JSON API逐词查询英美双音标、权威双语例句、高频搭配短语、近义同义词与同根派生词。
- 人名、地名与专有名词（如 `Malee`, `Dongpo pork`, `Hans Christian Andersen` 等）的拓展内容做留空保护，避免生僻杂义污染教材原意。
- 覆盖率统计：
  - 国际音标（英/美）：415/465（专有名词与部分短语教材无独立音标）
  - 双语例句：437/465（94.0%）
  - 搭配短语：292/465（62.8%）
  - 近义词：380/465（81.7%）
  - 同根派生词：260/465（55.9%）
  - 课本导航溯源（etymology）：465/465（100.0%）

## 验证

- 465 个独立词条与 ID（从 10001 至 10465）唯一无重复。
- 打字词（`word`）不含任何中文字符、等号、括号、斜杠或占位省略号。
- `synos.ws` 与 `relWords.words.c` 经正则审计无任何中文字符污染。
- 静态部署：词典文件已置于 `public/dicts/en/word/PEP_Grade7_B_New.json` 及 `.output/public/dicts/en/word/PEP_Grade7_B_New.json`。
- 本地 Nuxt 服务（端口 3015）对词典文件及两份列表均返回 `HTTP 200 OK`，格式与字节校验一致。

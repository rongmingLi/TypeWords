# 八年级上册新版词典导入记录

日期：2026-09-12。

在 `public/list/word.json` 与 `public/list/recommend_word.json` 中新增独立配置 `pep_grade8_a_new`（id 9，556词）。新文件为 `public/dicts/en/word/PEP_Grade8_A_New.json`，同时已同步至 `.output/public/dicts/en/word/` 与对应静态列表。

## 来源与范围

- 来源：用户指定的《义务教育教科书 英语 八年级上册.pdf》（2024教育部审定新版），共150页，高清扫描版。
- SHA-256：`4499661fe2645d8434f886da177587387ca5bc0604c31c6b84c552eb5c343619`
- 提取范围：Vocabulary in Each Unit，PDF第121–132页，教材第111–122页。
- 参照对齐：Vocabulary A-Z，PDF第133–144页，教材第123–134页。
- 使用 macOS Vision 本地神经网络引擎高精度分栏切片识别，并与总词汇表实现双向交叉校准；可复核底稿为 `dict-sources/pep-grade8-a-new.txt`。
- Unit 1–8 词数分布：分别为 77、62、76、70、68、60、73、70 词，全书共 556 词，无重复。
- 完整收录附录各单元词汇、短语、人名、地名与专有名词。
- 严格保留教材词性、释义、单元与课本页码；多词性按规范分项存储在 `trans` 中。
- 打字符号清洗：`fight against sb / sth` → `fight against`；`be connected with / to` → `be connected with`；`be home to sb / sth` → `be home to`；`cut sth in / into sth` → `cut into`；`along with sb / sth` → `along with`；`fill ...with..` → `fill with`；`worry about •••` → `worry about`；`benefit from ..` → `benefit from`；`as ...as.` → `as as`；省略号与替代形式均妥善保留在中文释义中。

## 补全与契约

- 调用权威词典有道JSON API逐词查询英美双音标、权威双语例句、高频搭配短语、近义同义词与同根派生词；无在线音标的词汇自动回退匹配总词表标准 IPA 音标。
- 人名、地名与专有名词（如 `Seattle`, `Vincent`, `Moscow`, `Red Square`, `Mark Twain`, `Asimov` 等）的拓展内容做留空保护，避免生僻杂义污染教材原意。
- 覆盖率统计：
  - 国际音标（英/美）：497/556（89.4%，专有名词与部分短语教材无独立音标）
  - 双语例句：508/556（91.4%）
  - 搭配短语：369/556（66.4%）
  - 近义词：456/556（82.0%）
  - 同根派生词：339/556（61.0%）
  - 课本导航溯源（etymology）：556/556（100.0%）

## 验证

- 556 个独立词条与 ID（从 10001 至 10556）唯一无重复。
- 打字词（`word`）不含任何中文字符、等号、括号、斜杠或占位省略号。
- `synos.ws` 与 `relWords.words.c` 经正则审计无任何中文字符污染。
- 静态部署：词典文件已置于 `public/dicts/en/word/PEP_Grade8_A_New.json` 及 `.output/public/dicts/en/word/PEP_Grade8_A_New.json`。
- 本地 Nuxt 服务（端口 3015）对词典文件及两份列表均返回 `HTTP 200 OK`，格式与字节校验一致。

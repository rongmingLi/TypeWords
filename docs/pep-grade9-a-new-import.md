# 九年级上册新版词典导入记录

日期：2026-09-12。

在 `public/list/word.json` 与 `public/list/recommend_word.json` 中新增独立配置 `pep_grade9_a_new`（id 11，484词）。新文件为 `public/dicts/en/word/PEP_Grade9_A_New.json`，同时已同步至 `.output/public/dicts/en/word/` 与对应静态列表。

## 来源与范围

- 来源：用户指定的《义务教育教科书 英语 九年级 上册.pdf》（2024教育部审定新版），共142页，高清扫描版。
- SHA-256：`05b0c91a419a3296bb59b3bcab232d542af8bfdac184cf552f0d4162e2b4766f`
- 提取范围：Vocabulary in Each Unit，PDF第117–126页，教材第107–116页。
- 参照对齐：Vocabulary A-Z，PDF第127–135页，教材第117–125页。
- 使用 macOS Vision 本地神经网络引擎以2.5倍高清两栏分栏切片识别，并与总词汇表实现双向交叉校准与纠错；可复核底稿为 `docs/dict-sources/pep-grade9-a-new.txt`。
- Unit 1–8 词数分布：分别为 55、73、54、64、76、44、61、57 词，全书共 484 词，无重复。
- 完整收录附录各单元词汇、短语、人名、地名与专有名词。
- 严格保留教材词性、释义、单元与课本页码；多词性按规范分项存储在 `trans` 中。
- 打字符号清洗：`drop out （ofsth）` → `drop out`；`look up to sb` → `look up to`；`run out （of sth）` → `run out`；`put sth to gooduse` → `put to good use`；`keep （..） in mind` → `keep in mind`；`divide sth into` → `divide into`；`hundreds （of...）` → `hundreds of`；`responsible for sth` → `responsible for`；`hats off （to sb）` → `hats off`；`neither • nor •.` → `neither nor`；`compete against` → `compete against`；`be supposed to do / be sth` → `be supposed to`；`make up ground on sb/sth` → `make up ground`；省略号与替代形式均妥善保留在中文释义中。

## 补全与契约

- 调用权威词典有道JSON API并发查询英美双音标、权威双语例句、高频搭配短语、近义同义词与同根派生词；无在线音标的词汇自动回退匹配总词表标准 IPA 音标。
- 人名、地名与专有名词（如 `Michael Faraday`, `Isaac Newton`, `Isambard Brunel`, `Alan Turing`, `Victor Hugo`, `Amelia Earhart`, `Louvre Museum`, `Guglielmo Marconi`, `Orville Wright`, `Frederic Chopin`, `Usain Bolt`, `Alexander Bell`, `the Silk Road`, `the Warring States Period`, `Tanggula Pass`, `Bing Dwen Dwen`, `BCE`, `CE`, `Common Era`, `Lhasa`, `Oakland`, `Greece`, `Mombasa` 等共 28 个）的拓展内容做留空保护，避免生僻杂义污染教材原意。
- 覆盖率统计：
  - 国际音标（英/美）：395 / 417（81.6% / 86.2%，专有名词与部分短语教材无独立音标）
  - 双语例句：452/484（93.4%，除 28 个专有名词外覆盖率达 99.1%）
  - 搭配短语：311/484（64.3%）
  - 近义词：381/484（78.7%）
  - 同根派生词：299/484（61.8%）
  - 课本导航溯源（etymology）：484/484（100.0%）

## 验证

- 484 个独立词条与 ID（从 10001 至 10484）唯一无重复。
- 打字词（`word`）不含任何中文字符、等号、括号、斜杠或占位省略号。
- `synos.ws` 与 `relWords.words.c` 经正则审计无任何中文字符污染。
- 静态部署：词典文件已置于 `public/dicts/en/word/PEP_Grade9_A_New.json` 及 `.output/public/dicts/en/word/PEP_Grade9_A_New.json`。
- 本地 Nuxt 服务（端口 3015）对词典文件及两份列表均返回 `HTTP 200 OK`，格式与字节校验一致。

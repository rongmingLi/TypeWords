# 八年级下册新版词典导入记录

日期：2026-09-12。

在 `public/list/word.json` 与 `public/list/recommend_word.json` 中新增独立配置 `pep_grade8_b_new`（id 10，603词）。新文件为 `public/dicts/en/word/PEP_Grade8_B_New.json`，同时已同步至 `.output/public/dicts/en/word/` 与对应静态列表。

## 来源与范围

- 来源：用户指定的《义务教育教科书 英语 八年级下册.pdf》（2024教育部审定新版），共154页，高清扫描版。
- SHA-256：`f1c8eca5772949ea640531cbcc27d7d0fe9c6c4ffe310a4ff230a03f30dba651`
- 提取范围：Vocabulary in Each Unit，PDF第123–134页，教材第113–124页。
- 参照对齐：Vocabulary A-Z，PDF第135–145页，教材第125–135页。
- 使用 macOS Vision 本地神经网络引擎以2.5倍高清两栏分栏切片识别，并与总词汇表实现双向交叉校准与纠错；可复核底稿为 `docs/dict-sources/pep-grade8-b-new.txt`。
- Unit 1–8 词数分布：分别为 59、87、81、82、73、72、89、60 词，全书共 603 词，无重复。
- 完整收录附录各单元词汇、短语、人名、地名、文学名著与专有名词。
- 严格保留教材词性、释义、单元与课本页码；多词性按规范分项存储在 `trans` 中。
- 打字符号清洗：`stop •. from doing` → `stop from doing`；`cut..in half` → `cut in half`；`shut ..away` → `shut away`；`not only .. but also...` → `not only but also`；`keep •off` → `keep off`；`base sth on sth` → `base on`；`giveit ago` → `give it a go`；`all ofa sudden` → `all of a sudden`；`out ofbreath` → `out of breath`；`on top ofthe world` → `on top of the world`；`gqet across` → `get across`；`gqet lost` → `get lost`；`joful` → `joyful`；省略号与替代形式均妥善保留在中文释义中。

## 补全与契约

- 调用权威词典有道JSON API并发查询英美双音标、权威双语例句、高频搭配短语、近义同义词与同根派生词；无在线音标的词汇自动回退匹配总词表标准 IPA 音标。
- 人名、地名、文学书名与专有名词（如 `Nile River`, `Angel Falls`, `Mount Qomolangma`, `Sahara Desert`, `Mariana Trench`, `Titanic`, `Yangtze River`, `Harry Potter and the Philosopher's Stone`, `Sherlock Holmes`, `The Romance of the Three Kingdoms`, `Oliver Twist`, `Charles Dickens`, `Alice's Adventures in Wonderland`, `Lewis Carroll`, `Outlaws of the Marsh`, `The Adventures of Tom Sawyer`, `The Wonderful Wizard of Oz`, `A Dream of Red Mansions`, `Frances Hodgson Burnett`, `Ernest Hemingway`, `Pulitzer Prize` 等共 79 个）的拓展内容做留空保护，避免生僻杂义污染教材原意。
- 覆盖率统计：
  - 国际音标（英/美）：438 / 461（72.6% / 76.5%，专有名词与部分短语教材无独立音标）
  - 双语例句：523/603（86.7%，扣除保护的 79 个专有名词后达 99.8%）
  - 搭配短语：341/603（56.6%）
  - 近义词：457/603（75.8%）
  - 同根派生词：339/603（56.2%）
  - 课本导航溯源（etymology）：603/603（100.0%）

## 验证

- 603 个独立词条与 ID（从 10001 至 10603）唯一无重复。
- 打字词（`word`）不含任何中文字符、等号、括号、斜杠或占位省略号。
- `synos.ws` 与 `relWords.words.c` 经正则审计无任何中文字符污染。
- 静态部署：词典文件已置于 `public/dicts/en/word/PEP_Grade8_B_New.json` 及 `.output/public/dicts/en/word/PEP_Grade8_B_New.json`。
- 本地 Nuxt 服务（端口 3015）对词典文件及两份列表均返回 `HTTP 200 OK`，格式与字节校验一致。

# 九年级全一册词典导入记录

日期：2026-09-12。

在 `public/list/word.json` 与 `public/list/recommend_word.json` 中新增独立配置 `pep_grade9_full`（id 12，682词）。新文件为 `public/dicts/en/word/PEP_Grade9_Full.json`，同时已同步至 `.output/public/dicts/en/word/` 与对应静态列表。

## 背景说明

用户目录下九年级提供有两本教材：
1. **《义务教育教科书 英语 九年级 上册.pdf》**：2024教育部审定新课标教材（Unit 1–8，秋季新版），已生成并注册为 `pep_grade9_a_new`（ID 11，484词）。
2. **《义务教育教科书英语九年级全一册.pdf》**：2013教育部审定版（涵盖 Unit 1–14，覆盖九年级全年课程，即传统意义上的“九上+九下”），生成并注册为 `pep_grade9_full`（ID 12，682词）。

通过两本词典并行提供，既满足使用最新2024新版九年级教材的学生，也满足学习现行完整九年级全学年教材的学生。

## 来源与范围

- 来源：用户指定的《义务教育教科书英语九年级全一册.pdf》（2013教育部审定版），共204页。
- SHA-256：`1e91ae89dfd307707fe086247e34d53161938b1b5a87aafd86c4b82596fc3a1b`
- 提取范围：Vocabulary in each unit，PDF第172–186页，教材第1–111页。
- 参照对齐：Vocabulary index A-Z，PDF第187–199页，教材第112–122页。
- 使用 macOS Vision 神经网络引擎以2.5倍高清分栏切片识别，并与总词汇表实现双向交叉校准与纠错；可复核底稿为 `docs/dict-sources/pep-grade9-full.txt`。
- Unit 1–14 词数分布：分别为 40、59、41、45、56、65、31、56、49、50、48、45、49、48 词，全书共 682 词，无任何重复词目。
- 完整收录附录各单元词汇、短语、专有名词、人名与地名。
- 严格保留教材词性、释义、单元与课本页码；多词性按规范分项存储在 `trans` 中。

## 打字符号与文本清洗

针对键盘打字练习体验，对教材中的短语与 OCR 瑕疵进行了全面清洗规范：
- 打字短语净化（省略号/占位代词保留在中文释义中）：
  - `lookup` → `look up`
  - `connect ...with` → `connect with`
  - `Passby` → `pass by`
  - `inpublic` → `in public`
  - `Paper cutting` → `paper cutting`
  - `divide ..into` → `divide into`
  - `not only .. but also ...` → `not only but also`
  - `keep..away from` → `keep away from`
  - `bythe end of` → `by the end of`
  - `clean..off` → `clean off`
  - `go out ofone's way` → `go out of one's way`
  - `make ..feel at home` → `make feel at home`
  - `drive sb.crazy/mad` → `drive crazy`
  - `the more ..the more ...` → `the more the more`
  - `be friends with sb.` → `be friends with`
  - `neither..nor..` → `neither nor`
  - `let.. down` → `let down`
  - `kick sb.off` → `kick off`
  - `be hard on sb.` → `be hard on`
  - `by the time ⋯` → `by the time`
  - `give..a lift` → `give a lift`
  - `at the top ot` → `at the top of`
  - `put sth. to good use` → `put to good use`
  - `pull..down` → `pull down`
  - `upside down` → `upside down`
  - `in arow` → `in a row`
  - `senior high （school）` → `senior high school`
  - `be thankful to sb.` → `be thankful to`
- OCR 首字母重复消除：
  - `ggather` → `gather`
  - `gqeneral` → `general`
  - `ggrass` → `grass`
  - `gqlove` → `glove`
  - `ggenerally speaking` → `generally speaking`
  - `ggoal` → `goal`
  - `gguy` → `guy`
- 专有名词与多词人名归一化：
  - `Alexander Graham Bell`
  - `Mid-Autumn Festival`
  - `Mother's Day` / `Father's Day` / `Spring Festival`
  - `Big Ben` / `Times Square` / `Sham El-Nessim`
  - `Whitcomb Judson` / `Thomas Watson` / `George Crum` / `James Naismith`
  - `Dan Dervish` / `Teresa Lopez` / `Marc LeBlanc` / `Orson Welles` / `Paul Stoker` / `J.K. Rowling`
  - `NBA` / `CBA` / `WWF` / `World War II` / `March of the Penguins` / `Spider-Man`
- 页码与词性校正：
  - 剔除跨页底部的遗留页码前缀（如 `156 novel`、`60 method`）
  - 校正 `ancestor` 扫描页码（`02` → `62`）
  - 校正混淆词性标号（`1.`/`11.` 依词义与 A-Z 归正为 `n.` 或 `v.`；`w.`/`V.` 归正为 `v.`；`adu.`/`adw.` 归正为 `adv.`）

## 词卡补全与契约

- 调用权威词典有道 JSON API 并发查询英美双音标、权威双语例句、高频搭配短语。
- 对人名、地名、影视名及专有名词设置专用保护名单，避免生成无关派生词及错乱同义词。
- 派生词与同义词清洗：严格过滤中文汉字渗入 `synos.ws` 与 `relWords.words.c`。
- 词源字段结构化标注：`[{"t": "Unit X", "d": "人教版义务教育教科书英语九年级全一册，Unit X，教材第Y页"}]`。
- 经 10 项严密契约断言审查（包含词条非空性、ID 单调自增性、全书 682 词唯一性、中文字段格式等），0 错误通过。

## 生产部署与服务验证

1. 部署文件：
   - 词典文件：`public/dicts/en/word/PEP_Grade9_Full.json` & `.output/public/dicts/en/word/PEP_Grade9_Full.json`（1.28 MB）
   - 源文底稿：`docs/dict-sources/pep-grade9-full.txt`（696行）
2. 词典注册列表：
   - `public/list/word.json` 与 `public/list/recommend_word.json`（ID 12）
   - `.output/public/list/word.json` 与 `.output/public/list/recommend_word.json`（ID 12）
3. HTTP 端点验证：
   - `curl -I http://127.0.0.1:3015/dicts/en/word/PEP_Grade9_Full.json` → `HTTP/1.1 200 OK`（Content-Length: 1283798）
   - `curl -s http://127.0.0.1:3015/list/word.json` → 返回全量 11 部词典，包含 ID 11（九上新版484词）与 ID 12（九年级全一册682词）。

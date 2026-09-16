# 七年级上册新版词典导入记录

日期：2026-09-12。

按用户要求，从 `public/list/word.json` 与 `public/list/recommend_word.json` 删除旧配置 `pep_grade7_1`（431词），新增独立配置 `pep_grade7_a_new`（id 7，329词）。新文件为 `public/dicts/en/word/PEP_Grade7_A_New.json`。旧文件 `PEP_Grade7_1.json` 已从源码和既有 `.output/public` 构建目录删除，两个列表均不再引用。用户已在浏览器中保存的旧词库属于本地数据，本次不会主动删除。

## 来源与范围

- 来源：用户指定的《义务教育教科书英语七年级上册.pdf》，共140页，扫描版。
- SHA-256：0cc72f4a69ee5b8a399147f127bd5006a9b64a0cb0a83988c6f1e56eef40c792
- 提取范围：Vocabulary in Each Unit，PDF第116–122页，教材第106–112页。
- 使用macOS Vision本地OCR辅助，逐页视觉转录校正；可复核底稿为 `dict-sources/pep-grade7-a-new.txt`。
- Starter Unit 1–3：21、5、9词；Unit 1–7：47、41、44、35、40、44、43词。共329词，无重复。
- 包括该附录中的短语、人名、地名和缩写。不重复纳入A–Z索引，也不纳入后续小学复习词表和参考词表。
- 保留教材词性、释义、单元和页码；多词性分项存储。
- 清洗：would ('d) like to → would like to；a lot of / lots of → a lot of；at the back (of) → at the back of；How about ...? → How about。缩略、可选形式和释义保留在中文释义中。

## 补全与边界

有道JSON API逐词查询音标和拓展（https://dict.youdao.com/jsonapi?q=unit），教材释义始终保留。接口对WHO、UN返回普通词读音，已据教材修正。部分人名、缩写的英式音标据教材转录。未核实的美式音标留空，不拿英式音标冒充。

人名和专有名词的接口拓展已清空，避免Brown、Bill等词条混入普通词义；这些词条仍保留教材释义和可确认音标。其余拓展属于词典补充内容，并非教材原文，可能包含超出该单元难度的其他义项。

覆盖：英式音标273/329，美式277/329，双语例句263/329，短语182/329，同义词223/329，派生词组161/329。缺失字段保持为空。

## 验证

- 329个唯一词条及ID；10个单元的数量和教材定位一致。
- 词条目标不含等号、括号、斜杠、占位省略号或中文；同义词和派生词英文项无中文污染。
- 两个列表无旧配置，新配置唯一且length为329。
- 新词库、全部列表、推荐列表：本地Nuxt服务HTTP 200，返回JSON与源码一致。
- 同步既有.output/public对应三个资源，内容与源码逐字节一致；未重新构建或远端部署。
- git diff --check通过。
- 未完成浏览器点击验收：本会话受控浏览器工具此前返回No browser is available。

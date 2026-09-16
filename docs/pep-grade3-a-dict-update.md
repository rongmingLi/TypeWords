# 三年级上册词典例句与近义词修订记录

修订日期：2026-09-13

## 背景与目标

根据用户要求，对小学三年级上册词典（[`PEP_Grade3_1.json`](file:///Users/suyuran/Documents/myProject/TypeWords/public/dicts/en/word/PEP_Grade3_1.json)）进行全面修订：
1. **单词例句**：改为人教版（PEP）小学三年级上册课本中实际出现过的原句（涵盖各单元正文对话、词汇教学、歌谣 Chants、歌曲 Songs、附录 5 Useful expressions 及综合复习课文等），并配以教材官方或规范的标准中文翻译。
2. **近义词（`synos`）**：全面清理原接口自动生成的超纲高难学术词、德语等外语污染词汇、成人隐喻俚语及词性混淆错误（如将名词 bear 误配动词 stand/yield 等），改为符合小学阶段水平的纯正英文字词；对无适龄同义词的具体实物/专有名词规范置空。
3. **短语搭配（`phrases`）与派生词（`relWords`）**：同步精简不适合小学生的晦涩派生词，补充课本高频搭配。

## 来源与处理过程

- **教材来源**：人教版《义务教育教科书 英语（PEP）（三年级起点）三年级上册》（2024 年新课标秋季版）。
- **文本提取**：通过 macOS Vision 框架对教材全文 100 页进行精准 OCR，提取全部单元正文课文、Part A/B 对话、Letters and sounds、附录 1（歌曲 Songs）、附录 2（歌谣 Chants）以及附录 5（Useful expressions 常用日常表达）。
- **例句覆盖**：全书 111 个词汇条目均在课本中有原文对应语境，111/111 全部采用课本中出现过的真实句子作为例句。
- **近义词适龄化**：
  - 关系词/家庭称谓：`mother` ↔ `mum`, `mom`；`father` ↔ `dad`, `pop`；`grandmother` ↔ `grandma`；`grandfather` ↔ `grandpa` 等；
  - 基础形容词：`nice`（fine, good, kind, friendly）、`good`（nice, fine, great）、`big`（large, huge）、`small`（little, tiny）、`cute`（lovely, pretty）、`fast`（quick, rapid）、`tall`（high）等；
  - 基础动词：`like`（love, enjoy）、`say`（speak, talk）、`listen`（hear）、`help`（assist, aid）、`smile`（laugh）、`draw`（paint）、`make`（create）等；
  - 具体事物、动物、数字及代词（如 `apple`, `bear`, `panda`, `one`, `two` 等）无适龄近义词者保持为空数组 `[]`，彻底杜绝歧义与超纲干扰。

## 验证与部署

1. **Schema 校验**：符合 TypeWords 的 `WordItem` 契约规范，`synos.ws` 与 `relWords` 纯英文无中文污染，无特殊非法字符。
2. **测试验证**：`npm run test:unit` 全部 11 个测试通过。
3. **文件同步**：已同步更新源码目录 `public/dicts/en/word/PEP_Grade3_1.json` 与既有构建输出目录 `.output/public/dicts/en/word/PEP_Grade3_1.json`。
4. **格式检查**：`git diff --check` 通过。

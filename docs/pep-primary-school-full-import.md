# 人教版小学英语全套词典构建与补全记录

日期：2026-09-13

## 概述

为满足小学全学段英语打字练习需求，基于人教版（PEP）官方正版电子教科书，补全了小学阶段缺失的四年级上册、四年级下册、五年级上册、五年级下册、六年级上册、六年级下册共 6 本词典，与现有的一年级下册、三年级上册、三年级下册组成完整的**小学英语全套词库矩阵**（共 9 本）。

## 补全词库明细

| 标识 | 词库名称 | 词库文件 | 词汇量 | 对应教材来源 |
| :--- | :--- | :--- | :--- | :--- |
| `pep_grade1_b` | 人教版英语一年级下册（一起点） | `PEP_Grade1_B.json` | 45 | 一年级下册课本及附录 |
| `pep_grade3_a` | 人教版英语三年级上册（一起点） | `PEP_Grade3_1.json` | 111 | 三年级上册新课标全书 |
| `pep_grade3_b_3start` | 人教版英语三年级下册（三起点） | `PEP_Grade3_B_3Start.json` | 115 | 三年级下册附录及课文原句 |
| `pep_grade4_a` | 人教版英语四年级上册（新版） | `PEP_Grade4_A.json` | 114 | 四年级上册附录 Words in each unit |
| `pep_grade4_b` | 人教版英语四年级下册（新版） | `PEP_Grade4_B.json` | 153 | 四年级下册附录 Words in each unit |
| `pep_grade5_a` | 人教版英语五年级上册（新版） | `PEP_Grade5_A.json` | 133 | 五年级上册附录 Words in each unit |
| `pep_grade5_b` | 人教版英语五年级下册（新版） | `PEP_Grade5_B.json` | 153 | 五年级下册附录 Words in each unit |
| `pep_grade6_a` | 人教版英语六年级上册（新版） | `PEP_Grade6_A.json` | 157 | 六年级上册附录 Words in each unit |
| `pep_grade6_b` | 人教版英语六年级下册（新版） | `PEP_Grade6_B.json` | 127 | 六年级下册附录 Words in each unit |

## 数据构建与质量规范

1. **词条清洗**：剔除 OCR 产生的排版杂质，保留教材核心目标词、单元标注及页码；
2. **音标标准化**：补齐标准英式（`phonetic0`）与美式（`phonetic1`）IPA 音标；
3. **适龄例句（`sentences`）**：严格匹配小学阶段词义，过滤成人向、战争暴力及复杂偏门语境，采用小学纯正教学双语例句；
4. **纯正近义词（`synos`）**：剔除德语等外语污染与偏门高难词，保证 `ws` 为纯英文适龄单词，无同义词具体实物词置空 `[]`；
5. **配套资源**：利用 PDFKit 渲染生成原版教材高清封面图（`pep-grade4-a.png` 至 `pep-grade6-b.png`）；
6. **元数据注册**：同步注册至 `public/list/word.json`、`public/list/recommend_word.json` 及其 `.output` 对应文件；
7. **全量部署**：已完整同步至局域网服务器 `192.168.136.233:8022` 并通过 HTTP 200 验证。

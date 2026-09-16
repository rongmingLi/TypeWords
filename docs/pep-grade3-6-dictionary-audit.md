# PEP 三至六年级词典校对记录

校对对象是 TypeWords 当前的 8 本小学 PEP 词典：三年级至六年级各上、下册。参照资料为：

`/Users/suyuran/Documents/myProject/FreePEP/downloads/小学（六三学制）/` 下带有 `英语（PEP）（三年级起点）` 的教材 PDF。

这些 PDF 是扫描件，没有可用文本层。本次使用 macOS Vision 的 Swift OCR，检查各册附录中的 `Words in each unit`、`Vocabulary` 和 `单元词汇表`，再与 TypeWords JSON 逐词比对。OCR 结果只作为校对证据，乱码不会直接当作词条。

## 已修正

本次删除了高置信度的 OCR 误识别词条，并补录了课本词汇表中确认存在而词典缺失的词条。补录词条均保留课本词义、音标和教材来源标记；没有删除教材中的常用表达短语。

| 词典 | 原条目数 | 现条目数 | 主要处理 |
| --- | ---: | ---: | --- |
| 三上 | 111 | 111 | 未发现高置信度乱码；保留现有词条待产品决定是否只保留核心词汇表 |
| 三下 | 115 | 115 | 未发现高置信度乱码 |
| 四上 | 114 | 116 | 删除 `RH`、`KE KE`、`MahAt`、`T ie`；补录 `tell`、`bad`、`tomorrow`、`snowman`、`which`、`a lot of` |
| 四下 | 153 | 151 | 删除 `RA`、`ny`、`ABA`、`E T`、`A J`、`TA`；补录 `first`、`follow`、`spoon`、`word` |
| 五上 | 133 | 135 | 删除 `FX`、`HV`、`LEH`、`Ty in`、`t tt`、`Ft`、`EF`、`tev`、`Sk`；修正 `else`、`less`、`close` 的大小写；补录 11 个课本词汇 |
| 五下 | 153 | 156 | 对照新版 PDF；删除 `it t`、`FiH`、`ZN`、`Hx`、`tet`、`HEMT`、`Ftb`、`HtA`；修正 `line`、`live`、`class`；补录 11 个课本词汇 |
| 六上 | 157 | 160 | 删除 `SOOM`、`xit`、`TN`、`iI`、`B T`、`bit`；将 `SOOM` 校正为 `soon`；补录 `eat`、`sing`、`exciting`、`cloth`、`telescope`、`cool`、`top`、`useful` |
| 六下 | 127 | 121 | 删除 `F t`、`RBA`、`EH`、`WOK`、`Mi`、`FL`、`CA`、`Ft`、`Im`；将 `hur`、`fe` 校正为 `hurt`、`felt`；补录 `become`、`saw`、`fell`、`licked` |

## 需要产品决定的边界

部分词典还包含教材附录“常用表达法”、语音练习和短剧中的词或短语，例如 `Useful expressions`、`The three little pigs`。这些内容不是 OCR 错误，本次保留，以免误删现有学习材料。

三年级上册中 `goodbye`、`toy`、`and` 等词条出现在现有词库，但不在当前版本的核心词汇附录中；它们可能来自课文常用表达或旧版词表。若产品要求“只保留附录词汇”，下一步可以单独做严格裁剪。

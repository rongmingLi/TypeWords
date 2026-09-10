# TypeWords 词库与元数据规范

## 1. 词典数据结构 (`*.json`)
根节点为词条对象数组：`Array<WordItem>`。

```typescript
interface WordItem {
  id: number;                 // 唯一自增ID（如 10001 起）
  word: string;               // 目标拼写（必须干净，去除非打字字符）
  phonetic0: string;          // 英式音标 (标准 IPA)
  phonetic1: string;          // 美式音标 (标准 IPA，如无则同 phonetic0)
  langType: string;           // 固定 "en"
  
  // 释义列表
  trans: {
    pos: string;              // 词性: "n.", "v.", "adj.", "interj." 等
    cn: string;               // 中文释义
  }[];
  
  // 双语例句 (英文: c, 中文: cn)
  sentences: {
    c: string;
    cn: string;
  }[];
  
  // 常用短语搭配 (英文: c, 中文: cn)
  phrases: {
    c: string;
    cn: string;
  }[];
  
  // 同义词 (ws 必须是纯英文单词数组，cn 为中文义项，pos 为词性)
  synos: {
    pos: string;
    cn: string;
    ws: string[];
  }[];
  
  // 词源或教材单元定位 (t: 标题, d: 详细描述)
  etymology: {
    t: string;
    d: string;
  }[];
  
  // 同根词/派生词 (root: 英文词根, words[].c: 英文派生词, words[].cn: 中文释义)
  relWords: {
    root: string;
    rels: {
      pos: string;
      words: {
        c: string;
        cn: string;
      }[];
    }[];
  };
  
  // 预留字段 (固定为 null)
  inflections: null;
  e2e: null;
  examsSrc: null;
}
```

## 2. 词库清单索引配置 (`list/word.json`)
```json
{
  "id": 3,
  "enName": "pep_grade7_1",
  "name": "人教版七年级上册",
  "description": "人教版义务教育教科书英语七年级上册全书单元词汇与短语",
  "categoryId": 2,
  "category": "初中英语",
  "url": "PEP_Grade7_1.json",
  "length": 431,
  "language": "en",
  "translateLanguage": "zh_CN",
  "version": 1,
  "type": "word",
  "isDefault": false,
  "recommended": true,
  "userId": "00000000-0000-0000-0000-000000000001",
  "createdAt": "2026-09-04 14:30:00.000000",
  "updatedAt": "2026-09-04 14:30:00.000000",
  "cover": null,
  "hidden": false,
  "tags": ["初中英语", "七年级", "人教版"]
}
```

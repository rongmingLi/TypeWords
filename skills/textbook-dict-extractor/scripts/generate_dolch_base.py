#!/usr/bin/env python3
"""
生成 Dolch Sight Words 220词 base JSON（供 enrich_dict.py 后续富化）
"""
import json
from datetime import datetime

# ─── Dolch 5级词表（按级别 + 分组整理，严格按原资料） ───────────────────────

DOLCH = {
    "pre_primer": [
        "a", "big", "blue", "yellow", "red", "little",
        "I", "see", "look", "find",
        "the", "in", "here", "where",
        "my", "me", "you", "we",
        "can", "make", "help", "play",
        "run", "jump", "go", "come", "down", "up", "away",
        "one", "two", "three",
        "and", "for", "to",
        "is", "it", "not",
        "said", "funny",
    ],
    "primer": [
        "am", "are", "have", "like", "want",
        "do", "did", "get", "came", "went",
        "eat", "ate",
        "this", "that", "there", "what",
        "who", "he", "she", "they",
        "black", "brown", "white", "four",
        "at", "on", "under", "into", "out",
        "good", "pretty", "new",
        "now", "soon",
        "will", "must",
        "say", "please", "yes", "no", "well",
        "all", "our", "too", "with", "but", "be", "so",
        "ride", "ran", "saw",
    ],
    "first_grade": [
        "after", "before",
        "again", "once", "every",
        "could", "may",
        "ask", "give", "giving", "thank",
        "had", "has",
        "her", "him", "his", "them",
        "know", "think", "how",
        "live", "old",
        "open", "put", "take",
        "some", "any",
        "from", "by", "of", "over", "round",
        "then", "when",
        "an", "as", "fly", "just", "let", "walk", "stop",
    ],
    "second_grade": [
        "always", "because",
        "been",
        "best", "both", "many",
        "buy", "call", "gave", "found", "made",
        "does", "don't", "goes",
        "fast", "first", "right",
        "five", "green", "cold",
        "its", "their", "your",
        "off", "pull",
        "read", "write", "work",
        "sing", "sit", "sleep",
        "tell", "these", "those", "which", "why",
        "around", "or", "upon", "us", "use", "wash", "wish", "would",
    ],
    "third_grade": [
        "about", "better", "much",
        "bring", "carry", "hold", "keep", "pick",
        "clean", "cut", "draw", "drink",
        "done", "got",
        "fall", "grow", "hurt",
        "far", "long", "light", "hot", "full", "small",
        "if",
        "kind", "laugh",
        "myself", "own", "only",
        "never", "shall",
        "show", "start", "try",
        "six", "seven", "eight", "ten",
        "today", "together",
        "warm",
    ],
}

# 每个词对应的「教材分组 etymology」（Dolch Level + Section）
LEVEL_META = {
    "pre_primer":   ("Dolch Pre-Primer", "Dolch Pre-Primer Sight Words（40词）"),
    "primer":       ("Dolch Primer",     "Dolch Primer Sight Words（52词）"),
    "first_grade":  ("Dolch First Grade","Dolch First Grade Sight Words（41词）"),
    "second_grade": ("Dolch Second Grade","Dolch Second Grade Sight Words（46词）"),
    "third_grade":  ("Dolch Third Grade","Dolch Third Grade Sight Words（41词）"),
}

# 简单的手工音标表（仅覆盖 Dolch 高频词，其余留空由 enrich 填）
PHONETICS = {
    "a":       ("ə / eɪ",    "ə / eɪ"),
    "big":     ("bɪɡ",       "bɪɡ"),
    "blue":    ("bluː",      "bluː"),
    "yellow":  ("ˈjeləʊ",    "ˈjeloʊ"),
    "red":     ("red",       "red"),
    "little":  ("ˈlɪt(ə)l", "ˈlɪt(ə)l"),
    "I":       ("aɪ",        "aɪ"),
    "see":     ("siː",       "siː"),
    "look":    ("lʊk",       "lʊk"),
    "find":    ("faɪnd",     "faɪnd"),
    "the":     ("ðə / ðiː",  "ðə / ðiː"),
    "in":      ("ɪn",        "ɪn"),
    "here":    ("hɪə",       "hɪr"),
    "where":   ("weə",       "wer"),
    "my":      ("maɪ",       "maɪ"),
    "me":      ("miː",       "miː"),
    "you":     ("juː",       "juː"),
    "we":      ("wiː",       "wiː"),
    "can":     ("kæn",       "kæn"),
    "make":    ("meɪk",      "meɪk"),
    "help":    ("help",      "help"),
    "play":    ("pleɪ",      "pleɪ"),
    "run":     ("rʌn",       "rʌn"),
    "jump":    ("dʒʌmp",     "dʒʌmp"),
    "go":      ("ɡəʊ",       "ɡoʊ"),
    "come":    ("kʌm",       "kʌm"),
    "down":    ("daʊn",      "daʊn"),
    "up":      ("ʌp",        "ʌp"),
    "away":    ("əˈweɪ",     "əˈweɪ"),
    "one":     ("wʌn",       "wʌn"),
    "two":     ("tuː",       "tuː"),
    "three":   ("θriː",      "θriː"),
    "and":     ("ænd / ənd", "ænd / ənd"),
    "for":     ("fɔː",       "fɔːr"),
    "to":      ("tuː / tə",  "tuː / tə"),
    "is":      ("ɪz",        "ɪz"),
    "it":      ("ɪt",        "ɪt"),
    "not":     ("nɒt",       "nɑːt"),
    "said":    ("sed",       "sed"),
    "funny":   ("ˈfʌni",     "ˈfʌni"),
}

# ─── 生成 ────────────────────────────────────────────────────────────────────

def make_word_item(idx, word, level_key):
    level_title, level_desc = LEVEL_META[level_key]
    ph = PHONETICS.get(word, ("", ""))
    return {
        "id": 50000 + idx,
        "word": word,
        "phonetic0": ph[0],
        "phonetic1": ph[1],
        "langType": "en",
        "trans": [],         # enrich 填
        "sentences": [],     # enrich 填
        "phrases": [],       # enrich 填
        "synos": [],         # enrich 填
        "etymology": [
            {
                "t": level_title,
                "d": f"{level_desc}。本词属于 Dolch Sight Words 核心高频词，建议通过句块训练达到视觉自动化识别。",
            }
        ],
        "relWords": {
            "root": word,
            "rels": [],      # enrich 填
        },
        "inflections": None,
        "e2e": None,
        "examsSrc": None,
    }


items = []
idx = 0
seen = set()

for level_key, words in DOLCH.items():
    for word in words:
        if word in seen:
            print(f"[SKIP duplicate] {word}")
            continue
        seen.add(word)
        items.append(make_word_item(idx, word, level_key))
        idx += 1

output_path = "/tmp/dolch_base.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f"✅ 生成完成：{len(items)} 个词 -> {output_path}")

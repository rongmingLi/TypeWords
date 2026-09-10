import pdfplumber
import json
import re
import sys

# DJ音标字符转国际标准IPA
DJ_MAP = {
    "@": "ə", "V": "ʌ", "A:": "ɑː", "A": "ɑ", "O:": "ɔː", "O": "ɔ",
    "Q": "ɒ", "U": "ʊ", "u:": "uː", "i:": "iː", "I": "ɪ", "3:": "ɜː",
    "3": "ɜ", "T": "θ", "D": "ð", "S": "ʃ", "Z": "ʒ", "N": "ŋ",
    "{": "æ", "dZ": "dʒ", "tS": "tʃ"
}

def to_ipa(s):
    if not s: return ""
    res = s
    for k in sorted(DJ_MAP.keys(), key=len, reverse=True):
        res = res.replace(k, DJ_MAP[k])
    return res

def extract_pdf_words(pdf_path, output_json_path, start_page, end_page, textbook_title):
    print(f"Extracting pages {start_page} to {end_page} from {pdf_path}...")
    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for pno in range(start_page, end_page + 1):
            p = pdf.pages[pno - 1]
            w = p.width
            col1_r = 265.0 if pno % 2 == 1 else 250.0
            col2_l = 266.0 if pno % 2 == 1 else 251.0
            
            c1 = p.crop((0, 65, col1_r, 715)).extract_text() or ""
            c2 = p.crop((col2_l, 65, w - 1, 715)).extract_text() or ""
            full_text += "\n" + c1 + "\n" + c2

    # 常见字形断字替换
    full_text = full_text.replace("a/f_ternoon", "afternoon")
    full_text = full_text.replace("a/f_ter", "after")
    full_text = full_text.replace("twel/f_th", "twelfth")
    full_text = full_text.replace("/T_hursday", "Thursday")
    full_text = full_text.replace("Y ou’re", "You’re")
    full_text = full_text.replace("burg er", "burger")
    full_text = full_text.replace("P. M .", "P.M.")

    lines = full_text.splitlines()
    cleaned = []
    for l in lines:
        l = l.strip()
        if not l or "Words and Expressions" in l or "Page PB" in l: continue
        if "（注：在本词表中" in l or "在英式发音和美式发音" in l: continue
        if re.match(r"^\d{2,6}$", l): continue
        cleaned.append(l)

    entries = []
    curr = ""
    curr_unit = "Unit 1"
    for l in cleaned:
        if l.startswith("Starter Unit") or l.startswith("Unit "):
            if curr: entries.append((curr_unit, curr))
            curr = ""
            curr_unit = l
            continue
        if not curr:
            curr = l
        else:
            curr = curr + " " + l
        if re.search(r"p\.\s*(S?\d+)\s*$", curr):
            entries.append((curr_unit, curr))
            curr = ""
    if curr: entries.append((curr_unit, curr))

    dict_items = []
    id_start = 10001
    for unit, raw in entries:
        m_page = re.search(r"\s*p\.\s*(S?\d+)\s*$", raw)
        page_num = m_page.group(1) if m_page else ""
        raw_no_page = raw[:m_page.start()].strip() if m_page else raw
        
        m_phonetic = re.findall(r"/([^/]+)/", raw_no_page)
        if m_phonetic:
            first_slash = raw_no_page.find("/")
            word = raw_no_page[:first_slash].strip()
            last_slash = raw_no_page.rfind("/")
            rest = raw_no_page[last_slash+1:].strip()
            phonetics = [p.strip() for p in m_phonetic]
        else:
            m_zh = re.search(r"[\u4e00-\u9fa5（\(]", raw_no_page)
            if m_zh:
                idx = m_zh.start()
                word_part = raw_no_page[:idx].strip()
                rest = raw_no_page[idx:].strip()
                m_pos = re.search(r"\b(adj|adv|v|n|num|pron|art|prep|conj|interj)\.\s*$", word_part)
                if m_pos:
                    rest = m_pos.group(0) + " " + rest
                    word = word_part[:m_pos.start()].strip()
                else:
                    word = word_part
            else:
                word = raw_no_page
                rest = ""
            phonetics = []

        # 分离词性与释义
        pos = ""
        cn = rest
        m_trans_pos = re.match(r"^([a-zA-Z\.\s&]+[a-zA-Z]\.)\s*(.*)", rest)
        if m_trans_pos:
            pos = m_trans_pos.group(1).strip()
            cn = m_trans_pos.group(2).strip()

        # 打字清洗
        if "let’s = let us" in word:
            word = "let’s"
            cn = "（= let us）" + cn
        if "How old ...?" in word:
            word = "How old ...?"
            cn = re.sub(r"^[…\.\s]+", "", cn)

        p0 = to_ipa(phonetics[0]) if len(phonetics) > 0 else ""
        p1 = to_ipa(phonetics[1]) if len(phonetics) > 1 else p0

        dict_items.append({
            "id": id_start,
            "word": word,
            "phonetic0": p0,
            "phonetic1": p1,
            "langType": "en",
            "trans": [{"pos": pos, "cn": cn}],
            "sentences": [],
            "phrases": [],
            "synos": [],
            "etymology": [{
                "t": f"{unit} (课本第 {page_num} 页)",
                "d": f"收录于{textbook_title} {unit}，对应课本第 {page_num} 页。"
            }],
            "relWords": {"root": word, "rels": []},
            "inflections": None, "e2e": None, "examsSrc": None
        })
        id_start += 1

    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(dict_items, f, ensure_ascii=False, indent=2)
    print(f"Extraction finished! Saved {len(dict_items)} items to {output_json_path}")

if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Usage: python3 extract_pdf.py <pdf_path> <output.json> <start_pno> <end_pno> <textbook_title>")
    else:
        extract_pdf_words(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5])

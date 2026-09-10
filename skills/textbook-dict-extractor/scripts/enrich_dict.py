import json
import re
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_word_details(word_text):
    clean_w = word_text.strip()
    clean_w = re.sub(r"[!?,.]+$", "", clean_w).strip()
    if "/" in clean_w:
        clean_w = clean_w.split("/")[0].strip()
    if "..." in clean_w:
        clean_w = clean_w.replace("...", "").strip()
    
    encoded = urllib.parse.quote(clean_w)
    url = f"https://dict.youdao.com/jsonapi?q={encoded}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    })
    
    result = {
        "sentences": [],
        "phrases": [],
        "synos": [],
        "relWords": {
            "root": clean_w,
            "rels": []
        }
    }
    
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            
            # 1. sentences (双语例句)
            sents_part = data.get("blng_sents_part", {})
            raw_sents = sents_part.get("sentence-pair", []) if isinstance(sents_part, dict) else []
            for sp in raw_sents[:3]:
                eng = sp.get("sentence", "").strip()
                chn = sp.get("sentence-translation", "").strip()
                if eng and chn:
                    result["sentences"].append({"c": eng, "cn": chn})
            
            # 2. phrases (高频短语)
            phrs_part = data.get("phrs", {})
            raw_phrs = phrs_part.get("phrs", []) if isinstance(phrs_part, dict) else []
            for phr_item in raw_phrs[:4]:
                p = phr_item.get("phr", {})
                c_text = p.get("headword", {}).get("l", {}).get("i", "").strip()
                trs = p.get("trs", [])
                cn_text = trs[0].get("tr", {}).get("l", {}).get("i", "").strip() if trs else ""
                cn_clean = re.sub(r"^[a-z]+\.\s*", "", cn_text)
                if c_text and cn_clean:
                    result["phrases"].append({"c": c_text, "cn": cn_clean})
            
            # 3. synos (同义词/近义词: ws为纯英文)
            syno_part = data.get("syno", {})
            raw_synos = syno_part.get("synos", []) if isinstance(syno_part, dict) else []
            for syn in raw_synos[:3]:
                s_info = syn.get("syno", {})
                pos = s_info.get("pos", "").strip()
                tran = s_info.get("tran", "").strip()
                ws_list = [w.get("w", "").strip() for w in s_info.get("ws", []) if w.get("w")]
                if ws_list and tran:
                    result["synos"].append({"pos": pos, "cn": tran, "ws": ws_list[:6]})
            
            # 4. relWords (派生词: root/c为英文)
            rw_part = data.get("rel_word", {})
            if isinstance(rw_part, dict) and rw_part:
                stem = rw_part.get("stem") or rw_part.get("word") or clean_w
                result["relWords"]["root"] = stem
                for r in rw_part.get("rels", []):
                    rel_obj = r.get("rel", {})
                    rel_pos = rel_obj.get("pos", "").strip()
                    word_sub_list = []
                    for wr in rel_obj.get("words", []):
                        wc = wr.get("word", "").strip()
                        wcn = wr.get("tran", "").strip()
                        if wc and wcn:
                            word_sub_list.append({"c": wc, "cn": wcn})
                    if rel_pos and word_sub_list:
                        result["relWords"]["rels"].append({"pos": rel_pos, "words": word_sub_list})
    except Exception:
        pass
        
    return result

def enrich_dataset(input_json_path, output_json_path, max_workers=8):
    with open(input_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    total = len(data)
    print(f"Enriching {total} items with {max_workers} threads...")
    
    def worker(item):
        info = fetch_word_details(item["word"])
        if info["sentences"]: item["sentences"] = info["sentences"]
        if info["phrases"]: item["phrases"] = info["phrases"]
        if info["synos"]: item["synos"] = info["synos"]
        if info["relWords"]["rels"]: item["relWords"] = info["relWords"]
        return item
        
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(worker, item): item for item in data}
        done = 0
        for f in as_completed(futures):
            done += 1
            if done % 50 == 0 or done == total:
                print(f"Progress: {done}/{total} ({done*100/total:.1f}%)")
                
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Done! Saved to:", output_json_path)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python3 enrich_dict.py <input.json> <output.json>")
    else:
        enrich_dataset(sys.argv[1], sys.argv[2])

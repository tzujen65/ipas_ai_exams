import os
import re
import json
import pypdf

pdf_dir = "/Users/rex/Desktop/iPAS/ipas_ai_exams"
pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith(".pdf")]
pdf_files.sort()

def normalize_char(c):
    c = c.strip().upper()
    mapping = {
        'Ａ': 'A', 'Ｂ': 'B', 'Ｃ': 'C', 'Ｄ': 'D',
        'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D'
    }
    return mapping.get(c, c)

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def clean_header_footer(text):
    # Regexes to clean various page headers and footers
    patterns = [
        r'\d+\s*年\s*(?:第一次|第二次|第二梯次|第四梯次)?\s*(?:初級|中級)?\s*AI\s*應用規劃師\s*(?:-|–|_)?\s*(?:初級|中級)?能力鑑定【公告試題】',
        r'\d+\s*年\s*(?:第一次|第二次|第二梯次|第四梯次)?\s*(?:初級|中級)?\s*AI\s*應用規劃師[^\n]*',
        r'(?:第一科|第二科|第三科)[：_][^\n]*',
        r'考試日期[：_][^\n]*',
        r'試題公告日期[：_][^\n]*',
        r'第\s*\d+\s*頁\s*，\s*共\s*\d+\s*頁',
        r'第\s*\d+\s*頁\s*，共\s*\d+\s*頁',
        r'答案\s*題\s*目',
        r'答案\s*題目',
        r'答案\s*題\s*目'
    ]
    for pattern in patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    return text

def parse_pdf(file_path):
    print(f"Parsing: {os.path.basename(file_path)}")
    reader = pypdf.PdfReader(file_path)
    
    full_text_lines = []
    for page_num in range(len(reader.pages)):
        page_text = reader.pages[page_num].extract_text()
        
        # Clean page headers and footers page by page
        page_text_cleaned = clean_header_footer(page_text)
        
        lines = page_text_cleaned.split('\n')
        for line in lines:
            line_str = line.strip()
            if line_str:
                full_text_lines.append(line_str)
                
    questions = []
    current_q = None
    
    # Matching e.g., "B 1. Question"
    q_pattern = re.compile(r'^([A-DＡ-Ｄ])\s*(\d+)\.\s*(.*)$')
    opt_pattern = re.compile(r'\(([A-Da-dＡ-Ｄａ-ｄ])\)')
    
    for line in full_text_lines:
        q_match = q_pattern.match(line)
        if q_match:
            if current_q:
                questions.append(current_q)
            
            ans = normalize_char(q_match.group(1))
            num = int(q_match.group(2))
            content = q_match.group(3)
            
            current_q = {
                "num": num,
                "answer": ans,
                "question": content,
                "options": {"A": "", "B": "", "C": "", "D": ""},
                "raw_lines": [line]
            }
        else:
            if current_q:
                current_q["raw_lines"].append(line)
                
    if current_q:
        questions.append(current_q)
        
    for q in questions:
        raw_combined = " ".join(q["raw_lines"])
        matches = list(opt_pattern.finditer(raw_combined))
        
        # Let's clean headers again from raw_combined in case they spanned multiple lines and got joined
        raw_combined = clean_header_footer(raw_combined)
        
        # Re-find options after final clean
        matches = list(opt_pattern.finditer(raw_combined))
        
        if len(matches) >= 4:
            q_start_idx = raw_combined.find(f"{q['num']}.")
            if q_start_idx != -1:
                prefix_len = len(f"{q['num']}.")
                q_text = raw_combined[q_start_idx + prefix_len : matches[0].start()].strip()
            else:
                temp = re.sub(r'^[A-DＡ-Ｄ]\s*\d+\.\s*', '', raw_combined)
                first_opt_idx = temp.find("(A)")
                if first_opt_idx != -1:
                    q_text = temp[:first_opt_idx].strip()
                else:
                    q_text = temp.strip()
            
            q["question"] = clean_text(q_text)
            
            for idx, match in enumerate(matches):
                opt_letter = normalize_char(match.group(1))
                start_val = match.end()
                end_val = matches[idx + 1].start() if idx + 1 < len(matches) else len(raw_combined)
                opt_content = raw_combined[start_val:end_val].strip()
                
                # Clean punctuation at end
                opt_content = re.sub(r'[；;，,。.\s]+$', '', opt_content).strip()
                
                if opt_letter in q["options"]:
                    q["options"][opt_letter] = clean_text(opt_content)
        else:
            temp = re.sub(r'^[A-DＡ-Ｄ]\s*\d+\.\s*', '', raw_combined)
            q["question"] = clean_text(temp)
            
        del q["raw_lines"]
        
    return questions

all_exams_data = {}
for file in pdf_files:
    file_path = os.path.join(pdf_dir, file)
    try:
        questions = parse_pdf(file_path)
        all_exams_data[file] = questions
        print(f"-> Found {len(questions)} questions")
    except Exception as e:
        print(f"Error parsing {file}: {e}")

output_path = "/Users/rex/Desktop/iPAS/ipas_ai_exams/exams_data.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(all_exams_data, f, ensure_ascii=False, indent=2)

print("Parsed exams saved successfully to exams_data.json in workspace")

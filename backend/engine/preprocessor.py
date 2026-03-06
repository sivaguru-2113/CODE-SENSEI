# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Module 1: Code Preprocessor
Cleans, validates, and extracts metadata from raw code input.
"""
import re
import ast
from .models import PreprocessResult


# ── Language Detection ───────────────────────────────────────

LANGUAGE_SIGNATURES = {
    "python": {
        "keywords": [r'\bdef\b', r'\bimport\b', r'\bclass\b', r'\belif\b', r'\bself\b', r'\bprint\s*\('],
        "weight": 0
    },
    "javascript": {
        "keywords": [r'\bfunction\b', r'\bconst\b', r'\blet\b', r'\bvar\b', r'\bconsole\.log\b', r'=>'],
        "weight": 0
    },
    "typescript": {
        "keywords": [r'\binterface\b', r'\btype\b.*=', r':\s*(string|number|boolean)', r'\benum\b'],
        "weight": 0
    },
    "java": {
        "keywords": [r'\bpublic\b', r'\bprivate\b', r'\bstatic void\b', r'\bSystem\.out\b', r'\bclass\b.*\{'],
        "weight": 0
    },
    "cpp": {
        "keywords": [r'#include', r'\bstd::', r'\bcout\b', r'\bint main\b', r'\bvector<'],
        "weight": 0
    },
    "go": {
        "keywords": [r'\bfunc\b', r'\bpackage\b', r'\bfmt\.', r'\bgo\b\s+\w+', r':='],
        "weight": 0
    },
    "rust": {
        "keywords": [r'\bfn\b', r'\blet\s+mut\b', r'\bimpl\b', r'\bpub\b', r'println!'],
        "weight": 0
    },
}


def detect_language(code: str, hint: str = "") -> str:
    """Detect programming language from code content and optional hint."""
    if hint and hint.lower() in LANGUAGE_SIGNATURES:
        return hint.lower()

    scores = {}
    for lang, data in LANGUAGE_SIGNATURES.items():
        score = 0
        for pattern in data["keywords"]:
            matches = re.findall(pattern, code)
            score += len(matches)
        scores[lang] = score

    if not scores or max(scores.values()) == 0:
        return hint.lower() if hint else "unknown"

    return max(scores, key=scores.get)


# ── Comment Stripping ────────────────────────────────────────

def strip_comments(code: str, language: str) -> str:
    """Remove comments from code while preserving line numbers."""
    lines = code.split('\n')
    cleaned = []
    in_block_comment = False

    for line in lines:
        stripped = line

        if language == "python":
            # Remove inline comments (but not strings containing #)
            in_string = False
            result = []
            i = 0
            while i < len(stripped):
                ch = stripped[i]
                if ch in ('"', "'") and not in_string:
                    in_string = ch
                elif ch == in_string:
                    in_string = False
                elif ch == '#' and not in_string:
                    break
                result.append(ch)
                i += 1
            stripped = ''.join(result)

        else:
            # C-style block comments
            if in_block_comment:
                end_idx = stripped.find('*/')
                if end_idx != -1:
                    stripped = stripped[end_idx + 2:]
                    in_block_comment = False
                else:
                    stripped = ''
                    cleaned.append(stripped)
                    continue

            start_idx = stripped.find('/*')
            if start_idx != -1:
                end_idx = stripped.find('*/', start_idx + 2)
                if end_idx != -1:
                    stripped = stripped[:start_idx] + stripped[end_idx + 2:]
                else:
                    stripped = stripped[:start_idx]
                    in_block_comment = True

            # Single-line comments
            slash_idx = stripped.find('//')
            if slash_idx != -1:
                stripped = stripped[:slash_idx]

        cleaned.append(stripped)

    return '\n'.join(cleaned)


# ── Syntax Validation ────────────────────────────────────────

def validate_syntax(code: str, language: str) -> tuple:
    """Check for syntax errors. Returns (is_valid, error_message)."""
    if language == "python":
        try:
            ast.parse(code)
            return (True, None)
        except SyntaxError as e:
            return (False, f"Line {e.lineno}: {e.msg}")
    else:
        # Basic bracket matching for other languages
        stack = []
        pairs = {')': '(', ']': '[', '}': '{'}
        for i, ch in enumerate(code):
            if ch in '([{':
                stack.append(ch)
            elif ch in ')]}':
                if not stack or stack[-1] != pairs[ch]:
                    return (False, f"Mismatched bracket '{ch}' at position {i}")
                stack.pop()
        if stack:
            return (False, f"Unclosed bracket(s): {''.join(stack)}")
        return (True, None)


# ── Quick Metrics ────────────────────────────────────────────

def count_functions(code: str, language: str) -> int:
    """Quick function count without full AST parsing."""
    if language == "python":
        return len(re.findall(r'^\s*def\s+', code, re.MULTILINE))
    elif language in ("javascript", "typescript"):
        return len(re.findall(r'\bfunction\s+\w+|=>\s*[\{(]|^\s*(async\s+)?function\b', code, re.MULTILINE))
    elif language in ("java", "cpp"):
        return len(re.findall(r'(public|private|protected|static)?\s+\w+\s+\w+\s*\(', code, re.MULTILINE))
    elif language == "go":
        return len(re.findall(r'\bfunc\s+', code, re.MULTILINE))
    elif language == "rust":
        return len(re.findall(r'\bfn\s+', code, re.MULTILINE))
    return 0


def count_imports(code: str, language: str) -> int:
    """Count import statements."""
    if language == "python":
        return len(re.findall(r'^\s*(import|from)\s+', code, re.MULTILINE))
    elif language in ("javascript", "typescript"):
        return len(re.findall(r'^\s*(import|require)\s*[\({]?', code, re.MULTILINE))
    elif language in ("java", "cpp"):
        return len(re.findall(r'^\s*(import|#include)\s+', code, re.MULTILINE))
    elif language == "go":
        return len(re.findall(r'^\s*import\s+', code, re.MULTILINE))
    elif language == "rust":
        return len(re.findall(r'^\s*use\s+', code, re.MULTILINE))
    return 0


def compute_comment_ratio(original: str, cleaned: str) -> float:
    """Compute the ratio of comment characters to total characters."""
    orig_len = len(original.strip())
    if orig_len == 0:
        return 0.0
    clean_len = len(cleaned.strip())
    comment_chars = orig_len - clean_len
    return round(comment_chars / orig_len * 100, 1)


# ── Main Preprocessor Entry Point ────────────────────────────

def preprocess(code: str, language_hint: str = "") -> PreprocessResult:
    """
    Run the full preprocessing pipeline.
    Returns a PreprocessResult with cleaned code and metadata.
    """
    # Step 1: Detect language
    detected_language = detect_language(code, language_hint)

    # Step 2: Validate syntax
    is_valid, error_msg = validate_syntax(code, detected_language)

    # Step 3: Strip comments
    cleaned_code = strip_comments(code, detected_language)

    # Step 4: Compute metadata
    line_count = len(code.strip().split('\n'))
    func_count = count_functions(code, detected_language)
    imp_count = count_imports(code, detected_language)
    comment_rat = compute_comment_ratio(code, cleaned_code)

    return PreprocessResult(
        cleaned_code=cleaned_code.strip(),
        original_code=code,
        detected_language=detected_language,
        line_count=line_count,
        has_syntax_error=not is_valid,
        syntax_error_message=error_msg,
        comment_ratio=comment_rat,
        function_count=func_count,
        import_count=imp_count,
    )

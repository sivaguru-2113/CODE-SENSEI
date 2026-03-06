# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Module 6: AI Explanation Generator
Enriches structural analysis data with human-friendly AI-generated explanations
using the OpenRouter API.
"""
import os
import json
import requests  # type: ignore
from typing import List, Optional
from .models import (  # type: ignore
    ASTInfo, PatternMatch, ComplexityAnalysis, StaticAnalysisResult
)


# ══════════════════════════════════════════════════════════════
# CONFIG
# ══════════════════════════════════════════════════════════════

def _get_config():
    """Read OpenRouter configuration from environment."""
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
    return {
        "api_key": os.getenv("OPENROUTER_API_KEY") or os.getenv("AI_API_KEY", ""),
        "model": os.getenv("AI_MODEL_NAME", "qwen/qwen3-coder:free"),
        "site_url": os.getenv("SITE_URL", "http://localhost:3000"),
        "site_name": os.getenv("SITE_NAME", "CODE-SENSEI"),
    }


# ══════════════════════════════════════════════════════════════
# PROMPT BUILDER
# ══════════════════════════════════════════════════════════════

def build_prompt(
    code: str,
    language: str,
    complexity: ComplexityAnalysis,
    patterns: List[PatternMatch],
    ast_info: ASTInfo,
    detected_algorithms: List[str]
) -> str:
    """
    Build a rich prompt that feeds the AI real structural analysis data
    so it can generate an informed, accurate explanation.
    """
    # Summarize findings
    issues_summary = ""
    for i, p in enumerate(patterns[:8], 1):  # type: ignore  # Limit to top 8
        issues_summary += f"   {i}. [{p.severity.upper()}] Line {p.line_number}: {p.description}\n"

    if not issues_summary:
        issues_summary = "   No major issues detected.\n"

    algo_text = ", ".join(detected_algorithms) if detected_algorithms else "No specific algorithm pattern detected"

    recursive_text = ", ".join(ast_info.recursive_functions) if ast_info.recursive_functions else "None"

    prompt = f"""You are CODE-SENSEI, an expert senior software engineer and code mentor helping students learn to write better code.

I have already performed structural analysis on the following {language} code.
Your job is to write a STRUCTURED, student-friendly mentor explanation based on the REAL analysis data below.
Do NOT re-analyze the code from scratch — use the data I provide.

═══ STRUCTURAL ANALYSIS DATA ═══
Time Complexity: {complexity.timeComplexity}
Space Complexity: {complexity.spaceComplexity}
Loop Count: {complexity.loopCount}
Max Nesting Depth: {complexity.nestingDepth}
Functions: {len(ast_info.functions)}
Recursive Functions: {recursive_text}
Detected Algorithms: {algo_text}

═══ DETECTED ISSUES ═══
{issues_summary}
═══ CODE ═══
```{language}
{code}
```

═══ YOUR TASK ═══
Write a STRUCTURED explanation using these exact sections (use the emoji headers exactly as shown):

📋 Overview: (1-2 sentences summarizing what the code does and its overall quality)

⏱️ Complexity Breakdown: (Explain the time and space complexity in plain language a student can understand. Use analogies if helpful. For example: "Imagine you have 1000 items — with O(n²), your code would need to do 1,000,000 operations.")

⚠️ Key Issues: (List the top 1-3 issues found, each with a clear problem statement and a specific fix. Number them.)

💡 Pro Tip: (End with one specific, actionable improvement the student can apply immediately. Be encouraging.)

Rules:
- Speak directly to the student like a friendly mentor
- Use simple language — avoid jargon unless you explain it
- Be specific about line numbers when mentioning issues
- Each section should be 1-3 sentences max
- Output ONLY the structured text with the emoji headers, no JSON, no markdown code blocks"""

    return prompt


# ══════════════════════════════════════════════════════════════
# TEMPLATE FALLBACK
# ══════════════════════════════════════════════════════════════

def generate_template_explanation(
    code: str,
    language: str,
    complexity: ComplexityAnalysis,
    patterns: List[PatternMatch],
    ast_info: ASTInfo,
    detected_algorithms: List[str]
) -> str:
    """
    Template-based fallback explanation when AI is unavailable.
    Generates a structured, student-friendly explanation from structural data.
    """
    sections = []

    # ── 📋 Overview ──
    func_count = len(ast_info.functions)
    if func_count > 0:
        overview = f"Your code contains {func_count} function(s) with {ast_info.total_loop_count} loop(s)."
    else:
        overview = f"Your code is {len(code.split(chr(10)))} lines long with {ast_info.total_loop_count} loop(s)."

    if detected_algorithms:
        overview += f" It implements a {', '.join(detected_algorithms)} pattern."

    sections.append(f"📋 Overview: {overview}")

    # ── ⏱️ Complexity ──
    complexity_explanations = {
        "O(1)": "Your code runs in constant time — no matter how large the input, it takes the same amount of time. Excellent!",
        "O(log n)": "Your code runs in logarithmic time — it gets faster relative to input size by cutting the problem in half each step. Very efficient!",
        "O(n)": "Your code runs in linear time — if you double the input, it takes roughly double the time. This is efficient for most cases.",
        "O(n log n)": "Your code runs in O(n log n) time, which is typical for efficient sorting algorithms. This is good performance.",
        "O(n²)": f"Your code runs in quadratic time because of {ast_info.total_loop_count} nested loops. This means if you have 1,000 items, your code does ~1,000,000 operations. For 10,000 items, that becomes 100,000,000 — it slows down fast!",
        "O(n³)": f"Your code runs in cubic time due to deeply nested loops (depth {ast_info.max_nesting_depth}). For just 100 items, that's 1,000,000 operations. This will become very slow with larger inputs.",
        "O(2ⁿ)": "Your code has exponential time complexity, likely from recursive calls. Each additional input element doubles the work. This becomes unusable for inputs larger than ~25-30 items.",
    }
    comp_text = complexity_explanations.get(
        complexity.timeComplexity,
        f"The estimated time complexity is {complexity.timeComplexity}."
    )
    space_note = f" Space complexity is {complexity.spaceComplexity}."
    sections.append(f"⏱️ Complexity Breakdown: {comp_text}{space_note}")

    # ── ⚠️ Key Issues ──
    critical = [p for p in patterns if p.severity == "critical"]
    warnings = [p for p in patterns if p.severity == "warning"]
    all_issues = critical + warnings

    if all_issues:
        issue_lines = []
        for i, issue in enumerate(all_issues[:3], 1):  # type: ignore
            issue_lines.append(f"{i}. Line {issue.line_number}: {issue.description} → Fix: {issue.suggestion}")
        sections.append(f"⚠️ Key Issues: " + " ".join(issue_lines))
    else:
        sections.append("⚠️ Key Issues: No critical issues found — nice work!")

    # ── 💡 Pro Tip ──
    if complexity.timeComplexity in ("O(n²)", "O(n³)"):
        sections.append("💡 Pro Tip: Try replacing inner loops with hash maps (dictionaries/sets) for O(1) lookups. This single change can often transform O(n²) into O(n) — a massive speed boost!")
    elif ast_info.has_recursion:
        sections.append("💡 Pro Tip: When using recursion, always check your base case handles edge inputs (empty list, 0, negative numbers). Consider adding memoization with @lru_cache to avoid repeated calculations.")
    elif len(critical) == 0 and len(warnings) == 0:
        sections.append("💡 Pro Tip: Great job! To level up further, consider adding docstrings to your functions and breaking long logic into smaller helper functions for better readability.")
    else:
        sections.append("💡 Pro Tip: Start by fixing the most critical issue first — small changes can lead to big performance improvements. You've got this!")

    return "\n\n".join(sections)


# ══════════════════════════════════════════════════════════════
# AI CALL
# ══════════════════════════════════════════════════════════════

def generate_ai_explanation(
    code: str,
    language: str,
    complexity: ComplexityAnalysis,
    patterns: List[PatternMatch],
    ast_info: ASTInfo,
    detected_algorithms: List[str]
) -> str:
    """
    Call the OpenRouter API to generate a mentor-style explanation
    enriched with real structural analysis data.
    Falls back to template-based explanation on failure.
    """
    config = _get_config()

    if not config["api_key"]:
        print("AI Explainer: No API key found, using template fallback.")
        return generate_template_explanation(
            code, language, complexity, patterns, ast_info, detected_algorithms
        )

    prompt = build_prompt(code, language, complexity, patterns, ast_info, detected_algorithms)

    try:
        headers = {
            "Authorization": f"Bearer {config['api_key']}",
            "Content-Type": "application/json",
            "HTTP-Referer": config["site_url"],
            "X-OpenRouter-Title": config["site_name"],
        }

        payload = {
            "model": config["model"],
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are CODE-SENSEI, a friendly but expert code mentor helping computer science students. "
                        "You explain code concepts clearly using simple language, analogies, and real-world examples. "
                        "Always structure your response with the emoji section headers: 📋 Overview, ⏱️ Complexity Breakdown, ⚠️ Key Issues, 💡 Pro Tip. "
                        "Output plain text only — no JSON, no markdown code blocks, no backticks."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            data=json.dumps(payload),
            timeout=30
        )

        if response.status_code != 200:
            print(f"AI Explainer: API error {response.status_code}, using template fallback.")
            return generate_template_explanation(
                code, language, complexity, patterns, ast_info, detected_algorithms
            )

        data = response.json()
        if 'choices' in data and len(data['choices']) > 0:
            text = data['choices'][0]['message']['content'].strip()
            # Clean AI response — remove any thinking tags from reasoning models
            if '<think>' in text:
                # Extract content after </think>
                think_end = text.find('</think>')
                if think_end != -1:
                    text = text[think_end + 8:].strip()
            return text

        return generate_template_explanation(
            code, language, complexity, patterns, ast_info, detected_algorithms
        )

    except Exception as e:
        print(f"AI Explainer error: {e}, using template fallback.")
        return generate_template_explanation(
            code, language, complexity, patterns, ast_info, detected_algorithms
        )

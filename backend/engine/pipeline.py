# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Module 8: Pipeline Orchestrator
Chains all analysis modules together into a single entry point.

Pipeline flow:
  Code → Preprocessor → AST Parser → Static Analyzer
       → Complexity Detector → Pattern Detector
       → AI Explanation Generator → Quality Scorer → Result
"""
import uuid
import time
import traceback
from typing import List

from .models import (
    CodeAnalysisResult, CodeIssue, ComplexityAnalysis,
    AnalysisMetrics, PatternMatch, ASTInfo
)
from .preprocessor import preprocess
from .ast_parser import parse_code
from .static_analyzer import analyze as static_analyze
from .complexity import analyze_complexity
from .patterns import detect_patterns
from .ai_explainer import generate_ai_explanation
from .scorer import compute_metrics, compute_final_score


def run_analysis(code: str, language: str = "javascript") -> CodeAnalysisResult:
    """
    Execute the full CODE-SENSEI analysis pipeline.

    1. Preprocess → clean, detect language, validate syntax
    2. Parse AST → build structural tree
    3. Static Analysis → detect structural issues + algorithms
    4. Complexity → estimate Big-O
    5. Patterns → detect code smells
    6. AI Explanation → generate mentor explanation
    7. Score → compute quality metrics
    8. Assemble → build the final result
    """
    print(f"\n{'='*60}")
    print(f"CODE-SENSEI Engine — Starting Analysis")
    print(f"{'='*60}")

    # ── Stage 1: Preprocess ──────────────────────────────────
    print("  [1/7] Preprocessing...")
    prep = preprocess(code, language)
    effective_language = prep.detected_language
    print(f"        Language: {effective_language} | Lines: {prep.line_count} | "
          f"Functions: {prep.function_count} | Syntax OK: {not prep.has_syntax_error}")

    # ── Stage 2: AST Parsing ─────────────────────────────────
    print("  [2/7] Parsing AST...")
    ast_info = parse_code(prep.cleaned_code, effective_language)
    print(f"        Loops: {ast_info.total_loop_count} | Functions: {len(ast_info.functions)} | "
          f"Max Depth: {ast_info.max_nesting_depth} | Recursion: {ast_info.has_recursion}")

    # ── Stage 3: Static Analysis ─────────────────────────────
    print("  [3/7] Running static analysis...")
    static_result = static_analyze(code, ast_info, effective_language)
    print(f"        Structural issues: {len(static_result.patterns)} | "
          f"Algorithms detected: {static_result.detected_algorithms or 'None'}")

    # ── Stage 4: Complexity Detection ────────────────────────
    print("  [4/7] Estimating complexity...")
    complexity = analyze_complexity(ast_info, code)
    print(f"        Time: {complexity.timeComplexity} | Space: {complexity.spaceComplexity}")

    # ── Stage 5: Pattern Detection ───────────────────────────
    print("  [5/7] Detecting code patterns...")
    code_patterns = detect_patterns(code, ast_info, effective_language)
    print(f"        Patterns found: {len(code_patterns)}")

    # Merge all issues (structural + pattern)
    all_patterns = static_result.patterns + code_patterns

    # ── Stage 6: AI Explanation ──────────────────────────────
    print("  [6/7] Generating AI explanation...")
    try:
        explanation = generate_ai_explanation(
            code, effective_language, complexity, all_patterns,
            ast_info, static_result.detected_algorithms
        )
        print(f"        Explanation generated ({len(explanation)} chars)")
    except Exception as e:
        print(f"        AI explanation failed: {e}")
        explanation = "Analysis complete. Review the issues and metrics above for detailed insights."

    # ── Stage 7: Quality Scoring ─────────────────────────────
    print("  [7/7] Computing quality scores...")
    metrics = compute_metrics(
        code, ast_info, complexity, all_patterns,
        prep.line_count, prep.comment_ratio
    )
    final_score = compute_final_score(metrics)
    print(f"        Readability: {metrics.readability} | Efficiency: {metrics.efficiency} | "
          f"Maintainability: {metrics.maintainability}")
    print(f"        Best Practices: {metrics.bestPractices} | Error Handling: {metrics.errorHandling}")
    print(f"        ★ Final Score: {final_score}/100")

    # ── Assemble Result ──────────────────────────────────────
    # Convert PatternMatch list → CodeIssue list for API response
    issues: List[CodeIssue] = []
    for i, p in enumerate(all_patterns):
        issues.append(CodeIssue.model_validate({
            "id": f"issue-{i+1}",
            "type": p.pattern_name,
            "lineNumber": p.line_number,
            "severity": p.severity,
            "description": p.description,
            "suggestion": p.suggestion,
        }))

    result = CodeAnalysisResult.model_validate({
        "id": str(uuid.uuid4()),
        "code": code,
        "language": effective_language,
        "complexity": complexity,
        "metrics": metrics,
        "issues": issues,
        "finalScore": final_score,
        "explanation": explanation,
        "timestamp": time.time() * 1000,
    })

    print(f"\n{'='*60}")
    print(f"CODE-SENSEI Engine — Analysis Complete (Score: {final_score}/100)")
    print(f"{'='*60}\n")

    return result

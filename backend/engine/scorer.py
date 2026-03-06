# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Module 7: Code Quality Scorer
Computes a weighted quality score from structural analysis data.
"""
from .models import ASTInfo, AnalysisMetrics, PatternMatch, ComplexityAnalysis
from typing import List


# ══════════════════════════════════════════════════════════════
# SCORING FUNCTIONS
# ══════════════════════════════════════════════════════════════

def score_readability(ast_info: ASTInfo, patterns: List[PatternMatch], line_count: int, comment_ratio: float) -> float:
    """
    Score readability (0-100) based on:
    - Function length
    - Variable naming (unused vars)
    - Nesting depth
    - Comment ratio
    - Readability patterns
    """
    score = 100.0

    # Penalize long functions
    for func in ast_info.functions:
        if func.length > 50:
            score -= 15
        elif func.length > 30:
            score -= 5

    # Penalize deep nesting
    if ast_info.max_nesting_depth >= 4:
        score -= 15
    elif ast_info.max_nesting_depth >= 3:
        score -= 8

    # Penalize unused variables
    unused_count = sum(1 for v in ast_info.variables if not v.used)
    score -= unused_count * 3

    # Bonus for comments (reasonable ratio)
    if comment_ratio >= 5:
        score += 5
    elif comment_ratio < 1 and line_count > 20:
        score -= 5

    # Penalize readability-related patterns
    for p in patterns:
        if p.category == "readability":
            if p.severity == "critical":
                score -= 10
            elif p.severity == "warning":
                score -= 5
            else:
                score -= 2

    return max(0, min(100, round(score, 1)))


def score_efficiency(complexity: ComplexityAnalysis, patterns: List[PatternMatch]) -> float:
    """
    Score efficiency (0-100) based on:
    - Time complexity class
    - Performance-related patterns
    """
    # Base score from complexity
    complexity_scores = {
        "O(1)": 100,
        "O(log n)": 95,
        "O(n)": 85,
        "O(n log n)": 75,
        "O(n²)": 50,
        "O(n³)": 25,
        "O(2ⁿ)": 10,
        "Unknown": 60,
    }

    score = complexity_scores.get(complexity.timeComplexity, 60)

    # Penalize performance patterns
    for p in patterns:
        if p.category == "performance":
            if p.severity == "critical":
                score -= 15
            elif p.severity == "warning":
                score -= 8

    return max(0, min(100, round(score, 1)))


def score_maintainability(ast_info: ASTInfo, line_count: int) -> float:
    """
    Score maintainability (0-100) based on:
    - Number of functions (modularity)
    - Function length
    - Code length
    - Class structure
    """
    score = 100.0

    # Penalize very long files with no functions
    if line_count > 50 and len(ast_info.functions) == 0:
        score -= 20
    elif line_count > 100 and len(ast_info.functions) < 3:
        score -= 15

    # Bonus for good modularity
    if len(ast_info.functions) >= 3 and all(f.length <= 30 for f in ast_info.functions):
        score += 5

    # Penalize very long functions
    for func in ast_info.functions:
        if func.length > 50:
            score -= 10
        elif func.length > 30:
            score -= 3

    # Penalize too many args
    for func in ast_info.functions:
        if func.arg_count > 5:
            score -= 8

    # Bonus for using classes (OOP)
    if ast_info.class_count > 0:
        score += 3

    return max(0, min(100, round(score, 1)))


def score_best_practices(patterns: List[PatternMatch], ast_info: ASTInfo) -> float:
    """
    Score best practices (0-100) based on:
    - Pattern violations
    - Code organization
    """
    score = 100.0

    for p in patterns:
        if p.category == "best-practice":
            if p.severity == "critical":
                score -= 15
            elif p.severity == "warning":
                score -= 8
            else:
                score -= 3

    # Bonus for functions having return values
    funcs_with_return = sum(1 for f in ast_info.functions if f.has_return)
    total_funcs = len(ast_info.functions)
    if total_funcs > 0 and funcs_with_return / total_funcs >= 0.7:
        score += 5

    return max(0, min(100, round(score, 1)))


def score_error_handling(code: str, patterns: List[PatternMatch]) -> float:
    """
    Score error handling (0-100) based on:
    - Presence of try/except blocks
    - Quality of exception handling
    """
    import re
    score = 60.0  # Base: assume moderate

    # Check for try/except presence
    has_try = bool(re.search(r'\btry\b', code))
    has_except = bool(re.search(r'\bexcept\b', code))
    has_finally = bool(re.search(r'\bfinally\b', code))
    has_catch = bool(re.search(r'\bcatch\b', code))  # JS/Java

    if has_try and (has_except or has_catch):
        score = 80.0
        if has_finally:
            score = 90.0
    elif not has_try and not has_catch:
        # Check if error handling is even needed
        has_io = bool(re.search(r'\b(open|read|write|request|fetch|connect)\b', code))
        has_division = bool(re.search(r'/', code))
        if has_io:
            score = 40.0  # Needs error handling but doesn't have it
        else:
            score = 70.0  # Simple code, error handling may not be critical

    # Penalize bad error handling patterns
    for p in patterns:
        if "except" in p.pattern_name.lower():
            if p.severity == "critical":
                score -= 15
            elif p.severity == "warning":
                score -= 8

    return max(0, min(100, round(score, 1)))


# ══════════════════════════════════════════════════════════════
# FINAL SCORE COMPUTATION
# ══════════════════════════════════════════════════════════════

WEIGHTS = {
    'readability': 0.25,
    'efficiency': 0.30,
    'maintainability': 0.20,
    'bestPractices': 0.15,
    'errorHandling': 0.10,
}


def compute_metrics(
    code: str,
    ast_info: ASTInfo,
    complexity: ComplexityAnalysis,
    patterns: List[PatternMatch],
    line_count: int,
    comment_ratio: float
) -> AnalysisMetrics:
    """Compute all 5 quality metrics."""
    return AnalysisMetrics.model_validate({
        "readability": score_readability(ast_info, patterns, line_count, comment_ratio),
        "efficiency": score_efficiency(complexity, patterns),
        "maintainability": score_maintainability(ast_info, line_count),
        "bestPractices": score_best_practices(patterns, ast_info),
        "errorHandling": score_error_handling(code, patterns),
    })


def compute_final_score(metrics: AnalysisMetrics) -> float:
    """Compute the weighted final score."""
    score = (
        metrics.readability * WEIGHTS['readability'] +
        metrics.efficiency * WEIGHTS['efficiency'] +
        metrics.maintainability * WEIGHTS['maintainability'] +
        metrics.bestPractices * WEIGHTS['bestPractices'] +
        metrics.errorHandling * WEIGHTS['errorHandling']
    )
    return round(score, 1)

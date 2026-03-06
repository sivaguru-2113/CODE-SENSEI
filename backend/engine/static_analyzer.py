# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Module 3: Static Analyzer
Runs AST visitors and rule checks to produce a StaticAnalysisResult.
"""
import re
from typing import List
from .models import ASTInfo, PatternMatch, StaticAnalysisResult


# ══════════════════════════════════════════════════════════════
# ALGORITHM RECOGNITION
# ══════════════════════════════════════════════════════════════

ALGORITHM_SIGNATURES = {
    "bubble_sort": {
        "patterns": [
            r'for.*\brange\b.*\blen\b.*for.*\brange\b.*if.*\[.*\].*>.*\[.*\]',
            r'for.*for.*if.*\bswap\b',
            r'for.*for.*if.*\[.*\],\s*\[.*\]\s*=\s*\[.*\],\s*\[.*\]',
        ],
        "name": "Bubble Sort",
    },
    "binary_search": {
        "patterns": [
            r'while\s+\w+\s*<=?\s*\w+.*mid\s*=',
            r'(low|left|lo)\s*=.*\b(high|right|hi)\s*=.*while',
            r'mid\s*=\s*\(?\s*\w+\s*\+\s*\w+\s*\)?\s*//?\s*2',
        ],
        "name": "Binary Search",
    },
    "two_pointer": {
        "patterns": [
            r'(left|i)\s*=\s*0.*\b(right|j)\s*=.*len.*while.*left.*<.*right',
            r'while\s+\w+\s*<\s*\w+.*\w+\s*\+=\s*1.*\w+\s*-=\s*1',
        ],
        "name": "Two-Pointer Technique",
    },
    "dynamic_programming": {
        "patterns": [
            r'dp\s*=\s*\[',
            r'memo\s*=\s*[\[{]',
            r'@\s*lru_cache',
            r'dp\[.*\]\s*=\s*.*dp\[',
        ],
        "name": "Dynamic Programming",
    },
    "sliding_window": {
        "patterns": [
            r'window.*\bwhile\b.*\bfor\b',
            r'(left|start)\s*=\s*0.*for\s+\w+.*range.*while',
        ],
        "name": "Sliding Window",
    },
    "bfs": {
        "patterns": [
            r'queue\s*=.*\bwhile\b.*queue.*\b(popleft|pop\(0\))\b',
            r'from\s+collections\s+import\s+deque.*queue',
        ],
        "name": "BFS (Breadth-First Search)",
    },
    "dfs": {
        "patterns": [
            r'stack\s*=.*\bwhile\b.*stack.*\bpop\b',
            r'def\s+dfs\b',
            r'def\s+\w+.*visited.*\brecurs',
        ],
        "name": "DFS (Depth-First Search)",
    },
}


def detect_algorithms(code: str) -> List[str]:
    """Detect known algorithm patterns in the code."""
    detected = []
    code_flat = ' '.join(code.split())  # Flatten for multi-line pattern matching

    for algo_id, algo in ALGORITHM_SIGNATURES.items():
        for pattern in algo["patterns"]:
            if re.search(pattern, code_flat, re.IGNORECASE | re.DOTALL):
                detected.append(algo["name"])
                break

    return detected


# ══════════════════════════════════════════════════════════════
# STRUCTURAL ISSUE DETECTION
# ══════════════════════════════════════════════════════════════

def detect_structural_issues(code: str, ast_info: ASTInfo, language: str) -> List[PatternMatch]:
    """Detect structural issues using AST data + code patterns."""
    issues: List[PatternMatch] = []
    issue_counter = 0

    def add_issue(name, line, severity, desc, suggestion, category):
        nonlocal issue_counter
        issue_counter += 1
        issues.append(PatternMatch(
            pattern_id=f"struct-{issue_counter}",
            pattern_name=name,
            line_number=line,
            severity=severity,
            description=desc,
            suggestion=suggestion,
            category=category
        ))

    # ── Deeply nested loops ──
    for loop in ast_info.loops:
        if loop.depth >= 3:
            add_issue(
                "deep-nesting", loop.line, "critical",
                f"Triple-nested loop detected at depth {loop.depth}. This creates O(n³) or worse complexity.",
                "Consider using hash maps, sorting, or divide-and-conquer to reduce nesting.",
                "performance"
            )
        elif loop.depth >= 2:
            add_issue(
                "nested-loop", loop.line, "warning",
                f"Nested loop detected at depth {loop.depth}. This creates O(n²) complexity.",
                "Evaluate if a hash set or dictionary lookup could replace the inner loop for O(n) complexity.",
                "performance"
            )

    # ── Long functions ──
    for func in ast_info.functions:
        if func.length > 50:
            add_issue(
                "long-function", func.line, "warning",
                f"Function '{func.name}' is {func.length} lines long. Long functions are hard to test and maintain.",
                "Break this function into smaller, focused helper functions with clear responsibilities.",
                "maintainability"
            )
        elif func.length > 30:
            add_issue(
                "moderate-function", func.line, "info",
                f"Function '{func.name}' is {func.length} lines. Consider if it can be simplified.",
                "Look for logical sections that could be extracted into separate functions.",
                "maintainability"
            )

    # ── Too many parameters ──
    for func in ast_info.functions:
        if func.arg_count > 5:
            add_issue(
                "too-many-args", func.line, "warning",
                f"Function '{func.name}' has {func.arg_count} parameters. This makes it hard to use and test.",
                "Consider grouping related parameters into a data class or config object.",
                "readability"
            )

    # ── Recursion without base case check ──
    for func_name in ast_info.recursive_functions:
        func = next((f for f in ast_info.functions if f.name == func_name), None)
        if func:
            add_issue(
                "recursion-detected", func.line, "info",
                f"Function '{func.name}' uses recursion. Ensure it has a proper base case to avoid stack overflow.",
                "Verify the base case handles all edge cases. Consider an iterative approach for very deep recursion.",
                "performance"
            )

    # ── Unused variables ──
    for var in ast_info.variables:
        if not var.used:
            add_issue(
                "unused-variable", var.defined_line, "info",
                f"Variable '{var.name}' is defined but never used.",
                f"Remove the unused variable '{var.name}' to keep the code clean.",
                "readability"
            )

    # ── Missing return in non-trivial functions ──
    for func in ast_info.functions:
        if not func.has_return and func.length > 5 and func.name != "__init__":
            add_issue(
                "no-return", func.line, "info",
                f"Function '{func.name}' has no return statement. If it computes a value, it should return it.",
                "Add a return statement if this function should produce output, or document it as a procedure.",
                "best-practice"
            )

    # ── High nesting depth ──
    if ast_info.max_nesting_depth >= 4:
        add_issue(
            "high-nesting", 1, "warning",
            f"Maximum nesting depth is {ast_info.max_nesting_depth}. Deep nesting makes code hard to follow.",
            "Use early returns, guard clauses, or extract nested logic into helper functions.",
            "readability"
        )

    return issues


# ══════════════════════════════════════════════════════════════
# PUBLIC API
# ══════════════════════════════════════════════════════════════

def analyze(code: str, ast_info: ASTInfo, language: str) -> StaticAnalysisResult:
    """
    Run the full static analysis pipeline.
    Combines structural issue detection with algorithm recognition.
    """
    patterns = detect_structural_issues(code, ast_info, language)
    algorithms = detect_algorithms(code)

    return StaticAnalysisResult(
        ast_info=ast_info,
        patterns=patterns,
        detected_algorithms=algorithms
    )

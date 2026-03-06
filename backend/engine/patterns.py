# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Module 5: Pattern & Code Smell Detector
Rule-based engine that detects common anti-patterns and optimization opportunities.
"""
import re
from typing import List
from .models import ASTInfo, PatternMatch


# ══════════════════════════════════════════════════════════════
# PATTERN RULE DATABASE
# ══════════════════════════════════════════════════════════════

def detect_patterns(code: str, ast_info: ASTInfo, language: str) -> List[PatternMatch]:
    """
    Run all pattern detection rules against the code.
    Returns a list of PatternMatch objects.
    """
    patterns: List[PatternMatch] = []
    counter = 0
    lines = code.split('\n')

    def add(name, line, severity, desc, suggestion, category):
        nonlocal counter
        counter += 1
        patterns.append(PatternMatch(
            pattern_id=f"pattern-{counter}",
            pattern_name=name,
            line_number=line,
            severity=severity,
            description=desc,
            suggestion=suggestion,
            category=category
        ))

    # ── Rule 1: Sort inside loop ──────────────────────────────
    in_loop = False
    loop_start_line = 0
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if re.match(r'\b(for|while)\b', stripped):
            in_loop = True
            loop_start_line = i
        if in_loop and re.search(r'\b(sort|sorted)\s*\(', stripped):
            add(
                "sort-in-loop", i, "critical",
                "Sorting operation found inside a loop. This multiplies complexity by O(n log n) per iteration.",
                "Move the sort() call outside the loop. Sort once before iterating.",
                "performance"
            )

    # ── Rule 2: Nested iteration over same collection ─────────
    for j, loop in enumerate(ast_info.loops):
        if loop.depth >= 2 and loop.iterates_over:
            # Check if parent loop iterates over same thing
            parent_loops = [l for l in ast_info.loops if l.depth == loop.depth - 1 and l.line < loop.line]
            for parent in parent_loops:
                if parent.iterates_over == loop.iterates_over:
                    add(
                        "nested-same-collection", loop.line, "critical",
                        f"Nested loops iterating over the same collection '{loop.iterates_over}'. This is O(n²).",
                        "Use a set or dictionary for O(1) lookups instead of the inner loop.",
                        "performance"
                    )
                    break

    # ── Rule 3: String concatenation in loop ──────────────────
    in_loop = False
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if re.match(r'\b(for|while)\b', stripped):
            in_loop = True
        if in_loop and re.search(r'\w+\s*\+=\s*["\']', stripped):
            add(
                "string-concat-in-loop", i, "warning",
                "String concatenation using += inside a loop creates a new string object each iteration.",
                "Use a list to collect parts, then join() them at the end. E.g.: parts.append(s); result = ''.join(parts)",
                "performance"
            )
            in_loop = False  # Only flag once

    # ── Rule 4: Bare except / Pokemon exception handling ──────
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if re.match(r'except\s*:', stripped):
            add(
                "bare-except", i, "warning",
                "Bare 'except:' clause catches ALL exceptions including KeyboardInterrupt and SystemExit.",
                "Catch specific exceptions: 'except ValueError:' or at minimum 'except Exception:'.",
                "best-practice"
            )

    # ── Rule 5: Magic numbers ─────────────────────────────────
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if re.search(r'(?<![\w.])(?:if|while|for|return|==|!=|>|<|>=|<=)\s*.*\b\d{2,}\b', stripped):
            # Skip common acceptable numbers like 0, 1, 2, 100
            nums = re.findall(r'\b(\d{2,})\b', stripped)
            for num in nums:
                if num not in ('10', '100', '1000', '00'):
                    add(
                        "magic-number", i, "info",
                        f"Magic number {num} found. Hard-coded numbers reduce readability.",
                        f"Extract {num} into a named constant: MAX_SIZE = {num}",
                        "readability"
                    )
                    break

    # ── Rule 6: Global variable usage ─────────────────────────
    if language == "python":
        for i, line in enumerate(lines, 1):
            if re.match(r'\s*global\s+\w+', line):
                add(
                    "global-variable", i, "warning",
                    "'global' keyword used. Global state makes code harder to test and reason about.",
                    "Pass the variable as a function parameter instead of using global.",
                    "maintainability"
                )

    # ── Rule 7: Redundant boolean comparison ──────────────────
    for i, line in enumerate(lines, 1):
        if re.search(r'==\s*(True|False)\b', line) or re.search(r'\b(True|False)\s*==', line):
            add(
                "redundant-bool", i, "info",
                "Redundant comparison with True/False. This is unnecessarily verbose.",
                "Simplify: 'if x == True' → 'if x', 'if x == False' → 'if not x'.",
                "readability"
            )

    # ── Rule 8: Mutable default argument ──────────────────────
    if language == "python":
        for i, line in enumerate(lines, 1):
            if re.search(r'def\s+\w+\s*\(.*=\s*(\[\]|\{\})\s*[,)]', line):
                add(
                    "mutable-default-arg", i, "critical",
                    "Mutable default argument ([] or {}). This is a common Python bug — the value is shared across calls.",
                    "Use None as default and initialize inside the function: 'def f(x=None): x = x or []'.",
                    "best-practice"
                )

    # ── Rule 9: Star import ───────────────────────────────────
    for i, line in enumerate(lines, 1):
        if re.match(r'\s*from\s+\w+\s+import\s+\*', line):
            add(
                "star-import", i, "warning",
                "Star import ('from x import *') pollutes the namespace and makes it unclear where names come from.",
                "Import specific names: 'from module import name1, name2'.",
                "readability"
            )

    # ── Rule 10: Deeply nested conditionals ───────────────────
    max_if_depth = 0
    if_depth = 0
    if_line = 0
    for i, line in enumerate(lines, 1):
        indent = len(line) - len(line.lstrip())
        stripped = line.strip()
        if stripped.startswith(('if ', 'elif ')):
            current_depth = indent // 4 + 1 if language == "python" else line.count('{')
            if current_depth > max_if_depth:
                max_if_depth = current_depth
                if_line = i

    if max_if_depth >= 4:
        add(
            "deeply-nested-if", if_line, "warning",
            f"Conditional nesting depth of {max_if_depth}. Deeply nested if/elif makes code hard to follow.",
            "Use early returns (guard clauses) to flatten the logic.",
            "readability"
        )

    # ── Rule 11: Empty except block ───────────────────────────
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('except') and i < len(lines):
            next_stripped = lines[i].strip() if i < len(lines) else ""
            if next_stripped == 'pass' or next_stripped == '...':
                add(
                    "empty-except", i, "warning",
                    "Empty except block silently swallows errors. This makes debugging very difficult.",
                    "At minimum, log the error: 'except Exception as e: logging.error(e)'.",
                    "best-practice"
                )

    # ── Rule 12: List comprehension opportunity ───────────────
    if language == "python":
        in_loop_for_append = False
        loop_line = 0
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if re.match(r'for\s+\w+\s+in\s+', stripped):
                in_loop_for_append = True
                loop_line = i
            if in_loop_for_append and re.search(r'\.append\(', stripped):
                add(
                    "use-list-comprehension", loop_line, "info",
                    "Loop with .append() detected. This could be simplified with a list comprehension.",
                    "Replace the loop with: result = [transform(x) for x in iterable].",
                    "readability"
                )
                in_loop_for_append = False

    return patterns

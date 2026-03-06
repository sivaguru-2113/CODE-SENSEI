# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Module 4: Complexity Detector
Estimates Big-O time and space complexity from AST structural data.
"""
import re
from .models import ASTInfo, ComplexityAnalysis


# ══════════════════════════════════════════════════════════════
# TIME COMPLEXITY ESTIMATION
# ══════════════════════════════════════════════════════════════

def estimate_time_complexity(ast_info: ASTInfo, code: str) -> str:
    """
    Estimate Big-O time complexity based on:
    1. Loop nesting depth
    2. Recursion patterns
    3. Known algorithm signatures
    """
    max_depth = 0

    # Calculate max loop nesting depth
    if ast_info.loops:
        max_depth = max(loop.depth for loop in ast_info.loops)

    # Check for special patterns in code
    has_binary_search = bool(re.search(
        r'mid\s*=\s*\(?\s*\w+\s*\+\s*\w+\s*\)?\s*//?\s*2', code
    ))
    has_sort_call = bool(re.search(r'\b(sort|sorted)\s*\(', code))
    has_hashmap = bool(re.search(r'\b(dict|{}|HashMap|Map|set)\b', code))

    # Recursion handling
    if ast_info.has_recursion:
        # Check if it's a divide-and-conquer (binary split)
        for func_name in ast_info.recursive_functions:
            func = next((f for f in ast_info.functions if f.name == func_name), None)
            if func:
                # If recursive function also has binary search pattern
                if has_binary_search:
                    return "O(log n)"
                # If recursive function calls itself twice (like fibonacci, merge sort)
                call_count = sum(1 for c in func.calls if c == func_name)
                if call_count >= 2:
                    # Could be O(2^n) for naive recursion or O(n log n) for merge sort
                    if has_sort_call or max_depth >= 1:
                        return "O(n log n)"
                    return "O(2ⁿ)"
                # Single recursive call with loop
                if max_depth >= 1:
                    return "O(n²)"
                return "O(n)"

    # Binary search detected without recursion
    if has_binary_search and max_depth <= 1:
        return "O(log n)"

    # Sort call at top level
    if has_sort_call and max_depth <= 1:
        return "O(n log n)"

    # Pure loop depth mapping
    depth_to_complexity = {
        0: "O(1)",
        1: "O(n)",
        2: "O(n²)",
        3: "O(n³)",
    }

    if max_depth in depth_to_complexity:
        # If there's a sort inside a loop, bump up
        if has_sort_call and max_depth >= 1:
            return "O(n² log n)" if max_depth == 1 else "O(n³)"
        return depth_to_complexity[max_depth]

    # Very deep nesting
    if max_depth > 3:
        return "O(n³)"

    return "Unknown"


# ══════════════════════════════════════════════════════════════
# SPACE COMPLEXITY ESTIMATION
# ══════════════════════════════════════════════════════════════

def estimate_space_complexity(ast_info: ASTInfo, code: str) -> str:
    """
    Estimate Big-O space complexity based on:
    1. Data structure allocations
    2. Recursion depth
    3. In-loop allocations
    """
    # Check for common space patterns
    has_list_alloc = bool(re.search(r'\[\s*\]|\blist\s*\(|\[\w+\s+for\s+', code))
    has_dict_alloc = bool(re.search(r'\{\s*\}|\bdict\s*\(|\{.*:.*for\s+', code))
    has_matrix = bool(re.search(r'\[\s*\[.*\]\s*for\s+', code))
    has_recursion = ast_info.has_recursion

    # Matrix allocation → O(n²)
    if has_matrix:
        return "O(n²)"

    # Recursion uses stack space
    if has_recursion:
        # Check if double recursion (like fibonacci)
        for func_name in ast_info.recursive_functions:
            func = next((f for f in ast_info.functions if f.name == func_name), None)
            if func:
                call_count = sum(1 for c in func.calls if c == func_name)
                if call_count >= 2:
                    return "O(n)"  # Recursion stack depth
        return "O(n)"  # Linear recursion stack

    # List or dict allocation
    if has_list_alloc or has_dict_alloc:
        # Check if inside a loop (n allocations)
        lines = code.split('\n')
        in_loop = False
        for line in lines:
            stripped = line.strip()
            if re.match(r'\b(for|while)\b', stripped):
                in_loop = True
            if in_loop and (re.search(r'\.append\(', stripped) or re.search(r'\[\w+\]', stripped)):
                return "O(n)"
        return "O(n)"

    return "O(1)"


# ══════════════════════════════════════════════════════════════
# PUBLIC API
# ══════════════════════════════════════════════════════════════

def analyze_complexity(ast_info: ASTInfo, code: str) -> ComplexityAnalysis:
    """
    Full complexity analysis.
    Returns a ComplexityAnalysis with time/space complexity and structural metrics.
    """
    time_c = estimate_time_complexity(ast_info, code)
    space_c = estimate_space_complexity(ast_info, code)

    # Clamp to valid Literal values
    valid_complexities = ['O(1)', 'O(n)', 'O(n²)', 'O(n³)', 'O(log n)', 'O(n log n)', 'O(2ⁿ)', 'Unknown']
    if time_c not in valid_complexities:
        time_c = "Unknown"
    if space_c not in valid_complexities:
        space_c = "O(n)"

    return ComplexityAnalysis.model_validate({
        "timeComplexity": time_c,
        "spaceComplexity": space_c,
        "nestingDepth": ast_info.max_nesting_depth,
        "loopCount": ast_info.total_loop_count,
    })

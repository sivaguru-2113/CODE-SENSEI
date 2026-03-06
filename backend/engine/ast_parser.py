# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Module 2: AST Parser
Builds Abstract Syntax Trees for Python code and uses regex-based
structural parsing for JavaScript/Go/Rust/Java/C++.
"""
import ast
import re
from typing import List, Optional, Set
from .models import ASTInfo, FunctionInfo, LoopInfo, VariableInfo


# ══════════════════════════════════════════════════════════════
# PYTHON AST PARSER (full-powered)
# ══════════════════════════════════════════════════════════════

class PythonLoopVisitor(ast.NodeVisitor):
    """Walk the Python AST and collect loop information with nesting depth."""

    def __init__(self):
        self.loops: List[LoopInfo] = []
        self._depth = 0

    def visit_For(self, node):
        self._depth += 1
        iter_over = None
        if isinstance(node.iter, ast.Call) and isinstance(node.iter.func, ast.Name):
            iter_over = node.iter.func.id
        elif isinstance(node.iter, ast.Name):
            iter_over = node.iter.id

        self.loops.append(LoopInfo(
            line=node.lineno,
            depth=self._depth,
            loop_type="for",
            iterates_over=iter_over
        ))
        self.generic_visit(node)
        self._depth -= 1

    def visit_While(self, node):
        self._depth += 1
        self.loops.append(LoopInfo(
            line=node.lineno,
            depth=self._depth,
            loop_type="while",
            iterates_over=None
        ))
        self.generic_visit(node)
        self._depth -= 1


class PythonFunctionVisitor(ast.NodeVisitor):
    """Extract function definitions and detect recursion."""

    def __init__(self):
        self.functions: List[FunctionInfo] = []
        self._current_func: Optional[str] = None

    def visit_FunctionDef(self, node):
        calls = []
        is_recursive = False

        for child in ast.walk(node):
            if isinstance(child, ast.Call):
                if isinstance(child.func, ast.Name):
                    calls.append(child.func.id)
                    if child.func.id == node.name:
                        is_recursive = True
                elif isinstance(child.func, ast.Attribute):
                    calls.append(child.func.attr)

        has_return = any(isinstance(n, ast.Return) and n.value is not None for n in ast.walk(node))
        end_line = getattr(node, 'end_lineno', node.lineno + 1) or node.lineno + 1

        self.functions.append(FunctionInfo(
            name=node.name,
            line=node.lineno,
            end_line=end_line,
            length=end_line - node.lineno,
            arg_count=len(node.args.args),
            has_return=has_return,
            is_recursive=is_recursive,
            calls=list(set(calls))
        ))
        self.generic_visit(node)

    visit_AsyncFunctionDef = visit_FunctionDef


class PythonVariableVisitor(ast.NodeVisitor):
    """Track variable assignments and usage to detect unused variables."""

    def __init__(self):
        self.defined: dict = {}  # name -> line
        self.used: Set[str] = set()
        self._in_target = False

    def visit_Assign(self, node):
        for target in node.targets:
            if isinstance(target, ast.Name):
                if target.id not in self.defined:
                    self.defined[target.id] = target.lineno
        self.generic_visit(node)

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Load):
            self.used.add(node.id)
        self.generic_visit(node)

    def get_variables(self) -> List[VariableInfo]:
        variables = []
        builtins = {'print', 'range', 'len', 'int', 'str', 'float', 'list', 'dict',
                     'set', 'tuple', 'True', 'False', 'None', 'self', 'cls', '__name__'}
        for name, line in self.defined.items():
            if name.startswith('_') or name in builtins:
                continue
            is_used = name in self.used
            variables.append(VariableInfo(
                name=name,
                defined_line=line,
                used=is_used,
                use_count=1 if is_used else 0
            ))
        return variables


class PythonNestingVisitor(ast.NodeVisitor):
    """Measure maximum nesting depth (loops + conditionals)."""

    def __init__(self):
        self.max_depth = 0
        self._depth = 0

    def _enter(self, node):
        self._depth += 1
        self.max_depth = max(self.max_depth, self._depth)
        self.generic_visit(node)
        self._depth -= 1

    def visit_For(self, node): self._enter(node)
    def visit_While(self, node): self._enter(node)
    def visit_If(self, node): self._enter(node)
    def visit_With(self, node): self._enter(node)
    def visit_Try(self, node): self._enter(node)


def parse_python(code: str) -> ASTInfo:
    """Full AST parsing for Python code."""
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return ASTInfo(parse_success=False)

    # Run all visitors
    loop_v = PythonLoopVisitor()
    loop_v.visit(tree)

    func_v = PythonFunctionVisitor()
    func_v.visit(tree)

    var_v = PythonVariableVisitor()
    var_v.visit(tree)

    nest_v = PythonNestingVisitor()
    nest_v.visit(tree)

    # Count classes
    class_count = sum(1 for n in ast.walk(tree) if isinstance(n, ast.ClassDef))

    # Detect recursion
    recursive_funcs = [f.name for f in func_v.functions if f.is_recursive]

    return ASTInfo(
        functions=func_v.functions,
        loops=loop_v.loops,
        variables=var_v.get_variables(),
        max_nesting_depth=nest_v.max_depth,
        total_loop_count=len(loop_v.loops),
        has_recursion=len(recursive_funcs) > 0,
        recursive_functions=recursive_funcs,
        class_count=class_count,
        parse_success=True
    )


# ══════════════════════════════════════════════════════════════
# GENERIC REGEX PARSER (for JS, Go, Rust, Java, C++ etc.)
# ══════════════════════════════════════════════════════════════

def _find_loops_regex(code: str) -> List[LoopInfo]:
    """Find loops using regex for non-Python languages."""
    loops = []
    lines = code.split('\n')

    # Track nesting via brace depth
    brace_depth = 0
    loop_stack = []

    for i, line in enumerate(lines, 1):
        stripped = line.strip()

        # Detect loop starts
        is_loop = bool(re.match(r'\b(for|while|do)\b', stripped))
        if is_loop:
            brace_depth_at_start = brace_depth
            loop_type = "for" if stripped.startswith("for") else "while"
            depth = len(loop_stack) + 1
            loops.append(LoopInfo(
                line=i,
                depth=depth,
                loop_type=loop_type,
                iterates_over=None
            ))
            loop_stack.append(brace_depth)

        # Track braces
        brace_depth += stripped.count('{') - stripped.count('}')

        # Pop loop stack when we close back
        while loop_stack and brace_depth <= loop_stack[-1]:
            loop_stack.pop()

    return loops


def _find_functions_regex(code: str, language: str) -> List[FunctionInfo]:
    """Find functions using regex for non-Python languages."""
    functions = []
    lines = code.split('\n')

    if language in ("javascript", "typescript"):
        pattern = r'(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\(.*?\)\s*=>))'
    elif language == "go":
        pattern = r'func\s+(\w+)'
    elif language == "rust":
        pattern = r'fn\s+(\w+)'
    elif language in ("java", "cpp"):
        pattern = r'(?:public|private|protected|static)?\s*\w+\s+(\w+)\s*\('
    else:
        pattern = r'function\s+(\w+)'

    for i, line in enumerate(lines, 1):
        match = re.search(pattern, line)
        if match:
            name = match.group(1) or (match.group(2) if match.lastindex >= 2 else "anonymous")
            # Estimate function length by finding the next closing brace at same level
            func_end = min(i + 30, len(lines))
            brace_count = 0
            for j in range(i - 1, len(lines)):
                brace_count += lines[j].count('{') - lines[j].count('}')
                if brace_count <= 0 and j > i - 1:
                    func_end = j + 1
                    break

            # Check for recursion (function calls itself)
            body = '\n'.join(lines[i:func_end])
            is_recursive = bool(re.search(rf'\b{re.escape(name)}\s*\(', body))

            # Count args
            arg_match = re.search(r'\(([^)]*)\)', line)
            arg_count = len([a for a in arg_match.group(1).split(',') if a.strip()]) if arg_match else 0

            functions.append(FunctionInfo(
                name=name,
                line=i,
                end_line=func_end,
                length=func_end - i,
                arg_count=arg_count,
                has_return=bool(re.search(r'\breturn\b', body)),
                is_recursive=is_recursive,
                calls=[]
            ))

    return functions


def parse_generic(code: str, language: str) -> ASTInfo:
    """Regex-based structural parsing for non-Python languages."""
    loops = _find_loops_regex(code)
    functions = _find_functions_regex(code, language)

    max_depth = max((l.depth for l in loops), default=0)
    recursive_funcs = [f.name for f in functions if f.is_recursive]

    return ASTInfo(
        functions=functions,
        loops=loops,
        variables=[],  # Regex can't reliably track variable usage
        max_nesting_depth=max_depth,
        total_loop_count=len(loops),
        has_recursion=len(recursive_funcs) > 0,
        recursive_functions=recursive_funcs,
        class_count=len(re.findall(r'\bclass\s+\w+', code)),
        parse_success=True
    )


# ══════════════════════════════════════════════════════════════
# PUBLIC API
# ══════════════════════════════════════════════════════════════

def parse_code(code: str, language: str) -> ASTInfo:
    """
    Parse code into structured AST information.
    Uses full AST for Python, regex-based parsing for other languages.
    """
    if language == "python":
        return parse_python(code)
    else:
        return parse_generic(code, language)

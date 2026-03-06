# pyre-ignore-all-errors
"""
CODE-SENSEI Engine — Shared Pydantic Models
All data structures used across the analysis pipeline.
"""
from pydantic import BaseModel  # type: ignore
from typing import List, Optional, Literal, Dict, Any


# ── API-Level Types ──────────────────────────────────────────
Complexity = Literal['O(1)', 'O(n)', 'O(n²)', 'O(n³)', 'O(log n)', 'O(n log n)', 'O(2ⁿ)', 'Unknown']
Severity = Literal['critical', 'warning', 'info']


# ── Internal Pipeline Models ─────────────────────────────────

class PreprocessResult(BaseModel):
    """Output from the preprocessing stage."""
    cleaned_code: str
    original_code: str
    detected_language: str
    line_count: int
    has_syntax_error: bool
    syntax_error_message: Optional[str] = None
    comment_ratio: float = 0.0
    function_count: int = 0
    import_count: int = 0


class LoopInfo(BaseModel):
    """Describes a loop found in the AST."""
    line: int
    depth: int
    loop_type: str  # "for", "while"
    iterates_over: Optional[str] = None


class FunctionInfo(BaseModel):
    """Describes a function found in the AST."""
    name: str
    line: int
    end_line: int
    length: int
    arg_count: int
    has_return: bool
    is_recursive: bool = False
    calls: List[str] = []


class VariableInfo(BaseModel):
    """Describes a variable usage pattern."""
    name: str
    defined_line: int
    used: bool = False
    use_count: int = 0


class ASTInfo(BaseModel):
    """Structured information extracted from AST parsing."""
    functions: List[FunctionInfo] = []
    loops: List[LoopInfo] = []
    variables: List[VariableInfo] = []
    max_nesting_depth: int = 0
    total_loop_count: int = 0
    has_recursion: bool = False
    recursive_functions: List[str] = []
    class_count: int = 0
    parse_success: bool = True


class PatternMatch(BaseModel):
    """A detected code pattern / smell."""
    pattern_id: str
    pattern_name: str
    line_number: int
    severity: Severity
    description: str
    suggestion: str
    category: str  # "performance", "readability", "maintainability", "best-practice"


class StaticAnalysisResult(BaseModel):
    """Combined output from the static analysis stage."""
    ast_info: ASTInfo
    patterns: List[PatternMatch] = []
    detected_algorithms: List[str] = []


# ── API Response Models ──────────────────────────────────────

class CodeIssue(BaseModel):
    id: str
    type: str
    lineNumber: int
    severity: Severity
    description: str
    suggestion: str


class AnalysisMetrics(BaseModel):
    readability: float
    efficiency: float
    maintainability: float
    bestPractices: float
    errorHandling: float


class ComplexityAnalysis(BaseModel):
    timeComplexity: Complexity
    spaceComplexity: Complexity
    nestingDepth: int
    loopCount: int


class CodeAnalysisResult(BaseModel):
    id: str
    code: str
    language: str
    complexity: ComplexityAnalysis
    metrics: AnalysisMetrics
    issues: List[CodeIssue]
    finalScore: float
    explanation: str
    timestamp: float


class AnalyzeRequest(BaseModel):
    code: str
    language: str = "javascript"

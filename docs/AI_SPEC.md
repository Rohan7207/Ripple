AI_SPEC.md
Ripple — AI Specification

1. Purpose
   Ripple uses AI as a reasoning and synthesis layer over deterministic repository analysis.
   The system should not ask an LLM to blindly understand an entire repository. Instead:
   Deterministic analysis establishes repository facts. AI interprets those facts and reasons
   about what they mean.
   AI is responsible for explaining architecture, answering repository questions, analyzing change
   impact, and reasoning about hypothetical changes.
   Ripple does not automatically modify repository code.

2. AI Capabilities
   The MVP provides four core AI capabilities:
3. Repository Understanding
4. Ask Ripple
5. Impact Analysis
6. What-If Analysis
   These capabilities are coordinated through a single AI Orchestrator rather than multiple
   autonomous agents.

7. AI Orchestrator
   The AI Orchestrator is the single entry point for AI-powered operations.
   It determines:
8. What the user is asking.
9. Which repository information is relevant.
10. Which files, symbols, graph relationships, and source snippets are required.
11. Which AI capability should process the request.
12. What structured response should be returned.
    The orchestrator should avoid sending unnecessary repository content to the LLM.
    Conceptual flow
    Request
    ↓
    Identify intent
    ↓
    Retrieve relevant context
    ↓
    Build AI context
    ↓
    Call LLM
    ↓
    Validate structured output
    ↓
    Return response
13. Context Retrieval
    AI context should be retrieved from deterministic repository analysis.
    Relevant context may include:
    • Repository metadata
    • Directory structure
    • Relevant files
    • File paths
    • Symbols
    • Functions
    • Classes
    • Components
    • API endpoints
    • Import/export relationships
    • Dependency relationships
    • Graph nodes
    • Graph edges
    • Relevant source snippets
    • Analysis warnings
    • Analysis coverage
    The entire repository should not be included by default.
    Context Selection Principle
    Retrieve the smallest useful context that provides enough evidence to answer the request.
    For example, if the user asks:
    "What happens when a citizen submits a complaint?"
    Ripple should retrieve the relevant request flow, controllers/routes, services, AI processing,
    database interactions, and related frontend components rather than sending every repository
    file to the LLM.
14. AI Context Structure
    The AI layer should conceptually receive structured context similar to:
    Repository Metadata
    ├── Repository name
    ├── Languages
    ├── Frameworks
    └── Analysis status
    Relevant Files
    ├── File paths
    ├── File metadata
    └── Relevant source snippets
    Symbols
    ├── Functions
    ├── Classes
    ├── Components
    └── API endpoints
    Relationships
    ├── Imports
    ├── Exports
    ├── Calls
    ├── References
    ├── Renders
    └── Dependencies
    User Intent
    ├── Question
    ├── Requested analysis
    └── Hypothetical change (if applicable)
    The exact internal implementation may evolve without changing the AI contract.

15. Ask Ripple
    Ask Ripple allows users to ask natural-language questions about the repository.
    Examples:
    "Where is authentication handled?"
    "How does a report move from submission to completion?"
    "Which components depend on UserContext?"
    "What happens when this API fails?"
    "Where should I start if I want to change the payment flow?"
    Processing
    User Question
    ↓
    Intent Identification
    ↓
    Relevant Context Retrieval
    ↓
    Graph + Source Evidence
    ↓
    LLM Reasoning
    ↓
    Structured Answer
    Response Requirements
    Answers should:
    • Directly answer the question.
    • Reference relevant repository paths.
    • Explain relationships where useful.
    • Avoid unsupported claims.
    • Clearly communicate uncertainty.
    • Provide source references that the UI can make clickable.
16. Evidence and Sources
    AI responses should be grounded in repository evidence.
    Where possible, responses should identify:
    • File path
    • Symbol
    • Relevant relationship
    • Source location
    Example:
    The authentication flow begins in:
    src/controllers/auth.controller.ts
    It calls:
    src/services/auth.service.ts
    which generates the authentication token.
    Evidence: - auth.controller.ts - auth.service.ts - middleware/auth.middleware.ts
    The frontend should be able to navigate from an AI answer to the corresponding repository item.
17. Impact Analysis
    Impact Analysis determines what could be affected by a proposed change.
    The analysis should combine:
    Deterministic Graph Analysis
    Used to identify:
    • Direct dependencies
    • Indirect dependencies
    • Call relationships
    • Import relationships
    • References
    • Related components
    • Potentially affected APIs
    AI Reasoning
    Used to explain:
    • Why an area may be affected.
    • What behavior could change.
    • What dependencies need attention.
    • What additional areas should be reviewed.
    • What implementation considerations exist.
    Core Principle
    The graph provides evidence of relationships; AI explains the consequences.
    AI should not invent dependencies that are absent from the analyzed repository.
18. Impact Categories
    Impact results should be grouped into:
    Direct Impact
    Files or components directly connected to the changed element.
    Indirect Impact
    Areas affected through dependency chains or other relationships.
    Related Areas
    Areas that may require review even when a direct dependency cannot be established.
    Confidence
    Each significant impact result may include:
    HIGH
    MEDIUM
    LOW
    Confidence must be qualitative.

19. What-If Analysis
    What-If allows users to explore hypothetical changes without modifying the repository.
    Examples:
    "What if authentication changes from JWT to sessions?"
    "What if we replace MongoDB with PostgreSQL?"

"What if this component becomes reusable across multiple pages?"

"What if we split this service into two modules?"
Processing
Hypothetical Scenario
↓
Identify Relevant Repository Areas
↓
Traverse Graph
↓
Retrieve Supporting Evidence
↓
AI Reasoning
↓
Affected Areas
↓
Considerations
↓
Implementation Plan

20. What-If Response Structure
    A What-If response should contain:
    Scenario
    A concise restatement of the proposed change.
    Affected Areas
    Repository areas likely to require changes.
    Dependencies
    Important relationships that would be affected.
    Considerations
    Technical implications, trade-offs, and areas requiring investigation.
    Implementation Plan
    A practical sequence of changes referencing real repository paths where possible.
    Uncertainty
    Areas where the repository does not provide enough evidence.
21. Implementation Plans
    When AI generates an implementation plan, it should reference real repository structures
    whenever possible.
    Example:
22. Update authentication logic
    → src/services/auth.service.ts
23. Update authentication middleware
    → src/middleware/auth.middleware.ts
24. Update frontend authentication state
    → src/context/AuthContext.tsx
25. Update affected API consumers
    → src/services/api.ts
    Plans should be derived from repository evidence.
    If a required location cannot be established, Ripple should explicitly say so rather than inventing
    a path.
26. Structured AI Responses
    AI output should use structured data rather than arbitrary free-form responses wherever
    possible.
    This allows the frontend to consistently render:
    • Explanations
    • Sources
    • Affected files
    • Impact categories
    • Confidence
    • Considerations
    • Implementation steps
    • Warnings

27. Uncertainty Handling
    Ripple must not pretend to know something that cannot be established from repository
    evidence.
    When evidence is insufficient, AI should communicate this explicitly.
    Example:
    The repository analysis shows that A imports B, but the available
    analysis does not establish whether C is affected.
    Further investigation is required.
    AI should distinguish:
    Observed
    from:
    Inferred
    and:
    Unknown / Insufficient Evidence
    This is especially important for Impact and What-If analysis.
28. AI Guardrails
    The AI layer must follow these principles:
    No Hallucinated Repository Facts
    Do not invent:
    • Files
    • Functions
    • Classes
    • Components
    • APIs
    • Dependencies
    • Relationships
    • Configuration
    • Architecture
    No Unsupported Conclusions
    If repository evidence is insufficient, state the limitation.
    No Automatic Code Modification
    Ripple does not:
    • Edit files
    • Commit changes
    • Create pull requests
    • Push changes
    • Rewrite the repository
    The MVP produces explanations and plans only.
    No Blind Full-Repository Prompting
    The LLM should receive relevant context rather than the complete repository by default.
29. Security and Sensitive Information
    Sensitive information must not be unnecessarily exposed to the AI model or displayed in the UI.
    Potential sensitive content includes:
    • API keys
    • Access tokens
    • Passwords
    • Credentials
    • .env values
    • Private secrets
    • Authentication secrets
    Repository analysis should identify and protect sensitive files or values.
    When sensitive content is detected, Ripple should prefer:
    [REDACTED]
    rather than exposing the actual value.
    The AI layer should receive only the minimum information necessary for analysis.
30. Unsupported Languages
    Ripple's deep structural analysis is optimized for JavaScript and TypeScript in the MVP.
    Repositories containing unsupported languages should still be handled gracefully.
    The system may provide:
    • Repository structure
    • File information
    • Basic metadata
    • Partial analysis
    • Warnings about unsupported areas
    AI should not claim deep structural understanding where deterministic analysis is unavailable.
    Example:
    This repository contains Python files that are not fully supported
    by the current structural analyzer. The following explanation is
    based on available repository structure and supported relationships.
31. Partial Analysis
    AI must account for incomplete repository analysis.
    If analysis coverage is partial:
    Analysis Coverage
    ├── Supported files analyzed
    ├── Unsupported files
    └── Warnings
    AI responses should consider these limitations.
    For example:
    This impact analysis is based on the analyzed JavaScript/TypeScript
    files. Some dependencies may be missing because portions of the
    repository could not be structurally analyzed.
32. AI Provider Abstraction
    The AI provider should be accessed through an abstraction layer.
    Conceptually:
    AI Orchestrator
    ↓
    AI Provider Interface
    ↓
    Configured LLM Provider
    The rest of Ripple should not depend directly on a specific AI provider or model.
    This allows the underlying model/provider to be changed without redesigning the AI
    architecture.
33. AI Failure Handling
    AI failures should not cause the entire repository analysis to fail.
    Possible failures include:
    • Provider unavailable
    • Request timeout
    • Invalid model response
    • Malformed structured output
    • Context too large
    • Rate limiting
    The system should return a controlled error and preserve the underlying deterministic
    repository analysis.
    Example:
    Repository analysis is available, but AI analysis is temporarily
    unavailable. You can continue exploring the repository manually.

34. Core Design Principle
    Ripple's AI architecture follows one central rule:
    Facts come from deterministic repository analysis. Meaning and reasoning come from AI.
    This separation improves:
    • Reliability
    • Explainability
    • Security
    • Context efficiency
    • Debuggability
    • Provider flexibility
    It also prevents the AI layer from becoming the sole source of truth about the repository.
35. MVP Boundary
    Included
    • Repository understanding
    • Ask Ripple
    • Context retrieval
    • Graph-aware reasoning
    • Impact analysis
    • What-If analysis
    • Implementation plans
    • Evidence/source references
    • Qualitative confidence
    • Uncertainty handling
    • Sensitive-data protection
    • AI provider abstraction
    Not Included
    • Autonomous coding agents
    • Automatic code modifications
    • Automatic pull requests
    • Automatic commits
    • Autonomous repository maintenance
    • Multi-agent orchestration
    • Long-running autonomous tasks
    • Training a custom foundation model
    • Persistent conversational memory across repositories
36. Success Criteria
    The AI system is successful when a developer can:
37. Upload an unfamiliar repository.
38. Understand its major architecture through Ripple.
39. Ask natural-language questions about the codebase.
40. Trace relevant relationships using repository evidence.
41. Understand what areas may be affected by a change.
42. Explore hypothetical changes before implementing them.
43. Receive implementation guidance grounded in actual repository paths.
44. Clearly distinguish repository facts from AI interpretation.
45. Understand when Ripple does not have enough evidence.
46. Explore the repository without Ripple modifying their code.

Ripple — System Architecture

1. Architecture Overview
   Ripple is an AI-powered repository understanding system that transforms an unfamiliar
   codebase into a structured, navigable representation of its architecture, dependencies,
   relationships, and potential change impact.
   The architecture follows a structured-analysis-first, AI-assisted approach:
1. Repository is uploaded or provided through supported public repository context.
1. Ripple securely extracts and normalizes repository files.
1. Deterministic analyzers identify files, imports, exports, functions, components, API
   routes, references, and other structural relationships.
1. The extracted information is converted into a repository graph and searchable
   knowledge representation.
1. AI agents operate on this structured context rather than blindly reading the entire
   repository.
1. The graph powers dependency exploration, impact analysis, Ask Ripple, and What-If
   analysis.
1. AI produces explanations and implementation plans but does not automatically
   modify repository code.
   The system is designed for arbitrary repositories while providing its deepest structural analysis
   for JavaScript/TypeScript projects.
1. Architecture Goals
   Primary Goals
   • Analyze unfamiliar repositories automatically.
   • Build a useful structural representation of the codebase.
   • Make dependencies and relationships explorable.
   • Identify likely impact areas for proposed changes.
   • Provide repository-aware AI answers.
   • Support What-If analysis for proposed changes.
   • Generate implementation plans without directly editing code.
   • Protect secrets and sensitive repository information.
   • Keep the architecture feasible for the hackathon implementation window.
   Non-Goals
   Ripple does not:
   • Automatically rewrite or modify repository code.
   • Require every repository to use JavaScript/TypeScript.
   • Depend on a full production-grade distributed infrastructure.
   • Attempt perfect semantic understanding of every programming language.
   • Treat the LLM as the primary source of structural truth.

1. High-Level Architecture
   ┌──────────────────────┐
   │ User │
   │ │
   │ ZIP / Repo / Query │
   └──────────┬───────────┘
   │
   ▼
   ┌──────────────────────┐
   │ React Client │
   │ │
   │ Upload │
   │ Repository Explorer │
   │ Graph Visualization │
   │ Ask Ripple │
   │ What-If │
   └──────────┬───────────┘
   │
   REST / API
   │
   ▼
   ┌──────────────────────────────────┐
   │ Node.js / Express │
   │ Backend API │
   └───────────────┬──────────────────┘
   │
   ┌────────────────────┼────────────────────┐
   │ │ │
   ▼ ▼ ▼
   ┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
   │ Repository │ │ Analysis │ │ AI Orchestrator │
   │ Manager │ │ Pipeline │ │ │
   └────────┬────────┘ └────────┬─────────┘ └────────┬────────┘
   │ │ │
   │ ▼ │
   │ ┌────────────────────┐ │
   │ │ Structured │ │
   │ │ Extractors │ │
   │ │ │ │
   │ │ Files │ │
   │ │ Imports / Exports │ │
   │ │ Functions │ │
   │ │ Components │ │
   │ │ API Routes │ │
   │ │ References │ │
   │ └─────────┬──────────┘ │
   │ │ │
   │ ▼ │
   │ ┌────────────────────┐ │
   │ │ Repository Graph │◄─────────┤
   │ │ + Metadata │ │
   │ └─────────┬──────────┘ │
   │ │ │
   └────────────────────┼─────────────────────┘
   │
   ▼
   ┌─────────────────────┐
   │ Session / In-Memory │
   │ Repository State │
   └─────────────────────┘

1. Architectural Principles
   4.1 Structured Analysis Before AI
   Ripple does not rely on an LLM to discover every relationship in a repository.
   The analysis pipeline first extracts deterministic structural information such as:
   • Files
   • Directories
   • Imports
   • Exports
   • Functions
   • Classes
   • Components
   • API routes
   • References
   • Dependencies
   • Configuration relationships
   AI then operates on this structured representation.
   This reduces hallucination and gives AI agents concrete repository context.

4.2 One AI Interface
Different AI capabilities are exposed through a common AI orchestration layer.
Conceptually:
AI Orchestrator
│
├── Repository Understanding
├── Impact Analysis
├── Ask Ripple
├── What-If Analysis
└── Implementation Planning
The frontend does not communicate directly with individual AI agents.
Instead:
Frontend
↓
Backend API
↓
AI Orchestrator
↓
Selected AI capability
↓
Structured Repository Context
This keeps provider-specific and agent-specific logic isolated from the rest of the application. 5. Major Components
5.1 React Client
The frontend provides the interactive repository-understanding experience.
Responsibilities
• Repository upload
• Analysis progress
• Repository overview
• File exploration
• Dependency graph visualization
• Node/relationship inspection
• Impact analysis visualization
• Ask Ripple interface
• What-If interface
• Implementation-plan presentation
Important Boundary
The frontend is responsible for presentation and user interaction.
It does not perform authoritative repository analysis. 6. Backend API
The backend is implemented using Node.js and Express.
Responsibilities
• Request validation
• Repository/session management
• Upload handling
• Analysis orchestration
• Graph retrieval
• Impact-analysis requests
• AI requests
• What-If requests
• Security controls
• Error handling
The backend acts as the central application boundary between the frontend, analysis engine,
repository state, and AI layer. 7. Repository Manager
The Repository Manager handles the lifecycle of an uploaded repository.
Responsibilities

1. Receive repository input.
2. Validate the input.
3. Create an isolated analysis session.
4. Extract repository contents.
5. Apply security filtering.
6. Identify supported and unsupported files.
7. Pass eligible source files to the analysis pipeline.
8. Maintain repository metadata.
   Repository Input
   Ripple supports arbitrary repository inputs rather than requiring a predefined demo repository.
   The architecture therefore treats the repository as an external input rather than making
   assumptions about its structure.

9. Security and Secret Filtering
   Security filtering occurs before repository content is exposed to AI processing.
   Repository
   │
   ▼
   File Validation
   │
   ▼
   Secret / Sensitive File Filtering
   │
   ▼
   Safe Repository Representation
   │
   ▼
   Analysis + AI

Configuration and package metadata can be analyzed when useful.
However, secret values must never be exposed to the AI layer or returned through the UI.
Examples of sensitive content include:
• .env values
• API keys
• Access tokens
• Passwords
• Private credentials
• Other detected secret values
The architecture separates metadata required for understanding the project from secret
values that must remain inaccessible.

9. Analysis Pipeline
   The analysis pipeline is the core deterministic subsystem.
   Repository
   │
   ▼
   File Discovery
   │
   ▼
   Language / File Classification
   │
   ├── Supported → Structural Analysis
   │
   └── Unsupported → Metadata / Graceful Handling
   │
   ▼
   Source Parsing
   │
   ▼
   Symbol Extraction
   │
   ▼
   Relationship Extraction
   │
   ▼
   Graph Construction
   │
   ▼
   Repository Knowledge Representation

10. Language Support
    Ripple is designed to accept repositories containing different languages.
    The initial deep-analysis path focuses on:
    • JavaScript
    • TypeScript
    For unsupported languages, the system should degrade gracefully rather than failing the entire
    repository analysis.
    Possible information retained for unsupported files includes:
    • File path
    • File type
    • Directory location
    • Dependency metadata when available
    • Repository-level relationships that can be determined safely
    This allows Ripple to analyze mixed-language repositories without claiming unsupported
    semantic understanding.
11. Structural Extraction
    For JavaScript/TypeScript repositories, Ripple uses structured parsing and extraction.
    The architecture can use Tree-sitter and/or suitable language parsers for deterministic source
    analysis.
    Extracted Entities
    Repository
    ├── Directory
    ├── File
    ├── Function
    ├── Class
    ├── Component
    ├── API Route
    ├── Import
    ├── Export
    └── Reference
    Example
    Dashboard.jsx
    │
    ├── imports → UserContext
    ├── imports → dashboardService
    ├── uses → FinancialChart
    └── calls → /dashboard API
    These relationships become graph edges.
12. Repository Graph
    The repository graph is the central representation used by Ripple.
    Nodes
    Nodes may represent:
    • Files
    • Functions
    • Classes
    • Components
    • API endpoints
    • Modules
    • Other extracted repository entities
    Edges
    Edges may represent:
    • Imports
    • Exports
    • Calls
    • References
    • Component relationships
    • API relationships
    • Dependency relationships
    Example:
    [Dashboard.jsx]
    │
    ├── imports ──────► [DashboardService]
    │
    ├── renders ──────► [FinancialChart]
    │
    └── calls ────────► [GET /dashboard]
    The graph should support expansion from high-level repository structure into more detailed
    relationships.

13. Graph Strategy
    The graph is designed to be high-level by default and expandable on demand.
    Instead of presenting every extracted relationship simultaneously, the UI can begin with:
    Repository
    ↓
    Directories / Major Modules
    ↓
    Files
    ↓
    Symbols / Components
    ↓
    Detailed Dependencies
    This prevents large repositories from becoming visually unusable.
    The backend provides graph data while the frontend handles interactive visualization.
    React Flow is suitable for the graph visualization layer.

14. Impact Analysis
    Impact analysis determines which repository elements may be affected by a proposed change.
    Proposed Change
    │
    ▼
    Target Entity
    │
    ▼
    Graph Traversal
    │
    ▼
    Direct Dependencies
    │
    ▼
    Transitive Dependencies
    │
    ▼
    Potential Impact Set
    │
    ▼
    AI Explanation
    │
    ▼
    Implementation Plan
    The graph provides the structural evidence.
    AI is responsible for interpreting that evidence and explaining likely consequences.
    Ripple should distinguish between:
    • Directly affected elements
    • Indirectly affected elements
    • Related but uncertain elements
    The system should avoid presenting inferred impact as guaranteed impact.

15. Ask Ripple
    Ask Ripple provides repository-aware conversational interaction.
    User Question
    │
    ▼
    Backend API
    │
    ▼
    Query Understanding
    │
    ▼
    Relevant Repository Context
    │
    ├── Graph
    ├── File metadata
    ├── Extracted symbols
    └── Relevant source context
    │
    ▼
    AI Orchestrator
    │
    ▼
    Answer
    The entire repository should not automatically be sent to the model for every question.
    Instead, Ripple should retrieve relevant structured context based on the question.
    This keeps the AI interaction focused and reduces unnecessary token usage.

16. What-If Analysis
    What-If allows the user to describe a proposed architectural or code change without actually
    applying it.
    Example:
    User:
    "What if authentication is moved from middleware
    into a service layer?"
    Processing:
    What-If Request
    │
    ▼
    Identify Relevant Entities
    │
    ▼
    Traverse Repository Graph
    │
    ▼
    Identify Potentially Affected Areas
    │
    ▼
    AI Reasoning
    │
    ▼
    Impact Explanation
    │
    ▼
    Implementation Plan
    The result is advisory.
    Ripple does not automatically modify the repository.

17. AI Orchestration Layer
    The AI Orchestrator provides a common interface between application logic and AI capabilities.
    Conceptual interface:
    analyzeRepositoryContext()
    analyzeImpact()
    answerRepositoryQuestion()
    analyzeWhatIf()
    generateImplementationPlan()
    Each capability receives structured repository context instead of unrestricted repository
    access.
    AI Context
    AI context may contain:
    Repository Metadata

- Relevant Files
- Extracted Symbols
- Graph Relationships
- User Question / Proposed Change
  The AI layer should return structured results wherever possible so that the backend can validate
  and present them consistently.

18. AI Responsibility Boundary
    Deterministic Systems
    Responsible for:
    • File discovery
    • Parsing
    • Symbol extraction
    • Import/export detection
    • Graph construction
    • Direct relationship discovery
    • Repository metadata
    AI
    Responsible for:
    • Explaining architecture
    • Synthesizing repository context
    • Reasoning about potential impact
    • Answering natural-language questions
    • Explaining What-If scenarios
    • Generating implementation plans
    AI Must Not
    • Invent repository relationships as established facts.
    • Expose detected secrets.
    • Automatically modify repository code.
    • Replace deterministic structural analysis where deterministic analysis is available.
19. Data Architecture
    For the hackathon MVP, repository analysis state can be maintained using in-memory/session
    storage.
    Conceptually:
    Analysis Session
    ├── sessionId
    ├── repository metadata
    ├── file metadata
    ├── extracted entities
    ├── graph
    ├── analysis status
    └── AI-relevant context
    This keeps the implementation simple and suitable for the hackathon scope.
    A persistent database is not required for the core MVP unless later implementation
    requirements make it necessary.
20. Session Lifecycle
    Created
    │
    ▼
    Uploading
    │
    ▼
    Extracting
    │
    ▼
    Analyzing
    │
    ▼
    Graph Ready
    │
    ├──────────────► Ask Ripple
    │
    ├──────────────► Impact Analysis
    │
    └──────────────► What-If
    A session represents one analyzed repository context.
21. API Boundary
    The frontend communicates only with the backend API.
    React
    │
    │ HTTP
    ▼
    Express API
    │
    ├── Repository APIs
    ├── Analysis APIs
    ├── Graph APIs
    ├── Impact APIs
    ├── Ask Ripple APIs
    └── What-If APIs
    Detailed request/response contracts are intentionally defined separately in API_CONTRACT.md.
22. Error Handling
    The architecture treats failures at each stage independently.
    Repository Errors
    Examples:
    • Invalid archive
    • Empty repository
    • Unsupported input
    • Corrupted files
    Analysis Errors
    Examples:
    • Parser failure
    • Unsupported syntax
    • Unsupported language
    • Partial extraction
    AI Errors
    Examples:
    • Model unavailable
    • Invalid AI response
    • Timeout
    • Context limitations
    A failure to deeply analyze one file should not unnecessarily invalidate the entire repository
    analysis.
    Where possible, Ripple should return partial analysis with an indication of reduced coverage.
23. Partial Analysis Model
    Ripple should distinguish between:
    FULL ANALYSIS
    and
    PARTIAL ANALYSIS
    Partial analysis can occur when:
    • Some languages are unsupported.
    • Individual files cannot be parsed.
    • Certain relationships cannot be determined.
    • AI analysis is unavailable for a specific operation.
    The system should preserve successfully extracted information instead of discarding the entire
    analysis.

24. Deployment Architecture
    The MVP deployment can use a simple three-part structure:
    ┌─────────────────┐
    │ React Frontend │
    └────────┬────────┘
    │
    ▼
    ┌─────────────────┐
    │ Node / Express │
    │ Backend │
    └───────┬─────────┘
    │
    ┌──────────┴──────────┐
    ▼ ▼
    ┌─────────────────┐ ┌─────────────────┐
    │ Analysis Engine │ │ AI Provider │
    │ │ │ │
    │ Parser / Graph │ │ LLM / AI Agents │
    └─────────────────┘ └─────────────────┘
    The architecture intentionally avoids unnecessary microservices for the MVP.
    The analysis engine and AI orchestration layer can remain modules within the backend
    application.

25. Request Flow — Repository Analysis
    User
    │
    │ Upload Repository
    ▼
    React
    │
    ▼
    POST Repository API
    │
    ▼
    Express
    │
    ▼
    Repository Manager
    │
    ├── Validate
    ├── Extract
    └── Secure
    │
    ▼
    Analysis Pipeline
    │
    ├── Classify files
    ├── Parse supported files
    ├── Extract symbols
    └── Extract relationships
    │
    ▼
    Graph Builder
    │
    ▼
    Session State
    │
    ▼
    Frontend
    │
    ▼
    Repository Explorer

26. Request Flow — Ask Ripple
    User Question
    │
    ▼
    React
    │
    ▼
    Ask Ripple API
    │
    ▼
    Backend
    │
    ▼
    Relevant Context Retrieval
    │
    ├── Graph
    ├── Symbols
    ├── Files
    └── Relationships
    │
    ▼
    AI Orchestrator
    │
    ▼
    LLM
    │
    ▼
    Structured Answer
    │
    ▼
    Backend
    │
    ▼
    React

27. Request Flow — What-If
    Proposed Change
    │
    ▼
    What-If API
    │
    ▼
    Target / Relevant Entities
    │
    ▼
    Graph Traversal
    │
    ▼
    Potential Impact Set
    │
    ▼
    AI Analysis
    │
    ▼
    Impact Explanation
    │
    ▼
    Implementation Plan
    No repository modification occurs in this flow.
28. Technology Responsibilities
    Layer
    Frontend
    Graph UI
    Backend
    Parsing
    Responsibility
    UI and visualization
    Interactive graph
    API and orchestration
    Technology
    React
    React Flow
    Node.js + Express
    Structural source analysis Tree-sitter / language parsers
    Repository State MVP session state
    AI Layer
    In-memory storage
    Reasoning and synthesis LLM through AI provider
    Graph Model
    Repository relationships Application-level graph structure
    Technology choices should remain replaceable behind application interfaces where practical.
29. Architectural Trade-offs
    In-Memory State vs Persistent Database
    Chosen: In-memory/session state for MVP.
    Reason:
    • Faster implementation.
    • Lower infrastructure complexity.
    • Suitable for temporary repository analysis sessions.
    • Aligns with hackathon scope.
    Trade-off:
    • Repository sessions are not designed as permanent historical records.
    Monolithic Backend vs Microservices
    Chosen: Modular monolithic Node.js backend.
    Reason:
    • Simpler deployment.
    • Easier debugging during the hackathon.
    • Lower network and infrastructure overhead.
    • Clear module boundaries can still be maintained.
    AI-First vs Structured-First Analysis
    Chosen: Structured-first.
    Reason:
    • Deterministic relationships are more reliable when extracted directly.
    • Reduces unnecessary LLM usage.
    • Provides graph data for visualization.
    • Gives AI concrete evidence for reasoning.
    Automatic Code Modification vs Implementation Plans
    Chosen: Implementation plans only.
    Reason:
    • Keeps the system safer.
    • Keeps user control over repository changes.
    • Reduces risk of unintended modifications.
    • Fits the product's architecture-understanding objective.
30. Extensibility
    The architecture allows future capabilities without changing the fundamental repository
    analysis pipeline.
    Potential future extensions include:
    • Additional programming-language analyzers.
    • Persistent repository history.
    • More advanced semantic indexing.
    • Pull-request analysis.
    • Git history analysis.
    • Deeper test coverage relationships.
    • More sophisticated architectural pattern detection.
    • Code-generation workflows with explicit user approval.
    These are outside the current MVP architecture.
31. Architecture Summary
    Ripple follows a simple principle:
    STRUCTURE FIRST
    ↓
    BUILD REPOSITORY GRAPH
    ↓
    RETRIEVE RELEVANT CONTEXT
    ↓
    AI REASONING
    ↓
    EXPLAIN / ANALYZE / PLAN
    The key architectural boundary is:
    Deterministic analysis establishes what exists; AI reasons about what it means and what
    could change.
    This allows Ripple to provide repository-aware intelligence while maintaining predictable
    structural analysis, protecting secrets, supporting arbitrary repositories, and keeping users in
    control of actual code changes.

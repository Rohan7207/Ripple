ACCEPTANCE_TESTS.md

1. Purpose
   This document defines the acceptance tests for Ripple.
   The purpose is to verify that the implemented MVP satisfies the requirements defined in:
   • PRD.md
   • ARCHITECTURE.md
   • API_CONTRACT.md
   • AI_SPEC.md
   • UI_SPEC.md
   • TASKS.md
   Acceptance testing focuses on observable behavior of the complete system.
   A feature passes only when it works through the intended user flow and does not introduce a
   blocking regression elsewhere.
2. Acceptance Criteria
   Each test has:
   • ID
   • Area
   • Scenario
   • Steps
   • Expected Result
   • Priority
   Priority:
   • P0 — Must pass for MVP
   • P1 — Important for a complete experience
   • P2 — Optional if time remains
3. Repository Input
   AT-001 — Upload Valid ZIP
   Priority: P0
   Scenario: User uploads a valid repository ZIP.
   Steps:
4. Open Ripple.
5. Select a valid ZIP repository.
6. Start analysis.
   Expected Result:
   • Upload is accepted.
   • Repository session is created.
   • Analysis begins.
   • User is taken to the processing state.
   AT-002 — Submit Public GitHub Repository
   Priority: P0
   Scenario: User provides a supported public GitHub repository URL.
   Steps:
7. Open Ripple.
8. Enter a valid public GitHub repository URL.
9. Start analysis.
   Expected Result:
   • Repository is retrieved.
   • Repository session is created.
   • Analysis begins.
   AT-003 — Invalid Repository Input
   Priority: P0
   Scenario: User provides invalid repository input.
   Expected Result:
   • Ripple does not crash.
   • A clear error is shown.
   • User can correct the input and retry.
   AT-004 — Empty or Unusable Repository
   Priority: P1
   Scenario: Repository contains no analyzable source files.
   Expected Result:
   • Analysis completes or fails gracefully.
   • User receives a meaningful explanation.
   • Ripple does not present fabricated analysis.
10. Repository Analysis
    AT-005 — Analysis Status
    Priority: P0
    Scenario: Repository analysis is running.
    Expected Result:
    The UI clearly communicates that analysis is in progress.
    The system exposes an appropriate processing state through:
    GET /api/repositories/:repositoryId/status
    AT-006 — Successful Analysis
    Priority: P0
    Scenario: A supported JavaScript/TypeScript repository is analyzed.
    Expected Result:
    Ripple produces:
    • Repository metadata
    • File structure
    • Detectable symbols
    • Relationships
    • Graph data
    • Analysis status
    AT-007 — JavaScript/TypeScript Analysis
    Priority: P0
    Scenario: Repository contains JavaScript/TypeScript code.
    Expected Result:
    Ripple can detect relevant structural information such as:
    • Files
    • Functions
    • Classes
    • Components where detectable
    • Imports
    • Exports
    • Dependencies
    • Other supported relationships
    AT-008 — Unsupported Language
    Priority: P1
    Scenario: Repository contains unsupported programming languages.
    Expected Result:
    • Ripple does not crash.
    • Unsupported content is handled gracefully.
    • Analysis coverage/limitations are communicated.
    • AI does not pretend unsupported code was analyzed.
    AT-009 — Partial Analysis
    Priority: P1
    Scenario: Some repository files cannot be analyzed.
    Expected Result:
    • Successfully analyzed information remains available.
    • Limitations are communicated.
    • AI can distinguish analyzed evidence from unavailable information.
11. Repository Workspace
    AT-010 — Workspace Opens
    Priority: P0
    Scenario: Repository analysis becomes ready.
    Expected Result:
    User can access the Repository Workspace.
    The workspace provides access to:
    • Overview
    • Files
    • Architecture
    • Impact
    • What-If
    • Ask Ripple
    AT-011 — Repository Overview
    Priority: P1
    Expected Result:
    Overview communicates useful repository information such as:
    • Repository identity
    • Structure
    • Analysis information
    • Important architectural observations
    • Available analysis capabilities
    No unrelated dashboard functionality is required.
12. File Explorer
    AT-012 — File Listing
    Priority: P0
    Scenario: User opens Files.
    Expected Result:
    Ripple displays the analyzed repository file structure.
    AT-013 — Open File
    Priority: P1
    Scenario: User selects a file.
    Expected Result:
    Ripple displays the available source content and relevant structural information.
    AT-014 — File Not Available
    Priority: P1
    Scenario: Requested file cannot be retrieved.
    Expected Result:
    A clear error or unavailable state is displayed without crashing the application.
13. Architecture Graph
    AT-015 — Graph Loads
    Priority: P0
    Scenario: User opens Architecture.
    Expected Result:
    Ripple displays the repository graph using analyzed repository data.
    AT-016 — Graph Nodes
    Priority: P0
    Expected Result:
    Graph can represent relevant repository entities such as:
    • Files
    • Directories/modules
    • Functions
    • Classes
    • Components
    • API endpoints where detectable
    Only available entities should be shown.
    AT-017 — Graph Relationships
    Priority: P0
    Expected Result:
    Graph can represent analyzed relationships such as:
    • Imports
    • Exports
    • Calls
    • References
    • Renders
    • Dependencies
    Relationships must come from deterministic analysis rather than fabricated AI output.
    AT-018 — Graph Interaction
    Priority: P1
    Steps:
14. Open graph.
15. Zoom.
16. Pan.
17. Select a node.
18. Inspect its details.
    Expected Result:
    Graph remains usable and selected-node information is displayed.
    AT-019 — Graph Filtering
    Priority: P1
    Expected Result:
    User can reduce graph complexity through available filters or views.
    Filtering must not change the underlying repository facts.
19. Ask Ripple
    AT-020 — Ask Repository Question
    Priority: P0
    Scenario: User asks a question about the repository.
    Steps:
20. Open Ask Ripple.
21. Enter a repository-related question.
22. Submit.
    Expected Result:
    Ripple returns a structured answer based on relevant repository context.
    AT-021 — Ask Ripple Sources
    Priority: P0
    Expected Result:
    Response provides relevant evidence/sources where available, such as:
    • File path
    • Symbol
    • Relationship
    • Source location
    Sources should allow the user to understand where the answer came from.
    AT-022 — Insufficient Evidence
    Priority: P0
    Scenario: Repository does not contain enough evidence to answer confidently.
    Expected Result:
    Ripple communicates uncertainty or insufficient evidence instead of inventing an answer.
    AT-023 — AI Failure
    Priority: P0
    Scenario: AI provider fails or times out.
    Expected Result:
    • User receives a clear error.
    • Application remains usable.
    • No broken or fabricated AI response is displayed.
23. Impact Analysis
    AT-024 — Analyze Impact
    Priority: P0
    Scenario: User selects or identifies a repository target and requests impact analysis.
    Expected Result:
    Ripple identifies relevant affected areas using repository relationships.
    AT-025 — Direct and Indirect Impact
    Priority: P0
    Expected Result:
    Impact response distinguishes, where supported:
    • Direct impact
    • Indirect impact
    • Related areas
    AT-026 — Impact Evidence
    Priority: P0
    Expected Result:
    Impact reasoning is connected to repository evidence and relationships.
    The AI must not invent dependencies that are absent from the analyzed repository.
24. What-If Analysis
    AT-027 — Submit What-If Scenario
    Priority: P0
    Scenario: User describes a hypothetical change.
    Expected Result:
    Ripple analyzes the scenario against the repository structure.
    AT-028 — Affected Areas
    Priority: P0
    Expected Result:
    Response identifies relevant areas that could be affected by the hypothetical change.
    AT-029 — What-If Implementation Plan
    Priority: P0
    Expected Result:
    Response provides a structured implementation plan containing relevant considerations and
    affected areas.
    The plan is informational only.
    AT-030 — Hypothetical State
    Priority: P0
    Expected Result:
    UI clearly communicates that What-If results describe a hypothetical scenario.
    Ripple must not imply that the repository was actually modified.
25. AI Safety and Grounding
    AT-031 — No Fabricated Repository Facts
    Priority: P0
    Scenario: Ask Ripple is asked about something that does not exist.
    Expected Result:
    Ripple states that the evidence is unavailable or insufficient.
    It must not invent:
    • Files
    • Functions
    • Classes
    • APIs
    • Dependencies
    • Relationships
    • Configuration
    • Architecture
    AT-032 — Evidence vs Inference
    Priority: P1
    Expected Result:
    The UI can distinguish between:
    • Observed repository evidence
    • AI interpretation/inference
    • Unknown or insufficient evidence
    AT-033 — AI Context Limitation
    Priority: P0
    Expected Result:
    AI requests use relevant repository context rather than blindly sending the entire repository.
26. Security
    AT-034 — Sensitive File Protection
    Priority: P0
    Scenario: Repository contains common sensitive files or credentials.
    Expected Result:
    Sensitive information is excluded or sanitized before entering AI context.
    AT-035 — Secret Not Displayed
    Priority: P0
    Scenario: Repository contains a secret-like value.
    Expected Result:
    The secret is not unnecessarily exposed through:
    • AI response
    • UI
    • Logs
    • Repository source display where protection is required
27. API Contract
    AT-036 — Success Response Format
    Priority: P0
    Successful API responses follow:
    {
    }
    "success": true,
    "data": {}
    AT-037 — Error Response Format
    Priority: P0
    Errors follow:
    {
    }
    "success": false,
    "error": {
    "code": "...",
    "message": "..."
    }
    AT-038 — Repository API Availability
    Priority: P0
    Verify:
    • GET /api/health
    • POST /api/repositories
    • GET /api/repositories/:repositoryId
    • GET /api/repositories/:repositoryId/status
    AT-039 — File and Graph APIs
    Priority: P0
    Verify:
    • GET /api/repositories/:repositoryId/files
    • GET /api/repositories/:repositoryId/files/:fileId
    • GET /api/repositories/:repositoryId/graph
    AT-040 — AI APIs
    Priority: P0
    Verify:
    • POST /api/repositories/:repositoryId/ask
    • POST /api/repositories/:repositoryId/impact
    • POST /api/repositories/:repositoryId/what-if
28. UI States
    AT-041 — Loading States
    Priority: P1
    Verify appropriate loading states exist for:
    • Repository upload
    • Analysis
    • Graph loading
    • File loading
    • AI requests
    AT-042 — Error States
    Priority: P0
    Verify that failures display useful user-facing messages rather than blank screens or crashes.
    AT-043 — Empty States
    Priority: P1
    Verify meaningful empty states exist where repository information is unavailable.
    AT-044 — Responsive Layout
    Priority: P1
    Verify the primary workflow remains usable on supported smaller screen sizes.
29. End-to-End Acceptance
    AT-045 — Complete MVP Flow
    Priority: P0
    Scenario: A user uses Ripple from start to finish.
    Steps:
30. Open Ripple.
31. Provide a real repository.
32. Start analysis.
33. Wait for analysis completion.
34. Open workspace.
35. View overview.
36. Explore files.
37. Open architecture graph.
38. Inspect graph relationships.
39. Ask Ripple a repository question.
40. View evidence.
41. Run Impact Analysis.
42. Run What-If Analysis.
43. Review implementation plan.
    Expected Result:
    The complete flow works without a blocking error.
44. Production Acceptance
    AT-046 — Production Application Loads
    Priority: P0
    Expected Result:
    Deployed frontend loads successfully.
    AT-047 — Production Backend
    Priority: P0
    Expected Result:
    Production backend responds successfully to health and required API requests.
    AT-048 — Production End-to-End Flow
    Priority: P0
    Run:
    Production
    ↓
    Repository Input
    ↓
    Analysis
    ↓
    Workspace
    ↓
    Graph
    ↓
    Ask Ripple
    ↓
    Impact
    ↓
    What-If
    Expected Result:
    The complete core MVP works in production.
45. Demo Acceptance
    AT-049 — Demo Repository
    Priority: P0
    A known, reliable repository is selected before the final demo.
    The team verifies that:
    • Analysis succeeds.
    • Graph renders.
    • Ask Ripple works.
    • Impact works.
    • What-If works.
    AT-050 — Demo Questions
    Priority: P0
    Prepare tested questions for:
    • Repository understanding
    • Architecture
    • Dependency/relationship understanding
    • Impact analysis
    Questions must be verified against the selected demo repository.
    AT-051 — Demo Failure Fallback
    Priority: P1
    The team has a fallback for:
    • AI failure
    • Network failure
    • Repository analysis failure
    • Deployment failure
    The fallback should demonstrate the product without pretending that a failed live operation
    succeeded.
46. Final MVP Checklist
    Before final submission, all P0 tests must pass.
    Repository
    • ZIP repository works
    • GitHub repository input works
    • Invalid input handled
    • Repository analysis works
    • JS/TS analysis works
    • Partial/unsupported analysis handled
    Workspace
    • Overview works
    • Files work
    • Source view works
    • Architecture graph works
    AI
    • Ask Ripple works
    • Evidence is shown
    • Insufficient evidence is handled
    • Impact Analysis works
    • What-If works
    • Implementation plan is generated
    • AI does not fabricate repository facts
    Security
    • Sensitive information is protected
    • Secrets are not exposed to AI/UI unnecessarily
    Integration
    • Frontend communicates with backend
    • Backend communicates with analysis engine
    • AI receives structured repository context
    • Structured responses render correctly
    Deployment
    • Frontend deployed
    • Backend deployed
    • Environment variables configured
    • Production API works
    • Production end-to-end flow works
    Demo
    • Demo repository verified
    • Demo questions verified
    • Demo scenario verified
    • Full rehearsal completed
    • Fallback prepared
47. Final Acceptance Condition
    Ripple is considered MVP-ready when:
    A user can provide a real repository, Ripple can analyze its structure, visualize its architecture,
    answer repository questions using evidence, explain potential impact of changes, reason about
    hypothetical changes, and provide an implementation plan — all through a deployed, stable
    end-to-end experience.
    The system should prioritize correctness, evidence, reliability, and demonstrability over
    feature count.

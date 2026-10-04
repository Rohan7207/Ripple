TASKS.md

1. Purpose
   This document converts the Ripple product and technical specifications into an executable
   implementation plan for the hackathon.
   It defines:
   • Implementation tasks
   • Dependencies
   • Work areas
   • Estimated effort
   • Team ownership
   • Milestones
   • 30-hour execution schedule
   • Definition of done
   • Final deployment and demo preparation
   This document does not redefine product requirements or architecture. Those decisions are
   defined in:
   • PRD.md
   • ARCHITECTURE.md
   • API_CONTRACT.md
   • AI_SPEC.md
   • UI_SPEC.md
2. Execution Principles
   2.1 MVP First
   The team must prioritize the complete core flow over secondary features.
   Core flow:
   Repository Input
   ↓
   Repository Ingestion
   ↓
   Deterministic Analysis
   ↓
   Repository Graph
   ↓
   Repository Workspace
   ↓
   Ask Ripple
   ↓
   Impact Analysis
   ↓
   What-If Analysis
   ↓
   Deployment
   ↓
   Demo
   2.2 No Major Feature Expansion
   During implementation, do not introduce:
   • Authentication
   • User profiles
   • Billing
   • Team management
   • Persistent database unless required
   • Automatic code modification
   • PR generation
   • Commit creation
   • Complex settings
   • Non-MVP analytics
   2.3 Definition of Done
   A feature is considered done when:
3. Its core implementation works.
4. It integrates with the required dependent components.
5. The happy path has been tested.
6. Critical errors are handled.
7. It does not block the end-to-end demo flow.
8. Team Ownership
   Ownership should be assigned between the three team members before implementation
   begins.
   Workstream
   Owner
   Backend / Repository Ingestion / APIs Member 1
   Analysis Engine / AI
   Frontend / UI / Integration
   Member 2
   Member 3
   Ownership can be adjusted by the team, but every task must have one primary owner.
9. Phase 1 — Project Setup
   T01 — Repository and Branch Setup
   Owner: Team
   Estimate: 30 min
   Depends on: None
   Tasks:
   • Confirm repository structure.
   • Create/confirm development branches.
   • Confirm Node.js environment.
   • Confirm frontend setup.
   • Confirm backend setup.
   • Add required environment variable templates.
   • Confirm local frontend/backend communication.
   Done when:
   • All members can run the project locally.
   • Frontend and backend start successfully.
   • Basic health endpoint responds.
   T02 — Backend Foundation
   Owner: Member 1
   Estimate: 1 hr
   Depends on: T01
   Tasks:
   • Express application setup.
   • API routing structure.
   • Error handling.
   • Repository session/state structure.
   • GET /api/health.
   Done when:
   • Backend starts successfully.
   • Health endpoint works.
   • Repository-related routes can be added cleanly.
   T03 — Frontend Foundation
   Owner: Member 3
   Estimate: 1 hr
   Depends on: T01
   Tasks:
   • Application shell.
   • Routing.
   • Dark-first Ripple UI.
   • Workspace layout.
   • Shared UI components.
   Done when:
   • Landing page renders.
   • Workspace shell renders.
   • Navigation between major sections works.
10. Phase 2 — Repository Ingestion
    T04 — ZIP Repository Upload
    Owner: Member 1
    Estimate: 1.5 hr
    Depends on: T02
    Tasks:
    • Multipart ZIP upload.
    • Temporary extraction.
    • Repository validation.
    • Repository metadata creation.
    • Basic file discovery.
    Done when:
    • A ZIP repository can be uploaded.
    • Files can be discovered.
    • Invalid uploads return useful errors.
    T05 — GitHub Repository Input
    Owner: Member 1
    Estimate: 1 hr
    Depends on: T02
    Tasks:
    • Accept GitHub repository URL.
    • Retrieve/clone repository.
    • Validate repository.
    • Create repository analysis session.
    Done when:
    • A public GitHub repository can enter the Ripple pipeline.
    T06 — Repository Security Filtering
    Owner: Member 1 + Member 2
    Estimate: 1 hr
    Depends on: T04
    Tasks:
    • Identify sensitive files.
    • Exclude secrets from AI context.
    • Ignore unnecessary generated/dependency directories.
    • Prevent sensitive content from appearing in UI responses.
    Done when:
    • Common secret/config files are excluded or sanitized.
    • AI context does not contain detected secrets.
11. Phase 3 — Deterministic Analysis Engine
    T07 — File and Directory Analysis
    Owner: Member 2
    Estimate: 2 hr
    Depends on: T04
    Tasks:
    • Build repository file tree.
    • Identify supported source files.
    • Detect JavaScript/TypeScript files.
    • Record file metadata.
    • Handle unsupported files gracefully.
    Done when:
    • Ripple has a usable repository file structure.
    T08 — Symbol Extraction
    Owner: Member 2
    Estimate: 2 hr
    Depends on: T07
    Tasks:
    • Extract functions.
    • Extract classes.
    • Extract components where detectable.
    • Extract exports/imports.
    • Record source locations.
    Done when:
    • Repository symbols can be represented as structured analysis data.
    T09 — Relationship / Dependency Extraction
    Owner: Member 2
    Estimate: 2 hr
    Depends on: T08
    Tasks:
    • Import relationships.
    • Export relationships.
    • Module dependencies.
    • Detect available call/reference/render relationships where practical.
    Done when:
    • Relationships can be represented as graph edges.
    T10 — Repository Graph Construction
    Owner: Member 2
    Estimate: 1.5 hr
    Depends on: T09
    Tasks:
    • Create graph nodes.
    • Create graph edges.
    • Associate nodes with files/symbols.
    • Support high-level graph representation.
    Done when:
    • Ripple can return a repository graph.
    T11 — Analysis Status and Partial Analysis
    Owner: Member 1 + Member 2
    Estimate: 1 hr
    Depends on: T07
    Tasks:
    • Processing status.
    • Analysis progress.
    • Ready state.
    • Failed state.
    • Partial-analysis warnings.
    Done when:
    • Frontend can determine whether analysis is processing, ready, failed, or partial.
12. Phase 4 — Backend API Integration
    T12 — Repository APIs
    Owner: Member 1
    Estimate: 1.5 hr
    Depends on: T04, T11
    Implement:
    • POST /api/repositories
    • GET /api/repositories/:repositoryId
    • GET /api/repositories/:repositoryId/status
    T13 — File APIs
    Owner: Member 1
    Estimate: 1 hr
    Depends on: T07
    Implement:
    • GET /api/repositories/:repositoryId/files
    • GET /api/repositories/:repositoryId/files/:fileId
    T14 — Graph API
    Owner: Member 1
    Estimate: 45 min
    Depends on: T10
    Implement:
    • GET /api/repositories/:repositoryId/graph
13. Phase 5 — AI Layer
    T15 — AI Provider Integration
    Owner: Member 2
    Estimate: 1 hr
    Depends on: T02
    Tasks:
    • Provider abstraction.
    • Model configuration.
    • Environment variable configuration.
    • Basic request/response handling.
    • Error handling.
    Done when:
    • Ripple can send structured context to an LLM and receive a structured response.
    T16 — Context Retrieval
    Owner: Member 2
    Estimate: 1.5 hr
    Depends on: T08, T09, T10
    Tasks:
    • Select relevant files.
    • Select relevant symbols.
    • Select relevant graph relationships.
    • Select relevant source snippets.
    • Prevent unnecessary full-repository prompting.
    Done when:
    • AI receives focused repository context.
    T17 — Ask Ripple
    Owner: Member 2
    Estimate: 1 hr
    Depends on: T15, T16
    Implement:
    • POST /api/repositories/:repositoryId/ask
    Response should include:
    • Answer
    • Evidence/sources
    • Confidence
    • Relevant repository context
    T18 — Impact Analysis
    Owner: Member 2
    Estimate: 1 hr
    Depends on: T10, T16
    Implement:
    • POST /api/repositories/:repositoryId/impact
    Flow:
    Target
    ↓
    Graph Traversal
    ↓
    Affected Areas
    ↓
    Relevant Context
    ↓
    AI Explanation
    T19 — What-If Analysis
    Owner: Member 2
    Estimate: 1 hr
    Depends on: T18
    Implement:
    • POST /api/repositories/:repositoryId/what-if
    Response should include:
    • Scenario
    • Affected areas
    • Dependencies
    • Considerations
    • Implementation plan
    • Confidence
    • Evidence
14. Phase 6 — Frontend Implementation
    T20 — Repository Input UI
    Owner: Member 3
    Estimate: 1 hr
    Depends on: T03, T12
    Implement:
    • ZIP upload.
    • GitHub URL input.
    • Validation.
    • Upload state.
    • Error state.
    T21 — Analysis Processing UI
    Owner: Member 3
    Estimate: 1 hr
    Depends on: T11, T12
    Implement:
    • Analysis progress.
    • Current processing state.
    • Completion state.
    • Failure state.
    • Partial analysis warning.
    T22 — Repository Workspace
    Owner: Member 3
    Estimate: 1.5 hr
    Depends on: T12, T13, T14
    Implement:
    • Workspace shell.
    • Overview.
    • Files.
    • Architecture navigation.
    • Ask Ripple access.
    • Impact access.
    • What-If access.
    T23 — Architecture Graph UI
    Owner: Member 3
    Estimate: 1.5 hr
    Depends on: T14
    Implement:
    • React Flow graph.
    • Node types.
    • Edge types.
    • Zoom/pan.
    • Node selection.
    • Detail panel.
    • Basic filtering.
    Priority: High
    The graph is one of Ripple's primary visual features.
    T24 — File Explorer and Source View
    Owner: Member 3
    Estimate: 1 hr
    Depends on: T13
    Implement:
    • File tree.
    • File selection.
    • Source display.
    • Symbol information.
    T25 — Ask Ripple UI
    Owner: Member 3
    Estimate: 1 hr
    Depends on: T17
    Implement:
    • Question input.
    • AI response.
    • Sources.
    • Evidence.
    • Confidence.
    • Loading/error states.
    T26 — Impact UI
    Owner: Member 3
    Estimate: 1 hr
    Depends on: T18
    Implement:
    • Direct impact.
    • Indirect impact.
    • Related areas.
    • Confidence.
    • Evidence.
    T27 — What-If UI
    Owner: Member 3
    Estimate: 1 hr
    Depends on: T19
    Implement:
    • Scenario input.
    • Affected areas.
    • Dependencies.
    • Considerations.
    • Implementation plan.
    • Hypothetical-state indication.
15. Phase 7 — Full Integration
    T28 — End-to-End Repository Flow
    Owner: Entire Team
    Estimate: 1 hr
    Depends on: T20–T27
    Test:
    Upload ZIP
    ↓
    Analysis
    ↓
    Workspace
    ↓
    Graph
    ↓
    Files
    ↓
    Ask Ripple
    ↓
    Impact
    ↓
    What-If
    Done when:
    • A real repository can complete the full flow.
    T29 — Real Repository Validation
    Owner: Entire Team
    Estimate: 1 hr
    Depends on: T28
    Test with:
    • Small repository.
    • Medium repository.
    • JavaScript/TypeScript repository.
    • Repository containing unsupported files.
    Verify:
    • Analysis.
    • Graph.
    • AI context.
    • Responses.
    • Errors.
16. Phase 8 — Testing and Error Fixing
    T30 — Critical Error Pass
    Owner: Entire Team
    Estimate: 2 hr
    Check:
    • Upload failures.
    • Invalid repositories.
    • Analysis failures.
    • Empty repositories.
    • Unsupported files.
    • AI failures.
    • API failures.
    • Broken graph relationships.
    • Frontend crashes.
    • Missing data.
    • Loading states.
    Priority:
    Blocking errors
    → Core feature errors
    → AI errors
    → UI errors
    → Minor polish
    T31 — AI Quality Pass
    Owner: Member 2
    Estimate: 1 hr
    Verify:
    • AI does not invent repository facts.
    • Sources are relevant.
    • Unsupported information is acknowledged.
    • Responses use repository evidence.
    • Impact reasoning is tied to graph evidence.
    • What-If remains hypothetical.
    T32 — UI Polish Pass
    Owner: Member 3
    Estimate: 1 hr
    Focus on:
    • Visual consistency.
    • Spacing.
    • Typography.
    • Loading states.
    • Empty states.
    • Error states.
    • Graph readability.
    • Responsive behavior.
    No major redesign during this phase.
17. Phase 9 — Deployment
    T33 — Production Deployment
    Owner: Member 1 + Member 3
    Estimate: 1 hr
    Tasks:
    • Deploy frontend.
    • Deploy backend.
    • Configure environment variables.
    • Configure API URL.
    • Configure CORS.
    • Verify AI provider configuration.
    Done when:
    • Production application loads successfully.
    T34 — Production Smoke Test
    Owner: Entire Team
    Estimate: 45 min
    Verify on deployed application:
    Upload
    → Analyze
    → Workspace
    → Graph
    → Ask
    → Impact
    → What-If
    No feature should be considered demo-ready until this works in production.
18. Phase 10 — Demo Preparation
    T35 — Demo Repository Preparation
    Owner: Team
    Estimate: 30 min
    Select one reliable repository for demonstration.
    Prepare:
    • Repository input.
    • Expected analysis.
    • Graph.
    • Example Ask Ripple questions.
    • Example Impact query.
    • Example What-If scenario.
    T36 — Demo Script
    Owner: Team
    Estimate: 30 min
    Recommended flow:
    Problem
    ↓
    Upload Repository
    ↓
    Ripple Understands Repository
    ↓
    Architecture Graph
    ↓
    Ask Ripple
    ↓
    Impact Analysis
    ↓
    What-If
    ↓
    Implementation Plan
    ↓
    Value / Closing
    Keep the demo focused on the core product.
    T37 — Full Demo Rehearsal
    Owner: Entire Team
    Estimate: 30 min
    Perform the complete demonstration using the deployed system.
    Prepare a fallback for:
    • AI failure
    • Deployment failure
    • Repository analysis failure
    • Network issues
19. 30-Hour Hackathon Schedule
    Day 1
    10:00 AM – 10:30 AM
    Team Setup
    • Environment verification
    • Branches
    • Task assignment
    • Final architecture review
    • Start implementation
    10:30 AM – 1:00 PM
    Repository Ingestion + Backend Foundation
    Target:
    • ZIP upload
    • GitHub input
    • Repository session
    • File discovery
    1:00 PM – 3:30 PM
    Deterministic Analysis
    Target:
    • File tree
    • JS/TS parsing
    • Symbols
    • Imports/exports
    • Dependencies
    3:30 PM – 4:00 PM
    Break
    4:00 PM – 6:30 PM
    Graph + Analysis APIs
    Target:
    • Graph construction
    • Graph API
    • Repository APIs
    • File APIs
    6:30 PM – 8:30 PM
    Frontend Workspace
    Target:
    • Repository workspace
    • Overview
    • Files
    • Architecture graph
    8:30 PM – 9:00 PM
    Dinner / Break
    9:00 PM – 11:00 PM
    AI Layer
    Target:
    • AI provider
    • Context retrieval
    • Structured AI responses
    • Ask Ripple
    11:00 PM – 12:30 AM
    Impact + What-If
    Target:
    • Impact analysis
    • What-If analysis
    • Frontend integration
    12:30 AM – 1:00 AM
    CORE MVP CHECKPOINT
    The following must work:
    Repository
    → Analysis
    → Graph
    → Ask Ripple
    → Impact
    → What-If
    No new major features after this checkpoint.
20. Rest Period
    1:00 AM – 5:30 AM
    Sleep / recovery
    Do not schedule major development during this period.
    The objective is to resume with enough energy for the final testing and demo phase.
21. Day 2 — Finalization
    5:30 AM – 7:30 AM
    Full-System Testing
    • Test complete flow.
    • Test real repository.
    • Identify failures.
    • Create prioritized bug list.
    7:30 AM – 9:30 AM
    Critical Bug Fixing
    Priority:
22. Blocking issues
23. End-to-end failures
24. AI failures
25. Graph failures
26. UI failures
    9:30 AM – 11:00 AM
    AI + Graph Quality Pass
    • Improve AI context.
    • Fix incorrect relationships.
    • Improve evidence.
    • Improve response structure.
    • Verify uncertainty handling.
    11:00 AM – 12:00 PM
    UI Polish
    • Layout.
    • Graph readability.
    • Loading states.
    • Error states.
    • Responsive fixes.
    12:00 PM – 1:00 PM
    Deployment
    • Frontend deployment.
    • Backend deployment.
    • Environment variables.
    • CORS.
    • Production configuration.
    1:00 PM – 2:00 PM
    Production Testing + Final Fixes
    Run the complete production flow.
    2:00 PM – 3:00 PM
    Demo Preparation
    • Demo repository.
    • Demo questions.
    • Demo scenario.
    • Presentation flow.
    • Backup plan.
    3:00 PM – 3:30 PM
    Final Rehearsal
    Run the entire demo without stopping.
    3:30 PM – 4:00 PM
    FINAL FREEZE
    • Stop major development.
    • Verify deployed application.
    • Verify repository.
    • Verify presentation.
    • Verify submission requirements.
    • Keep one team member available for emergency fixes only.
27. Milestones
    Milestone
    M1 — Environment Ready
    Target
    10:30 AM
    M2 — Repository Ingestion Working 1:00 PM
    M3 — Deterministic Analysis Working 3:30 PM
    M4 — Graph Working
    M5 — Workspace Working
    M6 — Ask Ripple Working
    M7 — Impact + What-If Working
    M8 — Core MVP Complete
    M9 — Critical Testing Complete
    M10 — Polish Complete
    M11 — Production Deployment
    M12 — Production Verification
    M13 — Demo Ready
    M14 — Final Freeze
    6:30 PM
    8:30 PM
    11:00 PM
    12:30 AM
    1:00 AM
    9:30 AM
    12:00 PM
    1:00 PM
    2:00 PM
    3:30 PM
    4:00 PM
28. Priority System
    P0 — Must Work
    • Repository upload/input
    • Repository analysis
    • File structure
    • Graph
    • Workspace
    • Ask Ripple
    • Impact Analysis
    • What-If Analysis
    • Production deployment
    P1 — Important
    • Partial analysis handling
    • Search
    • Graph filtering
    • Source/evidence display
    • Error states
    • Responsive UI
    • AI quality improvements
    P2 — Only If Time Remains
    • Additional graph relationship types
    • Extra UI polish
    • Advanced filtering
    • Non-essential convenience features
    If time becomes limited, P2 tasks must be dropped before reducing the quality of the P0
    flow.
29. Final Definition of Done
    Ripple is hackathon-ready when:
    • A real repository can be provided through ZIP or supported GitHub input.
    • Repository analysis completes successfully.
    • JavaScript/TypeScript structure is analyzed.
    • Repository relationships can be visualized.
    • Users can explore files and repository structure.
    • Ask Ripple answers questions using repository evidence.
    • Impact Analysis identifies relevant affected areas.
    • What-If Analysis produces a structured hypothetical analysis.
    • AI does not knowingly expose secrets.
    • Unsupported or partially analyzed repositories are handled gracefully.
    • Frontend, backend, analysis engine and AI work together.
    • The application is deployed.
    • The complete demo flow works in production.
    • The team has rehearsed the demonstration.
    • No major feature remains necessary for the core MVP.
30. Final Hackathon Rule
    Build until 1:00 AM. Test and stabilize from 5:30 AM onward. Do not turn the final morning
    into another feature-development session.
    The objective is not to maximize the number of features.
    The objective is to have one complete, reliable Ripple experience that can be demonstrated
    end-to-end.

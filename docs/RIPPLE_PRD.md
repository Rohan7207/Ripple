RIPPLE
Product Requirements Document
AI-Powered Change Impact Analyzer
Version 1.0 • Hackathon MVP • 30-Hour Build
Product hook: “One change creates a ripple. Ripple shows you how far it travels.”
Core promise: Before a developer changes code, Ripple identifies what that change could affect, explains why,
visualizes the impact, and produces an implementation plan.

1. Product Overview
   Ripple is a developer-focused AI tool that analyzes a software project and maps relationships between its files,
   components, APIs, dependencies, database models, tests, and other detectable structures. A developer describes a
   proposed change in natural language, and Ripple traces the likely impact across the project.
   Problem
   Developers often know the file they want to change but not every downstream component that depends on it. This
   can lead to missed API consumers, broken frontend flows, inconsistent models, forgotten tests, and unexpected
   regressions.
   Solution
   Ripple combines static project analysis with AI reasoning. It first builds a structured representation of the repository,
   then uses that representation to answer change-impact questions rather than relying on a generic chatbot reading a
   few files.
   Target Users
   • Developers working on unfamiliar or existing codebases.
   • Students and hackathon teams maintaining rapidly changing projects.
   • Reviewers or maintainers who need to understand the consequences of a proposed change.
   • Judges/users who want to test the analyzer against their own public or locally provided repository.
2. Goals and Non-Goals
   Goals
   • Accept a project ZIP and a public GitHub project URL.
   • Analyze arbitrary repository types without requiring the repository to match the prepared demo project.
   • Provide deeper structural analysis for JavaScript/TypeScript projects in the MVP.
   • Build an interactive project/dependency map.
   • Accept natural-language proposed changes.
   • Identify affected files/components/APIs/dependencies and explain the reasoning.
   • Allow users to click graph nodes for details and ask Ripple questions.
   • Provide What-If analysis, initially prioritizing the global project view.
   • Generate a practical implementation/change plan and tests to review.
   • Keep the product useful even when a repository has limited or unsupported language-specific analysis.
   Non-Goals for the 30-Hour MVP
   • Automatic modification of the user's source code.
   • Automatic commits, pull requests, or deployment.
   • Private GitHub repository OAuth integration.
   • Real-time repository synchronization.
   • VS Code/IDE extension.
   • Full semantic parity across every programming language.
   • User accounts, teams, billing, or collaboration features.
   • Complex persistent database infrastructure unless required by implementation.
3. User Inputs
   Input
   Required
   Purpose
   Project ZIP
   Public GitHub project URL
   Yes
   Yes
   Actual source code and project structure.
   Project documentation/context and intended functionality.
   Proposed change
   Selected graph node
   Yes for impact analysis
   Natural-language description of what the developer wants to change.
   Optional
   Narrows questions and What-If analysis to a component when supported.
   Security rule: Configuration/package files may be inspected for structure and dependencies, but secret values from
   .env or equivalent secret stores must never be exposed to the user or sent unnecessarily to the AI model.
4. Core User Journey
5. Upload project ZIP fi 2. Provide public GitHub URL fi 3. Analyze project fi 4. Ripple scans and builds project
   representation fi 5. User views Project Map fi 6. User describes a proposed change fi 7. Ripple performs impact
   analysis fi 8. Ripple highlights affected nodes fi 9. User clicks nodes for details or asks questions fi 10. User runs
   What-If fi 11. Ripple produces impact report and implementation plan.
6. Functional Requirements
   FR-01: Repository Ingestion
   • Accept a project ZIP through the web interface.
   • Safely extract and inspect the project without exposing local archive paths.
   • Ignore obvious generated/heavy directories such as node_modules, build output, caches, and secrets where
   applicable.
   • Detect repository structure, languages, important configuration files, package manifests, source files, tests, and other
   relevant artifacts.
   • Handle arbitrary repository uploads gracefully; unsupported constructs should reduce analysis depth rather than crash
   the product.
   FR-02: GitHub Project Context
   • Accept one public GitHub project URL.
   • Retrieve available public project documentation/context.
   • Use the report/documentation as intended-behavior context, while treating the ZIP as the source of truth for actual
   implementation.
   • Do not require private-repository authentication in the MVP.
   FR-03: Project Scanner
   • Extract files and relevant structural relationships.
   • Detect imports/exports, functions, components, API routes, API calls, models/schema references, tests, and package
   dependencies where detectable.
   • Inspect package/configuration metadata without exposing secret values.
   • Produce a normalized internal project representation for downstream AI analysis.
   FR-04: Project Map
   • Show a high-level project graph first.
   • Allow expansion into lower-level nodes such as modules/files/components.
   • Represent relationships such as imports, calls, API connections, model usage, and dependencies where available.
   • Clearly distinguish detected relationships from AI-inferred relationships.
   FR-05: Change Impact Analysis
   • Accept a natural-language change request.
   • Identify affected files/components/APIs/dependencies.
   • Explain why each item is affected.
   • Identify potential breaking points and related tests.
   • Provide risk/context information without claiming certainty when the evidence is incomplete.
   • Highlight affected nodes on the graph.
   FR-06: Node Details + Ask Ripple
   • Clicking a node opens a details panel.
   • Details may include purpose, file path, dependencies, connected APIs, models/tables, related components, and
   relevant project-report context.
   • The user can ask a question about the selected node.
   • Answers must be grounded in the scanned project representation and available source context.
   FR-07: What-If Analysis
   • Allow the user to ask what could happen if a proposed change is made.
   • Global What-If analysis is part of the core MVP.
   • Node-specific What-If analysis is a stretch feature and should be implemented only if the core workflow is stable.
   • Return affected components/files/APIs, likely breaking points, reasons, recommended change order, and tests to
   review.
   • Do not automatically modify source code.
   FR-08: Implementation Plan
   • Convert impact analysis into an ordered developer checklist.
   • Identify files/components to inspect or change.
   • Identify API/database/test updates where relevant.
   • Provide validation/testing steps.
   • The plan is advisory; Ripple does not edit the repository in MVP.
   FR-09: Report « Code Comparison
   • Compare major documented project capabilities against detectable implementation evidence.
   • Show statuses such as implemented, partially detected, or not detected where evidence supports them.
   • Treat this as a secondary feature that can be disabled/cut if schedule pressure threatens the core MVP.
7. Example Ripple Scenario
   Change request: “Change paymentMethod from a free-form string to an enum.”
   Ripple should trace the known relationship chain, for example:
   paymentMethod fi database/model fi backend validation/API fi frontend form fi API payload fi tests
   The result should identify affected areas, explain the relationship, flag likely breaking points, and propose a safe order
   for implementing and testing the change.
8. AI / Agent Responsibilities
   • Scanner Agent: Converts repository contents into structured project metadata.
   • Dependency/Relationship Agent: Resolves relationships between detected project elements.
   • Contract Agent: Focuses on API, model, schema, and interface relationships.
   • Impact Agent: Maps a proposed change to potentially affected project elements.
   • Failure/Test Agent: Identifies likely breaking points and tests requiring review.
   • Planner Agent: Produces the ordered implementation plan.
   • Report Agent: Optionally compares project documentation with implementation evidence.
   These agents are internal implementation roles. The user should experience Ripple as one coherent developer tool,
   not as a collection of separate chatbots.
9. Technical Direction
   Suggested MVP Stack
   • Frontend: React.
   • Backend: Node.js + Express.
   • Interactive graph: React Flow or equivalent.
   • Repository processing: ZIP extraction plus language-aware/static-analysis utilities.
   • AI: free-tier/free-access model or locally available model where practical.
   • Storage: in-memory/session-oriented state for MVP unless persistence becomes necessary.
   Normalized Project Representation
   The scanner should produce a common intermediate representation so AI and UI components do not depend directly
   on raw source files.
   Example: { files, imports, exports, functions, components, apiRoutes, apiCalls, models,
   dependencies, tests, relationships }
   Language Strategy
   Ripple accepts arbitrary repository ZIPs. The MVP provides the deepest structural analysis for JavaScript/TypeScript
   because those languages are practical to analyze reliably within the 30-hour build. Other repositories should still be
   accepted and analyzed to the extent supported by generic or available language detection/parsing. Full
   multi-language semantic analysis is future scope.
10. UI Requirements
    • Landing/upload screen with ZIP upload and public GitHub URL input.
    • Analysis progress state with useful stages rather than a blank loading screen.
    • Project Map screen with graph and project summary.
    • Change-impact input prominently available from the map.
    • Affected nodes visually distinguishable from unaffected nodes.
    • Node details appear in a side panel without losing graph context.
    • Ask Ripple is contextual to the selected node when a node is selected.
    • What-If results should be readable as both a summary and structured impact list.
    • Implementation plan should be easy to copy/use.
    • Errors should explain what failed and what the user can do next.
11. Data / Output Contracts
    Project Analysis Output
    • Project metadata: name, detected languages, entry points where detectable.
    • Files and structural elements.
    • Relationships with relationship type and evidence.
    • Dependencies/package metadata.
    • Detected APIs/models/tests.
    • Analysis warnings and unsupported areas.
    Impact Analysis Output
    • Change summary.
    • Affected elements.
    • Reason/evidence for each impact.
    • Risk or confidence indicator.
    • Potential breaking points.
    • Related tests.
    • Suggested change order.
    • Implementation plan.
    Exact API endpoint names, request schemas, response schemas, and database decisions are intentionally not frozen
    in this PRD. They belong in API_CONTRACT.md and ARCHITECTURE.md after this PRD is approved.
12. Reliability and Safety Requirements
    • Never expose .env values, API keys, tokens, passwords, or other obvious secrets.
    • Treat AI-generated relationships as hypotheses unless backed by scanner evidence.
    • Clearly communicate incomplete/unsupported analysis.
    • Do not claim that a change is safe merely because no impact was detected.
    • Prevent ZIP path traversal and unsafe extraction behavior.
    • Limit archive size/file count/resource consumption to protect the service.
    • Do not execute uploaded project code during analysis.
13. 30-Hour MVP Priorities
    Priority
    Feature
    P0
    P0
    ZIP ingestion + project scanner
    Project representation + relationship graph
    Status
    Must have
    Must have
    P0
    P0
    P0
    P0
    P0
    Natural-language impact analysis
    Interactive graph + node details
    Ask Ripple
    Global What-If
    Implementation plan
    Must have
    Must have
    Must have
    Must have
    Must have
    Priority
    P1
    P1
    Feature
    GitHub documentation context
    Node-specific What-If
    Status
    Must have
    If time permits
    P1
    P2
    P2
    Report « Code comparison
    Automatic code modification
    IDE extension / private GitHub / sync
14. Acceptance Criteria
    • A user can upload a valid project ZIP and start analysis.
    • A public GitHub project URL can be supplied as project context.
    • Ripple can analyze the prepared demo project end-to-end.
    If time permits
    Out of scope
    Out of scope
    • Ripple can also accept a different repository and degrade gracefully when deep analysis is unavailable.
    • The system produces a visible project map with clickable nodes.
    • Selecting a node reveals useful project information.
    • A natural-language change produces an impact result with affected elements and explanations.
    • Affected elements are reflected in the graph.
    • The user can ask Ripple a contextual question about a selected node.
    • Global What-If produces a structured consequence analysis.
    • The system produces an ordered implementation/testing plan.
    • No uploaded source code is automatically modified.
    • Secrets are not exposed.
    • The full prepared demo can be completed reliably without depending on external judge input.
15. Demo Definition of Done
    The final demo should tell a simple story: “Here is a real project. Here is its architecture as Ripple understands it. I
    want to change X. Ripple shows the ripple through the system, explains the affected components, lets me inspect a
    node, answers a question, and gives me a change plan.”
    • Use one prepared, realistic JS/TS project as the guaranteed demo fixture.
    • Show upload fi analysis fi project map fi change request fi impact graph fi node details fi What-If fi
    implementation plan.
    • Keep a second repository available for demonstrating that Ripple is not hard-coded to the demo project.
    • Do not rely on live code modification during the final presentation.
16. Scope-Control Rules
    • Rule 1: If a feature is not in this PRD, it is not part of the MVP.
    • Rule 2: If an API/data contract changes, update the contract before changing dependent code.
    • Rule 3: Prefer a working generic fallback over adding another language-specific subsystem during the final hours.
    • Rule 4: Never sacrifice the core impact-analysis flow for secondary features.
    • Rule 5: No automatic code editing in the MVP.
    • Rule 6: Every feature must have an acceptance criterion before implementation.
    • Rule 7: The prepared demo is a reliability asset, not a hard-coded product limitation.
17. Follow-Up Project Documents
    After PRD approval, create these documents from this source of truth:
    • ARCHITECTURE.md — system components, data flow, scanner architecture, AI orchestration.
    • API_CONTRACT.md — frozen frontend/backend endpoints and schemas.
    • AI_SPEC.md — agent roles, prompts, inputs, outputs, confidence/evidence rules.
    • UI_SPEC.md — screens, states, graph interactions, panels, and error states.
    • TASKS.md — implementation tasks with IDs, owner, dependencies, files, and acceptance criteria.
    • ACCEPTANCE_TESTS.md — end-to-end tests derived directly from this PRD.
18. Final Product Definition
    Ripple is an AI-powered change impact analyzer for software repositories. It accepts a project ZIP and public
    GitHub project context, builds a structured understanding of the repository, visualizes relationships, and lets
    developers ask: “If I change this, what else will be affected?”
    Its defining experience is not simply chatting with code. It is the combination of project mapping + evidence-based
    impact tracing + interactive ripple visualization + contextual questions + What-If analysis + actionable
    implementation planning.
    PRD Status: Version 1.0 — Ready to be used as the source of truth for architecture and implementation planning.

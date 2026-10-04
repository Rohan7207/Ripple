UI_SPEC.md
Ripple — UI Specification

1. Purpose
   This document defines the frontend experience for Ripple.
   Ripple is a developer-focused repository understanding tool. The UI should help developers
   move from:
   Repository
   ↓
   Analysis
   ↓
   Workspace
   ↓
   Understand
   ↓
   Ask
   ↓
   Analyze Change
   ↓
   Explore What-If
   The UI should prioritize repository understanding and exploration rather than traditional SaaS
   dashboard patterns.
2. Design Direction
   Ripple should feel like a modern developer tool.
   Visual characteristics
   • Dark-first interface
   • Clean and minimal
   • Technical but approachable
   • Strong information hierarchy
   • High-quality developer-tool aesthetic
   • Subtle borders and surfaces
   • Restrained use of color
   • Smooth but purposeful interactions
   The visual language should feel closer to tools such as modern code editors, GitHub, Linear,
   Vercel, or Raycast than a generic business dashboard.
   Avoid
   • Generic analytics dashboard layouts
   • Excessive cards
   • Excessive gradients
   • Large decorative illustrations
   • Unnecessary animations
   • Social/productivity features unrelated to repository understanding
   • Overly complex navigation
3. Core User Journey
   The primary user journey is:
   Landing
   ↓
   Repository Input
   ↓
   Repository Analysis
   ↓
   Repository Workspace
   ↓
   Overview / Files / Architecture
   ↓
   Ask Ripple / Impact / What-If
   The UI should make this flow obvious without requiring a tutorial.
4. Application Structure
   Ripple should use a persistent workspace shell after repository analysis.
   ┌─────────────────────────────────────────────────────────────┐
   │ Ripple Repository Name ▼ Search Ask Ripple │
   ├──────────────┬──────────────────────────────────────────────┤
   │  
   │  
   │ Overview │  
   │ Files  
   │  
   │ Architecture │  
   │ Impact  
   │  
   │ What-If │  
   │  
   │  
   │
   │
   Workspace Content  
   │
   │
   │
   │
   │
   └──────────────┴──────────────────────────────────────────────┘
   Primary navigation
   • Overview
   • Files
   • Architecture
   • Impact
   • What-If
   Global actions
   • Repository selector/context
   • Search
   • Ask Ripple
   The exact visual arrangement may change during implementation, but these capabilities should
   remain easily accessible.
5. Landing / Repository Input
   The landing page is the entry point for users who have not loaded a repository.
   Main content
   The page should clearly communicate:
   Understand any codebase. Before you change it.
   Supporting message:
   Ripple analyzes your repository and helps you understand its architecture, dependencies, and
   potential change impact.
   Repository input
   Provide two primary options:
   Upload ZIP
   and
   GitHub Repository
   For GitHub input, provide a repository URL field.
   Upload area
   The ZIP upload area should support:
   • Drag and drop
   • File picker
   • Clear accepted format
   • Upload progress where applicable
   • Validation errors
   GitHub input
   Should support:
   https://github.com/owner/repository
   The UI should validate the input before submitting.
   Primary action
   The main action should be visually obvious:
   Analyze Repository
6. Repository Analysis / Processing
   After repository submission, Ripple should show a dedicated analysis state.
   The user should understand that the repository is being processed rather than seeing an
   unexplained loading spinner.
   Example stages
   Repository received
   ✓
   Scanning repository
   ✓
   Building file structure
   ✓
   Analyzing symbols
   ●
   Building architecture graph
   ○
   Preparing Ripple
   ○
   Stages may update based on actual backend analysis progress.
   UI requirements
   Show:
   • Repository name
   • Current analysis stage
   • Overall progress where available
   • Informative status messages
   • Warnings when applicable
   Completion
   When analysis is ready:
   Analysis complete
   [Open Workspace]
   The UI should automatically transition to the workspace where appropriate.
7. Repository Workspace
   The Repository Workspace is the main application experience.
   It replaces a traditional dashboard.
   The workspace should provide a persistent repository context and allow users to move between
   different ways of understanding the repository.
8. Repository Overview
   The Overview is the workspace's starting point.
   It should answer:
   "What is this repository?"
   Information
   Display relevant repository information such as:
   • Repository name
   • Repository type
   • Languages
   • Frameworks where detected
   • File count
   • Directory structure summary
   • Analysis status
   • Analysis coverage
   • Warnings
   Architecture summary
   Provide a high-level explanation of the repository architecture.
   This may include:
   Frontend
   ↓
   API Layer
   ↓
   Services
   ↓
   Database
   when supported by analysis.
   Key areas
   Show major repository areas such as:
   • Frontend
   • Backend
   • Services
   • Components
   • API layer
   • Data layer
   The exact categories should be generated from repository analysis rather than hard-coded.
   Entry points
   Where detectable, highlight important entry points such as:
   • Application entry
   • Main server
   • Main frontend entry
   • Important API entry points
   Quick actions
   Allow users to quickly:
   • Explore Architecture
   • Browse Files
   • Ask Ripple
   • Analyze Impact
   • Start What-If analysis
9. Architecture Graph
   The architecture graph is one of Ripple's primary product features.
   It should not be treated as a decorative visualization.
   The graph provides an interactive way to understand repository relationships.
   Graph entities
   Depending on analysis results, nodes may represent:
   • Repository
   • Directory
   • File
   • Module
   • Function
   • Class
   • Component
   • API endpoint
   Relationships
   Edges may represent:
   • Imports
   • Exports
   • Calls
   • References
   • Renders
   • Dependencies
   The UI should use visual differentiation for node types and relationship types where useful.
10. Graph Interaction
    The graph should support:
    Pan
    Move around the graph.
    Zoom
    Zoom in and out.
    Fit
    Fit the current graph to the available viewport.
    Node selection
    Selecting a node should provide relevant information.
    Example:
    UserContext.jsx
    Type
    Component / Context
    Location
    src/context/UserContext.jsx
    Relationships
    12
    Used by
    Dashboard.jsx
    MyReports.jsx
    ReportIssue.jsx
    Relationship highlighting
    When a node is selected:
    • Highlight connected relationships.
    • Reduce visual emphasis on unrelated nodes.
    • Make the dependency direction understandable.
    Explore
    Users should be able to move from a graph node to:
    • File details
    • Related nodes
    • Ask Ripple
    • Impact analysis
11. Graph Filtering
    The graph should support lightweight filtering where useful.
    Possible filters:
    Node Type
    □ Files
    □ Components
    □ Functions
    □ API
    □ Classes
    and:
    Relationship
    □ Imports
    □ Calls
    □ References
    □ Renders
    Filtering should simplify the graph rather than introduce a complex graph-management
    interface.
12. Graph Detail Panel
    Selecting a graph node may open a side panel.
    The panel should contain:
    • Name
    • Type
    • File path
    • Symbol information
    • Related nodes
    • Relationship summary
    • Relevant actions
    Example actions:
    Open File
    Ask Ripple
    Analyze Impact
13. Files
    The Files view provides a repository-oriented file explorer.
    Layout
    ┌───────────────┬─────────────────────────────────────────────┐
    │ File Tree │ File Content / Details  
    │  
    │ src/  
    │  
    │ src/services/auth.service.ts  
    │ ├─ components │  
    │
    │
    │
    │
    │ ├─ services │ Source / metadata / relationships  
    │ └─ ...  
    │  
    │
    │
    └───────────────┴─────────────────────────────────────────────┘
    File tree
    Display the repository structure using actual analyzed files.
    File details
    When a file is selected, show:
    • Path
    • Language
    • Symbols
    • Imports
    • Exports
    • Relationships
    • Relevant source content
    The UI should not attempt to render an entire large file unnecessarily.
14. File Source View
    The source view should provide enough context to understand the selected file.
    Features may include:
    • Syntax highlighting
    • Line numbers
    • Symbol navigation
    • Highlighted relevant sections
    • Relationship indicators
    For AI-generated answers, source references should be able to navigate to the relevant file and
    location.
15. Search
    Ripple should provide repository-wide search.
    Search may cover:
    • File names
    • File paths
    • Symbols
    • Components
    • Functions
    • Classes
    • API endpoints
    Search results should identify:
    Name
    Type
    Path
    Selecting a result should open its relevant workspace context.
16. Ask Ripple
    Ask Ripple is a core product capability.
    It should be accessible globally from the workspace.
    Interface
    A prominent natural-language input should allow questions such as:
    Where is authentication handled?
    How does data move from the frontend to the backend?
    Which components depend on this service?
    Where should I start if I want to change payments?
    Response layout
    ┌─────────────────────────────────────────────────────────────┐
    │ Ask Ripple  
    │  
    │ User Question  
    │  
    │
    │
    │
    │
    │ ─────────────────────────────────────────────────────────── │
    │  
    │ Ripple  
    │ Explanation  
    │  
    │
    │
    │
    │
    │ Evidence  
    │
    │ • src/...  
    │ • src/...  
    │  
    │ Related Areas  
    │
    │
    │
    │
    └─────────────────────────────────────────────────────────────┘
17. AI Evidence Presentation
    AI responses should make repository evidence visible.
    Sources should be presented as interactive references.
    Example:
    The authentication flow begins in:
    src/controllers/auth.controller.ts
    and continues through:
    src/services/auth.service.ts
    Each source should be clickable where possible.
    The UI should distinguish between:
    • Repository evidence
    • AI explanation
    • Inference
    • Unknown / insufficient evidence
    This reinforces Ripple's core principle that AI reasoning is grounded in repository analysis.
18. Impact Analysis UI
    Impact Analysis should allow a user to investigate a potential change.
    Input
    The user may specify:
    What do you want to change?
    or initiate analysis from a selected graph/file node.
    Result structure
    Impact Analysis
    Change
    ────────────────────
    [ proposed change ]
    Direct Impact
    ────────────────────
    Files / components directly affected
    Indirect Impact
    ────────────────────
    Areas affected through dependencies
    Related Areas
    ────────────────────
    Areas worth reviewing
    Confidence
    ────────────────────
    HIGH / MEDIUM / LOW
    Considerations
    ────────────────────
    ...
    Affected repository items should be clickable.
19. What-If UI
    What-If is explicitly hypothetical.
    The interface should visually communicate:
    HYPOTHETICAL ANALYSIS
    Example:
    What if we replace the current authentication system?
    Scenario
    ────────────────────
    Affected Areas
    ────────────────────
    Dependencies
    ────────────────────
    Considerations
    ────────────────────
    Implementation Plan
    ────────────────────
20. ...
21. ...
22. ...
    Implementation plan
    Each step should reference real repository paths when available.
    Example:
23. Update authentication service
    src/services/auth.service.ts
24. Update authentication middleware
    src/middleware/auth.middleware.ts
    The UI should never imply that these changes have actually been applied.
25. Repository Context
    The active repository should remain visible throughout the workspace.
    The user should always know:
    Ripple
    / repository-name
    This reduces confusion when users eventually work with multiple repositories.
    A repository selector may be provided where appropriate.
26. Loading States
    Every major asynchronous operation should have an intentional loading state.
    Examples:
    Repository analysis
    Show analysis stages.
    Graph loading
    Show graph-specific loading state rather than a blank screen.
    Ask Ripple
    Show that Ripple is retrieving repository context and generating an explanation.
    Impact
    Show analysis progress.
    What-If
    Show scenario analysis progress.
    Avoid unnecessary generic spinners when a meaningful progress explanation can be shown.
27. Empty States
    Empty states should explain what the user can do next.
    Example:
    No architecture graph available yet.
    Ripple is still analyzing the repository.
    or:
    No search results.
    Try a file name, symbol, component, or API endpoint.
    Empty states should contain a clear next action where appropriate.
28. Error States
    Errors should be understandable and actionable.
    Example:
    Repository analysis failed
    Ripple could not complete structural analysis of this repository.
    [Retry Analysis]
    For AI failures:
    Ripple analysis is temporarily unavailable.
    Your repository analysis is still available.
    [Explore Repository]
    Do not expose internal stack traces to users.
29. Partial Analysis States
    Ripple may support repositories where some files or languages cannot be fully analyzed.
    The UI should communicate this clearly.
    Example:
    Partial Analysis
    82% of supported repository content was analyzed.
    Some files could not be structurally analyzed.
    Warnings should be accessible from the Overview and relevant analysis screens.
30. Security UI
    The UI must never intentionally expose detected secrets.
    If a source contains sensitive content:
    [REDACTED]
    may be shown instead.
    Security warnings should be informative without revealing the protected value.
31. Responsive Design
    Ripple should support:
    • Desktop
    • Tablet
    • Smaller screens where practical
    The primary experience is desktop-oriented because repository graphs and source exploration
    require significant screen space.
    Desktop
    Use:
    • Persistent sidebar
    • Large graph canvas
    • File explorer panels
    • Side detail panels
    Smaller screens
    Adapt by:
    • Collapsing navigation
    • Converting side panels into overlays
    • Allowing horizontal exploration where required
    • Keeping primary actions accessible
    The graph should remain usable rather than simply shrinking into an unreadable view.
32. Component Principles
    Reusable UI components should be created for recurring patterns.
    Examples:
    • Repository header
    • Workspace sidebar
    • Repository status
    • File tree
    • File details panel
    • Graph canvas
    • Graph node
    • Graph detail panel
    • AI response
    • Source reference
    • Impact section
    • What-If section
    • Confidence indicator
    • Loading state
    • Empty state
    • Error state
    Components should remain focused and avoid unnecessary abstraction.
33. Data Integration
    The UI prototype may use mock repository data during development.
    The production UI must consume real API responses defined in API_CONTRACT.md.
    Primary UI data sources include:
    POST /api/repositories
    GET /api/repositories/:repositoryId
    GET /api/repositories/:repositoryId/status
    GET /api/repositories/:repositoryId/files
    GET /api/repositories/:repositoryId/files/:fileId
    GET /api/repositories/:repositoryId/graph
    POST /api/repositories/:repositoryId/ask
    POST /api/repositories/:repositoryId/impact
    POST /api/repositories/:repositoryId/what-if
    The UI should not invent repository information when the API has not provided it.
34. Frontend State
    The frontend should maintain the active repository context and relevant workspace state.
    Examples:
    • Active repository
    • Analysis status
    • Selected file
    • Selected graph node
    • Graph filters
    • Search query
    • Ask Ripple conversation state
    • Current impact request
    • Current What-If scenario
    State should remain as simple as possible for the MVP.
35. Prototype vs Production
    The Lovable prototype may use illustrative repository data to demonstrate the UI.
    This is acceptable during design.
    Production behavior must replace mock values with:
    Real repository
    ↓
    Real analysis
    ↓
    Real graph
    ↓
    Real AI context
    ↓
    Real AI response
    No UI element should permanently depend on hard-coded demo repository data.
36. Out of Scope
    The MVP UI should not include:
    • User profiles
    • Billing
    • Subscription management
    • Team management
    • Social features
    • Notifications center
    • Marketplace
    • PR management
    • Automatic code editing
    • Commit creation
    • Repository modification
    • Complex settings
    • Admin dashboards
    • Analytics dashboards unrelated to repository understanding
37. Core UX Principle
    Every major UI feature should answer one of these questions:
    What is this repository?
    How is it connected?
    What does this code do?
    What happens if I change it?
    What should I investigate before making the change?
    Ripple's UI should make repository understanding feel like an interactive exploration rather than
    a static report.
38. MVP Success Criteria
    The UI is successful when a developer can:
39. Upload a ZIP or provide a GitHub repository.
40. Understand what Ripple is doing during analysis.
41. Enter a repository workspace after analysis.
42. Understand the repository through the Overview.
43. Explore repository structure through Files.
44. Visually explore relationships through the Architecture Graph.
45. Select and inspect graph nodes.
46. Ask natural-language questions about the repository.
47. Navigate from AI answers to repository evidence.
48. Analyze potential change impact.
49. Explore hypothetical changes using What-If.
50. Understand when analysis is partial or uncertain.
51. Use the product without Ripple modifying the repository.

52. Final UX Direction
    Ripple should feel like:
    Upload a repository
    ↓
    Ripple understands it
    ↓
    You explore the architecture
    ↓
    You ask questions
    ↓
    You investigate dependencies
    ↓
    You simulate changes
    ↓
    You make informed implementation decisions
    The UI should make the repository itself the center of the product—not dashboards, metrics,
    profiles, or administrative features.

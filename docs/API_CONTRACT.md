Ripple — API Contract

1. Purpose
   This document defines the contract between the Ripple frontend and backend.
   It specifies:
   • API endpoints
   • Request formats
   • Response formats
   • Repository analysis lifecycle
   • Graph retrieval
   • Impact analysis
   • Ask Ripple
   • What-If analysis
   • Error handling
   • Common data structures
   Internal implementation details such as parsers, graph construction, AI orchestration, and
   model prompts are outside this document.
2. API Conventions
   Base URL
   /api
   Example:
   POST /api/repositories
   Content Types
   JSON endpoints use:
   Content-Type: application/json
   Repository ZIP uploads use:
   Content-Type: multipart/form-data
   Response Envelope
   Successful responses follow:
   {
   "success": true,
   "data": {}
   }
   Errors follow:
   {
   "success": false,
   "error": {
   "code": "ERROR_CODE",
   "message": "Human-readable error message"
   }
   }

3. Repository Lifecycle
   A repository follows this lifecycle:
   CREATED
   ↓
   PROCESSING
   ↓
   ANALYZING
   ↓
   READY
   Possible failure state:
   PROCESSING / ANALYZING
   ↓
   FAILED
   Partial analysis is represented separately through warnings and coverage information rather
   than treating every unsupported file as a complete failure.

4. Create Repository
   Creates a repository analysis session.
   Endpoint
   POST /api/repositories
   The endpoint supports both ZIP upload and public GitHub repository input.
   ZIP Request
   Content-Type: multipart/form-data
   Form field:
   file
   Example:
   file = repository.zip
   GitHub Request
   Content-Type: application/json
   {
   }
   "source": "github",
   "url": "https://github.com/example/project"
   Common Source Values
   zip
   github
   The backend determines the input type from the request format and/or explicit source
   metadata.
   Success Response
   201 Created
   {
   }
   "success": true,
   "data": {
   "repositoryId": "repo_123",
   "status": "PROCESSING"
   }
   The repository ID is used for all subsequent repository operations.

5. Get Repository
   Returns the repository workspace overview.
   Endpoint
   GET /api/repositories/:repositoryId
   Response
   {
   "success": true,
   "data": {
   "id": "repo_123",
   "name": "example-project",
   "status": "READY",
   "languages": [
   {
   "name": "JavaScript",
   "fileCount": 42
   },
   {
   "name": "TypeScript",
   "fileCount": 18
   }
   ],
   "statistics": {
   "files": 60,
   "directories": 12,
   "symbols": 245,
   "relationships": 418
   },
   "analysis": {
   "coverage": "PARTIAL",
   "warnings": [
   "3 files could not be parsed."
   ]
   }
   }
   }

6. Get Analysis Status
   Returns the current repository analysis state.
   Endpoint
   GET /api/repositories/:repositoryId/status
   Response
   {
   "success": true,
   "data": {
   "repositoryId": "repo_123",
   "status": "ANALYZING",
   "progress": 72,
   "stage": "BUILDING_GRAPH"
   }
   }
   Status Values
   PROCESSING
   ANALYZING
   READY
   FAILED
   Analysis Stages
   The backend may expose stages such as:
   EXTRACTING
   CLASSIFYING
   PARSING
   EXTRACTING_RELATIONSHIPS
   BUILDING_GRAPH
   FINALIZING
   The frontend should treat stage names as informational rather than depending on a fixed
   number of stages.

7. Get Repository Files
   Returns files available in the analyzed repository.
   Endpoint
   GET /api/repositories/:repositoryId/files
   Optional Query Parameters
   path
   language
   type
   Example:
   GET /api/repositories/repo_123/files?path=src
   Response
   {
   "success": true,
   "data": {
   "files": [
   {
   "id": "file_1",
   "path": "src/App.jsx",
   "name": "App.jsx",
   "language": "JavaScript",
   "type": "source"
   },
   {
   "id": "file_2",
   "path": "src/services/api.js",
   "name": "api.js",
   "language": "JavaScript",
   "type": "source"
   }
   ]
   }
   }
   The API returns metadata rather than automatically returning every source file's full contents.

8. Get File Details
   Returns details for a specific repository file.
   Endpoint
   GET /api/repositories/:repositoryId/files/:fileId
   Response
   {
   "success": true,
   "data": {
   "id": "file_1",
   "path": "src/App.jsx",
   "language": "JavaScript",
   "type": "source",
   "content": "...",
   "symbols": [
   {
   "id": "symbol_1",
   "name": "App",
   "kind": "component",
   "startLine": 5,
   "endLine": 30
   }
   ]
   }
   }
   Sensitive values filtered during repository processing must not be returned.

9. Get Repository Graph
   Returns the structured repository graph used by the architecture explorer.
   Endpoint
   GET /api/repositories/:repositoryId/graph
   Response
   {
   "success": true,
   "data": {
   "nodes": [
   {
   "id": "file_1",
   "type": "file",
   "label": "App.jsx",
   "path": "src/App.jsx"
   },
   {
   "id": "file_2",
   "type": "file",
   "label": "api.js",
   "path": "src/services/api.js"
   }
   ],
   "edges": [
   {
   "id": "edge_1",
   "source": "file_1",
   "target": "file_2",
   "type": "imports"
   }
   ]
   }
   }
10. Graph Node Types
    The initial graph can represent:
    repository
    directory
    file
    function
    class
    component
    api
    module
    The exact set may expand as analysis capabilities grow.
11. Graph Relationship Types
    Examples include:
    imports
    exports
    calls
    references
    renders
    depends_on
    exposes
    Only relationships actually established by the analysis pipeline should be represented as
    deterministic graph relationships.
12. Ask Ripple
    Allows users to ask questions about the analyzed repository.
    Endpoint
    POST /api/repositories/:repositoryId/ask
    Request
    {
    "question": "Where is authentication handled?"
    }
    Success Response
    {
    "success": true,
    "data": {
    "answer": "Authentication is primarily handled through ...",
    "sources": [
    {
    "fileId": "file_12",
    "path": "src/middleware/auth.js",
    "lines": {
    "start": 10,
    "end": 42
    }
    }
    ]
    }
    }
    The answer should be grounded in repository context.
    Sources identify the repository elements used to support the response.

13. Ask Ripple Validation
    The backend should reject invalid requests such as:
    {
    "question": ""
    }
    Example error:
    {
    "success": false,
    "error": {
    "code": "INVALID_QUESTION",
    "message": "Question must not be empty."
    }
    }

14. Impact Analysis
    Analyzes the potential effect of a proposed change.
    Endpoint
    POST /api/repositories/:repositoryId/impact
    Request
    {
    "change": "Replace the authentication middleware with a service-based authentication layer."
    }
    Response
    {
    "success": true,
    "data": {
    "summary": "The proposed change affects authentication-related middleware, routes, and
    dependent services.",
    "directImpact": [
    {
    "id": "file_12",
    "path": "src/middleware/auth.js",
    "reason": "Current authentication middleware would be replaced."
    }
    ],
    "indirectImpact": [
    {
    "id": "file_20",
    "path": "src/routes/user.js",
    "reason": "Routes currently depend on the authentication middleware."
    }
    ],
    "relatedAreas": [
    {
    "id": "file_25",
    "path": "src/services/user.js"
    }
    ],
    "confidence": "medium"
    }
    }
    The API must distinguish repository relationships discovered deterministically from AI
    generated interpretation.

15. What-If Analysis
    Analyzes a hypothetical architectural or implementation change without modifying the
    repository.
    Endpoint
    POST /api/repositories/:repositoryId/what-if
    Request
    {
    "scenario": "What if authentication is moved from middleware into a service layer?"
    }
    Response
    {
    "success": true,
    "data": {
    "summary": "Moving authentication into a service layer would change how protected routes
    obtain authentication behavior.",
    "affectedAreas": [
    {
    "id": "file_12",
    "path": "src/middleware/auth.js",
    "reason": "Current authentication logic is located here."
    }
    ],
    "dependencies": [
    {
    "id": "file_20",
    "path": "src/routes/user.js",
    "reason": "The route currently depends on authentication middleware."
    }
    ],
    "considerations": [
    "Protected routes would need to use the new service boundary.",
    "Existing middleware-dependent behavior would need to be migrated."
    ],
    "implementationPlan": [
    {
    "step": 1,
    "description": "Create the authentication service boundary."
    },
    {
    "step": 2,
    "description": "Migrate existing authentication logic."
    },
    {
    "step": 3,
    "description": "Update dependent routes."
    }
    ]
    }
    }
    The What-If operation is advisory and does not modify repository contents.

16. Implementation Plan Structure
    Where an implementation plan is returned, the structure should remain predictable.
    {
    "implementationPlan": [
    {
    "step": 1,
    "description": "..."
    },
    {
    "step": 2,
    "description": "..."
    }
    ]
    }
    The plan describes changes the developer may make.
    It does not represent changes already applied to the repository.

17. Common Error Format
    All endpoints use:
    {
    "success": false,
    "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
    }
    }
18. Error Codes
    Initial error codes include:
    Code
    INVALID_REQUEST
    INVALID_FILE
    FILE_TOO_LARGE
    UNSUPPORTED_INPUT
    Meaning
    Request structure is invalid
    Uploaded file is invalid
    Upload exceeds allowed size
    Repository input is not supported
    REPOSITORY_NOT_FOUND Repository session does not exist
    ANALYSIS_NOT_READY
    ANALYSIS_FAILED
    FILE_NOT_FOUND
    INVALID_QUESTION
    INVALID_CHANGE
    INVALID_SCENARIO
    AI_ERROR
    INTERNAL_ERROR
    Requested operation requires completed analysis
    Repository analysis failed
    Requested file does not exist
    Ask Ripple question is invalid
    Impact request is invalid
    What-If scenario is invalid
    AI operation failed
    Unexpected backend error
19. HTTP Status Usage
    Status
    200 OK
    201 Created
    400 Bad Request
    404 Not Found
    413 Payload Too Large
    Usage
    Successful read or analysis operation
    Repository session created
    Invalid request
    Repository/file not found
    Upload exceeds limit
    422 Unprocessable Entity Valid request structure but invalid content
    Status
    Usage
    500 Internal Server Error Unexpected server failure
    502 Bad Gateway
    External AI/provider failure where applicable
    The frontend should primarily use the error.code rather than relying on HTTP status alone for
    user-facing behavior.
20. Repository Readiness Rules
    Operations that require completed repository analysis must verify repository state.
    For example:
    GET /graph
    POST /ask
    POST /impact
    POST /what-if
    should normally require:
    status = READY
    If analysis is still running:
    {
    }
    "success": false,
    "error": {
    "code": "ANALYSIS_NOT_READY",
    "message": "Repository analysis is still in progress."
    }
21. Partial Analysis
    A repository can reach:
    READY
    while still having partial analysis.
    Example:
    {
    "analysis": {
    "coverage": "PARTIAL",
    "warnings": [
    "2 files use an unsupported language.",
    "1 JavaScript file could not be parsed."
    ]
    }
    }
    The API should continue returning successfully analyzed data.
    Partial analysis must not be represented as complete certainty.

22. Security Contract
    The API must never expose detected secrets.
    Sensitive values discovered during processing must be removed or masked before:
    • AI context creation
    • API responses
    • Graph metadata
    • File inspection responses
    • Error messages
    • Logs exposed to users
    Repository source returned through the API must pass through the same security controls
    established by the architecture.

23. AI Response Grounding
    AI-powered endpoints should provide repository references whenever applicable.
    For example:
    {
    "sources": [
    {
    "fileId": "file_12",
    "path": "src/auth/middleware.js",
    "lines": {
    "start": 10,
    "end": 42
    }
    }
    ]
    }
    This allows the frontend to connect AI explanations back to actual repository elements.
    AI-generated conclusions should not be represented as deterministic graph facts unless the
    analysis pipeline has established those relationships.
24. Repository Identification
    Every repository-scoped endpoint uses:
    :repositoryId
    Example:
    /api/repositories/repo_123/graph
    The repository ID represents the active analysis session.
    The frontend must retain the ID after repository creation and use it for subsequent requests.
25. API Surface Summary
    The MVP API consists of:
    GET /api/health
    POST /api/repositories
    GET /api/repositories/:repositoryId
    GET /api/repositories/:repositoryId/status
    GET /api/repositories/:repositoryId/files
    GET /api/repositories/:repositoryId/files/:fileId
    GET /api/repositories/:repositoryId/graph
    POST /api/repositories/:repositoryId/ask
    POST /api/repositories/:repositoryId/impact
    POST /api/repositories/:repositoryId/what-if
    There is intentionally no separate dashboard API.
    The repository overview returned by:
    GET /api/repositories/:repositoryId
    acts as the starting point for the Repository Workspace.

26. API Flow
    The complete frontend/backend interaction is:
    ┌───────────────┐
    │ User │
    └───────┬───────┘
    │
    ▼
    ┌──────────────────┐
    │ Create Repository│
    └────────┬─────────┘
    │
    ▼
    ┌──────────────────┐
    │ Analysis Status │
    └────────┬─────────┘
    │
    READY
    │
    ┌────────────┼────────────┐
    ▼ ▼ ▼
    Repository Graph Files
    Overview
    │
    ┌─────┴───────────────┐
    ▼ ▼
    Ask Ripple What-If
    │
    ▼
    Impact Analysis

27. Contract Principles
    The API contract follows these principles:
28. Repository-centric — all analysis capabilities belong to a repository session.
29. Small MVP surface — expose capabilities rather than internal modules.
30. Consistent responses — use a common success/error envelope.
31. Async analysis — repository processing does not block the initial upload request.
32. Structured data — graph and analysis results use predictable schemas.
33. AI is isolated — frontend does not communicate directly with the AI provider.
34. Evidence-aware — AI responses can reference repository files and symbols.
35. No automatic code modification — the API only analyzes and generates plans.
36. Graceful degradation — partial repository analysis is supported.
37. Security by boundary — secrets are filtered before reaching AI or user-facing
    responses.

38. Contract Boundary
    The responsibility of each layer is:
    Frontend
    │
    │ API Contract
    ▼
    Backend
    │
    ├── Repository Manager
    ├── Analysis Pipeline
    ├── Graph
    └── AI Orchestrator
    API_CONTRACT.md defines only the boundary between the Frontend and Backend.
    The following documents define the next levels of detail:
    AI_SPEC.md
    → AI behavior, context, prompts, outputs
    UI_SPEC.md
    → screens, components, interactions
    TASKS.md
    → implementation work
    ACCEPTANCE_TESTS.md
    → verification criteria

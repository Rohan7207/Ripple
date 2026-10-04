import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileCode2,
  GitBranch,
  Loader2,
  Network,
  Sparkles,
} from "lucide-react";
import { getRepositoryStatus, getRepository } from "../lib/api";

function Analysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const repositoryId = searchParams.get("repositoryId");

  const [backendProgress, setBackendProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [status, setStatus] = useState("PROCESSING");
  const [error, setError] = useState("");
  const [repositoryName, setRepositoryName] = useState("");

  const steps = [
    {
      title: "Repository ingestion",
      description: "Extracting and discovering repository files",
      stages: ["EXTRACTING", "ANALYZING_FILES"],
      icon: GitBranch,
    },
    {
      title: "Symbol analysis",
      description: "Extracting functions, classes and symbols",
      stages: ["ANALYZING_SYMBOLS"],
      icon: FileCode2,
    },
    {
      title: "Relationship analysis",
      description: "Detecting dependencies and code relationships",
      stages: ["ANALYZING_RELATIONSHIPS"],
      icon: Network,
    },

    {
      title: "Finalizing insights",
      description: "Preparing the repository for exploration",
      stages: ["FINALIZING"],
      icon: Sparkles,
    },
  ];

  // ------------------------------------------------------------
  // Poll backend status
  // ------------------------------------------------------------
  useEffect(() => {
    if (!repositoryId) {
      setStatus("FAILED");
      setError("No repository was provided.");
      return;
    }

    let intervalId;
    let stopped = false;

    const checkStatus = async () => {
      try {
        const data = await getRepositoryStatus(repositoryId);

        if (stopped) return;

        const nextStatus = data.status;
        const nextProgress = Number(data.progress ?? 0);

        setBackendProgress(nextProgress);
        setStage(data.stage ?? "");
        setStatus(nextStatus);

        if (nextStatus === "FAILED") {
          stopped = true;
          clearInterval(intervalId);

          setError(
            data.warnings?.[0] ||
              "Ripple could not complete the repository analysis.",
          );
        }

        if (nextStatus === "READY") {
          stopped = true;
          clearInterval(intervalId);

          // Only READY is allowed to reach 100%.
          setBackendProgress(100);
        }
      } catch (error) {
        console.error("Failed to fetch repository status:", error);
      }
    };

    checkStatus();

    intervalId = setInterval(checkStatus, 1000);

    return () => {
      stopped = true;
      clearInterval(intervalId);
    };
  }, [repositoryId]);

  // ------------------------------------------------------------
  // Smooth progress animation
  // ------------------------------------------------------------
  useEffect(() => {
    const targetProgress =
      status === "READY" ? 100 : Math.min(Math.max(backendProgress, 0), 99);

    if (displayProgress === targetProgress) return;

    const timeoutId = setTimeout(() => {
      setDisplayProgress((current) => {
        if (current < targetProgress) {
          // Move gradually toward backend progress.
          const difference = targetProgress - current;
          const increment = Math.max(1, Math.ceil(difference / 5));

          return Math.min(current + increment, targetProgress);
        }

        if (current > targetProgress && status !== "READY") {
          return Math.max(current - 1, targetProgress);
        }

        return current;
      });
    }, 120);

    return () => clearTimeout(timeoutId);
  }, [backendProgress, displayProgress, status]);

  // ------------------------------------------------------------
  // Repository name
  // ------------------------------------------------------------
  useEffect(() => {
    if (!repositoryId) return;

    getRepository(repositoryId)
      .then((repository) => {
        setRepositoryName(repository.name);
      })
      .catch(() => {});
  }, [repositoryId]);

  const handleOpenWorkspace = () => {
    // Extra safety: never open workspace before READY.
    if (status !== "READY") return;

    navigate(`/workspace/${repositoryId}/overview`);
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  const isReady = status === "READY";
  const isFailed = status === "FAILED";

  // ------------------------------------------------------------
  // Determine current backend step
  // ------------------------------------------------------------
  const backendStepIndex =
    status === "READY"
      ? steps.length
      : Math.max(
          0,
          steps.findIndex((step) => step.stages.includes(stage)),
        );

  const currentStep =
    steps[Math.min(backendStepIndex, steps.length - 1)] || steps[0];

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-white/10 bg-[#080b10] flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <GitBranch size={21} className="text-cyan-400" />
          </div>

          <div>
            <h1 className="font-bold text-lg">Ripple</h1>
            <p className="text-xs text-gray-500">Repository Intelligence</p>
          </div>
        </div>

        <button
          onClick={handleBackToLanding}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                  isReady
                    ? "bg-green-500/10 border-green-500/20"
                    : isFailed
                      ? "bg-red-500/10 border-red-500/20"
                      : "bg-cyan-500/10 border-cyan-500/20"
                }`}
              >
                {isReady ? (
                  <CheckCircle2 size={25} className="text-green-400" />
                ) : isFailed ? (
                  <Circle size={25} className="text-red-400" />
                ) : (
                  <Loader2 size={25} className="text-cyan-400 animate-spin" />
                )}
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {isReady
                    ? "Analysis Complete"
                    : isFailed
                      ? "Analysis Failed"
                      : "Analyzing Your Repository"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {isReady
                    ? "Your repository has been mapped and is ready to explore."
                    : isFailed
                      ? "Ripple could not complete the repository analysis."
                      : "Ripple is reading your codebase and building its repository map..."}
                </p>
              </div>
            </div>
          </div>

          {/* Live activity */}
          {!isReady && !isFailed && (
            <div className="mb-4 rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.03] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
                  <div className="relative w-2.5 h-2.5 rounded-full bg-cyan-400" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-cyan-300">
                    {currentStep.title}
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {stage === "EXTRACTING"
                      ? "Extracting your repository and preparing files for analysis..."
                      : currentStep.description}
                  </p>
                </div>

                <span className="text-sm font-mono text-cyan-400">
                  {Math.round(displayProgress)}%
                </span>
              </div>
            </div>
          )}

          {/* Repository + Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Repository */}
            <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Repository
              </p>

              <h3 className="text-lg font-semibold">
                {repositoryName || "Loading..."}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Repository analysis session
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    Overall progress
                  </span>

                  <span className="text-sm text-gray-300">
                    {Math.round(displayProgress)}%
                  </span>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-150 ${
                      isFailed
                        ? "bg-red-500"
                        : isReady
                          ? "bg-green-500"
                          : "bg-cyan-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        Math.round(displayProgress),
                        isReady ? 100 : 99,
                      )}%`,
                    }}
                  />
                </div>

                {!isReady && !isFailed && (
                  <p className="text-[11px] text-gray-600 mt-3">
                    {stage === "EXTRACTING"
                      ? "Preparing the repository for structural analysis..."
                      : stage === "ANALYZING_FILES"
                        ? "Discovering repository files..."
                        : stage === "ANALYZING_SYMBOLS"
                          ? "Mapping functions, classes, and other code symbols..."
                          : stage === "ANALYZING_RELATIONSHIPS"
                            ? "Tracing dependencies and relationships between files..."
                            : stage === "BUILDING_GRAPH"
                              ? "Connecting repository components for code analysis..."
                              : "Finalizing repository insights..."}
                  </p>
                )}
              </div>
            </div>

            {/* Analysis Progress */}
            <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Analysis Pipeline</h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {isReady
                      ? "All analysis stages completed"
                      : isFailed
                        ? "Analysis stopped"
                        : "Working through the repository"}
                  </p>
                </div>

                <span className="text-xs text-gray-500">
                  {isReady
                    ? `${steps.length} / ${steps.length}`
                    : `${Math.min(
                        backendStepIndex + 1,
                        steps.length,
                      )} / ${steps.length}`}
                </span>
              </div>

              <div className="space-y-1">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  const completed = isReady || index < backendStepIndex;

                  const active =
                    !isFailed && !isReady && index === backendStepIndex;

                  return (
                    <div
                      key={step.title}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                        active
                          ? "bg-cyan-500/5 border border-cyan-500/10"
                          : "border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          completed
                            ? "bg-green-500/10"
                            : active
                              ? "bg-cyan-500/10"
                              : "bg-white/[0.03]"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={17} className="text-green-400" />
                        ) : active ? (
                          <Loader2
                            size={17}
                            className="text-cyan-400 animate-spin"
                          />
                        ) : (
                          <Circle size={17} className="text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon
                            size={14}
                            className={
                              completed
                                ? "text-green-400"
                                : active
                                  ? "text-cyan-400"
                                  : "text-gray-600"
                            }
                          />

                          <p
                            className={`text-sm font-medium ${
                              completed
                                ? "text-gray-200"
                                : active
                                  ? "text-white"
                                  : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </p>
                        </div>

                        <p className="text-[11px] text-gray-600 mt-0.5 ml-5">
                          {step.description}
                        </p>
                      </div>

                      {completed && (
                        <span className="text-[11px] text-green-400">
                          Complete
                        </span>
                      )}

                      {active && (
                        <span className="text-[11px] text-cyan-400">
                          Processing
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ready */}
          {isReady && (
            <div className="mt-5 rounded-2xl border border-green-500/15 bg-green-500/[0.03] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-green-300">
                    Your repository is ready.
                  </p>
                </div>

                <button
                  onClick={handleOpenWorkspace}
                  disabled={!isReady}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#061014] font-semibold transition-all shadow-lg shadow-cyan-500/10 shrink-0 disabled:opacity-50"
                >
                  Open Workspace
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Failed */}
          {isFailed && (
            <div className="mt-5 rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5">
              <p className="text-sm text-red-400">
                {error || "Repository analysis failed."}
              </p>

              <button
                onClick={handleBackToLanding}
                className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Return to Landing
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Analysis;

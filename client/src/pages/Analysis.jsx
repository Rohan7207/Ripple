import RippleLogo from "../components/RippleLogo";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch,
  CheckCircle2,
  Circle,
  Loader2,
  FileCode2,
  Package,
  Network,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function Analysis() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Repository cloned",
      description: "Repository source downloaded successfully",
      icon: GitBranch,
    },
    {
      title: "Files scanned",
      description: "Scanning source files and project structure",
      icon: FileCode2,
    },
    {
      title: "Dependencies analyzed",
      description: "Detecting packages and external dependencies",
      icon: Package,
    },
    {
      title: "Building architecture",
      description: "Mapping relationships between modules",
      icon: Network,
    },
    {
      title: "Generating insights",
      description: "Preparing AI-powered repository insights",
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((previous) => {
        const next = previous + 2;

        if (next >= 100) {
          clearInterval(interval);
          setCurrentStep(4);
          return 100;
        }

        if (next >= 80) {
          setCurrentStep(4);
        } else if (next >= 60) {
          setCurrentStep(3);
        } else if (next >= 40) {
          setCurrentStep(2);
        } else if (next >= 20) {
          setCurrentStep(1);
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleOpenWorkspace = () => {
    navigate("/workspace/demo/overview");
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-white/10 bg-[#080b10] flex items-center px-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <GitBranch size={21} className="text-blue-400" />
          </div>

          <div>
            <h1 className="font-bold text-lg">Ripple</h1>
            <p className="text-xs text-gray-500">
              Repository Intelligence
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Top section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-5">
              {progress < 100 ? (
                <Loader2
                  size={30}
                  className="text-blue-400 animate-spin"
                />
              ) : (
                <CheckCircle2
                  size={30}
                  className="text-green-400"
                />
              )}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {progress < 100
                ? "Analyzing Repository"
                : "Analysis Complete"}
            </h2>

            <p className="text-gray-500 mt-3">
              {progress < 100
                ? "Ripple is understanding your codebase..."
                : "Your repository is ready to explore."}
            </p>
          </div>

          {/* Repository Card */}
          <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-6 mb-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Repository
                </p>

                <h3 className="text-lg font-semibold">
                  ripple-demo
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  github.com/user/ripple-demo
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                {progress}% complete
              </div>
            </div>

            {/* Progress */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Starting analysis</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Analysis Steps */}
          <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Analysis Progress</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Processing your repository
                </p>
              </div>

              <span className="text-xs text-gray-500">
                {currentStep + 1} / {steps.length}
              </span>
            </div>

            <div className="space-y-1">
              {steps.map((step, index) => {
                const Icon = step.icon;

                const completed = progress >= (index + 1) * 20;
                const active =
                  !completed && currentStep === index && progress < 100;

                return (
                  <div
                    key={step.title}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      active
                        ? "bg-blue-500/5 border border-blue-500/10"
                        : "border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        completed
                          ? "bg-green-500/10"
                          : active
                          ? "bg-blue-500/10"
                          : "bg-white/[0.03]"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2
                          size={20}
                          className="text-green-400"
                        />
                      ) : active ? (
                        <Loader2
                          size={20}
                          className="text-blue-400 animate-spin"
                        />
                      ) : (
                        <Circle
                          size={20}
                          className="text-gray-600"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          size={15}
                          className={
                            completed
                              ? "text-green-400"
                              : active
                              ? "text-blue-400"
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

                      <p className="text-xs text-gray-600 mt-1 ml-6">
                        {step.description}
                      </p>
                    </div>

                    {completed && (
                      <span className="text-xs text-green-400">
                        Complete
                      </span>
                    )}

                    {active && (
                      <span className="text-xs text-blue-400">
                        Processing
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workspace button */}
          {progress === 100 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleOpenWorkspace}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
              >
                Open Workspace
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-600 mt-6">
            Demo analysis for the frontend. This will be connected to
            the Ripple backend API later.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Analysis;
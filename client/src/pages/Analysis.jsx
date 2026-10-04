import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  LoaderCircle,
  GitBranch,
  FileCode2,
  Network,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    title: "Repository connected",
    description: "Preparing repository metadata",
    icon: GitBranch,
  },
  {
    title: "Scanning source files",
    description: "Discovering files and modules",
    icon: FileCode2,
  },
  {
    title: "Building architecture",
    description: "Mapping dependencies and relationships",
    icon: Network,
  },
  {
    title: "Preparing Ripple",
    description: "Creating your repository knowledge layer",
    icon: Sparkles,
  },
];

function Analysis() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(timer);
          return 100;
        }

        return current + 2;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        navigate("/workspace/demo/overview");
      }, 900);

      return () => clearTimeout(timer);
    }
  }, [progress, navigate]);

  const completedSteps = Math.floor((progress / 100) * steps.length);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 text-white">

      <div className="w-full max-w-2xl">

        <div className="mb-10 text-center">

          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <LoaderCircle
              size={27}
              className="animate-spin text-blue-400"
            />
          </div>

          <h1 className="text-3xl font-bold">
            Analyzing repository
          </h1>

          <p className="mt-3 text-slate-500">
            Ripple is understanding your codebase...
          </p>

        </div>

        {/* Progress */}
        <div className="mb-10">

          <div className="mb-3 flex items-center justify-between text-sm">

            <span className="text-slate-400">
              Analysis progress
            </span>

            <span className="font-mono text-blue-400">
              {progress}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/5">

            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />

          </div>

        </div>

        {/* Steps */}
        <div className="space-y-3">

          {steps.map((step, index) => {

            const Icon = step.icon;
            const completed = index < completedSteps;
            const active = index === completedSteps && progress < 100;

            return (
              <div
                key={step.title}
                className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                  completed
                    ? "border-emerald-500/10 bg-emerald-500/[0.03]"
                    : active
                      ? "border-blue-500/20 bg-blue-500/[0.04]"
                      : "border-white/5 bg-white/[0.015]"
                }`}
              >

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    completed
                      ? "bg-emerald-500/10 text-emerald-400"
                      : active
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-white/5 text-slate-600"
                  }`}
                >
                  {completed ? (
                    <Check size={18} />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium">
                    {step.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {step.description}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </main>
  );
}

export default Analysis;
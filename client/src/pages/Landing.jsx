import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch,
  Upload,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  FileCode2,
  Zap,
} from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  const [githubUrl, setGithubUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAnalyze = () => {
    // If user provides a GitHub URL or ZIP file,
    // move to the analysis page.
    if (githubUrl.trim() || selectedFile) {
      navigate("/analysis");
    } else {
      alert("Please enter a GitHub repository URL or upload a ZIP file.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute bottom-[-250px] left-[-200px] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <GitBranch size={22} className="text-blue-400" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Ripple
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-white"
          >
            How it works
          </a>

          <button
            onClick={() => navigate("/analysis")}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Try Ripple
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-sm text-blue-300">
              <Sparkles size={15} />

              <span>AI-powered repository intelligence</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Understand any
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                codebase instantly.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              Ripple uses AI to analyze your repository, understand its
              architecture, explore files, answer questions, and predict
              the impact of code changes.
            </p>

            {/* Repository Input Card */}
            <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              {/* GitHub URL */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <GitBranch
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="h-14 w-full rounded-xl border border-white/10 bg-black/30 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  className="flex h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
                >
                  Analyze
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs uppercase tracking-widest text-slate-600">
                  or
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* ZIP Upload */}
              <label className="group flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-4 transition hover:border-blue-400/40 hover:bg-blue-400/[0.03]">
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition group-hover:text-blue-400">
                  <Upload size={19} />
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium text-slate-200">
                    {selectedFile
                      ? selectedFile.name
                      : "Upload repository ZIP"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedFile
                      ? "ZIP file selected"
                      : "Drop your repository archive here"}
                  </p>
                </div>
              </label>
            </div>

            {/* Trust indicators */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                Secure analysis
              </div>

              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                Fast repository analysis
              </div>

              <div className="flex items-center gap-2">
                <FileCode2 size={16} className="text-blue-400" />
                Understand your code
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-y border-white/5 bg-white/[0.015]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Built for developers
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Go from code to understanding
              </h2>

              <p className="mt-4 text-slate-400">
                Ripple gives your team a visual and conversational way to
                understand complex repositories.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition hover:-translate-y-1 hover:border-blue-400/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Search size={22} />
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Explore your repository
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Browse files, inspect source code, and understand how
                  different parts of your project connect.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition hover:-translate-y-1 hover:border-purple-400/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <GitBranch size={22} />
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Visualize architecture
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  See services, modules, dependencies, and relationships
                  through an interactive architecture graph.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition hover:-translate-y-1 hover:border-cyan-400/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Sparkles size={22} />
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Ask Ripple
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Ask questions about your codebase and get AI-powered
                  explanations grounded in your repository.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                From repository to intelligence.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                Connect your repository and Ripple handles the heavy work.
                Analyze the codebase, build its architecture, and make it
                easier for your team to understand and modify.
              </p>

              <button
                onClick={() => navigate("/analysis")}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-slate-200"
              >
                Start analyzing
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-semibold text-blue-400">
                  01
                </div>

                <div>
                  <h3 className="font-semibold">
                    Connect your repository
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Provide a GitHub repository URL or upload a ZIP file.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10 font-semibold text-purple-400">
                  02
                </div>

                <div>
                  <h3 className="font-semibold">
                    Ripple analyzes the code
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Files, dependencies, architecture, and relationships
                    are analyzed automatically.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 font-semibold text-cyan-400">
                  03
                </div>

                <div>
                  <h3 className="font-semibold">
                    Understand and explore
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Explore the architecture, inspect files, ask questions,
                    and analyze potential code changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-blue-400" />
            <span>Ripple</span>
          </div>

          <p>
            AI-powered repository understanding.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
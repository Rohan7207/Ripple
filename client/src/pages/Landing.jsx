import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  FileCode2,
  GitBranch,
  Upload,
} from "lucide-react";

function Landing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [githubUrl, setGithubUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const startAnalysis = () => {
    navigate("/analysis");
  };

  const handleFile = (file) => {
    if (!file) return;

    // Frontend-only for now.
    // Backend integration will be added later.
    navigate("/analysis");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleGithubAnalyze = () => {
    if (!githubUrl.trim()) return;

    // Backend integration will be added later.
    navigate("/analysis");
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-white overflow-hidden">
      {/* =========================================================
          BACKGROUND GRID
      ========================================================== */}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.38]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
        }}
      />

      {/* Very subtle cyan glow */}
      <div className="fixed top-[18%] left-[15%] w-[420px] h-[420px] bg-cyan-500/[0.035] blur-[120px] rounded-full pointer-events-none" />

      {/* =========================================================
          NAVBAR
      ========================================================== */}

      <header className="relative z-20 max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-400/70" />

              <div className="absolute inset-[4px] rounded-full border border-cyan-400/50" />

              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

              <div className="absolute w-8 h-px bg-cyan-400/50 rotate-[35deg]" />
            </div>

            <span className="text-[17px] font-semibold tracking-tight">
              Ripple
            </span>
          </div>

          {/* Version */}
          <div className="text-xs font-mono text-slate-500">
            v0.1 · hackathon build
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================== */}

      <main className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="min-h-[calc(100vh-64px)] flex items-center">
          <div className="w-full grid lg:grid-cols-[1fr_0.92fr] gap-16 xl:gap-24 items-center py-12 lg:py-16">
            {/* =====================================================
                LEFT SIDE
            ====================================================== */}

            <section className="max-w-[680px]">
              {/* Ripple Orb */}
              <div className="relative w-28 h-28 mb-8">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-cyan-500/10" />

                {/* Second ring */}
                <div className="absolute inset-[10px] rounded-full border border-cyan-400/20" />

                {/* Third ring */}
                <div className="absolute inset-[18px] rounded-full border border-cyan-400/45" />

                {/* Core */}
                <div className="absolute inset-[27px] rounded-full border border-cyan-300/70 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.85)]" />
                </div>

                {/* Orbit line */}
                <div className="absolute left-1/2 top-1/2 w-[108px] h-[38px] -translate-x-1/2 -translate-y-1/2 border border-cyan-400/40 rounded-[50%] rotate-[-25deg]" />

                {/* Orbit dot */}
                <div className="absolute top-[17px] right-[13px] w-2 h-2 bg-slate-200 rounded-full" />

                {/* Glow */}
                <div className="absolute inset-8 rounded-full bg-cyan-400/10 blur-xl" />
              </div>

              {/* Heading */}
              <h1 className="text-[54px] sm:text-[64px] lg:text-[68px] xl:text-[72px] leading-[0.99] tracking-[-0.045em] font-semibold">
                <span className="block text-[#f1f3f5]">
                  Understand any
                </span>

                <span className="block text-[#f1f3f5]">
                  codebase.
                </span>

                <span className="block text-[#8c929b]">
                  Before you change it.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-8 max-w-[650px] text-[17px] leading-8 text-[#8298b5]">
                Ripple maps a repository&apos;s structure and dependency graph,
                answers questions with cited source, and shows what a proposed
                change could touch — so you plan before you edit.
              </p>

              {/* Workflow */}
              <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-mono text-slate-500">
                <span className="text-slate-400">01 Upload</span>
                <span className="text-slate-700">→</span>

                <span>02 Analyze</span>
                <span className="text-slate-700">→</span>

                <span>03 Explore</span>
                <span className="text-slate-700">→</span>

                <span>04 Ask</span>
                <span className="text-slate-700">→</span>

                <span>05 Impact</span>
                <span className="text-slate-700">→</span>

                <span>06 What-If</span>
              </div>
            </section>

            {/* =====================================================
                RIGHT SIDE - REPOSITORY INPUT
            ====================================================== */}

            <section className="w-full">
              <div className="rounded-xl border border-white/[0.10] bg-[#0d0f12]/95 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
                <div className="rounded-lg border border-dashed border-white/[0.12] bg-[#0f1114] px-6 sm:px-10 py-14">
                  {/* Upload icon */}
                  <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-lg bg-[#171a1e] border border-white/[0.07] flex items-center justify-center">
                      <FileCode2
                        size={25}
                        strokeWidth={1.5}
                        className="text-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-slate-200">
                      Upload your repository
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Drag & drop a ZIP here, or{" "}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-slate-300 underline underline-offset-4 hover:text-cyan-400 transition-colors"
                      >
                        browse files
                      </button>
                    </p>

                    {/* Hidden input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Upload button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-8 inline-flex items-center gap-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#061014] font-medium text-sm px-6 py-3.5 rounded-md transition-all duration-200 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] active:scale-[0.98]"
                    >
                      <Upload size={17} />
                      Upload Repository
                    </button>
                  </div>
                </div>

                {/* OR divider */}
                <div className="flex items-center gap-4 px-2 sm:px-4 py-5">
                  <div className="h-px flex-1 bg-white/[0.08]" />

                  <span className="text-[11px] text-slate-600 font-mono">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                {/* GitHub input */}
                <div className="px-1 sm:px-2 pb-1">
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0 h-12 rounded-md border border-white/[0.10] bg-[#090b0e] flex items-center px-4">
                      <GitBranch
                        size={17}
                        className="text-slate-500 flex-shrink-0"
                      />

                      <input
                        type="text"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleGithubAnalyze();
                          }
                        }}
                        placeholder="github.com/owner/repository"
                        className="w-full ml-3 bg-transparent outline-none text-sm text-slate-300 placeholder:text-slate-600"
                      />
                    </div>

                    <button
                      onClick={handleGithubAnalyze}
                      className="h-12 px-5 rounded-md bg-[#191d22] border border-white/[0.10] text-sm font-medium text-slate-300 hover:text-white hover:border-cyan-400/30 hover:bg-[#1b2026] transition-all flex items-center gap-2"
                    >
                      Analyze
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-3 pt-3 border-t border-white/[0.07] px-3 pb-1">
                  <div className="flex flex-wrap justify-between gap-3 text-[11px] font-mono text-slate-600">
                    <span>.zip up to 50 MB · public GitHub repos</span>

                    <span>JS · TS · JSX · TSX · JSON</span>
                  </div>

                  <button
                    onClick={startAnalysis}
                    className="mt-4 mb-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors group"
                  >
                    Try the sample repository
                    <ArrowUpRight
                      size={13}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                    <span className="text-slate-400">
                      → CivicFix-AI
                    </span>
                  </button>
                </div>
              </div>

              {/* Small status line */}
              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-700 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/70 animate-pulse" />
                Repository intelligence starts locally
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
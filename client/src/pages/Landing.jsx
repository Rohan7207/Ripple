import { createRepository } from "../lib/api";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileCode2, GitBranch, Upload, X } from "lucide-react";

function Landing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [githubUrl, setGithubUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return;

    try {
      setIsAnalyzing(true);

      const data = await createRepository({
        file: selectedFile,
      });

      navigate(`/analysis?repositoryId=${data.repositoryId}`);
    } catch (error) {
      console.error("Failed to analyze repository:", error);
      setIsAnalyzing(false);
    }
  };

  const handleGithubAnalyze = async () => {
    if (!githubUrl.trim() || isAnalyzing) return;

    try {
      setIsAnalyzing(true);

      const data = await createRepository({
        githubUrl: githubUrl.trim(),
      });

      navigate(`/analysis?repositoryId=${data.repositoryId}`);
    } catch (error) {
      console.error("Failed to analyze GitHub repository:", error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-white overflow-hidden">
      {/* Background grid */}
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

      {/* Glow */}
      <div className="fixed top-[18%] left-[15%] w-[420px] h-[420px] bg-cyan-500/[0.035] blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-cyan-400/70" />
              <div className="absolute inset-[5px] rounded-full border border-cyan-400/45" />
              <div className="absolute inset-[8px] rounded-full border border-cyan-400/60" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
              </div>

              <div className="absolute w-9 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-400/50 rounded-[50%] rotate-[-25deg]" />

              <div className="absolute w-1.5 h-1.5 bg-slate-200 rounded-full top-[18%] right-[8%] shadow-[0_0_6px_rgba(255,255,255,0.5)]" />

              <div className="absolute inset-[20%] rounded-full bg-cyan-400/10 blur-md" />
            </div>

            <span className="text-[17px] font-semibold tracking-tight text-white">
              Ripple
            </span>
          </div>

          <div className="text-xs font-mono text-slate-500">
            v0.1 · hackathon build
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="min-h-[calc(100vh-64px)] flex items-center">
          <div className="w-full grid lg:grid-cols-[1fr_0.92fr] gap-16 xl:gap-24 items-center py-12 lg:py-16">
            {/* Left */}
            <section className="max-w-[680px]">
              <div className="relative w-28 h-28 mb-8">
                <div className="absolute inset-0 rounded-full border border-cyan-500/10" />
                <div className="absolute inset-[10px] rounded-full border border-cyan-400/20" />
                <div className="absolute inset-[18px] rounded-full border border-cyan-400/45" />

                <div className="absolute inset-[27px] rounded-full border border-cyan-300/70 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.85)]" />
                </div>

                <div className="absolute left-1/2 top-1/2 w-[108px] h-[38px] -translate-x-1/2 -translate-y-1/2 border border-cyan-400/40 rounded-[50%] rotate-[-25deg]" />

                <div className="absolute top-[17px] right-[13px] w-2 h-2 bg-slate-200 rounded-full" />

                <div className="absolute inset-8 rounded-full bg-cyan-400/10 blur-xl" />
              </div>

              <h1 className="text-[54px] sm:text-[64px] lg:text-[68px] xl:text-[72px] leading-[0.99] tracking-[-0.045em] font-semibold">
                <span className="block text-[#f1f3f5]">Understand any</span>

                <span className="block text-[#f1f3f5]">codebase.</span>

                <span className="block text-[#8c929b]">
                  Before you change it.
                </span>
              </h1>

              <p className="mt-8 max-w-[650px] text-[17px] leading-8 text-[#8298b5]">
                Ripple maps a repository&apos;s structure and dependency graph,
                answers questions with cited source, and shows what a proposed
                change could touch — so you plan before you edit.
              </p>

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

            {/* Right */}
            <section className="w-full">
              <div className="rounded-xl border border-white/[0.10] bg-[#0d0f12]/95 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
                {/* Upload */}
                <div className="rounded-lg border border-dashed border-white/[0.12] bg-[#0f1114] px-6 sm:px-10 py-10">
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

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Selected file */}
                    {selectedFile ? (
                      <div className="mt-6 flex items-center gap-3 text-left rounded-lg border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-3">
                        <FileCode2
                          size={19}
                          className="text-cyan-400 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-200 truncate">
                            {selectedFile.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          onClick={handleRemoveFile}
                          disabled={isAnalyzing}
                          className="text-slate-500 hover:text-white transition-colors disabled:opacity-50"
                          title="Remove file"
                        >
                          <X size={17} />
                        </button>
                      </div>
                    ) : null}

                    {/* Upload / Analyze button */}
                    <button
                      onClick={
                        selectedFile
                          ? handleFileAnalyze
                          : () => fileInputRef.current?.click()
                      }
                      disabled={isAnalyzing}
                      className="mt-6 inline-flex items-center gap-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed text-[#061014] font-medium text-sm px-6 py-3.5 rounded-md transition-all duration-200 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] active:scale-[0.98]"
                    >
                      <Upload size={17} />

                      {isAnalyzing
                        ? "Starting analysis..."
                        : selectedFile
                          ? "Analyze Repository"
                          : "Choose ZIP File"}
                    </button>
                  </div>
                </div>

                {/* OR */}
                <div className="flex items-center gap-4 px-2 sm:px-4 py-5">
                  <div className="h-px flex-1 bg-white/[0.08]" />

                  <span className="text-[11px] text-slate-600 font-mono">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                {/* GitHub */}
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
                      disabled={isAnalyzing}
                      className="h-12 px-5 rounded-md bg-[#191d22] border border-white/[0.10] text-sm font-medium text-slate-300 hover:text-white hover:border-cyan-400/30 hover:bg-[#1b2026] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      Analyze
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="mt-3 pt-3 border-t border-white/[0.07] px-3 pb-3">
                  <div className="flex flex-wrap justify-between gap-3 text-[11px] font-mono text-slate-600">
                    <span>.zip up to 50 MB · public GitHub repos</span>

                    <span>JS · TS · JSX · TSX · JSON</span>
                  </div>
                </div>
              </div>

              {/* Status */}
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

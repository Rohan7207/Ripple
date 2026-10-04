import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  WandSparkles,
  FileCode2,
  GitBranch,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  RotateCcw,
  Lightbulb,
  ListChecks,
  HelpCircle,
} from "lucide-react";

import { analyzeRepositoryWhatIf } from "../lib/api";

function WhatIf() {
  const { repositoryId } = useParams();

  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const trimmedScenario = scenario.trim();

    if (!trimmedScenario) {
      setError("Please describe a what-if scenario.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError("");

      const data = await analyzeRepositoryWhatIf(repositoryId, trimmedScenario);

      setResult(data);
    } catch (error) {
      setError(
        "Ripple could not analyze this scenario right now. Please try again with a shorter or simpler scenario.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setScenario("");
    setResult(null);
    setError("");
  };

  const analysis = result?.result;

  const likelyChanges = Array.isArray(analysis?.likelyChanges)
    ? analysis.likelyChanges
    : [];

  const affectedFiles = Array.isArray(analysis?.affectedFiles)
    ? analysis.affectedFiles
    : [];

  const affectedSymbols = Array.isArray(analysis?.affectedSymbols)
    ? analysis.affectedSymbols
    : [];

  const risks = Array.isArray(analysis?.risks) ? analysis.risks : [];

  const unknowns = Array.isArray(analysis?.unknowns) ? analysis.unknowns : [];

  return (
    <div className="max-w-[1300px] mx-auto min-h-[calc(100vh-10rem)] pb-8">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <WandSparkles size={18} className="text-purple-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">What-If Analysis</h1>

            <p className="text-sm text-gray-500 mt-0.5">
              Explore the possible effects of a change before modifying your
              code.
            </p>
          </div>
        </div>

        {result && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#0c1016] text-gray-500 hover:text-white hover:border-white/20 transition text-sm"
          >
            <RotateCcw size={14} />
            New Analysis
          </button>
        )}
      </div>

      {/* =====================================================
          SCENARIO INPUT
      ====================================================== */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleAnalyze();
        }}
        className="bg-[#0c1016] border border-white/10 rounded-2xl p-5 mb-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={15} className="text-purple-400" />

          <div>
            <p className="text-xs font-medium text-gray-400">
              What change are you considering?
            </p>

            <p className="text-[10px] text-gray-700 mt-1">
              Describe the hypothetical change in natural language.
            </p>
          </div>
        </div>

        <textarea
          value={scenario}
          onChange={(event) => {
            setScenario(event.target.value);
            setError("");
          }}
          disabled={isAnalyzing}
          rows={4}
          placeholder="Example: What would happen if I replace the JWT authentication flow with session-based authentication?"
          className="w-full resize-none bg-[#090c11] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 placeholder-gray-700 outline-none focus:border-purple-500/30 transition disabled:opacity-50"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <div className="flex items-center gap-2 text-[10px] text-gray-700">
            <AlertCircle size={12} />

            <span>
              This is advisory only. Ripple will not modify your repository.
            </span>
          </div>

          <button
            type="submit"
            disabled={!scenario.trim() || isAnalyzing}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 disabled:bg-purple-500/30 disabled:cursor-not-allowed text-white text-sm font-medium transition"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze What-If
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
            <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />

            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}
      </form>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {!result && !isAnalyzing && !error && (
        <div className="min-h-[430px] flex items-center justify-center bg-[#0c1016] border border-white/10 rounded-2xl">
          <div className="text-center max-w-md px-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <WandSparkles size={24} className="text-purple-400" />
            </div>

            <h2 className="text-lg font-semibold text-gray-300 mt-5">
              Explore a hypothetical change
            </h2>

            <p className="text-sm text-gray-600 leading-6 mt-2">
              Describe what you are considering changing and Ripple will reason
              about affected areas, dependencies, risks, and unknowns using
              repository evidence.
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}
      {isAnalyzing && (
        <div className="min-h-[430px] flex items-center justify-center bg-[#0c1016] border border-white/10 rounded-2xl">
          <div className="text-center">
            <Loader2
              size={26}
              className="mx-auto text-purple-400 animate-spin"
            />

            <p className="text-sm text-gray-400 mt-4">
              Analyzing your scenario...
            </p>

            <p className="text-xs text-gray-700 mt-1">
              Checking repository evidence and dependencies.
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          RESULTS
      ====================================================== */}
      {result && analysis && !isAnalyzing && (
        <div className="space-y-5">
          {/* =================================================
              SCENARIO + CONFIDENCE
          ================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
            <section className="bg-[#0c1016] border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                Hypothetical change
              </p>

              <p className="text-sm text-gray-300 leading-6 mt-2">
                {result.scenario || scenario}
              </p>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-700">
                <AlertCircle size={12} />
                Repository has not been modified.
              </div>
            </section>

            <ConfidenceCard confidence={analysis.confidence} />
          </div>

          {/* =================================================
              LIKELY CHANGES
          ================================================== */}
          <ResultSection
            icon={Lightbulb}
            iconClass="text-purple-400"
            title="Likely Changes"
            count={likelyChanges.length}
            empty="No specific likely changes were established."
          >
            <div className="space-y-2">
              {likelyChanges.map((item, index) => (
                <ListItem
                  key={index}
                  icon={ArrowRight}
                  text={formatValue(item)}
                />
              ))}
            </div>
          </ResultSection>

          {/* =================================================
              AFFECTED AREAS
          ================================================== */}
          <ResultSection
            icon={GitBranch}
            iconClass="text-blue-400"
            title="Affected Areas"
            count={affectedFiles.length}
            empty="No affected files were established from the repository evidence."
          >
            <div className="divide-y divide-white/5">
              {affectedFiles.map((file, index) => {
                const normalized = normalizeAffectedFile(file);

                return (
                  <div
                    key={`${normalized.path}-${index}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0">
                      <FileCode2 size={14} className="text-gray-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">
                        {normalized.name}
                      </p>

                      {normalized.path &&
                        normalized.path !== normalized.name && (
                          <p className="text-[10px] text-gray-700 truncate mt-1">
                            {normalized.path}
                          </p>
                        )}
                    </div>

                    {normalized.impact && (
                      <span
                        className={`shrink-0 text-[10px] px-2 py-1 rounded-md ${
                          normalized.impact.toUpperCase() === "DIRECT"
                            ? "text-orange-300 bg-orange-500/10 border border-orange-500/10"
                            : "text-gray-500 bg-white/[0.03] border border-white/5"
                        }`}
                      >
                        {normalized.impact}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </ResultSection>

          {/* =================================================
              DEPENDENCIES / SYMBOLS
          ================================================== */}
          <ResultSection
            icon={FileCode2}
            iconClass="text-blue-400"
            title="Affected Symbols"
            count={affectedSymbols.length}
            empty="No specific affected symbols were established."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {affectedSymbols.map((symbol, index) => {
                const normalized = normalizeSymbol(symbol);

                return (
                  <div
                    key={`${normalized.name}-${index}`}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <FileCode2 size={13} className="text-gray-600" />

                      <p className="text-xs text-gray-300 truncate">
                        {normalized.name}
                      </p>

                      {normalized.type && (
                        <span className="text-[9px] text-gray-700 ml-auto">
                          {normalized.type}
                        </span>
                      )}
                    </div>

                    {normalized.file && (
                      <p className="text-[10px] text-gray-700 truncate mt-1.5">
                        {normalized.file}
                        {normalized.line ? `:${normalized.line}` : ""}
                      </p>
                    )}

                    {normalized.impact && (
                      <p className="text-[9px] text-gray-600 mt-1">
                        {normalized.impact}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </ResultSection>

          {/* =================================================
              RISKS + UNKNOWNS
          ================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ResultSection
              icon={AlertTriangle}
              iconClass="text-yellow-400"
              title="Risks"
              count={risks.length}
              empty="No specific risks were identified."
            >
              <div className="space-y-2">
                {risks.map((risk, index) => (
                  <ListItem
                    key={index}
                    icon={AlertTriangle}
                    iconClass="text-yellow-500"
                    text={formatValue(risk)}
                  />
                ))}
              </div>
            </ResultSection>

            <ResultSection
              icon={HelpCircle}
              iconClass="text-gray-500"
              title="Unknown / Insufficient Evidence"
              count={unknowns.length}
              empty="No important unknowns were reported."
            >
              <div className="space-y-2">
                {unknowns.map((unknown, index) => (
                  <ListItem
                    key={index}
                    icon={HelpCircle}
                    iconClass="text-gray-600"
                    text={formatValue(unknown)}
                  />
                ))}
              </div>
            </ResultSection>
          </div>

          {/* =================================================
              EVIDENCE
          ================================================== */}
          <section className="bg-[#0c1016] border border-white/10 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />

                <p className="text-xs font-medium text-gray-400">
                  Repository evidence
                </p>
              </div>

              <div className="text-[10px] text-gray-700">
                {result.context?.files?.length || 0} files
                {" • "}
                {result.context?.symbols?.length || 0} symbols
                {" • "}
                {result.context?.relationships?.length || 0} relationships
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function ResultSection({
  icon: Icon,
  iconClass = "text-gray-400",
  title,
  count,
  empty,
  children,
}) {
  return (
    <section className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={15} className={iconClass} />

          <p className="text-xs font-medium text-gray-400">{title}</p>
        </div>

        {count > 0 && (
          <span className="text-[10px] text-gray-700">{count}</span>
        )}
      </div>

      <div className="p-4">
        {count > 0 ? (
          children
        ) : (
          <p className="text-[11px] text-gray-700 text-center py-3">{empty}</p>
        )}
      </div>
    </section>
  );
}

function ListItem({ icon: Icon, iconClass = "text-gray-600", text }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
      <Icon size={13} className={`${iconClass} mt-0.5 shrink-0`} />

      <p className="text-[11px] text-gray-500 leading-5">{text}</p>
    </div>
  );
}

function ConfidenceCard({ confidence }) {
  const normalized = String(confidence || "LOW").toUpperCase();

  const config = {
    HIGH: {
      label: "High",
      text: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      icon: CheckCircle2,
    },
    MEDIUM: {
      label: "Medium",
      text: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: AlertCircle,
    },
    LOW: {
      label: "Low",
      text: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      icon: AlertTriangle,
    },
  };

  const current = config[normalized] || config.LOW;
  const Icon = current.icon;

  return (
    <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-5">
      <p className="text-[10px] text-gray-600 uppercase tracking-wider">
        Analysis confidence
      </p>

      <div className="flex items-center gap-3 mt-5">
        <div
          className={`w-10 h-10 rounded-xl ${current.bg} ${current.border} border flex items-center justify-center`}
        >
          <Icon size={18} className={current.text} />
        </div>

        <div>
          <p className="text-[10px] text-gray-600">Repository evidence</p>

          <p className={`text-lg font-semibold ${current.text}`}>
            {current.label}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   NORMALIZERS
========================================================= */

function normalizeAffectedFile(file) {
  if (typeof file === "string") {
    return {
      name: file.split("/").pop() || file,
      path: file,
      impact: "",
    };
  }

  const path = file?.path || file?.filePath || file?.file || "";

  return {
    name: file?.name || path.split("/").pop() || "Unknown file",
    path,
    impact: file?.impact || file?.type || "",
  };
}

function normalizeSymbol(symbol) {
  if (typeof symbol === "string") {
    return {
      name: symbol,
      type: "",
      file: "",
      line: "",
      impact: "",
    };
  }

  return {
    name: symbol?.symbol || symbol?.name || "Unknown symbol",
    type: symbol?.type || "",
    file: symbol?.file || symbol?.filePath || symbol?.path || "",
    line: symbol?.line || "",
    impact: symbol?.impact || "",
  };
}

function formatValue(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value == null) {
    return "";
  }

  if (typeof value === "object") {
    return (
      value.message ||
      value.description ||
      value.reason ||
      value.summary ||
      JSON.stringify(value)
    );
  }

  return String(value);
}

export default WhatIf;

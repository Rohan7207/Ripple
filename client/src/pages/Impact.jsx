import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  GitBranch,
  Search,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  FileCode2,
  ArrowRight,
  RefreshCw,
  Zap,
  Network,
  Loader2,
} from "lucide-react";

import { analyzeRepositoryImpact } from "../lib/api";

function Impact() {
  const { repositoryId } = useParams();

  const [target, setTarget] = useState("");
  const [search, setSearch] = useState("");
  const [impact, setImpact] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (event) => {
    event?.preventDefault();

    const trimmedTarget = target.trim();

    if (!trimmedTarget || isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setImpact(null);
    setSearch("");

    try {
      const result = await analyzeRepositoryImpact(repositoryId, trimmedTarget);

      setImpact(result);
    } catch (error) {
      console.error("Impact analysis failed:", error);

      setError(
        error?.message ||
          "Unable to generate impact analysis. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setTarget("");
    setSearch("");
    setImpact(null);
    setError("");
  };

  const result = impact?.result;

  const affectedFiles = Array.isArray(result?.affectedFiles)
    ? result.affectedFiles
    : [];

  const affectedSymbols = Array.isArray(result?.affectedSymbols)
    ? result.affectedSymbols
    : [];

  const relationships = Array.isArray(result?.relationships)
    ? result.relationships
    : [];

  const risks = Array.isArray(result?.risks) ? result.risks : [];

  const filteredFiles = affectedFiles.filter((file) => {
    const text =
      typeof file === "string"
        ? file
        : `${file?.path || ""} ${file?.filePath || ""} ${
            file?.file || ""
          } ${file?.name || ""}`;

    return text.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-[1300px] mx-auto min-h-[calc(100vh-10rem)] pb-8">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <GitBranch size={18} className="text-orange-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Impact Analysis</h1>

            <p className="text-sm text-gray-500 mt-0.5">
              Understand what could be affected by a code change.
            </p>
          </div>
        </div>

        {impact && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#0c1016] text-gray-500 hover:text-white hover:border-white/20 transition text-sm"
          >
            <RefreshCw size={14} />
            New Analysis
          </button>
        )}
      </div>

      {/* =====================================================
          TARGET INPUT
      ====================================================== */}
      <form
        onSubmit={handleAnalyze}
        className="bg-[#0c1016] border border-white/10 rounded-2xl p-4 mb-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap size={15} className="text-orange-400" />

          <p className="text-xs font-medium text-gray-400">
            What do you want to change?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="e.g. Change authentication flow"
            disabled={isAnalyzing}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 placeholder-gray-700 outline-none focus:border-orange-500/30 transition disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!target.trim() || isAnalyzing}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 hover:bg-orange-500/15 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                Analyze Impact
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {error && !isAnalyzing && (
          <div className="min-h-[430px] flex items-center justify-center bg-[#0c1016] border border-red-500/10 rounded-2xl">
            <div className="text-center max-w-md px-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle size={22} className="text-red-400" />
              </div>

              <h2 className="text-sm font-semibold text-gray-300 mt-4">
                Impact analysis unavailable
              </h2>

              <p className="text-xs text-gray-600 leading-5 mt-2">{error}</p>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !target.trim()}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 transition disabled:opacity-40"
              >
                <RefreshCw size={13} />
                Try Again
              </button>
            </div>
          </div>
        )}
      </form>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {!impact && !isAnalyzing && !error && (
        <div className="min-h-[430px] flex items-center justify-center bg-[#0c1016] border border-white/10 rounded-2xl">
          <div className="text-center max-w-md px-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <GitBranch size={22} className="text-orange-400" />
            </div>

            <h2 className="text-sm font-semibold text-gray-300 mt-4">
              Analyze a proposed change
            </h2>

            <p className="text-xs text-gray-600 leading-5 mt-2">
              Describe the change you are considering and Ripple will identify
              affected files, relationships, risks, and confidence using
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
              size={25}
              className="mx-auto text-orange-400 animate-spin"
            />

            <p className="text-sm text-gray-400 mt-4">
              Analyzing repository impact...
            </p>

            <p className="text-xs text-gray-700 mt-1">
              Following deterministic repository relationships.
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          RESULTS
      ====================================================== */}
      {impact && result && !isAnalyzing && !error && (
        <div className="space-y-5">
          {/* =================================================
              SUMMARY
          ================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
            <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Zap size={17} className="text-orange-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                    Requested change
                  </p>

                  <p className="text-sm text-gray-300 mt-1 break-words">
                    {impact.target}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5">
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                  Impact summary
                </p>

                <p className="text-sm text-gray-400 leading-6 mt-2">
                  {result.summary || "No impact summary was returned."}
                </p>
              </div>
            </div>

            {/* Confidence */}
            <ConfidenceCard confidence={result.confidence} />
          </div>

          {/* =================================================
              AFFECTED FILES
          ================================================== */}
          <section className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Affected Files
                  </p>

                  <p className="text-[11px] text-gray-700 mt-1">
                    Files identified from repository evidence.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-600">
                    {affectedFiles.length} files
                  </span>

                  {affectedFiles.length > 0 && (
                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1.5">
                      <Search size={12} className="text-gray-700" />

                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Filter..."
                        className="w-24 bg-transparent outline-none text-[10px] text-gray-400 placeholder-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {filteredFiles.length > 0 ? (
              <div className="divide-y divide-white/5">
                {filteredFiles.map((file, index) => {
                  const normalized = normalizeAffectedFile(file);

                  return (
                    <div
                      key={`${normalized.path}-${index}`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition"
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
            ) : (
              <EmptySection message="No affected files identified." />
            )}
          </section>

          {/* =================================================
              RELATIONSHIPS + RISKS
          ================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Relationships */}
            <section className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Network size={15} className="text-blue-400" />

                  <p className="text-xs font-medium text-gray-400">
                    Relationships
                  </p>

                  <span className="text-[10px] text-gray-700 ml-auto">
                    {relationships.length}
                  </span>
                </div>
              </div>

              {relationships.length > 0 ? (
                <div className="p-3 space-y-1">
                  {relationships.map((relationship, index) => (
                    <RelationshipRow key={index} relationship={relationship} />
                  ))}
                </div>
              ) : (
                <EmptySection message="No relevant relationships identified." />
              )}
            </section>

            {/* Risks */}
            <section className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-yellow-400" />

                  <p className="text-xs font-medium text-gray-400">Risks</p>

                  <span className="text-[10px] text-gray-700 ml-auto">
                    {risks.length}
                  </span>
                </div>
              </div>

              {risks.length > 0 ? (
                <div className="p-4 space-y-2">
                  {risks.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/[0.03] border border-yellow-500/10"
                    >
                      <AlertTriangle
                        size={13}
                        className="text-yellow-500 mt-0.5 shrink-0"
                      />

                      <p className="text-[11px] text-gray-500 leading-5">
                        {formatValue(risk)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptySection message="No specific risks identified." />
              )}
            </section>
          </div>

          {/* =================================================
              SYMBOLS
          ================================================== */}
          {affectedSymbols.length > 0 && (
            <section className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileCode2 size={15} className="text-purple-400" />

                  <p className="text-xs font-medium text-gray-400">
                    Affected Symbols
                  </p>

                  <span className="text-[10px] text-gray-700 ml-auto">
                    {affectedSymbols.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 p-4">
                {affectedSymbols.map((symbol, index) => (
                  <div
                    key={`${symbol?.name || "symbol"}-${index}`}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <p className="text-xs text-gray-300 truncate">
                      {symbol?.name || formatValue(symbol)}
                    </p>

                    {symbol?.filePath && (
                      <p className="text-[10px] text-gray-700 truncate mt-1">
                        {symbol.filePath}
                        {symbol.line ? `:${symbol.line}` : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

/*
 * Confidence card.
 */
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
    <div
      className={`bg-[#0c1016] border border-white/10 rounded-2xl p-5 flex flex-col justify-between`}
    >
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

/*
 * Relationship row.
 */
function RelationshipRow({ relationship }) {
  if (typeof relationship === "string") {
    return (
      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
        <p className="text-[11px] text-gray-400">{relationship}</p>
      </div>
    );
  }

  const from = relationship?.from || relationship?.source || "Unknown";

  const to = relationship?.to || relationship?.target || "Unknown";

  const type = relationship?.type || relationship?.relationship || "";

  return (
    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[11px] text-gray-300 truncate">{from}</span>

        <ArrowRight size={12} className="text-gray-700 shrink-0" />

        <span className="text-[11px] text-gray-300 truncate">{to}</span>
      </div>

      {type && <p className="text-[9px] text-gray-600 mt-1">{type}</p>}
    </div>
  );
}

/*
 * Normalize different possible AI affected-file shapes.
 */
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

/*
 * Format AI values safely.
 */
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
      value.summary ||
      JSON.stringify(value)
    );
  }

  return String(value);
}

/*
 * Empty section state.
 */
function EmptySection({ message }) {
  return (
    <div className="p-6 text-center">
      <p className="text-[11px] text-gray-700">{message}</p>
    </div>
  );
}

export default Impact;

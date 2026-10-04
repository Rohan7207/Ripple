import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Code2,
  FileCode2,
  Folder,
  GitBranch,
  Package,
  Sparkles,
} from "lucide-react";

import { getRepository } from "../lib/api";

function Overview() {
  const { repositoryId } = useParams();

  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRepository = async () => {
    if (!repositoryId) {
      setError("No repository was provided.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getRepository(repositoryId);
      setRepository(data);
    } catch (err) {
      console.error("Failed to load repository:", err);
      setError(err.message || "Failed to load repository.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepository();
  }, [repositoryId]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0c1016] border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-400" />

            <div>
              <h2 className="text-sm font-medium text-gray-200">
                Unable to load repository
              </h2>

              <p className="text-xs text-gray-500 mt-1">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadRepository}
            className="mt-4 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-gray-300 hover:bg-white/[0.08] transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  function getTopLevelDirectories(directories, files) {
    const seen = new Map();

    for (const directory of directories) {
      const path =
        typeof directory === "string"
          ? directory
          : directory?.path || directory?.name;

      if (!path) continue;

      const normalized = path.replaceAll("\\", "/");
      const parts = normalized.split("/").filter(Boolean);

      if (!parts.length) continue;

      const name = parts[0];

      if (!seen.has(name)) {
        seen.set(name, {
          name,
          files: 0,
        });
      }
    }

    for (const file of files) {
      const path =
        typeof file === "string" ? file : file?.path || file?.relativePath;

      if (!path) continue;

      const normalized = path.replaceAll("\\", "/");
      const parts = normalized.split("/").filter(Boolean);

      if (parts.length < 2) continue;

      const name = parts[0];

      if (!seen.has(name)) {
        seen.set(name, {
          name,
          files: 0,
        });
      }

      seen.get(name).files += 1;
    }

    return Array.from(seen.values()).slice(0, 6);
  }

  const analysis = repository?.analysis || {};
  const statistics = analysis.statistics || {};
  const analysisInfo = analysis.analysis || {};

  const files = repository?.files || [];
  const directories = repository?.directories || [];
  const languages = analysis.languages || [];
  const warnings = analysisInfo.warnings || [];

  const fileCount =
    statistics.files ?? repository?.totalFiles ?? files.length ?? 0;
  const symbolCount = statistics.symbols ?? 0;
  const relationshipCount = statistics.relationships ?? 0;
  const languageCount = languages.length;

  const topLevelDirectories = getTopLevelDirectories(directories, files);

  const displayLanguages = languages.slice(0, 8);

  const repositoryName =
    repository?.name ||
    repository?.url?.split("/").filter(Boolean).pop()?.replace(".git", "") ||
    repository?.id ||
    "Repository";

  const sourceLabel = repository?.source === "github" ? "GitHub" : "ZIP";

  const isReady = repository?.status === "READY";

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Repository Header */}
      <div className="bg-[#0c1016] border border-white/10 rounded-xl px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <GitBranch size={19} className="text-blue-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-gray-100 truncate">
                  {repositoryName}
                </h1>

                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  {sourceLabel}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] border ${
                    isReady
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {isReady
                    ? "Analysis Complete"
                    : repository?.status || "Processing"}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1 truncate">
                {repository?.url || repository?.id}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <p className="text-[10px] text-gray-600 uppercase tracking-wide">
              Repository ID
            </p>

            <p className="text-xs text-gray-400 mt-1">{repository?.id}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={FileCode2}
          label="Files"
          value={fileCount}
          description="Discovered"
        />

        <StatCard
          icon={Code2}
          label="Symbols"
          value={symbolCount}
          description="Functions & classes"
        />

        <StatCard
          icon={Package}
          label="Languages"
          value={languageCount}
          description="Detected"
        />
      </div>

      {/* Analysis Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Languages */}
        <section className="lg:col-span-2 bg-[#0c1016] border border-white/10 rounded-xl p-4">
          <SectionHeader
            icon={Code2}
            title="Language Distribution"
            description="Languages detected in the repository"
          />

          {displayLanguages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
              {displayLanguages.map((language) => {
                const name =
                  typeof language === "string"
                    ? language
                    : language?.name || "Unknown";

                return (
                  <div
                    key={name}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/5"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-400" />

                    <span className="text-xs text-gray-300 truncate">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyText text="No languages detected." />
          )}
        </section>

        {/* Health */}
        <section className="bg-[#0c1016] border border-white/10 rounded-xl p-4">
          <SectionHeader
            icon={Activity}
            title="Analysis Health"
            description="Structural analysis status"
          />

          <div className="grid grid-cols-2 gap-2 mt-4">
            <HealthItem
              label="Coverage"
              value={analysisInfo.coverage || "UNKNOWN"}
              success={analysisInfo.coverage === "FULL"}
            />

            <HealthItem
              label="Warnings"
              value={warnings.length}
              warning={warnings.length > 0}
            />

            <HealthItem label="Files" value={fileCount} />

            <HealthItem label="Symbols" value={symbolCount} />
          </div>
        </section>
      </div>

      {/* Repository Structure */}
      <section className="bg-[#0c1016] border border-white/10 rounded-xl p-4">
        <SectionHeader
          icon={Folder}
          title="Repository Structure"
          description="Top-level areas discovered during ingestion"
        />

        {topLevelDirectories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
            {topLevelDirectories.map((directory) => (
              <div
                key={directory.name}
                className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/[0.025] border border-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Folder size={15} className="text-blue-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-300 truncate">
                    {directory.name}
                  </p>

                  <p className="text-[10px] text-gray-600 mt-0.5">
                    {directory.files > 0
                      ? `${directory.files} files`
                      : "Directory"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyText text="No directory structure available." />
        )}
      </section>

      {/* Ripple Analysis */}
      <div>
        <section className="bg-[#0c1016] border border-white/10 rounded-xl p-4">
          <SectionHeader
            icon={Sparkles}
            title="Ripple Analysis"
            description="Repository facts from structural analysis"
          />

          <div className="space-y-2 mt-4">
            <FactRow
              label="Analysis coverage"
              value={analysisInfo.coverage || "UNKNOWN"}
            />

            <FactRow label="Detected languages" value={languageCount} />

            <FactRow label="Symbols discovered" value={symbolCount} />

            <FactRow label="Relationships detected" value={relationshipCount} />

            <FactRow
              label="Warnings"
              value={warnings.length}
              warning={warnings.length > 0}
            />
          </div>

          <div className="mt-3 px-3 py-2.5 rounded-lg bg-purple-500/5 border border-purple-500/10">
            <p className="text-[10px] text-purple-400">AI reasoning</p>

            <p className="text-[11px] text-gray-500 mt-1">
              AI insights will appear when repository reasoning is connected.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="bg-[#0c1016] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
          <Icon size={16} className="text-gray-400" />
        </div>

        <span className="text-[10px] text-gray-600">{description}</span>
      </div>

      <p className="text-2xl font-bold text-gray-100 mt-3">{value}</p>

      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-blue-400" />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-gray-200">{title}</h2>

        <p className="text-[10px] text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function HealthItem({ label, value, success, warning }) {
  return (
    <div className="px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/5">
      <p className="text-[10px] text-gray-600">{label}</p>

      <p
        className={`text-sm font-medium mt-1 ${
          success
            ? "text-green-400"
            : warning
              ? "text-yellow-400"
              : "text-gray-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FactRow({ label, value, warning }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5">
      <span className="text-xs text-gray-500">{label}</span>

      <span
        className={`text-xs font-medium ${
          warning ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyText({ text }) {
  return <p className="text-xs text-gray-600 mt-4">{text}</p>;
}

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-pulse">
      <div className="h-20 rounded-xl bg-white/[0.03] border border-white/5" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 rounded-xl bg-white/[0.03] border border-white/5"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-52 rounded-xl bg-white/[0.03] border border-white/5" />
        <div className="h-52 rounded-xl bg-white/[0.03] border border-white/5" />
      </div>

      <div className="h-40 rounded-xl bg-white/[0.03] border border-white/5" />
    </div>
  );
}

export default Overview;

import RippleLogo from "../components/RippleLogo";
import {
  GitBranch,
  FileCode2,
  Boxes,
  Package,
  Activity,
  ArrowUpRight,
  Folder,
  Code2,
  Database,
  Server,
  Sparkles,
} from "lucide-react";

function Overview() {
  const stats = [
    {
      label: "Files",
      value: "128",
      icon: FileCode2,
      change: "+12 this analysis",
    },
    {
      label: "Functions",
      value: "342",
      icon: Code2,
      change: "Across 31 files",
    },
    {
      label: "Components",
      value: "48",
      icon: Boxes,
      change: "React components",
    },
    {
      label: "Dependencies",
      value: "24",
      icon: Package,
      change: "18 production",
    },
  ];

  const languages = [
    { name: "JavaScript", percentage: 62 },
    { name: "CSS", percentage: 18 },
    { name: "HTML", percentage: 11 },
    { name: "JSON", percentage: 6 },
    { name: "Other", percentage: 3 },
  ];

  const modules = [
    {
      name: "src",
      description: "Main application source code",
      files: 64,
      icon: Folder,
    },
    {
      name: "components",
      description: "Reusable React components",
      files: 28,
      icon: Boxes,
    },
    {
      name: "services",
      description: "API and business logic",
      files: 17,
      icon: Server,
    },
    {
      name: "utils",
      description: "Shared utilities and helpers",
      files: 12,
      icon: Activity,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Repository Header */}
      <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <GitBranch size={24} className="text-blue-400" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold">
                  ripple-demo
                </h1>

                <span className="px-2.5 py-1 rounded-full text-xs bg-green-500/10 border border-green-500/20 text-green-400">
                  Analysis Complete
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                github.com/user/ripple-demo
              </p>
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs text-gray-500">
              Last analyzed
            </p>
            <p className="text-sm text-gray-300 mt-1">
              Just now
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-[#0c1016] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                  <Icon size={19} className="text-gray-400" />
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-gray-600"
                />
              </div>

              <p className="text-3xl font-bold mt-5">
                {stat.value}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {stat.label}
              </p>

              <p className="text-xs text-gray-600 mt-3">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Languages */}
        <div className="xl:col-span-2 bg-[#0c1016] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold">
                Language Distribution
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Languages detected across the repository
              </p>
            </div>

            <Code2 size={20} className="text-gray-500" />
          </div>

          <div className="space-y-5">
            {languages.map((language) => (
              <div key={language.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">
                    {language.name}
                  </span>

                  <span className="text-xs text-gray-500">
                    {language.percentage}%
                  </span>
                </div>

                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${language.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repository Health */}
        <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Activity
                size={18}
                className="text-green-400"
              />
            </div>

            <div>
              <h2 className="font-semibold">
                Repository Health
              </h2>
              <p className="text-xs text-gray-500">
                Overall analysis
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center py-4">
            <div className="w-32 h-32 rounded-full border-8 border-green-500/20 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">
                  87
                </p>
                <p className="text-xs text-gray-500">
                  / 100
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm font-medium">
              Good structure
            </p>

            <p className="text-xs text-gray-600 mt-1">
              A few areas could be improved
            </p>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold">
              Architecture Overview
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              High-level structure detected by Ripple
            </p>
          </div>

          <NetworkIcon />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ArchitectureNode
            icon={Folder}
            title="Frontend"
            description="React UI"
          />

          <ArchitectureArrow />

          <ArchitectureNode
            icon={Server}
            title="API Layer"
            description="REST services"
          />

          <ArchitectureArrow />

          <ArchitectureNode
            icon={Database}
            title="Database"
            description="Data storage"
          />
        </div>
      </div>

      {/* Modules + AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Modules */}
        <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="font-semibold">
              Key Modules
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Important areas of the repository
            </p>
          </div>

          <div className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Icon
                      size={18}
                      className="text-blue-400"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {module.name}
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      {module.description}
                    </p>
                  </div>

                  <span className="text-xs text-gray-500">
                    {module.files} files
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Sparkles
                size={19}
                className="text-purple-400"
              />
            </div>

            <div>
              <h2 className="font-semibold">
                Ripple Insights
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                AI-generated repository observations
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Insight
              title="Centralized API layer"
              description="Most external communication is handled through a dedicated service layer."
            />

            <Insight
              title="Reusable components"
              description="The frontend contains a strong collection of reusable UI components."
            />

            <Insight
              title="Dependency concentration"
              description="Several core modules depend on a small number of shared utilities."
            />

            <Insight
              title="Potential improvement"
              description="Some modules could be separated further to reduce coupling."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NetworkIcon() {
  return (
    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
      <GitBranch size={18} className="text-blue-400" />
    </div>
  );
}

function ArchitectureNode({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
        <Icon size={18} className="text-blue-400" />
      </div>

      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="text-xs text-gray-600 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}

function ArchitectureArrow() {
  return (
    <div className="hidden md:flex items-center justify-center text-gray-600">
      →
    </div>
  );
}

function Insight({ title, description }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <p className="text-sm font-medium text-gray-200">
        {title}
      </p>

      <p className="text-xs text-gray-500 mt-1.5 leading-5">
        {description}
      </p>
    </div>
  );
}

export default Overview;
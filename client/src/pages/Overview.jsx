import {
  FileCode2,
  FolderTree,
  Network,
  GitBranch,
  ArrowUpRight,
} from "lucide-react";

function Overview() {
  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-8">

        <p className="text-sm text-blue-400">
          Repository overview
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Understand your codebase
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Explore repository structure, architecture and dependencies.
        </p>

      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Stat
          icon={FileCode2}
          label="Files"
          value="128"
        />

        <Stat
          icon={FolderTree}
          label="Directories"
          value="24"
        />

        <Stat
          icon={Network}
          label="Dependencies"
          value="86"
        />

        <Stat
          icon={GitBranch}
          label="Modules"
          value="17"
        />

      </div>

      {/* Main cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        <div className="rounded-2xl border border-white/5 bg-[#080b11] p-6 lg:col-span-2">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-semibold">
                Repository structure
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                High-level breakdown
              </p>
            </div>

            <button className="text-slate-600 transition hover:text-white">
              <ArrowUpRight size={18} />
            </button>

          </div>

          <div className="mt-8 space-y-4">

            <Progress
              label="JavaScript / JSX"
              value="68%"
              width="68%"
            />

            <Progress
              label="CSS / Tailwind"
              value="18%"
              width="18%"
            />

            <Progress
              label="JSON"
              value="8%"
              width="8%"
            />

            <Progress
              label="Other"
              value="6%"
              width="6%"
            />

          </div>

        </div>

        <div className="rounded-2xl border border-white/5 bg-[#080b11] p-6">

          <h2 className="font-semibold">
            Quick actions
          </h2>

          <div className="mt-5 space-y-2">

            <QuickAction
              icon={Network}
              title="View architecture"
            />

            <QuickAction
              icon={FileCode2}
              title="Browse files"
            />

            <QuickAction
              icon={GitBranch}
              title="Ask Ripple"
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#080b11] p-5">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        <Icon size={18} />
      </div>

      <p className="mt-5 text-xs text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

function Progress({ label, value, width }) {
  return (
    <div>

      <div className="mb-2 flex justify-between text-xs">

        <span className="text-slate-400">
          {label}
        </span>

        <span className="font-mono text-slate-600">
          {value}
        </span>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">

        <div
          className="h-full rounded-full bg-blue-500"
          style={{ width }}
        />

      </div>

    </div>
  );
}

function QuickAction({ icon: Icon, title }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-blue-500/20 hover:bg-blue-500/5">

      <Icon size={17} className="text-blue-400" />

      <span className="text-sm">
        {title}
      </span>

    </button>
  );
}

export default Overview;
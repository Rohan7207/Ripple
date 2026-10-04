import { GitCompare, Search } from "lucide-react";

function Impact() {
  return (
    <div className="mx-auto max-w-6xl">

      <h1 className="text-3xl font-bold">
        Impact Analysis
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Find what could be affected by a code change.
      </p>

      <div className="mt-8 rounded-2xl border border-white/5 bg-[#080b11] p-6">

        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">

          <Search size={18} className="text-slate-500" />

          <input
            placeholder="Search for a file, function or component..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
          />

          <GitCompare size={18} className="text-blue-400" />

        </div>

        <div className="flex h-80 items-center justify-center">

          <p className="text-sm text-slate-600">
            Select a code element to analyze its impact.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Impact;
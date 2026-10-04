import { FlaskConical, ArrowRight } from "lucide-react";

function WhatIf() {
  return (
    <div className="mx-auto max-w-6xl">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <FlaskConical size={21} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            What-If Analysis
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Simulate architectural changes before making them.
          </p>
        </div>

      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">

        <div className="rounded-2xl border border-white/5 bg-[#080b11] p-6">

          <p className="text-sm font-medium">
            Proposed change
          </p>

          <textarea
            placeholder="What would happen if we remove the authentication service?"
            className="mt-4 h-48 w-full resize-none rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500/30"
          />

          <button className="mt-4 flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium hover:bg-violet-500">

            Analyze scenario

            <ArrowRight size={16} />

          </button>

        </div>

        <div className="rounded-2xl border border-white/5 bg-[#080b11] p-6">

          <p className="text-sm font-medium">
            Predicted impact
          </p>

          <div className="flex h-64 items-center justify-center text-sm text-slate-600">
            Scenario analysis will appear here.
          </div>

        </div>

      </div>

    </div>
  );
}

export default WhatIf;
import { Network } from "lucide-react";

function Architecture() {
  return (
    <div className="mx-auto max-w-7xl">

      <h1 className="text-3xl font-bold">
        Architecture
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Visualize how modules and services connect.
      </p>

      <div className="mt-8 flex h-[600px] items-center justify-center rounded-2xl border border-white/5 bg-[#080b11]">

        <div className="text-center">

          <Network
            size={45}
            className="mx-auto text-blue-400"
          />

          <p className="mt-4 font-medium">
            Architecture Graph
          </p>

          <p className="mt-2 text-sm text-slate-600">
            React Flow graph will appear here.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Architecture;
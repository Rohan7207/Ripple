import { NavLink, Outlet, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  FolderTree,
  Network,
  MessageSquare,
  GitBranch,
  WandSparkles,
  ChevronLeft,
  Search,
} from "lucide-react";

import RippleLogo from "./RippleLogo";

function Workspace() {
  const { repositoryId } = useParams();

  const navigation = [
    {
      name: "Overview",
      path: "overview",
      icon: LayoutDashboard,
    },
    {
      name: "Files",
      path: "files",
      icon: FolderTree,
    },
    {
      name: "Architecture",
      path: "architecture",
      icon: Network,
    },
    {
      name: "Ask Ripple",
      path: "ask",
      icon: MessageSquare,
    },
    {
      name: "Impact Analysis",
      path: "impact",
      icon: GitBranch,
    },
    {
      name: "What-If Analysis",
      path: "what-if",
      icon: WandSparkles,
    },
  ];

  const repoName = repositoryId || "demo-repository";

  return (
    <div className="min-h-screen bg-[#07090c] text-white flex overflow-hidden">
      {/* =========================================================
          BACKGROUND GRID
      ========================================================== */}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* =========================================================
          AMBIENT GLOW
      ========================================================== */}

      <div className="fixed top-0 left-0 w-[450px] h-[450px] bg-cyan-500/[0.025] blur-[130px] rounded-full pointer-events-none" />

      {/* =========================================================
          SIDEBAR
      ========================================================== */}

      <aside className="relative z-20 w-64 min-h-screen border-r border-white/[0.08] bg-[#090c10]/95 backdrop-blur-xl flex flex-col">
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-white/[0.08]">
          <RippleLogo size="md" />
        </div>

        {/* Repository */}
        <div className="px-4 py-5 border-b border-white/[0.08]">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.18em] mb-2 px-2">
            Repository
          </p>

          <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 py-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />

              <p className="text-sm font-medium text-slate-200 truncate">
                {repoName}
              </p>
            </div>

            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />

              <p className="text-[11px] text-green-400">
                Analysis complete
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.18em] px-3 mb-3">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={`/workspace/${repoName}/${item.path}`}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-400/[0.08] text-cyan-300 border border-cyan-400/[0.12]"
                        : "text-slate-500 border border-transparent hover:text-slate-200 hover:bg-white/[0.035]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      )}

                      <Icon
                        size={17}
                        strokeWidth={1.7}
                        className={
                          isActive
                            ? "text-cyan-400"
                            : "text-slate-600 group-hover:text-slate-300"
                        }
                      />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.08]">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-200 hover:bg-white/[0.035] transition-all"
          >
            <ChevronLeft size={17} />

            <span>Back to Home</span>
          </NavLink>
        </div>
      </aside>

      {/* =========================================================
          MAIN AREA
      ========================================================== */}

      <main className="relative z-10 flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-20 flex-shrink-0 border-b border-white/[0.08] bg-[#080b0f]/90 backdrop-blur-xl flex items-center justify-between px-8">
          {/* Page title */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-100">
                Repository Workspace
              </h2>

              <span className="px-2 py-0.5 rounded border border-green-400/10 bg-green-400/[0.06] text-[9px] uppercase tracking-wider text-green-400">
                Live
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1">
              Explore and understand your codebase
            </p>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[#0b0e12] border border-white/[0.08] rounded-lg px-3.5 py-2.5 w-72 focus-within:border-cyan-400/30 transition-colors">
            <Search size={16} className="text-slate-600" />

            <input
              type="text"
              placeholder="Search repository..."
              className="bg-transparent outline-none text-sm text-slate-300 placeholder:text-slate-700 w-full"
            />

            <span className="text-[9px] font-mono text-slate-700 border border-white/[0.06] rounded px-1.5 py-0.5">
              Ctrl K
            </span>
          </div>
        </header>

        {/* Content */}
        <section className="relative flex-1 p-5 md:p-7 lg:p-8 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default Workspace;
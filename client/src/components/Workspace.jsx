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

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 min-h-screen border-r border-white/10 bg-[#0b0e13] flex flex-col">

        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mr-3">
            <GitBranch size={20} className="text-blue-400" />
          </div>

          <div>
            <h1 className="font-bold text-lg">
              Ripple
            </h1>

            <p className="text-xs text-gray-500">
              Repository Intelligence
            </p>
          </div>
        </div>

        {/* Repository */}
        <div className="px-4 py-5 border-b border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Repository
          </p>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-3">
            <p className="text-sm font-medium truncate">
              {repositoryId || "demo-repository"}
            </p>

            <p className="text-xs text-green-400 mt-1">
              ● Analysis complete
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">

          <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-3">
            Workspace
          </p>

          <div className="space-y-1">

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={`/workspace/${repositoryId || "demo"}/${item.path}`}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-sm transition-all
                    ${
                      isActive
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                    `
                  }
                >
                  <Icon size={18} />

                  <span>
                    {item.name}
                  </span>
                </NavLink>
              );
            })}

          </div>
        </nav>

        {/* Back */}
        <div className="p-4 border-t border-white/10">

          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ChevronLeft size={18} />

            Back to Home
          </NavLink>

        </div>

      </aside>

      {/* ================= MAIN AREA ================= */}
      <main className="flex-1 min-w-0">

        {/* Header */}
        <header className="h-20 border-b border-white/10 bg-[#080b10] flex items-center justify-between px-8">

          <div>
            <h2 className="text-lg font-semibold">
              Repository Workspace
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Explore and understand your codebase
            </p>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 w-72">
            <Search
              size={17}
              className="text-gray-500"
            />

            <input
              type="text"
              placeholder="Search repository..."
              className="bg-transparent outline-none text-sm text-white placeholder-gray-600 w-full"
            />
          </div>

        </header>

        {/* Page Content */}
        <section className="p-8">

          <Outlet />

        </section>

      </main>

    </div>
  );
}

export default Workspace;
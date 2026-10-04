import RippleLogo from "../components/RippleLogo";
import { useState } from "react";
import {
  GitBranch,
  Search,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  FileCode2,
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Network,
  RefreshCw,
  Zap,
} from "lucide-react";

function Impact() {
  const [selectedFile, setSelectedFile] =
    useState("authController.js");

  const [search, setSearch] = useState("");

  /*
   * Demo impact data.
   *
   * Later this will come from:
   *
   * POST /api/repositories/:repositoryId/impact
   */
  const impactData = {
    "authController.js": {
      path: "src/controllers/authController.js",
      description:
        "Handles authentication requests and coordinates the authentication service.",
      severity: "High",
      severityColor: "red",
      direct: 3,
      indirect: 4,
      total: 7,
      affected: [
        {
          name: "authService.js",
          path: "src/services/authService.js",
          type: "Direct",
          severity: "High",
        },
        {
          name: "userRoutes.js",
          path: "src/routes/userRoutes.js",
          type: "Direct",
          severity: "High",
        },
        {
          name: "auth.js",
          path: "src/middleware/auth.js",
          type: "Direct",
          severity: "High",
        },
        {
          name: "userModel.js",
          path: "src/models/userModel.js",
          type: "Indirect",
          severity: "Medium",
        },
        {
          name: "profileController.js",
          path: "src/controllers/profileController.js",
          type: "Indirect",
          severity: "Medium",
        },
        {
          name: "dashboard.jsx",
          path: "client/src/pages/dashboard.jsx",
          type: "Indirect",
          severity: "Low",
        },
        {
          name: "settings.jsx",
          path: "client/src/pages/settings.jsx",
          type: "Indirect",
          severity: "Low",
        },
      ],
    },

    "authService.js": {
      path: "src/services/authService.js",
      description:
        "Contains the core authentication and token validation logic.",
      severity: "High",
      severityColor: "red",
      direct: 2,
      indirect: 5,
      total: 7,
      affected: [
        {
          name: "authController.js",
          path: "src/controllers/authController.js",
          type: "Direct",
          severity: "High",
        },
        {
          name: "auth.js",
          path: "src/middleware/auth.js",
          type: "Direct",
          severity: "High",
        },
        {
          name: "userModel.js",
          path: "src/models/userModel.js",
          type: "Indirect",
          severity: "Medium",
        },
        {
          name: "userRoutes.js",
          path: "src/routes/userRoutes.js",
          type: "Indirect",
          severity: "Medium",
        },
        {
          name: "profileController.js",
          path: "src/controllers/profileController.js",
          type: "Indirect",
          severity: "Medium",
        },
        {
          name: "dashboard.jsx",
          path: "client/src/pages/dashboard.jsx",
          type: "Indirect",
          severity: "Low",
        },
        {
          name: "login.jsx",
          path: "client/src/pages/login.jsx",
          type: "Indirect",
          severity: "Low",
        },
      ],
    },

    "userModel.js": {
      path: "src/models/userModel.js",
      description:
        "Defines the user data model used throughout the authentication and profile system.",
      severity: "Medium",
      severityColor: "yellow",
      direct: 2,
      indirect: 3,
      total: 5,
      affected: [
        {
          name: "authService.js",
          path: "src/services/authService.js",
          type: "Direct",
          severity: "Medium",
        },
        {
          name: "profileService.js",
          path: "src/services/profileService.js",
          type: "Direct",
          severity: "Medium",
        },
        {
          name: "authController.js",
          path: "src/controllers/authController.js",
          type: "Indirect",
          severity: "Low",
        },
        {
          name: "profileController.js",
          path: "src/controllers/profileController.js",
          type: "Indirect",
          severity: "Low",
        },
        {
          name: "dashboard.jsx",
          path: "client/src/pages/dashboard.jsx",
          type: "Indirect",
          severity: "Low",
        },
      ],
    },

    "userRoutes.js": {
      path: "src/routes/userRoutes.js",
      description:
        "Defines API endpoints related to user operations and authentication.",
      severity: "Medium",
      severityColor: "yellow",
      direct: 2,
      indirect: 2,
      total: 4,
      affected: [
        {
          name: "authController.js",
          path: "src/controllers/authController.js",
          type: "Direct",
          severity: "Medium",
        },
        {
          name: "profileController.js",
          path: "src/controllers/profileController.js",
          type: "Direct",
          severity: "Medium",
        },
        {
          name: "authService.js",
          path: "src/services/authService.js",
          type: "Indirect",
          severity: "Low",
        },
        {
          name: "userModel.js",
          path: "src/models/userModel.js",
          type: "Indirect",
          severity: "Low",
        },
      ],
    },

    "database.js": {
      path: "src/config/database.js",
      description:
        "Initializes and manages the application's database connection.",
      severity: "High",
      severityColor: "red",
      direct: 3,
      indirect: 6,
      total: 9,
      affected: [
        {
          name: "userModel.js",
          path: "src/models/userModel.js",
          type: "Direct",
          severity: "High",
        },
        {
          name: "productModel.js",
          path: "src/models/productModel.js",
          type: "Direct",
          severity: "High",
        },
        {
          name: "orderModel.js",
          path: "src/models/orderModel.js",
          type: "Direct",
          severity: "High",
        },
        {
          name: "authService.js",
          path: "src/services/authService.js",
          type: "Indirect",
          severity: "Medium",
        },
        {
          name: "productService.js",
          path: "src/services/productService.js",
          type: "Indirect",
          severity: "Medium",
        },
        {
          name: "orderService.js",
          path: "src/services/orderService.js",
          type: "Indirect",
          severity: "Medium",
        },
      ],
    },
  };

  const files = Object.keys(impactData);

  const currentImpact =
    impactData[selectedFile];

  /*
   * Filter files using search.
   */
  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(search.toLowerCase())
  );

  /*
   * Severity styles.
   */
  const getSeverityStyles = (severity) => {
    if (severity === "High") {
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        text: "text-red-400",
        dot: "bg-red-400",
      };
    }

    if (severity === "Medium") {
      return {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        text: "text-yellow-400",
        dot: "bg-yellow-400",
      };
    }

    return {
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      text: "text-green-400",
      dot: "bg-green-400",
    };
  };

  const severityStyles = getSeverityStyles(
    currentImpact.severity
  );

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-10rem)] min-h-[650px] flex flex-col">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <GitBranch
                size={18}
                className="text-orange-400"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Impact Analysis
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Understand what could be affected by a code change.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            setSelectedFile("authController.js")
          }
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#0c1016] text-gray-500 hover:text-white hover:border-white/20 transition text-sm"
        >
          <RefreshCw size={14} />
          Reset Analysis
        </button>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[260px_1fr_320px] gap-5">
        {/* ===================================================
            FILE SELECTOR
        ==================================================== */}
        <div className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Select file
            </p>

            <p className="text-xs text-gray-600 mt-1">
              Analyze downstream impact
            </p>

            {/* Search */}
            <div className="mt-4 flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2">
              <Search
                size={14}
                className="text-gray-600"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search files..."
                className="bg-transparent outline-none text-xs text-gray-300 placeholder-gray-700 w-full"
              />
            </div>
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredFiles.map((file) => {
              const data = impactData[file];

              const active =
                selectedFile === file;

              const styles = getSeverityStyles(
                data.severity
              );

              return (
                <button
                  key={file}
                  onClick={() =>
                    setSelectedFile(file)
                  }
                  className={`w-full text-left p-3 rounded-xl mb-1 transition ${
                    active
                      ? "bg-blue-500/10 border border-blue-500/20"
                      : "border border-transparent hover:bg-white/[0.03] hover:border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        active
                          ? "bg-blue-500/10"
                          : "bg-white/[0.03]"
                      }`}
                    >
                      <FileCode2
                        size={15}
                        className={
                          active
                            ? "text-blue-400"
                            : "text-gray-600"
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          active
                            ? "text-blue-300"
                            : "text-gray-400"
                        }`}
                      >
                        {file}
                      </p>

                      <p className="text-[10px] text-gray-700 mt-1 truncate">
                        {data.path}
                      </p>
                    </div>

                    <div
                      className={`w-2 h-2 rounded-full ${styles.dot}`}
                    />
                  </div>
                </button>
              );
            })}

            {filteredFiles.length === 0 && (
              <div className="p-5 text-center">
                <Search
                  size={20}
                  className="mx-auto text-gray-700"
                />

                <p className="text-xs text-gray-600 mt-2">
                  No files found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            IMPACT GRAPH
        ==================================================== */}
        <div className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          {/* Graph header */}
          <div className="h-[68px] shrink-0 px-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                Dependency Impact
              </p>

              <p className="text-xs text-gray-600 mt-1">
                {currentImpact.path}
              </p>
            </div>

            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${severityStyles.bg} ${severityStyles.border}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${severityStyles.dot}`}
              />

              <span
                className={`text-xs font-medium ${severityStyles.text}`}
              >
                {currentImpact.severity} Impact
              </span>
            </div>
          </div>

          {/* Graph */}
          <div className="flex-1 relative overflow-hidden">
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative h-full min-h-[580px] overflow-auto">
              <div className="relative min-w-[700px] min-h-[620px]">
                {/* =================================================
                    SVG CONNECTIONS
                ================================================== */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 700 620"
                >
                  <defs>
                    <marker
                      id="impact-arrow"
                      markerWidth="8"
                      markerHeight="8"
                      refX="7"
                      refY="3"
                      orient="auto"
                    >
                      <path
                        d="M0,0 L0,6 L7,3 z"
                        fill="#60a5fa"
                      />
                    </marker>
                  </defs>

                  {/* Main file → direct dependencies */}
                  <line
                    x1="220"
                    y1="300"
                    x2="380"
                    y2="170"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#impact-arrow)"
                  />

                  <line
                    x1="220"
                    y1="300"
                    x2="380"
                    y2="300"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#impact-arrow)"
                  />

                  <line
                    x1="220"
                    y1="300"
                    x2="380"
                    y2="430"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeLinecap="round"
                    markerEnd="url(#impact-arrow)"
                  />

                  {/* Direct → indirect */}
                  <line
                    x1="530"
                    y1="170"
                    x2="610"
                    y2="240"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    markerEnd="url(#impact-arrow)"
                  />

                  <line
                    x1="530"
                    y1="300"
                    x2="610"
                    y2="300"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    markerEnd="url(#impact-arrow)"
                  />

                  <line
                    x1="530"
                    y1="430"
                    x2="610"
                    y2="360"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    markerEnd="url(#impact-arrow)"
                  />
                </svg>

                {/* =================================================
                    CENTER SELECTED FILE
                ================================================== */}
                <div className="absolute left-[60px] top-[245px] w-[165px]">
                  <div className="relative rounded-xl bg-blue-500/10 border border-blue-500/40 p-4 shadow-[0_0_35px_rgba(59,130,246,0.12)]">
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-400 border-4 border-[#0c1016]" />

                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                      <FileCode2
                        size={17}
                        className="text-blue-400"
                      />
                    </div>

                    <p className="text-sm font-semibold text-white truncate">
                      {selectedFile}
                    </p>

                    <p className="text-[10px] text-gray-500 mt-1">
                      Selected file
                    </p>

                    <div className="mt-3 pt-3 border-t border-blue-500/10">
                      <span className="text-[10px] text-blue-400">
                        Source
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    DIRECT IMPACT NODES
                ================================================== */}
                {currentImpact.affected
                  .filter(
                    (item) => item.type === "Direct"
                  )
                  .slice(0, 3)
                  .map((item, index) => {
                    const positions = [
                      "top-[110px]",
                      "top-[240px]",
                      "top-[370px]",
                    ];

                    return (
                      <ImpactNode
                        key={item.name}
                        item={item}
                        position={`absolute left-[380px] ${positions[index]}`}
                        direct
                      />
                    );
                  })}

                {/* =================================================
                    INDIRECT IMPACT NODES
                ================================================== */}
                {currentImpact.affected
                  .filter(
                    (item) =>
                      item.type === "Indirect"
                  )
                  .slice(0, 3)
                  .map((item, index) => {
                    const positions = [
                      "top-[185px]",
                      "top-[300px]",
                      "top-[415px]",
                    ];

                    return (
                      <ImpactNode
                        key={item.name}
                        item={item}
                        position={`absolute left-[570px] ${positions[index]}`}
                        indirect
                      />
                    );
                  })}
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-[#080b10]/90 backdrop-blur border border-white/10 rounded-lg px-3 py-2">
              <span className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Selected
              </span>

              <span className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Direct
              </span>

              <span className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="w-2 h-2 rounded-full bg-gray-500" />
                Indirect
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            IMPACT DETAILS
        ==================================================== */}
        <div className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-y-auto">
          {/* Summary */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${severityStyles.bg} flex items-center justify-center`}
              >
                {currentImpact.severity ===
                "High" ? (
                  <AlertTriangle
                    size={19}
                    className="text-red-400"
                  />
                ) : (
                  <AlertCircle
                    size={19}
                    className="text-yellow-400"
                  />
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Impact level
                </p>

                <h2
                  className={`text-lg font-semibold ${severityStyles.text}`}
                >
                  {currentImpact.severity}
                </h2>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-5 mt-4">
              {currentImpact.description}
            </p>
          </div>

          {/* Stats */}
          <div className="p-5 border-b border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
              Impact summary
            </p>

            <div className="grid grid-cols-3 gap-2">
              <ImpactStat
                value={currentImpact.direct}
                label="Direct"
                color="orange"
              />

              <ImpactStat
                value={currentImpact.indirect}
                label="Indirect"
                color="yellow"
              />

              <ImpactStat
                value={currentImpact.total}
                label="Total"
                color="blue"
              />
            </div>
          </div>

          {/* Affected files */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Affected files
              </p>

              <span className="text-[10px] text-gray-700">
                {currentImpact.total} files
              </span>
            </div>

            <div className="space-y-2">
              {currentImpact.affected.map(
                (item) => {
                  const styles =
                    getSeverityStyles(
                      item.severity
                    );

                  return (
                    <div
                      key={`${item.name}-${item.type}`}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition"
                    >
                      <FileCode2
                        size={14}
                        className="text-gray-600 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 truncate group-hover:text-gray-200">
                          {item.name}
                        </p>

                        <p className="text-[10px] text-gray-700 truncate mt-1">
                          {item.type} impact
                        </p>
                      </div>

                      <div
                        className={`w-2 h-2 rounded-full ${styles.dot}`}
                      />

                      <ChevronRight
                        size={13}
                        className="text-gray-700"
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div className="mx-5 mb-5 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
            <div className="flex items-start gap-3">
              <Zap
                size={16}
                className="text-orange-400 mt-0.5 shrink-0"
              />

              <div>
                <p className="text-xs font-medium text-orange-300">
                  Recommendation
                </p>

                <p className="text-[11px] text-gray-600 leading-5 mt-1">
                  Review the directly affected files before
                  making this change. Indirect dependencies may
                  also require regression testing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Impact graph node.
 */
function ImpactNode({
  item,
  position,
  direct,
  indirect,
}) {
  return (
    <div
      className={`${position} w-[150px]`}
    >
      <div
        className={`rounded-xl p-3 border transition-all ${
          direct
            ? "bg-orange-500/5 border-orange-500/25 shadow-[0_0_20px_rgba(249,115,22,0.06)]"
            : "bg-white/[0.02] border-white/10"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              direct
                ? "bg-orange-500/10"
                : "bg-white/[0.04]"
            }`}
          >
            <FileCode2
              size={14}
              className={
                direct
                  ? "text-orange-400"
                  : "text-gray-500"
              }
            />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-gray-300 truncate">
              {item.name}
            </p>

            <p className="text-[9px] text-gray-600 mt-0.5">
              {direct ? "Direct" : "Indirect"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Impact statistic card.
 */
function ImpactStat({
  value,
  label,
  color,
}) {
  const colors = {
    orange: "text-orange-400",
    yellow: "text-yellow-400",
    blue: "text-blue-400",
  };

  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
      <p
        className={`text-xl font-bold ${colors[color]}`}
      >
        {value}
      </p>

      <p className="text-[10px] text-gray-600 mt-1">
        {label}
      </p>
    </div>
  );
}

export default Impact;
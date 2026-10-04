import RippleLogo from "../components/RippleLogo";
import { useState } from "react";
import {
  WandSparkles,
  FileCode2,
  Search,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  ShieldAlert,
  Zap,
  ChevronRight,
} from "lucide-react";

function WhatIf() {
  const [selectedFile, setSelectedFile] =
    useState("authService.js");

  const [changeType, setChangeType] =
    useState("modify");

  const [description, setDescription] =
    useState(
      "Change the authentication token validation logic"
    );

  const [search, setSearch] = useState("");

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [hasResult, setHasResult] =
    useState(false);

  const files = [
    {
      name: "authService.js",
      path: "src/services/authService.js",
    },
    {
      name: "authController.js",
      path: "src/controllers/authController.js",
    },
    {
      name: "userRoutes.js",
      path: "src/routes/userRoutes.js",
    },
    {
      name: "userModel.js",
      path: "src/models/userModel.js",
    },
    {
      name: "database.js",
      path: "src/config/database.js",
    },
  ];

  const simulations = {
    "authService.js": {
      modify: {
        risk: "High",
        riskText: "High Risk",
        riskDescription:
          "This change can affect authentication and multiple downstream modules.",
        affected: 7,
        direct: 3,
        indirect: 4,
        files: [
          {
            name: "authController.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "auth.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "userRoutes.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "userModel.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "profileController.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "dashboard.jsx",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      remove: {
        risk: "Critical",
        riskText: "Critical Risk",
        riskDescription:
          "Removing this module would break authentication dependencies across the application.",
        affected: 9,
        direct: 4,
        indirect: 5,
        files: [
          {
            name: "authController.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "auth.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "userRoutes.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "profileService.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "userModel.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "profileController.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "dashboard.jsx",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "settings.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      refactor: {
        risk: "Medium",
        riskText: "Medium Risk",
        riskDescription:
          "A controlled refactor should be safe if the existing service contract is preserved.",
        affected: 5,
        direct: 2,
        indirect: 3,
        files: [
          {
            name: "authController.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "auth.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "userRoutes.js",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "userModel.js",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      add: {
        risk: "Low",
        riskText: "Low Risk",
        riskDescription:
          "Adding functionality without changing the existing contract has limited impact.",
        affected: 3,
        direct: 1,
        indirect: 2,
        files: [
          {
            name: "authController.js",
            type: "Direct",
            level: "Low",
          },
          {
            name: "userRoutes.js",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },
    },

    "authController.js": {
      modify: {
        risk: "High",
        riskText: "High Risk",
        riskDescription:
          "Controller changes can alter API behavior consumed by multiple clients.",
        affected: 5,
        direct: 2,
        indirect: 3,
        files: [
          {
            name: "userRoutes.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "authService.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "auth.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "dashboard.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      remove: {
        risk: "Critical",
        riskText: "Critical Risk",
        riskDescription:
          "Removing this controller would break authentication API routes.",
        affected: 5,
        direct: 2,
        indirect: 3,
        files: [
          {
            name: "userRoutes.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "authService.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "auth.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "dashboard.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      refactor: {
        risk: "Medium",
        riskText: "Medium Risk",
        riskDescription:
          "The refactor is manageable if the controller's API contract remains unchanged.",
        affected: 4,
        direct: 2,
        indirect: 2,
        files: [
          {
            name: "userRoutes.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "authService.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "dashboard.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      add: {
        risk: "Low",
        riskText: "Low Risk",
        riskDescription:
          "A new controller capability can be isolated from existing functionality.",
        affected: 2,
        direct: 1,
        indirect: 1,
        files: [
          {
            name: "userRoutes.js",
            type: "Direct",
            level: "Low",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },
    },

    "userRoutes.js": {
      modify: {
        risk: "Medium",
        riskText: "Medium Risk",
        riskDescription:
          "Changing routes can affect API consumers and frontend requests.",
        affected: 4,
        direct: 2,
        indirect: 2,
        files: [
          {
            name: "authController.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "profileController.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "authService.js",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      remove: {
        risk: "Critical",
        riskText: "Critical Risk",
        riskDescription:
          "Removing the route module would make several API endpoints unavailable.",
        affected: 5,
        direct: 3,
        indirect: 2,
        files: [
          {
            name: "authController.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "profileController.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "authService.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "dashboard.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      refactor: {
        risk: "Low",
        riskText: "Low Risk",
        riskDescription:
          "Route organization can be changed safely if endpoint contracts remain stable.",
        affected: 2,
        direct: 1,
        indirect: 1,
        files: [
          {
            name: "authController.js",
            type: "Direct",
            level: "Low",
          },
          {
            name: "profileController.js",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      add: {
        risk: "Low",
        riskText: "Low Risk",
        riskDescription:
          "Adding a new route has limited impact on existing modules.",
        affected: 2,
        direct: 1,
        indirect: 1,
        files: [
          {
            name: "authController.js",
            type: "Direct",
            level: "Low",
          },
          {
            name: "login.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },
    },

    "userModel.js": {
      modify: {
        risk: "High",
        riskText: "High Risk",
        riskDescription:
          "Changing the user model can affect services, controllers, and stored data.",
        affected: 6,
        direct: 2,
        indirect: 4,
        files: [
          {
            name: "authService.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "profileService.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "authController.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "profileController.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "dashboard.jsx",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "settings.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      remove: {
        risk: "Critical",
        riskText: "Critical Risk",
        riskDescription:
          "Removing the user model would break persistence and authentication functionality.",
        affected: 6,
        direct: 3,
        indirect: 3,
        files: [
          {
            name: "authService.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "profileService.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "authController.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "profileController.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "dashboard.jsx",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "settings.jsx",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      refactor: {
        risk: "Medium",
        riskText: "Medium Risk",
        riskDescription:
          "Model refactoring requires checking all consumers of the existing schema.",
        affected: 4,
        direct: 2,
        indirect: 2,
        files: [
          {
            name: "authService.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "profileService.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "authController.js",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "profileController.js",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      add: {
        risk: "Low",
        riskText: "Low Risk",
        riskDescription:
          "Adding an optional field is unlikely to affect existing consumers.",
        affected: 2,
        direct: 1,
        indirect: 1,
        files: [
          {
            name: "authService.js",
            type: "Direct",
            level: "Low",
          },
          {
            name: "profileService.js",
            type: "Indirect",
            level: "Low",
          },
        ],
      },
    },

    "database.js": {
      modify: {
        risk: "Critical",
        riskText: "Critical Risk",
        riskDescription:
          "Database configuration is shared by multiple models and services.",
        affected: 9,
        direct: 3,
        indirect: 6,
        files: [
          {
            name: "userModel.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "productModel.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "orderModel.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "authService.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "productService.js",
            type: "Indirect",
            level: "Medium",
          },
          {
            name: "orderService.js",
            type: "Indirect",
            level: "Medium",
          },
        ],
      },

      remove: {
        risk: "Critical",
        riskText: "Critical Risk",
        riskDescription:
          "Removing database initialization would prevent the application from accessing persistent data.",
        affected: 9,
        direct: 3,
        indirect: 6,
        files: [
          {
            name: "userModel.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "productModel.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "orderModel.js",
            type: "Direct",
            level: "High",
          },
          {
            name: "authService.js",
            type: "Indirect",
            level: "High",
          },
          {
            name: "productService.js",
            type: "Indirect",
            level: "High",
          },
          {
            name: "orderService.js",
            type: "Indirect",
            level: "High",
          },
        ],
      },

      refactor: {
        risk: "Medium",
        riskText: "Medium Risk",
        riskDescription:
          "Database connection refactoring is manageable with connection compatibility testing.",
        affected: 6,
        direct: 3,
        indirect: 3,
        files: [
          {
            name: "userModel.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "productModel.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "orderModel.js",
            type: "Direct",
            level: "Medium",
          },
          {
            name: "authService.js",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "productService.js",
            type: "Indirect",
            level: "Low",
          },
          {
            name: "orderService.js",
            type: "Indirect",
            level: "Low",
          },
        ],
      },

      add: {
        risk: "Low",
        riskText: "Low Risk",
        riskDescription:
          "Adding a separate database utility should not affect existing modules.",
        affected: 2,
        direct: 1,
        indirect: 1,
        files: [
          {
            name: "server.js",
            type: "Direct",
            level: "Low",
          },
          {
            name: "config/index.js",
            type: "Indirect",
            level: "Low",
          },
        ],
      },
    },
  };

  const filteredFiles = files.filter((file) =>
    file.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const currentSimulation =
    simulations[selectedFile]?.[changeType];

  const runSimulation = () => {
    setIsAnalyzing(true);
    setHasResult(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 900);
  };

  const reset = () => {
    setSelectedFile("authService.js");
    setChangeType("modify");
    setDescription(
      "Change the authentication token validation logic"
    );
    setSearch("");
    setHasResult(false);
  };

  const getRiskStyles = (risk) => {
    if (risk === "Critical") {
      return {
        bg: "bg-red-500/10",
        border: "border-red-500/25",
        text: "text-red-400",
        icon: AlertTriangle,
        glow: "shadow-[0_0_35px_rgba(239,68,68,0.08)]",
      };
    }

    if (risk === "High") {
      return {
        bg: "bg-orange-500/10",
        border: "border-orange-500/25",
        text: "text-orange-400",
        icon: ShieldAlert,
        glow: "shadow-[0_0_35px_rgba(249,115,22,0.08)]",
      };
    }

    if (risk === "Medium") {
      return {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/25",
        text: "text-yellow-400",
        icon: AlertTriangle,
        glow: "",
      };
    }

    return {
      bg: "bg-green-500/10",
      border: "border-green-500/25",
      text: "text-green-400",
      icon: CheckCircle2,
      glow: "",
    };
  };

  const riskStyles = getRiskStyles(
    currentSimulation.risk
  );

  const RiskIcon = riskStyles.icon;

  return (
    <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-10rem)]">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <WandSparkles
                size={18}
                className="text-purple-400"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                What-If Analysis
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Simulate a code change before you make it.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#0c1016] text-gray-500 hover:text-white hover:border-white/20 transition text-sm"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-5">
        {/* ===================================================
            FILE SELECTOR
        ==================================================== */}
        <div className="bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Target file
            </p>

            <p className="text-xs text-gray-600 mt-1">
              Choose the file you want to change.
            </p>

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

          <div className="p-2">
            {filteredFiles.map((file) => {
              const active =
                selectedFile === file.name;

              return (
                <button
                  key={file.name}
                  onClick={() => {
                    setSelectedFile(file.name);
                    setHasResult(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl mb-1 transition ${
                    active
                      ? "bg-purple-500/10 border border-purple-500/20"
                      : "border border-transparent hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        active
                          ? "bg-purple-500/10"
                          : "bg-white/[0.03]"
                      }`}
                    >
                      <FileCode2
                        size={15}
                        className={
                          active
                            ? "text-purple-400"
                            : "text-gray-600"
                        }
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          active
                            ? "text-purple-300"
                            : "text-gray-400"
                        }`}
                      >
                        {file.name}
                      </p>

                      <p className="text-[10px] text-gray-700 mt-1 truncate">
                        {file.path}
                      </p>
                    </div>

                    {active && (
                      <ChevronRight
                        size={14}
                        className="text-purple-400"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            SIMULATION AREA
        ==================================================== */}
        <div className="space-y-5">
          {/* =================================================
              CHANGE CONFIGURATION
          ================================================== */}
          <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <GitBranch
                  size={15}
                  className="text-purple-400"
                />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Define a change
                </p>

                <p className="text-xs text-gray-600 mt-0.5">
                  Tell Ripple what you plan to change.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-5">
              {/* Change type */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Change type
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      value: "modify",
                      label: "Modify",
                    },
                    {
                      value: "refactor",
                      label: "Refactor",
                    },
                    {
                      value: "remove",
                      label: "Remove",
                    },
                    {
                      value: "add",
                      label: "Add",
                    },
                  ].map((type) => {
                    const active =
                      changeType === type.value;

                    return (
                      <button
                        key={type.value}
                        onClick={() => {
                          setChangeType(
                            type.value
                          );
                          setHasResult(false);
                        }}
                        className={`px-3 py-2.5 rounded-lg border text-xs transition ${
                          active
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                            : "bg-white/[0.02] border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20"
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Describe the change
                </label>

                <textarea
                  value={description}
                  onChange={(event) => {
                    setDescription(
                      event.target.value
                    );
                    setHasResult(false);
                  }}
                  rows={4}
                  placeholder="Example: Change the authentication token validation logic..."
                  className="w-full resize-none bg-[#090c11] border border-white/10 rounded-lg px-3 py-2.5 outline-none text-xs text-gray-300 placeholder-gray-700 focus:border-purple-500/30 transition"
                />
              </div>
            </div>

            {/* Selected file */}
            <div className="mt-5 p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <FileCode2
                size={15}
                className="text-purple-400"
              />

              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">
                  Target
                </p>

                <p className="text-xs font-mono text-gray-600 mt-1 truncate">
                  {
                    files.find(
                      (file) =>
                        file.name === selectedFile
                    )?.path
                  }
                </p>
              </div>

              <span className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/10 text-[10px] text-purple-400">
                {changeType}
              </span>
            </div>

            {/* Run */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={runSimulation}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 disabled:bg-purple-500/30 disabled:cursor-not-allowed text-white text-sm font-medium transition"
              >
                {isAnalyzing ? (
                  <>
                    <Zap
                      size={15}
                      className="animate-pulse"
                    />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play size={15} />
                    Run What-If Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              RESULT
          ================================================== */}
          <div
            className={`bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden ${
              hasResult
                ? riskStyles.glow
                : ""
            }`}
          >
            {/* Result header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Simulation Result
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Predicted impact of the proposed change
                </p>
              </div>

              {!hasResult && (
                <span className="text-[10px] text-gray-700">
                  Run analysis to see results
                </span>
              )}

              {hasResult && (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${riskStyles.bg} ${riskStyles.border}`}
                >
                  <RiskIcon
                    size={14}
                    className={riskStyles.text}
                  />

                  <span
                    className={`text-xs font-medium ${riskStyles.text}`}
                  >
                    {currentSimulation.riskText}
                  </span>
                </div>
              )}
            </div>

            {!hasResult ? (
              <div className="min-h-[360px] flex flex-col items-center justify-center text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <WandSparkles
                    size={24}
                    className="text-purple-400"
                  />
                </div>

                <h3 className="text-lg font-semibold mt-5">
                  Simulate before you change
                </h3>

                <p className="text-sm text-gray-600 max-w-md leading-6 mt-2">
                  Ripple will trace dependencies and estimate
                  which files, modules, and features could be
                  affected by your proposed change.
                </p>

                <div className="flex items-center gap-3 mt-6 text-[10px] text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <GitBranch size={12} />
                    Dependencies
                  </span>

                  <span>•</span>

                  <span className="flex items-center gap-1.5">
                    <AlertTriangle size={12} />
                    Risk
                  </span>

                  <span>•</span>

                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    Recommendations
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5">
                {/* Risk summary */}
                <div
                  className={`p-4 rounded-xl border ${riskStyles.bg} ${riskStyles.border}`}
                >
                  <div className="flex items-start gap-3">
                    <RiskIcon
                      size={18}
                      className={`${riskStyles.text} mt-0.5`}
                    />

                    <div>
                      <p
                        className={`text-sm font-semibold ${riskStyles.text}`}
                      >
                        {currentSimulation.riskText}
                      </p>

                      <p className="text-xs text-gray-500 leading-5 mt-1">
                        {
                          currentSimulation.riskDescription
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <ResultStat
                    value={
                      currentSimulation.affected
                    }
                    label="Affected files"
                  />

                  <ResultStat
                    value={
                      currentSimulation.direct
                    }
                    label="Direct impact"
                  />

                  <ResultStat
                    value={
                      currentSimulation.indirect
                    }
                    label="Indirect impact"
                  />
                </div>

                {/* Dependency chain */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <GitBranch
                      size={14}
                      className="text-purple-400"
                    />

                    <p className="text-xs font-medium text-gray-400">
                      Predicted dependency chain
                    </p>
                  </div>

                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
                    <ChainBox
                      icon={FileCode2}
                      title={selectedFile}
                      subtitle="Changed"
                      active
                    />

                    <ArrowRight
                      size={16}
                      className="hidden lg:block text-gray-700 mx-1"
                    />

                    <ChainBox
                      icon={GitBranch}
                      title="Services"
                      subtitle="Direct dependencies"
                    />

                    <ArrowRight
                      size={16}
                      className="hidden lg:block text-gray-700 mx-1"
                    />

                    <ChainBox
                      icon={Zap}
                      title="Application"
                      subtitle="Indirect effects"
                    />

                    <ArrowRight
                      size={16}
                      className="hidden lg:block text-gray-700 mx-1"
                    />

                    <ChainBox
                      icon={CheckCircle2}
                      title="UI"
                      subtitle="User-facing impact"
                    />
                  </div>
                </div>

                {/* Affected files */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-400">
                      Predicted affected files
                    </p>

                    <span className="text-[10px] text-gray-700">
                      {currentSimulation.files.length} shown
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentSimulation.files.map(
                      (file) => {
                        const levelStyle =
                          getRiskStyles(
                            file.level === "High"
                              ? "High"
                              : file.level ===
                                  "Medium"
                                ? "Medium"
                                : "Low"
                          );

                        return (
                          <div
                            key={`${file.name}-${file.type}`}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                          >
                            <FileCode2
                              size={14}
                              className="text-gray-600"
                            />

                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-400 truncate">
                                {file.name}
                              </p>

                              <p className="text-[10px] text-gray-700 mt-1">
                                {file.type} impact
                              </p>
                            </div>

                            <span
                              className={`text-[10px] ${levelStyle.text}`}
                            >
                              {file.level}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <div className="flex items-start gap-3">
                    <Zap
                      size={16}
                      className="text-blue-400 mt-0.5"
                    />

                    <div>
                      <p className="text-xs font-medium text-blue-300">
                        Ripple recommendation
                      </p>

                      <p className="text-[11px] text-gray-600 leading-5 mt-1">
                        Review the directly affected modules
                        first, then run regression tests against
                        the indirectly affected parts of the
                        application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          FUTURE API NOTE
      ====================================================== */}
      <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-gray-700">
        <WandSparkles size={11} />
        <span>
          Powered by repository dependency analysis
        </span>
      </div>
    </div>
  );
}

function ResultStat({
  value,
  label,
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
      <p className="text-2xl font-bold text-purple-400">
        {value}
      </p>

      <p className="text-[10px] text-gray-600 mt-1">
        {label}
      </p>
    </div>
  );
}

function ChainBox({
  icon: Icon,
  title,
  subtitle,
  active,
}) {
  return (
    <div
      className={`flex-1 min-w-[150px] p-3 rounded-xl border ${
        active
          ? "bg-purple-500/10 border-purple-500/25"
          : "bg-white/[0.02] border-white/5"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            active
              ? "bg-purple-500/10"
              : "bg-white/[0.03]"
          }`}
        >
          <Icon
            size={14}
            className={
              active
                ? "text-purple-400"
                : "text-gray-500"
            }
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-300 truncate">
            {title}
          </p>

          <p className="text-[9px] text-gray-700 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhatIf;
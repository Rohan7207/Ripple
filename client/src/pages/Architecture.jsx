import RippleLogo from "../components/RippleLogo";
import { useState } from "react";
import {
  GitBranch,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  FileCode2,
  Server,
  Database,
  ShieldCheck,
  Package,
  ChevronRight,
  Link2,
} from "lucide-react";

function Architecture() {
  // Start slightly zoomed out so the complete architecture
  // has more breathing space.
  const [zoom, setZoom] = useState(0.82);

  // Frontend is selected by default.
  const [selectedNode, setSelectedNode] = useState("frontend");

  const nodes = [
    {
      id: "frontend",
      title: "Frontend",
      subtitle: "React Application",
      description:
        "Main user interface and client-side application.",
      icon: FileCode2,
      position: "top-[70px] left-[80px]",
      color: "blue",
      files: 48,
    },
    {
      id: "api",
      title: "API Layer",
      subtitle: "Express Server",
      description:
        "Handles HTTP requests and coordinates application services.",
      icon: Server,
      position: "top-[70px] left-[430px]",
      color: "purple",
      files: 22,
    },
    {
      id: "auth",
      title: "Authentication",
      subtitle: "Auth Service",
      description:
        "Manages users, sessions and authorization.",
      icon: ShieldCheck,
      position: "top-[300px] left-[180px]",
      color: "green",
      files: 12,
    },
    {
      id: "services",
      title: "Services",
      subtitle: "Business Logic",
      description:
        "Contains the main application business logic.",
      icon: Package,
      position: "top-[300px] left-[500px]",
      color: "orange",
      files: 31,
    },
    {
      id: "database",
      title: "Database",
      subtitle: "MongoDB",
      description:
        "Persistent storage for application data.",
      icon: Database,
      position: "top-[530px] left-[350px]",
      color: "cyan",
      files: 8,
    },
  ];

  /*
   * Architecture connections.
   *
   * These coordinates are intentionally kept the same.
   * Only the node size/overall zoom has been adjusted.
   *
   * Later these connections can come from:
   *
   * GET /api/repositories/:repositoryId/graph
   */
  const connections = [
    {
      id: "frontend-api",
      source: "frontend",
      target: "api",
      x1: 220,
      y1: 145,
      x2: 430,
      y2: 145,
    },
    {
      id: "frontend-auth",
      source: "frontend",
      target: "auth",
      x1: 170,
      y1: 185,
      x2: 255,
      y2: 300,
    },
    {
      id: "api-services",
      source: "api",
      target: "services",
      x1: 510,
      y1: 185,
      x2: 535,
      y2: 300,
    },
    {
      id: "auth-services",
      source: "auth",
      target: "services",
      x1: 320,
      y1: 345,
      x2: 450,
      y2: 345,
    },
    {
      id: "services-database",
      source: "services",
      target: "database",
      x1: 560,
      y1: 390,
      x2: 470,
      y2: 530,
    },
    {
      id: "auth-database",
      source: "auth",
      target: "database",
      x1: 255,
      y1: 390,
      x2: 390,
      y2: 530,
    },
  ];

  /*
   * Get all connections attached to the selected node.
   */
  const selectedConnections = connections.filter(
    (connection) =>
      connection.source === selectedNode ||
      connection.target === selectedNode
  );

  /*
   * Determine whether another node is directly connected
   * to the selected node.
   */
  const isConnectedNode = (nodeId) => {
    if (!selectedNode) return false;

    return connections.some(
      (connection) =>
        (connection.source === selectedNode &&
          connection.target === nodeId) ||
        (connection.target === selectedNode &&
          connection.source === nodeId)
    );
  };

  /*
   * Determine whether a connection should be highlighted.
   */
  const isHighlightedConnection = (connection) => {
    if (!selectedNode) return false;

    return (
      connection.source === selectedNode ||
      connection.target === selectedNode
    );
  };

  const selected = nodes.find(
    (node) => node.id === selectedNode
  );

  const SelectedIcon = selected?.icon;

  /*
   * Node color themes.
   */
  const getColor = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
      },

      purple: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        text: "text-purple-400",
      },

      green: {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        text: "text-green-400",
      },

      orange: {
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        text: "text-orange-400",
      },

      cyan: {
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/30",
        text: "text-cyan-400",
      },
    };

    return colors[color];
  };

  /*
   * Reset graph to the default zoom and selection.
   */
  const handleReset = () => {
    setZoom(0.82);
    setSelectedNode("frontend");
  };

  /*
   * Select a node and keep the graph slightly zoomed out.
   */
  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
    setZoom(0.82);
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-10rem)] min-h-[650px] flex flex-col">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold">
            Architecture
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Visualize how modules and services interact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-[#0c1016] border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setZoom((value) =>
                  Math.max(0.65, value - 0.1)
                )
              }
              className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 transition"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>

            <span className="px-2 text-xs text-gray-500 border-x border-white/10 min-w-[55px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() =>
                setZoom((value) =>
                  Math.min(1.3, value + 0.1)
                )
              }
              className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 transition"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-lg bg-[#0c1016] border border-white/10 text-gray-500 hover:text-white transition"
            title="Reset graph"
          >
            <RotateCcw size={16} />
          </button>

          {/* Fullscreen */}
          <button
            className="p-2.5 rounded-lg bg-[#0c1016] border border-white/10 text-gray-500 hover:text-white transition"
            title="Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        {/* ===================================================
            GRAPH
        ==================================================== */}
        <div className="relative min-h-[600px] bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden">
          {/* Graph label */}
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-2 bg-[#080b10]/90 backdrop-blur border border-white/10 rounded-lg px-3 py-2">
              <GitBranch
                size={15}
                className="text-blue-400"
              />

              <span className="text-xs text-gray-400">
                Repository Graph
              </span>
            </div>
          </div>

          {/* Module count */}
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-2 bg-[#080b10]/90 backdrop-blur border border-white/10 rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />

              <span className="text-xs text-gray-500">
                5 modules
              </span>
            </div>
          </div>

          {/* =================================================
              DOT GRID
          ================================================== */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* =================================================
              GRAPH CANVAS
          ================================================== */}
          <div className="absolute inset-0 overflow-auto">
            <div
              className="relative w-[760px] h-[680px] min-w-[760px]"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                transition: "transform 200ms ease",
              }}
            >
              {/* =================================================
                  CONNECTIONS / ARROWS
              ================================================== */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 760 680"
              >
                <defs>
                  {/* Normal arrow */}
                  <marker
                    id="arrow-normal"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <path
                      d="M0,0 L0,6 L7,3 z"
                      fill="#374151"
                    />
                  </marker>

                  {/* Highlight arrow */}
                  <marker
                    id="arrow-highlight"
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

                {connections.map((connection) => {
                  const highlighted =
                    isHighlightedConnection(connection);

                  return (
                    <line
                      key={connection.id}
                      x1={connection.x1}
                      y1={connection.y1}
                      x2={connection.x2}
                      y2={connection.y2}
                      stroke={
                        highlighted
                          ? "#60a5fa"
                          : "#374151"
                      }
                      strokeWidth={
                        highlighted ? 4 : 2
                      }
                      opacity={
                        highlighted ? 1 : 0.22
                      }
                      strokeLinecap="round"
                      markerEnd={
                        highlighted
                          ? "url(#arrow-highlight)"
                          : "url(#arrow-normal)"
                      }
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* =================================================
                    ANIMATED CONNECTION DOTS
                ================================================== */}
                {selectedConnections.map(
                  (connection) => (
                    <circle
                      key={`pulse-${connection.id}`}
                      r="4"
                      fill="#60a5fa"
                      opacity="0.9"
                    >
                      <animateMotion
                        dur="1.6s"
                        repeatCount="indefinite"
                        path={`M ${connection.x1} ${connection.y1} L ${connection.x2} ${connection.y2}`}
                      />
                    </circle>
                  )
                )}
              </svg>

              {/* =================================================
                  NODES
              ================================================== */}
              {nodes.map((node) => {
                const Icon = node.icon;

                const colors = getColor(node.color);

                const active =
                  selectedNode === node.id;

                const connected =
                  isConnectedNode(node.id);

                const dimmed =
                  selectedNode &&
                  !active &&
                  !connected;

                return (
                  <button
                    key={node.id}
                    onClick={() =>
                      handleNodeClick(node.id)
                    }
                    className={`absolute ${
                      node.position
                    } w-[155px] text-left rounded-xl border p-3 transition-all duration-300 ${
                      active
                        ? `${colors.bg} ${colors.border} shadow-[0_0_30px_rgba(96,165,250,0.18)] scale-[1.03]`
                        : connected
                        ? "bg-[#111923] border-blue-500/30 shadow-[0_0_20px_rgba(96,165,250,0.08)]"
                        : "bg-[#11151c] border-white/10"
                    } ${
                      dimmed
                        ? "opacity-35 grayscale"
                        : "opacity-100"
                    } hover:opacity-100`}
                  >
                    {/* Selected indicator */}
                    {active && (
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                    )}

                    <div className="flex items-center gap-2.5">
                      {/* Smaller icon */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          active || connected
                            ? colors.bg
                            : "bg-white/[0.04]"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={
                            active || connected
                              ? colors.text
                              : "text-gray-500"
                          }
                        />
                      </div>

                      {/* Node title */}
                      <div className="min-w-0">
                        <p
                          className={`text-[13px] font-semibold truncate ${
                            active
                              ? "text-white"
                              : connected
                              ? "text-gray-200"
                              : "text-gray-400"
                          }`}
                        >
                          {node.title}
                        </p>

                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                          {node.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Node footer */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                      <span className="text-[10px] text-gray-600">
                        {node.files} files
                      </span>

                      <ChevronRight
                        size={12}
                        className={
                          active
                            ? "text-blue-400"
                            : "text-gray-600"
                        }
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              LEGEND
          ================================================== */}
          <div className="absolute bottom-4 left-4 z-20 bg-[#080b10]/90 backdrop-blur border border-white/10 rounded-lg px-3 py-2">
            <div className="flex items-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Module
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Service
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Database
              </span>
            </div>
          </div>

          {/* Connection count */}
          <div className="absolute bottom-4 right-4 z-20 bg-[#080b10]/90 backdrop-blur border border-white/10 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Link2
                size={14}
                className="text-blue-400"
              />

              <span className="text-[11px] text-gray-500">
                {selectedConnections.length} connected
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            DETAILS PANEL
        ==================================================== */}
        <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-5 overflow-y-auto">
          {/* Selected module */}
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              {SelectedIcon && (
                <SelectedIcon
                  size={19}
                  className="text-blue-400"
                />
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Selected module
              </p>

              <h2 className="text-lg font-semibold mt-0.5">
                {selected?.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="py-5 border-b border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Description
            </p>

            <p className="text-sm text-gray-400 leading-6 mt-2">
              {selected?.description}
            </p>
          </div>

          {/* Statistics */}
          <div className="py-5 border-b border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              Statistics
            </p>

            <div className="space-y-3">
              <Stat
                label="Files"
                value={selected?.files}
              />

              <Stat
                label="Dependencies"
                value="8"
              />

              <Stat
                label="Connections"
                value={selectedConnections.length}
              />
            </div>
          </div>

          {/* Connections */}
          <div className="py-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Connections
              </p>

              <span className="text-[11px] text-blue-400">
                Highlighted
              </span>
            </div>

            <div className="space-y-2">
              {selectedConnections.map(
                (connection) => {
                  const otherNodeId =
                    connection.source === selectedNode
                      ? connection.target
                      : connection.source;

                  const otherNode = nodes.find(
                    (node) =>
                      node.id === otherNodeId
                  );

                  if (!otherNode) return null;

                  return (
                    <button
                      key={connection.id}
                      onClick={() =>
                        handleNodeClick(
                          otherNode.id
                        )
                      }
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30 transition text-left"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />

                      <div className="flex-1">
                        <p className="text-sm text-gray-300">
                          {otherNode.title}
                        </p>

                        <p className="text-[11px] text-gray-600 mt-0.5">
                          {connection.source ===
                          selectedNode
                            ? "Depends on"
                            : "Used by"}
                        </p>
                      </div>

                      <ChevronRight
                        size={14}
                        className="text-blue-400"
                      />
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Explore */}
          <button className="w-full mt-2 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 hover:bg-blue-500/20 transition">
            Explore Module
          </button>
        </div>
      </div>
    </div>
  );
}

/*
 * Small statistics component.
 */
function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-medium text-gray-300">
        {value}
      </span>
    </div>
  );
}

export default Architecture;
import RippleLogo from "../components/RippleLogo";
import { useState } from "react";
import {
  Search,
  Folder,
  FolderOpen,
  FileCode2,
  FileJson,
  FileText,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Code2,
} from "lucide-react";

function Files() {
  const [selectedFile, setSelectedFile] = useState("src/App.jsx");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const files = [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "components",
          type: "folder",
          children: [
            {
              name: "Navbar.jsx",
              type: "file",
              language: "jsx",
            },
            {
              name: "Sidebar.jsx",
              type: "file",
              language: "jsx",
            },
            {
              name: "Button.jsx",
              type: "file",
              language: "jsx",
            },
          ],
        },
        {
          name: "pages",
          type: "folder",
          children: [
            {
              name: "Home.jsx",
              type: "file",
              language: "jsx",
            },
            {
              name: "Dashboard.jsx",
              type: "file",
              language: "jsx",
            },
          ],
        },
        {
          name: "App.jsx",
          type: "file",
          language: "jsx",
        },
        {
          name: "main.jsx",
          type: "file",
          language: "jsx",
        },
        {
          name: "index.css",
          type: "file",
          language: "css",
        },
      ],
    },
    {
      name: "server",
      type: "folder",
      children: [
        {
          name: "routes.js",
          type: "file",
          language: "js",
        },
        {
          name: "controller.js",
          type: "file",
          language: "js",
        },
        {
          name: "database.js",
          type: "file",
          language: "js",
        },
      ],
    },
    {
      name: "package.json",
      type: "file",
      language: "json",
    },
    {
      name: "README.md",
      type: "file",
      language: "md",
    },
    {
      name: ".gitignore",
      type: "file",
      language: "text",
    },
  ];

  const sourceCode = {
    "src/App.jsx": `import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,

    "src/main.jsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,

    "src/components/Navbar.jsx": `function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Ripple</div>

      <div className="links">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
      </div>
    </nav>
  );
}

export default Navbar;`,

    "src/components/Sidebar.jsx": `function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Workspace</h2>

      <nav>
        <a href="/overview">Overview</a>
        <a href="/files">Files</a>
        <a href="/architecture">Architecture</a>
      </nav>
    </aside>
  );
}

export default Sidebar;`,

    "src/pages/Home.jsx": `function Home() {
  return (
    <main>
      <h1>Welcome to the application</h1>
      <p>Explore the repository with Ripple.</p>
    </main>
  );
}

export default Home;`,

    "src/pages/Dashboard.jsx": `function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Repository metrics appear here.</p>
    </main>
  );
}

export default Dashboard;`,

    "server/routes.js": `const express = require("express");

const router = express.Router();

router.get("/repositories", getRepositories);
router.post("/repositories", createRepository);

module.exports = router;`,

    "server/controller.js": `async function createRepository(req, res) {
  const { url } = req.body;

  // Repository analysis will happen here.

  res.json({
    message: "Repository analysis started",
  });
}

module.exports = {
  createRepository,
};`,

    "server/database.js": `const mongoose = require("mongoose");

async function connectDatabase() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Database connected");
}

module.exports = connectDatabase;`,

    "package.json": `{
  "name": "ripple-demo",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-router-dom": "^7.0.0"
  }
}`,

    "README.md": `# Ripple Demo

AI-powered repository understanding tool.

## Features

- Repository analysis
- Architecture visualization
- Source code exploration
- AI repository questions
- Impact analysis
- What-if analysis`,

    ".gitignore": `node_modules/
dist/
.env
.env.local`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        sourceCode[selectedFile] || ""
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      console.log("Copy failed");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-10rem)] min-h-[650px] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold">
            Repository Files
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Explore the repository structure and inspect source code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            128 files
          </span>

          <span className="w-1 h-1 rounded-full bg-gray-600" />

          <span className="text-xs text-green-400">
            Indexed
          </span>
        </div>
      </div>

      {/* File Explorer */}
      <div className="flex-1 min-h-0 bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left - Tree */}
        <div className="w-full lg:w-[320px] xl:w-[360px] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col min-h-[300px] lg:min-h-0">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5">
              <Search
                size={16}
                className="text-gray-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="bg-transparent outline-none text-sm text-white placeholder-gray-600 w-full"
              />
            </div>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto p-3">
            <FileTree
              items={files}
              parentPath=""
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              search={search}
            />
          </div>
        </div>

        {/* Right - Code Viewer */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Code Header */}
          <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <FileCode2
                size={17}
                className="text-blue-400 shrink-0"
              />

              <span className="text-sm text-gray-300 truncate">
                {selectedFile}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              {copied ? (
                <>
                  <Check
                    size={14}
                    className="text-green-400"
                  />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code */}
          <div className="flex-1 overflow-auto bg-[#080b10]">
            <div className="min-w-max py-4">
              {renderCode(
                sourceCode[selectedFile] ||
                  "// Source code will be available after repository analysis."
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="h-10 px-5 border-t border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Code2 size={14} />
              Source Viewer
            </div>

            <span className="text-xs text-gray-600">
              {getLanguage(selectedFile)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileTree({
  items,
  parentPath,
  selectedFile,
  setSelectedFile,
  search,
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const currentPath = parentPath
          ? `${parentPath}/${item.name}`
          : item.name;

        if (
          search &&
          item.type === "file" &&
          !currentPath
            .toLowerCase()
            .includes(search.toLowerCase())
        ) {
          return null;
        }

        if (item.type === "folder") {
          return (
            <FolderItem
              key={currentPath}
              item={item}
              currentPath={currentPath}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              search={search}
            />
          );
        }

        return (
          <FileItem
            key={currentPath}
            item={item}
            currentPath={currentPath}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        );
      })}
    </div>
  );
}

function FolderItem({
  item,
  currentPath,
  selectedFile,
  setSelectedFile,
  search,
}) {
  const [open, setOpen] = useState(
    currentPath === "src"
  );

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
      >
        {open ? (
          <ChevronDown size={15} />
        ) : (
          <ChevronRight size={15} />
        )}

        {open ? (
          <FolderOpen
            size={16}
            className="text-blue-400"
          />
        ) : (
          <Folder
            size={16}
            className="text-blue-400"
          />
        )}

        <span>{item.name}</span>
      </button>

      {open && (
        <div className="ml-5 pl-2 border-l border-white/10 mt-1">
          <FileTree
            items={item.children}
            parentPath={currentPath}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            search={search}
          />
        </div>
      )}
    </div>
  );
}

function FileItem({
  item,
  currentPath,
  selectedFile,
  setSelectedFile,
}) {
  const active = selectedFile === currentPath;

  return (
    <button
      onClick={() => setSelectedFile(currentPath)}
      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition ${
        active
          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
      }`}
    >
      <span className="w-[15px]" />

      <FileIcon name={item.name} />

      <span className="truncate">
        {item.name}
      </span>
    </button>
  );
}

function FileIcon({ name }) {
  if (name.endsWith(".json")) {
    return (
      <FileJson
        size={16}
        className="text-yellow-400 shrink-0"
      />
    );
  }

  if (name.endsWith(".md")) {
    return (
      <FileText
        size={16}
        className="text-gray-400 shrink-0"
      />
    );
  }

  return (
    <FileCode2
      size={16}
      className="text-blue-400 shrink-0"
    />
  );
}

function renderCode(code) {
  const lines = code.split("\n");

  return lines.map((line, index) => (
    <div
      key={index}
      className="flex hover:bg-white/[0.02]"
    >
      <span className="w-14 text-right pr-4 text-xs text-gray-700 select-none">
        {index + 1}
      </span>

      <span className="pl-4 pr-8 text-sm font-mono text-gray-300 whitespace-pre">
        {line || " "}
      </span>
    </div>
  ));
}

function getLanguage(filename) {
  if (filename.endsWith(".jsx")) return "JavaScript React";
  if (filename.endsWith(".js")) return "JavaScript";
  if (filename.endsWith(".css")) return "CSS";
  if (filename.endsWith(".json")) return "JSON";
  if (filename.endsWith(".md")) return "Markdown";

  return "Text";
}

export default Files;
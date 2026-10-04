import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRepositoryFiles, getRepositoryFile } from "../lib/api";

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

function buildFileTree(files) {
  const root = [];

  for (const file of files) {
    const filePath =
      typeof file === "string" ? file : file.path || file.relativePath;

    if (!filePath) continue;

    const parts = filePath.replaceAll("\\", "/").split("/").filter(Boolean);

    let current = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      const isFile = index === parts.length - 1;

      let existing = current.find((item) => item.name === part);

      if (!existing) {
        existing = {
          name: part,
          type: isFile ? "file" : "folder",
          path: currentPath,
          file: isFile ? file : undefined,
          children: isFile ? undefined : [],
        };

        current.push(existing);
      }

      if (!isFile) {
        current = existing.children;
      }
    });
  }

  return root;
}

function Files() {
  const { repositoryId } = useParams();

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!repositoryId) return;

    async function loadFiles() {
      try {
        setLoading(true);
        setError("");

        const data = await getRepositoryFiles(repositoryId);

        setFiles(data.files || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, [repositoryId]);

  useEffect(() => {
    if (!repositoryId || !selectedFile) {
      setFileContent("");
      return;
    }

    async function loadFile() {
      try {
        setFileLoading(true);
        setFileContent("");

        const data = await getRepositoryFile(repositoryId, selectedFile.id);

        setFileContent(data.content || "");
      } catch (error) {
        setFileContent(`// ${error.message}`);
      } finally {
        setFileLoading(false);
      }
    }

    loadFile();
  }, [repositoryId, selectedFile]);

  const fileTree = buildFileTree(files);

  const handleCopy = async () => {
    if (!fileContent) return;

    try {
      await navigator.clipboard.writeText(fileContent);

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
          <h1 className="text-2xl font-bold">Repository Files</h1>

          <p className="text-sm text-gray-500 mt-1">
            Explore the repository structure and inspect source code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{files.length} files</span>

          <span className="w-1 h-1 rounded-full bg-gray-600" />

          <span className="text-xs text-green-400">Indexed</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* File Explorer */}
      <div className="flex-1 min-h-0 bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left - Tree */}
        <div className="w-full lg:w-[320px] xl:w-[360px] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col min-h-[300px] lg:min-h-0">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5">
              <Search size={16} className="text-gray-500" />

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
            {loading ? (
              <div className="px-2 py-3 text-sm text-gray-600">
                Loading files...
              </div>
            ) : files.length === 0 ? (
              <div className="px-2 py-3 text-sm text-gray-600">
                No files found.
              </div>
            ) : (
              <FileTree
                items={fileTree}
                parentPath=""
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                search={search}
              />
            )}
          </div>
        </div>

        {/* Right - Code Viewer */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Code Header */}
          <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <FileCode2 size={17} className="text-blue-400 shrink-0" />

              <span className="text-sm text-gray-300 truncate">
                {selectedFile?.path || "Select a file"}
              </span>
            </div>

            <button
              onClick={handleCopy}
              disabled={!selectedFile || fileLoading || !fileContent}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
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
              {fileLoading
                ? renderCode("// Loading file...")
                : renderCode(
                    fileContent ||
                      "// Select a file to inspect its source code.",
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
          !currentPath.toLowerCase().includes(search.toLowerCase())
        ) {
          return null;
        }

        if (item.type === "folder") {
          const hasMatchingFile = folderHasMatch(item, currentPath, search);

          if (search && !hasMatchingFile) {
            return null;
          }

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

function folderHasMatch(item, currentPath, search) {
  if (!search) return true;

  const query = search.toLowerCase();

  if (currentPath.toLowerCase().includes(query)) {
    return true;
  }

  return (item.children || []).some((child) => {
    const childPath = `${currentPath}/${child.name}`;

    if (child.type === "file") {
      return childPath.toLowerCase().includes(query);
    }

    return folderHasMatch(child, childPath, search);
  });
}

function FolderItem({
  item,
  currentPath,
  selectedFile,
  setSelectedFile,
  search,
}) {
  const [open, setOpen] = useState(
    currentPath === "src" || currentPath === "Ripple-main",
  );

  useEffect(() => {
    if (search) {
      setOpen(true);
    }
  }, [search]);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
      >
        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}

        {open ? (
          <FolderOpen size={16} className="text-blue-400" />
        ) : (
          <Folder size={16} className="text-blue-400" />
        )}

        <span>{item.name}</span>
      </button>

      {open && (
        <div className="ml-5 pl-2 border-l border-white/10 mt-1">
          <FileTree
            items={item.children || []}
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

function FileItem({ item, currentPath, selectedFile, setSelectedFile }) {
  const active = selectedFile?.path === currentPath;

  return (
    <button
      onClick={() => {
        setSelectedFile({
          ...item.file,
          path: currentPath,
        });
      }}
      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition ${
        active
          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
      }`}
    >
      <span className="w-[15px]" />

      <FileIcon name={item.name} />

      <span className="truncate">{item.name}</span>
    </button>
  );
}

function FileIcon({ name }) {
  if (name.endsWith(".json")) {
    return <FileJson size={16} className="text-yellow-400 shrink-0" />;
  }

  if (name.endsWith(".md")) {
    return <FileText size={16} className="text-gray-400 shrink-0" />;
  }

  return <FileCode2 size={16} className="text-blue-400 shrink-0" />;
}

function renderCode(code) {
  const lines = code.split("\n");

  return lines.map((line, index) => (
    <div key={index} className="flex hover:bg-white/[0.02]">
      <span className="w-14 text-right pr-4 text-xs text-gray-700 select-none">
        {index + 1}
      </span>

      <span className="pl-4 pr-8 text-sm font-mono text-gray-300 whitespace-pre">
        {line || " "}
      </span>
    </div>
  ));
}

function getLanguage(file) {
  if (!file?.name) return "Text";

  if (file.language) {
    if (file.language === "JavaScript") {
      return "JavaScript";
    }

    return file.language;
  }

  const filename = file.name;

  if (filename.endsWith(".jsx")) {
    return "JavaScript React";
  }

  if (filename.endsWith(".js")) {
    return "JavaScript";
  }

  if (filename.endsWith(".css")) {
    return "CSS";
  }

  if (filename.endsWith(".json")) {
    return "JSON";
  }

  if (filename.endsWith(".md")) {
    return "Markdown";
  }

  return "Text";
}

export default Files;

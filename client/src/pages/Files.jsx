import { Folder, FileCode2 } from "lucide-react";

function Files() {
  const files = [
    "src",
    "components",
    "pages",
    "services",
    "App.jsx",
    "main.jsx",
    "package.json",
  ];

  return (
    <div className="mx-auto max-w-7xl">

      <h1 className="text-3xl font-bold">
        Files
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Browse your repository source code.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/5 bg-[#080b11]">

        {files.map((file, index) => {

          const isFolder = ["src", "components", "pages", "services"].includes(file);

          return (
            <div
              key={file}
              className="flex items-center gap-3 border-b border-white/5 px-5 py-4 text-sm last:border-0 hover:bg-white/[0.02]"
            >
              {isFolder ? (
                <Folder size={17} className="text-blue-400" />
              ) : (
                <FileCode2 size={17} className="text-slate-500" />
              )}

              {file}
            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Files;
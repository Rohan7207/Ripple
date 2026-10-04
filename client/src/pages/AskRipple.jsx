import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

function AskRipple() {
  const [question, setQuestion] = useState("");

  return (
    <div className="mx-auto flex max-w-4xl flex-col">

      <div className="text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <MessageSquare size={22} />
        </div>

        <h1 className="mt-5 text-3xl font-bold">
          Ask Ripple
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Ask anything about your repository.
        </p>

      </div>

      <div className="mt-12 rounded-2xl border border-white/5 bg-[#080b11] p-5">

        <div className="min-h-[350px] rounded-xl border border-white/5 bg-black/20 p-5">

          <p className="text-sm text-slate-600">
            Ask a question to start exploring your codebase.
          </p>

        </div>

        <div className="mt-4 flex gap-3">

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How does authentication work?"
            className="flex-1 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500/30"
          />

          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-medium hover:bg-blue-500">
            <Send size={16} />
            Ask
          </button>

        </div>

      </div>

    </div>
  );
}

export default AskRipple;
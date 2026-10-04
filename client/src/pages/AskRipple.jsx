import { useState } from "react";
import {
  Send,
  Sparkles,
  User,
  Copy,
  Check,
  FileCode2,
  Search,
  Trash2,
  ArrowUpRight,
  Loader2,
  Lightbulb,
} from "lucide-react";

import { useParams } from "react-router-dom";
import { askRepository } from "../lib/api";

function AskRipple() {
  const { repositoryId } = useParams();

  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hi! I'm Ripple. I can help you understand this repository, explain how different modules work, trace dependencies, and answer questions about the codebase.",
      files: [],
    },
  ]);

  /*Ask Ripple.*/
  const handleAsk = async (text = question) => {
    const trimmedQuestion = text.trim();

    if (!trimmedQuestion || isThinking) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: trimmedQuestion,
      files: [],
    };

    setMessages((previous) => [...previous, userMessage]);

    setQuestion("");
    setIsThinking(true);

    try {
      const result = await askRepository(repositoryId, trimmedQuestion);

      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: result.answer,
        files: result.sources || [],
        code: null,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: error.message || "Unable to analyze the repository right now.",
        files: [],
        code: null,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  /*
   * Allow Enter to send.
   *
   * Shift + Enter creates a new line.
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAsk();
    }
  };

  /*
   * Clear conversation.
   */
  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: "assistant",
        content: "Conversation cleared. Ask me anything about your repository.",
        files: [],
      },
    ]);
  };

  /*
   * Copy code block.
   */
  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedCode(true);

      setTimeout(() => {
        setCopiedCode(false);
      }, 1800);
    } catch (error) {
      console.error("Unable to copy code:", error);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-10rem)] min-h-[650px] flex flex-col">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Ask Ripple</h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Ask questions about your repository.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#0c1016] text-gray-500 hover:text-white hover:border-white/20 transition text-sm"
        >
          <Trash2 size={15} />
          Clear
        </button>
      </div>

      {/* =====================================================
          CHAT CONTAINER
      ====================================================== */}
      <div className="flex-1 min-h-0 bg-[#0c1016] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
        {/* Repository context bar */}
        <div className="h-12 shrink-0 border-b border-white/10 px-5 flex items-center justify-between bg-[#0a0d12]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />

            <span className="text-xs text-gray-400">
              Repository context active
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Search size={13} />
            <span>Ripple can search your codebase</span>
          </div>
        </div>

        {/* ===================================================
            MESSAGES
        ==================================================== */}
        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome state */}
            {messages.length === 1 && messages[0].type === "assistant" && (
              <div className="mb-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                    <Sparkles size={25} className="text-blue-400" />
                  </div>

                  <h2 className="text-2xl font-semibold">
                    Understand your codebase
                  </h2>

                  <p className="text-sm text-gray-500 leading-6 mt-3">
                    Ask Ripple questions about code structure, dependencies,
                    authentication, APIs, database usage, or any other part of
                    your repository.
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => {
              if (message.type === "user") {
                return (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[80%]">
                      <div className="flex justify-end items-center gap-2 mb-2">
                        <span className="text-[11px] text-gray-600">You</span>

                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                          <User size={13} className="text-gray-400" />
                        </div>
                      </div>

                      <div className="rounded-2xl rounded-tr-sm bg-blue-500/10 border border-blue-500/20 px-4 py-3">
                        <p className="text-sm text-gray-200 leading-6">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="flex items-start gap-3">
                  {/* Ripple icon */}
                  <div className="w-8 h-8 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Sparkles size={15} className="text-blue-400" />
                  </div>

                  <div className="max-w-[90%] min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-300">
                        Ripple
                      </span>

                      <span className="text-[10px] text-gray-700">
                        AI Repository Assistant
                      </span>
                    </div>

                    {/* AI response */}
                    <div className="rounded-2xl rounded-tl-sm bg-[#10151c] border border-white/10 px-5 py-4">
                      <p className="text-sm text-gray-300 leading-7 whitespace-pre-line">
                        {message.content}
                      </p>

                      {/* File references */}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-5">
                          <div className="flex items-center gap-2 mb-3">
                            <FileCode2 size={14} className="text-blue-400" />

                            <span className="text-xs font-medium text-gray-400">
                              Relevant files
                            </span>
                          </div>

                          <div className="space-y-2">
                            {message.files.map((file) => (
                              <button
                                key={file.name}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-blue-500/20 hover:bg-blue-500/[0.03] transition text-left"
                              >
                                <FileCode2
                                  size={14}
                                  className="text-gray-500"
                                />

                                <span className="flex-1 text-xs text-gray-400 font-mono truncate">
                                  {file.name}
                                </span>

                                <span className="text-[10px] text-gray-700">
                                  {file.type}
                                </span>

                                <ArrowUpRight
                                  size={13}
                                  className="text-gray-700"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Code */}
                      {message.code && (
                        <div className="mt-5 rounded-xl overflow-hidden border border-white/10 bg-[#080b10]">
                          <div className="h-9 px-3 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-400/50" />
                                <span className="w-2 h-2 rounded-full bg-yellow-400/50" />
                                <span className="w-2 h-2 rounded-full bg-green-400/50" />
                              </div>

                              <span className="text-[10px] text-gray-600 font-mono">
                                code
                              </span>
                            </div>

                            <button
                              onClick={() => copyCode(message.code)}
                              className="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-gray-300 transition"
                            >
                              {copiedCode ? (
                                <>
                                  <Check size={12} />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>

                          <pre className="p-4 overflow-x-auto text-xs leading-6 text-gray-400 font-mono">
                            <code>{message.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Sparkles size={15} className="text-blue-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-300">
                      Ripple
                    </span>

                    <span className="text-[10px] text-gray-700">
                      analyzing repository
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#10151c] border border-white/10">
                    <Loader2 size={14} className="text-blue-400 animate-spin" />

                    <span className="text-xs text-gray-500">
                      Tracing relevant files...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            INPUT AREA
        ==================================================== */}
        <div className="shrink-0 border-t border-white/10 p-4 md:p-5 bg-[#0a0d12]">
          <div className="max-w-4xl mx-auto">
            {/* Quick hint */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <Lightbulb size={13} className="text-yellow-500/70" />

              <span className="text-[10px] text-gray-600">
                Ask about architecture, files, dependencies, APIs,
                authentication, or database usage.
              </span>
            </div>

            {/* Input */}
            <div className="relative flex items-end bg-[#0c1016] border border-white/10 rounded-xl focus-within:border-blue-500/30 transition">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Ripple about your repository..."
                rows={1}
                className="flex-1 resize-none bg-transparent outline-none text-sm text-gray-200 placeholder-gray-600 px-4 py-3.5 pr-14 max-h-32"
              />

              <button
                onClick={() => handleAsk()}
                disabled={!question.trim() || isThinking}
                className={`absolute right-2 bottom-2 w-9 h-9 rounded-lg flex items-center justify-center transition ${
                  question.trim() && !isThinking
                    ? "bg-blue-500 text-white hover:bg-blue-400"
                    : "bg-white/5 text-gray-700 cursor-not-allowed"
                }`}
                title="Send message"
              >
                {isThinking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-gray-700">
                Enter to send · Shift + Enter for new line
              </span>

              <span className="text-[10px] text-gray-700">Ripple AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AskRipple;

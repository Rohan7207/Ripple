import Groq from "groq-sdk";
import { AIProvider } from "./aiProvider.js";

export class GroqProvider extends AIProvider {
  constructor() {
    super();

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generate(prompt, options = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || "openai/gpt-oss-120b",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: options.temperature ?? 0,
      });

      return response.choices?.[0]?.message?.content || "";
    } catch (error) {
      console.log("GROQ ERROR:", error);
      const isTokenLimitError =
        error?.status === 413 ||
        error?.statusCode === 413 ||
        error?.code === "rate_limit_exceeded" ||
        error?.error?.code === "rate_limit_exceeded" ||
        error?.error?.error?.code === "rate_limit_exceeded" ||
        error?.message?.includes("tokens per minute");

      if (isTokenLimitError) {
        const friendlyError = new Error(
          "Ripple AI reached its token limit for this request. Please try a shorter request or wait a few seconds before trying again.",
        );

        friendlyError.code = "AI_TOKEN_LIMIT";
        friendlyError.statusCode = 429;

        throw friendlyError;
      }

      throw error;
    }
  }
}

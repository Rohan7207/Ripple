import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "./aiProvider.js";

export class GeminiProvider extends AIProvider {
  constructor() {
    super();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generate(prompt, options = {}) {
    try {
      const response = await this.client.models.generateContent({
        model: options.model || "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: options.temperature ?? 0,
        },
      });

      return response.text || "";
    } catch (error) {
      console.log("GEMINI ERROR:", error);

      const isTokenLimitError =
        error?.status === 429 ||
        error?.statusCode === 429 ||
        error?.message?.toLowerCase()?.includes("rate limit") ||
        error?.message?.toLowerCase()?.includes("quota") ||
        error?.message?.toLowerCase()?.includes("resource exhausted");

      if (isTokenLimitError) {
        const friendlyError = new Error(
          "Ripple AI reached the AI request limit. Please try again shortly.",
        );

        friendlyError.code = "AI_TOKEN_LIMIT";
        friendlyError.statusCode = 429;

        throw friendlyError;
      }

      throw error;
    }
  }
}

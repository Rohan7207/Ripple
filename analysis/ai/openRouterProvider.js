import { AIProvider } from "./aiProvider.js";

export class OpenRouterProvider extends AIProvider {
  constructor() {
    super();

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    this.apiKey = process.env.OPENROUTER_API_KEY;
  }

  async generate(prompt, options = {}) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ripple-rosy-seven.vercel.app",
            "X-Title": "Ripple AI",
          },
          body: JSON.stringify({
            model: options.model || "nvidia/nemotron-3.5-lightning:free",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: options.temperature ?? 0,
            max_tokens: options.maxTokens ?? 1200,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("OPENROUTER ERROR:", data);

        const error = new Error(
          data?.error?.message || "OpenRouter request failed",
        );

        error.statusCode = response.status;
        error.code =
          response.status === 429 ? "AI_TOKEN_LIMIT" : "AI_PROVIDER_ERROR";

        throw error;
      }

      return data?.choices?.[0]?.message?.content || "";
    } catch (error) {
      console.error("OPENROUTER ERROR:", error);

      if (!error.code) {
        error.code = "AI_PROVIDER_ERROR";
      }

      throw error;
    }
  }
}

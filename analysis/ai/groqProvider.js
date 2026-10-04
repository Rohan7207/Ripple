import Groq from "groq-sdk";
import { AIProvider } from "./aiProvider.js";

export class GroqProvider extends AIProvider {
  constructor() {
    super();

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async generate(prompt, options = {}) {
    const response = await this.client.chat.completions.create({
      model:
        options.model ||
       "openai/gpt-oss-120b",

      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      temperature:
        options.temperature ?? 0
    });

    return response.choices?.[0]?.message?.content || "";
  }
}
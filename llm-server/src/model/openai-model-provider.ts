import { Response } from "express";
import OpenAI from "openai";
import { ModelProvider } from "./model-provider.js";
import { Logger } from "@nestjs/common";
export class OpenAIModelProvider extends ModelProvider {
  private readonly logger = new Logger(OpenAIModelProvider.name);
  private openai: OpenAI;

  async initialize(): Promise<void> {
    this.logger.log("Initializing OpenAI model...");
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.logger.log("OpenAI model initialized.");
  }

  async generateStreamingResponse(
    content: string,
    res: Response
  ): Promise<void> {
    this.logger.log("Generating streaming response with OpenAI...");
    const startTime = Date.now();
    // Set SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    try {
      const stream = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: content }],
        stream: true,
      });
      let chunkCount = 0;
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          chunkCount++;
          this.logger.debug(`Sending chunk #${chunkCount}: "${content}"`);
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
      }
      const endTime = Date.now();
      this.logger.log(
        `Response generation completed. Total chunks: ${chunkCount}`
      );
      this.logger.log(`Generation time: ${endTime - startTime}ms`);
      res.write(`data: [DONE]\n\n`);
      res.end();
      this.logger.log("Response stream ended.");
    } catch (error) {
      this.logger.error("Error during OpenAI response generation:", error);
      res.write(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    }
  }
}

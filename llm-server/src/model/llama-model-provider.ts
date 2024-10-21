import { Response } from "express";
import path from "path";
import {
  getLlama,
  LlamaChatSession,
  LlamaContext,
  LlamaModel,
} from "node-llama-cpp";
import { ModelProvider } from "./model-provider.js";
import { Logger } from "@nestjs/common";

//TODO: using protocol class
export class LlamaModelProvider extends ModelProvider {
  private readonly logger = new Logger(LlamaModelProvider.name);
  private model: LlamaModel;
  private context: LlamaContext;

  async initialize(): Promise<void> {
    this.logger.log("Initializing Llama model...");
    const llama = await getLlama();
    const modelPath = path.join(
      process.cwd(),
      "models",
      "LLAMA-3.2-1B-OpenHermes2.5.IQ4_XS.gguf"
    );
    this.logger.log(`Loading model from path: ${modelPath}`);
    this.model = await llama.loadModel({
      modelPath: modelPath,
    });
    this.logger.log("Model loaded successfully.");
    this.context = await this.model.createContext();
    this.logger.log("Llama model initialized and context created.");
  }

  async generateStreamingResponse(
    content: string,
    res: Response
  ): Promise<void> {
    this.logger.log("Generating streaming response with Llama...");
    const session = new LlamaChatSession({
      contextSequence: this.context.getSequence(),
    });
    this.logger.log("LlamaChatSession created.");
    let chunkCount = 0;
    const startTime = Date.now();
    try {
      await session.prompt(content, {
        onTextChunk: (chunk) => {
          chunkCount++;
          this.logger.debug(`Sending chunk #${chunkCount}: "${chunk}"`);
          res.write(
            `data: ${JSON.stringify({ role: "bot", content: chunk })}\n\n`
          );
        },
      });
      const endTime = Date.now();
      this.logger.log(
        `Response generation completed. Total chunks: ${chunkCount}`
      );
      this.logger.log(`Generation time: ${endTime - startTime}ms`);
      res.write(`data: [DONE]\n\n`);
      res.end();
      this.logger.log("Response stream ended.");
    } catch (error) {
      this.logger.error("Error during response generation:", error);
      res.write(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    }
  }
}

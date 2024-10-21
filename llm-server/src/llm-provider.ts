import express, { Express, Request, Response } from "express";
import { ModelProvider } from "./model/model-provider.js";
import { OpenAIModelProvider } from "./model/openai-model-provider.js";
import { LlamaModelProvider } from "./model/llama-model-provider.js";
import { Logger } from "@nestjs/common";

export interface ChatMessageInput {
  content: string;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export class LLMProvider {
  private readonly logger = new Logger(LLMProvider.name);
  private modelProvider: ModelProvider;

  constructor(modelProviderType: "llama" | "openai" = "llama") {
    if (modelProviderType === "openai") {
      this.modelProvider = new OpenAIModelProvider();
    } else {
      this.modelProvider = new LlamaModelProvider();
    }
  }

  async initialize(): Promise<void> {
    this.logger.log("Initializing LLM provider...");
    await this.modelProvider.initialize();
    this.logger.log("LLM provider fully initialized and ready.");
  }

  async generateStreamingResponse(
    content: string,
    res: Response
  ): Promise<void> {
    await this.modelProvider.generateStreamingResponse(content, res);
  }
}

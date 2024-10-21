import { Logger } from "@nestjs/common";
import { ChatMessageInput, LLMProvider } from "./llm-provider.js";
import express, { Express, Request, Response } from "express";

export class App {
  private readonly logger = new Logger(App.name);
  private app: Express;
  private readonly PORT: number;
  private llmProvider: LLMProvider;

  constructor(llmProvider: LLMProvider) {
    this.app = express();
    this.app.use(express.json());
    this.PORT = parseInt(process.env.PORT || "3001", 10);
    this.llmProvider = llmProvider;
    this.logger.log(`App initialized with PORT: ${this.PORT}`);
  }

  setupRoutes(): void {
    this.logger.log("Setting up routes...");
    this.app.post("/chat/completion", this.handleChatRequest.bind(this));
    this.logger.log("Routes set up successfully.");
  }

  private async handleChatRequest(req: Request, res: Response): Promise<void> {
    this.logger.log("Received chat request.");
    try {
      this.logger.debug(JSON.stringify(req.body));
      const { content } = req.body as ChatMessageInput;
      this.logger.debug(`Request content: "${content}"`);
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      this.logger.debug("Response headers set for streaming.");
      await this.llmProvider.generateStreamingResponse(content, res);
    } catch (error) {
      this.logger.error("Error in chat endpoint:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async start(): Promise<void> {
    this.setupRoutes();
    this.app.listen(this.PORT, () => {
      this.logger.log(`Server running on port ${this.PORT}`);
    });
  }
}

async function main() {
  const logger = new Logger("Main");
  try {
    const llmProvider = new LLMProvider("openai");
    await llmProvider.initialize();
    const app = new App(llmProvider);
    await app.start();
  } catch (error) {
    logger.error("Failed to start the application:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Failed to start the application:", error);
  process.exit(1);
});

import { Response } from "express";

export abstract class ModelProvider {
  abstract initialize(): Promise<void>;
  abstract generateStreamingResponse(
    content: string,
    res: Response
  ): Promise<void>;
}

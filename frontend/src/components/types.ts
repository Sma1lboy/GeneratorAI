export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface Attachment {
  contentType: string;
  url: string;
}

export interface ChatRequestOptions {
  selectedModel?: string;
  images?: string[];
  attachments?: Attachment[];
}

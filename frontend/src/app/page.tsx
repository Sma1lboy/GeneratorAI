"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import UsernameForm from "@/components/username-form";
import { getSelectedModel } from "@/lib/model-helper";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import useChatStore from "./hooks/useChatStore";
import { Message } from "@/components/types";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [chatId, setChatId] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>(
    getSelectedModel()
  );
  const [open, setOpen] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const base64Images = useChatStore((state) => state.base64Images);
  const setBase64Images = useChatStore((state) => state.setBase64Images);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (messages.length < 1) {
      const id = uuidv4();
      setChatId(id);
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading && !error && chatId && messages.length > 0) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      window.dispatchEvent(new Event("storage"));
    }
  }, [chatId, isLoading, error, messages]);

  useEffect(() => {
    // 初始化 WebSocket 连接
    ws.current = new WebSocket("ws://localhost:8080/graphql");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Connection error. Retrying...");
    };

    if (!localStorage.getItem("ollama_user")) {
      setOpen(true);
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const stop = () => {
    // 实现停止生成的逻辑
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "stop",
          id: chatId,
        })
      );
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !input.trim() ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    setLoadingSubmit(true);

    const newMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const attachments = base64Images
      ? base64Images.map((image) => ({
          contentType: "image/base64",
          url: image,
        }))
      : [];

    // GraphQL subscription 请求
    const subscriptionMsg = {
      type: "start",
      id: Date.now().toString(),
      payload: {
        query: `
          subscription ChatStream($input: ChatInputType!) {
            chatStream(input: $input) {
              choices {
                delta {
                  content
                }
                finish_reason
                index
              }
              created
              id
              model
              object
            }
          }
        `,
        variables: {
          input: {
            message: input,
            chatId,
            model: selectedModel,
            attachments,
          },
        },
      },
    };

    try {
      // 设置消息处理器
      ws.current.onmessage = (event) => {
        const response = JSON.parse(event.data);

        if (response.type === "data" && response.payload.data) {
          const chunk = response.payload.data.chatStream;
          const content = chunk.choices[0]?.delta?.content;

          if (content) {
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMsg, content: lastMsg.content + content },
                ];
              } else {
                return [
                  ...prev,
                  {
                    id: chunk.id,
                    role: "assistant",
                    content,
                    createdAt: new Date(chunk.created * 1000).toISOString(),
                  },
                ];
              }
            });
          }

          if (chunk.choices[0]?.finish_reason === "stop") {
            setLoadingSubmit(false);
            // 保存到本地存储
            localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
            window.dispatchEvent(new Event("storage"));
          }
        }
      };

      // 发送订阅请求
      ws.current.send(JSON.stringify(subscriptionMsg));
      setBase64Images(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
      setLoadingSubmit(false);
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    const username = localStorage.getItem("ollama_user");
    if (username) return setOpen(isOpen);

    localStorage.setItem("ollama_user", "Anonymous");
    window.dispatchEvent(new Event("storage"));
    setOpen(isOpen);
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <ChatLayout
          chatId={chatId}
          setSelectedModel={setSelectedModel}
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={onSubmit}
          isLoading={isLoading}
          loadingSubmit={loadingSubmit}
          error={error}
          stop={stop}
          navCollapsedSize={10}
          defaultLayout={[30, 160]}
          formRef={formRef}
          setMessages={setMessages}
          setInput={setInput}
        />
        <DialogContent className="flex flex-col space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Welcome to Ollama!</DialogTitle>
            <DialogDescription>
              Enter your name to get started. This is just to personalize your
              experience.
            </DialogDescription>
            <UsernameForm setOpen={setOpen} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}

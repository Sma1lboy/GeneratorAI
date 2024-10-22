"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { getSelectedModel } from "@/lib/model-helper";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useChatStore from "../hooks/useChatStore";
import { Message } from "@/components/types";

interface ChatStreamResponse {
  chatStream: {
    choices: Array<{
      delta: {
        content?: string | null;
      };
      finish_reason?: string | null;
      index: number;
    }>;
    created: number;
    id: string;
    model: string;
    object: string;
  };
}

interface Attachment {
  contentType: string;
  url: string;
}

export default function Page({ params }: { params: { id: string } }) {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(
    getSelectedModel()
  );
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const base64Images = useChatStore((state) => state.base64Images);
  const setBase64Images = useChatStore((state) => state.setBase64Images);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");

  // 初始化 WebSocket 连接
  useEffect(() => {
    initWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // 加载历史消息
  useEffect(() => {
    if (params.id) {
      loadChatHistory(params.id);
    }
  }, [params.id]);

  // 保存消息到本地存储
  useEffect(() => {
    if (!isLoading && !error && messages.length > 0) {
      localStorage.setItem(`chat_${params.id}`, JSON.stringify(messages));
      window.dispatchEvent(new Event("storage"));
    }
  }, [messages, isLoading, error, params.id]);

  const initWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:8080/graphql");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Connection error. Retrying...");
      setTimeout(initWebSocket, 3000);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
      setTimeout(initWebSocket, 3000);
    };
  };

  const loadChatHistory = async (chatId: string) => {
    try {
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetChatHistory($chatId: ID!) {
              getChatHistory(chatId: $chatId) {
                id
                role
                content
                createdAt
              }
            }
          `,
          variables: {
            chatId,
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const savedMessages = data.data.getChatHistory || [];
      setMessages(savedMessages);
    } catch (error) {
      console.error("Error loading chat history:", error);
      // 尝试从本地存储加载
      const localMessages = localStorage.getItem(`chat_${chatId}`);
      if (localMessages) {
        setMessages(JSON.parse(localMessages));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const stop = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "stop",
          id: params.id,
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
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        toast.error("Connection lost. Reconnecting...");
        initWebSocket();
      }
      return;
    }

    setLoadingSubmit(true);

    const newMessage: Message = {
      id: params.id,
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setCurrentAssistantMessage("");

    const attachments = base64Images
      ? base64Images.map((image) => ({
          contentType: "image/base64",
          url: image,
        }))
      : [];

    // 发送 GraphQL subscription 请求
    const subscriptionMsg = {
      type: "start",
      id: Date.now().toString(),
      payload: {
        query: `
          subscription ChatStream($input: ChatInput!) {
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
            chatId: params.id,
            model: selectedModel,
            attachments,
          },
        },
      },
    };

    try {
      ws.current.onmessage = (event) => {
        const response = JSON.parse(event.data);

        if (response.type === "data" && response.payload.data) {
          const chunk = response.payload.data.chatStream;
          const content = chunk.choices[0]?.delta?.content;

          if (content) {
            setCurrentAssistantMessage((prev) => prev + content);
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMsg,
                    content: lastMsg.content + content,
                  },
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
            setCurrentAssistantMessage("");

            // 保存消息
            localStorage.setItem(`chat_${params.id}`, JSON.stringify(messages));
            window.dispatchEvent(new Event("storage"));
          }
        }
      };

      ws.current.send(JSON.stringify(subscriptionMsg));
      setBase64Images(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send message");
      setLoadingSubmit(false);
    }
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <ChatLayout
        chatId={params.id}
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
    </main>
  );
}

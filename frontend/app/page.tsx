"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatArea } from "../components/ChatArea";
import { useSendMessage } from "@/hooks/queries/message";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleToggleFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (!apiKey) {
      alert("Please enter an API key");
      return;
    }
    if (!input.trim()) return;

    const userMsg = input;
    // Add user message
    const newMessage = { role: "user" as const, content: userMsg };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Add placeholder for assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    sendMessage(
      {
        payload: { user_message: userMsg, file_ids: selectedFileIds, openai_api_key: apiKey },
        onChunk: (chunk) => {
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg.role === "assistant") {
              const cleanChunk = chunk.replace("\n[END]", "");
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, content: lastMsg.content + cleanChunk },
              ];
            }
            return prev;
          });
        }
      },
      {
        onError: () => {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: "Error: Failed to get response." },
          ]);
        }
      }
    );
  };

  return (
    <main className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <Sidebar
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
        selectedFileIds={selectedFileIds}
        onToggleFile={handleToggleFile}
      />
      <ChatArea
        messages={messages}
        input={input}
        setInput={setInput}
        onSend={handleSend}
        loading={isPending}
      />
    </main>
  );
}

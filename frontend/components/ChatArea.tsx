import React, { useRef, useEffect } from "react";
import { Button } from "./ui/Button";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatAreaProps {
    messages: Message[];
    input: string;
    setInput: (input: string) => void;
    onSend: () => void;
    loading: boolean;
}

export function ChatArea({
    messages,
    input,
    setInput,
    onSend,
    loading,
}: ChatAreaProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && !loading) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col bg-white">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="mx-auto max-w-3xl flex flex-col gap-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-zinc-500">
                            <p className="text-lg font-medium">No messages yet</p>
                            <p className="text-sm">Upload a document and start chatting!</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-zinc-900 text-zinc-50"
                                        : "bg-zinc-100 text-zinc-900 border border-zinc-200"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-zinc-200 p-4">
                <div className="mx-auto max-w-3xl">
                    <div className="relative flex items-end gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm focus-within:ring-1 focus-within:ring-black">
                        <textarea
                            className="flex-1 max-h-36 min-h-[44px] w-full resize-none border-0 bg-transparent py-2.5 px-2 text-sm focus:ring-0 focus:outline-none placeholder:text-zinc-400"
                            placeholder="Ask a question about your documents..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button
                            className="mb-1 rounded-lg px-3"
                            onClick={onSend}
                            disabled={!input.trim() || loading}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22 2L11 13"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M22 2L15 22L11 13L2 9L22 2Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Button>
                    </div>
                    <p className="mt-2 text-center text-xs text-zinc-400">
                        AI can make mistakes. Please review information.
                    </p>
                </div>
            </div>
        </div>
    );
}

import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";

interface MessageRequest {
    user_message: string;
    file_ids?: string[];
    openai_api_key: string;
}

export const useSendMessage = () => {
    return useMutation({
        mutationFn: async ({
            payload,
            onChunk,
        }: {
            payload: MessageRequest;
            onChunk: (chunk: string) => void;
        }) => {
            const response = await fetch(`${API_BASE_URL}/api/v1/message/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            if (!response.body) {
                throw new Error("ReadableStream not yet supported in this browser.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                onChunk(chunk);
            }
        },
    });
};

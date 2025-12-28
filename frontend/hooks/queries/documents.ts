import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Document {
    file_id: string;
    filename: string;
}

interface DocumentListResponse {
    status: string;
    documents: Document[];
}

interface UploadResponse {
    status: string;
    files: Document[];
}

export const useDocuments = () => {
    return useQuery({
        queryKey: ["documents"],
        queryFn: () => api.get<DocumentListResponse>("/api/v1/documents/list"),
        select: (data) => data.documents,
    });
};

export const useUploadDocuments = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            files,
            openai_api_key,
        }: {
            files: File[];
            openai_api_key: string;
        }) => {
            const formData = new FormData();

            files.forEach((file) => {
                formData.append("files", file);
            });

            formData.append("openai_api_key", openai_api_key)

            return api.post<UploadResponse>(
                "/api/v1/documents/upload",
                formData
            );
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
};

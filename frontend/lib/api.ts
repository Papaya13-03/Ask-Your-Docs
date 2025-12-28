
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiOptions extends RequestInit {
    params?: Record<string, string>;
}

async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    let url = `${API_BASE_URL}${endpoint}`;

    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
        ...fetchOptions,
        headers: {
            ...fetchOptions.headers,
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || "API request failed");
    }

    // Some endpoints might return empty body
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, options?: ApiOptions) =>
        apiFetch<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body: unknown, options?: ApiOptions) => {
        // Check if body is FormData, if so, let browser set Content-Type
        const isFormData = body instanceof FormData;
        const headers: HeadersInit = isFormData
            ? {}
            : { "Content-Type": "application/json" };

        if (options?.headers) {
            Object.assign(headers, options.headers);
        }

        return apiFetch<T>(endpoint, {
            ...options,
            method: "POST",
            body: isFormData ? (body as FormData) : JSON.stringify(body),
            headers,
        });
    },

    put: <T>(endpoint: string, body: unknown, options?: ApiOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json", ...options?.headers },
        }),

    delete: <T>(endpoint: string, options?: ApiOptions) =>
        apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};

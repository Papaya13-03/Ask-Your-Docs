import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";

export interface UploadedFile {
    id: string;
    file_path: string;
    filename: string;
    // ... other fields from backend
}

interface SidebarProps {
    apiKey: string;
    setApiKey: (key: string) => void;
    model: string;
    setModel: (model: string) => void;
    selectedFileIds: string[];
    onToggleFile: (fileId: string) => void;
}

import { useDocuments, useUploadDocuments } from "@/hooks/queries/documents";

export function Sidebar({
    apiKey,
    setApiKey,
    model,
    setModel,
    selectedFileIds,
    onToggleFile,
}: SidebarProps) {
    const { data: documents, isLoading, error } = useDocuments();
    const uploadMutation = useUploadDocuments();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!apiKey) {
            alert("Please enter an API key");
            return;
        }
        if (e.target.files && e.target.files.length > 0) {
            uploadMutation.mutate({
                files: Array.from(e.target.files),
                openai_api_key: apiKey,
            });
            // Reset input
            e.target.value = "";
        }
    };

    return (
        <aside className="flex w-100 flex-col border-r border-zinc-200 bg-zinc-50 p-4 shrink-0 h-full">
            <div className="flex flex-col gap-6">
                {/* Header/Title */}
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">Ask Your Docs</h2>
                    <p className="text-xs text-zinc-500">Document Chat Assistant</p>
                </div>

                {/* Configuration */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            API Key
                        </label>
                        <Input
                            type="password"
                            placeholder="Enter API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>

                    {/* <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Model
                        </label>
                        <Select value={model} onChange={(e) => setModel(e.target.value)}>
                            <option value="gpt-4o">GPT-4o</option>
                            <option value="gpt-4-turbo">GPT-4 Turbo</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                        </Select>
                    </div> */}
                </div>

                {/* Upload Section */}
                <div className="space-y-3 pt-4 border-t border-zinc-200">
                    <label className="text-sm font-medium leading-none">Documents</label>

                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:bg-zinc-700 hover:border-zinc-500 dark:border-zinc-600 dark:hover:border-zinc-500"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg aria-hidden="true" className="w-8 h-8 mb-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    <span className="font-semibold">Click to upload</span>
                                </p>
                            </div>
                            <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                multiple
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* File List */}
                    <div className="mt-4 flex flex-col gap-2 overflow-y-auto max-h-[50vh]">
                        {isLoading && <p className="text-xs text-zinc-500 text-center">Loading documents...</p>}
                        {error && <p className="text-xs text-red-500 text-center">Error loading documents</p>}
                        {uploadMutation.isPending && (
                            <div className="flex items-center justify-center p-2">
                                <span className="text-xs text-zinc-500 animate-pulse">Uploading...</span>
                            </div>
                        )}

                        {documents?.map((doc) => {
                            const isSelected = selectedFileIds.includes(doc.file_id);
                            return (
                                <div
                                    key={doc.file_id}
                                    onClick={() => onToggleFile(doc.file_id)}
                                    className={`flex items-center gap-2 rounded-md border p-2 text-sm shadow-sm cursor-pointer transition-colors ${isSelected
                                        ? "border-zinc-900 bg-zinc-100 ring-1 ring-zinc-900"
                                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 pointer-events-none"
                                    />
                                    <svg
                                        className="h-4 w-4 text-zinc-500 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <span className="truncate text-zinc-700 font-medium" title={doc.filename}>{doc.filename}</span>
                                </div>
                            );
                        })}
                        {!isLoading && documents?.length === 0 && (
                            <p className="text-xs text-zinc-500 text-center py-4">No documents found</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-200">
                <p className="text-[10px] text-zinc-400 text-center">Powered by Your LLM</p>
            </div>
        </aside>
    );
}

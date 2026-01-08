"use client";

import React, { useId, useRef, useState } from "react";

type UploadBoxProps = {
  title: string;
  subtitle: string;
  hint: string;
  multiple?: boolean;
  accept?: string; // e.g. ".pdf,.docx,image/*"
  onFilesChange?: (files: File[]) => void;
};

export default function UploadBox({
  title,
  subtitle,
  hint,
  multiple = true,
  accept,
  onFilesChange,
}: UploadBoxProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const openPicker = () => inputRef.current?.click();

  const commitFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const next = Array.from(fileList);

    // If multiple=false, keep only first file
    const finalFiles = multiple ? next : next.slice(0, 1);

    setFiles(finalFiles);
    onFilesChange?.(finalFiles);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    commitFiles(e.dataTransfer.files);
  };

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onFilesChange?.(next);

    // allow re-uploading same file name
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <div className="text-lg font-bold text-gray-700 mb-3">{title}</div>

      {/* hidden input */}
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={accept}
        onChange={(e) => commitFiles(e.target.files)}
      />

      {/* dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          "rounded-xl border border-green-700 p-12 text-center cursor-pointer transition",
          "focus:outline-none focus:ring-2 focus:ring-green-800",
          isDragging
            ? "bg-green-50 ring-2 ring-green-700"
            : "bg-white hover:bg-gray-50",
        ].join(" ")}
      >
        {/* icon */}
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center ">
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.75 21.75V28.4167C31.75 29.3007 31.3988 30.1486 30.7737 30.7737C30.1486 31.3988 29.3007 31.75 28.4167 31.75H5.08333C4.19928 31.75 3.35143 31.3988 2.72631 30.7737C2.10119 30.1486 1.75 29.3007 1.75 28.4167V21.75M25.0833 10.0833L16.75 1.75M16.75 1.75L8.41667 10.0833M16.75 1.75V21.75"
              stroke="#1E1E1E"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-sm text-gray-600">{subtitle}</div>
        <div className="text-sm text-gray-500 mt-2">{hint}</div>

        <div className="mt-4 text-xs text-gray-500">
          Click to upload or drag & drop here
        </div>
      </div>

      {/* selected files list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-800">
                  {f.name}
                </div>
                <div className="text-xs text-gray-500">
                  {(f.size / 1024).toFixed(1)} KB
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="ml-4 rounded-md border border-red-300 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

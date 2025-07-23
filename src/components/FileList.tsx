"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
/**
 * Types
 */
interface StorageObject {
  name: string;
  updated_at?: string;
  created_at?: string;
  metadata?: { size?: number };
}

type FileItem = StorageObject & { url: string };

export type ViewMode = "list" | "thumb" | "detail";

interface FileListProps {
  viewMode: ViewMode;
}

export default function FileList({ viewMode }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FileItem | null>(null);

  /* ---------------- fetch user files ---------------- */
  useEffect(() => {
    async function fetchFiles() {
      setLoading(true);
      const { data: authData, error } = await supabase.auth.getUser();
      if (error || !authData.user) {
        setLoading(false);
        return;
      }
      const userId = authData.user.id;

      const { data: list, error: listError } = await supabase.storage
        .from("nimbus-uploads")
        .list(userId);
      if (listError || !list) {
        setLoading(false);
        return;
      }

      const withUrls: FileItem[] = await Promise.all(
        list.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from("nimbus-uploads")
            .createSignedUrl(`${userId}/${file.name}`, 60 * 60);
          return { ...file, url: urlData?.signedUrl ?? "" };
        })
      );

      setFiles(withUrls);
      setLoading(false);
    }

    fetchFiles();
  }, []);

  /* ---------------- helpers ---------------- */
  function formatBytes(bytes: number = 0) {
    if (!bytes) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(1)} ${units[i]}`;
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  }

  function isImage(f: FileItem) {
    return /\.(png|jpe?g|gif|webp|bmp)$/i.test(f.name);
  }

  async function deleteFile(filename: string) {
    const { data: authData, error } = await supabase.auth.getUser();
    if (error || !authData.user) return;
    const userId = authData.user.id;

    await supabase.storage.from("nimbus-uploads").remove([`${userId}/${filename}`]);
    setFiles((prev) => prev.filter((f) => f.name !== filename));
    if (selected?.name === filename) setSelected(null);
  }

  /* ---------------- render blocks ---------------- */
  if (loading) return <p className="mt-4 text-gray-500">Loading...</p>;
  if (files.length === 0) return <p className="mt-4 text-gray-500">No files uploaded yet.</p>;

  return (
    <div className="mt-6 flex gap-4">
      {/* ---------- FILE LIST AREA ---------- */}
      <div className="flex-1 overflow-auto max-h-[70vh] pr-2">
        {viewMode === "list" &&
          files.map((file) => (
            <div
              key={file.name}
              className={`flex justify-between items-center py-1 border-b cursor-pointer ${
                selected?.name === file.name ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelected(file)}
            >
              <span className="truncate w-3/4">{file.name}</span>
              <div className="space-x-2 shrink-0">
                <a
                  href={file.url}
                  className="text-blue-600 text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.name);
                  }}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        {viewMode === "thumb" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.name}
                className={`text-center cursor-pointer ${
                  selected?.name === file.name ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelected(file)}
              >
                <Image src={file.url} alt={file.name} className="rounded shadow object-cover max-h-32 mx-auto" />
                <p className="mt-2 text-xs text-gray-600 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        {viewMode === "detail" && (
          <table className="w-full text-sm text-left border-collapse mt-4">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="py-2">Name</th>
                <th>Size</th>
                <th>Last Modified</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.name}
                  className={`border-b cursor-pointer ${
                    selected?.name === file.name ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelected(file)}
                >
                  <td className="py-2 truncate max-w-xs">{file.name}</td>
                  <td>{formatBytes(file.metadata?.size ?? 0)}</td>
                  <td>{formatDate(file.updated_at ?? file.created_at)}</td>
                  <td className="text-right space-x-2">
                    <a
                      href={file.url}
                      className="text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.name);
                      }}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------- PREVIEW PANE ---------- */}
      <div className="w-80 shrink-0 border rounded p-3 shadow max-h-[70vh] overflow-auto">
        {selected ? (
          <>
            <h2 className="font-semibold text-sm mb-2 truncate" title={selected.name}>
              {selected.name}
            </h2>
            {isImage(selected) ? (
              <Image
                src={selected.url}
                alt={selected.name}
                className="w-full h-auto rounded mb-3"
              />
            ) : (
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded mb-3 text-gray-500 text-sm">
                No preview available
              </div>
            )}
            <p className="text-xs text-gray-600 mb-1">
              Size: {formatBytes(selected.metadata?.size ?? 0)}
            </p>
            <p className="text-xs text-gray-600 mb-3">
              Last Modified: {formatDate(selected.updated_at ?? selected.created_at)}
            </p>
            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white text-xs rounded w-full text-center"
            >
              Open / Download
            </a>
          </>
        ) : (
          <p className="text-xs text-gray-500">Select a file to preview.</p>
        )}
      </div>
    </div>
  );
}

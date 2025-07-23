"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type StorageObject = {
  name: string;
  updated_at?: string;
  created_at?: string;
  metadata?: { size?: number };
};

type FileItem = StorageObject & { url: string };

type ViewMode = "list" | "thumb" | "detail";

interface FileListProps {
  viewMode: ViewMode;
}

export default function FileList({ viewMode }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setLoading(false);
        return;
      }
      const userId = data.user.id;

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

  async function deleteFile(filename: string) {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return;
    const userId = data.user.id;

    await supabase.storage
      .from("nimbus-uploads")
      .remove([`${userId}/${filename}`]);

    setFiles((prev) => prev.filter((f) => f.name !== filename));
  }

  if (loading) return <p className="mt-4 text-gray-500">Loading...</p>;
  if (files.length === 0)
    return <p className="mt-4 text-gray-500">No files uploaded yet.</p>;

  return (
    <div className="mt-6">
      {viewMode === "list" &&
        files.map((file) => (
          <div
            key={file.name}
            className="flex justify-between items-center py-1 border-b"
          >
            <span className="truncate w-3/4">{file.name}</span>
            <div className="space-x-2">
              <a
                href={file.url}
                className="text-blue-600 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
              <button
                onClick={() => deleteFile(file.name)}
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
            <div key={file.name} className="text-center">
              <img
                src={file.url}
                alt={file.name}
                className="rounded shadow object-cover max-h-32 mx-auto"
              />
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
              <tr key={file.name} className="border-b">
                <td className="py-2 truncate max-w-xs">{file.name}</td>
                <td>{formatBytes(file.metadata?.size ?? 0)}</td>
                <td>{formatDate(file.updated_at ?? file.created_at)}</td>
                <td className="text-right space-x-2">
                  <a
                    href={file.url}
                    className="text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => deleteFile(file.name)}
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
  );
}

function formatBytes(bytes: number) {
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

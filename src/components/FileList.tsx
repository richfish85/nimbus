"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"

type NimbusFile = {
  name: string;
  url: string;
  metadata?: {
    size?: number;
    [key: string]: unknown;
  };
  updated_at?: string;
  created_at?: string;
};

export default function FileList({ viewMode }: { viewMode: "list" | "thumb" | "detail" }) {
  const [files, setFiles] = useState<NimbusFile[]>([])

  useEffect(() => {
    async function fetchFiles() {
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId) return

      const { data: list, error } = await supabase.storage.from("nimbus-uploads").list(userId)
      if (!error && list) {
        const withUrls = await Promise.all(
          list.map(async (file) => {
            const { data } = await supabase.storage.from("nimbus-uploads").createSignedUrl(`${userId}/${file.name}`, 60 * 60)
            return { ...file, url: data?.signedUrl || "" }
          })
        )
        setFiles(withUrls)
      }
    }

    fetchFiles()
  }, [])

  async function deleteFile(filename: string) {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) return

    await supabase.storage.from("nimbus-uploads").remove([`${userId}/${filename}`])
    setFiles((prev) => prev.filter((f) => f.name !== filename))
  }

  return (
    <div className="mt-6">
      {viewMode === "list" && files.map(file => (
        <div key={file.name} className="flex justify-between items-center py-1 border-b">
          <span className="truncate w-3/4">{file.name}</span>
          <div className="space-x-2">
            <a href={file.url} className="text-blue-600 text-sm">Download</a>
            <button onClick={() => deleteFile(file.name)} className="text-red-600 text-sm">Delete</button>
          </div>
        </div>
      ))}

      {viewMode === "thumb" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {files.map(file => (
            <div key={file.name} className="flex flex-col items-center">
              <Image
                src={file.url}
                alt={file.name}
                width={128}
                height={128}
                className="rounded shadow object-cover max-h-32 mx-auto"
                style={{ objectFit: "cover" }}
              />
              <Image
                src={file.url}
                alt={file.name}
                width={128}
                height={128}
                className="rounded shadow object-cover max-h-32 mx-auto"
                style={{ objectFit: "cover" }}
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
            {files.map(file => (
              <tr key={file.name} className="border-b">
                <td className="py-2 truncate max-w-xs">{file.name}</td>
                <td>{formatBytes(file.metadata?.size || 0)}</td>
                <td>{formatDate(file.updated_at || file.created_at || "")}</td>
                <td className="text-right space-x-2">
                  <a href={file.url} className="text-blue-600">Download</a>
                  <button onClick={() => deleteFile(file.name)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"]
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(1)} ${units[i]}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString()
}

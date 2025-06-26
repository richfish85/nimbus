// components/FileList.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type SupabaseFile = {
  name: string
  updated_at?: string
  created_at?: string
  last_accessed_at?: string
  metadata?: Record<string, unknown>
}

export default function FileList() {
  const [files, setFiles] = useState<SupabaseFile[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchFiles() {
    setLoading(true)

    const user = await supabase.auth.getUser()
    const userId = user.data.user?.id

    const { data, error } = await supabase.storage
      .from("nimbus-uploads")
      .list(userId + "/", { limit: 100, offset: 0 })

    if (!error && data) {
      setFiles(data)
    }

    setLoading(false)
  }

  async function handleDelete(fileName: string) {
    const user = await supabase.auth.getUser()
    const filePath = `${user.data.user?.id}/${fileName}`

    await supabase.storage.from("nimbus-uploads").remove([filePath])
    fetchFiles()
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  if (loading) return <p>Loading files...</p>
  if (files.length === 0) return <p>No files uploaded yet.</p>

  return (
    <ul className="mt-4 space-y-2">
      {files.map((file) => (
        <li key={file.name} className="flex justify-between items-center">
          <span>{file.name}</span>
          <div className="space-x-2">
            <a
              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/nimbus-uploads/${file.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Download
            </a>
            <button
              className="text-red-500"
              onClick={() => handleDelete(file.name)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

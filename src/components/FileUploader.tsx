"use client"

import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function FileUploader({ onUpload }: { onUpload: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true)
    setError(null)

    const { data: userData, error: userError } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (userError || !userId) {
      setError("Authentication error.")
      setUploading(false)
      return
    }

    const filePath = `${userId}/${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("nimbus-uploads")
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
    } else {
      onUpload()
    }

    setUploading(false)
  }, [onUpload])

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  return (
    <div className="border p-4 rounded-md text-center">
      <label
        className={`cursor-pointer border-2 border-dashed p-6 rounded-lg transition ${
          dragActive ? "bg-primary-light text-white" : "hover:bg-primary-light hover:text-white"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p>{dragActive ? "Drop file to upload" : "Click or drag a file here to upload"}</p>
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
        {uploading && <p className="mt-2">Uploading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

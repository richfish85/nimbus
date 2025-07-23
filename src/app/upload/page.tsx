"use client"

import { useState } from "react"
import DashboardLayout from "@/components/DashboardLayout"
import FileUploader from "@/components/FileUploader"
import FileList from "@/components/FileList"

export default function UploadPage() {
  const [viewMode, setViewMode] = useState<"list" | "thumb" | "detail">("list")

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Upload Files</h1>
        <div className="space-x-2 text-sm">
          <button onClick={() => setViewMode("list")} className={buttonStyle(viewMode === "list")}>
            List
          </button>
          <button onClick={() => setViewMode("thumb")} className={buttonStyle(viewMode === "thumb")}>
            Thumbnails
          </button>
          <button onClick={() => setViewMode("detail")} className={buttonStyle(viewMode === "detail")}>
            Details
          </button>
        </div>
      </div>

      <FileUploader onUpload={() => {}} />
      <FileList viewMode={viewMode} />
    </DashboardLayout>
  )
}

function buttonStyle(active: boolean) {
  return `px-3 py-1 rounded border ${
    active ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"
  }`
}

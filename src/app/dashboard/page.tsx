// app/dashboard/page.tsx
"use client"

import FileUploader from "@/components/FileUploader"
import FileList from "@/components/FileList"
import { useState } from "react"

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false)

  return (
    <main className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">Nimbus Dashboard</h1>
      <FileUploader onUpload={() => setRefresh(!refresh)} />
      <FileList key={refresh.toString()} />
    </main>
  )
}

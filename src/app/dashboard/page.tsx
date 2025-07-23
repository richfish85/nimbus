// app/dashboard/page.tsx
"use client"

import DashboardLayout from "@/components/DashboardLayout"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

const PAGE_SIZE = 20

export default function DashboardPage() {
  const [fileStats, setFileStats] = useState({
    files: 0,
    storage: "0 GB",
    lastUpload: "N/A",
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      const userId = userData?.user?.id

      if (userError || !userId) return

      const { data: list, error: listError } = await supabase.storage
        .from("nimbus-uploads")
        .list(userId, { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })

      if (listError || !list) return

      const totalFiles = list.length
      const lastModified = list.reduce((latest, file) => {
        const time = new Date(file.updated_at || file.created_at || "")
        return time > latest ? time : latest
      }, new Date(0))

      setFileStats({
        files: totalFiles,
        storage: `${(totalFiles * 2).toFixed(1)} MB`,
        lastUpload: lastModified.toLocaleString(),
      })

      setHasMore(totalFiles === PAGE_SIZE)
    }

    fetchStats()
  }, [page])

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back to Nimbus</h1>
          <p className="text-gray-600 text-sm">
            Your space is ready. Upload, share, and access your files anytime.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-sm font-semibold text-gray-500 mb-1">Files Uploaded</h2>
            <p className="text-3xl font-bold text-blue-600">{fileStats.files}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-sm font-semibold text-gray-500 mb-1">Storage Used</h2>
            <p className="text-3xl font-bold text-blue-600">{fileStats.storage}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h2 className="text-sm font-semibold text-gray-500 mb-1">Last Upload</h2>
            <p className="text-base text-gray-700">{fileStats.lastUpload}</p>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">Page {page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Upload CTA */}
        <div className="mt-6">
          <a
            href="/upload"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Upload Files
          </a>
        </div>

        {/* Tips / info box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-700">
            ✨ Tip: You can generate shareable download links that expire after a
            certain time. Great for secure, one-time sharing!
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

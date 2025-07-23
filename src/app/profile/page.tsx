"use client"

import DashboardLayout from "@/components/DashboardLayout"
import { useEffect, useState, ChangeEvent } from "react"
import { supabase } from "@/lib/supabaseClient"

/**
 * Types
 */
interface Usage {
  files: number
  bytes: number
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [usage, setUsage] = useState<Usage>({ files: 0, bytes: 0 })
  const [editEmail, setEditEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState<string | null>(null)

  /** Helpers */
  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B"
    const units = ["B", "KB", "MB", "GB", "TB"]
    let i = 0
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024
      i++
    }
    return `${bytes.toFixed(1)} ${units[i]}`
  }

  /** Fetch profile + usage */
  useEffect(() => {
    async function init() {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData.user
      if (!user) return

      setEmail(user.email || "")
      setCreatedAt(new Date(user.created_at!).toLocaleString())
      setAvatarUrl(user.user_metadata?.avatar_url ?? null)

      // storage usage
      const { data: list } = await supabase.storage
        .from("nimbus-uploads")
        .list(user.id, { limit: 1000, offset: 0, sortBy: { column: "name", order: "asc" } })

      if (list) {
        const totalBytes = list.reduce((sum, f) => sum + (f.metadata?.size ?? 0), 0)
        setUsage({ files: list.length, bytes: totalBytes })
      }

      setLoading(false)
    }
    init()
  }, [])

  /** Avatar upload */
  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id
    if (!userId) return

    const fileExt = file.name.split(".").pop()
    const filePath = `${userId}/avatar.${fileExt}`

    await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })
    const { data } = await supabase.storage.from("avatars").getPublicUrl(filePath)

    // save to user_metadata
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
    setAvatarUrl(data.publicUrl)
  }

  /** Email update */
  async function saveEmail() {
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (!error) {
      setEmail(newEmail)
      setEditEmail(false)
      setMsg("Email updated. Please verify via link sent to new address.")
    } else {
      setMsg(error.message)
    }
  }

  /** Password update */
  async function changePassword() {
    if (!password) return
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMsg(error.message)
    else {
      setMsg("Password updated successfully.")
      setPassword("")
    }
  }

  if (loading) return <DashboardLayout><p className="p-6 text-gray-500">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <img
              src={avatarUrl ?? "/avatar-placeholder.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer text-xs">
              ✏️
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-600">Click pencil to change photo</p>
          </div>
        </div>

        {/* Email */}
        <div>
          <h2 className="font-semibold mb-1">Email</h2>
          {editEmail ? (
            <div className="flex items-center gap-2">
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email"
                className="border px-2 py-1 rounded w-full"
              />
              <button onClick={saveEmail} className="px-3 py-1 bg-blue-600 text-white rounded">
                Save
              </button>
              <button onClick={() => setEditEmail(false)} className="text-sm text-gray-600">Cancel</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{email}</span>
              <button onClick={() => { setEditEmail(true); setNewEmail(email) }} className="text-sm text-blue-600">Edit</button>
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <h2 className="font-semibold mb-1">Password</h2>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="border px-2 py-1 rounded w-full"
            />
            <button onClick={changePassword} className="px-3 py-1 bg-blue-600 text-white rounded">
              Update
            </button>
          </div>
        </div>

        {/* Plan & usage */}
        <div>
          <h2 className="font-semibold mb-1">Storage Usage</h2>
          <div className="space-y-1 text-gray-700">
            <p>{usage.files} files</p>
            <p>{formatBytes(usage.bytes)} used of 10 GB (Free Plan)</p>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${Math.min((usage.bytes / (10 * 1024 ** 3)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {createdAt && (
          <div>
            <h2 className="font-semibold mb-1">Member Since</h2>
            <p className="text-gray-700">{createdAt}</p>
          </div>
        )}

        {msg && <p className="text-sm text-green-700">{msg}</p>}
      </div>
    </DashboardLayout>
  )
}

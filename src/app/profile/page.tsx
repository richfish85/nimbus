"use client"

import DashboardLayout from "@/components/DashboardLayout"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePage() {
  const [email, setEmail] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setEmail(data.user.email || "")
        setCreatedAt(new Date(data.user.created_at || "").toLocaleString())
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-2 text-gray-700">
            <div>
              <span className="font-semibold">Email:</span> {email}
            </div>
            <div>
              <span className="font-semibold">Member Since:</span> {createdAt}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

"use client"

import DashboardLayout from "@/components/DashboardLayout"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePage() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || "")
    })
  }, [])

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-700">Email: {email}</p>
    </DashboardLayout>
  )
}

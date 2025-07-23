// components/Navbar.tsx
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
type User = {
  id: string
  email: string | null
  // add other fields as needed
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser()
      setUser(
        data.user
          ? {
              id: data.user.id,
              email: data.user.email ?? null,
              // add other fields as needed
            }
          : null
      )
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Nimbus
      </Link>

      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700 text-sm">
              Hi, {user?.email?.split("@")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-sm hover:underline">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

// components/DashboardLayout.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [user, setUser] = useState<unknown>(null)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace("/auth/login")
      } else {
        setUser(data.user)
      }
    }
    getUser()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="bg-gray-100 w-full md:w-64 p-6 space-y-4">
        <nav className="space-y-2 text-sm">
          <NavItem href="/dashboard" label="Dashboard" current={pathname === "/dashboard"} />
          <NavItem href="/upload" label="Upload" current={pathname === "/upload"} />
          <NavItem href="/profile" label="Profile" current={pathname === "/profile"} />
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 text-sm text-red-600 hover:underline"
        >
          Log out
        </button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

function NavItem({
  href,
  label,
  current,
}: {
  href: string
  label: string
  current: boolean
}) {
  return (
    <Link
      href={href}
      className={`block px-2 py-1 rounded ${
        current ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  )
}

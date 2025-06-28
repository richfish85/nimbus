// components/AuthForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let result
    if (type === "login") {
    result = await supabase.auth.signInWithPassword({ email, password })
    } else {
    result = await supabase.auth.signUp({ email, password })

    // Route to verify page after signup
    if (!result.error) {
        router.push("/auth/verify")
        return
    }
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold">
        {type === "login" ? "Log in to Nimbus" : "Register for Nimbus"}
      </h2>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-4 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
        disabled={loading}
      >
        {loading ? "Please wait..." : type === "login" ? "Log In" : "Sign Up"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}

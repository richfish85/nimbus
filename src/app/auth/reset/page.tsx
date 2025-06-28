"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ResetPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setMessage("Check your email for the reset link.")
  }

  return (
    <form onSubmit={handleReset} className="max-w-sm mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-semibold">Reset your password</h2>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full px-4 py-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Send Reset Email
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}
    </form>
  )
}

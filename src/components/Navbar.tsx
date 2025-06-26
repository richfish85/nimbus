// components/Navbar.tsx
"use client"
import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-primary text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/logo_w.png" alt="Nimbus Logo" width={40} height={40} />
        <span className="text-xl font-heading tracking-wide">nimbus</span>
      </div>
      <Link href="/dashboard" className="hover:underline text-sm">
        Dashboard
      </Link>
    </nav>
  )
}

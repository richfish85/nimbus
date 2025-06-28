// app/page.tsx
import Link from "next/link"
import NimbusHero from "@/components/NimbusHero"


export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero */}
      <NimbusHero />

      {/* Main Content */}
        <section className="text-center py-24 px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                Your Files. Your Space. No Strings.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Secure, simple, and stunning cloud storage — powered by open tools.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-500 transition"
                >
                Log In
                </Link>
                <Link
                href="/auth/register"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md text-lg hover:bg-blue-50 transition"
                >
                Sign Up
                </Link>
            </div>
        </section>


      {/* Features */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <Feature icon="🔒" title="Secure by Default" desc="End-to-end encrypted (or placeholder)." />
          <Feature icon="⚡" title="Fast & Lightweight" desc="No bloat, just storage." />
          <Feature icon="🌙" title="Dark Mode Ready" desc="For those who live in night mode." />
          <Feature icon="🌍" title="Works Anywhere" desc="Access from any device." />
        </div>
      </section>

      {/* Screenshots (Placeholder) */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">A Beautiful Dashboard</h2>
          <p className="text-gray-600 mb-6">Sleek and minimal — just the way you like it.</p>
          <div className="bg-gray-200 h-64 w-full rounded-md shadow-md flex items-center justify-center text-gray-500">
            [Dashboard Screenshot Placeholder]
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-4">Start storing smarter.</h2>
        <p className="text-gray-600 mb-6">No credit card. No nonsense.</p>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-500 transition"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-sm text-gray-500 py-6 text-center">
        © {new Date().getFullYear()} Nimbus by DeepNet. All rights reserved.
      </footer>
    </main>
  )
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  )
}

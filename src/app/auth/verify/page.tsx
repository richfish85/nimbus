export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-gray-600">
          We’ve sent a verification link to your email. Please check your inbox (and spam folder)
          to confirm your account.
        </p>
        <p className="text-sm text-gray-500">
          Once verified, you can log in and access your dashboard.
        </p>
      </div>
    </main>
  )
}

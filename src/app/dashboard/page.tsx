import DashboardLayout from "@/components/DashboardLayout"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome to Nimbus</h1>
      <p className="text-gray-700">
        Ready to store your files? Use the sidebar to navigate.
      </p>
    </DashboardLayout>
  )
}

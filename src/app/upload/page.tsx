"use client"
import DashboardLayout from "@/components/DashboardLayout"
import FileUploader from "@/components/FileUploader"
import FileList from "@/components/FileList"

export default function UploadPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Upload Files</h1>
      <FileUploader onUpload={() => {}} />
      <FileList />
    </DashboardLayout>
  )
}

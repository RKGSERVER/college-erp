import { SkeletonLoader } from "@/components/loading/skeleton-loader"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <SkeletonLoader type="dashboard" />
    </div>
  )
}

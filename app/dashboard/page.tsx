"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import OverallStats from "@/components/dashboard/overall-stats"
import RealtimeChart from "@/components/dashboard/realtime-chart"
import TrendChart from "@/components/dashboard/trend-chart"
import TopMediaList from "@/components/dashboard/top-media-list"

export default function Dashboard() {
  const router = useRouter()
  const [tenantId, setTenantId] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenantId")
    if (!storedTenantId) {
      router.push("/")
    } else {
      setTenantId(storedTenantId)
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Rumex OTT Tenant Media Stat Dashboard</h1>
              <p className="text-muted">Real-time media statistics and insights</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              Refresh Data
            </button>
          </div>

          <OverallStats tenantId={tenantId} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RealtimeChart tenantId={tenantId} />
            <TrendChart tenantId={tenantId} />
          </div>

          <TopMediaList tenantId={tenantId} />
        </div>
      </main>
    </div>
  )
}

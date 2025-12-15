"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import LiveChannelList from "@/components/media/live-channel-list"
import MediaDetail from "@/components/media/media-detail"
import { fetchLiveChannels, type LiveChannel } from "@/lib/ott-api"

export default function LiveChannelsPage() {
  const router = useRouter()
  const [tenantId, setTenantId] = useState("")
  const [channels, setChannels] = useState<LiveChannel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<LiveChannel | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenantId")
    if (!storedTenantId) {
      router.push("/")
    } else {
      setTenantId(storedTenantId)
    }
  }, [router])

  useEffect(() => {
    const loadChannels = async () => {
      setLoading(true)
      try {
        const data = await fetchLiveChannels(page, 10)
        // Filter out items with "Title Not Available" or "not available"
        const filteredChannels = data.content.filter((channel: LiveChannel) => {
             const title = channel.title.titleEn || channel.title.titleSi || channel.title.titleTa || "Untitled"
             const lowerTitle = title.toLowerCase()
             return !lowerTitle.includes("title not available") && !lowerTitle.includes("not available")
        })

        setChannels(filteredChannels)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("Failed to fetch live channels:", err)
      } finally {
        setLoading(false)
      }
    }

    if (tenantId) {
      loadChannels()
    }
  }, [tenantId, page])

  if (loading && page === 0 && channels.length === 0) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Live Channels</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <LiveChannelList
                channels={channels}
                selectedChannel={selectedChannel}
                onSelectChannel={setSelectedChannel}
                page={page}
                onPageChange={setPage}
                totalPages={totalPages}
              />
            </div>
            <div className="lg:col-span-2">
              {selectedChannel ? (
                <MediaDetail
                  mediaId={selectedChannel.id}
                  mediaType="LIVE_CHANNEL"
                  title={
                    selectedChannel.title.titleEn ||
                    selectedChannel.title.titleSi ||
                    selectedChannel.title.titleTa ||
                    "Untitled"
                  }
                  tenantId={tenantId}
                />
              ) : (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <p className="text-muted">Select a channel to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

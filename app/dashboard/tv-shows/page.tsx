"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import TVShowList from "@/components/media/tv-show-list"
import MediaDetail from "@/components/media/media-detail"
import { fetchTVShows, type TVShow } from "@/lib/ott-api"

export default function TVShowsPage() {
  const router = useRouter()
  const [tenantId, setTenantId] = useState("")
  const [shows, setShows] = useState<TVShow[]>([])
  const [selectedShow, setSelectedShow] = useState<TVShow | null>(null)
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
    const loadShows = async () => {
      setLoading(true)
      try {
        const data = await fetchTVShows(page, 10)
        const filteredShows = data.content.filter((show) => {
          const title = show.title.titleEn || show.title.titleSi || show.title.titleTa || "Untitled"
          const lowerTitle = title.toLowerCase()
          return !lowerTitle.includes("title not available") && !lowerTitle.includes("not available")
        })
        setShows(filteredShows)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("Failed to fetch TV shows:", err)
      } finally {
        setLoading(false)
      }
    }

    if (tenantId) {
      loadShows()
    }
  }, [tenantId, page])

  if (loading && page === 0 && shows.length === 0) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">TV Shows</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TVShowList
                shows={shows}
                selectedShow={selectedShow}
                onSelectShow={setSelectedShow}
                page={page}
                onPageChange={setPage}
                totalPages={totalPages}
              />
            </div>
            <div className="lg:col-span-2">
              {selectedShow ? (
                <MediaDetail
                  mediaId={selectedShow.id}
                  mediaType="TV_SHOW"
                  title={selectedShow.title.titleEn || selectedShow.title.titleSi || selectedShow.title.titleTa || "Untitled"}
                  tenantId={tenantId}
                />
              ) : (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <p className="text-muted">Select a TV show to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

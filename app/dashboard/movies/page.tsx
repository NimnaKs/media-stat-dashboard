"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import MovieList from "@/components/media/movie-list"
import MediaDetail from "@/components/media/media-detail"
import { fetchMovies, type Movie } from "@/lib/ott-api"

export default function MoviesPage() {
  const router = useRouter()
  const [tenantId, setTenantId] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
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
    const loadMovies = async () => {
      setLoading(true)
      try {
        const data = await fetchMovies(page, 10)
        const filteredMovies = data.content.filter((movie) => {
          const title = movie.title.titleEn || movie.title.titleSi || movie.title.titleTa || "Untitled"
          const lowerTitle = title.toLowerCase()
          return !lowerTitle.includes("title not available") && !lowerTitle.includes("not available")
        })
        setMovies(filteredMovies)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("Failed to fetch movies:", err)
      } finally {
        setLoading(false)
      }
    }

    if (tenantId) {
      loadMovies()
    }
  }, [tenantId, page])

  if (loading && page === 0 && movies.length === 0) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Movies</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <MovieList
                movies={movies}
                selectedMovie={selectedMovie}
                onSelectMovie={setSelectedMovie}
                page={page}
                onPageChange={setPage}
                totalPages={totalPages}
              />
            </div>
            <div className="lg:col-span-2">
              {selectedMovie ? (
                <MediaDetail
                  mediaId={selectedMovie.id}
                  mediaType="MOVIE"
                  title={selectedMovie.title.titleEn || selectedMovie.title.titleSi || selectedMovie.title.titleTa || "Untitled"}
                  tenantId={tenantId}
                />
              ) : (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <p className="text-muted">Select a movie to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

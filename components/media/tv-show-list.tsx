"use client"

import type { TVShow } from "@/lib/ott-api"

interface TVShowListProps {
  shows: TVShow[]
  selectedShow: TVShow | null
  onSelectShow: (show: TVShow) => void
  page: number
  onPageChange: (page: number) => void
  totalPages: number
}

export default function TVShowList({
  shows,
  selectedShow,
  onSelectShow,
  page,
  onPageChange,
  totalPages,
}: TVShowListProps) {
  const getTitle = (show: TVShow) => {
    return show.title.titleEn || show.title.titleSi || show.title.titleTa || "Untitled"
  }

  const getPoster = (show: TVShow) => {
    const posters = show.posters.filter(
      (p) => p.posterType === "WEB" && p.posterOrientation === "LANDSCAPE" && p.caption === "LANDSCAPE_WITH_TITLE",
    )
    const poster = posters.length > 0 ? posters[posters.length - 1] : null
    return poster?.cdnUrl || poster?.sourceUrl || "/placeholder.png"
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">TV Shows</h2>
        <div className="space-y-2">
          {shows.map((show) => (
            <button
              key={show.id}
              onClick={() => onSelectShow(show)}
              className={`w-full text-left p-2 rounded transition flex items-start gap-3 ${
                selectedShow?.id === show.id ? "bg-primary text-white" : "bg-border hover:bg-border/50 text-foreground"
              }`}
            >
              <img
                src={getPoster(show)}
                alt={getTitle(show)}
                className="w-24 h-14 object-cover rounded border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{getTitle(show)}</p>
                <p className="text-xs opacity-75 truncate">{show.slug}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex-1 px-3 py-2 bg-border hover:bg-primary text-foreground hover:text-white disabled:opacity-50 rounded text-sm font-medium transition"
          >
            ← Prev
          </button>
          <span className="flex items-center justify-center px-2 text-sm text-muted">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="flex-1 px-3 py-2 bg-border hover:bg-primary text-foreground hover:text-white disabled:opacity-50 rounded text-sm font-medium transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

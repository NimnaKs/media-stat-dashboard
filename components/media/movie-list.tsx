"use client"

import type { Movie } from "@/lib/ott-api"

interface MovieListProps {
  movies: Movie[]
  selectedMovie: Movie | null
  onSelectMovie: (movie: Movie) => void
  page: number
  onPageChange: (page: number) => void
  totalPages: number
}

export default function MovieList({
  movies,
  selectedMovie,
  onSelectMovie,
  page,
  onPageChange,
  totalPages,
}: MovieListProps) {
  const getTitle = (movie: Movie) => {
    return movie.title.titleEn || movie.title.titleSi || movie.title.titleTa || "Untitled"
  }

  const getPoster = (movie: Movie) => {
    const posters = movie.posters.filter(
      (p) => p.posterType === "WEB" && p.posterOrientation === "LANDSCAPE" && p.caption === "LANDSCAPE_WITH_TITLE",
    )
    const poster = posters.length > 0 ? posters[posters.length - 1] : null
    return poster?.cdnUrl || poster?.sourceUrl || "/placeholder.png"
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Movies</h2>
        <div className="space-y-2">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className={`w-full text-left p-2 rounded transition flex items-start gap-3 ${
                selectedMovie?.id === movie.id
                  ? "bg-primary text-white"
                  : "bg-border hover:bg-border/50 text-foreground"
              }`}
            >
              <img
                src={getPoster(movie)}
                alt={getTitle(movie)}
                className="w-24 h-14 object-cover rounded border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{getTitle(movie)}</p>
                <p className="text-xs opacity-75 truncate">{movie.slug}</p>
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

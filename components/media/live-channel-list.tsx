"use client"

import type { LiveChannel } from "@/lib/ott-api"

interface LiveChannelListProps {
  channels: LiveChannel[]
  selectedChannel: LiveChannel | null
  onSelectChannel: (channel: LiveChannel) => void
  page: number
  onPageChange: (page: number) => void
  totalPages: number
}

export default function LiveChannelList({
  channels,
  selectedChannel,
  onSelectChannel,
  page,
  onPageChange,
  totalPages,
}: LiveChannelListProps) {
  const getTitle = (channel: LiveChannel) => {
    return channel.title.titleEn || channel.title.titleSi || channel.title.titleTa || "Untitled"
  }

  const getPoster = (channel: LiveChannel) => {
    // Try to find a landscape poster first
    const landscapePosters = channel.posters.filter(
        (p) => p.posterType === "WEB" && p.posterOrientation === "LANDSCAPE"
    )
    
    // If multiple, try to find one with caption BACKGROUND_POSTER, else take the last one
    const backgroundPoster = landscapePosters.find(p => p.caption === "BACKGROUND_POSTER")
    const poster = backgroundPoster || (landscapePosters.length > 0 ? landscapePosters[landscapePosters.length - 1] : null)
    
    // If no landscape, try any poster
    const anyPoster = poster || (channel.posters.length > 0 ? channel.posters[0] : null)

    return anyPoster?.cdnUrl || anyPoster?.sourceUrl || "/placeholder.png"
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Live Channels</h2>
        <div className="space-y-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => onSelectChannel(channel)}
              className={`w-full text-left p-2 rounded transition flex items-start gap-3 ${
                selectedChannel?.id === channel.id
                  ? "bg-primary text-white"
                  : "bg-border hover:bg-border/50 text-foreground"
              }`}
            >
              <img
                src={getPoster(channel)}
                alt={getTitle(channel)}
                className="w-24 h-14 object-cover rounded border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{getTitle(channel)}</p>
                <p className="text-xs opacity-75 truncate">{channel.slug}</p>
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

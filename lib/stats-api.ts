export interface TopMediaItem {
  tenantId: number
  mediaId: number
  mediaType: "MOVIE" | "TV_SHOW"
  totalWatchTime: number
  slug: string
  title: string
}

const BASE_URL = "https://media-stat.rumex.lk"

export async function fetchTopMedia(tenantId: string, mediaType: "MOVIE" | "TV_SHOW", topN = 10): Promise<TopMediaItem[]> {
  const response = await fetch(
    `${BASE_URL}/watch-sessions/top/by-type?tenantId=${tenantId}&topN=${topN}&mediaType=${mediaType}`,
    {
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.7",
        "x-tenant-id": tenantId,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch top media for type ${mediaType}`)
  }

  return response.json()
}

export interface MediaStats {
  totalWatchTime: number
  uniqueUserCount: number
  title: string
  mediaType: string
}

export async function fetchMediaStats(
  tenantId: string,
  mediaId: number,
  mediaType: string,
  params: Record<string, string> = {},
): Promise<MediaStats> {
  const queryParams = new URLSearchParams({
    tenantId,
    mediaId: mediaId.toString(),
    mediaType,
    ...params,
  })

  const response = await fetch(`${BASE_URL}/watch-sessions/combined?${queryParams}`, {
    headers: {
      "X-Tenant-Id": tenantId,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch media stats")
  }

  return response.json()
}

export async function fetchBreakdown(
  tenantId: string,
  mediaId: number,
  mediaType: string,
  breakdownType: "deviceType" | "interfaceType",
  values: string[],
  filters: Record<string, string> = {},
): Promise<{ name: string; uniqueUserCount: number; totalWatchTime: number }[]> {
  const results = await Promise.all(
    values.map(async (value) => {
      try {
        const stats = await fetchMediaStats(tenantId, mediaId, mediaType, {
          [breakdownType]: value,
          ...filters,
        })
        return {
          name: value,
          uniqueUserCount: stats.uniqueUserCount || 0,
          totalWatchTime: stats.totalWatchTime || 0,
        }
      } catch (e) {
        console.error(`Failed to fetch stats for ${breakdownType} ${value}`, e)
        return { name: value, uniqueUserCount: 0, totalWatchTime: 0 }
      }
    }),
  )
  return results.filter((r) => r.uniqueUserCount > 0 || r.totalWatchTime > 0)
}

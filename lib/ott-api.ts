export interface Title {
  titleEn: string
  titleSi: string
  titleTa: string
}

export interface Poster {
  id: number
  sourceUrl: string
  cdnUrl: string
  posterOrientation: string
  posterType: string
  caption: string
}

export interface Genre {
  genreId: number
  genreName: string
}

export interface CastMember {
  id: number
  name: string
  bio: string
  photoUrl: string
  roleCommonResDTO: {
    roleId: number
    roleName: string
  } | null
}

export interface Movie {
  id: number
  title: Title
  slug: string
  description: string
  releaseDate: string
  runtime: string
  genres: Genre[]
  posters: Poster[]
  cast: { priorityNo: number; castMemberCommonResDTO: CastMember }[]
  video: {
    id: number
    title: string
    resolutions: string
    sourceUrl: string
    cdnUrl: string
    conversionStatus: string
  }
}

export interface TVShow {
  id: number
  title: Title
  slug: string
  description: string
  releaseDate: string
  genres: Genre[]
  posters: Poster[]
  tvShowsSeasons: {
    seasonId: number
    name: string
    seasonNo: number
    label: string
  }[]
}

export interface Episode {
  id: number
  title: Title
  slug: string
  description: string
  releaseDate: string
  runtime: string
  episodeNo: number
  seasonNo: number
  posters: Poster[]
  videoId: {
    id: number
    title: string
    resolutions: string
    sourceUrl: string
    cdnUrl: string
    conversionStatus: string
  }
}

export interface PagedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

const BASE_URL = "https://ott-cms-be.rumex.lk"
const TENANT_ID = "100101118"

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : ""
  return {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.7",
    "authorization": `Bearer ${token}`,
    "origin": "https://ott-cms.rumex.com.lk",
    "priority": "u=1, i",
    "referer": "https://ott-cms.rumex.com.lk/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-tenant-id": TENANT_ID,
  }
}

export async function fetchMovies(page = 0, size = 5): Promise<PagedResponse<Movie>> {
  const response = await fetch(`${BASE_URL}/movies/paged?page=${page}&size=${size}`, { headers: getHeaders() })
  if (!response.ok) {
    throw new Error("Failed to fetch movies")
  }
  return response.json()
}

export async function fetchTVShows(page = 0, size = 8): Promise<PagedResponse<TVShow>> {
  const response = await fetch(`${BASE_URL}/tvShows/paged?page=${page}&size=${size}`, { headers: getHeaders() })
  if (!response.ok) {
    throw new Error("Failed to fetch TV shows")
  }
  return response.json()
}

export async function fetchEpisodes(page = 0, size = 6): Promise<PagedResponse<Episode>> {
  const response = await fetch(`${BASE_URL}/episodes/paged?page=${page}&size=${size}`, { headers: getHeaders() })
  if (!response.ok) {
    throw new Error("Failed to fetch episodes")
  }
  return response.json()
}

export async function fetchMovieById(id: number): Promise<Movie> {
  const response = await fetch(`${BASE_URL}/movies/${id}`, { headers: getHeaders() })
  if (!response.ok) {
    throw new Error(`Failed to fetch movie with id ${id}`)
  }
  return response.json()
}

export async function fetchTVShowById(id: number): Promise<TVShow> {
  const response = await fetch(`${BASE_URL}/tvShows/${id}`, { headers: getHeaders() })
  if (!response.ok) {
    throw new Error(`Failed to fetch TV show with id ${id}`)
  }
  return response.json()
}

export async function fetchEpisodeById(id: number): Promise<Episode> {
  const response = await fetch(`${BASE_URL}/episodes/${id}`, { headers: getHeaders() })
  if (!response.ok) {
    throw new Error(`Failed to fetch episode with id ${id}`)
  }
  return response.json()
}

export async function fetchEpisodesByTVShowId(tvShowId: number): Promise<Episode[]> {
  const response = await fetch(`${BASE_URL}/tvShows/${tvShowId}/episodes`, { headers: getHeaders() })
  if (!response.ok) {
    throw new Error(`Failed to fetch episodes for TV show ${tvShowId}`)
  }
  return response.json()
}

export interface LiveChannel {
  id: number
  tenantId: number
  title: Title
  description: string
  slug: string
  cdnUrl: string
  posters: Poster[]
  lcn: number
}

export async function fetchLiveChannels(page = 0, size = 10): Promise<PageResponse<LiveChannel>> {
  const response = await fetch(`${BASE_URL}/live-channels/paged?page=${page}&size=${size}`, {
    headers: getHeaders(),
  })
  if (!response.ok) {
    throw new Error("Failed to fetch live channels")
  }
  return response.json()
}

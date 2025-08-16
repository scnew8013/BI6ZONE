// Movie database API integration with OMDb
export interface Movie {
  id: string
  title: string
  type: "movie" | "tv"
  year: number
  poster: string
  description: string
  imdbId?: string
  rating?: number
  genres?: string[]
}

export interface StreamingProvider {
  id: string
  name: string
  quality: string
  hasAds: boolean
  baseUrl: string
}

// Real streaming providers
export const STREAMING_PROVIDERS: StreamingProvider[] = [
  {
    id: "autoembed",
    name: "AutoEmbed - Ads",
    quality: "HD",
    hasAds: true,
    baseUrl: "https://player.autoembed.cc/embed",
  },
  {
    id: "autoembed-backup",
    name: "AutoEmbed Backup - Ads",
    quality: "HD",
    hasAds: true,
    baseUrl: "https://player.autoembed.cc/embed",
  },
  {
    id: "vidsrc-to",
    name: "VidSrc - 4K",
    quality: "4K",
    hasAds: false,
    baseUrl: "https://vidsrc.to/embed",
  },
  {
    id: "vidsrc-pk",
    name: "VidSrc PK - HD",
    quality: "HD",
    hasAds: false,
    baseUrl: "https://embed.vidsrc.pk",
  },
  {
    id: "vidsrc-cc",
    name: "VidSrc CC - HD",
    quality: "HD",
    hasAds: false,
    baseUrl: "https://vidsrc.cc/v2/embed",
  },
  {
    id: "multiembed",
    name: "MultiEmbed - Ads",
    quality: "HD",
    hasAds: true,
    baseUrl: "https://multiembed.mov/directstream.php",
  },
]

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || "demo_key"
const OMDB_BASE_URL = "https://www.omdbapi.com"

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

// Popular movie titles to fetch (since OMDb doesn't have trending/popular endpoints)
const POPULAR_MOVIES = [
  "Avengers: Endgame",
  "Spider-Man: No Way Home",
  "The Batman",
  "Top Gun: Maverick",
  "Black Panther",
  "Dune",
  "No Time to Die",
  "Fast X",
  "John Wick: Chapter 4",
  "Avatar: The Way of Water",
  "Oppenheimer",
  "Barbie",
  "Guardians of the Galaxy Vol. 3",
  "Indiana Jones and the Dial of Destiny",
  "Mission: Impossible – Dead Reckoning Part One",
  "The Flash",
  "Transformers: Rise of the Beasts",
  "Scream VI",
  "Evil Dead Rise",
  "M3GAN",
]

const POPULAR_TV_SHOWS = [
  "Breaking Bad",
  "Stranger Things",
  "The Office",
  "Game of Thrones",
  "Friends",
  "The Crown",
  "Squid Game",
  "Wednesday",
  "House of the Dragon",
  "The Bear",
  "Succession",
  "The Last of Us",
  "Better Call Saul",
  "Ozark",
  "The Mandalorian",
  "Euphoria",
  "Ted Lasso",
  "Mare of Easttown",
  "The Queen's Gambit",
  "Bridgerton",
]

async function getTMDBPoster(title: string, year: number, type: "movie" | "tv"): Promise<string | null> {
  if (!TMDB_API_KEY) return null

  try {
    const searchType = type === "tv" ? "tv" : "movie"
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`,
    )
    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const posterPath = data.results[0].poster_path
      return posterPath ? `${TMDB_IMAGE_BASE_URL}${posterPath}` : null
    }
  } catch (error) {
    console.error("Error fetching TMDB poster:", error)
  }

  return null
}

async function getPosterUrl(title: string, year: number, type: "movie" | "tv", omdbPoster?: string): Promise<string> {
  // Try TMDB first (no CORS issues)
  const tmdbPoster = await getTMDBPoster(title, year, type)
  if (tmdbPoster) {
    return tmdbPoster
  }

  if (omdbPoster && omdbPoster !== "N/A" && omdbPoster.startsWith("http")) {
    // Use CORS proxy to bypass Amazon's restrictions
    return `https://images.weserv.nl/?url=${encodeURIComponent(omdbPoster)}&w=300&h=400&fit=cover`
  }

  // Fallback to placeholder
  const contentType = type === "tv" ? "TV show" : "movie"
  return `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(title + " " + contentType + " poster")}`
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  try {
    const moviePromises = POPULAR_MOVIES.slice(0, 10).map(async (title) => {
      const response = await fetch(`${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&type=movie`)
      return response.json()
    })

    const tvPromises = POPULAR_TV_SHOWS.slice(0, 10).map(async (title) => {
      const response = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&type=series`,
      )
      return response.json()
    })

    const [movieResults, tvResults] = await Promise.all([Promise.all(moviePromises), Promise.all(tvPromises)])

    const movies: Movie[] = await Promise.all(
      movieResults
        .filter((movie) => movie.Response === "True")
        .map(async (movie: any) => ({
          id: movie.imdbID,
          title: movie.Title,
          type: "movie" as const,
          year: Number.parseInt(movie.Year),
          poster: await getPosterUrl(movie.Title, Number.parseInt(movie.Year), "movie", movie.Poster),
          description: movie.Plot !== "N/A" ? movie.Plot : "No description available",
          imdbId: movie.imdbID,
          rating: movie.imdbRating !== "N/A" ? Number.parseFloat(movie.imdbRating) : undefined,
          genres: movie.Genre !== "N/A" ? movie.Genre.split(", ") : [],
        })),
    )

    const tvShows: Movie[] = await Promise.all(
      tvResults
        .filter((show) => show.Response === "True")
        .map(async (show: any) => ({
          id: show.imdbID,
          title: show.Title,
          type: "tv" as const,
          year: Number.parseInt(show.Year),
          poster: await getPosterUrl(show.Title, Number.parseInt(show.Year), "tv", show.Poster),
          description: show.Plot !== "N/A" ? show.Plot : "No description available",
          imdbId: show.imdbID,
          rating: show.imdbRating !== "N/A" ? Number.parseFloat(show.imdbRating) : undefined,
          genres: show.Genre !== "N/A" ? show.Genre.split(", ") : [],
        })),
    )

    return [...movies, ...tvShows]
  } catch (error) {
    console.error("Error fetching popular content:", error)
    return []
  }
}

export async function searchContent(query: string): Promise<Movie[]> {
  if (!query.trim()) return []

  try {
    const response = await fetch(`${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=1`)
    const data = await response.json()

    if (data.Response === "False") {
      return []
    }

    // Get detailed info for each search result
    const detailPromises = data.Search.slice(0, 10).map(async (item: any) => {
      const detailResponse = await fetch(`${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${item.imdbID}`)
      return detailResponse.json()
    })

    const detailResults = await Promise.all(detailPromises)

    return await Promise.all(
      detailResults
        .filter((item) => item.Response === "True")
        .map(async (item: any) => ({
          id: item.imdbID,
          title: item.Title,
          type: item.Type === "series" ? "tv" : "movie",
          year: Number.parseInt(item.Year) || 0,
          poster: await getPosterUrl(
            item.Title,
            Number.parseInt(item.Year) || 0,
            item.Type === "series" ? "tv" : "movie",
            item.Poster,
          ),
          description: item.Plot !== "N/A" ? item.Plot : "No description available",
          imdbId: item.imdbID,
          rating: item.imdbRating !== "N/A" ? Number.parseFloat(item.imdbRating) : undefined,
          genres: item.Genre !== "N/A" ? item.Genre.split(", ") : [],
        })),
    )
  } catch (error) {
    console.error("Error searching content:", error)
    return []
  }
}

export async function getStreamingUrl(
  contentId: string,
  providerId: string,
  contentType: "movie" | "tv" = "movie",
  season = 1,
  episode = 1,
): Promise<string> {
  const provider = STREAMING_PROVIDERS.find((p) => p.id === providerId)
  if (!provider) {
    return contentType === "movie"
      ? `https://player.autoembed.cc/embed/movie/${contentId}`
      : `https://player.autoembed.cc/embed/tv/${contentId}/${season}/${episode}`
  }

  switch (providerId) {
    case "autoembed":
    case "autoembed-backup":
      return contentType === "movie"
        ? `https://player.autoembed.cc/embed/movie/${contentId}`
        : `https://player.autoembed.cc/embed/tv/${contentId}/${season}/${episode}`
    case "vidsrc-to":
      return contentType === "movie"
        ? `https://vidsrc.to/embed/movie/${contentId}`
        : `https://vidsrc.to/embed/tv/${contentId}/${season}/${episode}`
    case "vidsrc-pk":
      return contentType === "movie"
        ? `https://embed.vidsrc.pk/movie/${contentId}`
        : `https://embed.vidsrc.pk/tv/${contentId}/${season}-${episode}`
    default:
      return contentType === "movie"
        ? `https://player.autoembed.cc/embed/movie/${contentId}`
        : `https://player.autoembed.cc/embed/tv/${contentId}/${season}/${episode}`
  }
}

export async function getTrendingContent(): Promise<Movie[]> {
  try {
    const trendingTitles = [
      "Oppenheimer",
      "Barbie",
      "Spider-Man: Across the Spider-Verse",
      "Guardians of the Galaxy Vol. 3",
      "Fast X",
      "The Little Mermaid",
    ]

    const promises = trendingTitles.map(async (title) => {
      const response = await fetch(`${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`)
      return response.json()
    })

    const results = await Promise.all(promises)

    return await Promise.all(
      results
        .filter((item) => item.Response === "True")
        .map(async (item: any) => ({
          id: item.imdbID,
          title: item.Title,
          type: item.Type === "series" ? "tv" : "movie",
          year: Number.parseInt(item.Year) || 0,
          poster: await getPosterUrl(
            item.Title,
            Number.parseInt(item.Year) || 0,
            item.Type === "series" ? "tv" : "movie",
            item.Poster,
          ),
          description: item.Plot !== "N/A" ? item.Plot : "No description available",
          imdbId: item.imdbID,
          rating: item.imdbRating !== "N/A" ? Number.parseFloat(item.imdbRating) : undefined,
          genres: item.Genre !== "N/A" ? item.Genre.split(", ") : [],
        })),
    )
  } catch (error) {
    console.error("Error fetching trending content:", error)
    return []
  }
}

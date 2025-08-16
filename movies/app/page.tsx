"use client"

import { useState, useEffect } from "react"
import { Search, Play, Clock, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fetchPopularMovies, searchContent, getStreamingUrl, STREAMING_PROVIDERS, type Movie } from "@/lib/movie-api"

interface RecentlyWatched {
  id: number
  title: string
  type: "movie" | "tv"
  poster: string
  watchedAt: string
  progress?: number // percentage watched
  provider?: string
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContent, setSelectedContent] = useState<Movie | null>(null)
  const [selectedProvider, setSelectedProvider] = useState("autoembed")
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [recentlyWatched, setRecentlyWatched] = useState<RecentlyWatched[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [streamingUrl, setStreamingUrl] = useState<string>("")
  const [isLoadingStream, setIsLoadingStream] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)

  useEffect(() => {
    const stored = localStorage.getItem("recentlyWatched")
    if (stored) {
      setRecentlyWatched(JSON.parse(stored))
    }
    loadPopularMovies()
  }, [])

  const loadPopularMovies = async () => {
    try {
      setIsLoading(true)
      const popularMovies = await fetchPopularMovies()
      setMovies(popularMovies)
    } catch (error) {
      console.error("Error loading movies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim()) {
        try {
          setIsSearching(true)
          const results = await searchContent(searchQuery)
          setSearchResults(results)
        } catch (error) {
          console.error("Error searching movies:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }

    const debounceTimer = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    localStorage.setItem("recentlyWatched", JSON.stringify(recentlyWatched))
  }, [recentlyWatched])

  useEffect(() => {
    const loadStreamingUrl = async () => {
      if (selectedContent && isPlayerOpen) {
        try {
          setIsLoadingStream(true)
          console.log(
            "[v0] Loading stream for:",
            selectedContent.title,
            "ID:",
            selectedContent.id,
            "Provider:",
            selectedProvider,
            selectedContent.type === "tv" ? `Season: ${selectedSeason}, Episode: ${selectedEpisode}` : "",
          )
          const url =
            selectedContent.type === "tv"
              ? await getStreamingUrl(
                  selectedContent.id.toString(),
                  selectedProvider,
                  selectedContent.type,
                  selectedSeason,
                  selectedEpisode,
                )
              : await getStreamingUrl(selectedContent.id.toString(), selectedProvider, selectedContent.type)
          console.log("[v0] Generated streaming URL:", url)
          setStreamingUrl(url)
        } catch (error) {
          console.error("Error loading streaming URL:", error)
          setStreamingUrl("")
        } finally {
          setIsLoadingStream(false)
        }
      }
    }

    loadStreamingUrl()
  }, [selectedContent, selectedProvider, isPlayerOpen, selectedSeason, selectedEpisode])

  const displayedContent = searchQuery.trim() ? searchResults : movies

  const handlePlayContent = async (content: Movie) => {
    setSelectedContent(content)
    setIsPlayerOpen(true)
    setStreamingUrl("")
    setSelectedSeason(1)
    setSelectedEpisode(1)

    const watchedItem: RecentlyWatched = {
      id: content.id,
      title: content.title,
      type: content.type,
      poster: content.poster,
      watchedAt: new Date().toISOString(),
      progress: 0,
      provider: selectedProvider,
    }

    setRecentlyWatched((prev) => {
      const filtered = prev.filter((item) => item.id !== content.id)
      return [watchedItem, ...filtered].slice(0, 10)
    })
  }

  const handleContinueWatching = (item: RecentlyWatched) => {
    const content = movies.find((c) => c.id === item.id) || searchResults.find((c) => c.id === item.id)
    if (content) {
      setSelectedContent(content)
      if (item.provider) {
        setSelectedProvider(item.provider)
      }
      setIsPlayerOpen(true)
    }
  }

  const getStreamUrl = async (contentId: number, provider: string, contentType: "movie" | "tv") => {
    return await getStreamingUrl(contentId.toString(), provider, contentType)
  }

  const removeFromRecentlyWatched = (itemId: number) => {
    setRecentlyWatched((prev) => prev.filter((item) => item.id !== itemId))
  }

  const getPosterUrl = (poster: string | undefined, title: string) => {
    console.log("[v0] Poster URL for", title, ":", poster)

    if (poster && poster !== "N/A" && poster !== "" && poster.includes("http")) {
      console.log("[v0] Using OMDb poster:", poster)
      return poster
    }

    const fallbackUrl = `/placeholder.svg?height=480&width=320&query=${encodeURIComponent(title + " movie poster")}`
    console.log("[v0] Using fallback poster for", title, ":", fallbackUrl)
    return fallbackUrl
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">bi6streamz</h1>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
                )}
                <Input
                  placeholder="Search for movies, series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-input border-border"
                />
              </div>
            </div>

            <Button variant={isEditMode ? "default" : "ghost"} size="sm" onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? "Exit Mode" : "Edit Mode"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-6 text-center">
            <span className="text-primary">KEEP</span> <span className="text-foreground">WATCHING</span>
          </h2>

          {recentlyWatched.length === 0 ? (
            <p className="text-muted-foreground text-center">No recently watched items.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {recentlyWatched.slice(0, 6).map((item) => (
                <Card
                  key={`recent-${item.id}`}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card border-border relative"
                  onClick={() => !isEditMode && handleContinueWatching(item)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={getPosterUrl(item.poster, item.title) || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-80 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (!target.src.includes("placeholder.svg")) {
                            console.log("[v0] Poster failed to load for", item.title, "- using fallback")
                            target.src = `/placeholder.svg?height=480&width=320&query=${encodeURIComponent(item.title + " poster")}`
                          } else {
                            console.log("[v0] Placeholder also failed for", item.title, "- using solid color")
                            target.style.backgroundColor = "#1a1a1a"
                            target.style.minHeight = "320px"
                          }
                        }}
                      />
                      {!isEditMode && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                        {item.type.toUpperCase()}
                      </div>
                      <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>RECENT</span>
                      </div>
                      {isEditMode && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromRecentlyWatched(item.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {item.progress && item.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-card-foreground truncate">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Watched {new Date(item.watchedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Content"}
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading content...</span>
            </div>
          ) : displayedContent.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "No results found. Try a different search term." : "No content available."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {displayedContent.map((item) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card border-border"
                  onClick={() => handlePlayContent(item)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={getPosterUrl(item.poster, item.title) || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-80 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (!target.src.includes("placeholder.svg")) {
                            console.log("[v0] Poster failed to load for", item.title, "- using fallback")
                            target.src = `/placeholder.svg?height=480&width=320&query=${encodeURIComponent(item.title + " poster")}`
                          } else {
                            console.log("[v0] Placeholder also failed for", item.title, "- using solid color")
                            target.style.backgroundColor = "#1a1a1a"
                            target.style.minHeight = "320px"
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                        {item.type.toUpperCase()}
                      </div>
                      {item.rating && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                          ⭐ {item.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-card-foreground truncate">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.year}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Now Playing</DialogTitle>
          </DialogHeader>

          {selectedContent && (
            <div className="flex flex-col h-full">
              <div className="mb-4 flex items-center space-x-4 flex-wrap gap-2">
                <span className="text-muted-foreground">Select Provider:</span>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="w-64 bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <div className="p-2 text-sm font-semibold text-primary">Best Providers (No Ads)</div>
                    {STREAMING_PROVIDERS.filter((p) => !p.hasAds).map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                    <div className="p-2 text-sm font-semibold text-muted-foreground">
                      Alternative Providers (Ads May Appear)
                    </div>
                    {STREAMING_PROVIDERS.filter((p) => p.hasAds).map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedContent.type === "tv" && (
                  <>
                    <span className="text-muted-foreground">Season:</span>
                    <Select
                      value={selectedSeason.toString()}
                      onValueChange={(value) => setSelectedSeason(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-20 bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((season) => (
                          <SelectItem key={season} value={season.toString()}>
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-muted-foreground">Episode:</span>
                    <Select
                      value={selectedEpisode.toString()}
                      onValueChange={(value) => setSelectedEpisode(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-20 bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {Array.from({ length: 24 }, (_, i) => i + 1).map((episode) => (
                          <SelectItem key={episode} value={episode.toString()}>
                            {episode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              <div className="flex-1 bg-black rounded-lg overflow-hidden">
                {isLoadingStream ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                    <span className="ml-2 text-white">Loading stream...</span>
                  </div>
                ) : streamingUrl ? (
                  <iframe
                    src={streamingUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={`${selectedContent.title} - ${selectedProvider}${selectedContent.type === "tv" ? ` S${selectedSeason}E${selectedEpisode}` : ""}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-white">Unable to load stream. Please try a different provider.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-muted/10 rounded-lg">
                <h3 className="text-lg font-bold text-card-foreground">{selectedContent.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedContent.year} • {selectedContent.type.toUpperCase()}
                  {selectedContent.type === "tv" && ` • S${selectedSeason}E${selectedEpisode}`}
                  {selectedContent.rating && ` • ⭐ ${selectedContent.rating.toFixed(1)}`}
                </p>
                <p className="text-sm text-card-foreground">{selectedContent.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

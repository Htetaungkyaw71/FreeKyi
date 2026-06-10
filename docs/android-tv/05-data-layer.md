# Data Layer

## Source Mapping From Current Web App

| Current Web File | Android Destination |
| --- | --- |
| `src/types/index.ts` | `core-model` |
| `src/services/tmdb.ts` | `core-network` |
| `src/services/videoServers.ts` | `core-network` or `core-domain` |
| `src/store/slices/bookmarksSlice.ts` | `core-storage` + use case |
| `src/store/slices/watchlistSlice.ts` | `core-storage` + use case |
| `src/pages/Detail.tsx` progress storage | `core-storage` |

## Domain Models

Create Kotlin models that match the current TypeScript shape:

```kotlin
enum class MediaType {
    Movie,
    Tv
}

data class MediaItem(
    val id: Int,
    val title: String,
    val overview: String,
    val posterPath: String?,
    val backdropPath: String?,
    val voteAverage: Double,
    val releaseDate: String?,
    val mediaType: MediaType
)

data class VideoServer(
    val id: String,
    val name: String,
    val embedUrl: String
)
```

## TMDB Client

Create a Retrofit interface:

```kotlin
interface TmdbApi {
    @GET("trending/movie/week")
    suspend fun trendingMovies(@Query("page") page: Int = 1): TmdbResponse<MovieDto>

    @GET("movie/popular")
    suspend fun popularMovies(@Query("page") page: Int = 1): TmdbResponse<MovieDto>

    @GET("tv/popular")
    suspend fun popularTv(@Query("page") page: Int = 1): TmdbResponse<TvDto>

    @GET("movie/{id}")
    suspend fun movieDetails(@Path("id") id: Int): MovieDetailDto

    @GET("tv/{id}")
    suspend fun tvDetails(@Path("id") id: Int): TvDetailDto

    @GET("tv/{id}/season/{seasonNumber}")
    suspend fun seasonDetails(
        @Path("id") id: Int,
        @Path("seasonNumber") seasonNumber: Int
    ): SeasonDetailDto

    @GET("search/multi")
    suspend fun searchMulti(
        @Query("query") query: String,
        @Query("page") page: Int = 1
    ): TmdbResponse<MediaDto>
}
```

Add the API key through an OkHttp interceptor so every request receives:

```text
api_key=<TMDB_API_KEY>
language=en-US
```

## Image URLs

Match the web constants:

```kotlin
object ImageUrls {
    const val Base = "https://image.tmdb.org/t/p"
    const val PosterSmall = "$Base/w342"
    const val PosterMedium = "$Base/w500"
    const val PosterLarge = "$Base/w780"
    const val BackdropMedium = "$Base/w1280"
    const val BackdropLarge = "$Base/original"
}
```

## Video Server URL Builder

Port the current behavior from `src/services/videoServers.ts`.

Rules:

- If a server has a movie or TV template with `{id}`, `{tmdb}`, `{type}`, `{season}`, or `{episode}`, replace tokens.
- Otherwise build path URLs.
- Movie default pattern: `/embed/movie?tmdb={id}`
- TV default pattern: `/embed/tv?tmdb={id}&season={season}&episode={episode}`
- Default season and episode to `1`.

## Local Storage

Use DataStore keys:

```text
bookmarks_json
watchlist_json
last_watched_json
selected_server_id
```

Keep the same 300 item limit as the web app.

## Repository Interfaces

```kotlin
interface MediaRepository {
    suspend fun getHome(): HomeContent
    suspend fun getMovieDetail(id: Int): MovieDetail
    suspend fun getTvDetail(id: Int): TvDetail
    suspend fun getSeasonEpisodes(id: Int, seasonNumber: Int): List<Episode>
    suspend fun search(query: String, page: Int): PagedResult<MediaItem>
}

interface LibraryRepository {
    val bookmarks: Flow<List<MediaItem>>
    val watchlist: Flow<List<MediaItem>>
    suspend fun toggleBookmark(item: MediaItem)
    suspend fun toggleWatchlist(item: MediaItem)
    suspend fun saveProgress(mediaId: Int, season: Int, episode: Int)
}
```

## Error Handling

Use visible TV-friendly states:

- loading skeleton rows
- empty rows
- retry button
- offline message
- server unavailable message before opening WebView

Do not crash the app if one home row fails. Show the other rows.

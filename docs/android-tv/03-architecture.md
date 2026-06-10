# Android Architecture

## Goal

Build a native Android TV app that mirrors the current web product behavior without copying the web implementation.

The Android app should be split by responsibility:

```text
android/
  settings.gradle.kts
  build.gradle.kts

  app-tv/
    src/main/

  app-mobile/                  # Add later if needed
    src/main/

  core-model/
  core-network/
  core-storage/
  core-domain/
  core-ui/
```

## Module Responsibilities

### app-tv

Android TV entry point.

Contains:

- TV launcher manifest
- TV navigation graph
- TV-specific screens
- WebView playback Activity or screen
- remote/back handling

Does not contain:

- Retrofit setup
- raw TMDB DTO mapping
- storage implementation
- shared business logic

### app-mobile

Optional future Android phone app.

Contains:

- phone launcher manifest
- phone navigation graph
- touch-first screens
- phone adaptive layouts

This should reuse the same `core-*` modules as `app-tv`.

### core-model

Shared Kotlin models:

```kotlin
data class Movie(...)
data class TvSeries(...)
data class MovieDetail(...)
data class TvDetail(...)
data class Season(...)
data class Episode(...)
data class Genre(...)
data class VideoServer(...)
```

Keep these close to your existing TypeScript models in `src/types/index.ts`.

### core-network

Network layer:

- TMDB API interface
- DTO models
- DTO-to-domain mapping
- image URL constants
- video server URL builder

Equivalent web files:

- `src/services/tmdb.ts`
- `src/services/videoServers.ts`

### core-storage

Local persistence:

- bookmarks
- watchlist
- last watched TV season/episode
- selected server preference
- simple settings

Start with DataStore. Use Room later only if the data becomes query-heavy.

### core-domain

Use cases that combine network and storage:

- get home rows
- get browse page
- get detail page
- toggle bookmark
- toggle watchlist
- get continue watching
- build embed playback URL

### core-ui

Shared Android UI primitives:

- app theme
- poster image component
- backdrop image component
- rating badge
- loading skeletons
- error states
- focus scaling modifier

TV-specific components can still live in `app-tv` if they are remote-only.

## Data Flow

```text
Screen
  -> ViewModel
  -> UseCase
  -> Repository
  -> Network / Storage
  -> Domain Model
  -> UiState
  -> Compose UI
```

## State Pattern

Each screen should expose one state object:

```kotlin
sealed interface DetailUiState {
    data object Loading : DetailUiState
    data class Ready(
        val detail: MediaDetail,
        val cast: List<CastMember>,
        val recommendations: List<MediaItem>,
        val selectedSeason: Int,
        val selectedEpisode: Int,
        val servers: List<VideoServer>,
        val selectedServerId: String?
    ) : DetailUiState
    data class Error(val message: String) : DetailUiState
}
```

This keeps Compose screens simple and testable.

## Route Map

Map your web routes to Android TV screens:

| Web Route | Android TV Screen |
| --- | --- |
| `/` | HomeScreen |
| `/movies` | BrowseScreen(mediaType = movie) |
| `/tv` | BrowseScreen(mediaType = tv) |
| `/movie/:id` | DetailScreen(mediaType = movie, id) |
| `/tv/:id` | DetailScreen(mediaType = tv, id) |
| `/search` | SearchScreen |
| `/bookmarks` | BookmarksScreen |
| `/watchlist` | WatchlistScreen |
| playback iframe | PlaybackWebViewScreen |

Skip SEO/about/contact/PWA screens in the TV app unless you have a product reason to keep them.

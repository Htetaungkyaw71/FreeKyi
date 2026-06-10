# Android Phone And Android TV Together

## Short Answer

Yes, build Android phone and Android TV together, but separate the UI.

The clean pattern is:

```text
shared data/domain code
  -> phone UI
  -> TV UI
```

Not:

```text
one UI trying to fit phone and TV
```

## Why Separate UI

Phone:

- touch gestures
- portrait-first
- bottom navigation
- small text density
- scroll vertically
- software keyboard

TV:

- D-pad remote
- landscape-only
- left rail or top navigation
- large focus states
- horizontal content rows
- 10-foot viewing distance
- no hover, no touch

Trying to share screens will make both apps worse.

## Recommended Module Setup

```text
android/
  app-tv/
    MainActivity.kt
    navigation/TvNavGraph.kt
    screens/home/TvHomeScreen.kt
    screens/detail/TvDetailScreen.kt

  app-mobile/
    MainActivity.kt
    navigation/MobileNavGraph.kt
    screens/home/MobileHomeScreen.kt
    screens/detail/MobileDetailScreen.kt

  core-model/
  core-network/
  core-storage/
  core-domain/
  core-ui/
```

## Shared Code

Share:

- API models
- repository interfaces
- TMDB client
- video server URL builder
- bookmark/watchlist logic
- image URL helpers
- app theme tokens
- utility formatters

Do not share:

- full screens
- navigation graph
- TV poster row focus behavior
- mobile bottom nav
- WebView playback Activity if mobile needs a different behavior

## Build Variants Alternative

You can also use one `app` module with product flavors:

```kotlin
productFlavors {
    create("mobile") {
        dimension = "device"
    }
    create("tv") {
        dimension = "device"
    }
}
```

But for clean code, separate `app-mobile` and `app-tv` modules are easier to reason about.

## What I Would Do For This Project

Phase 1:

```text
android/app-tv
android/core-model
android/core-network
android/core-storage
android/core-domain
android/core-ui
```

Phase 2:

```text
android/app-mobile
```

This lets you finish the Android TV experience first, then reuse the foundation for phone later.

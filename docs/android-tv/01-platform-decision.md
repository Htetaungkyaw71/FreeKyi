# Platform Decision

## Recommendation

Build a native Android app with Kotlin and Jetpack Compose for TV.

Keep the Android TV app in the same repository as the current React web app, but do not try to reuse the React UI inside the TV app. Reuse the product logic instead:

- TMDB endpoints
- media types
- server URL templates
- bookmark/watchlist behavior
- route concepts
- visual identity

## Decision Summary

| Option | Recommendation | Why |
| --- | --- | --- |
| Native Kotlin + Compose for TV | Choose this | Best Android TV focus, performance, and long-term cleanliness |
| React Native TV | Possible, not first choice | Familiar React mental model, but TV support is community-maintained and still needs TV-specific UI |
| WebView wrapper around existing site | Avoid except prototype | Fastest, but weak TV remote UX, iframe issues, and less app-store quality |
| Flutter | Possible, not needed | Good UI toolkit, but less direct benefit because your current stack is React and Android TV support still needs careful focus work |

## Why Native Is Best Here

Android TV apps are not just bigger phone apps. The main interaction is focus movement with a D-pad remote. Every row, card, button, season selector, search field, and playback control needs a stable focus target.

Compose for TV gives you:

- TV-optimized Material components
- native D-pad focus handling
- smooth poster rows and detail pages
- Android TV launcher integration
- better memory/performance control on TV devices
- a clean path to add an Android phone app later

## What To Share With The Web App

Do not share React components with Android.

Do share the app model:

```text
Movie
TVSeries
MovieDetail
TVDetail
Season
Episode
Genre
VideoServer
FilterState
```

Also share naming and behavior:

- Home rows: trending, popular, top rated, genres
- Browse filters
- Detail page
- Episode selection for TV shows
- Bookmark and watchlist limits
- Server selection
- Continue watching

## What Not To Share

Avoid sharing these directly:

- browser route code
- Tailwind classes
- React components
- Redux slices
- iframe component
- SEO logic
- PWA install prompt

Those are web-specific and will make the Android app messier.

## Final Decision

Use one repo, one Android project, shared Android core modules, and separate TV/mobile app modules.

Start with Android TV only:

```text
android/
  app-tv/
  core-model/
  core-network/
  core-storage/
  core-domain/
  core-ui/
```

Add mobile later:

```text
android/
  app-mobile/
```

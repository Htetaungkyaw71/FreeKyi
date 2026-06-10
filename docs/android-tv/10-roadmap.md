# Android TV Roadmap

## Phase 0: Decisions

- Choose native Kotlin + Compose for TV.
- Keep React web app separate.
- Share product concepts, not React code.
- Use WebView only for playback embeds.

## Phase 1: Android Foundation

- Create Android project under `android/`.
- Add `app-tv`.
- Add `core-model`.
- Add app theme.
- Add TV launcher manifest.
- Run on Android TV emulator.

Done when:

- app launches from Android TV launcher
- first Compose screen renders
- remote can move focus between test buttons/cards

## Phase 2: Data Layer

- Add `core-network`.
- Port TMDB API calls.
- Add DTO/domain models.
- Add image URL helper.
- Add home repository.

Done when:

- Home screen shows real TMDB poster rows
- errors show retry states

## Phase 3: Detail And Episodes

- Add detail repository.
- Build movie detail screen.
- Build TV detail screen.
- Add season selector.
- Add episode selector.

Done when:

- movie Play builds a movie embed URL
- TV Play builds a season/episode embed URL

## Phase 4: Playback

- Add fullscreen WebView playback Activity.
- Add loading/error states.
- Add Back handling.
- Add server selector.
- Save selected server preference.

Done when:

- movie playback opens from real detail data
- TV playback opens with selected episode
- Back exits cleanly

## Phase 5: Search And Library

- Add search screen.
- Add DataStore storage.
- Add bookmarks.
- Add watchlist.
- Add continue watching.

Done when:

- library state survives app restart
- search results navigate to detail

## Phase 6: Polish

- Add skeleton loading.
- Add empty states.
- Improve focus restoration.
- Add TV banner/icon.
- Optimize image sizes.
- Test on real Android TV hardware.

Done when:

- app feels remote-native
- no major focus traps outside WebView playback

## Phase 7: Optional Android Phone App

- Add `app-mobile`.
- Reuse `core-*` modules.
- Build phone-specific Compose screens.
- Decide whether mobile playback also uses WebView or opens an external browser.

Done when:

- TV and phone apps share data/domain modules
- UI code remains separate

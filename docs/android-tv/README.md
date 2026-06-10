# CinemaFlow Android TV App Plan

This folder is the build guide for creating an Android TV app for the existing CinemaFlow/Freekyi React web app.

## Direct Answers

### Can Android TV app and Android phone app be together?

Yes. Build them together in one Android codebase, but keep the UI separated.

Recommended structure:

- Keep this existing React/Vite web app as the web platform.
- Add a new native Android project in the same repo later, for example `android/`.
- Inside the Android project, share data/domain code between phone and TV.
- Keep TV screens and phone screens separate because TV uses D-pad focus, large-screen layouts, and remote-first navigation.

Clean model:

```text
cinemaflow/
  src/                         # Current React web app
  docs/android-tv/             # This planning documentation
  android/                     # Future native Android project
    app-mobile/                # Optional phone app UI
    app-tv/                    # Android TV launcher app
    core-model/
    core-network/
    core-database/
    core-ui/
```

If you only want Android TV now, start with `app-tv` plus the shared `core-*` modules. Add `app-mobile` later.

### Which technology should you use?

Use native Android:

- Kotlin
- Jetpack Compose for TV
- AndroidX TV Material
- Jetpack Navigation
- Retrofit + OkHttp
- Kotlinx Serialization
- Coil for poster/backdrop images
- DataStore first, Room later if you need richer offline storage
- WebView only for the third-party iframe playback screen

This is the best long-term choice for your project because Android TV needs reliable D-pad focus, predictable performance on lower-powered TV hardware, and native launcher/play-store integration.

## Why Not Just React Native?

React Native TV can work, and it is attractive because your current app is React/TypeScript. However, Android TV support is maintained through `react-native-tvos`, a community package. It is useful when you need one JavaScript app for mobile, Apple TV, and Android TV.

For your project, I would not choose it first because:

- You already have a working web app, so the React code does not transfer directly to TV without major UI work.
- TV focus behavior is the most important part of the experience.
- Your playback is iframe-based, so you still need a native WebView or web surface for that part.
- Native Compose gives cleaner Android TV behavior and a stronger future if you later add a phone app.

## Key Playback Decision

Your current web app renders third-party streaming pages inside an iframe. Native Android cannot render an iframe directly in Compose. The Android TV app should use native Compose screens for browsing and details, then open a dedicated fullscreen WebView screen for playback.

If your video provider later gives direct `.m3u8`, DASH, or MP4 URLs, replace the WebView playback screen with AndroidX Media3 ExoPlayer.

## Official References

- Google says Compose for TV is the modern approach for Android TV UI: https://developer.android.com/training/tv/playback/compose
- Compose for TV includes TV-optimized components and D-pad-friendly focus behavior through AndroidX TV Material: https://developer.android.com/training/tv/playback/compose
- React Native TV support exists through the community `react-native-tvos` package: https://github.com/react-native-tvos/react-native-tvos
- Expo also documents TV app support through `react-native-tvos`: https://docs.expo.dev/guides/building-for-tv/

## Document Map

Read in this order:

1. [01-platform-decision.md](./01-platform-decision.md)
2. [02-tech-stack.md](./02-tech-stack.md)
3. [03-architecture.md](./03-architecture.md)
4. [04-project-setup.md](./04-project-setup.md)
5. [05-data-layer.md](./05-data-layer.md)
6. [06-tv-ui-navigation.md](./06-tv-ui-navigation.md)
7. [07-playback-webview.md](./07-playback-webview.md)
8. [08-mobile-and-tv-together.md](./08-mobile-and-tv-together.md)
9. [09-build-test-release.md](./09-build-test-release.md)
10. [10-roadmap.md](./10-roadmap.md)

# Technology Stack

## Chosen Stack

Use this stack for the Android TV app:

| Area | Technology |
| --- | --- |
| Language | Kotlin |
| UI | Jetpack Compose for TV |
| TV components | AndroidX TV Material |
| Architecture | MVVM + clean module boundaries |
| Async | Kotlin coroutines + Flow |
| Network | Retrofit + OkHttp |
| JSON | Kotlinx Serialization |
| Images | Coil |
| Navigation | Jetpack Navigation Compose |
| Persistence | DataStore first, Room later |
| Dependency injection | Hilt or manual DI at first |
| Playback wrapper | Android WebView for iframe/embed pages |
| Future native playback | AndroidX Media3 ExoPlayer |
| Build | Gradle Kotlin DSL |

## Why This Stack

Your app is mostly a streaming catalog:

- fetch media lists
- show poster rows
- open details
- select movie/season/episode
- build third-party embed URLs
- store bookmarks/watchlist
- render playback

Compose for TV is a strong match because it lets you build the UI as reusable declarative components while still getting Android-native focus behavior.

## Recommended Dependencies

Use current stable versions when you create the Android project in Android Studio. The dependency names should look like this:

```kotlin
dependencies {
    implementation(platform("androidx.compose:compose-bom:<latest>"))

    implementation("androidx.activity:activity-compose:<latest>")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")

    implementation("androidx.tv:tv-material:<latest>")
    implementation("androidx.navigation:navigation-compose:<latest>")

    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:<latest>")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:<latest>")

    implementation("com.squareup.retrofit2:retrofit:<latest>")
    implementation("com.squareup.okhttp3:okhttp:<latest>")
    implementation("com.squareup.okhttp3:logging-interceptor:<latest>")

    implementation("io.coil-kt.coil3:coil-compose:<latest>")
    implementation("androidx.datastore:datastore-preferences:<latest>")
}
```

## Optional Later

Add these only when needed:

| Need | Add |
| --- | --- |
| Complex offline cache | Room |
| More complex dependency graph | Hilt |
| Direct HLS/DASH/MP4 playback | Media3 ExoPlayer |
| Deep links from Android TV launcher | App Links / intent filters |
| Account sync | Firebase Auth or your own backend |

## Stack To Avoid For Version 1

Avoid starting with a WebView-only app. It looks fast, but it usually becomes painful on TV:

- remote focus is unpredictable
- web hover/touch behavior does not map cleanly to D-pad
- iframe playback can trap focus
- performance is weaker on cheap Android TV boxes
- app review quality is lower

Use WebView only where you must: the fullscreen third-party embed playback screen.

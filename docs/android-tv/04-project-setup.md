# Project Setup

## Recommended Repo Shape

Keep the current React app where it is. Add Android later under `android/`:

```text
cinemaflow/
  src/
  public/
  package.json
  docs/android-tv/
  android/
```

## Android Studio Setup

1. Install the latest stable Android Studio.
2. Install Android SDK Platform for your target API.
3. Install Android TV emulator image.
4. Create a new Android project using Kotlin and Compose.
5. Move the generated project into `android/`.
6. Convert it into a multi-module project once the first screen works.

## Minimum SDK

Use:

```kotlin
minSdk = 23
targetSdk = latestStable
```

Compose for TV can support older Android TV versions, but `minSdk 23` is a practical baseline for modern TV devices and libraries.

## Android TV Manifest Basics

The TV app module needs a TV launcher entry.

```xml
<uses-feature
    android:name="android.software.leanback"
    android:required="true" />

<uses-feature
    android:name="android.hardware.touchscreen"
    android:required="false" />

<application
    android:banner="@drawable/tv_banner"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name">

    <activity
        android:name=".MainActivity"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
        </intent-filter>
    </activity>
</application>
```

## Environment Values

Your web app currently uses Vite environment values:

```text
VITE_MOVIE_APIKEY
VITE_BASE_URL
VITE_VIDEO_URL
VITE_VIDEO_NAME
VITE_VIDEO_SERVER_1_NAME
VITE_VIDEO_SERVER_1_URL
VITE_VIDEO_SERVER_1_MOVIE_URL
VITE_VIDEO_SERVER_1_TV_URL
VITE_VIDEO_SERVER_3_NAME
VITE_VIDEO_SERVER_3_URL
VITE_VIDEO_SERVER_3_MOVIE_URL
VITE_VIDEO_SERVER_3_TV_URL
```

Android should use Gradle `BuildConfig` values for local development:

```kotlin
buildConfigField("String", "TMDB_API_KEY", "\"...\"")
buildConfigField("String", "TMDB_BASE_URL", "\"https://api.themoviedb.org/3\"")
buildConfigField("String", "VIDEO_BASE_URL", "\"...\"")
```

Do not commit private API keys.

## First Screens To Build

Build in this order:

1. App shell with TV theme
2. Home screen with static fake poster rows
3. TMDB network client
4. Real home rows
5. Detail screen
6. Movie playback WebView
7. TV episode selector
8. TV playback WebView
9. Search
10. Bookmarks and watchlist

This order keeps the focus/navigation problems visible early.

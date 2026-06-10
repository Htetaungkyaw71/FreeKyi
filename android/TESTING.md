# Testing The Android TV App

## What Was Created

The native starter app lives in:

```text
android/
  app-tv/
```

It includes:

- Android TV launcher manifest
- native Kotlin Compose screen
- focusable TV cards and button
- fullscreen WebView playback test screen
- Gradle build setup

## Terminal Setup

Your Android SDK exists here:

```text
/Users/mac/Library/Android/sdk
```

Your terminal does not currently have `adb` or `emulator` on PATH. For this project you can run them with full paths:

```bash
/Users/mac/Library/Android/sdk/platform-tools/adb devices
/Users/mac/Library/Android/sdk/emulator/emulator -list-avds
```

Your normal terminal Java is Java 11, but Android Gradle needs newer Java. Android Studio includes a newer Java runtime. Use:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
```

## Build Debug APK

From the repo root:

```bash
cd android
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
./gradlew :app-tv:assembleDebug
```

Debug APK output:

```text
android/app-tv/build/outputs/apk/debug/app-tv-debug.apk
```

## Install On Connected Device

Connect an Android TV device with USB debugging or network debugging, then:

```bash
/Users/mac/Library/Android/sdk/platform-tools/adb devices
/Users/mac/Library/Android/sdk/platform-tools/adb install -r app-tv/build/outputs/apk/debug/app-tv-debug.apk
```

Launch from the TV launcher as `FreeKyi TV`.

## Test On Emulator

You currently have this emulator:

```text
Pixel_4a_API_34
```

That is a phone emulator, not Android TV. It can test compilation/install, but not real TV launcher behavior.

For proper Android TV testing:

1. Open Android Studio.
2. Open `android/`.
3. Go to Device Manager.
4. Create Device.
5. Choose TV.
6. Pick an Android TV or Google TV image.
7. Start the emulator.
8. Run `app-tv`.

## Build Release APK Later

For website downloads, you need a signed release APK:

```bash
./gradlew :app-tv:assembleRelease
```

Release APK output:

```text
android/app-tv/build/outputs/apk/release/app-tv-release.apk
```

Before public release, configure a real signing key. Do not use debug APKs for public users.
